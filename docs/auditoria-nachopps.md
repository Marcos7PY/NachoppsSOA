# Auditoría Técnica — Nachopps Restobar

**Tipo de sistema:** Monorepo Nx · 9 microservicios NestJS · PWA React · mensajería RabbitMQ · API Gateway Kong · stack de observabilidad (OTel/Prometheus/Jaeger/Grafana).
**Fecha de auditoría:** 28 de mayo de 2026.

---

## Alcance y una advertencia importante

Esta auditoría se hizo sobre la **documentación** del codebase (los `.md`), no sobre el código fuente real. La documentación es muy detallada (incluye números de línea, esquemas Prisma, firmas de métodos), así que la mayoría de los hallazgos son verificables directamente. Pero algunos dependen de cómo esté implementado el código real y los marco explícitamente con **[Verificar en código]**.

Distingo dos tipos de hallazgo:
- **Defecto confirmado por la doc:** el documento describe algo que ya es un problema (ej. un esquema que usa `Float` para dinero).
- **[Verificar en código]:** el problema existe *si* el código coincide con lo descrito y no hay una salvaguarda no documentada.

---

## Lo que está bien hecho (para no perder el contexto)

Antes de los problemas, conviene reconocer que este es un proyecto **fuerte**. Decisiones acertadas:

- **Transactional Outbox** en la mayoría de servicios (escribe el evento en `outbox_events` dentro de la misma transacción de negocio). Resuelve correctamente el problema de *dual-write*.
- **Anti-doble-pago en caja** con `pg_advisory_xact_lock` + `aggregate(sum)`: serialización correcta de pagos concurrentes a la misma cuenta.
- **Decremento de stock atómico condicional** (`updateMany` con `where: { stockActual: { gte: cantidad } }`): elimina la condición de carrera y el stock negativo. Muy bien.
- **Resiliencia:** Circuit Breaker (opossum) en llamadas HTTP salientes + retry con backoff exponencial y DLQ en consumidores RabbitMQ.
- **Database-per-service** con proyecciones locales (`MesaLocal`, `ProductoLocal`, `CuentaAbierta`) para no depender de HTTP síncrono en el camino crítico.
- **Observabilidad** completa: trazas OTel, métricas Prometheus, dashboards Grafana.
- **RBAC** con `RolesGuard` + `@Roles('ADMIN')` en identidad.

La arquitectura demuestra que entiendes patrones de microservicios serios. Los problemas de abajo son, en su mayoría, **inconsistencias en la aplicación de esos patrones**, no falta de conocimiento.

---

## Hallazgos por severidad

### 🔴 CRÍTICO

#### C1 — Secreto JWT con *fallback* hardcodeado
**Dónde:** `libs/shared-auth/src/lib/shared-auth.module.ts` y `jwt.strategy.ts`.
```
secret: process.env.JWT_SECRET ?? 'nachopps_jwt_secret_dev'
```
**El problema:** si la variable `JWT_SECRET` no está definida, el sistema usa un secreto **público y conocido** (está en el repositorio). Cualquiera que lea el código puede **firmar sus propios tokens** y hacerse pasar por cualquier usuario, incluido `ADMIN`. Es escalada de privilegios trivial.
**Cómo arreglarlo:** eliminar el fallback. Fallar al arrancar si falta el secreto:
```ts
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET es obligatorio');
```
Y rotar el secreto en cualquier entorno donde el de desarrollo haya podido filtrarse.

---

### 🟠 ALTO

