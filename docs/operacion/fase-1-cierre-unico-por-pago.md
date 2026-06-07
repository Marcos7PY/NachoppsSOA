# Fase 1: cierre unico de cuenta por pago

## 1. Proposito

Este documento define el plan de implementacion para establecer una unica regla de negocio:

> Una cuenta solo puede cerrarse como consecuencia de un pago completo registrado en `servicio-caja`.

La fase elimina el cierre directo iniciado desde `servicio-cuentas` o desde la PWA. El flujo normal y unico sera:

```text
PWA
  -> POST /caja/pagos
  -> servicio-caja valida y registra la transaccion
  -> servicio-caja publica pago.registrado mediante outbox
  -> servicio-cuentas valida el evento y cierra la cuenta
  -> servicio-cuentas genera ticket y publica cuenta.cerrada
  -> servicio-mesas libera la mesa asociada
  -> servicio-pedidos marca los pedidos como pagados
  -> servicio-reportes registra la venta
```

No se implementaran en esta fase:

- Versionado de cuentas.
- Estado `COBRO_EN_PROCESO`.
- Checkout/orquestador adicional.
- Pagos parciales o mixtos.
- Descuentos.
- Cierre manual, cierre forzado o reconciliacion administrativa.
- Integraciones automaticas con POS, Yape, Plin o SUNAT.

## 2. Estado actual

### 2.1 Flujo correcto existente

Actualmente ya existe gran parte del flujo objetivo:

1. La PWA registra un pago mediante `POST /caja/pagos`.
2. `servicio-caja` consulta la cuenta remota en `servicio-cuentas`.
3. Caja valida que el pago cubra exactamente el total.
4. Caja guarda una `Transaccion`.
5. Caja guarda un evento outbox `pago.registrado`.
6. `servicio-cuentas` consume `pago.registrado`.
7. Cuentas cierra la cuenta, genera ticket y publica:
   - `cuenta.cerrada`
   - `ticket.generado`
8. Mesas consume `cuenta.cerrada` y libera la mesa.
9. Reportes consume `cuenta.cerrada` y registra la venta.
10. Pedidos consume `pago.registrado` y marca pedidos como pagados.

### 2.2 Camino alternativo existente

Actualmente tambien existe:

```http
POST /cuentas/:id/cerrar
```

Este endpoint:

- Puede ser invocado directamente desde la PWA.
- No comprueba que exista un pago registrado.
- Acepta un descuento.
- Cambia la cuenta a `CERRADA`.
- Genera ticket.
- Publica `cuenta.cerrada`.
- Libera la mesa y registra la venta.

Este camino permite cerrar una cuenta y registrar una venta sin una transaccion en Caja.

### 2.3 Problemas concretos

1. La PWA muestra dos acciones que compiten:
   - `Registrar pago`.
   - `Cobrar y cerrar cuenta`.
2. Un usuario puede cerrar una cuenta sin pagarla.
3. Caja admite multiples filas `Transaccion` para una misma cuenta a nivel de esquema.
4. `servicio-cuentas` cierra al recibir `pago.registrado` sin validar monto ni mesa.
5. Un evento antiguo `cuenta.cerrada` podria liberar una mesa asociada posteriormente a otra cuenta.
6. La PWA muestra exito de pago antes de confirmar que el cierre asincrono termino.
7. El campo descuento de la PWA no es compatible con la validacion actual de Caja.

## 3. Decisiones de diseno

### 3.1 Unica entrada de pago

La unica operacion HTTP que puede iniciar el cierre sera:

```http
POST /caja/pagos
```

### 3.2 Unico pago por cuenta

Esta fase considera que una cuenta se paga en una sola transaccion completa.

```text
Una cuenta -> una transaccion -> un cierre
```

No se soportaran inicialmente:

- Division de pago.
- Pago parcial.
- Pago mixto.
- Propina incluida en la transaccion.

### 3.3 Significado de `montoRecibido`

En backend, `montoRecibido` representara el monto aplicado a la cuenta y debe coincidir exactamente con el total.

