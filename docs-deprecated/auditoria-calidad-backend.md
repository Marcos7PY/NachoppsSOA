# Auditoria de calidad de codigo backend

Fecha: 2026-05-31

Alcance: servicios backend, e2e backend y librerias compartidas del workspace Nx.

Verificacion usada como linea base:

```powershell
npm exec nx -- run-many -t build -p servicio-notificaciones servicio-inventario servicio-identidad servicio-reportes servicio-reservas servicio-cuentas servicio-pedidos servicio-mesas servicio-caja --outputStyle=static --parallel=3
```

Resultado: los 9 servicios backend compilan correctamente.

## Resumen ejecutivo

El backend tiene una arquitectura razonablemente madura para un sistema distribuido: servicios separados por dominio, contratos compartidos, outbox, RabbitMQ, idempotencia en flujos importantes, uso de transacciones y algunos controles explicitos de concurrencia. La calidad base no esta mal; el sistema muestra intencion arquitectonica.

Los riesgos principales no estan en errores de sintaxis ni en ausencia total de patrones, sino en consistencia y robustez de los puntos criticos:

- Algunos consumidores de eventos pueden perder mensajes ante fallos.
- Algunas operaciones de negocio leen estado fuera de transacciones y luego escriben, abriendo carreras.
- El patron outbox esta duplicado en muchos servicios, con pequenas diferencias que pueden divergir.
- Los contratos de cuentas usan `any[]` justo donde se calculan totales, tickets y division de cuenta.
- Los e2e backend, salvo casos puntuales, no validan comportamiento real del dominio.

Prioridad recomendada:

1. Corregir perdida de eventos en `servicio-pedidos`.
2. Endurecer concurrencia en pagos, cierre de cuentas y stock.
3. Proteger `servicio-reportes` con el mismo patron de auth que el resto.
4. Extraer outbox a una libreria compartida.
5. Fortalecer contratos de dominio y pruebas e2e.

## Hallazgos detallados

### P1. `PagoRegistrado` en pedidos traga errores y evita retry/DLQ

Evidencia:

- `apps/servicio-pedidos/src/app/app.controller.ts:32`
- `apps/servicio-pedidos/src/app/app.controller.ts:36`

El handler de `PagoRegistrado` captura cualquier error con `console.error` y no lo relanza:

```ts
try {
  await this.appService.procesarPagoRecibido(payload);
} catch (error) {
  console.error('Error procesando pago:', error);
}
```

Impacto:

Si falla `procesarPagoRecibido`, el interceptor de RabbitMQ no ve el error. El mensaje se considera procesado, se hace `ack`, no hay retry y no llega a DLQ. Esto puede dejar pedidos sin pasar a `PAGADO` aunque el pago exista.

Como resolver:

- Eliminar el `try/catch` o relanzar despues de loguear.
- Reemplazar `console.error` por `Logger`.
- Cubrir con test de consumidor: si `procesarPagoRecibido` falla, el handler debe rechazar la promesa.

Ejemplo conceptual:

```ts
@EventPattern(RoutingKeys.PagoRegistrado)
async procesarPago(@Payload() payload: PagoRegistradoPayload) {
  await this.appService.procesarPagoRecibido(payload);
}
```

Trade-off:

- Gana confiabilidad: RabbitMQ puede reintentar y mandar a DLQ.
- Puede aumentar ruido operacional si hay errores permanentes, porque ahora se veran retries y DLQ.
- Obliga a monitorear DLQ y alertas, pero ese es el comportamiento correcto para un flujo contable.

### P1. `servicio-caja` hace llamada HTTP dentro de una transaccion con lock

Evidencia:

- `apps/servicio-caja/src/app/app.service.ts:41`
- `apps/servicio-caja/src/app/app.service.ts:42`
- `apps/servicio-caja/src/app/app.service.ts:50`

`registrarPago` abre una transaccion, toma advisory lock por cuenta y dentro llama por HTTP a `servicio-cuentas`.

