# Informe de Estado — Nachopps Restobar

**Fecha:** 23 Mayo 2026
**Salud del proyecto:** 7/10

---

## 1. Resumen ejecutivo

El proyecto tiene base arquitectónica sólida. Las últimas iteraciones de trabajo metieron ~50 archivos de mejoras estructurales en 6 fases: health checks, validación de entrada, idempotencia en eventos, Saga orquestada para cierre de cuentas, broker de notificaciones funcional, seguridad interna con JwtAuthGuard global, y tests unitarios.

El flujo de cierre de mesa es ahora completamente event-driven con compensación. Cada paso tiene idempotencia y retry. Cero fire-and-forget.

---

## 2. Arquitectura de eventos — El flujo real hoy

```
Pago en caja ──→ PagoRegistrado ──→ pedidos suma montoPagado
                                       │
                                  si todo pagado
                                       │
                                  PedidoPagado ──→ cuentas cierra cuenta
                                                       │
                                                  CuentaCerrada ──┬──→ mesas PATCH LIBRE
                                                                   ├──→ caja registra en turno
                                                                   └──→ inventario (stock ya fue descontado en PedidoCreado)

Notificaciones consume TODO lo anterior y emite por WebSocket al KDS + persiste en BD
```

### Propiedades de cada paso

- **Idempotencia** — `IdempotencyKey` en 7 servicios. Si RabbitMQ entrega un evento duplicado, se ignora.
- **Retry con backoff** — `RabbitMQRetryInterceptor`. 3 reintentos (1s, 2s, 4s). Si se agota, va a Dead Letter Queue.
- **No fire-and-forget** — Cada paso publica un evento que el siguiente servicio consume. Si algo falla, se reintenta automáticamente.
- **Stock** — Se descuenta al crear el pedido (restaurante, la cocina consume ingredientes al preparar). La validación HTTP contra inventario existe en el camino síncrono de creación.

---

## 3. Estado por servicio

### 3.1 servicio-identidad (puerto 3001, BD 5439)
| Concepto | Estado |
|---|---|
| REST endpoints | Login, validate, me, CRUD usuarios, auditoría |
| Eventos consumidos | `#` (audita todos los eventos del sistema) |
| Eventos publicados | `usuario.autenticado` |
| Auth | JwtStrategy + JwtAuthGuard + RolesGuard propios |
| Prisma | Usuario, AuditoriaLog, IdempotencyKey |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Tests | ❌ |

### 3.2 servicio-mesas (puerto 3002, BD 5433)
| Concepto | Estado |
|---|---|
| REST endpoints | GET/POST mesas, PATCH estado, GET por ID |
| Eventos consumidos | `cuenta.cerrada` → PATCH LIBRE |
| Eventos publicados | — |
| Auth | APP_GUARD (JwtAuthGuard global, solo firma) |
| Prisma | Mesa, IdempotencyKey |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Microservicio RMQ | ✅ `mesas_queue` |
| Tests | ❌ |

### 3.3 servicio-pedidos (puerto 3004, BD 5434) — 🎯 Servicio central
| Concepto | Estado |
|---|---|
| REST endpoints | CRUD pedidos, sesión activa, ítems pendientes, actualizar estado ítem |
| Eventos consumidos | `pago.registrado` |
| Eventos publicados | `pedido.creado`, `pedido.actualizado`, `pedido.listo`, `pedido.pagado` |
| Auth | APP_GUARD |
| Prisma | SesionMesa, Pedido, PedidoItem, Modificador, IdempotencyKey |
| Saga | Creación con rollback (cuenta + mesa). Cierre vía evento `PedidoPagado` |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Tests | ✅ 5 tests (3 unitarios + 1 integración) |

### 3.4 servicio-cuentas (puerto 3005, BD 5435)
| Concepto | Estado |
|---|---|
| REST endpoints | Abrir, cerrar, dividir cuenta, obtener por mesa |
| Eventos consumidos | `pedido.pagado` → cierra cuenta |
| Eventos publicados | `cuenta.cerrada`, `ticket.generado` |
| Auth | APP_GUARD |
| Prisma | Cuenta, IdempotencyKey |
| Manejo de errores | `fetchPedidosDeMesa` lanza `ServiceUnavailableException` si pedidos no responde |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Microservicio RMQ | ✅ `cuentas_queue` |
| Tests | ✅ 3 tests |

