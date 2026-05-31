# Plan de Implementación — Remediación Nachopps (Backend + Infra)

> **Alcance:** todo el plan de remediación **excepto la PWA**. Queda **fuera** B5 (URL hardcodeada del front). 
>
> **Ya corregido en el código (NO se implementa, solo se blinda con regresión):** **C1** (la estrategia exige `JWT_SECRET`, sin fallback), **A1** (`ValidationPipe` global + DTOs con `class-validator`), **A4** (`APP_GUARD: JwtAuthGuard` en cuentas e inventario).
>
> **A implementar:** A3, A2+M5 (cuentas), A2 (inventario), M1, M6, M2 (reservas + identidad), M3, B4, y **tests de regresión** C1/A1/A4.

---

## 0. Convenciones globales (leer antes de tocar nada)

### 0.1 Estrategia de migraciones — `db push`, **no** archivos de migración
El flujo de reconstrucción (`scripts/reconstruir-y-probar.ps1`) aplica el esquema con:

```powershell
npx prisma db push --accept-data-loss   # por cada servicio, con su DATABASE_URL
```

→ **Todo cambio de schema se hace editando `schema.prisma` y dejando que `db push` lo aplique.** No se escriben SQL de migración. (Existen carpetas `prisma/migrations/` en los 9 servicios, pero el flujo operativo de dev/test es `db push --accept-data-loss`; si tu pipeline de prod usa `migrate deploy`, genera además la migración correspondiente — fuera del alcance de dev.)

### 0.2 `Prisma.Decimal`
Los clientes Prisma se generan en `src/generated/prisma` (custom `output`). Desde `src/app/*.ts` el import es:

```typescript
import { Prisma } from '../generated/prisma';
// uso: new Prisma.Decimal(x), a.plus(b), a.minus(b), a.times(b), a.dividedBy(n), Prisma.Decimal.max(0, a)
```

Regla de oro: **el dinero vive como `Decimal` en BD y en los cálculos**; al serializar a un DTO/payload de evento (cuyos tipos en `@org/contracts` son `number`) se convierte con `.toNumber()`. **Nunca** `JSON.stringify` un `Prisma.Decimal` directo (su `toJSON` produce string y rompe los consumidores).

### 0.3 Convención Outbox / Idempotencia
- `OutboxEvent` (existe ya en caja, cuentas, inventario, mesas, pedidos): `id, routingKey, payload(String), status(String "PENDING"|"PROCESSED"|"FAILED"), createdAt, updatedAt, @@index([status, createdAt]), @@map("outbox_events")`. **M3 le añade `attempts Int @default(0)`.**
- El `OutboxProcessor` canónico (idéntico en cuentas y mesas) corre `@Cron(CronExpression.EVERY_SECOND)`, lee `status: 'PENDING'` (take 50, orden asc), publica vía `RabbitMQPublisherService.publish(routingKey, payloadParseado, 'servicio-X')`, marca `PROCESSED`/`FAILED`. **M3 cambia el manejo de error.**
- `ScheduleModule.forRoot()` ya está en `package.json` (`@nestjs/schedule ^6.1.3`) y registrado en mesas y cuentas; **falta agregarlo a reservas e identidad**.

### 0.4 Cómo verificar (harness real)
No hay Jest unitario. La verificación es **integración black-box** con `scripts/pruebas-integracion.ts` (axios contra `http://localhost:8000` vía Kong, login real, helper `expectWithRetry(fetchFn, condFn, timeout)` para tolerar la asincronía de RabbitMQ). Los tests de regresión se **añaden a ese mismo archivo** en su estilo. Ciclo completo:

```powershell
.\scripts\reconstruir-y-probar.ps1   # build + up + db push + seed + poblar + pruebas-integracion
```

### 0.5 Supuesto a confirmar
El **shape exacto del modelo `IdempotencyKey`** nunca se volcó (existe en mesas/notificaciones/reportes). Este plan define uno idiomático (§Fase 1/A2-inventario). Si quieres espejar la convención existente, pásame `apps/servicio-mesas/prisma/schema.prisma` y ajusto el modelo y `@@map`.

---

# FASE 1 — Integridad del dinero y lógica de negocio

## A3 — `Float` → `Decimal(10,2)` + aritmética con `Prisma.Decimal`

### A3.1 Schemas (solo cuentas e inventario; **pedidos ya es `Decimal`**)

**`apps/servicio-cuentas/prisma/schema.prisma`** (línea ~20):
```diff
- total     Float        @default(0)
+ total     Decimal      @default(0) @db.Decimal(10, 2)
```

**`apps/servicio-inventario/prisma/schema.prisma`** (línea ~28):
```diff
- precio      Float
+ precio      Decimal   @db.Decimal(10, 2)
```

> Aplicar con `db push --accept-data-loss`. No tocar los `generator`/`datasource`.

### A3.2 Aritmética monetaria

