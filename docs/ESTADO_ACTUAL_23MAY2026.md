# Estado Actual del Proyecto — Nachopps Restobar

**Fecha:** 23 Mayo 2026 (post-intervención)
**Salud:** 8.5/10
**Rama:** `main`
**Último commit:** `57cb9fe` — feat: refactor UI a Tailwind, WebSockets bidireccionales en KDS, pagos mixtos y estación routing

---

## 1. Resumen ejecutivo

Plataforma digital SOA para Nachopps Restobar (Sullana, Piura, Perú). Digitaliza reservas, pedidos, cuentas, caja, inventario, reportes y notificaciones en tiempo real. Universidad UTP — Arquitectura Orientada al Servicio.

**Stack:** Nx monorepo, NestJS 11, React 19, PostgreSQL 16 × 9, RabbitMQ 3, Kong 3.9, Tailwind CSS 4, Prisma 7, OpenTelemetry, Jaeger, Prometheus, Grafana.

**11 proyectos compilando limpio. 14/14 tests pasando.**

---

## 2. Arquitectura de eventos — Flujo real

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         CREACIÓN DE PEDIDO (SAGA)                             │
│                                                                              │
│  POST /pedidos                                                                │
│   │                                                                           │
│   ├─ POST /inventario/validar-lote  ← UNA SOLA llamada (antes: N × GET)     │
│   ├─ GET  /mesas/:id                                                         │
│   │                                                                           │
│   ├─ Si mesa LIBRE:                                                          │
│   │   ├─ PATCH /mesas/:id/estado → OCUPADA                                  │
│   │   └─ POST  /cuentas          → abre cuenta                              │
│   │                                                                           │
│   ├─ Crea/actualiza SesionMesa + Pedido en BD local                          │
│   ├─ Publica PedidoCreado { items, total }                                    │
│   │                                                                           │
│   └─ SI FALLA → ROLLBACK: cierra cuenta + libera mesa                        │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                      PAGO (COREografía de eventos)                            │
│                                                                              │
│  POST /caja/pagos                                                             │
│   │                                                                           │
│   ├─ Valida turno abierto + anti-doble-cobro                                 │
│   ├─ Crea Transaccion × N pagos mixtos (efectivo/tarjeta/yape)               │
│   └─ Publica PagoRegistrado { pedidoId, monto, metodo }                       │
│       │                                                                       │
│       ▼                                                                       │
│  servicio-pedidos ── suma montoPagado en Pedido                               │
│   │                                                                           │
│   └─ Si todos los pedidos de SesionMesa están PAGADOS:                        │
│       ├─ Cierra SesionMesa                                                    │
│       └─ Publica PedidoPagado { sesionMesaId, mesaId }                        │
│           │                                                                    │
│           ▼                                                                    │
│  servicio-cuentas ── busca cuenta ABIERTA por mesaId                          │
│   │                                                                           │
│   ├─ Cierra cuenta                                                            │
│   └─ Publica CuentaCerrada { cuentaId, mesaId, total, items }                 │
│       │                                                                        │
│       ├──▶ servicio-mesas ── PATCH mesa → LIBRE                               │
│       ├──▶ servicio-caja ── registra en turno                                 │
│       └──▶ servicio-inventario ── stock ya fue descontado al crear pedido     │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                    NOTIFICACIONES (broker funcional)                           │
│                                                                              │
│  servicio-notificaciones consume 9 routing keys vía '#.*'                     │
│   │                                                                           │
│   ├─ Persiste en BD (tabla Notificacion)                                     │
│   └─ Emite vía WebSocket a clientes KDS (pedidoUpdate)                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Propiedades garantizadas en cada paso

