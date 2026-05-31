# Brief para Claude Code — Extracción Exhaustiva para Implementación One-Shot

## Rol y objetivo

Vas a hacer una **extracción de solo lectura, exhaustiva**, del monorepo (Nx: `apps/<servicio>`, `libs/<lib>`, `infra/`). El objetivo es entregar **todo el contexto exacto** que necesita un autor externo para escribir, **en una sola pasada y sin volver a preguntar**, la implementación completa de un plan de remediación (Fases 1–4). **No estás implementando nada**: solo recolectando y reportando.

> Esto es **distinto** a un reconocimiento de preguntas sí/no. Aquí necesito el **contenido completo y literal** de cada archivo que se va a modificar o reflejar, además de las **formas exactas** (payloads, DTOs, firmas) que, si faltan, forzarían una ida y vuelta. Cuando dudes entre "resumir" o "pegar completo": **pega completo**.

## Reglas estrictas

1. **SOLO LECTURA.** No modifiques, crees ni borres código. No instales nada. No ejecutes la app. No corras `prisma migrate`/`db push`. No hagas commits.
2. **Archivos completos, verbatim.** Para cada archivo pedido, pega el **contenido íntegro** dentro de un bloque con su ruta como encabezado: ` ### FILE: ruta/al/archivo`. Excepción: archivos generados o de boilerplate enorme e irrelevante (p. ej. cliente Prisma generado, `node_modules`) — no los pegues; menciónalos y omite.
3. **Formas exactas con evidencia.** Donde pido "extraer una forma" (un payload, una firma, un shape de DTO), respóndela con la cita `archivo:línea` + el snippet exacto.
4. **Probar ausencias y señalar sorpresas.** Si algo no existe (un módulo, una carpeta de migraciones, un import), dilo con el comando que lo prueba. Si encuentras algo que **diverge** de lo esperado, anótalo en la sección final de "Bloqueos / sorpresas".
5. **Un entregable:** un archivo `contexto-implementacion.md` con la estructura de la plantilla del final. Si supera el límite de tamaño, divídelo en `contexto-implementacion-parte-N.md`, pero el conjunto debe estar **completo** (no recortes contenido pedido).

---

## Mapa: qué voy a implementar (para que entiendas qué contexto es crítico)

- **A3:** `Float`→`Decimal(10,2)` en `Cuenta.total` y `Producto.precio` + aritmética con `Prisma.Decimal`.
- **A2+M5 (cuentas):** `$transaction` + advisory lock (`hashtext`) + dedup por `pedido.id` + recompute del total; fallback inline que reemite `CuentaAbierta`.
- **A2 (inventario):** modelo `IdempotencyKey` + dedup por `pedido.id` + conservar emisión de `ProductoActualizado`.
- **M2:** añadir `OutboxEvent` + `OutboxProcessor` a **reservas** e **identidad**; quitar publicación directa.
- **M3:** campo `attempts` + reintento (no `FAILED` inmediato) + cron de purga de `outbox_events` e `idempotency_keys` + alerta `FAILED`.
- **M1:** sanear/borrar `@UsuarioActual()`.
- **M6:** plugin de rate-limiting por-ruta en Kong para `/auth/login`.
- **M4:** JWT a cookie `httpOnly` (extractor en estrategia + cookie-parser + frontend `withCredentials` + Kong).
- **B4:** `@HttpCode(200)` en login/validate/dividir.
- **B5:** `VITE_API_URL` en frontend (Axios + WebSocket).
- **Regresión:** tests para C1/A1/A4.

---

## Bloques de extracción

### Bloque 0 — Mensajería compartida y contratos (base de todo)
**Archivos completos:**
- `libs/contracts/src/messaging/envelope.ts` (incluye `createEventEnvelope`, `DomainEventEnvelope`, **y la interfaz `EventMetadata` completa**).
- `libs/contracts/src/events/routing-keys.ts` (enum `RoutingKeys`, `NACHOPPS_EXCHANGE`, `CONSUMER_BINDING_ALL_DOMAIN_EVENTS`).
- `libs/contracts/src/index.ts`.
- `libs/contracts/src/domains/pedidos.ts`, `cuentas.ts`, `inventario.ts`, `reservas.ts`, `identidad.ts` (DTOs, Commands, Payloads — completos).
- `libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts` (completo: `publish`, `onModuleInit`, setup del canal/exchange).
- `libs/shared-rabbitmq/src/lib/rabbitmq.module.ts`, `rabbitmq.constants.ts`, `src/index.ts`.

