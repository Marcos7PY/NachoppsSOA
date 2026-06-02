---
tipo: operacion
nombre: levantar-sistema
fuente: [infra/docker-compose.yml:1, package.json:6]
revisado: 2026-06-02
commit: 53877c8
---

# Levantar sistema

Docker Compose define RabbitMQ, Postgres por servicio y microservicios bajo `infra/docker-compose.yml`. [infra/docker-compose.yml:1]

RabbitMQ expone los puertos 5672 y 15672. [infra/docker-compose.yml:8]

Los scripts de prueba y poblado estan en `package.json`. [package.json:6]