#### A1 — No hay validación de entrada en tiempo de ejecución (en todo el backend)
**Dónde:** transversal. Repetido en identidad y cuentas: los DTOs (`LoginCommand`, `CrearUsuarioCommand`, `AbrirCuentaCommand`, `DividirCuentaCommand`, `CerrarCuentaCommand`, etc.) son `interface` de TypeScript, **sin `class-validator`**.
**El problema:** las `interface` de TS se borran al compilar. No existe ninguna validación en runtime del body de las peticiones. Consecuencias concretas:
- `dividirCuenta` hace `total / numPartes`. Si `numPartes` llega `0`, `undefined` o negativo → división por cero / resultado inválido. **[Verificar en código]**
- `cerrarCuenta` aplica `descuento` sin validar. Un `descuento` negativo o mayor al total puede producir un **ticket con total negativo**.
- `registrarPago` recibe `montoRecibido: number` sin validar que sea positivo o numérico.
- `crearUsuario` recibe `rol` sin restringirlo al enum en runtime, y `password` sin longitud mínima.
**Cómo arreglarlo:** convertir los DTOs de `interface` a **clases** con decoradores `class-validator` (`@IsEmail`, `@IsPositive`, `@Min(1)`, `@IsEnum(RolUsuario)`, `@IsNotEmpty`, etc.) y activar un `ValidationPipe` global (`whitelist: true, forbidNonWhitelisted: true, transform: true`).

#### A2 — Idempotencia incompleta → doble descuento de stock e inflado de totales
**Dónde:** consumidores de eventos en `servicio-inventario`, `servicio-cuentas`, `servicio-pedidos`.
**El problema:** el sistema usa entrega *at-least-once* (RabbitMQ + `RabbitMQRetryInterceptor` con 3 reintentos). Las redentregas son **esperadas** (ej. el consumidor procesa, se cae antes del `ack`, y al reiniciar recibe el mismo mensaje). Pero la idempotencia se implementa de forma desigual:
- El modelo `IdempotencyKey` y `$checkAndRecordIdempotencyKey()` **existen** en `mesas`, `notificaciones`, `reportes`.
- **No existen** en `cuentas`, `caja`, `pedidos`, `inventario` (sus esquemas están listados completos y no incluyen ese modelo).

Casos de daño real si un evento se redentrega:
- **`servicio-inventario` / `reducirStockAutomatico`** (consume `PedidoCreado`): el decremento atómico evita stock negativo, pero **no evita descontar dos veces** el mismo pedido legítimamente redentregado. → stock subdescontado. **[Verificar en código]**
- **`servicio-cuentas` / `procesarPedidoCreado`** ("agrega el pedido al snapshot e incrementa `total`"): si no comprueba que el `pedidoId` ya esté en el snapshot, una redentrega **duplica el ítem y suma el total dos veces**. → cuenta inflada, cliente cobrado de más. **[Verificar en código]**
**Cómo arreglarlo:** usar el `idempotencyKey` del envelope (ya existe en `DomainEventEnvelope.metadata`) + `$checkAndRecordIdempotencyKey()` en TODOS los consumidores que muten estado, o hacer las operaciones idempotentes por diseño (ej. en cuentas, comprobar presencia del `pedidoId` en el snapshot antes de agregar).

#### A3 — `Float` para dinero en cuentas e inventario (inconsistente con el resto)
**Dónde:**
- `servicio-cuentas` → `Cuenta.total`: **`Float`**
- `servicio-inventario` → `Producto.precio`: **`Float`**
- Todo lo demás usa `Decimal(10,2)`: pedidos (`total`, `precioUnitario`, `precioExtra`), caja (`monto`), reportes (`total`). ✅
**El problema:** el punto flotante acumula error de redondeo (`0.1 + 0.2 ≠ 0.3`). `Cuenta.total` se construye **incrementando** en cada pedido, y `Producto.precio` (que alimenta los totales) también es `Float`. Como `Cuenta.total` es lo que se paga y se reporta, la deriva de float impacta **directamente en la facturación**. Además el sistema es inconsistente: casi todo el dinero es `Decimal(10,2)` (correcto) menos estos dos campos.
**Cómo arreglarlo:** migrar `Cuenta.total` y `Producto.precio` a `Decimal(10,2)` y manejar el dinero con una librería decimal (o enteros en céntimos) en la lógica.