**Formas a extraer:**
- ¿`EventMetadata` ya tiene un campo `idempotencyKey?`? (cita exacta).
- Firma exacta de `publish(...)` y si el `OutboxProcessor` le pasa `producer` y un payload ya parseado.

### Bloque 1 — servicio-cuentas (A2 + M5 + A3)
**Archivos completos:**
- `apps/servicio-cuentas/src/app/app.service.ts` (**todos** los métodos).
- `apps/servicio-cuentas/src/app/app.controller.ts`.
- `apps/servicio-cuentas/src/app/events.controller.ts`.
- `apps/servicio-cuentas/src/app/outbox.processor.ts`.
- `apps/servicio-cuentas/src/app/app.module.ts`.
- `apps/servicio-cuentas/src/main.ts`.
- `apps/servicio-cuentas/prisma/schema.prisma`.
- El `PrismaService` de cuentas (busca `apps/servicio-cuentas/src/**/prisma.service.ts`).

**Formas a extraer (con cita):**
- Payload exacto de `CuentaAbierta`, `CuentaCerrada`, `TicketGenerado` tal como se insertan en `outbox_events`.
- Shape de `CuentaDto` y de `mapToDto`/`toDto` (cómo se serializa `total` y `pedidos`).
- En `procesarPedidoActualizado`: ¿escribe de vuelta `snapshot[index] = pedidoDto`? (el dump previo se cortó en la línea 130 — necesito el método completo).
- `cerrarCuenta` y `dividirCuenta` completos (para migrar su aritmética a `Decimal`).

### Bloque 2 — servicio-inventario (A2 + A3)
**Archivos completos:**
- `apps/servicio-inventario/src/app/app.service.ts` (todos los métodos).
- `apps/servicio-inventario/src/app/app.controller.ts`.
- `apps/servicio-inventario/src/app/events.controller.ts`.
- `apps/servicio-inventario/src/app/outbox.processor.ts`.
- `apps/servicio-inventario/src/app/app.module.ts`.
- `apps/servicio-inventario/src/main.ts`.
- `apps/servicio-inventario/prisma/schema.prisma`.
- El `PrismaService` de inventario.

**Formas a extraer (con cita):**
- Payload exacto de `ProductoCreado` y `ProductoActualizado` tal como se emiten hoy.
- Cómo el handler de `PedidoCreado` extrae los ítems, y **si el payload incluye `pedido.id`** (crítico).
- Shape de `ProductoDto`.

### Bloque 3 — servicio-pedidos (A3 + payload de PedidoCreado)
**Archivos completos:**
- `apps/servicio-pedidos/src/app/app.service.ts` (en especial `persistirPedido`, `calcularTotal`, `validarYMapearItems`, `mapToDto`).
- `apps/servicio-pedidos/src/app/outbox.processor.ts`.
- `apps/servicio-pedidos/prisma/schema.prisma`.

**Formas a extraer (con cita):**
- El payload **exacto** del `OutboxEvent` `PedidoCreado` (¿incluye `pedido.id` y `items[]` con `productoId`/`cantidad`?). Esto define las claves de idempotencia de cuentas e inventario.
- Dónde se hace `precioUnitario * cantidad` y demás aritmética monetaria.

### Bloque 4 — servicio-caja (patrón a reflejar)
**Archivos completos:**
- `apps/servicio-caja/src/app/app.service.ts` (sobre todo `registrarPago` con su **advisory lock**).
- `apps/servicio-caja/src/app/outbox.processor.ts`.
- `apps/servicio-caja/prisma/schema.prisma`.

**Formas a extraer (con cita, literal):**
- **La línea exacta de `pg_advisory_xact_lock(...)`**: qué función de hash usa (`hashtext`?), qué namespace/constante, si es la forma de 1 o 2 argumentos. La voy a reflejar en cuentas.
- La firma de `hashToInt` **si existe** (el recon previo dijo que no; confírmalo con `grep -rn "hashToInt\|hashtext\|advisory" apps/servicio-caja`).

