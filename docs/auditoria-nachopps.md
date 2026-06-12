# Auditoría atómica — NachoPps SOA

**Alcance:** monorepo completo (9 microservicios NestJS, 6 librerías compartidas, PWA React, API Gateway Kong + plugin Lua, infraestructura Docker, CI). Revisión componente por componente: autenticación, autorización, mensajería event-driven, concurrencia, integridad de dinero, resiliencia, despliegue y frontend.

**Veredicto:** codebase de calidad profesional. Los patrones distribuidos difíciles (Outbox, idempotencia, saga, rotación de tokens) están correctamente implementados y verificados a nivel de código, no asumidos. **No hay vulnerabilidades críticas ni de alta severidad.** Los hallazgos son de severidad media a baja y de higiene; el más relevante es una fuga de integridad contable cuando un pedido se rechaza/cancela después de consolidarse en la cuenta.

Severidad: 🔴 Alta · 🟠 Media · 🟡 Baja · ⚪ Informativa/higiene

---

## 1. Hallazgos que requieren acción

### 🟠 M-01 — El total de la cuenta no se recalcula al rechazar/cancelar un pedido ya consolidado

**Dónde:** `apps/servicio-cuentas/src/app/app.service.ts` (`procesarPedidoActualizado`, líneas ~150-190) en interacción con `apps/servicio-pedidos/.../pedidos-saga.service.ts`.

**Qué pasa:** cuando llega `PedidoCreado`, `servicio-cuentas` empuja el `pedidoDto` completo al array `pedidos` de la cuenta y recalcula `total` sumando `p.total` de cada pedido. Esto es correcto y idempotente. El problema es el ciclo de vida posterior:

- Si un ítem (o el pedido entero) pasa a `RECHAZADO_SIN_STOCK` por la compensación de saga, o el pedido se cancela, `servicio-pedidos` emite `PedidoActualizado` con el `pedido` actualizado. `procesarPedidoActualizado` reemplaza el snapshot por índice y **recalcula el total sumando `p.total`**.
- Pero el `total` del pedido rechazado/cancelado **no se pone a cero**: en `pedidos-saga.service.ts`, ni `procesarStockInsuficiente` ni `actualizarEstado` (transición a `Cancelado`) recomputan el campo `total` del pedido. Sólo cambian `estado`. El `mapPedidoToDto` sigue emitiendo el `total` original.

**Consecuencia:** una cuenta puede quedar con un `total` que incluye el importe de ítems que nunca se sirvieron (rechazados por falta de stock) o de un pedido cancelado. Caja exige pago del *total exacto* (`montoRecibido.equals(totalConDescuento)`), así que el cliente pagaría de más, o el pago se bloquea hasta intervención manual. Es un defecto de **integridad contable**, no de seguridad, pero en un sistema de cobro es de impacto directo.

**Recomendación:** que `servicio-cuentas` excluya del cálculo los pedidos en estado `CANCELADO`/`RECHAZADO_SIN_STOCK`, o mejor, que `servicio-pedidos` recompute y propague el `total` del pedido cuando rechaza ítems (sumar sólo ítems no rechazados) y al cancelar (total 0). Lo segundo mantiene una única fuente de verdad del importe. Añadir un test de saga que cubra "pedido consolidado en cuenta → rechazo parcial de stock → total de cuenta refleja sólo lo servido".

---

### 🟠 M-02 — Fallback silencioso de CORS a `localhost` en producción

**Dónde:** `libs/observabilidad/src/bootstrap.ts` (~línea 62) y `apps/servicio-notificaciones/.../notifications.gateway.ts` (~línea 19).

**Qué pasa:** si `CORS_ORIGIN` no está definida, el bootstrap cae a `['http://localhost:4200']` y el gateway WS a una lista de `localhost`. En producción la variable es obligatoria por convención (`.env.example`, compose con `${VAR:?}`), pero el código **no falla** si falta: arranca con una política CORS inesperada en lugar de abortar.

