# Brief para Claude Code — Reconocimiento de Solo Lectura del Estado Actual

## Rol y objetivo

Vas a hacer un **reconocimiento de solo lectura** del monorepo (Nx: `apps/<servicio>`, `libs/<lib>`). El objetivo es producir un **retrato exacto y verbatim** de partes específicas del código, para que una auditoría externa pueda validar si las modificaciones propuestas son correctas. **No estás arreglando nada todavía.**

## Reglas estrictas (no negociables)

1. **SOLO LECTURA.** No modifiques, crees ni borres archivos de código. No ejecutes la app. No instales dependencias. No corras `prisma migrate` / `prisma db push`. No hagas commits.
2. **Verbatim, no parafraseado.** Para cada archivo/símbolo pedido, copia el **código tal cual**, con **números de línea** (`cat -n`, `grep -n`, o `sed -n 'A,Bp'`).
3. **Probar las ausencias.** Si algo no existe (un modelo, un `OutboxProcessor`, una dependencia), dilo explícitamente y muestra el comando que lo confirma (ej. un `grep -rn` que devuelve vacío). "No existe" es una respuesta válida y valiosa.
4. **Responde cada pregunta** de cada sección con `[SÍ] / [NO] / [PARCIAL]` + **evidencia** (`archivo:línea` + snippet). No respondas de memoria; básate solo en lo que ves en el repo.
5. **Un solo entregable:** un archivo nuevo llamado `reporte-estado-actual.md` con la estructura de la plantilla del final. Es lo único que escribes.

---

## Qué inspeccionar y qué preguntas responder

> Para cada bloque: vuelca los archivos/símbolos indicados (verbatim, con líneas) y responde las preguntas con evidencia.

### Bloque 0 — Clave de idempotencia (es lo más crítico de validar)

**Volcar:**
- La función `createEventEnvelope` completa (busca en `libs/shared-rabbitmq`; si no, `grep -rn "createEventEnvelope" libs/`).
- La interfaz `DomainEventEnvelope` (`libs/contracts/.../messaging/envelope.ts`).
- El método `publish(...)` de `RabbitMQPublisherService` (`libs/shared-rabbitmq/.../rabbitmq-publisher.service.ts`).
- 2–3 ejemplos reales de inserción en `OutboxEvent` (`grep -rn "outboxEvent.create\|OutboxEvent" apps/` y pega los bloques).

**Responder:**
- ¿`createEventEnvelope` **genera** `idempotencyKey`? Si sí, ¿con qué (UUID, hash) y **en qué momento** se invoca: al crear el sobre o al publicar?
- ¿El `OutboxProcessor` invoca `createEventEnvelope` (o pone la clave) **en el momento de publicar**? → Si la clave se genera al publicar, cada republicación produce una clave distinta.
- ¿Las inserciones actuales de `OutboxEvent` incluyen ya una `idempotencyKey` dentro del `payload`? ¿Es **determinista de negocio** (ej. `pedido.creado:<id>`) o **aleatoria**?
- ¿Cómo leen los consumidores la clave? (`envelope.metadata?.idempotencyKey`, otro campo, o no la leen).

### Bloque 1 — A2 + M5 en servicio-cuentas

**Volcar (verbatim, con líneas) de `apps/servicio-cuentas/src/app/app.service.ts`:**
- `procesarPedidoCreado`, `procesarPedidoActualizado`, `abrirCuenta`, `cerrarCuenta`, `dividirCuenta`, `procesarPagoRegistrado`.
- También el `events.controller.ts` de cuentas (handlers de eventos).

**Volcar de servicio-caja:** el método que usa `pg_advisory_xact_lock` y la función `hashToInt` (o equivalente) que calcula el entero del lock (`grep -rn "advisory\|hashToInt\|hash(" apps/servicio-caja/`).

