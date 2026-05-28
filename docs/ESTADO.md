# ESTADO.md — Nachopps Restobar

> Documento volátil: se actualiza al completar cada DT o fase relevante.
> Para contexto permanente del proyecto ver @AGENTS.md
> Última actualización: 28 Mayo 2026 (Saneamiento completado, 41/41 tests)

---

## Salud del proyecto: 9.5/10

**Rama:** `main`
**Compilando:** 10 proyectos limpio · **41/41 tests unitarios pasando** · Frontend compilando limpio

---

## Deuda técnica

### ✅ Resueltas

| ID | Problema | Cómo se resolvió |
|---|---|---|
| DT-01 | Llamadas HTTP en cascada (N × GET por ítem) | `POST /inventario/validar-lote` — batch en una sola llamada |
| DT-02 | Sin idempotencia en handlers de identidad | `IdempotencyKey` en schema + `checkAndRecordIdempotencyKey` en PrismaService + envelope unwrapping + retry interceptor |
| DT-03 | Tests unitarios no ejecutables (oxc no soporta decorators) | `unplugin-swc` instalado + `.swcrc` + `vitest.config.mts` actualizado |
| DT-04 | Caché JWT en Kong (ADR-005) + resiliencia + refresh tokens | **Fase 1:** Plugin Lua `jwt-cache` en Kong 3.9 con LRU por worker, TTL=60s techo. **Fase 2:** Modo degradado con `degraded_mode=true`. **Fase 3:** Refresh tokens con rotación en `servicio-identidad`. |
| DT-05 | Race condition en validación de stock | Resuelto junto con DT-01 vía `validarLote()` atómico |
| DT-06 | `any` en tipos críticos (cuentas, reportes) | Interfaces tipadas creadas |
| DT-07 | Doble patrón API en frontend (apiClient vs axios directo) | `caja.service.ts` migrado a `apiClient`. Todos los servicios unificados |
| DT-08 | Sin OpenAPI/Swagger | Swagger UI en todos los 9 servicios con BearerAuth |
| DT-09 | Secrets hardcodeados (`JWT_SECRET`, passwords BD, `kong.yml`) | `.env` raíz con todas las variables. Template Kong + `envsubst`. |
| DT-10 | Migración webpack a tsc | **9/9 servicios migrados a tsc. Webpack residual eliminado.** |
| DT-11 | Mocks de tests desactualizados (8 fallos) | **Resuelto. 41/41 tests pasan.** Se mockearon `updateMany`, `$transaction`, `$executeRaw`, `aggregate`, `outboxEvent.create`. CircuitBreaker inertizado en test. |
| DT-12 | PrismaService duplicado en 3 servicios | **Resuelto** — migrados a `createBasePrismaService()` |
| DT-13 | `IdempotencyKey` faltante en 2 schemas | **Resuelto** — agregado a notificaciones y reportes |
| DT-14 | Índices faltantes en `outbox_events` y FKs | **Resuelto** — `@@index([status, createdAt])` en 4 schemas, `@@index([categoriaId])` en inventario, `@@index([usuarioId])` en identidad |
| DT-15 | `servicio-reportes` sin Swagger/OTel/dotenv | **Resuelto** — `initTracing`, Swagger UI, `dotenv`, credenciales RMQ alineadas |

### 🟡 Pendientes

| ID | Problema | Detalle |
|---|---|---|
| DT-16 | 2 llamadas HTTP entre servicios | `pedidos→inventario` (POST /validar-lote) y `caja→cuentas` (GET /cuenta/:id) rompen ADR-002/004. Deben migrarse a eventos con proyección local. |
| DT-17 | E2E tests | 9 scaffolds de Playwright sin implementar |

---

## Estado por microservicio (28 Mayo 2026)

| Servicio | Endpoints | Eventos | Auth | Idempotencia | Tests | Swagger |
|---|---|---|---|---|---|---|
| identidad | ✅ | ✅ | ✅ propio | ✅ | ✅ 10 tests | ✅ |
| mesas | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 8 tests | ✅ |
| pedidos | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| cuentas | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 4 tests | ✅ |
| reservas | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 8 tests | ✅ |
| inventario | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| notificaciones | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 1 test | ✅ |
| caja | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 3 tests | ✅ |
| reportes | ✅ | ✅ | ✅ APP_GUARD | ✅ | ✅ 1 test | ✅ |

---

## Próximos pasos recomendados

1. **Eliminar 2 llamadas HTTP entre servicios** — migrar `pedidos→inventario` y `caja→cuentas` a eventos (ADR-002/004)
2. **E2E tests** — 9 Playwright scaffolds sin implementar