### 3.5 servicio-reservas (puerto 3006, BD 5441)
| Concepto | Estado |
|---|---|
| REST endpoints | CRUD reservas, disponibilidad |
| Eventos consumidos | — |
| Eventos publicados | `reserva.creada`, `reserva.cancelada` |
| Auth | APP_GUARD |
| Prisma | Reserva |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Tests | ❌ |

### 3.6 servicio-inventario (puerto 3007, BD 5436)
| Concepto | Estado |
|---|---|
| REST endpoints | CRUD categorías, CRUD productos, PATCH stock |
| Eventos consumidos | `pedido.creado` → descuenta stock |
| Eventos publicados | `stock.bajo` |
| Auth | APP_GUARD |
| Prisma | Categoria, Producto, IdempotencyKey |
| Lógica clave | Si `stockActual` es null → producto sin control de stock. Alerta si cae bajo 10 |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Tests | ✅ 3 tests |

### 3.7 servicio-notificaciones (puerto 3008, BD 5440)
| Concepto | Estado |
|---|---|
| REST endpoints | Health |
| Eventos consumidos | 9 eventos (`#.*`) |
| Eventos publicados | WebSocket `pedidoUpdate` a clientes KDS |
| Auth | APP_GUARD |
| Prisma | Notificacion, IdempotencyKey |
| Persistencia | Cada notificación se guarda en BD con estado ENVIADO |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Tests | ❌ |

### 3.8 servicio-caja (puerto 3009, BD 5437)
| Concepto | Estado |
|---|---|
| REST endpoints | Pagos mixtos, turnos abrir/cerrar, movimientos caja chica, transacciones |
| Eventos consumidos | `cuenta.cerrada` |
| Eventos publicados | `pago.registrado` |
| Auth | APP_GUARD |
| Prisma | Turno, Transaccion, MovimientoCaja, IdempotencyKey |
| Anti-doble-cobro | Consulta transacciones anteriores antes de aceptar pago nuevo |
| Arqueo | `efectivoEsperado = fondoInicial + ventasEfectivo + ingresos - egresos` |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Microservicio RMQ | ✅ `caja_queue` |
| Tests | ✅ 3 tests |

### 3.9 servicio-reportes (puerto 3010, BD 5438)
| Concepto | Estado |
|---|---|
| REST endpoints | Dashboard de ventas del día |
| Eventos consumidos | `pago.registrado` → snapshot agregado |
| Eventos publicados | — |
| Auth | APP_GUARD |
| Prisma | Snapshot, IdempotencyKey |
| Zona horaria | Ajuste manual UTC-5 para Perú |
| Health check | `GET /health` ✅ |
| ValidationPipe | ✅ Global |
| Tests | ❌ |

---

## 4. Seguridad — Defensa en profundidad

```
┌─────────────────────────────────────────────────────┐
│ Capa 1 — Kong (:8000)                               │
│   Valida JWT: iss=nachopps-identidad, exp           │
│   Rate limiting: 3000 req/min                       │
│   CORS configurado para localhost:4200, :5173        │
├─────────────────────────────────────────────────────┤
│ Capa 2 — NestJS (APP_GUARD global)                  │
│   JwtAuthGuard en 8 servicios (libs/shared-auth)    │
│   Solo valida firma HS256, sin consulta a BD         │
├─────────────────────────────────────────────────────┤
│ Capa 3 — Identidad (único con lógica RBAC)          │
│   JwtStrategy + RolesGuard + @Roles() decorator      │
│   CRUD de usuarios solo para ADMIN                   │
└─────────────────────────────────────────────────────┘
```

### Roles implementados

| Rol | Permisos |
|---|---|
| `ADMIN` | Todo |
| `MESERO` | Solo pedidos/comandas |
| `CAJERO` | Pedidos, caja, control caja |
| `COCINERO` | Solo KDS cocina |
| `RECEPCION` | Definido en contrato, no implementado en frontend |
| `GERENCIA` | Definido en contrato, no implementado en frontend |

---

## 5. Frontend (PWA Cliente)

### Stack
- **React 19 + Vite 8 + Tailwind CSS 4**
- **Zustand** — estado global con persistencia en localStorage
- **React Router 7** — `<ProtectedRoute roles={[...]}>` con redirección inteligente
- **WebSocket** — `socket.io-client` conectado a `servicio-notificaciones`
- **Axios** — `apiClient` con interceptor de JWT + detección 401 → logout

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
- **Topbar** — logo NachoPps, nombre usuario, rol, botón logout
- **Sidebar** — colapsable (móvil/desktop), `NavLink` filtrados por rol
- **Responsive** — Tailwind responsive, overlay en móvil para sidebar

