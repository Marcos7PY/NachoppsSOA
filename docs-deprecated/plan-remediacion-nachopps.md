# Plan de Remediación — Nachopps Restobar

Documento maestro de corrección. Consolida tres cosas:

1. La **auditoría original** (21 documentos del codebase).
2. La **verificación contra el código fuente real** (qué ya está parcheado y qué sigue siendo un defecto confirmado).
3. El **plan de ejecución**: orden, dependencias entre arreglos y el **código concreto** de cada fix.

> **Cómo leer este documento.** Cada hallazgo tiene: *Estado* · *Dónde* · *Problema* · *Solución* (con código) · *Cómo probarlo*. El código es **ilustrativo**: adapta nombres de campos, modelos y rutas a tu esquema real. Antes de tocar nada, lee primero el **Prerrequisito 0**, porque varios arreglos dependen de él.

---

## Tabla de estado (todos los hallazgos)

| # | Severidad | Hallazgo | Estado en el código | Fase |
|---|-----------|----------|---------------------|------|
| C1 | 🔴 Crítico | Secreto JWT con fallback hardcodeado | ✅ Ya corregido | Guardia de regresión |
| A1 | 🟠 Alto | Sin validación de entrada (`class-validator`) | ✅ Ya corregido | Guardia de regresión |
| A4 | 🟠 Alto | Servicios sin `JwtAuthGuard` | ✅ Ya corregido | Guardia de regresión |
| A3 | 🟠 Alto | `Float` para dinero en vez de `Decimal` | 🔴 Confirmado | **Fase 1** |
| A2 | 🟠 Alto | Idempotencia incompleta (cuentas + inventario) | 🔴 Confirmado | **Fase 1** |
| M5 | 🟡 Medio | Lost update en snapshot JSON de cuentas | 🔴 Confirmado | **Fase 1** (con A2) |
| M1 | 🟡 Medio | `@UsuarioActual()` no verifica la firma | 🔴 Confirmado | **Fase 2** |
| M6 | 🟡 Medio | Sin rate limiting en `/auth/login` | 🔴 Confirmado | **Fase 2** |
| M4 | 🟡 Medio | JWT en `localStorage` (XSS) | 🔴 Confirmado | **Fase 2** |
| M2 | 🟡 Medio | Outbox no universal (reservas, identidad) | 🔴 Confirmado | **Fase 3** |
| M3 | 🟡 Medio | Outbox: `FAILED` sin recuperación + sin purga | 🟠 Parcial (índice ✅, resto 🔴) | **Fase 3** |
| B4 | 🟢 Bajo | Códigos HTTP `201` donde debería `200` | 🔴 Confirmado | **Fase 4** |
| B5 | 🟢 Bajo | URL del gateway hardcodeada en frontend | 🔴 Confirmado | **Fase 4** |
| B1 | 🟢 Bajo | Doc de `shared-prisma` contradictoria | ⚪ Sin verificar (doc) | **Fase 4** |
| B2 | 🟢 Bajo | `RoutingKeys`: conteo y claves muertas | ⚪ Sin verificar (doc) | **Fase 4** |
| B3 | 🟢 Bajo | Eventos publicados sin consumidor | ⚪ Sin verificar | **Fase 4** |
| B6 | 🟢 Bajo | bcrypt coste 10, timeouts, latencia outbox | ⚪ Sin verificar | **Fase 4** |

---

## Prerrequisito 0 — La *idempotency key* del productor (léelo antes que nada)

Toda la idempotencia de la Fase 1 **no sirve de nada** si el evento redentregado no llega con la **misma clave** que el original. Y un evento solo se redentrega por dos vías, ambas esperadas:

- **Lado consumo:** RabbitMQ entrega *at-least-once* y el `RabbitMQRetryInterceptor` reintenta 3 veces.
- **Lado publicación:** el `OutboxProcessor` publica una fila y se cae **antes** de marcarla `PROCESSED`. Al reiniciar, esa fila sigue `PENDING` y se **republica**.

En ambos casos, el consumidor recibe dos veces el mismo mensaje. Para deduplicar necesita reconocerlos como "el mismo", y eso solo funciona si comparten `idempotencyKey`.

