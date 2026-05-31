---
tipo: libreria
nombre: @org/shared-auth
ruta: libs/shared-auth
estado: activa
fuente: [libs/shared-auth/src/index.ts:1, libs/shared-auth/src/lib/jwt-auth.guard.ts:1, libs/shared-auth/src/lib/jwt.strategy.ts:1, libs/shared-auth/src/lib/service-token.service.ts:1, libs/shared-auth/src/lib/shared-auth.module.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# shared-auth

**Responsabilidad.** Libreria del workspace ubicada en `libs/shared-auth`. [libs/shared-auth/src/index.ts:1]

**Exportaciones.**

- `export { JwtAuthGuard } from './lib/jwt-auth.guard';`. [libs/shared-auth/src/index.ts:1]
- `export { SharedAuthModule } from './lib/shared-auth.module';`. [libs/shared-auth/src/index.ts:2]
- `export { ServiceTokenService } from './lib/service-token.service';`. [libs/shared-auth/src/index.ts:3]

**Como se consume.** El paquete esta registrado como proyecto Nx y se importa desde su nombre de workspace cuando los consumidores lo referencian. [package.json:63]

**Estado.** Activa dentro del workspace Nx declarado por los workspaces del repo. [package.json:63]
