# Plan de Saneamiento — Nachopps Restobar

**Fecha:** 2026-05-27  
**Estado actual:** ✅ Fases 1-5 COMPLETADAS (28 Mayo 2026). 10/10 build limpio, 34/42 tests pasando.

---

## Fase 1 — Eliminación de Basura ✅ COMPLETADA

**Objetivo:** Remover archivos huérfanos, código muerto y documentos obsoletos. Cero riesgo de romper funcionalidad.

**Ejecutado:**

| # | Acción | Archivos afectados |
|---|---|---|
| 1.1 | Borrar `apps/*/src/generated/src/generated/prisma/` (8 directorios) | ~168 archivos de Prisma generados anidados, nunca referenciados |
| 1.2 | Borrar `test-logs/` completo | 12 logs de debugging viejo (`real-real-final.log`, etc.) |
| 1.3 | Borrar `docs/codebase-report/codebase-report.zip` | Zip innecesario en el repositorio |
| 1.4 | Borrar `docs/diseño-frontend-sistema-restaurante.md` | 896 líneas — describe stack Vue/Laravel/Pusher, el real es React/Vite/Socket.io |
| 1.5 | Archivar `docs/ESTADO_ACTUAL_23MAY2026.md` → `docs/_archived_ESTADO_ACTUAL_23MAY2026.md` | Snapshot pre-intervenciones, reemplazado por `ESTADO.md` |
| 1.6 | Archivar `docs/INFORME_ESTADO_23MAY2026.md` → `docs/_archived_INFORME_ESTADO_23MAY2026.md` | Snapshot pre-intervenciones, listaba DTs como no resueltos |
| 1.7 | Archivar `docs/Flujos_POS_Restaurante.md` → `docs/_archived_Flujos_POS_Restaurante.md` | Aspiracional — eventos y features nunca implementados (`pedido.item_anulado`, SUNAT, combos, fusión de mesas) |
| 1.8 | Borrar `libs/shared-prisma/src/lib/prisma.service.ts` | Clase `PrismaService` standalone — ningún servicio la usa (todos usan `createBasePrismaService()`) |
| 1.9 | Borrar `libs/shared-prisma/src/lib/shared-prisma.ts` | Función `sharedPrisma()` que retorna el string `'shared-prisma'` — sin referencias |
| 1.10 | Borrar `apps/servicio-identidad/webpack.config.js` | Único webpack residual — identidad ya migró a tsc (confirmado en su `package.json`) |
| 1.11 | Actualizar `libs/shared-prisma/src/index.ts` | Pasó de exportar 3 módulos a solo `base-prisma.service` (el único vivo) |

**Verificación:** `npx nx run-many --target=build --all` → 10/10 proyectos compilan limpio.

---

## Fase 2 — Corrección de Bugs en Runtime 🔴

### 2.1 — Agregar modelo `IdempotencyKey` a `servicio-notificaciones` y `servicio-reportes`

**Archivos:** `apps/servicio-notificaciones/prisma/schema.prisma`, `apps/servicio-reportes/prisma/schema.prisma`

**Problema:** Ambos servicios tienen `checkAndRecordIdempotencyKey()` en su `PrismaService` que llama a `this.idempotencyKey.create()`. Pero la tabla `idempotency_keys` **no existe** en sus schemas. El `as any` esconde el error de TypeScript. En runtime, cualquier mensaje RabbitMQ duplicado (reintentos, redeliveries) lanza excepción en vez de hacer skip.

**Solución:** Agregar el modelo a ambos schemas:

```prisma
model IdempotencyKey {
  key       String   @id
  createdAt DateTime @default(now())
  @@map("idempotency_keys")
}
```

El modelo ya existe idéntico en `servicio-mesas`. Luego ejecutar `npx prisma db push` en cada servicio.

**Por qué es crítico:** Sin esta tabla, cualquier reintento de RabbitMQ en estos servicios crashea. Con la tabla, los duplicados se detectan y se skipean.

---

### 2.2 — Agregar `RabbitMQRetryInterceptor` a `servicio-notificaciones`

**Archivo:** `apps/servicio-notificaciones/src/app/app.controller.ts`

**Problema:** Es el único servicio consumidor de eventos RabbitMQ que no usa `@UseInterceptors(RabbitMQRetryInterceptor)`. Tiene manejo manual inline:

```typescript
// ACTUAL — reintentos infinitos sin backoff
try {
  this.gateway.emitPedidoUpdate({ pattern, data });
  channel.ack(originalMsg);
} catch (error) {
  channel.nack(originalMsg, false, true); // reencola eternamente
}
```