**El error a buscar primero:** si `createEventEnvelope` (en `libs/shared-rabbitmq`) **genera la `idempotencyKey` en el momento de publicar**, entonces cada republicación del `OutboxProcessor` produce una clave nueva y **nada deduplica jamás**. La regla es:

> La `idempotencyKey` debe fijarse **cuando se escribe la fila en `outbox_events`**, guardarse **dentro del payload**, y el publisher debe **leerla del payload**, nunca regenerarla.

**Recomendación:** usa una clave **determinista de negocio** donde exista una identidad natural. Así, aunque por error se crearan dos filas de outbox para el mismo hecho lógico, compartirían clave:

```typescript
// Al insertar el OutboxEvent dentro de la transacción de negocio:
const idempotencyKey = `pedido.creado:${pedido.id}`; // determinista, no aleatorio
await tx.outboxEvent.create({
  data: {
    routingKey: RoutingKeys.PedidoCreado,
    payload: JSON.stringify({ pedido, metadata: { idempotencyKey } }),
    status: 'PENDING',
  },
});
```

Verifica/ajusta `createEventEnvelope` para que respete `metadata.idempotencyKey` si viene en el payload y solo genere uno nuevo como último recurso.

**Checklist del Prerrequisito 0**
- [ ] Revisar `createEventEnvelope`: ¿genera la clave al publicar? Si sí, cambiarlo para leerla del payload.
- [ ] Asegurar que cada inserción de `OutboxEvent` fije una `idempotencyKey` determinista en el payload.
- [ ] Confirmar que el consumidor lea `envelope.metadata.idempotencyKey` (no otro campo).

---

## FASE 1 — Integridad del dinero y la lógica de negocio (prioridad máxima)

Orden interno: **1.1 → 1.2 → 1.3**. El 1.1 (Decimal) cambia los tipos, así que el código de 1.2/1.3 debe escribirse ya consciente de `Decimal`.

### 1.1 — [A3] Migrar `Float` → `Decimal` para dinero

**Estado:** 🔴 Confirmado.
**Dónde:** `apps/servicio-cuentas/prisma/schema.prisma` (`total Float @default(0)`) y `apps/servicio-inventario/prisma/schema.prisma` (`precio Float`).

**Problema.** El punto flotante acumula error de redondeo (`0.1 + 0.2 ≠ 0.3`). `Cuenta.total` se construye **sumando** en cada pedido, y `Producto.precio` (que alimenta esos totales) también es `Float`. Como `Cuenta.total` es lo que se cobra y se reporta, la deriva impacta **directamente en la facturación**. El resto del sistema ya usa `Decimal(10,2)`; esto es además una inconsistencia.

**Solución — tres partes. Las tres son obligatorias; cambiar solo el esquema reintroduce el bug por la aritmética.**

**(a) Esquema:**
```prisma
// servicio-cuentas/prisma/schema.prisma
model Cuenta {
  // ...
  total Decimal @default(0) @db.Decimal(10, 2)  // antes: Float
}

// servicio-inventario/prisma/schema.prisma
model Producto {
  // ...
  precio Decimal @db.Decimal(10, 2)             // antes: Float
}
```

**(b) Migración de datos.** Haz **backup** primero. Si despliegas con `prisma db push`, avisará de posible pérdida de datos (es esperado: los floats se redondean a 2 decimales, que es justo la corrección). Si prefieres una migración SQL explícita y segura:
```sql
ALTER TABLE "cuentas"   ALTER COLUMN "total"  TYPE numeric(10,2) USING round("total"::numeric, 2);
ALTER TABLE "productos" ALTER COLUMN "precio" TYPE numeric(10,2) USING round("precio"::numeric, 2);
```

**(c) Aritmética.** Prisma devuelve objetos `Prisma.Decimal` (Decimal.js) para columnas `Decimal`. Todo cálculo monetario debe usar métodos decimales, no operadores de JS:
```typescript
import { Prisma } from '@prisma/client';

// ❌ MAL — reintroduce el error de float:
const total = pedidos.reduce((acc, p) => acc + Number(p.total), 0);

// ✅ BIEN:
const total = pedidos.reduce(
  (acc, p) => acc.add(new Prisma.Decimal(p.total ?? 0)),
  new Prisma.Decimal(0),
);
```
Lugares a revisar: `procesarPedidoCreado` y `procesarPedidoActualizado` (suma del snapshot), `cerrarCuenta` (aplicación de `descuento`), `dividirCuenta` (`total / numPartes` → `.div()`), y `calcularTotal` en pedidos (`precioUnitario * cantidad` → `.mul()`).

