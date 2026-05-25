# ESTADO.md — Nachopps Restobar

> Documento volátil: se actualiza al completar cada DT o fase relevante.
> Para contexto permanente del proyecto ver @AGENTS.md
> Última actualización: 23 Mayo 2026 (Refactor frontend completado)

---

## Salud del proyecto: 9.5/10

**Rama:** `main`
**Último commit:** `57cb9fe` — feat: refactor UI a Tailwind, WebSockets bidireccionales en KDS, pagos mixtos y estación routing
**Compilando:** 11 proyectos limpio · **45/45 tests pasando** · Frontend compilando limpio

---

## Deuda técnica

### ✅ Resueltas

| ID | Problema | Cómo se resolvió |
|---|---|---|
| DT-01 | Llamadas HTTP en cascada (N × GET por ítem) | `POST /inventario/validar-lote` — batch en una sola llamada |
| DT-02 | Sin idempotencia en handlers de identidad | `IdempotencyKey` en schema + `checkAndRecordIdempotencyKey` en PrismaService + envelope unwrapping + retry interceptor |
| DT-03 | Tests unitarios no ejecutables (oxc no soporta decorators) | `unplugin-swc` instalado + `.swcrc` + `vitest.config.mts` actualizado. |
| DT-04 | Caché JWT en Kong (ADR-005) + resiliencia + refresh tokens | **Fase 1:** Plugin Lua `jwt-cache` en Kong 3.9 con LRU por worker, TTL=60s techo. **Fase 2:** Modo degradado con `degraded_mode=true`, sesiones sobreviven caída de identidad (ttl=exp-now). **Fase 3:** Refresh tokens con rotación en `servicio-identidad`, access token 15 min + refresh token 7 días. |
| DT-05 | Race condition en validación de stock | Resuelto junto con DT-01 vía `validarLote()` atómico |
| DT-06 | `any` en tipos críticos (cuentas, reportes) | `CuentaDto.pedidos: PedidoDto[]`, `TicketDto.items: PedidoItemDto[]`, `VentasDiaDatos`, `DividirCuentaResult` |
| DT-07 | Doble patrón API en frontend (apiClient vs axios directo) | `caja.service.ts` migrado a `apiClient`. Todos los servicios unificados |
| DT-08 | Sin OpenAPI/Swagger | Swagger UI en todos los 9 servicios con BearerAuth |
| DT-09 | Secrets hardcodeados (`JWT_SECRET`, passwords BD, `kong.yml`) | `.env` raíz con todas las variables. `docker-compose.yml` usa `${VARIABLE}`. Kong: template `kong.yml.template` + entrypoint `envsubst`. `.env.example` actualizado con placeholders. |
| DT-10 | Migración webpack a tsc (alto uso de RAM y builds lentos) | `package.json` de 9 servicios a `@nx/js:tsc` (`tsc -p`), aliases con `tsc-alias`. `nx.json` limpio de sync de ts. Errores estrictos de TS corregidos en todos los servicios. |

### 🟡 Pendientes

*(Ninguna por ahora)*

---

## DT-04 — Estado por fase

| Fase | Descripción | Estado |
|---|---|---|
| Fase 1 | Plugin Lua `jwt-cache` en Kong (cumple ADR-005) | ✅ Completada |
| Fase 2 | Modo degradado: TTL = vida restante del token | ✅ Completada |
| Fase 3 | Refresh tokens en `servicio-identidad` | ✅ Completada |

Ver @docs/DT04_JWT_CACHE_KONG.md para código, archivos y criterios de aceptación.

---

## Estado por microservicio (23 Mayo 2026)

| Servicio | Endpoints | Eventos | Auth | Idempotencia | Tests | Swagger |
|---|---|---|---|---|---|---|
| identidad | ✅ | ✅ | ✅ propio | ✅ | ✅ 7 tests | ✅ |
| mesas | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 8 tests | ✅ |
| pedidos 🎯 | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 5 tests | ✅ |
| cuentas | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| reservas | ✅ | ✅ | ✅ APP_GUARD | ❌ | ✅ 8 tests | ✅ |
| inventario | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| notificaciones | ✅ | ✅ (9 eventos) | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| caja | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| reportes | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 5 tests | ✅ |

**Nota:** `servicio-reservas` no tiene idempotencia en sus handlers. Pendiente si se amplía.

---

## Intervenciones realizadas (Mayo 2026)

### Fase 1 — Tests ejecutables (DT-03)
- `unplugin-swc` en devDependencies
- `.swcrc` con `legacyDecorator`, `decoratorMetadata`, target `es2021`, module `es6`
- `vitest.config.mts` con `swc.vite()` + `resolve.tsconfigPaths: true`
- 4 `tsconfig.spec.json` creados (pedidos, caja, cuentas, inventario)
- 3 tests mock arreglados

### Fase 2 — Idempotencia en identidad (DT-02)
- `IdempotencyKey` en schema Prisma
- `checkAndRecordIdempotencyKey` en PrismaService
- 3 event handlers refactorizados con envelope unwrapping + idempotency check + retry interceptor

### Fase 3 — Tipos fuertes (DT-06)
- 9 ocurrencias de `any` eliminadas en 4 archivos
- Interfaces `DividirCuentaResult`, `VentasDiaDatos` creadas

### Fase 4 — Unificar API services frontend (DT-07)
- `caja.service.ts` migrado de `axios` directo a `apiClient`

### Fase 5 — Validación de stock en lote (DT-01 + DT-05)
- `POST /inventario/validar-lote` con `ValidarLoteRequest` / `ValidarLoteResponse`
- `validarLote()` en inventario: una sola query para todos los productos
- `crearPedido()` en pedidos: reemplaza N × GET por una llamada batch

