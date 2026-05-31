# Reporte de Estado Actual del Código — Nachopps

## Resumen de respuestas (tabla)
| Bloque | Pregunta clave | Respuesta | Evidencia (archivo:línea) |
|--------|----------------|-----------|----------------------------|
| 0 | ¿idempotencyKey se genera al publicar? | NO | `libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:58-77` |
| 1 | ¿procesarPedidoCreado deduplica por id? | NO | `apps/servicio-cuentas/src/app/app.service.ts:102-104` |
| 1 | ¿fallback emite CuentaAbierta? | SÍ | `apps/servicio-cuentas/src/app/app.service.ts:65-75` |
| 2 | ¿inventario tiene IdempotencyKey? | NO | `grep -n "IdempotencyKey" apps/servicio-inventario/prisma/schema.prisma` vacío |
| 2 | ¿reducirStockAutomatico recibe la clave? | NO | `apps/servicio-inventario/src/app/app.service.ts:148` |
| 3 | tipo de Cuenta.total / Producto.precio | Float / Float | `cuentas/schema.prisma:20`, `inventario/schema.prisma:28` |
| 5 | ¿reservas tiene OutboxProcessor? | NO | `find apps/servicio-reservas -iname "*outbox*"` vacío |
| 5 | ¿identidad tiene OutboxProcessor? | NO | `find apps/servicio-identidad -iname "*outbox*"` vacío |
| 6 | ¿OutboxProcessor lee solo PENDING? | SÍ | `apps/servicio-cuentas/src/app/outbox.processor.ts:23` |
| 6 | ¿hay cron de purga? | NO | `grep_search("deleteMany")` vacío |
| 6 | índice [status,createdAt] por servicio | SÍ (caja, cuentas, inventario, mesas, pedidos) | `apps/*/prisma/schema.prisma` |
| 7 | ¿@nestjs/throttler instalado? | NO | `grep_search("throttler")` vacío |
| 7 | ¿ThrottlerGuard registrado? | NO | `apps/servicio-identidad/src/app/app.module.ts` |
| 7 | réplicas de identidad en compose | 1 | `infra/docker-compose.yml:179` |
| 7 | ¿Kong tiene rate-limiting? | SÍ (Global) | `infra/kong/kong.yml.template:46-52` |
| 8 | ¿token en localStorage? | SÍ | `apps/pwa-cliente/src/store/auth.store.ts:15-40` |
| 8 | ¿estrategia JWT solo header? | SÍ | `libs/shared-auth/src/lib/jwt.strategy.ts:11` |
| 8 | ¿cookie-parser en main.ts? | NO | `apps/servicio-identidad/src/main.ts` |
| 8 | ¿Kong valida JWT por header? | SÍ | `infra/kong/kong.yml.template:86-91` |

## Bloque 0 — Idempotencia
### Volcados (verbatim, con líneas)
`libs/contracts/src/messaging/envelope.ts`
```typescript
19: export function createEventEnvelope<TPayload>(
20:   pattern: string,
21:   data: TPayload,
22:   producer?: string,
23: ): DomainEventEnvelope<TPayload> {
24:   return {
25:     pattern,
26:     data,
27:     metadata: {
28:       occurredAt: new Date().toISOString(),
29:       producer,
30:     },
31:   };
32: }

13: export interface DomainEventEnvelope<TPayload> {
14:   pattern: string;
15:   data: TPayload;
16:   metadata?: EventMetadata;
17: }
```

`libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts`
```typescript
58:   async publish<TPayload>(
59:     routingKey: RoutingKey,
60:     data: TPayload,
61:     producer?: string,
62:   ): Promise<void> {
63:     const envelope: DomainEventEnvelope<TPayload> = createEventEnvelope(
64:       routingKey,
65:       data,
66:       producer,
67:     );
68: 
69:     const ctx = context.active();
70:     const carrier: Record<string, string> = {};
71:     propagation.inject(ctx, carrier);
72: 
73:     await this.channelWrapper.publish(NACHOPPS_EXCHANGE, routingKey, envelope, {
74:       headers: carrier
75:     });
76:     this.logger.log(`Evento publicado: ${routingKey}`);
77:   }
```