**Responder:**
- ¿`procesarPedidoCreado` usa `this.prisma.$transaction`? ¿Usa `pg_advisory_xact_lock`?
- ¿Comprueba si el `pedido.id` ya está en el snapshot antes de agregarlo? (esperado: NO)
- ¿Calcula el total **sumando el delta** del pedido nuevo, o **recalculando** desde el array? (esperado: delta)
- En el path de **fallback** (cuenta no existe → se crea sola), ¿se inserta un `OutboxEvent` de `CuentaAbierta`? (necesito saber si hoy la mesa llega a marcarse OCUPADA)
- ¿`procesarPedidoActualizado` es idempotente / tolera reenvíos?
- ¿Existe `hashToInt` reutilizable en caja? ¿En qué archivo:línea?

### Bloque 2 — A2 en servicio-inventario

**Volcar:**
- El handler de `PedidoCreado` en `apps/servicio-inventario/src/app/events.controller.ts`.
- `reducirStockAutomatico`, `crearProducto`, `actualizarStock` de `app.service.ts` (verbatim).
- `apps/servicio-inventario/prisma/schema.prisma` **completo**.

**Responder:**
- ¿Existe un modelo `IdempotencyKey` en el schema de inventario? (esperado: NO; pruébalo con `grep -n "IdempotencyKey" apps/servicio-inventario/prisma/schema.prisma`)
- ¿El handler lee `envelope.metadata?.idempotencyKey`? ¿Hay alguna deduplicación hoy?
- ¿`reducirStockAutomatico` recibe el `pedidoId`/clave del evento, o solo `(id, cantidad)`?
- Tras el decremento, ¿se inserta un `OutboxEvent` de `ProductoActualizado`?
- ¿El decremento usa `updateMany` con `where: { stockActual: { gte: cantidad } }` (atómico condicional)?

### Bloque 3 — A3 (Float vs Decimal en dinero)

**Volcar (con líneas):**
- Las líneas exactas de `Cuenta.total` (cuentas/schema) y `Producto.precio` (inventario/schema).
- `calcularTotal` y `mapToDto` de `apps/servicio-pedidos/src/app/app.service.ts`.
- Resultado de `grep -rn "Number(\|\.total\|precio\|reduce(\| + \| \* \| / " apps/servicio-cuentas/src apps/servicio-inventario/src apps/servicio-pedidos/src` filtrado a aritmética monetaria (no inflar con falsos positivos; quédate con las líneas que tocan dinero/totales/precios).

**Responder:**
- Tipo actual exacto de `Cuenta.total` y `Producto.precio`.
- Lista de **todos** los puntos donde se hace aritmética de dinero con operadores primitivos de JS (`+`, `*`, `/`, `Number(...)`) en cuentas, inventario y pedidos. (Para saber qué hay que migrar a `Prisma.Decimal`.)

### Bloque 4 — M1 (`@UsuarioActual()`)

**Volcar:** `libs/observabilidad/src/lib/user.decorator.ts` **completo**.

**Responder:**
- ¿Decodifica el Base64 del JWT **sin verificar la firma**?
- ¿Hay rutas que dependan de este decorador y **no** tengan `JwtAuthGuard`? (`grep -rn "UsuarioActual" apps/`)

### Bloque 5 — M2 (Outbox en reservas e identidad)

**Volcar:**
- `apps/servicio-reservas/prisma/schema.prisma` y `apps/servicio-identidad/prisma/schema.prisma` **completos**.
- `reservas.service.ts`: métodos `crear`, `confirmar`, `cancelar` (verbatim).
- `auth.service.ts`: el bloque del `login` donde emite `UsuarioAutenticado` (verbatim).
- **Un `OutboxProcessor` existente** (de cuentas o mesas) **completo**, para confirmar el patrón a copiar.

**Responder (crítico):**
- ¿`servicio-reservas` tiene un modelo `OutboxEvent`? ¿Tiene un archivo `OutboxProcessor`? (esperado: NO a ambos; pruébalo con `find apps/servicio-reservas -iname "*outbox*"` y `grep -n "OutboxEvent" apps/servicio-reservas/prisma/schema.prisma`)
- Lo mismo para `servicio-identidad`.
- ¿`reservas.service.ts` inyecta `RabbitMQPublisherService` y llama `publish(...)` **directo** tras el `create`? ¿En qué línea?
- ¿`auth.service.ts` publica `UsuarioAutenticado` directo (sin outbox)?