| Propiedad | Implementación |
|---|---|
| **Idempotencia** | `IdempotencyKey` en **8 servicios** (pedidos, caja, cuentas, mesas, reportes, notificaciones, inventario, **identidad**). RabbitMQ duplicado → ignorado. |
| **Retry con backoff** | `RabbitMQRetryInterceptor` — 3 reintentos (1s, 2s, 4s). Agotado → Dead Letter Queue. |
| **No fire-and-forget** | Cada paso publica un evento que el siguiente consume. Falla → reintento automático. |
| **Saga compensatoria** | Rollback en creación de pedido: cierra cuenta + libera mesa si algo falla. |
| **Stock** | Descontado al crear el pedido. La validación usa `POST /inventario/validar-lote` (batch, single HTTP call). |

---

## 3. Estado por microservicio

### 3.1 servicio-identidad (puerto 3001, BD identidad_db :5439)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | `POST auth/login`, `POST auth/validate`, `GET auth/me`, `POST/GET usuarios`, `PATCH usuarios/:id/rol`, `GET auditoria` |
| Eventos consumidos | ✅ | `#` — audita todos los eventos del sistema |
| Eventos publicados | ✅ | `usuario.autenticado` |
| Auth | ✅ | `JwtStrategy` + `JwtAuthGuard` + `RolesGuard` + `@Roles()` propios |
| Idempotencia | ✅ | `IdempotencyKey` en schema + `checkAndRecordIdempotencyKey` en PrismaService + envelope unwrapping + retry interceptor (6 fases, Mayo 2026) |
| Prisma models | `Usuario`, `AuditoriaLog`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| ValidationPipe | ✅ | Global con `whitelist`, `forbidNonWhitelisted`, `transform` |
| Swagger/OpenAPI | ✅ | `GET /api/docs` (SwaggerModule + DocumentBuilder + BearerAuth) |
| Migración pendiente | 🟡 | `prisma migrate dev --name add_idempotency` — requiere Docker levantado |
| Tests unitarios | ❌ | No tiene spec files |

### 3.2 servicio-mesas (puerto 3002, BD mesas_db :5433)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | `GET/POST /mesas`, `PATCH /mesas/:id/estado`, `GET /mesas/:id` |
| Eventos consumidos | ✅ | `cuenta.cerrada` → PATCH mesa LIBRE |
| Auth | ✅ | `APP_GUARD` (JwtAuthGuard global, solo firma) |
| Idempotencia | ✅ | `IdempotencyKey` en schema + check en handler |
| Prisma models | `Mesa`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| Microservicio RMQ | ✅ | `mesas_queue` |
| Tests unitarios | ❌ | No tiene spec files |

### 3.3 servicio-pedidos (puerto 3004, BD pedidos_db :5434) 🎯 Servicio central

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | CRUD pedidos, `GET sesion-activa/:mesaId`, `GET sesiones-activas`, `GET items/pendientes`, `PATCH items/:id/estado` |
| Eventos consumidos | ✅ | `pago.registrado` → suma montoPagado + cierra sesión si completo |
| Eventos publicados | ✅ | `pedido.creado`, `pedido.actualizado`, `pedido.listo`, `pedido.pagado` |
| Saga | ✅ | Creación con rollback (cuenta + mesa). Cierre vía evento `PedidoPagado` |
| Stock validation | ✅ | `POST /inventario/validar-lote` — batch (antes: N × GET /productos/:id) |
| Auth | ✅ | `APP_GUARD` |
| Prisma models | `SesionMesa`, `Pedido`, `PedidoItem`, `Modificador`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| Tests unitarios | ✅ | **5 tests en 2 archivos** (3 unitarios + 1 integración) |