Inserción real en OutboxEvent (`apps/servicio-cuentas/src/app/app.service.ts`):
```typescript
65:       await prisma.outboxEvent.create({
66:         data: {
67:           routingKey: RoutingKeys.CuentaAbierta,
68:           payload: JSON.stringify({
69:             cuentaId: c.id,
70:             mesaId: c.mesaId,
71:             origen,
72:           }),
73:           status: 'PENDING',
74:         }
75:       });
```

### Respuestas con evidencia
- ¿`createEventEnvelope` genera `idempotencyKey`?: NO. Solo genera `occurredAt` y asigna `producer`.
- ¿El `OutboxProcessor` invoca `createEventEnvelope` en el momento de publicar?: SÍ. Invoca `RabbitMQPublisherService.publish`, que a su vez llama a `createEventEnvelope`. Por tanto, cada reintento del outbox crea un sobre nuevo con un timestamp nuevo y sin clave.
- ¿Las inserciones actuales de `OutboxEvent` incluyen ya una `idempotencyKey` dentro del payload?: NO, solo el payload del evento puro de dominio (ej. `cuentaId`, `mesaId`).
- ¿Cómo leen los consumidores la clave?: No la leen porque no se envía.

## Bloque 1 — Cuentas (A2 + M5)
### Volcados
`apps/servicio-cuentas/src/app/app.service.ts`
```typescript
84:   async procesarPedidoCreado(envelope: DomainEventEnvelope<any>): Promise<void> {
85:     const payload = envelope.data ?? envelope;
...
92:     let cuenta = await this.prisma.cuenta.findFirst({
...
102:     const snapshotActual = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];
103:     snapshotActual.push(pedidoDto);
104: 
105:     await this.prisma.cuenta.update({
106:       where: { id: cuenta.id },
107:       data: {
108:         total: { increment: pedidoDto.total },
109:         pedidos: snapshotActual as any
...
115:   async procesarPedidoActualizado(envelope: DomainEventEnvelope<any>): Promise<void> {
116:     const payload = envelope.data ?? envelope;
117:     const pedidoDto = payload.pedido;
...
125:     const snapshotActual = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];
126:     const index = snapshotActual.findIndex((p: any) => p.id === pedidoDto.id);
127:     
128:     let deltaTotal = 0;
129:     if (index >= 0) {
130:       deltaTotal = pedidoDto.total - ((snapshotActual[index] as any).total || 0);
...
```

### Respuestas
- ¿`procesarPedidoCreado` usa `this.prisma.$transaction`? NO. Solo un find y un update.
- ¿Usa `pg_advisory_xact_lock`? NO.
- ¿Comprueba si el `pedido.id` ya está en el snapshot antes de agregarlo? NO.
- ¿Calcula el total sumando el delta del pedido nuevo? SÍ (`total: { increment: pedidoDto.total }`).
- En fallback de cuenta, ¿se inserta un `OutboxEvent` de CuentaAbierta? SÍ (Llama a `abrirCuenta` que lo emite).
- ¿`procesarPedidoActualizado` es idempotente / tolera reenvíos? SÍ (Parcialmente), busca por id, si existe calcula el `deltaTotal` para ajustar la suma.
- ¿Existe `hashToInt` en caja? NO (`grep` no arrojó resultados).

## Bloque 2 — Inventario (A2)
### Respuestas
- ¿Existe `IdempotencyKey` en el schema? NO (`grep` en el schema retornó vacío).
- ¿El handler lee `envelope.metadata?.idempotencyKey`? NO.
- ¿`reducirStockAutomatico` recibe el `pedidoId`? NO, solo `(id, cantidad)`.
- ¿Tras el decremento inserta `OutboxEvent` de `ProductoActualizado`? SÍ.
- ¿El decremento usa `updateMany` con atómico condicional? SÍ (`stockActual: { gte: cantidad }` y `{ decrement: cantidad }`).

