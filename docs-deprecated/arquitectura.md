---
tipo: arquitectura
fuente: [package.json:63, libs/contracts/src/messaging/exchange.ts:2, infra/docker-compose.yml:5, infra/prometheus/prometheus.yml:5]
revisado: 2026-05-30
commit: 4c186bb
---

# Arquitectura

Nachopps Restobar esta organizado como monorepo Nx con workspaces para `apps/*` y `libs/*`. [package.json:63]

**Servicios.** [servicio-identidad](servicios/servicio-identidad/_indice.md), [servicio-mesas](servicios/servicio-mesas/_indice.md), [servicio-pedidos](servicios/servicio-pedidos/_indice.md), [servicio-cuentas](servicios/servicio-cuentas/_indice.md), [servicio-reservas](servicios/servicio-reservas/_indice.md), [servicio-inventario](servicios/servicio-inventario/_indice.md), [servicio-notificaciones](servicios/servicio-notificaciones/_indice.md), [servicio-caja](servicios/servicio-caja/_indice.md), [servicio-reportes](servicios/servicio-reportes/_indice.md). [package.json:63]

**Mensajeria.** El exchange compartido se llama `nachopps_exchange` y se declara como constante en contracts. [libs/contracts/src/messaging/exchange.ts:2] El publicador compartido lo declara como exchange `topic`. [libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts:31]

**Datos.** Cada servicio con `schema.prisma` tiene su carpeta de modelos en `docs/servicios/<servicio>/datos`; los contenedores Postgres por servicio estan declarados en Docker Compose. [infra/docker-compose.yml:21]

**Observabilidad.** Prometheus consulta `/api/telemetry/metrics` para los microservicios listados. [infra/prometheus/prometheus.yml:5]