Si `emitPedidoUpdate` falla (WebSocket caído, Gateway no responde), el mensaje se reencola sin límite, saturando la cola.

**Solución:** Agregar `@UseInterceptors(RabbitMQRetryInterceptor)` a nivel de clase y eliminar el `try/catch` manual. El interceptor ya maneja: 3 reintentos con backoff exponencial (1s → 2s → 4s), luego `nack(false, false)` que envía a la DLQ. Esto además elimina el riesgo de "Double ACK" (interceptor + código manual).

```typescript
// DESPUÉS
@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class AppController {
  // handlers sin try/catch manual — el interceptor gestiona ACK/NACK
}
```

**Por qué importa:** Consistencia con los otros 5 servicios consumidores + prevención de saturación de cola.

---

### 2.3 — Completar `servicio-reportes` (4 fixes)

**Archivo:** `apps/servicio-reportes/src/main.ts`

**Problemas:** Es el servicio con más deficiencias del sistema:

| # | Deficiencia | Impacto |
|---|---|---|
| a | Sin `initTracing('servicio-reportes')` | Agujero negro en Jaeger/Tempo — el flujo `cuenta.cerrada → reportes` no aparece en trazas |
| b | Sin Swagger (`api/docs`) | Los 8 servicios restantes lo tienen. Sin él, no hay descubribilidad de endpoints |
| c | Sin carga de `.env` (`dotenv`) | Si el entorno no provee `DATABASE_URL`, el servicio arranca sin BD y crashea |
| d | RMQ con credenciales `admin:admin123` | Los otros 8 usan `nachopps:nachopps_secret`. Si RabbitMQ no tiene el usuario `admin`, reportes no se conecta |

**Solución:** Agregar en `main.ts`:

```typescript
// a) Tracing — primera línea, antes de cualquier import
import { initTracing } from '@org/observabilidad';
initTracing('servicio-reportes');

// b) dotenv
import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '../.env') });

// c) Swagger — después de create(AppModule)
const swaggerConfig = new DocumentBuilder()
  .setTitle('Nachopps Restobar — API Reportes')
  .setDescription('Snapshots, ventas diarias y dashboard')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api/docs', app, document);

// d) RMQ credenciales — alinear con el resto
urls: [process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'],
```

**Por qué importa:** `servicio-reportes` consume `cuenta.cerrada` y registra ventas diarias. Si no está instrumentado, no hay visibilidad de si está funcionando. Es el servicio más frágil hoy.

---

### 2.4 — Verificación post-fase 2

```bash
# Build de los servicios modificados
npx nx run-many --target=build --projects=servicio-notificaciones,servicio-reportes

# Push de schemas modificados
cd apps/servicio-notificaciones && npx prisma db push && cd ../..
cd apps/servicio-reportes && npx prisma db push && cd ../..

# Build completo
npx nx run-many --target=build --all
```

---

## Fase 3 — Refactors de Mediano Impacto 🟠

### 3.1 — Migrar 3 servicios a `createBasePrismaService`

**Servicios:** `servicio-notificaciones`, `servicio-identidad`, `servicio-reservas`

**Problema:** Estos 3 servicios implementan su propio `PrismaService` manualmente (~28 líneas de Pool + PrismaPg + lifecycle). Los otros 6 servicios ya usan `createBasePrismaService()` de `@org/shared-prisma`. Es código duplicado y divergente.

**Solución:** Reemplazar el `PrismaService` manual por la factory:

```typescript
// ANTES (28 líneas duplicadas)
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('...');
    const pool = new Pool({ connectionString });
    super({ adapter: new PrismaPg(pool) });
  }
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}

// DESPUÉS
import { createBasePrismaService } from '@org/shared-prisma';

const Base = createBasePrismaService('servicio-notificaciones');
@Injectable()
export class PrismaService extends Base {}
```

**Caso especial `servicio-notificaciones`:** Su `checkAndRecordIdempotencyKey` tiene lógica invertida respecto a la clase base (retorna `true` en éxito vs la base que retorna `false`). Al migrar, se debe verificar cuál es el comportamiento esperado y unificar. La base class ya incluye `$checkAndRecordIdempotencyKey`.

**Por qué importa:** Elimina ~84 líneas de código duplicado y asegura que los 9 servicios compartan la misma configuración de pool, manejo de conexiones e idempotencia.

---