### Bloque 5 — servicio-reservas (M2)
**Archivos completos:**
- `apps/servicio-reservas/src/app/reservas.service.ts`.
- El/los controller(s) de reservas y su `app.module.ts`.
- `apps/servicio-reservas/src/main.ts`.
- `apps/servicio-reservas/prisma/schema.prisma`.
- Su `PrismaService` (confirma si usa `createBasePrismaService` de `@org/shared-prisma`).

**Formas a extraer:** payloads de `ReservaCreada`/`ReservaCancelada`/`ReservaConfirmada` y las líneas exactas de `this.publisher.publish(...)`.

### Bloque 6 — servicio-identidad (M2 + M4 + regresión C1/A1)
**Archivos completos:**
- `apps/servicio-identidad/src/auth/auth.service.ts`.
- `apps/servicio-identidad/src/auth/auth.controller.ts`.
- El `app.module.ts`/`auth.module.ts` (wiring de guards, `ValidationPipe`, `APP_GUARD`).
- `apps/servicio-identidad/src/main.ts` (**completo** — `ValidationPipe`, CORS, ausencia de cookie-parser, `initTracing`).
- `apps/servicio-identidad/prisma/schema.prisma`.

**Formas a extraer:** payload de `UsuarioAutenticado`, la línea del `publish`, y el punto exacto del flujo de `login` donde se devuelve el token (para inyectar la cookie en M4).

### Bloque 7 — OutboxProcessor canónico + ScheduleModule (M2/M3)
**Archivos completos:**
- El `outbox.processor.ts` **de mesas** (referencia limpia, para copiar a reservas/identidad).
- El `app.module.ts` **de mesas** (para ver cómo se registra el processor y si hay `ScheduleModule`).

**Formas a extraer:**
- ¿Dónde y cómo se registra `ScheduleModule.forRoot()`? (`grep -rn "ScheduleModule\|@nestjs/schedule\|@Cron" apps/ libs/`). Lo necesito para los nuevos processors y para el cron de purga.
- Confirma que `@nestjs/schedule` está en `package.json`.

### Bloque 8 — shared-auth / observabilidad (M1, M4, regresión C1)
**Archivos completos:**
- `libs/shared-auth/src/lib/jwt.strategy.ts` (`jwtFromRequest`, `validate`).
- `libs/shared-auth/src/lib/shared-auth.module.ts` (cómo maneja hoy el `JWT_SECRET` tras el fix de C1).
- `libs/shared-auth/src/lib/jwt-auth.guard.ts`.
- `libs/shared-auth/src/index.ts`.
- `libs/observabilidad/src/lib/user.decorator.ts`.

### Bloque 9 — Frontend (M4, B5)
**Archivos completos:**
- `apps/pwa-cliente/src/store/auth.store.ts`.
- `apps/pwa-cliente/src/api/client.ts`.
- `apps/pwa-cliente/src/views/Cocina/Cocina.tsx` y `apps/pwa-cliente/src/views/Pedidos/Pedidos.tsx` (sobre todo el establecimiento del WebSocket / `socket.io-client` y los literales `http://localhost:8000`/`ws://...`).
- `apps/pwa-cliente/vite.config.ts`.
- `apps/pwa-cliente/package.json`.
- Cualquier `.env`/`.env.*` del frontend y todos los usos de `import.meta.env` (`grep -rn "import.meta.env" apps/pwa-cliente/src`).

**Formas a extraer:** cómo se crea hoy la conexión WebSocket (librería, URL, opciones) y si `socket.io-client` es dependencia.

### Bloque 10 — Infra (M4, M6)
**Archivos completos:**
- `infra/docker-compose.yml` (**completo**: todos los servicios, sus `environment`, puertos, el servicio **Redis** con host/puerto, RabbitMQ, Kong, y si hay `deploy.replicas`).
- `infra/kong/kong.yml.template` (**completo**: `services`, `routes`, y **todos** los `plugins`, incluido el `rate-limiting` global (~líneas 46-52) y el `jwt` (~86-91)).
- El mecanismo que **renderiza** el template: busca cómo se convierte `kong.yml.template`→`kong.yml` (`grep -rn "kong.yml" infra/ scripts/`; revisa el `Dockerfile` de Kong y `levantar-infra.ps1`). Necesito saber qué variables de entorno sustituye (¿`envsubst`?) para que mi plugin por-ruta encaje.