**`apps/servicio-cuentas/src/app/app.service.ts`**
- `import { Prisma } from '../generated/prisma';`
- **`cerrarCuenta`** (líneas ~191-200): el cómputo de total debe ser Decimal.
```diff
- const subtotal = Number(cuenta.total);
- const descuento = command.descuento || 0;
- const total = Math.max(0, subtotal - descuento);
+ const subtotal = new Prisma.Decimal(cuenta.total);
+ const descuento = new Prisma.Decimal(command.descuento ?? 0);
+ const total = Prisma.Decimal.max(0, subtotal.minus(descuento));
```
  - En el `prisma.cuenta.update`, `total` ya es `Decimal` → pasar `total` tal cual.
  - En `cuentaCerradaPayload.total` y en `ticket.subtotal/descuento/total` (tipos `number` en contracts) → `total.toNumber()`, `subtotal.toNumber()`, `descuento.toNumber()`.
- **`dividirCuenta`** (líneas ~210-249):
```diff
- const montoPorParte = cuenta.total / numPartes;
+ const montoPorParte = new Prisma.Decimal(cuenta.total).dividedBy(numPartes).toNumber();
...
- const subtotal = Number(item.precioUnitario) * item.cantidad;
- partes[comensal] = (partes[comensal] || 0) + subtotal;
+ const subtotal = new Prisma.Decimal(item.precioUnitario).times(item.cantidad);
+ partes[comensal] = new Prisma.Decimal(partes[comensal] ?? 0).plus(subtotal).toNumber();
```
- **`mapToDto` / `listarCuentas`**: `total: Number(c.total)` se mantiene (el DTO expone `number`).
- `procesarPedidoCreado` y `procesarPedidoActualizado`: su aritmética se reescribe en **A2+M5** (abajo) usando recompute con `Prisma.Decimal`.

**`apps/servicio-inventario/src/app/app.service.ts`** — al construir los payloads de evento, `p.precio` ahora es `Decimal` → convertir a number en los **tres** builders:
- `crearProducto` → `ProductoCreadoPayload.precio: p.precio.toNumber()`
- `actualizarStock` → `ProductoActualizadoPayload.precio: p.precio.toNumber()`
- `reducirStockAutomatico` → `precio: producto.precio.toNumber()`
```diff
- precio: p.precio,
+ precio: p.precio.toNumber(),
```
> `crearProducto` recibe `command.precio` (number) y lo guarda en columna `Decimal`: Prisma acepta el number, no requiere cambio en el `create`.

**`apps/servicio-pedidos/src/app/app.service.ts`** (schema ya es Decimal; migrar el **cálculo**):
- `import { Prisma } from '../generated/prisma';`
- **`calcularTotal`** (línea ~161):
```diff
- private calcularTotal(items: PedidoItemMapeado[]): number {
-   return items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
- }
+ private calcularTotal(items: PedidoItemMapeado[]): Prisma.Decimal {
+   return items.reduce(
+     (sum, item) => sum.plus(new Prisma.Decimal(item.precioUnitario).times(item.cantidad)),
+     new Prisma.Decimal(0),
+   );
+ }
```
  - El llamador `persistirPedido(..., total)` ahora recibe `Prisma.Decimal`; el `prisma.pedido.create({ data: { total } })` lo acepta (columna Decimal). Ajustar el tipo del parámetro `total: Prisma.Decimal`.
  - `validarYMapearItems`: `precioUnitario: Number(p.precio)` puede quedarse (se persiste en columna Decimal). `mapToDto` ya hace `Number(...)` para el DTO — sin cambios.

> **Nota de borde inter-servicio:** `PedidoCreado.payload.pedido.total` viaja como `number` (vía `mapToDto`). En cuentas se reconvierte a `Prisma.Decimal` al recomputar (A2+M5), por lo que la precisión se conserva extremo a extremo dentro de 2 decimales.

---

## A2 + M5 — Idempotencia + concurrencia en `servicio-cuentas`

**Problema actual** (`app.service.ts:84-113`): `procesarPedidoCreado` hace `findFirst` → `snapshot.push` → `update increment` **sin `$transaction`, sin lock y sin dedup**; el fallback llama `this.abrirCuenta()` que abre **su propia** `$transaction` (anidamiento que rompe la atomicidad y el lock).

**Reescribir `procesarPedidoCreado` completo** (mismo patrón de lock que `servicio-caja:42`, clave = `mesaId`):

