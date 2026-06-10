---
tipo: invariante
slug: idempotencia-directa
estado: verificada
fuente: [apps/servicio-inventario/src/app/app.service.ts:216, apps/servicio-inventario/src/app/app.service.ts:222, apps/servicio-inventario/src/app/app.service.ts:225, apps/servicio-inventario/src/app/app.service.ts:231, apps/servicio-inventario/prisma/schema.prisma:53, apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:14, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:40]
revisado: 2026-06-02
commit: 53877c8
---

# idempotencia-directa

**Enunciado.** Cada `pedido.creado` descuenta stock de inventario como maximo una vez. [apps/servicio-inventario/src/app/app.service.ts:216]

**Por que importa.** Si falla, una redelivery de `pedido.creado` descuenta inventario mas de una vez o termina en DLQ aunque ya se haya procesado. [apps/servicio-inventario/src/app/app.service.ts:222]

**Mecanismo que la garantiza.** El consumidor de inventario procesa `pedido.creado` dentro de una transaccion, crea `idempotencyKey` antes de descontar y despues llama `reducirStockAutomaticoConPrisma`; la tabla tiene `key String @unique` y la migracion crea `idempotency_keys_key_key`. Un duplicado produce `P2002` y se retorna sin lanzar, por lo que el interceptor puede hacer ACK. [apps/servicio-inventario/src/app/app.service.ts:216, apps/servicio-inventario/src/app/app.service.ts:222, apps/servicio-inventario/src/app/app.service.ts:225, apps/servicio-inventario/src/app/app.service.ts:231, apps/servicio-inventario/prisma/schema.prisma:53, apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql:14]

**Prueba que la verifica.** D1c reporta 12 redeliveries concurrentes, stock inicial 20, cantidad 5 y stock final 15, sin residuo de DLQ. [stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:40, stress-tests/reports/stock-idempotency-dlq-2026-05-30T23-48-15-031Z.md:43]

**Adenda T-14 (idempotencia HTTP, pedidos y caja).** El `IdempotencyInterceptor`
(`libs/resiliencia/src/lib/idempotency.interceptor.ts`) persiste `requestHash =
sha256(JSON.stringify(body))` al reclamar la `Idempotency-Key`. Un replay con la misma
clave y el mismo body devuelve la respuesta cacheada; con un body distinto responde 422
(`UnprocessableEntityException`, comportamiento tipo Stripe) en vez de un replay silencioso
que devolveria la respuesta del primer payload. Requiere la columna `requestHash` (migracion
`20260609030000_idempotency_request_hash` en pedidos y caja). [libs/resiliencia/src/lib/idempotency.interceptor.ts:67]