### Fase 6 — OpenAPI/Swagger (DT-08)
- `@nestjs/swagger` instalado
- Swagger UI en `:3001/api/docs` con BearerAuth

### Extra — Webpack fix en notificaciones
- `TsconfigPathsPlugin` agregado — resolvía error con `@org/shared-rabbitmq`

### Extra — Refactor UI
- Tailwind CSS 4 aplicado en PWA
- WebSockets bidireccionales en KDS
- Pagos mixtos y estación routing implementados

### DT-04 — Caché JWT + resiliencia + refresh tokens (Mayo 2026)
- `infra/kong/plugins/jwt-cache/handler.lua` + `schema.lua` creados
- `infra/kong/Dockerfile` creado — imagen custom Kong 3.9 con plugin
- `infra/kong/kong.yml` — plugin `jwt-cache` global con `degraded_mode: true`
- `infra/docker-compose.yml` — kong: `image` → `build`
- `apps/servicio-identidad/prisma/schema.prisma` — modelo `RefreshToken`
- `apps/servicio-identidad/src/auth/` — `refresh()`, `logout()`, rotación de tokens
- `libs/contracts/src/domains/identidad.ts` — `refresh_token` y `expires_in` opcionales
- Helper de hashing: `sha256_hex` de `kong.tools.sha256` ✅ disponible en Kong 3.9
- Verificación: logs muestran MISS → HIT, modo degradado ttl=3351s, refresh token rotación confirmada

### DT-09 — Secrets a variables de entorno (23 Mayo 2026)
- `.env` raíz creado con 7 variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `RABBITMQ_DEFAULT_USER`, `RABBITMQ_DEFAULT_PASS`, `JWT_SECRET`, `KONG_JWT_SECRET`, `GRAFANA_ADMIN_PASSWORD`
- `.env.example` actualizado con placeholders `change_me`
- `infra/docker-compose.yml` — todos los secrets migrados a `${VARIABLE}`
- `infra/kong/kong.yml.template` + `docker-entrypoint-wrapper.sh` — envsubst para inyectar `KONG_JWT_SECRET`
- `infra/kong/Dockerfile` actualizado con `gettext-base`, template, entrypoint wrapper
- Ningún secret literal en archivos commiteables

### Swagger en 8 servicios restantes (23 Mayo 2026)
- `SwaggerModule.setup('api/docs', ...)` agregado en `main.ts` de mesas, pedidos, cuentas, reservas, inventario, notificaciones, caja y reportes
- `addBearerAuth()` en todos los DocumentBuilder
- Cada servicio con título y descripción propios

### Tests unitarios en servicios sin cobertura (23 Mayo 2026)
- `auth.service.spec.ts` — identidad: 7 tests (validarToken, cambiarRol, logout, listarUsuarios)
- `app.service.spec.ts` — mesas: 8 tests (listarMesas, crearMesa, actualizarEstado, obtenerMesa)
- `reservas.service.spec.ts` — reservas: 8 tests (listar, crear, confirmar, cancelar)
- `app.service.spec.ts` — notificaciones: 3 tests (getData, persistirNotificacion)
- `app.service.spec.ts` — reportes: 5 tests (getData, procesarPagoRegistrado, getDashboardMetrics)
- `tsconfig.spec.json` creados para los 5 servicios
- `vitest.config.mts` actualizado con los 9 servicios
- **45/45 tests pasando** (subió de 14)

### Refactor UI (23 Mayo 2026)
- shadcn/ui React: 14 componentes (Button, Card, Dialog, Badge, Table, DropdownMenu, Select, Tabs, Avatar, Input, Label, Separator, Tooltip, Checkbox)
- Nuevo sistema de diseño: tokens HSL neutros, modo oscuro, sidebar con tokens, fuente Instrument Sans
- AppLayout + Sidebar colapsable a íconos, NavMain con filtro por rol, NavUser con avatar + dropdown logout
- 10 vistas refactorizadas con shadcn/ui, patrones visuales del documento de diseño
- ModalCobro migrado a shadcn Dialog con pagos mixtos
- Limpieza: Modal.tsx, ReservaCard.tsx, ReservaFormModal.tsx, InventarioModals.tsx, cuentas.service.ts, import roto Configuracion
- Build limpio, 45/45 tests pasando

### DT-10 — Migración de Webpack a TSC (Mayo 2026)
- 9 microservicios migrados de `@nx/webpack` a `@nx/js:tsc` (`tsc -p`) para evitar el excesivo consumo de RAM del monorepo.
- `tsconfig.app.json` de cada app y `package.json` actualizados, ejecutando `tsc-alias` tras compilación.
- Agregado script `node -e "const fs=require('fs'); if(fs.existsSync('apps/...')) fs.cpSync(...)"` al target `build` para mantener clientes Prisma locales en la carpeta `dist/`.
- `tsconfig.base.json` actualizado habilitando `"esModuleInterop": true` y `"isolatedModules": false` para solucionar dependencias como `opossum`.
- Eliminado `@nx/js/typescript` plugin del `nx.json` para evitar errores cíclicos `TS6305` y estado persistente `out of sync`.
- Resueltos más de 20 errores de tipado estricto `TS2322`, `TS6133`, `TS2351` ignorados previamente por SWC/Webpack.
- Verificado el build de la imagen Docker de `servicio-identidad` apuntando al nuevo path `dist/apps/servicio-identidad/apps/servicio-identidad/src/main.js`.


---

## Próximos pasos recomendados

1. **Agregar idempotencia** en servicio-reservas si se amplía su uso
2. **Limpiar warning** de `vi.mock("bcrypt")` en test de identidad (mover al top-level)
3. **E2E tests** — 9 Playwright scaffolds sin implementar