> **Nota sobre el snapshot JSON.** Dentro del campo `pedidos: Json` no se puede almacenar un `Decimal` nativo: `JSON.stringify` lo serializa como string. Guarda los totales como **string** y reconstrúyelos con `new Prisma.Decimal(p.total)` al sumar (el ejemplo de arriba ya lo hace).

**Cómo probarlo.** Test unitario que sume tres pedidos de `0.10 + 0.20 + 0.10` y verifique `total.toString() === '0.40'` (con float daría `0.4000000000000001`).

---

### 1.2 — [A2 cuentas] + [M5] Idempotencia y concurrencia en cuentas (un solo refactor)

**Estado:** 🔴 Confirmado. En `procesarPedidoCreado`, el código hace `.push(pedidoDto)` y suma a ciegas, **sin comprobar si el `id` ya existe**, y guarda con `findFirst` → mutar en memoria → `.update()` **sin transacción ni bloqueo**.

**Por qué van juntos.** La comprobación de duplicado solo es fiable si ocurre **dentro** de la misma transacción con bloqueo que arregla el *lost update*. Si la haces fuera, dos redentregas concurrentes pasan el chequeo a la vez y vuelves a duplicar. Son el mismo arreglo.

**Estrategia para cuentas:** no hace falta tabla `IdempotencyKey`. El propio snapshot es el "libro mayor" de deduplicación. La clave es **recalcular el total desde el snapshot** (auto-sanable) en vez de sumar deltas. Combínalo con un advisory lock (el mismo patrón que ya usas en caja) **sobre `mesaId`** —no `cuentaId`, porque la cuenta puede no existir aún en el camino de *fallback*.