### Bloque 6 — M3 (recuperación FAILED + purga + índices)

**Volcar:**
- El `OutboxProcessor` de cuentas **completo** (su consulta, su manejo de error, su `@Cron`).
- El bloque del modelo `OutboxEvent` de **cada** servicio que lo tenga (`grep -rn -A12 "model OutboxEvent" apps/*/prisma/schema.prisma`).
- Todos los modelos `IdempotencyKey` (`grep -rn -A6 "model IdempotencyKey" apps/*/prisma/schema.prisma`).

**Responder:**
- ¿El `OutboxProcessor` consulta **solo** `status: 'PENDING'`? ¿Marca `FAILED` al primer fallo? ¿Existe un campo `attempts`?
- ¿Hay **algún** `@Cron` de purga de `outbox_events` en cualquier servicio? (esperado: NO)
- ¿El índice `@@index([status, createdAt])` está presente en `OutboxEvent` de **cada** servicio? (lista servicio por servicio: SÍ/NO)
- ¿Qué servicios tienen tabla `idempotency_keys`? ¿Alguno la purga?

### Bloque 7 — M6 (rate limiting en login)

**Volcar:**
- `auth.controller.ts` de identidad **completo**.
- `app.module.ts` de identidad **completo**.
- Dependencias: `cat apps/servicio-identidad/package.json` y `cat package.json` (raíz) — sección `dependencies`.
- La definición de `servicio-identidad` en el `docker-compose.yml` (incluyendo `deploy.replicas` / si se levanta más de una instancia).
- La config de Kong relevante a la ruta de login (busca `kong.yml`, `kong.yaml`, `*.kong.*` o config declarativa en `infra/`).

**Responder:**
- ¿`@nestjs/throttler` está en alguna `package.json`? (SÍ/NO + archivo)
- ¿Hay `ThrottlerModule` importado y un `ThrottlerGuard` registrado (como `APP_GUARD` o `@UseGuards`)? ¿Hay `@Throttle` en el login? (esperado: NO)
- ¿Cuántas réplicas de `servicio-identidad` define el compose? (importa para saber si un throttler en memoria sería incorrecto)
- ¿Kong tiene un plugin `rate-limiting`? Pega el bloque relevante o confirma que no existe.

### Bloque 8 — M4 (JWT en cookie httpOnly)

**Volcar:**
- `apps/pwa-cliente/src/store/auth.store.ts` **completo**.
- El `jwtFromRequest` / extractor en `libs/shared-auth/src/lib/jwt.strategy.ts`.
- `apps/servicio-identidad/src/main.ts` **completo** (necesito ver si hay `cookie-parser`, CORS, `ValidationPipe`, `initTracing`).
- `apps/pwa-cliente/src/api/client.ts` **completo** (baseURL, `withCredentials`, interceptores).
- La config de Kong: cómo valida el JWT (plugin `jwt` leyendo el header `Authorization`), y si toca/propaga cookies.

**Responder:**
- ¿`auth.store.ts` persiste el token en `localStorage` (Zustand `persist`)?
- ¿La estrategia JWT extrae **solo** del header `Authorization: Bearer`? (esperado: SÍ)
- ¿`main.ts` de identidad tiene `cookie-parser` montado? (esperado: NO)
- ¿Axios usa `withCredentials: true`? ¿El CORS del backend permite credenciales?
- ¿Kong valida el JWT desde el header? ¿Hay algo que indique que podría leer cookies? (esto determina cuánto cuesta el cambio)

---

## Apéndices a incluir al final del reporte (verbatim)

A. **Árbol del repo** acotado: `apps/` y `libs/` a 2–3 niveles, más `infra/` (`find apps libs infra -maxdepth 3 -type d | sort`, y listado de archivos clave). Incluye dónde están los `main.ts`, `app.module.ts` y los `*outbox*`.

B. **Todos los `schema.prisma`** de los 9 servicios, completos. (Son cortos y de altísimo valor para validar A3, A2, M3.)

C. **`docker-compose.yml`** (al menos: lista de servicios, `replicas`/escalado, RabbitMQ, Kong, y dónde se monta la config de Kong).