**Consecuencia:** un despliegue mal configurado no se detiene; degrada en silencio a un origen de desarrollo. Es defensa en profundidad debilitada (Kong ya hace CORS por delante), pero el principio fail-fast que el resto del repo aplica con rigor (`RABBITMQ_URI`, `JWT_*`, `DB_PASS`) aquí se rompe.

**Recomendación:** en `bootstrap.ts`, si `NODE_ENV === 'production'` y no hay `CORS_ORIGIN`, lanzar igual que con `RABBITMQ_URI`. Aplicar lo mismo al `@WebSocketGateway`.

---

### 🟡 L-01 — `procesarPagoRecibido` en pedidos itera y actualiza sin idempotencia ni lote

**Dónde:** `apps/servicio-pedidos/src/app/app.service.ts` (~línea 470, `procesarPagoRecibido`).

**Qué pasa:** al recibir `PagoRegistrado`, hace `findMany` de pedidos no pagados de la mesa y los actualiza uno a uno en un bucle, sin transacción envolvente, sin `idempotencyKey` y sin advisory lock. A diferencia del resto de consumidores del repo (que reclaman clave atómica), este handler no es idempotente explícitamente: una reentrega del evento repite el `updateMany` lógico. En la práctica es convergente (poner `PAGADO` sobre `PAGADO` es no-op), así que el riesgo real es bajo, pero rompe la consistencia del patrón y no está envuelto en `$transaction`, de modo que un fallo a mitad de bucle deja pedidos parcialmente actualizados.

**Recomendación:** envolver en `$transaction` y convertir a un único `updateMany({ where: { mesaId, estado: { notIn: [PAGADO, CANCELADO] } }, data: { estado: PAGADO } })`. Un solo statement, atómico, idempotente por naturaleza.

---

### 🟡 L-02 — `degraded_mode` del plugin jwt-cache acepta tokens revocados hasta su `exp`

**Dónde:** `infra/kong/plugins/jwt-cache/handler.lua` (`cache_store`, modo degradado).

**Qué pasa:** el propio código lo documenta con honestidad: en modo degradado el TTL de la entrada es el tiempo restante completo del token, así que *"tokens revocados siguen siendo aceptados hasta su exp"*. Es un trade-off deliberado de disponibilidad (seguir operando si identidad cae). Con access tokens de 15 min el blast radius es acotado, pero un logout/revocación no surte efecto inmediato en el gateway mientras dure la degradación.

**Recomendación:** mantenerlo, pero documentar el riesgo en el runbook de incidentes y considerar acortar `JWT_EXPIRES_IN` si el modelo de amenazas lo exige. No es un defecto, es una decisión que conviene que esté firmada explícitamente.

---

### 🟡 L-03 — Verificación de firma JWT delegada a `passport-jwt` con dos algoritmos activos

**Dónde:** `libs/shared-auth/src/lib/jwt-keys.ts` + `jwt.strategy.ts`.

**Qué pasa:** el `secretOrKeyProvider` lee el `alg` del header **del propio token** para decidir qué clave usar (RS256→pública, HS256→secreto de servicio), con `algorithms: ['RS256','HS256']`. El diseño mitiga correctamente la confusión de algoritmo clásica (un atacante no puede firmar HS256 con la clave pública porque el secreto HS256 es distinto y no es la pública). Está bien razonado y comentado. El residuo de riesgo es de proceso: cualquier futuro cambio que iguale el secreto HS256 a la clave pública, o que añada un tercer algoritmo, reabre el vector. La superficie existe porque se aceptan dos familias de algoritmos en el mismo verificador.

**Recomendación:** ninguna acción urgente; el código actual es seguro. Añadir un test explícito que confirme que un token HS256 firmado con la clave pública (como secreto) es rechazado, para blindar contra regresiones.

---

## 2. Verificado y correcto (con evidencia)