### 3.4 servicio-cuentas (puerto 3005, BD cuentas_db :5435)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | Abrir, cerrar, dividir cuenta, obtener por mesa |
| Eventos consumidos | ✅ | `pedido.pagado` → cierra cuenta |
| Eventos publicados | ✅ | `cuenta.cerrada`, `ticket.generado` |
| Auth | ✅ | `APP_GUARD` |
| Idempotencia | ✅ | `IdempotencyKey` + check |
| Tipos fuertes | ✅ | `CuentaDto.pedidos: PedidoDto[]`, `TicketDto.items: PedidoItemDto[]`, `DividirCuentaResult`, `fetchPedidosDeMesa: Promise<PedidoDto[]>` |
| Prisma models | `Cuenta`, `IdempotencyKey` |
| Manejo de errores | ✅ | `fetchPedidosDeMesa` lanza `ServiceUnavailableException` si pedidos no responde |
| Health check | ✅ | `GET /health` |
| Microservicio RMQ | ✅ | `cuentas_queue` |
| Tests unitarios | ✅ | **3 tests en 1 archivo** |

### 3.5 servicio-reservas (puerto 3006, BD reservas_db :5441)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | CRUD reservas, `GET disponibilidad` |
| Eventos publicados | ✅ | `reserva.creada`, `reserva.cancelada` |
| Auth | ✅ | `APP_GUARD` |
| Prisma models | `Reserva` |
| Health check | ✅ | `GET /health` |
| Tests unitarios | ❌ | No tiene spec files |

### 3.6 servicio-inventario (puerto 3007, BD inventario_db :5436)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | CRUD categorías, CRUD productos, `PATCH stock`, **`POST validar-lote`** |
| Eventos consumidos | ✅ | `pedido.creado` → descuenta stock |
| Eventos publicados | ✅ | `stock.bajo` |
| Auth | ✅ | `APP_GUARD` |
| Idempotencia | ✅ | `IdempotencyKey` + check (wrapper en BD) |
| Lógica clave | ✅ | `stockActual === null` → producto sin control de stock. Alerta si cae bajo 10 |
| Validación en lote | ✅ | `validarLote()` consulta todos los productos en una sola transacción, devuelve `ValidarLoteResponse` |
| Prisma models | `Categoria`, `Producto`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| Tests unitarios | ✅ | **3 tests en 1 archivo** |

### 3.7 servicio-notificaciones (puerto 3008, BD notificaciones_db :5440)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | `GET health` |
| Eventos consumidos | ✅ | 9 eventos (`#.*`) |
| WebSocket | ✅ | `pedidoUpdate` emitido a clientes KDS vía `socket.io` |
| Auth | ✅ | `APP_GUARD` |
| Idempotencia | ✅ | `IdempotencyKey` + check |
| Persistencia | ✅ | Cada notificación guardada en BD con estado `ENVIADO` |
| Prisma models | `Notificacion`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| Webpack | ✅ | `TsconfigPathsPlugin` agregado (antes: error `@org/shared-rabbitmq` no resuelto) |
| Tests unitarios | ❌ | No tiene spec files |

### 3.8 servicio-caja (puerto 3009, BD caja_db :5437)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | Pagos mixtos, turnos abrir/cerrar, movimientos caja chica, listar transacciones |
| Eventos consumidos | ✅ | `cuenta.cerrada` |
| Eventos publicados | ✅ | `pago.registrado` |
| Auth | ✅ | `APP_GUARD` |
| Idempotencia | ✅ | `IdempotencyKey` + check + retry interceptor |
| Anti-doble-cobro | ✅ | Consulta transacciones anteriores antes de aceptar pago nuevo |
| Arqueo | ✅ | `efectivoEsperado = fondoInicial + ventasEfectivo + ingresos - egresos` |
| Prisma models | `Turno`, `Transaccion`, `MovimientoCaja`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| Microservicio RMQ | ✅ | `caja_queue` |
| Tests unitarios | ✅ | **3 tests en 1 archivo** |

### 3.9 servicio-reportes (puerto 3010, BD reportes_db :5438)

| Concepto | Estado | Detalle |
|---|---|---|
| REST endpoints | ✅ | `GET dashboard` — métricas de ventas del día |
| Eventos consumidos | ✅ | `pago.registrado` → snapshot agregado |
| Auth | ✅ | `APP_GUARD` |
| Idempotencia | ✅ | `IdempotencyKey` + check + retry interceptor |
| Tipos fuertes | ✅ | `VentasDiaDatos` interface + envelope tipado en controller |
| Zona horaria | ✅ | Ajuste manual UTC-5 para Perú |
| Prisma models | `Snapshot`, `IdempotencyKey` |
| Health check | ✅ | `GET /health` |
| Tests unitarios | ❌ | No tiene spec files |