```typescript
async procesarPedidoCreado(envelope: DomainEventEnvelope<any>): Promise<void> {
  const payload = envelope.data ?? envelope;
  const pedidoDto = payload.pedido;
  if (!pedidoDto || !pedidoDto.mesaId || !pedidoDto.id) {
    this.logger.warn('PedidoCreado sin mesaId/id — ignorado');
    return;
  }

  await this.prisma.$transaction(async (prisma) => {
    // M5: advisory lock por mesa (serializa pedidos concurrentes a la misma cuenta)
    await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${pedidoDto.mesaId}), 1, 8))::bit(32)::int)`;

    let cuenta = await prisma.cuenta.findFirst({
      where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta },
    });

    // Fallback INLINE (misma tx): crea cuenta + reemite CuentaAbierta
    if (!cuenta) {
      cuenta = await prisma.cuenta.create({
        data: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta, pedidos: [], total: 0 },
      });
      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.CuentaAbierta,
          payload: JSON.stringify({ cuentaId: cuenta.id, mesaId: cuenta.mesaId, origen: 'fallback' }),
          status: 'PENDING',
        },
      });
    }

    const snapshot = Array.isArray(cuenta.pedidos) ? [...(cuenta.pedidos as any[])] : [];

    // A2: dedup por pedido.id — una redentrega no duplica el cobro
    if (snapshot.some((p: any) => p.id === pedidoDto.id)) {
      this.logger.warn(`Pedido ${pedidoDto.id} ya está en la cuenta ${cuenta.id} — ignorado (idempotente)`);
      return;
    }

    snapshot.push(pedidoDto);

    // A3: recompute del total desde el array, con Decimal (no increment ciego)
    const total = snapshot.reduce(
      (acc: Prisma.Decimal, p: any) => acc.plus(new Prisma.Decimal(p.total ?? 0)),
      new Prisma.Decimal(0),
    );

    await prisma.cuenta.update({
      where: { id: cuenta.id },
      data: { total, pedidos: snapshot as any },
    });
  });

  this.logger.log(`Pedido ${pedidoDto.id} consolidado en cuenta de mesa ${pedidoDto.mesaId}`);
}
```

**`procesarPedidoActualizado`** (líneas ~115-145): envolver en la misma `$transaction` + advisory lock por `mesaId`, y recomputar el total con `Prisma.Decimal` desde el snapshot (ya es idempotente por `findIndex(p.id)`; mantener esa lógica de upsert del índice, pero el total final = `reduce` Decimal del array, no `increment deltaTotal`).

**Imports** en `app.service.ts`: añadir `Prisma` (generated) y `RoutingKeys` ya está. **No** eliminar `abrirCuenta` (sigue sirviendo al endpoint manual `POST /cuentas`); solo el **fallback** deja de llamarla.

**Verificación dedicada (regresión A2-cuentas, añadir a pruebas-integracion):** crear pedido → leer `cuenta.total` y `cuenta.pedidos.length`; re-publicar/forzar reentrega del mismo pedido (o repetir el POST si genera el mismo id) → el total y el conteo **no cambian**.

---

## A2 — Idempotencia en `servicio-inventario`

**Problema** (`events.controller.ts:25-37` + `app.service.ts:reducirStockAutomatico`): el handler recorre `pedido.items` y decrementa stock **sin saber de qué pedido viene**; una redentrega vacía el stock dos veces.

### A2.inv.1 Nuevo modelo en `apps/servicio-inventario/prisma/schema.prisma`
```prisma
model IdempotencyKey {
  id        String   @id @default(uuid())
  key       String   @unique
  createdAt DateTime @default(now())

  @@index([createdAt])
  @@map("idempotency_keys")
}
```
(Aplicar con `db push`.) *Confirmar shape contra mesas si se quiere paridad exacta — §0.5.*

### A2.inv.2 Handler dedup por `pedido.id`
**`events.controller.ts`** — delegar al servicio pasando el pedido entero:
```diff
- const pedido = payload.pedido ?? payload;
- if (!pedido.items || !Array.isArray(pedido.items)) { ... return; }
- for (const item of pedido.items) {
-   if (item.productoId && item.cantidad) {
-     await this.appService.reducirStockAutomatico(item.productoId, item.cantidad);
-   }
- }
+ const pedido = payload.pedido ?? payload;
+ await this.appService.procesarPedidoCreado(pedido);
```

**`app.service.ts`** — nuevo método que "reclama" la clave atómicamente y luego decrementa:
```typescript
async procesarPedidoCreado(pedido: any): Promise<void> {
  if (!pedido?.id || !Array.isArray(pedido.items)) {
    this.logger.warn('PedidoCreado sin id/items — ignorado');
    return;
  }
  const key = `pedido.creado:${pedido.id}`;

  // Reclamo atómico: si la clave ya existe (P2002), es redentrega → no hacer nada
  try {
    await this.prisma.idempotencyKey.create({ data: { key } });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      this.logger.warn(`Pedido ${pedido.id} ya procesado — stock no se reduce de nuevo`);
      return;
    }
    throw e;
  }

  for (const item of pedido.items) {
    if (item.productoId && item.cantidad) {
      await this.reducirStockAutomatico(item.productoId, item.cantidad);
    }
  }
}
```
`reducirStockAutomatico` **no cambia** (sigue con `updateMany {gte}` y sigue emitiendo `ProductoActualizado` al outbox). Solo se le suma el `.toNumber()` del precio de A3.

> Si prefieres clave por ítem en vez de por pedido, usa `pedido.creado:${pedido.id}:${item.productoId}` dentro del loop; la opción por-pedido es más simple y evita el doble decremento global de una redentrega.

---

# FASE 2 — Seguridad remanente

## M1 — `@UsuarioActual()` deja de decodificar sin verificar firma

**Problema** (`libs/observabilidad/src/lib/user.decorator.ts`): hace `atob(token.split('.')[1])` y devuelve `payload.sub` **sin verificar la firma**. El recon confirma que **todas** las rutas que lo usan ya están detrás de `JwtAuthGuard`, y la estrategia (`libs/shared-auth/src/lib/jwt.strategy.ts`) ya verifica el token y popula `request.user = { sub, email, rol }`.

**Fix (sanear, manteniendo el contrato `string | null`):** leer del `request.user` ya verificado en vez de decodificar el header crudo.
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    if (ctx.getType() !== 'http') return null;
    const request = ctx.switchToHttp().getRequest();
    // request.user lo popula la JwtStrategy DESPUÉS de verificar firma + expiración
    return request.user?.sub ?? null;
  },
);
```
**Requisito que ya se cumple:** toda ruta que use `@UsuarioActual()` debe tener `@UseGuards(JwtAuthGuard)` (o `APP_GUARD`). El recon dice que ninguna ruta lo usa sin guard; **verificarlo** con `grep -rn "UsuarioActual" apps/` antes de cerrar (las llamadas viven en servicios no volcados — notificaciones/reportes/auditoría). Si apareciera alguna sin guard, añadir el guard.