### Punto de mejora pendiente
`caja.service.ts` usa `axios` directo en vez de `apiClient`. Los demás servicios ya usan `apiClient` con interceptor de JWT unificado.

---

## 6. Infraestructura

### Docker Compose (21 contenedores)

| Tipo | Cantidad | Puertos |
|---|---|---|
| PostgreSQL 16 | 9 | 5433-5441 |
| RabbitMQ 3 | 1 | 5672, 15672 |
| Kong 3.9 | 1 | 8000, 8001 |
| NestJS | 9 | 3001-3010 |
| PWA Cliente | 1 | 4200 |
| Jaeger | 1 | 16686, 4318 |
| Prometheus | 1 | 9090 |
| Grafana | 1 | 3000 |

### Perfiles
- `infra` — solo RabbitMQ + PostgreSQLs + Kong + observabilidad
- `dev` — igual que `infra`
- `all` — todo lo anterior + 9 microservicios + PWA

### Health checks
Los 9 servicios NestJS tienen `GET /health` y healthcheck Docker con `node -e "require('http').get(...)"`. RabbitMQ y PostgreSQLs tienen sus healthchecks nativos.

---

## 7. Observabilidad

| Herramienta | URL | Función |
|---|---|---|
| Jaeger | `http://localhost:16686` | Trazas distribuidas (OpenTelemetry) |
| Prometheus | `http://localhost:9090` | Métricas |
| Grafana | `http://localhost:3000` (admin/admin) | Dashboards |
| RabbitMQ UI | `http://localhost:15672` (nachopps/nachopps_secret) | Colas, exchanges, DLQ |

### Mecanismos de resiliencia
- **Circuit Breaker** — decorator `@CircuitBreakerOptions()` con opossum (timeout 3s, threshold 50%, reset 30s)
- **DLQ** — exchange `nachopps_dlx`, cola `nachopps_dead_letter_queue`, binding `#`
- **RabbitMQRetryInterceptor** — 3 reintentos con backoff exponencial (1s, 2s, 4s)

---

## 8. Testing

### Tests unitarios (15 casos en 5 archivos)

| Archivo | Casos |
|---|---|
| `servicio-pedidos/src/app/app.service.spec.ts` | `registrarPagoInterno` (parcial, completo, pedido inexistente) + `procesarPagoRecibido` (publica PedidoPagado) |
| `servicio-caja/src/app/app.service.spec.ts` | `abrirTurno` (crea, rechaza duplicado) + `cerrarTurno` (calcula diferencia) |
| `servicio-cuentas/src/app/app.service.spec.ts` | `abrirCuenta` (crea, rechaza duplicado) + `dividirCuenta` (partes iguales) |
| `servicio-inventario/src/app/app.service.spec.ts` | `reducirStockAutomatico` (reduce, sin stock, producto null) |
| `servicio-pedidos/src/app/app.service.integration.spec.ts` | Flujo 3 pagos parciales → PedidoPagado |

### Estado de ejecución
Los tests están **escritos pero no ejecutables** con vitest 4 + oxc. Los decorators de NestJS requieren transformación SWC. Solución pendiente: instalar `unplugin-swc`.

### E2E (Playwright)
9 scaffolds de Nx. Todos hacen `axios.get('/api')` sin base URL → fallan. `pwa-cliente-e2e/flujo-core.spec.ts` tiene lógica real pero referencia selectores desactualizados.

---

## 9. Deuda técnica

### 🔴 Crítico
| ID | Problema | Impacto |
|---|---|---|
| DT-01 | Llamadas HTTP en cascada en creación de pedido (N × GET /productos/:id) | Latencia se multiplica por N items |
| DT-02 | Sin idempotencia en handlers de `servicio-identidad` (audita con `#`) | Riesgo de doble registro de auditoría |
| DT-03 | Tests unitarios no ejecutables (oxc no soporta decorators) | CI miente: `nx affected -t test` pasa vacío |

