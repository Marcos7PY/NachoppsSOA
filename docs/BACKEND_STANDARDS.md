# Estándares de backend — NachoPps Restobar

Documento vivo alineado al **APF2** y ADRs del proyecto. Objetivo: código mantenible, sin deuda estructural.

## Principios (no negociables)

| Principio | Implementación en el repo |
|-----------|---------------------------|
| **Autonomía SOA (ADR-002)** | Una BD PostgreSQL por microservicio. Prohibido leer la BD de otro servicio. |
| **Contrato como interfaz** | REST + tipos en `@org/contracts`. Eventos con `RoutingKeys` + payloads tipados. |
| **Comunicación híbrida (ADR-004)** | Camino crítico → REST vía Kong. Notificaciones/reportes → RabbitMQ. |
| **Gateway único (ADR-003)** | Clientes externos solo a `:8000`. JWT validado en Kong (ADR-005). |
| **Idempotencia en eventos** | `IdempotencyKey` en schema + `$checkAndRecordIdempotencyKey` en PrismaService + `RabbitMQRetryInterceptor`. |

## Estructura por microservicio

```
apps/servicio-{dominio}/
  prisma/schema.prisma          # Cliente en src/generated/prisma
  src/
    generated/prisma/           # Generado — no editar (gitignored)
    prisma/                     # PrismaModule + PrismaService (usa createBasePrismaService)
    app/                        # Módulo Nest: controller + service + mapper
    main.ts                     # initTracing + dotenv + bootstrap
  .env                          # PORT, DATABASE_URL, RABBITMQ_URI, JWT_SECRET
```

**Todos los servicios usan** `createBasePrismaService()` de `@org/shared-prisma` para configurar Pool + PrismaPg + lifecycle.

## Convenciones de código

- **TypeScript estricto** (`tsconfig.base.json`).
- **DTOs y eventos** solo en `libs/contracts` — no duplicar tipos en apps.
- **Routing keys**: `dominio.accion` (ej. `reserva.creada`). Constantes en `RoutingKeys`.
- **Envelope de evento**: `createEventEnvelope()` del publicador RabbitMQ.
- **Mappers** (`*.mapper.ts`): traducir entidad Prisma → DTO de contrato.
- **Controllers delgados**: validación mínima; lógica en `*Service`.
- **Errores HTTP**: `NotFoundException`, `ConflictException` de Nest (códigos 404/409).
- **Variables de entorno**: cargar en `main.ts` con `dotenv` desde `../.env`.
- **Tracing**: `initTracing('servicio-nombre')` al inicio de cada `main.ts`.
- **App Guard**: `JwtAuthGuard` como `APP_GUARD` global en todos los servicios.

## Prisma

```powershell
# Desde la raíz del workspace
cd apps/servicio-reservas
npx prisma migrate dev --name init
npx prisma generate
```

Cada servicio ejecuta migrate **solo contra su** `DATABASE_URL`.

## RabbitMQ

- Exchange: `nachopps_exchange` (`NACHOPPS_EXCHANGE` en contracts).
- Publicar: `RabbitMQPublisherService.publish(RoutingKeys.X, payload, 'servicio-origen')`.
- Consumir: `@EventPattern(RoutingKeys.X)` + `@UseInterceptors(RabbitMQRetryInterceptor)`.
- DLQ configurada en todos los servicios con reintentos exponenciales (3 intentos).
- Mecanismo outbox con procesador cada 5 segundos.
- Índice `@@index([status, createdAt])` en todas las tablas `outbox_events`.

## Puertos locales (desarrollo)

| Servicio | PORT |
|----------|------|
| identidad | 3001 |
| mesas | 3002 |
| pedidos | 3004 |
| cuentas | 3005 |
| reservas | 3006 |
| inventario | 3007 |
| notificaciones | 3008 |
| caja | 3009 |
| reportes | 3010 |

Kong: `8000` (proxy), `8001` (admin).

## Checklist antes de merge

- [ ] `npx nx build <proyecto>` sin warnings evitables
- [ ] Contratos actualizados si cambia API o evento
- [ ] Migración Prisma incluida si cambia schema
- [ ] Sin secretos en commits (solo `.env` local)
- [ ] Endpoints documentados alineados a ficha APF2

## Deuda conocida (Mayo 2026)

- **8 tests unitarios fallidos** — mocks de Prisma desactualizados en inventario, cuentas, caja y pedidos (falta mock de `$transaction`, `$executeRaw`, `updateMany`, y `pedidos` iterable)
- **2 llamadas HTTP entre servicios** — `pedidos→inventario` (POST /validar-lote) y `caja→cuentas` (GET /cuenta/{id}) deberían migrar a eventos
- **E2E tests** — 9 scaffolds de Playwright sin implementar
- **`kong.yml` hardcodeado** — divergente del template, pendiente unificar