Impacto:

La transaccion queda abierta mientras depende de red. Si `servicio-cuentas` esta lento o falla, el lock y la conexion DB viven mas tiempo. Bajo carga, esto puede degradar pagos concurrentes y elevar latencia.

Como resolver:

- Mover `fetchCuenta` antes de abrir la transaccion cuando sea posible.
- Dentro de la transaccion, validar contra la proyeccion local o contra el resultado remoto ya obtenido.
- Mantener el advisory lock solo alrededor de la lectura/escritura local de pagos.
- Si se requiere consistencia fuerte con cuentas, considerar un modelo de proyeccion local mas confiable y evitar cold fetch en el camino critico.

Trade-off:

- Mover HTTP fuera reduce locks largos y mejora resiliencia bajo latencia.
- Hay una pequena ventana entre leer la cuenta remota y registrar el pago.
- Para cerrar esa ventana se necesita confiar mas en eventos/proyecciones locales, o usar un endpoint idempotente y transaccional en el servicio dueno de la cuenta.

### P1. `servicio-cuentas` puede cerrar dos veces la misma cuenta bajo concurrencia

Evidencia:

- `apps/servicio-cuentas/src/app/app.service.ts:221`
- `apps/servicio-cuentas/src/app/app.service.ts:222`
- `apps/servicio-cuentas/src/app/app.service.ts:254`
- `apps/servicio-cuentas/src/app/app.service.ts:255`

`cerrarCuenta` lee y valida la cuenta fuera de la transaccion. Luego actualiza por `id`, sin condicionar `estado = ABIERTA`.

Impacto:

Dos cierres concurrentes pueden leer `ABIERTA`, ambos generar `ticketId`, ambos actualizar y ambos emitir eventos `CuentaCerrada` y `TicketGenerado`.

Como resolver:

- Mover la lectura y validacion dentro de la transaccion.
- Usar `updateMany` con condicion `{ id, estado: ABIERTA }` y verificar `count`.
- Generar outbox solo si la transicion de estado realmente ocurrio.
- Opcionalmente agregar un indice/constraint o campo de idempotencia para cierres.

Trade-off:

- Gana atomicidad y evita doble ticket.
- El codigo queda un poco mas explicito y menos lineal.
- Si hay clientes que reintentan cierre, necesitaran manejar `409` o respuesta idempotente. Una alternativa es devolver el ticket existente cuando la cuenta ya esta cerrada.

### P1. Actualizacion manual de stock puede perder cambios concurrentes

Evidencia:

- `apps/servicio-inventario/src/app/app.service.ts:112`
- `apps/servicio-inventario/src/app/app.service.ts:116`
- `apps/servicio-inventario/src/app/app.service.ts:120`

`actualizarStock` lee `stockActual`, calcula `nuevoStock` en memoria y luego hace `update` absoluto.

Impacto:

Dos ajustes simultaneos pueden pisarse. Ejemplo: stock 10, dos reposiciones de +5. Ambas leen 10, ambas escriben 15; el resultado correcto seria 20.

Como resolver:

- Usar operaciones atomicas de Prisma: `increment`/`decrement` donde aplique.
- Para no permitir negativos, usar `updateMany` con condicion `stockActual >= cantidad`.
- En reposiciones y consumos complejos, usar transaccion con advisory lock por producto, igual que ya se hace en `servicio-pedidos`.

Trade-off:

- Las operaciones atomicas son mas seguras y suelen ser mas simples.
- Si se necesita publicar un payload con el stock final, hay que releer despues del update.
- El uso de locks aumenta seguridad pero tambien puede serializar mas operaciones por producto.

### P1. Inventario puede publicar disponibilidad vieja

Evidencia:

- `apps/servicio-inventario/src/app/app.service.ts:181`
- `apps/servicio-inventario/src/app/app.service.ts:182`
- `apps/servicio-inventario/src/app/app.service.ts:189`
- `apps/servicio-inventario/src/app/app.service.ts:198`