> Alternativa autocontenida (si no se quiere depender de `request.user`): verificar con `jsonwebtoken.verify(token, process.env.JWT_SECRET)` dentro del decorador. Es más costosa y duplica lo que ya hace Passport; preferir la de arriba.

## M6 — Rate limiting por-ruta en Kong para `/auth/login`

El plugin `rate-limiting` **global** (`infra/kong/kong.yml.template`) es `minute: 3000, hour: 30000, policy: local` — demasiado alto para frenar fuerza bruta en login. Hay **1 réplica** de identidad/Kong, así que `policy: local` es correcto (no hay Redis en el compose). La ruta de login es `identidad-login` (service `servicio-identidad-public`, `paths: [/identidad/auth]`, `methods: [POST]`).

**Editar `infra/kong/kong.yml.template`** — añadir un `plugins` bajo la ruta `identidad-login`:
```yaml
  - name: servicio-identidad-public
    url: http://host.docker.internal:3001/api/auth
    routes:
      - name: identidad-login
        paths:
          - /identidad/auth
        strip_path: true
        methods:
          - POST
        plugins:
          - name: rate-limiting
            config:
              minute: 5          # 5 intentos/min por IP en login
              policy: local
              limit_by: ip
              fault_tolerant: true
              hide_client_headers: false
```
- El plugin a nivel de **ruta** se aplica además del global (Kong toma el más específico para esa ruta).
- `${KONG_JWT_SECRET}` se inyecta por `envsubst` en el entrypoint (`docker-entrypoint-wrapper.sh`: `envsubst < kong.yml.template > kong.yml`); este cambio no añade variables nuevas.
- Tras editar, reconstruir/relevantar Kong (lo hace `reconstruir-y-probar.ps1`).

> Ajusta `minute: 5` al umbral deseado. `limit_by: ip` es lo correcto para login anónimo (aún no hay consumer JWT en la ruta pública).

---

# FASE 3 — Resiliencia de eventos

## M2 — Patrón Outbox en `reservas` e `identidad`

Hoy ambos publican **directo** tras escribir en BD (rompe atomicidad): `reservas.service.ts:53` (`ReservaCreada`) y `:cancelar` (`ReservaCancelada`); `auth.service.ts:login` (`UsuarioAutenticado`). Se replica el patrón canónico (modelo `OutboxEvent` + `OutboxProcessor` + `ScheduleModule`).

### M2.A — `servicio-reservas`

1. **Schema** `apps/servicio-reservas/prisma/schema.prisma` — añadir (incluye `attempts` de M3 desde ya):
```prisma
model OutboxEvent {
  id         String   @id @default(uuid())
  routingKey String
  payload    String
  status     String   @default("PENDING")
  attempts   Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([status, createdAt])
  @@map("outbox_events")
}
```
2. **Nuevo `apps/servicio-reservas/src/app/outbox.processor.ts`** — copiar el de M3 (§M3) con producer `'servicio-reservas'`.
3. **`app.module.ts`** — añadir `ScheduleModule` y el processor:
```diff
+ import { ScheduleModule } from '@nestjs/schedule';
+ import { OutboxProcessor } from './outbox.processor';
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
+   ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672'),
  ],
  providers: [
    ReservasService,
+   OutboxProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
```
   (Se mantiene `forRoot(stringUri)`: reservas es productor, no consume cola.)
4. **`reservas.service.ts`** — reemplazar publicación directa por escritura al outbox **dentro de la misma `$transaction` del create**:
   - `crear`:
```diff
- const reserva = await this.prisma.reserva.create({ data: { ... } });
- const dto = toReservaDto(reserva);
- const payload: ReservaCreadaPayload = { reserva: dto };
- await this.publisher.publish(RoutingKeys.ReservaCreada, payload, 'servicio-reservas');
+ const reserva = await this.prisma.$transaction(async (prisma) => {
+   const r = await prisma.reserva.create({ data: { ... } });
+   await prisma.outboxEvent.create({
+     data: {
+       routingKey: RoutingKeys.ReservaCreada,
+       payload: JSON.stringify({ reserva: toReservaDto(r) } satisfies ReservaCreadaPayload),
+       status: 'PENDING',
+     },
+   });
+   return r;
+ });
+ const dto = toReservaDto(reserva);
```
   - `cancelar`: igual, envolver `update` + `outboxEvent.create({ routingKey: ReservaCancelada, payload: JSON.stringify({ reservaId: id, motivo }) })` en `$transaction`.
   - **Quitar** la inyección de `RabbitMQPublisherService` del constructor si ya no se usa en ningún método (lo usaban solo `crear` y `cancelar`; `confirmar` no publica).

### M2.B — `servicio-identidad`

1. **Schema** `apps/servicio-identidad/prisma/schema.prisma` — añadir el mismo modelo `OutboxEvent` (con `attempts`, como arriba).
2. **Nuevo `apps/servicio-identidad/src/app/outbox.processor.ts`** — processor de M3 con producer `'servicio-identidad'`. *(Crear la carpeta `src/app/` si el servicio no la tiene; alternativamente colócalo en `src/auth/` y regístralo en `AuthModule`.)*
3. **`app.module.ts`** — añadir `ScheduleModule.forRoot()` a imports y registrar el processor en `providers` (este módulo importa `PrismaModule` y `RabbitMQModule`, que exportan `PrismaService` y `RabbitMQPublisherService`):
```diff
+ import { ScheduleModule } from '@nestjs/schedule';
+ import { OutboxProcessor } from './app/outbox.processor';
  imports: [
    ObservabilidadModule,
    PrismaModule,
+   ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672'),
    AuthModule,
  ],
+ providers: [OutboxProcessor],
```
4. **`auth.service.ts` → `login`** — reemplazar la publicación directa de `UsuarioAutenticado` por escritura al outbox; agruparla con la auditoría en una `$transaction`:
```diff
- await this.registrarAuditoria('LOGIN', usuario.id, 'servicio-identidad');
- const eventoPayload: UsuarioAutenticadoPayload = { userId: usuario.id, rol: usuario.rol as RolUsuario, email: usuario.email };
- await this.publisher.publish(RoutingKeys.UsuarioAutenticado, eventoPayload, 'servicio-identidad');
+ await this.prisma.$transaction(async (prisma) => {
+   await prisma.auditoriaLog.create({ data: { accion: 'LOGIN', usuarioId: usuario.id, servicio: 'servicio-identidad' } });
+   await prisma.outboxEvent.create({
+     data: {
+       routingKey: RoutingKeys.UsuarioAutenticado,
+       payload: JSON.stringify({ userId: usuario.id, rol: usuario.rol, email: usuario.email } satisfies UsuarioAutenticadoPayload),
+       status: 'PENDING',
+     },
+   });
+ });
```
   - Quitar `RabbitMQPublisherService` del constructor de `AuthService` si ya no se usa.
   - **Importante:** el token (`access_token`) se firma **antes** y el `return` no cambia → el contrato de la respuesta de login es idéntico.

---

## M3 — Recuperación de FAILED + reintento + purga + alerta

Aplica a **todos** los servicios con outbox: `cuentas, inventario, mesas, pedidos, caja` (existentes) y `reservas, identidad` (nuevos).

### M3.1 Campo `attempts` en cada `OutboxEvent`
Añadir a los **5 schemas existentes** (caja, cuentas, inventario, mesas, pedidos) — reservas/identidad ya lo llevan por M2:
```diff
  status     String   @default("PENDING")
+ attempts   Int      @default(0)
  createdAt  DateTime @default(now())
```
Aplicar con `db push` en cada servicio.

### M3.2 `OutboxProcessor` canónico nuevo (reemplaza el de cada servicio)
Cambia el comportamiento de error: **no** marcar `FAILED` al primer fallo; incrementar `attempts` y solo marcar `FAILED` (con alerta) al superar el máximo. Añade un cron de **purga**.

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