---

## 4. Seguridad — Defensa en profundidad

```
┌─────────────────────────────────────────────────────────┐
│ Capa 1 — Kong (:8000)                                    │
│   Valida JWT: iss=nachopps-identidad, exp               │
│   Rate limiting: 3000 req/min global                     │
│   CORS: localhost:4200, :5173                            │
│   (Caché JWT pendiente — DT-04)                          │
├─────────────────────────────────────────────────────────┤
│ Capa 2 — NestJS (APP_GUARD global)                      │
│   JwtAuthGuard en 8 servicios (libs/shared-auth)         │
│   Solo valida firma HS256, sin consulta a BD             │
├─────────────────────────────────────────────────────────┤
│ Capa 3 — Identidad (único con lógica RBAC)              │
│   JwtStrategy + RolesGuard + @Roles() decorator          │
│   CRUD de usuarios solo para ADMIN                       │
└─────────────────────────────────────────────────────────┘
```

### Roles

| Rol | Permisos |
|---|---|
| `ADMIN` | Dashboard, pedidos, caja, control caja, cocina, reservas, inventario, auditoría |
| `MESERO` | Solo pedidos y comandas |
| `CAJERO` | Pedidos (vista unificada), caja, control caja |
| `COCINERO` | Solo monitor KDS |
| `RECEPCION` | Definido en contratos, no implementado en frontend |
| `GERENCIA` | Definido en contratos, no implementado en frontend |

---

## 5. Frontend (PWA Cliente)

### Stack
- **React 19 + Vite 8 + Tailwind CSS 4**
- **Zustand** — estado global con `auth.store.ts` (token JWT + usuario, persistido en localStorage)
- **React Router 7** — `<ProtectedRoute roles={[...]}>` con redirección inteligente
- **WebSocket** — `socket.io-client` conectado a `servicio-notificaciones` (`/notificaciones/socket.io`)
- **apiClient** — Axios con interceptor de JWT + detección 401 → logout
- **8/9 servicios unificados en `apiClient`** (caja migrado en Mayo 2026)

### Vistas (10)

| Ruta | Vista | Roles | WebSocket |
|---|---|---|---|
| `/login` | Login | Público | — |
| `/` | Dashboard | ADMIN | — |
| `/pedidos` | Pedidos/Comandas | ADMIN, MESERO, CAJERO | — |
| `/caja` | Caja (Cobros) | ADMIN, CAJERO | — |
| `/control-caja` | Control de Caja | ADMIN, CAJERO | — |
| `/cocina` | Monitor KDS | ADMIN, COCINERO | ✅ `pedidoUpdate` |
| `/reservas` | Reservas | ADMIN | — |
| `/inventario` | Inventario | ADMIN | — |
| `/auditoria` | Auditoría | ADMIN | — |

### Layout
- **Topbar** — logo, nombre usuario, rol, botón logout
- **Sidebar** — colapsable (móvil/desktop), `NavLink` filtrados por rol, overlay en móvil
- **Responsive** — Tailwind responsive

### Servicios API

| Archivo | Cliente HTTP | Estado |
|---|---|---|
| `client.ts` | `apiClient` (Axios con interceptores) | ✅ Base |
| `pedidos.service.ts` | `apiClient` | ✅ |
| `usuarios.service.ts` | `apiClient` | ✅ |
| `auditoria.service.ts` | `apiClient` | ✅ |
| `inventario.service.ts` | `apiClient` | ✅ |
| `reportes.service.ts` | `apiClient` | ✅ |
| `cuentas.service.ts` | `apiClient` | ✅ |
| `mesas.service.ts` | `apiClient` | ✅ |
| `reservas.service.ts` | `apiClient` | ✅ |
| `caja.service.ts` | `apiClient` | ✅ (migrado desde axios directo, Mayo 2026) |