Para efectivo, la PWA puede calcular visualmente:

```text
dinero entregado - total = vuelto
```

Pero enviara a Caja solamente el total aplicado a la cuenta.

### 3.4 Consistencia eventual

El pago se registra primero en Caja. El cierre ocurre despues mediante RabbitMQ.

Puede existir temporalmente este estado:

```text
Pago registrado en Caja + cuenta todavia ABIERTA
```

Esto no autoriza un segundo pago. El evento permanece en outbox y debe cerrar la cuenta cuando RabbitMQ se recupere.

## 4. Flujo objetivo detallado

### 4.1 Registro del pago

La PWA envia:

```http
POST /caja/pagos
Content-Type: application/json
```

```json
{
  "cuentaId": "uuid-cuenta",
  "montoRecibido": 50,
  "metodo": "EFECTIVO"
}
```

`servicio-caja`:

1. Consulta la cuenta en `servicio-cuentas`.
2. Verifica que exista.
3. Verifica que su estado sea `ABIERTA`.
4. Verifica que `montoRecibido` coincida exactamente con `cuenta.total`.
5. Adquiere el lock actual por `cuentaId`.
6. Verifica que no exista una transaccion previa.
7. Crea la transaccion.
8. Crea el evento outbox `pago.registrado`.
9. Confirma ambos cambios en la misma transaccion PostgreSQL.

### 4.2 Evento de pago

Payload esperado:

```json
{
  "transaccionId": "uuid-transaccion",
  "cuentaId": "uuid-cuenta",
  "mesaId": "uuid-mesa",
  "monto": 50,
  "metodo": "EFECTIVO"
}
```

### 4.3 Cierre de cuenta

`servicio-cuentas` consume `pago.registrado` y:

1. Busca la cuenta por `payload.cuentaId`.
2. Si no existe, registra advertencia y rechaza el procesamiento.
3. Si ya esta cerrada, trata el evento como duplicado y termina sin generar otro ticket.
4. Verifica que la cuenta este `ABIERTA`.
5. Verifica que `payload.mesaId` coincida con `cuenta.mesaId`.
6. Verifica que `payload.monto` coincida con `cuenta.total`.
7. Verifica que la cuenta tenga pedidos.
8. Cambia la cuenta a `CERRADA` mediante actualizacion condicional.
9. Genera un ticket.
10. Crea en outbox:
    - `cuenta.cerrada`
    - `ticket.generado`

El cambio de estado, ticket y eventos deben pertenecer a la misma transaccion.

### 4.4 Efectos posteriores

`cuenta.cerrada` provoca:

- `servicio-mesas`: libera solamente la mesa que siga asociada a esa cuenta.
- `servicio-reportes`: registra la venta mediante `upsert` por `cuentaId`.
- `servicio-caja`: actualiza su proyeccion local de cuenta.
- `servicio-notificaciones`: persiste y emite la actualizacion por WebSocket.

`pago.registrado` provoca:

- `servicio-pedidos`: marca como pagados los pedidos activos correspondientes.

## 5. Cambios por componente

## 5.1 Contratos compartidos

Archivos principales:

- `libs/contracts/src/domains/caja.ts`
- `libs/contracts/src/domains/cuentas.ts`
- `libs/contracts/src/index.ts`

### Cambios

1. Endurecer `PagarPedidoCommand`:

```ts
export class PagarPedidoCommand {
  @IsUUID()
  cuentaId: string;

  @IsNumber()
  @IsPositive()
  montoRecibido: number;

  @IsEnum(MetodoPago)
  metodo: MetodoPago;
}
```

2. Endurecer `PagoRegistradoPayload`:

```ts
export class PagoRegistradoPayload {
  @IsUUID()
  transaccionId: string;

  @IsUUID()
  cuentaId: string;

  @IsUUID()
  mesaId: string;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsEnum(MetodoPago)
  metodo: MetodoPago;
}
```