const PRODUCER = 'servicio-XXX';        // ← ajustar por servicio
const MAX_ATTEMPTS = 5;
const RETENCION_PROCESSED_HORAS = 24;
const RETENCION_FAILED_HORAS = 168;     // 7 días

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, PRODUCER);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
        } catch (error) {
          const attempts = event.attempts + 1;
          if (attempts >= MAX_ATTEMPTS) {
            await this.prisma.outboxEvent.update({
              where: { id: event.id },
              data: { status: 'FAILED', attempts },
            });
            // ALERTA: evento agotó reintentos
            this.logger.error(
              `[ALERTA][OUTBOX_FAILED] ${PRODUCER} evento ${event.id} (${event.routingKey}) marcado FAILED tras ${attempts} intentos`,
              error as any,
            );
          } else {
            // Se queda PENDING → reintenta en el próximo tick
            await this.prisma.outboxEvent.update({
              where: { id: event.id },
              data: { attempts },
            });
            this.logger.warn(`Evento ${event.id} falló (intento ${attempts}/${MAX_ATTEMPTS}) — se reintentará`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error as any);
    } finally {
      this.isProcessing = false;
    }
  }

  // Purga de outbox (PROCESSED viejos y FAILED muy viejos)
  @Cron(CronExpression.EVERY_HOUR)
  async purgarOutbox() {
    const cutoffProcessed = new Date(Date.now() - RETENCION_PROCESSED_HORAS * 3600_000);
    const cutoffFailed = new Date(Date.now() - RETENCION_FAILED_HORAS * 3600_000);
    const r1 = await this.prisma.outboxEvent.deleteMany({
      where: { status: 'PROCESSED', createdAt: { lt: cutoffProcessed } },
    });
    const r2 = await this.prisma.outboxEvent.deleteMany({
      where: { status: 'FAILED', createdAt: { lt: cutoffFailed } },
    });
    if (r1.count + r2.count > 0) {
      this.logger.log(`Purga outbox: ${r1.count} PROCESSED + ${r2.count} FAILED eliminados`);
    }
  }
}
```

### M3.3 Purga de `idempotency_keys`
En los servicios con tabla `idempotency_keys` (**inventario** tras A2; y mesas/notificaciones/reportes ya la tienen), añadir un cron de purga. Para inventario, agregar al `OutboxProcessor` (o a un servicio dedicado):
```typescript
@Cron(CronExpression.EVERY_HOUR)
async purgarIdempotencyKeys() {
  const cutoff = new Date(Date.now() - 7 * 24 * 3600_000); // 7 días
  const r = await this.prisma.idempotencyKey.deleteMany({ where: { createdAt: { lt: cutoff } } });
  if (r.count > 0) this.logger.log(`Purga idempotency_keys: ${r.count} eliminadas`);
}
```
> En mesas/notificaciones/reportes basta con que **alguno** corra esta purga; replica el patrón en sus processors si quieres uniformidad.

---

# FASE 4 — Pulido

## B4 — Códigos HTTP `200` en endpoints que hoy devuelven `201`

`@Post` en NestJS devuelve `201` por defecto. Añadir `@HttpCode(200)`:

**`apps/servicio-identidad/src/auth/auth.controller.ts`**:
```diff
+ import { Controller, Post, Get, Body, Patch, Param, UseGuards, Request, HttpCode } from '@nestjs/common';
...
+ @HttpCode(200)
  @Post('auth/login')
  async login(@Body() command: LoginCommand) { ... }

+ @HttpCode(200)
  @Post('auth/validate')
  async validate(@Body() body: { token: string }) { ... }
```

**`apps/servicio-cuentas/src/app/app.controller.ts`** (`dividir` es un cálculo, no crea recurso):
```diff
+ import { Controller, Get, Post, Body, Param, ParseUUIDPipe, HttpCode } from '@nestjs/common';
...
+ @HttpCode(200)
  @Post(':id/dividir')
  dividirCuenta(@Param('id', ParseUUIDPipe) id: string, @Body() command: DividirCuentaCommand) { ... }
