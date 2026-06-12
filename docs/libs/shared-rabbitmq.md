---
tipo: libreria
nombre: @org/shared-rabbitmq
ruta: libs/shared-rabbitmq
estado: activa
fuente: [libs/shared-rabbitmq/src/index.ts:1, libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:1, libs/shared-rabbitmq/src/lib/rabbitmq.constants.ts:1, libs/shared-rabbitmq/src/lib/rabbitmq.module.ts:1]
revisado: 2026-06-02
commit: 53877c8
---

# shared-rabbitmq

**Responsabilidad.** Libreria del workspace ubicada en `libs/shared-rabbitmq`. [libs/shared-rabbitmq/src/index.ts:1]

**Exportaciones.**

- `export { RabbitMQModule } from './lib/rabbitmq.module';`. [libs/shared-rabbitmq/src/index.ts:1]
- `export { RabbitMQPublisherService } from './lib/rabbitmq-publisher.service';`. [libs/shared-rabbitmq/src/index.ts:2]
- `export { NACHOPPS_EXCHANGE, RABBITMQ_CONNECTION } from './lib/rabbitmq.constants';`. [libs/shared-rabbitmq/src/index.ts:3]

**Como se consume.** El paquete esta registrado como proyecto Nx y se importa desde su nombre de workspace cuando los consumidores lo referencian. [package.json:63]

**Estado.** Activa dentro del workspace Nx declarado por los workspaces del repo. [package.json:63]

