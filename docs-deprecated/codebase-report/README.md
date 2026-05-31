# Documentación Granular de la Codebase — Nachopps Restobar

Bienvenido al índice maestro de la codebase del sistema Nachopps Restobar. Este monorepo Nx se compone de microservicios NestJS, una PWA React y librerías compartidas transversales. Cada uno de ellos ha sido documentado exhaustivamente, línea por línea, en un documento individual.

## 1. Aplicaciones (Frontend y Backend)

### Frontend
- [PWA Cliente (React/Vite)](apps/pwa-cliente.md): Panel de gestión integral.

### Microservicios Backend (NestJS)
- [Servicio Identidad](apps/servicio-identidad.md): Autenticación, roles y usuarios.
- [Servicio Mesas](apps/servicio-mesas.md): Inventario de mesas y su estado en el plano.
- [Servicio Pedidos](apps/servicio-pedidos.md): Gestión de órdenes hacia cocina/barra.
- [Servicio Cuentas](apps/servicio-cuentas.md): Acumulación financiera y cálculos de la mesa.
- [Servicio Reservas](apps/servicio-reservas.md): Agenda y control de disponibilidad.
- [Servicio Inventario](apps/servicio-inventario.md): Catálogo y stock de insumos.
- [Servicio Notificaciones](apps/servicio-notificaciones.md): WebSockets y KDS.
- [Servicio Caja](apps/servicio-caja.md): Transacciones financieras.
- [Servicio Reportes](apps/servicio-reportes.md): Snapshots estadísticos.

## 2. Mapa Global de Eventos RabbitMQ

- [Mapa de Eventos RabbitMQ](rabbitmq_events_map.md): Un registro estricto de todos los publicadores, consumidores y la estructura exacta (`DomainEventEnvelope`) de los eventos que fluyen por el exchange.

## 3. Librerías Compartidas (Shared Kernel)

- [Contracts](libs/contracts.md): DTOs, Enums y `RoutingKeys` importados transversalmente.
- [Observabilidad](libs/observabilidad.md): Trazabilidad OTel y métricas Prometheus.
- [Resiliencia](libs/resiliencia.md): Configuración de Circuit Breaker y RabbitMQ Retry.
- [Shared Auth](libs/shared-auth.md): Módulo global de JWT y guards (RBAC).
- [Shared RabbitMQ](libs/shared-rabbitmq.md): Proveedor global del Publisher.
- [Shared Prisma](libs/shared-prisma.md): *(Código Muerto)*. Explicación de por qué no se usa debido al patrón Database-per-Service.

## 4. Guía Operativa y Despliegue Local

- [Docker & Scripts Operativos](docker_guide.md): Instrucciones completas para encender el sistema desde cero, realizar operaciones del día a día, acceder a la base de datos o ejecutar reinicios de fábrica destruyendo volúmenes.
