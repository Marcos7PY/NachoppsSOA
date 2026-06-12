---
tipo: libreria
nombre: @org/resiliencia
ruta: libs/resiliencia
estado: activa
fuente: [libs/resiliencia/src/index.ts:1, libs/resiliencia/src/lib/circuit-breaker.decorator.ts:1, libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts:1, libs/resiliencia/src/lib/resiliencia.module.ts:1]
revisado: 2026-06-02
commit: 53877c8
---

# resiliencia

**Responsabilidad.** Libreria del workspace ubicada en `libs/resiliencia`. [libs/resiliencia/src/index.ts:1]

**Exportaciones.**

- `export * from './lib/resiliencia.module';`. [libs/resiliencia/src/index.ts:1]
- `export * from './lib/circuit-breaker.decorator';`. [libs/resiliencia/src/index.ts:2]
- `export * from './lib/rabbitmq-retry.interceptor';`. [libs/resiliencia/src/index.ts:3]

**Como se consume.** El paquete esta registrado como proyecto Nx y se importa desde su nombre de workspace cuando los consumidores lo referencian. [package.json:63]

**Estado.** Activa dentro del workspace Nx declarado por los workspaces del repo. [package.json:63]