3. Dejar de usar `CerrarCuentaCommand` como contrato HTTP publico.

`CerrarCuentaCommand` puede eliminarse si ninguna otra funcion lo necesita. Si se conserva temporalmente durante la migracion, debe marcarse como interno/deprecado y eliminarse al finalizar la fase.

## 5.2 Servicio Caja

Archivos principales:

- `apps/servicio-caja/prisma/schema.prisma`
- `apps/servicio-caja/prisma/migrations/...`
- `apps/servicio-caja/src/app/app.service.ts`
- `apps/servicio-caja/src/app/app.controller.ts`
- `apps/servicio-caja/src/app/app.service.spec.ts`

### Cambios de esquema

Cambiar:

```prisma
cuentaId String
```

por:

```prisma
cuentaId String @unique
```

Eliminar el indice redundante:

```prisma
@@index([cuentaId])
```

La restriccion unica sera la ultima defensa contra pagos duplicados concurrentes.

### Revision previa a migracion

Antes de aplicar el indice unico:

```sql
SELECT "cuentaId", COUNT(*)
FROM transacciones
GROUP BY "cuentaId"
HAVING COUNT(*) > 1;
```

Si devuelve filas, deben revisarse y resolverse antes de aplicar la migracion.

### Cambios de servicio

Actualizar `registrarPago()`:

1. Mantener consulta remota a Cuentas.
2. Mantener validacion de estado `ABIERTA`.
3. Reemplazar la logica acumulativa de pagos por validacion de pago unico:

```text
montoRecibido debe ser exactamente igual a cuenta.total
```

4. Bajo el lock:
   - Buscar transaccion por `cuentaId`.
   - Si existe, devolver `409 Conflict`.
   - Crear transaccion.
   - Crear evento outbox.
5. Capturar conflicto Prisma `P2002` y traducirlo a:

```http
409 Conflict
```

```json
{
  "message": "La cuenta ya fue pagada"
}
```

### Comportamiento esperado

| Caso | Respuesta |
|---|---|
| Cuenta abierta y monto exacto | `201/200`, pago registrado |
| Cuenta inexistente | `404` |
| Cuenta no abierta | `400/409` |
| Monto menor | `400` |
| Monto mayor | `400` |
| Cuenta ya pagada | `409` |
| Cuentas no disponible | `503` |

## 5.3 Servicio Cuentas

Archivos principales:

- `apps/servicio-cuentas/src/app/app.controller.ts`
- `apps/servicio-cuentas/src/app/app.service.ts`
- `apps/servicio-cuentas/src/app/events.controller.ts`
- `apps/servicio-cuentas/src/app/app.service.spec.ts`

### Eliminar endpoint directo

Eliminar del controlador:

```ts
@Post(':id/cerrar')
cerrarCuenta(...)
```

El resultado esperado es que:

```http
POST /cuentas/:id/cerrar
```

devuelva `404`.

### Convertir cierre en operacion interna

Renombrar:

```ts
cerrarCuenta(...)
```

a:

```ts
private cerrarCuentaPorPago(...)
```

Este metodo no recibira descuento. Usara siempre:

```text
total ticket = cuenta.total
descuento = 0
```

Solo podra llamarse desde `procesarPagoRegistrado()`.

### Validar evento antes del cierre

Actualizar `procesarPagoRegistrado()`:

```text
cuenta existe
cuenta esta ABIERTA
payload.cuentaId coincide
payload.mesaId coincide
payload.monto coincide exactamente con cuenta.total
cuenta contiene pedidos
```

El cierre debe seguir usando:

- `Prisma.Decimal`.
- Actualizacion condicional para evitar doble cierre.
- Ticket generado una sola vez.
- Outbox transaccional.

### Evento duplicado

Si llega nuevamente el mismo `pago.registrado` y la cuenta ya esta cerrada:

- No lanzar un error reintentable.
- No generar otro ticket.
- No crear otros eventos.
- Registrar que el evento fue ignorado por idempotencia natural.

## 5.4 Servicio Mesas