### 3.2 — Agregar índice `(status, createdAt)` en `outbox_events` (4 servicios)

**Schema:** `servicio-pedidos`, `servicio-cuentas`, `servicio-caja`, `servicio-mesas`

**Problema:** El `OutboxProcessor` en los 4 servicios ejecuta cada 5 segundos:
```sql
SELECT * FROM outbox_events WHERE status = 'PENDING' ORDER BY createdAt LIMIT 50
```
Sin índice, esto es un **full table scan** cada 5 segundos. Con miles de eventos procesados, la query se degrada linealmente.

**Solución:** Agregar en los 4 schemas:
```prisma
model OutboxEvent {
  // ... campos existentes ...
  @@index([status, createdAt])
}
```

**Por qué importa:** Previene degradación de rendimiento a medida que crece la tabla de outbox. Costo: una línea por schema, sin cambios en código de aplicación.

---

### 3.3 — Agregar índices en foreign keys sin indexar

**Schemas:** `servicio-inventario`, `servicio-identidad`

| Tabla | Columna | Motivo |
|---|---|---|
| `productos` (inventario) | `categoriaId` | FK sin índice — `listarProductos(categoriaId?)` filtra por esta columna |
| `AuditoriaLog` (identidad) | `usuarioId` | FK sin índice — queries de auditoría por usuario |

```prisma
// servicio-inventario
model Producto {
  @@index([categoriaId])
}

// servicio-identidad
model AuditoriaLog {
  @@index([usuarioId])
}
```

---

### 3.4 — Renombrar `@nachopps/shared-prisma` → `@org/shared-prisma`

**Archivo:** `libs/shared-prisma/package.json`

**Problema:** El `package.json` declara `"name": "@nachopps/shared-prisma"` pero todos los imports usan `@org/shared-prisma`. Funciona por tsconfig paths, pero rompería al intentar publicar el paquete o al usar resolvers estrictos.

**Solución:** Cambiar `"name"` en `libs/shared-prisma/package.json` y en cualquier `tsconfig` que haga referencia al nombre viejo.

---

## Fase 4 — Actualización de Documentación 📄

### 4.1 — Actualizar `ESTADO.md`

Corregir 2 afirmaciones falsas:

| Claim actual | Corrección |
|---|---|
| "DT-10: Migración webpack a tsc — ✅ Resuelta" | "DT-10: 9/9 servicios migrados a tsc. Webpack residual eliminado." (ya borramos el último webpack) |
| "45/45 tests pasando" | Verificar y poner el número real de tests unitarios que pasan (los 22 spec files) |

Actualizar la tabla de "Estado por microservicio": `servicio-reservas` ahora tiene idempotencia (si se migra a `createBasePrismaService` en Fase 3).

---

### 4.2 — Actualizar `BACKEND_STANDARDS.md`

La sección "Deuda conocida" lista 6 ítems, **todos resueltos**:
- JWT en Kong ✅
- Idempotencia en eventos ✅
- JWT + guards ✅
- DLQ y reintentos ✅
- Saga Caja/Cuentas/Mesas ✅
- OpenAPI por servicio ✅
- Tests de integración ✅

Reemplazar por la deuda real actual:
- `servicio-reportes` sin Swagger/OTel/.env (hasta Fase 2)
- `servicio-notificaciones` sin `RabbitMQRetryInterceptor` (hasta Fase 2)
- 3 servicios con PrismaService duplicado (hasta Fase 3)
- Índices faltantes en `outbox_events` (hasta Fase 3)
- Quedan 2 llamadas HTTP entre servicios: `pedidos→inventario` y `caja→cuentas`

---

### 4.3 — Actualizar headers de documentos DT

- `DT04_JWT_CACHE_KONG.md`: header de "🟡 Pendiente" → "✅ Completada (3 fases: LRU cache + degraded mode + refresh tokens)"
- `DT10_MIGRACION_WEBPACK_A_TSC.md`: header de "🟡 Pendiente" → "✅ Completada (9/9 servicios migrados a tsc)"

---

### 4.4 — Regenerar codebase-report

Los 15 archivos de `docs/codebase-report/` tienen ~40% de discrepancias con el código real. Los peores:

| Archivo | Discrepancia principal |
|---|---|
| `apps/servicio-pedidos.md` | Dice que EventsController está vacío — tiene 2 handlers vivos |
| `apps/servicio-cuentas.md` | Dice "sin guards" — tiene APP_GUARD. `GET /` dice `listarCuentas` — es `healthCheck` |
| `apps/servicio-inventario.md` | Dice "sin guards" — tiene APP_GUARD. Confunde `GET /` con `GET /productos` |
| `apps/servicio-reportes.md` | Dice modelo `Snapshot` — el real es `VentaDiaria`. Omite `GET /resumen` y `EventPattern(CuentaCerrada)` |
| `apps/servicio-notificaciones.md` | Reporta guards por endpoint como "ninguno" — tiene APP_GUARD global |
| `apps/servicio-reservas.md` | Dice "sin guards" — tiene APP_GUARD. Documenta `GET /health` que no existe |
| `libs/shared-prisma.md` | Dice "código muerto" — 6 de 9 servicios lo usan |
| `libs/resiliencia.md` | Dice "CircuitBreakerOptions inactivo" — 2 servicios lo usan |
| `libs/contracts.md` | Omite 2 routing keys (`MesaCreada`, `MesaActualizada`). Omite rol `SISTEMA` |

---

## Fase 5 — Infraestructura 🏗️

### 5.1 — Healthchecks en los 9 microservicios

**Archivo:** `infra/docker-compose.yml`

**Problema:** Las 10 bases de datos y RabbitMQ tienen `healthcheck`, pero los 9 microservicios no. Docker Compose no sabe si un servicio arrancó correctamente. El `depends_on` con `condition: service_healthy` solo aplica a las DBs.

**Solución:** Agregar healthcheck HTTP a cada microservicio:

```yaml
servicio-pedidos:
  healthcheck:
    test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
    interval: 10s
    timeout: 5s
    retries: 3
    start_period: 15s
```

Y asegurar que cada servicio tenga un endpoint `/api/health` (la mayoría ya lo tiene).

---

### 5.2 — Alinear `kong.yml` con `kong.yml.template`

**Archivos:** `infra/kong/kong.yml`, `infra/kong/kong.yml.template`

**Problema:** Son dos archivos divergentes. El template es la versión "producción" (tiene rate-limiting + jwt-cache + variables de entorno). El `kong.yml` resuelto está hardcodeado con `nachopps_jwt_secret_dev` y sin rate-limiting.

**Solución:** Eliminar `kong.yml` y hacer que el template sea la única fuente. El entrypoint wrapper ya ejecuta `envsubst` para generar el archivo resuelto en runtime.

---

### 5.3 — Completar `.env` de cada servicio para desarrollo local

**Problema:** La mayoría de los `.env` por servicio solo tienen `DATABASE_URL`. Faltan `RABBITMQ_URI`, `JWT_SECRET`, `PORT`, y las URLs entre servicios. Con `nx serve`, el servicio no encuentra estas variables.

**Solución:** Completar los `.env` y `.env.example` de cada servicio con todas las variables que necesita, consistentes con los defaults del `docker-compose.yml`.

---

### 5.4 — Limpiar `scripts/`

**Problema:** 16 scripts en `scripts/`. Solo 4 están referenciados en documentación (`levantar-infra.ps1`, `seed-admin.js`, `poblar-datos.ts`, `pruebas-integracion.ts`). Los otros 12 son ad-hoc no documentados.

**Solución:** Revisar uno por uno. Eliminar los que son versiones viejas de pruebas. Documentar los que se usan. Mover a `.gitignore` los logs que se generan.

---

### 5.5 — Eliminar `infra/build-all.sh`

**Problema:** Script Bash en un repo donde todos los demás scripts son PowerShell. No funciona en Windows sin WSL.

**Solución:** Eliminar o reescribir como `.ps1`.

---

## Resumen de Impacto por Fase

| Fase | Items | Riesgo | Build impact |
|---|---|---|---|
| 1 — Eliminación | 11 | Cero | Ninguno (10/10) |
| 2 — Bugs runtime | 3 (7 archivos) | Bajo — schemas aditivos, interceptor existente | Solo notificaciones y reportes |
| 3 — Refactors | 4 (múltiples archivos) | Medio — migración de PrismaService toca 3 servicios | 3 servicios + schemas |
| 4 — Documentación | 4 | Cero | Ninguno |
| 5 — Infraestructura | 5 | Bajo — healthchecks aditivos, limpieza de configs | Solo Docker |

---

## Orden de Ejecución Recomendado

```
Fase 1 ✅ → Fase 2 → verificar build → Fase 3 → verificar build → Fase 4 → Fase 5
```

Cada fase es independiente de las siguientes pero dependiente de las anteriores. Se puede parar después de cualquier fase con el sistema en estado consistente.