#### A4 — Dos servicios sin guards de autenticación
**Dónde:**
- `servicio-cuentas`: *"Sin guards propios. Depende del API Gateway (Kong)."*
- `servicio-inventario`: *"Guards: Ninguno."*
- Los otros 7 servicios sí aplican `JwtAuthGuard` global.
**El problema:** estos dos servicios confían al 100% en Kong. Si alguien alcanza el servicio **directamente** (red interna mal segmentada, SSRF, ingress mal configurado), puede sin autenticación:
- En cuentas: `abrirCuenta`, `cerrarCuenta` (¡generar tickets!), `dividirCuenta`.
- En inventario: `crearProducto`, `actualizarStock` (vaciar o inflar el inventario vía `PATCH /productos/:id/stock`).

Escenario concreto combinando A1+A4: un `PATCH /productos/:id/stock` sin auth y sin validación permite poner el stock en cualquier valor.
**El detalle revelador:** el proyecto **sabe** usar guards (los aplica en 7 servicios), así que estos dos parecen un olvido más que una decisión de diseño. La defensa en profundidad recomienda que cada servicio valide el JWT aunque Kong también lo haga.
**Cómo arreglarlo:** aplicar `JwtAuthGuard` (y `RolesGuard` donde corresponda) también en cuentas e inventario, de forma consistente con el resto.

---

### 🟡 MEDIO

#### M1 — El decorador `@UsuarioActual()` decodifica el JWT **sin verificar la firma**
**Dónde:** `libs/observabilidad/src/lib/user.decorator.ts`. Hace base64-decode del payload *"sin verificar la firma (se asume que Kong ya lo validó)"*.
**El problema:** depende de que el servicio sea inalcanzable salvo a través de Kong. Si el valor decodificado (`payload.sub`) se usa para algo con valor de confianza —por ejemplo, **atribuir acciones en los logs de auditoría**— un atacante que alcance el servicio directamente puede **falsificar la atribución**, lo que invalida el propósito mismo de auditar. La severidad sube a Alta si ese `sub` alimenta cualquier lógica de autorización.
**Cómo arreglarlo:** verificar la firma también aquí (reutilizar `JwtService.verify`), o documentar y garantizar por red que el servicio jamás es accesible fuera de Kong. No tratar tokens no verificados como fuente de identidad confiable.

#### M2 — El patrón Outbox NO es universal (contradice un invariante declarado)
**Dónde:** `rabbitmq_events_map.md` afirma: *"Todos los eventos son publicados mediante Outbox. Ningún `AppService` publica directamente a RabbitMQ."* Pero:
- `servicio-reservas`: el constructor *inyecta `RabbitMQPublisherService`*, no tiene modelo `OutboxEvent` ni `OutboxProcessor`. → publica `reserva.creada`/`reserva.cancelada` **directamente**.
- `servicio-identidad`: el `login` *"emite un evento en RabbitMQ (`UsuarioAutenticado`)"* directamente; tampoco tiene `OutboxEvent`.
**El problema:** además de ser una afirmación falsa en la doc, es un **riesgo real de pérdida de eventos** (dual-write): si la publicación falla tras el commit de BD, el evento se pierde. Para reservas esto significa que una reserva confirmada podría **no enviar nunca su notificación**. Para identidad el impacto es menor (evento de auditoría).
**Cómo arreglarlo:** o mover reservas (e identidad) al patrón Outbox como los demás, o corregir la documentación para reflejar que el Outbox es parcial y asumir conscientemente el riesgo en esos casos.

