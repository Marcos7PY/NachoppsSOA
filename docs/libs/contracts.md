---
tipo: libreria
nombre: @org/contracts
ruta: libs/contracts
estado: activa
fuente: [libs/contracts/dist/domains/caja.d.ts:1, libs/contracts/dist/domains/cuentas.d.ts:1, libs/contracts/dist/domains/identidad.d.ts:1, libs/contracts/dist/domains/inventario.d.ts:1, libs/contracts/dist/domains/mesas.d.ts:1, libs/contracts/dist/domains/pedidos.d.ts:1, libs/contracts/dist/domains/reservas.d.ts:1, libs/contracts/dist/events/routing-keys.d.ts:1, libs/contracts/dist/index.d.ts:1, libs/contracts/dist/messaging/envelope.d.ts:1, libs/contracts/dist/messaging/exchange.d.ts:1, libs/contracts/src/domains/caja.ts:1]
revisado: 2026-06-02
commit: 53877c8
---

# contracts

**Responsabilidad.** Libreria del workspace ubicada en `libs/contracts`. [libs/contracts/src/index.ts:1]

**Exportaciones.**

- `export * from './messaging/exchange';`. [libs/contracts/src/index.ts:1]
- `export * from './messaging/envelope';`. [libs/contracts/src/index.ts:2]
- `export * from './events/routing-keys';`. [libs/contracts/src/index.ts:3]
- `export * from './domains/reservas';`. [libs/contracts/src/index.ts:4]
- `export * from './domains/pedidos';`. [libs/contracts/src/index.ts:5]
- `export * from './domains/mesas';`. [libs/contracts/src/index.ts:6]
- `export * from './domains/cuentas';`. [libs/contracts/src/index.ts:7]
- `export * from './domains/caja';`. [libs/contracts/src/index.ts:8]
- `export * from './domains/inventario';`. [libs/contracts/src/index.ts:9]
- `export * from './domains/identidad';`. [libs/contracts/src/index.ts:10]

**Como se consume.** El paquete esta registrado como proyecto Nx y se importa desde su nombre de workspace cuando los consumidores lo referencian. [package.json:63]

**Estado.** Activa dentro del workspace Nx declarado por los workspaces del repo. [package.json:63]