### Autenticación e identidad
- **Timing-safe en login:** hash dummy precomputado (`DUMMY_HASH`) y `bcrypt.compare` ejecutado también en las ramas de email inexistente/usuario inactivo. El 401 no revela si la cuenta existe. (`auth.service.ts` T-35)
- **Re-hash perezoso correcto:** rehashea el *texto plano verificado*, no el hash almacenado. El comentario advierte expresamente del error de hashear el hash. (T-05)
- **Rotación de refresh tokens:** tokens opacos de 48 bytes, sólo se guarda el hash. Rotación con *compare-and-swap* (`updateMany WHERE id=… AND revokedAt IS NULL`, comprueba `count===1`). Reuso de un token ya rotado → revoca la cadena completa del usuario. Ventana de gracia (`REFRESH_REUSE_GRACE_MS`) para distinguir carreras legítimas de robo. (T-34)
- **Protección del último admin:** `cambiarRol` bloquea filas `ADMIN` con `SELECT … FOR UPDATE` y cuenta en aplicación dentro de la transacción; impide degradar al último administrador y registra auditoría. Rechaza la auto-degradación. (T-31, T-04)
- **CSRF double-submit con comparación en tiempo constante:** `timingSafeEqual` con guarda de longitud; exime métodos seguros y peticiones con Bearer. (`jwt-auth.guard.ts` T-36)
- **Cookies:** `httpOnly` + `secure` (auto en prod) + `sameSite` (`strict` por defecto) en access y refresh; la cookie CSRF es legible (correcto para double-submit). El access token vive sólo en memoria en la PWA, nunca en `localStorage`.

### Autorización (RBAC) — revisado endpoint por endpoint
- `JwtAuthGuard` registrado como `APP_GUARD` global en cada servicio; `RolesGuard` por método o controller. Endpoints sin `@Roles` quedan abiertos sólo a autenticados (documentado y consistente con los handlers `@EventPattern`, que no llevan `@Roles`).
- Operaciones sensibles correctamente restringidas: crear/editar productos y stock → `ADMIN/SISTEMA/GERENCIA`; crear mesas → `ADMIN/SISTEMA`; reportes → `ADMIN/SISTEMA/GERENCIA`; crear usuarios y cambiar roles → `ADMIN`. El endpoint de reproceso de outbox → `ADMIN/SISTEMA`.
- **WebSocket:** handshake autenticado con el mismo modelo de confianza que HTTP; unión a *rooms* por rol y emisión dirigida por matriz de roles (`wsRoomsForPattern`), no broadcast global — cierra la fuga de eventos de pago/arqueo a cualquier conectado. (T-19)

### Mensajería event-driven
- **Transactional Outbox unificado** (`libs/resiliencia/outbox.processor.ts`): claim de lote con `UPDATE … WHERE id IN (SELECT … FOR UPDATE SKIP LOCKED) RETURNING` → dos réplicas nunca toman el mismo evento. `batchSize` sanitizado con `Math.trunc` (no inyectable pese a `$queryRawUnsafe`; es entero interno). Rescate de huérfanos `PUBLISHING` tras 60 s. Purga por retención. Routing key fuera del catálogo de contratos → `FAILED` inmediato + alerta.
- **Idempotencia de consumidores por insert-as-claim:** el `idempotencyKey.create()` va *dentro de la misma `$transaction`* que la mutación de negocio, capturando `P2002`. Verificado en inventario (descuento de stock), cuentas (dedup por `pedido.id`), pedidos (proyección de productos y compensación de stock). Si el claim falla, toda la transacción revierte: imposible doble-aplicar.
- **Publicador AMQP:** mensajes `persistent`, exchanges `durable`, DLQ por cola con `x-dead-letter-exchange`. Propagación de contexto OpenTelemetry en headers. Fail-fast sin `RABBITMQ_URI`.
- **Retry interceptor:** backoff exponencial (1s/2s/4s), `ack` en éxito, `nack(requeue=false)` → DLQ tras agotar 3 reintentos.
- **Purga de idempotency keys centralizada** en los 6 servicios que tienen la tabla (antes faltaba en 4, la tabla crecía sin límite). (T-06)