---

## 6. Infraestructura

### Docker Compose (21 contenedores)

| Tipo | Cantidad | Puertos host |
|---|---|---|
| PostgreSQL 16 | 9 | 5433-5441 |
| RabbitMQ 3 | 1 | 5672, 15672 |
| Kong 3.9 | 1 | 8000, 8001 |
| NestJS | 9 | 3001-3010 |
| PWA Cliente (Vite) | 1 | 4200 |
| Jaeger | 1 | 16686, 4318 |
| Prometheus | 1 | 9090 |
| Grafana | 1 | 3000 |

### Perfiles
- `infra` — RabbitMQ + 9 PostgreSQLs + Kong + observabilidad
- `dev` — igual que `infra`
- `all` — todo + 9 microservicios + PWA

### Health checks
- 9 NestJS: `GET /health` → `{ status, service, uptime }`
- Docker: `node -e "require('http').get(...)"`
- RabbitMQ + 9 PostgreSQLs: healthchecks nativos

---

## 7. Observabilidad

| Herramienta | URL | Función |
|---|---|---|
| Jaeger | `http://localhost:16686` | Trazas distribuidas (OpenTelemetry OTLP HTTP) |
| Prometheus | `http://localhost:9090` | Métricas |
| Grafana | `http://localhost:3000` (admin/admin) | Dashboards |
| RabbitMQ UI | `http://localhost:15672` (nachopps/nachopps_secret) | Colas, exchanges, DLQ |
| Swagger Identidad | `http://localhost:3001/api/docs` | OpenAPI docs |

### Mecanismos de resiliencia
- **Circuit Breaker** — `@CircuitBreakerOptions()` con opossum (timeout 3s, threshold 50%, reset 30s)
- **DLQ** — exchange `nachopps_dlx`, cola `nachopps_dead_letter_queue`, binding `#`
- **RabbitMQRetryInterceptor** — 3 reintentos con backoff (1s, 2s, 4s)

---

## 8. Testing

### Tests unitarios (14 casos en 5 archivos) — TODOS EJECUTABLES

| Archivo | Casos | Estado |
|---|---|---|
| `servicio-pedidos/src/app/app.service.spec.ts` | `registrarPagoInterno` (parcial, completo, pedido inexistente) + `procesarPagoRecibido` | ✅ 4/4 |
| `servicio-pedidos/src/app/app.service.integration.spec.ts` | Flujo 3 pagos parciales → liberación | ✅ 1/1 |
| `servicio-caja/src/app/app.service.spec.ts` | `abrirTurno` (crea, rechaza duplicado) + `cerrarTurno` (arqueo) | ✅ 3/3 |
| `servicio-cuentas/src/app/app.service.spec.ts` | `abrirCuenta` (crea, rechaza duplicado) + `dividirCuenta` | ✅ 3/3 |
| `servicio-inventario/src/app/app.service.spec.ts` | `reducirStockAutomatico` (reduce, sin stock, producto null) | ✅ 3/3 |

### Configuración de testing

| Componente | Detalle |
|---|---|
| Test runner | Vitest 4.1.6 |
| Transpilador | `unplugin-swc` (instalado Mayo 2026) |
| Config SWC | `.swcrc` raíz con `legacyDecorator: true`, `decoratorMetadata: true`, target `es2021`, module `es6` |
| Config vitest | `vitest.config.mts` con `swc.vite()` + `resolve.tsconfigPaths: true` |
| tsconfig.spec | Creados para pedidos, caja, cuentas, inventario |
| Comando | `npx vitest run` |

### E2E (Playwright)
- 9 scaffolds generados por Nx — todos hacen `axios.get('/api')` sin base URL → **fallan**
- `pwa-cliente-e2e/flujo-core.spec.ts` tiene lógica real pero selectores desactualizados