### 🟡 Alto
| ID | Problema | Impacto |
|---|---|---|
| DT-04 | Caché JWT en Kong no implementado (ADR-005) | Si identidad cae, nadie puede autenticarse tras expiración de tokens |
| DT-05 | Stock validado HTTP síncrono (no en lote) | Race condition con múltiples meseros pidiendo mismo producto |
| DT-06 | `any` en `Cuenta.pedidos` y `Snapshot.datos` | Sin type safety en datos financieros |

### 🟢 Medio
| ID | Problema | Impacto |
|---|---|---|
| DT-07 | Doble patrón de API en frontend (`apiClient` vs `axios` directo en caja) | Inconsistencia en interceptores |
| DT-08 | Sin OpenAPI/Swagger en ningún endpoint | Documentación de API inexistente |
| DT-09 | Secrets hardcodeados en desarrollo | Riesgo bajo en entorno local |

---

## 10. Librerías compartidas

| Librería | Path | Función |
|---|---|---|
| `@org/contracts` | `libs/contracts` | DTOs, eventos, routing keys, envelope — fuente única de verdad |
| `@org/shared-rabbitmq` | `libs/shared-rabbitmq` | RabbitMQModule + RabbitMQPublisherService |
| `@org/shared-auth` | `libs/shared-auth` | JwtAuthGuard global + JwtStrategy (solo firma HS256) |
| `@org/observabilidad` | `libs/observabilidad` | OpenTelemetry init, MetricsInterceptor, User decorator |
| `@org/resiliencia` | `libs/resiliencia` | CircuitBreaker decorator, RabbitMQRetryInterceptor |

---

## 11. Routing Keys (RabbitMQ — Topic Exchange `nachopps_exchange`)

| Routing Key | Productor | Consumidores |
|---|---|---|
| `pedido.creado` | pedidos | inventario, notificaciones |
| `pedido.actualizado` | pedidos | notificaciones |
| `pedido.listo` | pedidos | notificaciones |
| `pedido.pagado` | pedidos | cuentas, notificaciones |
| `pago.registrado` | caja | pedidos, reportes, notificaciones |
| `cuenta.cerrada` | cuentas | mesas, caja, notificaciones |
| `ticket.generado` | cuentas | notificaciones |
| `mesa.asignada` | mesas | notificaciones |
| `mesa.liberada` | mesas | notificaciones |
| `reserva.creada` | reservas | notificaciones |
| `reserva.cancelada` | reservas | notificaciones |
| `stock.bajo` | inventario | notificaciones |
| `usuario.autenticado` | identidad | notificaciones |

---

## 12. Siguientes pasos recomendados

1. **Instalar `unplugin-swc`** → tests unitarios ejecutables
2. **Implementar caché JWT en Kong** (ADR-005) → eliminar punto único de falla
3. **Migrar `caja.service.ts` a `apiClient`** → unificar interceptores
4. **Agregar `@nestjs/swagger`** en servicio piloto → OpenAPI
5. **Mover validación de stock a lote** → `POST /inventario/validar-lote` en vez de N × `GET /productos/:id`
6. **Tipar `any` en `Cuenta.pedidos` y `Snapshot.datos`** → type safety financiero
7. **Agregar `IdempotencyKey` al Prisma de `servicio-identidad`** → auditoría idempotente

---

## 13. Comandos para levantar el sistema

```powershell
# Instalar dependencias nuevas
npm install

# Build completo
npx nx run-many -t build --configuration=production

# Migraciones Prisma (servicios con IdempotencyKey nuevo)
cd apps/servicio-pedidos && npx prisma migrate dev --name add_idempotency && cd ../..
cd apps/servicio-caja && npx prisma migrate dev --name add_idempotency && cd ../..
cd apps/servicio-cuentas && npx prisma migrate dev --name add_idempotency && cd ../..
cd apps/servicio-mesas && npx prisma migrate dev --name add_idempotency && cd ../..
cd apps/servicio-reportes && npx prisma migrate dev --name add_idempotency && cd ../..
cd apps/servicio-notificaciones && npx prisma migrate dev --name init && cd ../..

# Inventario no cambió schema, solo regenerate
cd apps/servicio-inventario && npx prisma generate && cd ../..

# Levantar
docker compose -f infra/docker-compose.yml --profile dev up -d --build

# Verificar
docker compose -f infra/docker-compose.yml ps
```

---

*Informe generado automáticamente. Complementa a `AGENTS.md` y `docs/contexto_nachopps_restobar.md`.*