```typescript
import { Prisma } from '@prisma/client';

async procesarPedidoCreado(envelope: DomainEventEnvelope<any>): Promise<void> {
  const pedido = envelope.data?.pedido ?? envelope.data;
  if (!pedido?.id || !pedido?.mesaId) return;

  await this.prisma.$transaction(async (tx) => {
    // Serializa accesos concurrentes a la misma mesa (reusa tu hashToInt de caja).
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(1234, ${this.hashToInt(pedido.mesaId)})`;

    // Re-leer DENTRO del lock. Releer fuera es exactamente lo que causa el lost update.
    let cuenta = await tx.cuenta.findFirst({
      where: { mesaId: pedido.mesaId, estado: 'ABIERTA' },
    });
    if (!cuenta) {
      cuenta = await tx.cuenta.create({ data: { mesaId: pedido.mesaId, pedidos: [], total: 0 } });
      await tx.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.CuentaAbierta,
          payload: JSON.stringify({
            cuenta: { id: cuenta.id, mesaId: cuenta.mesaId },
            metadata: { idempotencyKey: `cuenta.abierta:${cuenta.id}` },
          }),
          status: 'PENDING',
        },
      });
    }

    const snapshot = (cuenta.pedidos as any[]) ?? [];

    // IDEMPOTENCIA (A2): si el pedido ya está, es redentrega → no hacer nada.
    if (snapshot.some((p) => p.id === pedido.id)) return;

    snapshot.push(pedido);

    // Recalcular desde el snapshot (auto-sanable y Decimal-aware tras A3).
    const nuevoTotal = snapshot.reduce(
      (acc, p) => acc.add(new Prisma.Decimal(p.total ?? 0)),
      new Prisma.Decimal(0),
    );

    await tx.cuenta.update({
      where: { id: cuenta.id },
      data: { pedidos: snapshot, total: nuevoTotal },
    });
  });
}
```

Aplica el mismo patrón a **`procesarPedidoActualizado`**, reemplazando el pedido por `id` en vez de empujarlo. Esto además tolera entregas **fuera de orden** (que el "actualizado" llegue antes que el "creado"):

```typescript
async procesarPedidoActualizado(envelope: DomainEventEnvelope<any>): Promise<void> {
  const pedido = envelope.data?.pedido ?? envelope.data;
  if (!pedido?.id || !pedido?.mesaId) return;

  await this.prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(1234, ${this.hashToInt(pedido.mesaId)})`;
    const cuenta = await tx.cuenta.findFirst({
      where: { mesaId: pedido.mesaId, estado: 'ABIERTA' },
    });
    if (!cuenta) return;

    const snapshot = (cuenta.pedidos as any[]) ?? [];
    const idx = snapshot.findIndex((p) => p.id === pedido.id);
    if (idx === -1) snapshot.push(pedido);  // llegó actualizado antes que creado
    else snapshot[idx] = pedido;            // reemplazo idempotente

    const nuevoTotal = snapshot.reduce(
      (acc, p) => acc.add(new Prisma.Decimal(p.total ?? 0)),
      new Prisma.Decimal(0),
    );
    await tx.cuenta.update({
      where: { id: cuenta.id },
      data: { pedidos: snapshot, total: nuevoTotal },
    });
  });
}
```

> `hashToInt` ya lo tienes resuelto en caja para su advisory lock; reúsalo. Las colisiones de hash aquí solo causan serialización de más, **nunca** incorrectitud.

**Mejora estructural (opcional, recomendada a futuro).** Sacar los ítems del JSON a una **tabla hija** `CuentaPedido` con `@@unique([cuentaId, pedidoId])`. Entonces la deduplicación pasa a ser una **garantía de base de datos** (un insert duplicado falla con P2002) y el problema de concurrencia del JSON desaparece por completo. Es más trabajo, pero elimina toda esta clase de bugs.

**Cómo probarlo.** Test que invoque `procesarPedidoCreado` **dos veces** con el mismo `pedido.id` y verifique que el snapshot tiene 1 elemento y el total no se duplicó.

---

### 1.3 — [A2 inventario] Idempotencia en el descuento de stock

**Estado:** 🔴 Confirmado. `reducirStockAutomatico(id, cantidad)` solo recibe id y cantidad: hace un decremento directo, **ignorando de qué pedido proviene**. Una redentrega del evento `PedidoCreado` vacía el stock dos veces.

**Por qué la estrategia es distinta a cuentas.** El stock no tiene un "libro mayor" natural donde comprobar presencia (como sí lo es el snapshot en cuentas). Por eso aquí **sí** hace falta la tabla `IdempotencyKey`, comprobada **una vez por evento** (no por ítem), dentro de la misma transacción que los decrementos.

**Paso 1 — añadir el modelo (inventario no lo tiene):**
```prisma
// servicio-inventario/prisma/schema.prisma
model IdempotencyKey {
  key       String   @id
  createdAt DateTime @default(now())
  @@map("idempotency_keys")
}
```

**Paso 2 — procesar el evento completo de forma atómica.** Refactoriza el handler para que llame a un método de servicio que: registra la clave (si ya existe → redentrega → sale) y luego hace los decrementos atómicos condicionales que ya tienes.
```typescript
async procesarPedidoCreado(envelope: DomainEventEnvelope<any>): Promise<void> {
  const key = envelope.metadata?.idempotencyKey;
  if (!key) {
    // Sin clave no podemos deduplicar. Mejor mandar a DLQ que descontar a ciegas.
    throw new Error('PedidoCreado sin idempotencyKey');
  }
  const items = envelope.data?.pedido?.items ?? envelope.data?.items ?? [];

  await this.prisma.$transaction(async (tx) => {
    // 1) Registrar la clave. Si choca (P2002) → ya procesado → salir sin tocar stock.
    //    Va DENTRO de la transacción: si los decrementos fallan, también se revierte
    //    la clave, y el reintento vuelve a hacer todo limpio.
    try {
      await tx.idempotencyKey.create({ data: { key } });
    } catch (e: any) {
      if (e?.code === 'P2002') return;
      throw e;
    }

    // 2) Decremento atómico condicional por ítem (tu patrón actual, ya correcto).
    for (const item of items) {
      if (!item?.productoId || !item?.cantidad) continue;
      const res = await tx.producto.updateMany({
        where: { id: item.productoId, stockActual: { gte: item.cantidad } },
        data: { stockActual: { decrement: item.cantidad } },
      });
      if (res.count === 0) {
        this.logger.warn(`Stock insuficiente o sin control para ${item.productoId}`);
        continue;
      }
      const prod = await tx.producto.findUnique({ where: { id: item.productoId } });
      if (prod?.stockActual === 0) {
        await tx.producto.update({ where: { id: prod.id }, data: { disponible: false } });
      }
      // 3) Publicar ProductoActualizado vía outbox (con su propia idempotencyKey).
      await tx.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ProductoActualizado,
          payload: JSON.stringify({
            producto: { id: prod!.id, nombre: prod!.nombre, precio: prod!.precio, stockActual: prod!.stockActual, disponible: prod!.disponible },
            metadata: { idempotencyKey: `producto.actualizado:${prod!.id}:${key}` },
          }),
          status: 'PENDING',
        },
      });
    }
  });
}
```

> **Alternativa más robusta (a futuro):** una tabla `MovimientoStock` con `@@unique([pedidoId, productoId])`. Cada decremento registra un movimiento; el `UNIQUE` impide aplicarlo dos veces. Es el equivalente al "tabla hija" de cuentas y deja el doble descuento imposible por diseño.

**Decisión sobre eventos sin clave.** Lanzar (→ DLQ) es más seguro que descontar a ciegas. El Prerrequisito 0 garantiza que todos los eventos nuevos lleven clave, así que esto solo afectaría a mensajes legados en vuelo durante el despliegue.

**Cómo probarlo.** Test que procese el mismo `PedidoCreado` (misma `idempotencyKey`) dos veces y verifique que el stock bajó **una sola vez**.

---

## FASE 2 — Seguridad de sesión y acceso (prioridad alta)

> **Adelanta M1 y M6:** son de minutos y **no dependen** de la Fase 1. Conviene soltarlos en paralelo para reducir riesgo ya. M4 es el más costoso de los tres y tiene una dependencia con Kong.

### 2.1 — [M1] `@UsuarioActual()` debe confiar solo en lo ya verificado

**Estado:** 🔴 Confirmado. En `libs/observabilidad/src/lib/user.decorator.ts` se hace base64-decode del payload con el comentario *"sin verificar la firma (se asume que Kong ya lo validó)"*.

**Problema.** Si ese `sub` se usa para algo con valor de confianza —p. ej. **atribuir acciones en auditoría**— un atacante que alcance el servicio directamente (saltándose Kong) puede falsificar la identidad. Tratar un token no verificado como fuente de identidad es frágil.

**Solución (la más simple y robusta).** No re-decodificar nada: leer `req.user`, que el `JwtAuthGuard` **ya verificó criptográficamente**. En rutas sin guard, `req.user` es `undefined` → `null` (sin identidad forjable), que es el comportamiento seguro.
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    if (ctx.getType() !== 'http') return null;
    const request = ctx.switchToHttp().getRequest();
    return request.user?.sub ?? null; // solo lo verificado por Passport/JwtAuthGuard
  },
);
```
Si de verdad necesitas identidad en una ruta **sin** guard, verifica la firma explícitamente con `jsonwebtoken.verify(token, process.env.JWT_SECRET)` en vez de decodificar a ciegas.

**Cómo probarlo.** Test que envíe un JWT con firma inválida a una ruta guardada → 401 (lo bloquea el guard, y el decorador nunca ve un payload forjado).

---

### 2.2 — [M6] Rate limiting en `/auth/login`

**Estado:** 🔴 Confirmado. El controlador no aplica ningún throttle; `/auth/login` queda abierto a fuerza bruta / credential stuffing.

**Dos capas posibles (idealmente ambas):**

**(a) Kong (recomendada como control principal, centralizado en el borde).** Ya tienes Kong; activa su plugin de rate-limiting en la ruta de login:
```yaml
# Declarativo (kong.yml), o vía Admin API
plugins:
  - name: rate-limiting
    route: auth-login-route
    config:
      minute: 10
      policy: local   # usa 'redis' si Kong corre en varias instancias