**Formas a extraer:** parámetros exactos del plugin `rate-limiting` global (límite, `limit_by`, `policy`), nombres de las `routes` (para añadir una específica de login), y datos de conexión a Redis.

### Bloque 11 — Build / migración / test (define cómo entrego los cambios)
**Archivos completos:**
- `package.json` raíz (scripts, dependencies, devDependencies).
- `nx.json`.
- `tsconfig.base.json` (alias de paths `@org/*`).
- Un `project.json` representativo (p. ej. `apps/servicio-cuentas/project.json`) — targets de build/test/prisma.
- Los bloques `generator`/`datasource` de un `schema.prisma` (p. ej. cuentas) — proveedor, `output` del cliente, `previewFeatures`, adaptador (PrismaPg/driverAdapters).
- `scripts/levantar-infra.ps1` y `scripts/reconstruir-y-probar.ps1` (**completos** — para entender el flujo de migración/seed/test al que debo ajustarme).

**Formas a extraer / responder:**
- **¿Estrategia de migraciones?** ¿Existen carpetas `apps/*/prisma/migrations`, o es `prisma db push` (sin migraciones versionadas)? (`find apps -path "*/prisma/migrations" -type d`). Esto decide si escribo SQL de migración o cambios de schema + `db push`.
- **¿Hay harness de tests?** Busca `jest.config.*`, `jest.preset.js`, proyectos `*-e2e`, y **un `*.spec.ts` de ejemplo** (pégalo) para reflejar el estilo. ¿Cómo se arranca un `Test.createTestingModule`? ¿Hay estrategia de BD de test?

### Bloque 12 — Variables de entorno y config
- Pega `.env`/`.env.example` si existen.
- Lista **todas** las variables de entorno en uso: `grep -rn "process.env\." apps/ libs/ | sort -u` (al menos `JWT_SECRET`, `DATABASE_URL`, `RABBITMQ_URI`, `OTEL_*`, y cualquier `REDIS_*`).

---

## Sección final obligatoria — Bloqueos / sorpresas

Lista **todo** lo que podría impedir una implementación de una sola pasada. Sé concreto. Ejemplos del tipo de cosas a reportar:
- "`ScheduleModule` no está importado en ningún módulo; los nuevos crons lo requieren."
- "El `kong.yml.template` se renderiza con `envsubst` usando estas variables: …"
- "No hay carpetas de migraciones; el flujo es `prisma db push` vía `reconstruir-y-probar.ps1`."
- "El `PrismaService` de cuentas extiende `createBasePrismaService` pese a que la doc decía que no."
- "No existe harness de e2e; solo hay specs unitarios con este patrón: …"
- Cualquier diferencia entre lo que asumía el plan y lo que hay en el código.

---

## Plantilla del entregable (`contexto-implementacion.md`)

```markdown
# Contexto de Implementación — Nachopps

## Índice de archivos incluidos
(lista de todas las rutas pegadas)

## Bloque 0 — Mensajería y contratos
### FILE: libs/contracts/src/messaging/envelope.ts
```ts
<contenido completo>
```
### Formas a extraer
- EventMetadata.idempotencyKey: <SÍ/NO + cita>
- Firma publish(...): <cita>
...

## Bloque 1 — servicio-cuentas
### FILE: apps/servicio-cuentas/src/app/app.service.ts
```ts
<contenido completo>
```
... (resto de archivos del bloque)
### Formas a extraer
- Payload CuentaAbierta: <cita>
- ¿procesarPedidoActualizado reescribe snapshot[index]?: <SÍ/NO + cita>
...

## Bloque 2 … 12
(igual: FILE completos + Formas a extraer por bloque)

## Estrategia de migraciones
<respuesta + evidencia>

## Harness de tests
<respuesta + spec de ejemplo>

## Variables de entorno (lista)
<salida del grep>

## Bloqueos / sorpresas
<lista concreta>
```

## Recordatorio final
- Cero modificaciones, instalaciones, migraciones o ejecución. Solo leer y reportar.
- **Pega archivos completos**; no resumas el código pedido. Si algo es enorme y autogenerado, omítelo y dilo.
- Si no encuentras un archivo en la ruta indicada, búscalo (`find`/`grep`) y reporta la ruta real o su ausencia.
- La meta es que, con tu reporte, no haga falta volver a preguntarte **nada** para escribir toda la implementación.