---

## 9. Librerías compartidas

| Librería | Path | Función |
|---|---|---|
| `@org/contracts` | `libs/contracts` | DTOs, eventos, routing keys, envelope, tipos fuertes — fuente única de verdad |
| `@org/shared-rabbitmq` | `libs/shared-rabbitmq` | `RabbitMQModule.forRoot()` + `RabbitMQPublisherService` con `createEventEnvelope()` |
| `@org/shared-auth` | `libs/shared-auth` | `JwtAuthGuard` global + `JwtStrategy` (solo firma HS256) |
| `@org/observabilidad` | `libs/observabilidad` | `initTracing()` OpenTelemetry, `MetricsInterceptor`, `User` decorator |
| `@org/resiliencia` | `libs/resiliencia` | `@CircuitBreakerOptions()` decorator, `RabbitMQRetryInterceptor` |

---

## 10. Routing Keys (RabbitMQ — Topic Exchange `nachopps_exchange`)

| Routing Key | Evento | Productor | Consumidores |
|---|---|---|---|
| `pedido.creado` | PedidoCreado | pedidos | inventario, notificaciones, identidad |
| `pedido.actualizado` | PedidoActualizado | pedidos | notificaciones (KDS WebSocket), identidad |
| `pedido.listo` | PedidoListo | pedidos | notificaciones, identidad |
| `pedido.pagado` | PedidoPagado | pedidos | cuentas, notificaciones, identidad |
| `pago.registrado` | PagoRegistrado | caja | pedidos, reportes, notificaciones, identidad |
| `cuenta.cerrada` | CuentaCerrada | cuentas | mesas, caja, notificaciones, identidad |
| `ticket.generado` | TicketGenerado | cuentas | notificaciones, identidad |
| `mesa.asignada` | MesaAsignada | mesas | notificaciones, identidad |
| `mesa.liberada` | MesaLiberada | mesas | notificaciones, identidad |
| `reserva.creada` | ReservaCreada | reservas | notificaciones, identidad |
| `reserva.cancelada` | ReservaCancelada | reservas | notificaciones, identidad |
| `stock.bajo` | StockBajo | inventario | notificaciones, identidad |
| `usuario.autenticado` | UsuarioAutenticado | identidad | notificaciones |

**Nota:** `servicio-identidad` escucha `#` (todos los eventos) para auditoría.

---

## 11. Endpoints REST (vía Kong :8000)

| Método | Ruta | Servicio | Auth |
|---|---|---|---|
| POST | `/identidad/auth/login` | identidad | ❌ Público |
| POST | `/identidad/auth/validate` | identidad | ❌ Público |
| GET | `/identidad/auth/me` | identidad | ✅ JWT |
| GET/POST | `/mesas` | mesas | ✅ JWT |
| PATCH | `/mesas/:id/estado` | mesas | ✅ JWT |
| GET/POST | `/pedidos` | pedidos | ✅ JWT |
| GET | `/pedidos/sesion-activa/:mesaId` | pedidos | ✅ JWT |
| GET | `/pedidos/items/pendientes` | pedidos | ✅ JWT |
| PATCH | `/pedidos/items/:id/estado` | pedidos | ✅ JWT |
| GET/POST | `/cuentas` | cuentas | ✅ JWT |
| POST | `/cuentas/:id/cerrar` | cuentas | ✅ JWT |
| POST | `/cuentas/:id/dividir` | cuentas | ✅ JWT |
| POST | `/caja/pagos` | caja | ✅ JWT |
| POST | `/caja/turnos/abrir` | caja | ✅ JWT |
| POST | `/caja/turnos/cerrar` | caja | ✅ JWT |
| GET | `/caja/turnos/activo` | caja | ✅ JWT |
| POST | `/caja/movimientos-caja` | caja | ✅ JWT |
| GET | `/caja/transacciones` | caja | ✅ JWT |
| GET/POST | `/productos` | inventario | ✅ JWT |
| POST | `/productos/validar-lote` | inventario | ✅ JWT |
| GET/POST | `/categorias` | inventario | ✅ JWT |
| GET/POST | `/reservas` | reservas | ✅ JWT |
| GET | `/reservas/disponibilidad` | reservas | ✅ JWT |
| GET | `/reportes/dashboard` | reportes | ✅ JWT |
| GET | `/health` | todos | ❌ Interno |
| GET | `/api/docs` | identidad | ❌ Swagger UI |