```

**(b) App-level con `@nestjs/throttler` (defensa en profundidad).**
```bash
npm i @nestjs/throttler
```
```typescript
// servicio-identidad/src/app/app.module.ts
ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]), // global, suave
// providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]

// auth.controller.ts
@Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 intentos/min específico de login
@Post('auth/login')
login(@Body() command: LoginCommand) { /* ... */ }
```
> **Cuidado con las réplicas.** El throttler de NestJS es en memoria **por instancia**: con N réplicas el límite real es `limit × N`. Para un límite correcto en cluster, usa el storage de Redis (`nestjs-throttler-storage-redis`) o deja el control en Kong con `policy: redis`.

**Cómo probarlo.** Script que dispare 20 logins fallidos en un minuto y verifique que a partir del 6º responde `429 Too Many Requests`.

---

### 2.3 — [M4] Sacar el JWT de `localStorage`

**Estado:** 🔴 Confirmado. En `apps/pwa-cliente/src/store/auth.store.ts`, Zustand con `persist` guarda el token en `localStorage` (`nachopps-auth-storage`), accesible por cualquier JS de la página → exfiltrable por XSS.

> **Aviso de esfuerzo.** Este es el arreglo más invasivo de la Fase 2 porque toca el flujo de auth de punta a punta **y a Kong** (que hoy lee el header `Authorization`). Tienes dos caminos.

**Camino A — Solución correcta: cookie `httpOnly`.**
1. **Backend (login):** en vez de (o además de) devolver el token en el body, setéalo en una cookie inaccesible a JS:
   ```typescript
   res.cookie('access_token', token, {
     httpOnly: true, secure: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000,
   });
   ```
2. **`JwtStrategy`:** añade un extractor de cookie además del header:
   ```typescript
   jwtFromRequest: ExtractJwt.fromExtractors([
     (req) => req?.cookies?.access_token ?? null,
     ExtractJwt.fromAuthHeaderAsBearerToken(),
   ]),
   ```
3. **Kong:** debe poder validar el JWT desde la cookie, o traducir cookie → header. **Este es el punto de fricción**; valida cómo está configurado tu plugin JWT antes de comprometerte.
4. **Frontend:** quita el token del `persist` de Zustand (guarda como mucho el perfil no sensible). Configura Axios con `withCredentials: true` para que la cookie viaje sola.
5. **CSRF:** con cookies aparece el riesgo CSRF; `sameSite: 'strict'` lo mitiga, pero considera tokens anti-CSRF si hay flujos cross-site.

**Camino B — Mitigación interina (si A es muy disruptivo ahora):** reducir el `expiresIn` del token (hoy 24h) a algo corto (15–30 min) + implementar *refresh tokens*, y endurecer una **Content-Security-Policy** estricta para reducir la superficie de XSS. No elimina el problema, pero limita la ventana de un token robado.

**Cómo probarlo.** Tras el Camino A, verifica en DevTools que la cookie aparece como `HttpOnly` y que `localStorage` ya no contiene el token.

---

## FASE 3 — Resiliencia de eventos (prioridad media)

### 3.1 — [M2] Universalizar el patrón Outbox (reservas e identidad)

**Estado:** 🔴 Confirmado. En `reservas.service.ts` y `auth.service.ts` se inyecta `RabbitMQPublisherService` y se llama `await this.publisher.publish(...)` justo tras escribir en BD. Esto es el problema de *dual-write*: si la publicación falla tras el commit, el evento se pierde (una reserva confirmada podría **no enviar nunca** su notificación). Además contradice el invariante declarado en `rabbitmq_events_map.md`.

**Solución (mismo patrón que ya usan cuentas/mesas):**
1. Añadir el modelo `OutboxEvent` al esquema de **reservas** y **identidad**:
   ```prisma
   model OutboxEvent {
     id         String   @id @default(uuid())
     routingKey String
     payload    String
     status     String   @default("PENDING")
     attempts   Int      @default(0)        // ver 3.2
     createdAt  DateTime @default(now())
     updatedAt  DateTime @updatedAt
     @@index([status, createdAt])           // imprescindible (ver M3)
     @@map("outbox_events")
   }
   ```
2. Copiar el `OutboxProcessor` de un servicio existente (cuentas/mesas) a cada uno.
3. Reemplazar la publicación directa por una inserción en outbox **dentro de la misma transacción** que la escritura de negocio:
   ```typescript
   // reservas.service.ts — crear()  (antes vs. después)
   // ❌ ANTES:
   const reserva = await this.prisma.reserva.create({ data });
   await this.publisher.publish(RoutingKeys.ReservaCreada, { reserva }, 'servicio-reservas');

   // ✅ DESPUÉS:
   const reserva = await this.prisma.$transaction(async (tx) => {
     const r = await tx.reserva.create({ data });
     await tx.outboxEvent.create({
       data: {
         routingKey: RoutingKeys.ReservaCreada,
         payload: JSON.stringify({ reserva: r, metadata: { idempotencyKey: `reserva.creada:${r.id}` } }),
         status: 'PENDING',
       },
     });
     return r;
   });
   ```
4. Quitar `RabbitMQPublisherService` del constructor del `AppService`/`ReservasService` (debe quedar **solo** en el `OutboxProcessor`).

> En **identidad**, el evento `UsuarioAutenticado` del `login` se emite junto al `registrarAuditoria`: mete ambas escrituras (auditoría + outbox) en una `$transaction`.

**Cómo probarlo.** Crear una reserva, verificar que aparece una fila `PENDING` en `outbox_events` y que ~5s después está `PROCESSED` y el evento llegó al consumidor.

---

### 3.2 — [M3] Recuperación de `FAILED` y purga de `outbox_events`

**Estado:** 🟠 Parcial. El índice `@@index([status, createdAt])` **ya está** (al menos en cuentas) ✅. Pero el `OutboxProcessor` busca solo `status: 'PENDING'`, así que las filas `FAILED` quedan **atascadas para siempre**, y las `PROCESSED` se **acumulan sin límite** porque nada las borra.

**Solución — dos piezas.**

**(a) No marcar `FAILED` al primer error: reintentar con contador.** Añade `attempts Int @default(0)` (incluido arriba) y cambia la lógica: ante un fallo, incrementa `attempts` y **mantén `PENDING`** para que se reintente; solo pasa a `FAILED` (estado terminal, requiere intervención) tras `maxAttempts`.
```typescript
const MAX_ATTEMPTS = 5;