#### M3 — Tabla `outbox_events`: crecimiento sin límite, sin índice y eventos `FAILED` sin recuperación
**Dónde:** todos los `OutboxProcessor`.
**El problema (tres aristas):**
1. El cron hace `findMany({ where: { status: 'PENDING' } })` **cada 5s en cada servicio**. Los esquemas de `OutboxEvent` no documentan un índice sobre `status` → escaneo de tabla que se degrada a medida que se acumulan filas `PROCESSED`.
2. No hay limpieza/archivado de filas `PROCESSED`. La tabla crece indefinidamente.
3. Un evento marcado `FAILED` no tiene, según la doc, ningún reintento ni alerta → publicación **perdida sin ruta de recuperación**. (Distinto del retry/DLQ de RabbitMQ, que es del lado del *consumo*, no de la *publicación*.)
**Cómo arreglarlo:** añadir `@@index([status, createdAt])` a `OutboxEvent`; purgar/archivar periódicamente las filas `PROCESSED` antiguas; e implementar reintento + alerta para `FAILED`.

#### M4 — JWT en `localStorage` (exposición a XSS)
**Dónde:** `apps/pwa-cliente/src/store/auth.store.ts` — Zustand con `persist` guarda el token en `localStorage` (`nachopps-auth-storage`).
**El problema:** `localStorage` es accesible por cualquier JavaScript de la página; un XSS puede exfiltrar el token, válido 24h. Con dependencias de terceros (Radix, etc.) la superficie de XSS existe.
**Cómo arreglarlo:** preferiblemente cookies `httpOnly` + `SameSite` para el token; o tokens de corta vida + refresh. Es un *trade-off* conocido en SPAs, pero conviene documentarlo y mitigarlo.

#### M5 — Actualización concurrente del snapshot `pedidos: Json` en cuentas (posible *lost update*)
**Dónde:** `servicio-cuentas` → `Cuenta.pedidos` es `Json`, actualizado en cada `PedidoCreado`/`PedidoActualizado`.
**El problema:** un blob JSON actualizado con read-modify-write es vulnerable a **actualizaciones perdidas** si dos eventos de la misma cuenta se procesan concurrentemente, a diferencia de caja que sí usa advisory locks. **[Verificar en código]** — depende de si la actualización va dentro de transacción con bloqueo.
**Cómo arreglarlo:** usar `pg_advisory_xact_lock` (como caja) o `SELECT ... FOR UPDATE` al modificar el snapshot, o normalizar los ítems a una tabla en vez de un JSON.

#### M6 — Sin *rate limiting* documentado en `login`
**Dónde:** `auth/login`. Usa `bcrypt.compare` (bien), pero no hay throttling documentado.
**El problema:** sin límite de intentos, el login queda expuesto a fuerza bruta / credential stuffing a nivel de aplicación. Kong *podría* hacerlo, pero no está documentado. **[Verificar en código/Kong]**
**Cómo arreglarlo:** confirmar que Kong aplica rate limiting en `/auth/login`; si no, añadir `@nestjs/throttler`.

---

### 🟢 BAJO / Pulido

#### B1 — Contradicción en la documentación sobre `shared-prisma`
Tres fuentes se contradicen:
- `README.md`: *"Shared Prisma — (Código Muerto). No se usa."*
- `libs/shared-prisma.md`: *"**Usada por 9/9 microservicios.**"*
- identidad/cuentas/inventario: *"shared-prisma no es utilizada."* — pero reservas/notificaciones/reportes: *"Usa `createBasePrismaService` de `@org/shared-prisma`."*

La realidad parece ser que la usan **algunos** servicios (≥3) y otros tienen Prisma local. Ni "código muerto" ni "9/9" es correcto. El README es el más desactualizado (fecha 26-may, frente a shared-prisma.md del 28-may). Cualquiera que se incorpore recibe información contradictoria sobre un patrón de acceso a datos central.
**Arreglo:** reconciliar: listar exactamente qué servicios usan la librería y cuáles Prisma local.