Cuando el stock llega a cero, se actualiza `disponible=false`, pero el payload usa `productoDespues?.disponible`, que fue leido antes de ese update.

Impacto:

Consumidores pueden recibir `stockActual: 0` con `disponible: true`. Eso afecta proyecciones locales y decisiones de pedido.

Como resolver:

- Calcular `disponibleFinal` antes del payload.
- O actualizar stock y disponibilidad en una sola operacion.
- O releer el producto despues de aplicar disponibilidad.

Trade-off:

- Calcular el valor final en memoria evita una consulta extra, pero hay que mantener la regla en un solo lugar.
- Releer despues es mas robusto y claro, pero agrega una query.

### P1. `servicio-reportes` no usa el patron comun de autenticacion

Evidencia:

- `apps/servicio-reportes/src/app/app.module.ts:9`
- `apps/servicio-reportes/src/app/app.controller.ts:19`

`servicio-reportes` no importa `SharedAuthModule` ni registra `APP_GUARD`, a diferencia de otros servicios backend. El endpoint `GET /resumen` queda expuesto sin guard.

Impacto:

Inconsistencia de seguridad entre servicios. Un endpoint de metricas de negocio puede quedar consultable sin autenticacion.

Como resolver:

- Importar `SharedAuthModule`.
- Registrar `{ provide: APP_GUARD, useClass: JwtAuthGuard }`.
- Si algun endpoint debe ser publico, definir un decorador explicito `@Public()` en lugar de dejar el modulo completo abierto.

Trade-off:

- Homogeneiza seguridad.
- Puede romper consumidores actuales que llamaban reportes sin token.
- Requiere actualizar pruebas, scripts o dashboards para enviar JWT o token de servicio.

### P2. Reservas tiene transiciones de estado incompletas

Evidencia:

- `apps/servicio-reservas/src/app/reservas.service.ts:79`
- `apps/servicio-reservas/src/app/reservas.service.ts:85`
- `apps/servicio-reservas/src/app/reservas.service.ts:93`
- `libs/contracts/src/events/routing-keys.ts:9`

Existe `ReservaConfirmada` en contratos, pero `confirmar` no emite outbox. Ademas `cancelar` no valida estado actual antes de cancelar.

Impacto:

Otros servicios no pueden reaccionar confiablemente a confirmaciones. Se permite cancelar reservas ya canceladas u otros estados sin explicitar si eso es idempotencia o error.

Como resolver:

- Modelar transiciones permitidas: `PENDIENTE -> CONFIRMADA`, `PENDIENTE/CONFIRMADA -> CANCELADA`.
- Emitir `ReservaConfirmada` dentro de la misma transaccion que cambia el estado.
- Hacer `cancelar` idempotente de forma explicita o devolver conflicto si ya esta cancelada.

Trade-off:

- Mejora claridad de dominio y consistencia por eventos.
- Agrega mas eventos que consumidores deben ignorar o procesar.
- Si se elige idempotencia, las respuestas son mas amables para retries; si se elige conflicto, son mas estrictas para detectar errores de UI/cliente.

### P2. Outbox duplicado en multiples servicios

Evidencia:

- `apps/servicio-caja/src/app/outbox.processor.ts:21`
- `apps/servicio-cuentas/src/app/outbox.processor.ts:21`
- `apps/servicio-identidad/src/app/outbox.processor.ts:21`
- `apps/servicio-inventario/src/app/outbox.processor.ts:21`
- `apps/servicio-mesas/src/app/outbox.processor.ts:21`
- `apps/servicio-pedidos/src/app/outbox.processor.ts:21`
- `apps/servicio-reservas/src/app/outbox.processor.ts:21`

El procesador esta copiado casi igual en varios servicios. Algunas diferencias ya existen: inventario agrega `eventId`, pedidos/inventario purgan `idempotencyKey`, otros no.

Impacto:

La infraestructura critica de eventos puede divergir. Un bug corregido en un servicio puede quedar vivo en otros. Tambien sube el costo de introducir backoff, metricas, lock de procesamiento o trazabilidad.

Como resolver:

- Extraer un `OutboxProcessorBase` o servicio reusable en una lib, por ejemplo `libs/shared-outbox`.
- Parametrizar `producer`, modelo Prisma, retencion, batch size y hook opcional `beforePublish`.
- Mantener tests unitarios para el comportamiento comun.

Trade-off:

- Reduce duplicacion y deriva.
- La abstraccion debe ser cuidadosa para no acoplar demasiado a todos los Prisma clients.
- Una libreria comun mal disenada puede complicar excepciones locales. Conviene extraer solo lo repetido y dejar hooks pequenos.

### P2. Contratos de cuentas usan `any[]` en zona de alto valor

Evidencia:

- `libs/contracts/src/domains/cuentas.ts:40`
- `libs/contracts/src/domains/cuentas.ts:62`
- `apps/servicio-cuentas/src/app/app.service.ts:116`
- `apps/servicio-cuentas/src/app/app.service.ts:296`

`CuentaDto.pedidos` y `TicketDto.items` usan `any[]`. Eso se propaga a casts y reduce seguridad en calculo de totales, tickets y division de cuenta.

Impacto:

Cambios en `PedidoDto` o en items pueden romper cuentas sin que TypeScript avise. Tambien hace mas dificil revisar invariantes como total, comensal, modificadores y precio.

Como resolver:

- Reemplazar `pedidos: any[]` por `PedidoDto[]`.
- Reemplazar `items: any[]` por un tipo de item de ticket, por ejemplo `TicketItemDto`, o reutilizar `PedidoItemDto` si coincide.
- Ajustar `mapToDto`, `dividirCuenta` y `cerrarCuenta` para operar sobre tipos concretos.

Trade-off:

- Mucha mejor mantenibilidad y autocompletado.
- Puede requerir resolver dependencias circulares entre contratos si se importan tipos de pedidos desde cuentas.
- Si el snapshot de cuenta no debe ser exactamente `PedidoDto`, conviene crear un tipo propio `PedidoEnCuentaDto`.

### P2. `servicio-pedidos` concentra demasiadas responsabilidades en `AppService`

Evidencia:

- `apps/servicio-pedidos/src/app/app.service.ts:45`
- `apps/servicio-pedidos/src/app/app.service.ts:66`
- `apps/servicio-pedidos/src/app/app.service.ts:170`
- `apps/servicio-pedidos/src/app/app.service.ts:383`
- `apps/servicio-pedidos/src/app/app.service.ts:514`

El servicio maneja creacion de pedidos, cold-start contra inventario, reglas de stock, outbox, proyecciones locales de mesas/productos, handlers de eventos y mapping DTO.

Impacto:

El archivo funciona, pero el costo de cambio crece. Un ajuste en inventario local puede afectar pedido, pago o eventos. Tambien se vuelve mas dificil probar reglas aisladas.

Como resolver:

- Extraer componentes internos:
  - `PedidoFactory` o `PedidoDomainService` para validar/mapear/calcular total.
  - `ProductoProjectionService` para productos locales.
  - `PedidoStockService` para reserva atomica.
  - `PedidoMapper` real para DTOs.
  - `PedidoPaymentHandler` para `PagoRegistrado`.
- Mantener el `AppService` como orquestador fino.

Trade-off:

- Mejora testabilidad y lectura.
- Aumenta numero de archivos/clases.
- Si se extrae demasiado pronto, puede aparecer abstraccion ceremonial. Conviene hacerlo alrededor de responsabilidades que ya tienen tests o reglas claras.

### P2. `servicio-cuentas` mezcla agregado de cuenta con snapshot JSON no tipado

Evidencia:

- `apps/servicio-cuentas/src/app/app.service.ts:94`
- `apps/servicio-cuentas/src/app/app.service.ts:116`
- `apps/servicio-cuentas/src/app/app.service.ts:127`
- `apps/servicio-cuentas/src/app/app.service.ts:231`
- `apps/servicio-cuentas/src/app/app.service.ts:319`

La cuenta mantiene pedidos como array JSON y recalcula totales desde ese snapshot. La estrategia es valida para una proyeccion, pero esta poco encapsulada y muy dependiente de `any`.

Impacto:

El agregado de cuenta queda fragil ante cambios de forma de pedido. Reglas como deduplicacion, total, ticket y division estan repartidas dentro del mismo servicio.

Como resolver:

- Introducir tipo `PedidoEnCuenta`.
- Encapsular operaciones del snapshot: `addOrUpdatePedido`, `recalcularTotal`, `crearTicket`, `dividirPorItems`.
- Evaluar si el snapshot JSON sigue siendo suficiente o si conviene normalizar `CuentaPedido`/`CuentaItem`.

Trade-off:

- Encapsular mantiene el modelo actual y reduce riesgo sin migracion DB.
- Normalizar mejora queries e integridad, pero requiere migraciones y mas codigo.
- Para una fase incremental, primero tipar y encapsular; migrar DB solo si el dominio crece.

### P2. E2E backend mayormente son pruebas generadas, no pruebas de calidad real

Evidencia:

- `apps/servicio-caja-e2e/src/servicio-caja/servicio-caja.spec.ts:3`
- `apps/servicio-cuentas-e2e/src/servicio-cuentas/servicio-cuentas.spec.ts:3`
- `apps/servicio-identidad-e2e/src/servicio-identidad/servicio-identidad.spec.ts:3`
- `apps/servicio-pedidos-e2e/src/servicio-pedidos/servicio-pedidos.spec.ts:3`

La mayoria espera `GET /api -> { message: 'Hello API' }`, lo cual no representa los contratos reales. `servicio-pedidos-e2e` si tiene pruebas de validation pipe y DLQ.

Impacto:

Los e2e pueden estar verdes y aun asi no cubrir login, crear mesa, abrir cuenta, crear pedido, pagar, cerrar cuenta, liberar mesa, descontar stock o generar reporte.

Como resolver:

- Reemplazar pruebas generadas por flujos reales por servicio.
- Priorizar invariantes:
  - identidad: login, rol admin, token invalido.
  - mesas: crear, ocupar, liberar, conflicto de estado.
  - inventario: stock atomico, producto no disponible.
  - pedidos: creacion, stock insuficiente, pago recibido.
  - cuentas: dedup de pedido, cierre idempotente/concurrente.
  - caja: pago insuficiente, pago exacto, duplicado.
  - reservas: doble reserva mismo slot.
  - reportes: registra venta una sola vez.
- Agregar pruebas de concurrencia selectivas para stock, cierre y pago.

Trade-off:

- Suben confianza y detectan regresiones reales.
- Son mas lentas y requieren fixtures/ambiente estable.
- Conviene separar smoke e2e rapidos de pruebas de resiliencia/concurrencia.

### P3. Uso extendido de casts `as unknown as` y `any`

Evidencia:

- `apps/servicio-inventario/src/app/app.service.ts:51`
- `apps/servicio-mesas/src/app/app.service.ts:16`
- `libs/shared-prisma/src/lib/base-prisma.service.ts:5`
- `libs/shared-auth/src/lib/jwt.strategy.ts:26`

Algunos `any` son razonables por limitaciones de genericos Prisma/Nest, pero otros reemplazan mappers explicitos.

Impacto:

El compilador deja de proteger conversiones entre Prisma Decimal, enums y DTOs. Los errores pasan a runtime.

Como resolver:

- Crear mappers pequenos por dominio (`toProductoDto`, `toMesaDto`, etc.).
- Tipar payload JWT con una interfaz `JwtPayload`.
- Mantener `any` solo en bordes inevitables y documentarlos.

Trade-off:

- Mas codigo boilerplate.
- Menos casts y menos sorpresas.
- Mejor documentacion viva del contrato externo.

### P3. Observabilidad y retry funcionan, pero tienen puntos mejorables

Evidencia:

- `libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:41`
- `libs/observabilidad/src/lib/metrics.interceptor.ts:57`
- `libs/observabilidad/src/lib/tracing.ts:21`

El retry interceptor hace ack/nack y backoff. Metrics usa exchange como fallback de queue. Tracing usa `console.log` en shutdown.

Impacto:

No es un bug funcional inmediato, pero limita diagnostico fino. En incidentes, etiquetas de queue imprecisas o logs fuera de `Logger` pueden dificultar correlacion.

Como resolver:

- Incluir nombre real de cola en headers/config si esta disponible.
- Usar `Logger` en tracing.
- Agregar metricas de outbox: pending, failed, attempts, age del evento mas viejo.

Trade-off:

- Mas senales operativas.
- Mas cardinalidad potencial en metricas si se etiquetan demasiadas dimensiones.
- Hay que definir convenciones para evitar dashboards ruidosos.

## Acciones recomendadas por fase

### Fase 1: correcciones de riesgo alto

1. Quitar el swallow de errores en `servicio-pedidos` para `PagoRegistrado`.
2. Hacer atomico el cierre de cuenta.
3. Corregir stock concurrente y payload de disponibilidad en inventario.
4. Mover llamada HTTP fuera de la transaccion de caja.
5. Proteger `servicio-reportes` con `SharedAuthModule` y `JwtAuthGuard`.

Resultado esperado: menos riesgo de perdida de eventos, doble cierre, stock incorrecto y endpoints inconsistentes.

### Fase 2: consistencia arquitectonica

1. Extraer outbox comun.
2. Tipar contratos de cuentas.
3. Separar responsabilidades grandes en `servicio-pedidos` y `servicio-cuentas`.
4. Normalizar binding de RabbitMQ usando `RoutingKeys` en todos los modulos.

Resultado esperado: menor duplicacion, menor deriva entre servicios y cambios mas seguros.

### Fase 3: calidad verificable

1. Reemplazar e2e generados por flujos reales.
2. Agregar pruebas de concurrencia enfocadas.
3. Agregar umbrales minimos de cobertura para reglas criticas.
4. Cablear targets Nx de `test` y `lint` para todos los proyectos backend/libs.

Resultado esperado: la calidad deja de depender de inspeccion manual y empieza a estar protegida por CI.

## Matriz de trade-offs globales

| Decision | Beneficio | Costo / trade-off |
| --- | --- | --- |
| Relanzar errores en consumidores RabbitMQ | Reintentos y DLQ reales | Mas mensajes en DLQ si hay errores permanentes |
| Transiciones atomicas con `updateMany` condicional | Evita doble cierre/pagos/estados | Codigo menos lineal y mas manejo de conflictos |
| Mover HTTP fuera de transacciones | Menos locks largos | Ventana de frescura entre lectura remota y escritura local |
| Extraer outbox comun | Menos duplicacion y deriva | Diseno de abstraccion debe cuidar variaciones por servicio |
| Tipar snapshots de cuenta | Mejor seguridad y mantenibilidad | Requiere tocar contratos y mappers |
| E2E reales | Confianza sobre negocio | Mas tiempo de ejecucion y setup |
| Auth uniforme en reportes | Seguridad consistente | Clientes internos deben enviar token |

## Conclusion

El backend esta en buen punto para endurecer calidad: ya existen los patrones correctos, pero algunos estan aplicados de forma desigual. La mejora de mayor retorno no es una reescritura, sino cerrar inconsistencias en los caminos criticos: eventos, transacciones, stock, auth y contratos.

Una ruta prudente es corregir primero los P1, luego extraer outbox y tipar cuentas. Despues conviene convertir los e2e generados en pruebas de flujo real, porque ahi se vuelve sostenible mantener la calidad sin depender de auditorias manuales.
