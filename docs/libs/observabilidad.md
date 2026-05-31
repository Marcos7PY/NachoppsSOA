---
tipo: libreria
nombre: @org/observabilidad
ruta: libs/observabilidad
estado: activa
fuente: [libs/observabilidad/dist/index.d.ts:1, libs/observabilidad/dist/lib/metrics.interceptor.d.ts:1, libs/observabilidad/dist/lib/observabilidad.module.d.ts:1, libs/observabilidad/dist/lib/tracing.d.ts:1, libs/observabilidad/dist/lib/user.decorator.d.ts:1, libs/observabilidad/src/index.ts:1, libs/observabilidad/src/lib/metrics.interceptor.ts:1, libs/observabilidad/src/lib/observabilidad.module.ts:1, libs/observabilidad/src/lib/tracing.ts:1, libs/observabilidad/src/lib/user.decorator.ts:1]
revisado: 2026-05-30
commit: 4c186bb
---

# observabilidad

**Responsabilidad.** Libreria del workspace ubicada en `libs/observabilidad`. [libs/observabilidad/src/index.ts:1]

**Exportaciones.**

- `export * from './lib/observabilidad.module';`. [libs/observabilidad/src/index.ts:1]
- `export * from './lib/tracing';`. [libs/observabilidad/src/index.ts:2]
- `export * from './lib/metrics.interceptor';`. [libs/observabilidad/src/index.ts:3]
- `export * from './lib/user.decorator';`. [libs/observabilidad/src/index.ts:4]

**Como se consume.** El paquete esta registrado como proyecto Nx y se importa desde su nombre de workspace cuando los consumidores lo referencian. [package.json:63]

**Estado.** Activa dentro del workspace Nx declarado por los workspaces del repo. [package.json:63]