Archivos principales:

- `apps/servicio-mesas/src/app/events.controller.ts`
- `apps/servicio-mesas/src/app/app.service.ts`
- `apps/servicio-mesas/src/app/events.controller.spec.ts`

### Cambio

Antes de liberar una mesa al recibir `cuenta.cerrada`, verificar:

```text
mesa.cuentaAsociada === payload.cuentaId
```

Si no coincide:

- No liberar la mesa.
- Registrar advertencia.
- Tratar el evento como antiguo o no aplicable.

Esto evita que un evento retrasado libere una mesa que ya pertenece a otra cuenta.

### Implementacion recomendada

Crear una operacion especifica en el servicio:

```ts
liberarMesaPorCuenta(mesaId: string, cuentaId: string)
```

La actualizacion debe ser condicional:

```text
WHERE id = mesaId AND cuentaAsociada = cuentaId
```

## 5.5 Servicio Pedidos

Archivos principales:

- `apps/servicio-pedidos/src/app/app.controller.ts`
- `apps/servicio-pedidos/src/app/app.service.ts`
- `apps/servicio-pedidos/src/app/app.service.spec.ts`

### Cambio

Mantener el consumidor de `pago.registrado`.

Actualizar solamente pedidos cuyo estado no sea:

- `PAGADO`
- `CANCELADO`

La repeticion del evento no debe producir efectos adicionales.

Limitacion aceptada de esta fase:

- Los pedidos se buscan por `mesaId`.
- No se incluyen IDs de pedidos en `pago.registrado`.

Esta limitacion es aceptable mientras exista una sola cuenta abierta por mesa y no se permita agregar pedidos despues del pago.

## 5.6 Servicio Reportes

Archivos principales:

- `apps/servicio-reportes/src/app/app.controller.ts`
- `apps/servicio-reportes/src/app/app.service.ts`
- `apps/servicio-reportes/src/app/app.service.spec.ts`

### Cambio

No requiere cambio funcional principal.

Debe añadirse una prueba explicita que confirme que dos eventos `cuenta.cerrada` con el mismo `cuentaId` no duplican la venta. El `upsert` actual por `cuentaId` ya ofrece esta proteccion.

## 5.7 PWA Cliente

Archivos principales:

- `apps/pwa-cliente/src/screens/caja/CobroMesaDrawer.tsx`
- `apps/pwa-cliente/src/hooks/queries/useCuentasQuery.ts`
- `apps/pwa-cliente/src/api/cuentas.api.ts`
- Pruebas asociadas de API, hooks y componentes.

### Eliminar

- Campo de descuento.
- Calculo de total descontado.
- Boton `Registrar pago`.
- Boton `Cobrar y cerrar cuenta`.
- Metodo `cuentasApi.cerrar()`.
- Mutacion `cerrar` de `useCuentasQuery`.
- Estado y feedback asociado al cierre directo.

### Añadir

Un unico boton:

```text
Confirmar cobro de S/ X
```

Al pulsarlo:

1. La PWA llama a `POST /caja/pagos`.
2. Si responde correctamente, muestra:

```text
Pago registrado. Finalizando cuenta...
```

3. Refresca la cuenta o espera la invalidacion por WebSocket.
4. Solo muestra exito final cuando la cuenta deja de estar abierta.
5. Si recibe `409`, refresca la cuenta y evita otro pago.
6. Si el evento tarda, mantiene el mensaje de cierre pendiente sin repetir el pago.

### Metodos de pago

Los metodos permanecen como registro manual:

- Efectivo.
- Tarjeta.
- Yape.
- Plin.
- Transferencia.

Seleccionar un metodo significa que el cajero confirma manualmente haber recibido el pago. No implica conciliacion automatica.

## 6. Secuencia de implementacion

### Etapa 1: contratos y pruebas base

1. Endurecer contratos de Caja.
2. Ajustar unit tests afectados.
3. Construir `contracts`, `servicio-caja` y `servicio-cuentas`.

