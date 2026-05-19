# ⚠️ Deprecado

Este paquete **no debe usarse**. Un único `PrismaClient` en monorepo con 9 schemas viola ADR-002.

Use en cada app:

- `apps/servicio-*/prisma/schema.prisma` con `output = "../src/generated/prisma"`
- `apps/servicio-*/src/prisma/prisma.service.ts`

Ver `docs/BACKEND_STANDARDS.md`.