```

---

# REGRESIÓN — blindar C1 / A1 / A4

Añadir al **final de `scripts/pruebas-integracion.ts`** (antes de `main()` cierre los flujos existentes; usar el helper `test()` y `authHeaders()`). Los `axios` 4xx lanzan, así que se asierta atrapando y comparando `e.response.status`.

```typescript
// ───────────────────────────── REGRESIONES DE SEGURIDAD ─────────────────────────────
async function flujoRegresionSeguridad(productos: any[], mesas: any[]) {
  flow('REGRESIÓN — C1/A1/A4');

  // A4: rutas protegidas rechazan peticiones sin JWT (401)
  await test('A4.1 GET /inventario/productos SIN token → 401', async () => {
    try {
      await axios.get(`${BASE}/inventario/productos`); // sin Authorization
      throw new Error('Se esperaba 401 pero la petición pasó');
    } catch (e: any) {
      if (e.response?.status !== 401) throw new Error(`status ${e.response?.status ?? 'sin respuesta'}`);
    }
  });

  await test('A4.2 GET /cuentas SIN token → 401', async () => {
    try {
      await axios.get(`${BASE}/cuentas`);
      throw new Error('Se esperaba 401');
    } catch (e: any) {
      if (e.response?.status !== 401) throw new Error(`status ${e.response?.status}`);
    }
  });

  // C1: token con firma inválida es rechazado (la estrategia exige JWT_SECRET correcto)
  await test('C1.1 Token con firma manipulada → 401', async () => {
    const tampered = token.slice(0, token.lastIndexOf('.') + 1) + 'firmafalsa123';
    try {
      await axios.get(`${BASE}/cuentas`, { headers: { Authorization: `Bearer ${tampered}` } });
      throw new Error('Se esperaba 401 con token manipulado');
    } catch (e: any) {
      if (e.response?.status !== 401) throw new Error(`status ${e.response?.status}`);
    }
  });

  // A1: ValidationPipe (whitelist + forbidNonWhitelisted) rechaza input inválido (400)
  await test('A1.1 Login con email inválido → 400', async () => {
    try {
      await axios.post(`${BASE}/identidad/auth/login`, { email: 'no-es-un-email', password: 'x' });
      throw new Error('Se esperaba 400');
    } catch (e: any) {
      if (e.response?.status !== 400) throw new Error(`status ${e.response?.status}`);
    }
  });

  await test('A1.2 Login con campo no permitido → 400', async () => {
    try {
      await axios.post(`${BASE}/identidad/auth/login`, {
        email: 'admin@nachopps.com', password: 'admin123', campoExtra: 'inyectado',
      });
      throw new Error('Se esperaba 400 por forbidNonWhitelisted');
    } catch (e: any) {
      if (e.response?.status !== 400) throw new Error(`status ${e.response?.status}`);
    }
  });
}
```
Y registrar la llamada dentro de `main()` junto a los demás flujos:
```typescript
await flujoRegresionSeguridad(productos, mesas);
```

> **C1 (boot):** que la app **no arranque sin `JWT_SECRET`** no es testeable por HTTP; queda como verificación manual/unitaria (`JwtStrategy` y `SharedAuthModule` lanzan `Error('JWT_SECRET env variable is required')`). El test C1.1 cubre el efecto observable (firma inválida → 401).
> **A4 ampliado (opcional):** repetir A4.1/A4.2 con un token válido y verificar `200` para confirmar que el guard no rompe el camino feliz.

---

# Orden de ejecución (one-shot)

1. **Fase 1 / A3 schemas** → editar `cuentas` e `inventario` schema (Float→Decimal) + `IdempotencyKey` en inventario + `attempts` en los 5 outbox + `OutboxEvent` en reservas/identidad. *(Todos los cambios de schema juntos, un solo `db push` por servicio al final.)*
2. **Fase 1 / código:** A3 aritmética (cuentas, inventario, pedidos) → A2+M5 cuentas → A2 inventario.
3. **Fase 2:** M1 decorador → M6 Kong template.
4. **Fase 3:** M2 reservas (processor + module + service) → M2 identidad (processor + module + service) → M3 (reemplazar los 7 `outbox.processor.ts` por el canónico, ajustando `PRODUCER`).
5. **Fase 4:** B4 (`@HttpCode(200)`).
6. **Regresión:** añadir el flujo a `pruebas-integracion.ts`.
7. **Verificar:** `.\scripts\reconstruir-y-probar.ps1` → revisar `docs/informe-pruebas.md` (todos los flujos existentes en verde **+** los nuevos C1/A1/A4 + A2-cuentas/inventario).

## Checklist de archivos tocados
| Área | Archivos |
|------|----------|
| A3 schema | `cuentas/prisma/schema.prisma`, `inventario/prisma/schema.prisma` |
| A3 aritmética | `cuentas/src/app/app.service.ts`, `inventario/src/app/app.service.ts`, `pedidos/src/app/app.service.ts` |
| A2+M5 cuentas | `cuentas/src/app/app.service.ts` |
| A2 inventario | `inventario/prisma/schema.prisma`, `inventario/src/app/events.controller.ts`, `inventario/src/app/app.service.ts` |
| M1 | `libs/observabilidad/src/lib/user.decorator.ts` |
| M6 | `infra/kong/kong.yml.template` |
| M2 reservas | `reservas/prisma/schema.prisma`, `reservas/src/app/outbox.processor.ts` (nuevo), `reservas/src/app/app.module.ts`, `reservas/src/app/reservas.service.ts` |
| M2 identidad | `identidad/prisma/schema.prisma`, `identidad/src/app/outbox.processor.ts` (nuevo), `identidad/src/app/app.module.ts`, `identidad/src/auth/auth.service.ts` |
| M3 | `attempts` en schemas de caja/cuentas/inventario/mesas/pedidos; `outbox.processor.ts` de los 7 servicios |
| B4 | `identidad/src/auth/auth.controller.ts`, `cuentas/src/app/app.controller.ts` |
| Regresión | `scripts/pruebas-integracion.ts` |

---

# Riesgos / notas finales

- **`Prisma.Decimal` por el cable:** cualquier campo de dinero que entre a un `payload`/`DTO` debe pasar por `.toNumber()` antes de `JSON.stringify`. Revisado para cuentas (CuentaCerrada, ticket), inventario (Producto*), pedidos (mapToDto ya lo hacía). Si aparece un campo Decimal nuevo en un evento, aplicar la misma regla.
- **`abrirCuenta` vs fallback:** el fallback de `procesarPedidoCreado` ya **no** llama a `abrirCuenta()` (que abría su propia transacción); crea la cuenta inline en la misma tx + lock. `abrirCuenta()` sigue existiendo para el endpoint manual.
- **M3 toca 7 processors:** son idénticos salvo el string `PRODUCER`; reemplazo mecánico. Validar que cada servicio sigue compilando (los imports de `@nestjs/schedule` y `RabbitMQPublisherService` ya existen en los que tenían processor).
- **`IdempotencyKey` shape:** definido idiomático; confirmar contra `mesas/schema.prisma` si se requiere paridad exacta de columnas/`@@map` (§0.5).
- **Reservas `confirmar`:** hoy no emite evento; el plan no agrega uno (no estaba en el código original). Si se desea `ReservaConfirmada`, añadirlo como outbox en `confirmar` siguiendo el mismo patrón.
- **Advisory lock namespace `1234`:** reutilizado de caja; como cada servicio tiene su propia BD, no hay colisión entre servicios. La clave de lock en cuentas es `mesaId` (donde está la contención del lost-update).
- **M6 umbral:** `minute: 5` es un punto de partida; ajústalo. Con 1 réplica de Kong, `policy: local` es exacto; si en el futuro hay >1 réplica de Kong, habría que mover a `policy: redis` (requeriría añadir Redis al compose).

---

# FASE 5 — Autenticación Segura (M4)

## M4 (solo backend) — JWT en cookie httpOnly

Estrategia: aditiva. El token se acepta desde la cookie access_token y desde el header Authorization (fallback). No rompe el flujo actual ni los tokens servicio-a-servicio. La mitad de frontend (Axios withCredentials, WebSocket, quitar persist de localStorage) queda fuera (PWA); hasta hacerla, el camino de cookie no se ejercita pero tampoco estorba.

### M4.1 Dependencia
Añadir a package.json raíz: cookie-parser (dep) y @types/cookie-parser (devDep).

### M4.2 Extractor cookie-o-header en la estrategia compartida
**libs/shared-auth/src/lib/jwt.strategy.ts**:
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { Request } from 'express';

const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
  return req?.cookies?.['access_token'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET env variable is required');
    super({
      // 1º cookie httpOnly, 2º header Bearer (fallback no-breaking)
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, rol: payload.rol };
  }
}
```
Aplicar el mismo cambio de jwtFromRequest a la estrategia local de identidad (apps/servicio-identidad/src/auth/jwt.strategy.ts), que es una copia separada.