### Etapa 2: pago unico en Caja

1. Auditar duplicados en la base de datos.
2. Añadir `@unique` a `Transaccion.cuentaId`.
3. Crear migracion Prisma.
4. Simplificar `registrarPago`.
5. Manejar conflicto `P2002`.
6. Añadir pruebas unitarias y de concurrencia.

### Etapa 3: cierre interno en Cuentas

1. Eliminar endpoint `POST /:id/cerrar`.
2. Eliminar descuento del cierre.
3. Hacer interno el cierre por pago.
4. Validar monto y mesa del evento.
5. Hacer idempotente el evento duplicado.
6. Añadir pruebas.

### Etapa 4: consumidores

1. Proteger liberacion de mesa.
2. Confirmar idempotencia en Pedidos.
3. Confirmar idempotencia en Reportes.
4. Añadir pruebas de consumidores.

### Etapa 5: PWA

1. Eliminar cierre directo y descuento.
2. Añadir unico boton.
3. Implementar estado de cierre pendiente.
4. Refrescar hasta confirmar cierre.
5. Añadir pruebas de componente y Playwright.

### Etapa 6: integracion y despliegue

1. Ejecutar build, lint y tests con Nx.
2. Aplicar migracion.
3. Reconstruir imagenes Docker.
4. Levantar stack.
5. Ejecutar flujo E2E real.
6. Revisar outbox, RabbitMQ y estados finales.

## 7. Matriz de pruebas

## 7.1 Unitarias de Caja

| Caso | Resultado esperado |
|---|---|
| Pago exacto sobre cuenta abierta | Crea transaccion y outbox |
| Pago menor al total | Rechazado, sin transaccion |
| Pago mayor al total | Rechazado, sin transaccion |
| Cuenta cerrada | Rechazado |
| Cuenta inexistente | `404` |
| Segundo pago | `409` |
| Dos pagos concurrentes | Solo una transaccion |
| Falla al crear outbox | No persiste pago |

## 7.2 Unitarias de Cuentas

| Caso | Resultado esperado |
|---|---|
| Evento valido | Cierra, genera ticket y outbox |
| Monto diferente | No cierra |
| Mesa diferente | No cierra |
| Cuenta inexistente | No cierra |
| Cuenta sin pedidos | No cierra |
| Evento duplicado | No genera segundo ticket |
| Cierre concurrente | Solo uno cambia estado |
| Endpoint directo | No existe |

## 7.3 Unitarias de Mesas

| Caso | Resultado esperado |
|---|---|
| Cuenta coincide | Libera mesa |
| Cuenta no coincide | No libera mesa |
| Evento duplicado | Sin cambio adicional |

## 7.4 Unitarias de Pedidos y Reportes

| Caso | Resultado esperado |
|---|---|
| Pago registrado | Pedidos activos pasan a pagados |
| Evento repetido | No produce efectos adicionales |
| Cuenta cerrada repetida | Reportes conserva una sola venta |

## 7.5 E2E integral

Flujo principal:

```text
Crear pedido
-> cuenta abierta
-> mesa ocupada
-> registrar pago
-> cuenta cerrada
-> ticket generado
-> pedidos pagados
-> mesa libre
-> venta registrada
```

Flujos de error:

1. Intentar pago insuficiente.
2. Intentar pago excedente.
3. Intentar segundo pago.
4. Repetir evento `pago.registrado`.
5. Repetir evento `cuenta.cerrada`.
6. Retrasar RabbitMQ despues del pago.
7. Verificar que el pago no se duplica durante el retraso.
8. Verificar que una mesa con otra cuenta no sea liberada por un evento antiguo.

## 8. Comandos de verificacion

Todos los comandos deben ejecutarse mediante Nx y el package manager del workspace:

```powershell
npm exec nx run-many -t build -p contracts servicio-caja servicio-cuentas servicio-mesas servicio-pedidos servicio-reportes pwa-cliente
npm exec nx run-many -t lint -p contracts servicio-caja servicio-cuentas servicio-mesas servicio-pedidos servicio-reportes pwa-cliente
npm exec nx run-many -t test -p servicio-caja servicio-cuentas servicio-mesas servicio-pedidos servicio-reportes
npm exec nx run pwa-cliente:typecheck
npm exec nx run pwa-cliente:e2e
```

Despliegue local:

```powershell
docker compose -f infra/docker-compose.yml --profile all up -d --build
docker compose -f infra/docker-compose.yml --profile all ps
```

## 9. Migracion y compatibilidad

### Antes del despliegue

1. Comprobar transacciones duplicadas por cuenta.
2. Resolver cualquier duplicado existente.
3. Confirmar que no haya clientes activos usando `POST /cuentas/:id/cerrar`.
4. Desplegar backend y PWA coordinadamente para evitar que una PWA antigua invoque el endpoint eliminado.

### Orden recomendado

1. Contratos.
2. Caja con restriccion unica.
3. Cuentas sin endpoint directo.
4. Mesas/Pedidos/Reportes.
5. PWA.

### Rollback

El rollback de la PWA no debe realizarse hacia una version que dependa del endpoint de cierre directo.

La restriccion unica de Caja puede mantenerse durante un rollback porque protege la regla de un pago por cuenta.

## 10. Observabilidad operativa

Registrar logs estructurados con:

- `cuentaId`.
- `mesaId`.
- `transaccionId`.
- `metodo`.
- `monto`.
- Estado previo y resultado.

Metricas recomendadas:

- Pagos registrados.
- Pagos rechazados por monto.
- Pagos duplicados rechazados.
- Eventos `pago.registrado` pendientes en outbox.
- Tiempo entre pago registrado y cuenta cerrada.
- Eventos de cierre ignorados por cuenta no coincidente.

Alertas recomendadas:

- Pago registrado cuya cuenta sigue abierta despues de un umbral operativo.
- Outbox de Caja o Cuentas con eventos `FAILED`.
- Crecimiento continuo de eventos pendientes.

## 11. Riesgos aceptados

### Consistencia eventual

Un pago puede quedar registrado mientras la cuenta permanece abierta temporalmente. Se acepta porque outbox conserva el evento y evita perder el pago.

### Sin cierre manual

Si el evento no se procesa, no existe una accion manual para cerrar. La resolucion consiste en reparar/reprocesar outbox o RabbitMQ.

### Sin pagos parciales

La restriccion unica por `cuentaId` impide pagos parciales o mixtos. Introducirlos en el futuro requerira retirar esta restriccion y modelar un estado de saldo pendiente.

### Sin descuentos

Los descuentos quedan fuera de alcance para evitar inconsistencias entre el total validado por Caja y el total de Cuentas.

## 12. Criterios de aceptacion

La fase se considera completada cuando:

1. `POST /cuentas/:id/cerrar` devuelve `404`.
2. No existe llamada de cierre directo desde la PWA.
3. Solo `POST /caja/pagos` inicia un cierre.
4. Cada cuenta admite exactamente una transaccion.
5. Un pago menor o mayor nunca cierra la cuenta.
6. `servicio-cuentas` valida monto y mesa antes de cerrar.
7. Un evento duplicado no genera otro ticket.
8. Una mesa solo se libera si sigue asociada a la cuenta cerrada.
9. Pedidos y Reportes procesan eventos repetidos sin duplicar efectos.
10. La PWA muestra un unico boton de confirmacion.
11. La PWA no muestra exito hasta confirmar el cierre.
12. Build, lint, unit tests y E2E pasan mediante Nx.
13. El stack Docker queda saludable despues del despliegue.

## 13. Resultado esperado

Al finalizar esta fase, el sistema tendra una regla simple y verificable:

```text
Sin pago registrado no existe cierre.
Con pago completo existe exactamente un cierre.
```

Esta regla elimina el principal riesgo financiero actual sin introducir estados adicionales, versionado de cuentas ni un nuevo coordinador de checkout.