for (const evento of pendientes) {
  try {
    await this.publisher.publishRaw(evento.routingKey, JSON.parse(evento.payload));
    await this.prisma.outboxEvent.update({
      where: { id: evento.id }, data: { status: 'PROCESSED' },
    });
  } catch (err) {
    const attempts = evento.attempts + 1;
    await this.prisma.outboxEvent.update({
      where: { id: evento.id },
      data: attempts >= MAX_ATTEMPTS
        ? { status: 'FAILED', attempts }   // terminal → alertar
        : { attempts },                    // sigue PENDING → reintenta
    });
    this.logger.error(`Outbox ${evento.id} intento ${attempts} falló`, err);
  }
}
```
Expón una métrica Prometheus con el conteo de `FAILED` y crea una alerta en Grafana: una fila `FAILED` = evento perdido que necesita una persona.

**(b) Purga periódica de `PROCESSED`.** Un cron (p. ej. diario) que borre lo antiguo:
```typescript
@Cron(CronExpression.EVERY_DAY_AT_3AM)
async purgarProcesados() {
  const corte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días
  await this.prisma.outboxEvent.deleteMany({
    where: { status: 'PROCESSED', createdAt: { lt: corte } },
  });
}
```

> **No olvides la tabla `idempotency_keys`:** también crece sin límite. Aplica una purga equivalente (borra claves más antiguas que tu ventana máxima de redentrega, p. ej. 7 días).

**Cómo probarlo.** Forzar un fallo de publicación (apaga RabbitMQ un momento) y verificar que la fila incrementa `attempts` y permanece `PENDING`, no `FAILED` inmediato.

---

## FASE 4 — Deuda técnica, pulido y documentación (prioridad baja)

### 4.1 — [B4] Códigos HTTP
`auth/login` y `auth/validate` devuelven `201 Created` por defecto de NestJS, aunque no crean recursos. Añade `@HttpCode(200)`:
```typescript
@HttpCode(200)
@Post('auth/login')
login(@Body() command: LoginCommand) { /* ... */ }
```
Revisa también `cuentas/:id/dividir` (no crea recurso → 200).

### 4.2 — [B5] URL del gateway hardcodeada en el frontend
Hay literales `http://localhost:8000` en `apps/pwa-cliente/src/api/client.ts`, `Cocina.tsx` y `Pedidos.tsx` (incluida la URL del WebSocket). Centraliza vía variable de entorno de Vite:
```typescript
// client.ts
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
```
Crea `.env` / `.env.production` con `VITE_API_URL=...` (el prefijo `VITE_` es obligatorio en Vite) y reemplaza **todos** los literales, incluido el del WebSocket (`Cocina.tsx`). Requiere reconstruir el bundle.