---

## 12. Deuda técnica

### 🔴 Crítico

| ID | Problema | Impacto | Estado |
|---|---|---|---|
| DT-01 | ~~Llamadas HTTP en cascada en creación de pedido~~ | **Resuelto.** `POST /inventario/validar-lote` (batch) reemplaza N × GET | ✅ |
| DT-02 | ~~Sin idempotencia en handlers de servicio-identidad~~ | **Resuelto.** Schema, PrismaService, envelope unwrapping, retry interceptor agregados | ✅ |
| DT-03 | ~~Tests unitarios no ejecutables (oxc no soporta decorators)~~ | **Resuelto.** `unplugin-swc` instalado, `.swcrc` creado, vitest configurado | ✅ |

### 🟡 Alto

| ID | Problema | Impacto | Estado |
|---|---|---|---|
| DT-04 | Caché JWT en Kong no implementado (ADR-005) | Si identidad cae, nadie puede autenticarse tras expiración de tokens | 🟡 Pospuesto (Kong valida HS256 autónomamente) |
| DT-05 | ~~Stock validado HTTP síncrono (race condition)~~ | **Resuelto.** Validación en lote con `validarLote()` atómico | ✅ |
| DT-06 | ~~`any` en `Cuenta.pedidos` y `Snapshot.datos`~~ | **Resuelto.** 9 ocurrencias tipadas con `PedidoDto[]`, `PedidoItemDto[]`, `VentasDiaDatos`, `DividirCuentaResult` | ✅ |

### 🟢 Medio

| ID | Problema | Impacto | Estado |
|---|---|---|---|
| DT-07 | ~~Doble patrón de API en frontend (apiClient vs axios directo)~~ | **Resuelto.** `caja.service.ts` migrado a `apiClient` | ✅ |
| DT-08 | ~~Sin OpenAPI/Swagger en ningún endpoint~~ | **Resuelto.** Swagger UI en identidad `:3001/api/docs` con BearerAuth | ✅ |
| DT-09 | Secrets hardcodeados en desarrollo | Riesgo bajo en entorno local. `JWT_SECRET`, passwords de BD fijos en `docker-compose.yml` y `kong.yml` | 🟢 Sin cambios |

---

## 13. Resumen de la intervención (Mayo 2026)

### Fase 1: Tests ejecutables
- `unplugin-swc` instalado en `devDependencies`
- `.swcrc` creado con `legacyDecorator`, `decoratorMetadata`, target `es2021`, module `es6`
- `vitest.config.mts` actualizado con `swc.vite()` + `resolve.tsconfigPaths: true`
- 4 `tsconfig.spec.json` creados (pedidos, caja, cuentas, inventario)
- 3 tests mock arreglados (cerrarTurno, dividirCuenta, integration)
- **14/14 tests pasando**

### Fase 2: Idempotencia en identidad
- `IdempotencyKey` agregado al schema de Prisma
- `checkAndRecordIdempotencyKey` en PrismaService
- 3 event handlers refactorizados: `DomainEventEnvelope` unwrapping, idempotency check, `RabbitMQRetryInterceptor`
- Prisma client regenerado

### Fase 3: Tipar `any`
- `CuentaDto.pedidos` → `PedidoDto[]`, `TicketDto.items` → `PedidoItemDto[]`
- `DividirCuentaResult` interface creada
- `VentasDiaDatos` interface creada
- 9 ocurrencias de `any` eliminadas en 4 archivos