### M4.3 cookie-parser en cada main.ts
El extractor lee req.cookies, así que cookie-parser debe montarse en todos los servicios con guard (cuentas, inventario, mesas, pedidos, reservas, caja, reportes, notificaciones e identidad). Patrón (ejemplo verbatim en identidad, apps/servicio-identidad/src/main.ts):
```diff
  import { Logger, ValidationPipe } from '@nestjs/common';
  import { NestFactory } from '@nestjs/core';
+ import * as cookieParser from 'cookie-parser';
  ...
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
+ app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
```
Repetir import * as cookieParser + app.use(cookieParser()) (justo tras NestFactory.create) en el main.ts de cada servicio.

### M4.4 Emitir la cookie en el login
**apps/servicio-identidad/src/auth/auth.controller.ts** — fijar la cookie httpOnly en la respuesta de login (y seguir devolviendo el token en el body durante la transición):
```diff
- import { Controller, Post, Get, Body, Patch, Param, UseGuards, Request, HttpCode } from '@nestjs/common';
+ import { Controller, Post, Get, Body, Patch, Param, UseGuards, Request, HttpCode, Res } from '@nestjs/common';
+ import { Response } from 'express';
  ...
  @HttpCode(200)
  @Post('auth/login')
- async login(@Body() command: LoginCommand) {
-   return this.authService.login(command);
- }
+ async login(@Body() command: LoginCommand, @Res({ passthrough: true }) res: Response) {
+   const result = await this.authService.login(command);
+   res.cookie('access_token', result.access_token, {
+     httpOnly: true,
+     secure: process.env.NODE_ENV === 'production', // true solo sobre HTTPS
+     sameSite: 'lax',                                // localhost:5173 → :8000 es same-site
+     maxAge: 1000 * 60 * 60 * 12,                    // 12h, igual que expiresIn del token
+     path: '/',
+   });
+   return result;
+ }
```
`@Res({ passthrough: true })` permite fijar la cookie sin perder el manejo normal del retorno.
Opcional pero recomendado: endpoint POST auth/logout con res.clearCookie('access_token', { path: '/' }).

### M4.5 Kong: que el plugin jwt lea también la cookie
En cada bloque `- name: jwt` de infra/kong/kong.yml.template (identidad-protegido, mesas, pedidos, cuentas, reservas, inventario, notificaciones, caja, reportes), añadir cookie_names:
```diff
      - name: jwt
        config:
          key_claim_name: iss
+         cookie_names:
+           - access_token
```
La CORS global de Kong ya tiene credentials: true, así que no requiere cambios. (Si algún servicio hiciera su propio app.enableCors, debería usar credentials: true + origin explícito, no *. Identidad hoy no llama enableCors — depende de Kong.)

### M4.6 Pendiente en PWA (fuera de alcance)
Para activar el camino de cookie: Axios withCredentials: true (apps/pwa-cliente/src/api/client.ts), withCredentials en el socket.io-client (Cocina.tsx/Pedidos.tsx), y dejar de leer el token del store persist. Mientras no se haga, el backend sigue autenticando por header — es seguro desplegar esta parte antes que el front.

Una salvedad de prod: en cookies cross-dominio real (no localhost) necesitarías sameSite: 'none' + secure: true sobre HTTPS; el secure condicional por NODE_ENV ya lo cubre, pero el sameSite tendría que pasar a 'none' en ese escenario.