### 4.3 — Documentación (no verificado contra código en esta pasada)
Estos venían de la auditoría original y no se re-verificaron en el código; inclúyelos para dejar la doc coherente:
- **[B1]** Reconciliar la contradicción de `shared-prisma`: el README dice "código muerto", `shared-prisma.md` dice "usada por 9/9" y los servicios se contradicen entre sí. Listar **exactamente** qué servicios usan la librería y cuáles tienen Prisma local.
- **[B2]** `contracts.md` dice "22 RoutingKeys" pero lista 18; varias claves (`ReservaConfirmada`, `MesaAsignada`, `MesaLiberada`, `ArqueoRealizado`, `StockBajo`, `StockDescontado`) no aparecen como publicadas/consumidas. Corregir el conteo y eliminar (o implementar) las claves muertas.
- **[B3]** `pedido.listo` y `ticket.generado` se publican pero nadie los consume. Completar la feature o dejar de publicarlos.

### 4.4 — [B6] Detalles menores
- bcrypt con coste **10**: aceptable, pero 12 es la recomendación de 2026. Cambio de una línea en `crearUsuario`.
- Inconsistencia de timeout en Circuit Breaker (default 3000ms vs 5000ms en caja). Cosmético; unifica si quieres.
- Latencia del Outbox (~5s) entre cambio de estado y publicación: aceptable para el dominio, solo documéntalo.