### Concurrencia
- **Reserva de stock (pedidos):** `pg_advisory_xact_lock(hashtext(productoId))` + `UPDATE … WHERE stockActual >= cantidad RETURNING`. Iteración ordenada por `Map` para reducir deadlocks. A prueba de sobreventa.
- **Anti-doble-booking (reservas):** índice único parcial `(fecha, hora, mesaPreferida) WHERE estado IN ('PENDIENTE','CONFIRMADA')` a nivel DB (migración `20260611010000`). El chequeo previo en app es sólo UX; la garantía real es el constraint + captura de `P2002` → 409. Race-proof.
- **Pago único (caja):** dentro de `$transaction` con advisory lock por cuenta: agrega pagos previos y rechaza si `> 0` ("la cuenta ya tiene un pago"), valida estado `ABIERTA`, exige monto exacto con aritmética `Decimal`. Doble pago imposible.
- **Estado de mesa (mesas):** *optimistic locking* con `updateMany WHERE id=… AND estado=esperado`, lanza `ConflictException` si `count===0`.

### Integridad de dinero
- Todas las columnas monetarias son `Decimal(10,2)` en los schemas Prisma (cuentas, caja, pedidos, inventario). La aritmética usa `Prisma.Decimal` (`.plus/.minus/.times/.dividedBy/.max`), no floats. Conversión a `number` sólo en los DTO de salida. Recompute de totales desde el array (no `increment` ciego). El único hueco es M-01 (no excluir rechazados/cancelados).

### Resiliencia
- **Circuit breaker** (opossum) en llamadas síncronas (pedidos→mesas/inventario, caja→cuentas): timeout 3s, umbral 50%, reset 30s, registro por método con eventos logueados.
- **GlobalExceptionFilter** unificado: normaliza a JSON estable y **no filtra stacks ni mensajes internos al cliente** en errores no-HTTP ("Internal server error" genérico).
- **Saga de pedidos:** máquina de transiciones explícita con estados terminales; "cocina manda" deriva el estado de producción desde los ítems sin pisar estados comerciales; compensación `StockInsuficiente` idempotente por `(pedidoId, productoId)`.

### Despliegue y secretos
- **Dockerfile:** multi-stage con digest pinneado (`node:22-alpine@sha256:…`), `npm ci --omit=dev --ignore-scripts`, `USER node` (no root), runtime mínimo sin toolchain, `typescript` purgado de la imagen final.
- **JWT_PRIVATE_KEY** aparece **exactamente una vez** en `docker-compose.prod.yml`, sólo en `servicio-identidad`. La pública va a todos + Kong. Modelo asimétrico correcto: filtrar la pública no permite forjar tokens de usuario.
- **Fail-fast** consistente con `${VAR:?msg}` en prod para `DB_PASS`, `RABBITMQ_PASS`, `JWT_*`, `SERVICE_JWT_SECRET`, `KONG_CORS_ORIGINS`.
- **Docker secrets** vía `*_FILE` en el entrypoint (lee `/run/secrets/*`). `.env` e `infra/secrets/*` en `.gitignore`.
- **Entrypoint** usa `prisma migrate deploy` (migraciones versionadas), nunca `db push --accept-data-loss`. Espera a la BD antes de arrancar.
- **Kong Admin API (8001) no se publica** en prod (loopback). Swagger gateado por `NODE_ENV`. Ruta `/telemetry/metrics` bloqueada externamente vía `request-termination` y exenta en el guard para healthchecks internos.
- **Guard de drift de migraciones** (`check-migration-drift.sh`) con shadow DB: detecta schemas editados sin migración, justo el patrón del índice parcial de reservas que no se expresa en Prisma.

### Frontend (PWA)
- Token en memoria, nunca en almacenamiento persistente; limpieza activa de una clave legada de `localStorage`.
- CSRF automático en métodos mutantes (lee la cookie double-submit); `Idempotency-Key` (UUID v4 con Web Crypto) en cada POST.
- Refresh de 401 con *single-flight* (`refreshInFlight`) y guarda anti-bucle (`retried`, exclusión de rutas `/auth/*`).
- Sin `dangerouslySetInnerHTML` ni `innerHTML` en código de producción (sólo en specs). Superficie XSS mínima; React escapa por defecto.