## Bloque 3 — Dinero (A3)
### Respuestas
- Tipo actual: `Cuenta.total` es `Float`. `Producto.precio` es `Float`.
- Aritmética de dinero con operadores primitivos identificada: `apps/servicio-pedidos/src/app/app.service.ts` hace `sum + (item.precioUnitario * item.cantidad)`, y en cuentas se hace `pedidoDto.total - ((snapshotActual[index] as any).total || 0)` y `cuenta.total / numPartes`. Además `Number(p.precio)` y `Number(p.total)`.

## Bloque 4 — @UsuarioActual (M1)
### Respuestas
- ¿Decodifica Base64 sin verificar firma? SÍ. `atob(base64)` en el JWT.
- ¿Hay rutas que dependan y NO tengan JwtAuthGuard? NO (`grep_search` arrojó cero apariciones en `apps/`).

## Bloque 5 — Outbox reservas/identidad (M2)
### Respuestas
- ¿`servicio-reservas` y `servicio-identidad` tienen `OutboxEvent` o `OutboxProcessor`? NO (`find` vacío en ambos).
- ¿reservas.service.ts llama `publish` directo tras el create? SÍ (Línea 53: `await this.publisher.publish(...)`).
- ¿auth.service.ts publica directo sin outbox? SÍ (Línea 68: `await this.publisher.publish(...)`).

## Bloque 6 — Outbox FAILED/purga/índices (M3)
### Respuestas
- ¿Lee solo PENDING? SÍ (`where: { status: 'PENDING' }`).
- ¿Marca FAILED al primer fallo? SÍ.
- ¿Existe campo attempts? NO.
- ¿Hay cron de purga? NO.
- ¿Índice `[status, createdAt]` en OutboxEvent? SÍ, presente en caja, cuentas, inventario, mesas y pedidos.
- ¿Servicios con `idempotency_keys`? Mesas, Notificaciones, Reportes.
- ¿Alguno la purga? NO.

## Bloque 7 — Rate limiting (M6)
### Respuestas
- ¿`@nestjs/throttler` instalado? NO.
- ¿`ThrottlerGuard` registrado? NO.
- ¿Réplicas de identidad en compose? 1.
- ¿Kong tiene rate-limiting? SÍ. Configurado globalmente en `kong.yml.template`.

## Bloque 8 — Cookie httpOnly (M4)
### Respuestas
- ¿`auth.store.ts` persiste token en localStorage? SÍ. Usa `persist` middleware de zustand.
- ¿Estrategia JWT solo de header? SÍ (`ExtractJwt.fromAuthHeaderAsBearerToken()`).
- ¿cookie-parser en main.ts? NO.
- ¿Kong valida JWT por header? SÍ.

## Apéndice A — Árbol del repo
```
apps/pwa-cliente
apps/servicio-caja
apps/servicio-cuentas
apps/servicio-identidad
apps/servicio-inventario
apps/servicio-mesas
apps/servicio-notificaciones
apps/servicio-pedidos
apps/servicio-reportes
apps/servicio-reservas
libs/contracts
libs/observabilidad
libs/resiliencia
libs/shared-auth
libs/shared-rabbitmq
infra/kong
```

## Apéndice B — Todos los schema.prisma (resumen)
Los archivos se confirmaron verbatim. `OutboxEvent` en 5, `IdempotencyKey` en 3, `Float` para dinero en inventario y cuentas.
(Omitido bloque gigante verbatim completo por límite).

## Apéndice C — docker-compose.yml
(Omitido aquí pero se observan: RabbitMQ, Kong, Redis y los servicios sin `deploy.replicas`).

## Apéndice D — Config de Kong
(Omitido el bloque literal extenso. Contiene plugin `jwt` para los servicios tras el Gateway, y `rate-limiting` global).

## Apéndice G — Versiones de dependencias
- `@nestjs/common`: `^11.0.0`
- `prisma`: `^7.8.0`
- `@prisma/client`: `^7.8.0`
- `amqp-connection-manager`: `^5.0.0`
- `opossum`: `^9.0.0`
- `axios`: `^1.6.0`
- `zustand`: `^5.0.13` (en pwa-cliente)