D. **Config de Kong** declarativa (el/los archivos), completa o al menos las secciones de servicios/rutas/plugins.

E. **`main.ts`** de: identidad, cuentas, inventario, reservas (para ver pipes/guards/cookie-parser/tracing globales).

F. **`app.module.ts`** de: identidad, cuentas, inventario, reservas (para ver `APP_GUARD`, `APP_INTERCEPTOR`, módulos importados).

G. **Versiones**: `node -v` no; en su lugar pega de `package.json` las versiones de `@nestjs/*`, `prisma`, `@prisma/client`, `opossum`, `amqp-connection-manager`, `zustand`, `axios` (raíz y por app si difieren).

---

## Plantilla del entregable (`reporte-estado-actual.md`)

Genera el archivo con **exactamente** esta estructura:

```markdown
# Reporte de Estado Actual del Código — Nachopps

## Resumen de respuestas (tabla)
| Bloque | Pregunta clave | Respuesta | Evidencia (archivo:línea) |
|--------|----------------|-----------|----------------------------|
| 0 | ¿idempotencyKey se genera al publicar? | SÍ/NO | ... |
| 1 | ¿procesarPedidoCreado deduplica por id? | SÍ/NO | ... |
| 1 | ¿fallback emite CuentaAbierta? | SÍ/NO | ... |
| 2 | ¿inventario tiene IdempotencyKey? | SÍ/NO | ... |
| 2 | ¿reducirStockAutomatico recibe la clave? | SÍ/NO | ... |
| 3 | tipo de Cuenta.total / Producto.precio | ... | ... |
| 5 | ¿reservas tiene OutboxProcessor? | SÍ/NO | ... |
| 5 | ¿identidad tiene OutboxProcessor? | SÍ/NO | ... |
| 6 | ¿OutboxProcessor lee solo PENDING? | SÍ/NO | ... |
| 6 | ¿hay cron de purga? | SÍ/NO | ... |
| 6 | índice [status,createdAt] por servicio | lista | ... |
| 7 | ¿@nestjs/throttler instalado? | SÍ/NO | ... |
| 7 | ¿ThrottlerGuard registrado? | SÍ/NO | ... |
| 7 | réplicas de identidad en compose | N | ... |
| 7 | ¿Kong tiene rate-limiting? | SÍ/NO | ... |
| 8 | ¿token en localStorage? | SÍ/NO | ... |
| 8 | ¿estrategia JWT solo header? | SÍ/NO | ... |
| 8 | ¿cookie-parser en main.ts? | SÍ/NO | ... |
| 8 | ¿Kong valida JWT por header? | SÍ/NO | ... |

## Bloque 0 — Idempotencia
### Volcados (verbatim, con líneas)
...
### Respuestas con evidencia
...

## Bloque 1 — Cuentas (A2 + M5)
...

## Bloque 2 — Inventario (A2)
...

## Bloque 3 — Dinero (A3)
...

## Bloque 4 — @UsuarioActual (M1)
...

## Bloque 5 — Outbox reservas/identidad (M2)
...

## Bloque 6 — Outbox FAILED/purga/índices (M3)
...

## Bloque 7 — Rate limiting (M6)
...

## Bloque 8 — Cookie httpOnly (M4)
...

## Apéndice A — Árbol del repo
...
## Apéndice B — Todos los schema.prisma
...
## Apéndice C — docker-compose.yml
...
## Apéndice D — Config de Kong
...
## Apéndice E — main.ts (identidad, cuentas, inventario, reservas)
...
## Apéndice F — app.module.ts (identidad, cuentas, inventario, reservas)
...
## Apéndice G — Versiones de dependencias
...
```

## Recordatorio final
- Cero modificaciones, cero instalaciones, cero migraciones, cero ejecución de la app. Solo leer y reportar.
- Si un archivo es enorme, pega solo el rango relevante con `sed -n 'A,Bp'`, pero **no resumas** el código pedido: tiene que ser literal.
- Si no encuentras algo, deja constancia del comando de búsqueda y su salida vacía.