### Fase 4: Unificar API services frontend
- `caja.service.ts` migrado de `axios` directo a `apiClient`
- Eliminado `getHeaders()` manual y `useAuthStore` import

### Fase 5: Validación de stock en lote
- `POST /inventario/validar-lote` con `ValidarLoteRequest` / `ValidarLoteResponse`
- `validarLote()` en inventario: consulta todos los productos en una sola query
- `crearPedido()` en pedidos: reemplaza N × `GET /productos/:id` por una sola llamada batch
- Validaciones de cantidad mínima, stock insuficiente y producto inexistente preservadas

### Fase 6: OpenAPI/Swagger
- `@nestjs/swagger` instalado
- `DocumentBuilder` con título, descripción, versión, BearerAuth
- Swagger UI en `:3001/api/docs`
- `class-transformer/storage` agregado a externals de webpack en identidad

### Extra: Webpack fix en notificaciones
- `TsconfigPathsPlugin` agregado — resolvía `@org/shared-rabbitmq` con error

---

## 14. Pendientes para levantar el sistema

```powershell
# 1. Migración de idempotencia en identidad (requiere Docker)
cd apps/servicio-identidad
npx prisma migrate dev --name add_idempotency
cd ../..

# 2. Levantar infraestructura
docker compose -f infra/docker-compose.yml --profile dev up -d --build

# 3. Verificar
docker compose -f infra/docker-compose.yml ps
# Deben aparecer 21 contenedores healthy
```

---

## 15. Estructura del monorepo

```
BackActual/
├── apps/
│   ├── pwa-cliente/              # React PWA (10 vistas)
│   ├── pwa-cliente-e2e/          # Playwright (scaffold)
│   ├── servicio-identidad/       # Auth, JWT, RBAC, auditoría, Swagger
│   ├── servicio-mesas/           # Estado físico de mesas
│   ├── servicio-pedidos/         # 🎯 Servicio central: pedidos, Saga, SesionMesa
│   ├── servicio-cuentas/         # Tickets, cierre de cuentas
│   ├── servicio-reservas/        # Ciclo de vida de reservas
│   ├── servicio-inventario/      # Productos, categorías, stock, validación en lote
│   ├── servicio-notificaciones/  # Broker funcional: consume eventos → WebSocket
│   ├── servicio-caja/            # Turnos, pagos mixtos, arqueos
│   ├── servicio-reportes/        # Snapshots agregados de ventas
│   └── servicio-*-e2e/           # Playwright scaffolds (9 total)
│
├── libs/
│   ├── contracts/                # Fuente única de verdad: DTOs, eventos, routing keys
│   ├── shared-rabbitmq/          # RabbitMQModule + RabbitMQPublisherService
│   ├── shared-auth/              # JwtAuthGuard (solo firma)
│   ├── observabilidad/           # OpenTelemetry, MetricsInterceptor, User decorator
│   └── resiliencia/              # CircuitBreaker, RabbitMQRetryInterceptor
│
├── infra/
│   ├── docker-compose.yml        # 21 contenedores
│   ├── kong/kong.yml             # Config declarativa Kong
│   └── prometheus/prometheus.yml
│
├── docs/
│   ├── AGENTS.md                 # Documento de contexto principal
│   ├── INFORME_ESTADO_23MAY2026.md
│   ├── DT04_JWT_CACHE_KONG.md    # Contexto completo para implementar caché JWT
│   └── ESTADO_ACTUAL_23MAY2026.md # Este archivo
│
├── vitest.config.mts             # Config de tests con SWC
├── .swcrc                        # SWC con soporte de decorators NestJS
├── nx.json                       # Nx config (sync.applyChanges: true)
├── tsconfig.base.json            # TS estricto + path aliases
├── package.json                  # Dependencias raíz
└── .env.example
```

---

*Documento generado post-intervención de 6 fases. Salud del proyecto: 8.5/10.*