---

## Guardias de regresión (hallazgos YA corregidos — no los rompas)

Estos están parcheados en el código. Para que **no vuelvan** silenciosamente, añade pruebas/CI:

- **[C1] Secreto JWT.** Test que arranque el módulo de auth **sin** `JWT_SECRET` y espere que **lance**. Añade un escáner de secretos (p. ej. `gitleaks`) al CI.
- **[A1] Validación.** Test e2e que envíe payloads inválidos (`email` no-email, `numPartes: 0`, `descuento` negativo) y espere **400**.
- **[A4] Guards.** Test de integración que golpee `cuentas` e `inventario` **sin token** y espere **401**.
- **[M3-índice] `@@index([status, createdAt])`.** Confírmalo presente en **todos** los esquemas con `OutboxEvent` (al añadirlo a reservas/identidad en 3.1 ya queda cubierto).

---

## Checklist maestro de ejecución

**Prerrequisito 0 — Idempotency key (bloquea la Fase 1)**
- [ ] Auditar `createEventEnvelope`; fijar la clave al escribir el outbox, no al publicar.
- [ ] Claves deterministas de negocio en cada `OutboxEvent`.

**Fase 1 — Dinero e integridad**
- [ ] 1.1 A3: `Cuenta.total` y `Producto.precio` → `Decimal(10,2)` (esquema + migración + aritmética).
- [ ] 1.2 A2+M5 cuentas: `$transaction` + advisory lock + dedup por snapshot + recompute (creado y actualizado).
- [ ] 1.3 A2 inventario: modelo `IdempotencyKey` + check-and-record transaccional + decrementos atómicos.

**Fase 2 — Seguridad (M1 y M6 en paralelo, ya)**
- [ ] 2.1 M1: `@UsuarioActual()` lee `req.user.sub`.
- [ ] 2.2 M6: rate limiting en login (Kong y/o throttler con storage compartido).
- [ ] 2.3 M4: cookie `httpOnly` (Camino A) o token corto + refresh + CSP (Camino B).

**Fase 3 — Eventos**
- [ ] 3.1 M2: Outbox en reservas e identidad; quitar `publisher` de los `AppService`.
- [ ] 3.2 M3: `attempts` + reintento (no `FAILED` inmediato) + alerta + purga de `outbox_events` e `idempotency_keys`.

**Fase 4 — Pulido y docs**
- [ ] 4.1 B4 `@HttpCode(200)`. · [ ] 4.2 B5 `VITE_API_URL`. · [ ] 4.3 B1/B2/B3 docs. · [ ] 4.4 B6 menores.

**Guardias de regresión**
- [ ] Tests C1 / A1 / A4 + `gitleaks` en CI.