#### B2 — `RoutingKeys`: el conteo no cuadra y hay claves sin usar
`contracts.md` dice *"22 en total"* pero lista **18**. Además, varias claves nunca aparecen como publicadas/consumidas en el mapa de eventos: `ReservaConfirmada`, `MesaAsignada`, `MesaLiberada`, `ArqueoRealizado`, `StockBajo`, `StockDescontado`. Son constantes muertas (diseño especulativo).
**Arreglo:** corregir el conteo y eliminar (o implementar) las claves no usadas.

#### B3 — Eventos publicados sin consumidor
`pedido.listo` y `ticket.generado` se publican pero la doc indica que nadie los consume todavía ("reservado"/"pendiente"). No es dañino, pero son publicaciones desperdiciadas / features a medias.

#### B4 — Semántica REST: `201` en operaciones que no crean recursos
`auth/login`, `auth/validate`, `cuentas/:id/dividir` devuelven `201 Created` por defecto de NestJS, aunque no crean recursos. Lo correcto sería `200`. Detalle de pulido (`@HttpCode(200)`).

#### B5 — Frontend: URL del gateway hardcodeada y WebSocket sin verificar
La propia doc del PWA ya identifica ambos: `http://localhost:8000` hardcodeado (extraer a `import.meta.env.VITE_API_URL`) y la conexión WebSocket del KDS sin validar. **Bien detectados** — solo falta ejecutarlos.

#### B6 — Detalles menores
- bcrypt con coste **10**: aceptable, pero 12 es la recomendación habitual en 2026.
- Inconsistencia de timeout en Circuit Breaker (default 3000ms vs 5000ms en caja). Cosmético.
- Latencia del Outbox: hasta ~5s entre el cambio de estado y la publicación (el KDS puede tardar ~5s en mostrar un pedido nuevo). Aceptable para el dominio, pero conviene tenerlo presente.

---

## Checklist priorizado de remediación

| # | Severidad | Acción | Esfuerzo |
|---|-----------|--------|----------|
| C1 | 🔴 Crítico | Eliminar fallback de `JWT_SECRET`; fallar si falta; rotar secreto | Bajo |
| A1 | 🟠 Alto | DTOs como clases + `class-validator` + `ValidationPipe` global | Medio |
| A2 | 🟠 Alto | Idempotencia en consumidores de cuentas/inventario/pedidos | Medio |
| A3 | 🟠 Alto | `Cuenta.total` y `Producto.precio` → `Decimal(10,2)` | Bajo-Medio |
| A4 | 🟠 Alto | `JwtAuthGuard` en cuentas e inventario | Bajo |
| M1 | 🟡 Medio | Verificar firma en `@UsuarioActual()` | Bajo |
| M2 | 🟡 Medio | Outbox en reservas/identidad (o corregir doc) | Medio |
| M3 | 🟡 Medio | Índice + purga + recuperación de `FAILED` en outbox | Medio |
| M4 | 🟡 Medio | Token en cookie `httpOnly` (o token corto + refresh) | Medio |
| M5 | 🟡 Medio | Bloqueo al actualizar snapshot JSON en cuentas | Bajo |
| M6 | 🟡 Medio | Rate limiting en `/auth/login` | Bajo |
| B1–B6 | 🟢 Bajo | Reconciliar docs, limpiar claves, `@HttpCode`, etc. | Bajo |

---

## Cómo verificar los hallazgos marcados [Verificar en código]

Para confirmar los puntos que dependen de la implementación, revisa:
- **A2 (cuentas):** en `procesarPedidoCreado`, ¿comprueba si el `pedidoId` ya está en el snapshot antes de sumar al `total`?
- **A2 (inventario):** ¿hay control de idempotencia antes de `reducirStockAutomatico`, o solo el decremento condicional?
- **A1:** ¿existe un `ValidationPipe` global en algún `main.ts`/módulo que la doc no mencione?
- **M5:** ¿la actualización de `Cuenta.pedidos` ocurre dentro de `$transaction` con bloqueo?
- **M6:** ¿hay un plugin de rate-limiting configurado en Kong para la ruta de login?