### CI / Calidad
- Dos workflows con `permissions` mínimos (`contents: read`); build afectado por Nx; e2e en Docker contra Kong.
- Cobertura con pisos anti-regresión calibrados (branches 45 / lines 53 / stmts 52) y documentación honesta del objetivo de subir a 80%. 64 specs unitarios + 38 archivos e2e.
- Stress tests dedicados: concurrencia, alta contención, idempotencia de stock + DLQ, caos de RabbitMQ, réplicas de outbox, límites de seguridad.

---

## 3. Higiene y observaciones menores (⚪)

- **H-01 — Advisory locks con classid compartido `1234`:** cuentas (`mesaId`), caja (`cuentaId`) e inventario (`id`) usan `pg_advisory_xact_lock(1234, hash(...))`. No colisionan **porque cada servicio tiene su propia base de datos** (database-per-service), así que el espacio de locks es independiente por servicio. Dentro de cada servicio el segundo argumento (hash del id) los separa. No es un bug; conviene un comentario que deje claro que el `1234` es intencional y aislado por DB, para que nadie asuma coordinación entre servicios.
- **H-02 — 51 usos de `any`/`as any`** en `src`, concentrados en handlers de eventos (`procesarPedidoCreado(pedido: any)`) y en el array JSON `pedidos` de la cuenta. Los contratos de `libs/contracts` ya existen; tiparlos cerraría la brecha y habría hecho M-01 detectable en compilación.
- **H-03 — Credenciales débiles en `docker-compose.yml` (dev) y seed** (`POSTGRES_PASSWORD: secret`, `admin@nachopps.pe / nachopps123`). Acotado a desarrollo (prod usa interpolación), pero conviene un banner "DEV ONLY" bien visible para que nadie copie el compose de dev a un VPS.
- **H-04 — `GRAFANA_PASS` con default `admin`** en prod compose (`${GRAFANA_PASS:-admin}`). A diferencia de los demás secretos, este no es fail-fast: un despliegue sin la variable deja Grafana con admin/admin. Endurecer a `${GRAFANA_PASS:?...}`.
- **H-05 — Bloat de configuración de agentes:** `.agents`, `.cursor`, `.gemini`, `.opencode`, `.commandcode` suman ~1 MB de skills/planes duplicados (varios `SKILL.md` byte-a-byte entre `.agents` y `.cursor`). No afecta runtime; ensucia el repo y el árbol de revisión. Considerar consolidar o `.gitignore`-ar los que sean generados.
- **H-06 — Módulo Compras es mock** (`apps/pwa-cliente/src/data/compras.mock.ts`), sin microservicio. Ya documentado en el README como alcance pendiente; no es defecto oculto.
- **H-07 — `SERVICE_AUD_ENFORCE` con modo tolerante:** el rechazo estricto de audiencia S2S puede degradarse a "warn". Ambos compose lo fijan en `true`; el camino tolerante existe como rollback. Asegurar que nunca se documente como configuración estándar.

---

## 4. No encontrado (ausencia de vectores comunes)

Sin `eval`/`child_process`/`execSync` en código de aplicación · sin SQL inyectable (los `$executeRaw` usan tagged templates o enteros sanitizados con `Math.trunc`) · sin secretos hardcodeados · sin `.only`/`fdescribe` colados en tests · sin `console.log` en código de servicio (sólo en teardown e2e y tracing) · sin TODO/FIXME reales pendientes · sin stacks filtrados al cliente · sin tokens en almacenamiento persistente del navegador.

---

## 5. Prioridad de remediación sugerida

1. **M-01** (integridad contable) — corregir antes de cualquier uso real de cobro. Es el único hallazgo con impacto directo en dinero del cliente.
2. **M-02** y **H-04** (fail-fast de CORS y Grafana) — endurecimiento de despliegue de bajo esfuerzo, alto valor.
3. **L-01** (idempotencia de `procesarPagoRecibido`) — alinear con el patrón del resto del repo.
4. **H-02** (tipar handlers de eventos) — inversión que previene clases enteras de bugs como M-01.
5. Resto de higiene según capacidad.

El estado general es el de un sistema diseñado por alguien que entiende los modos de fallo de la arquitectura distribuida y los abordó deliberadamente. La distancia entre esto y "listo para producción de verdad" es corta: cerrar M-01 y el endurecimiento de despliegue.
