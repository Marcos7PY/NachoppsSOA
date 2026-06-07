---
tipo: operacion
nombre: base-de-datos
fuente: [infra/docker-compose.yml:21, apps/servicio-identidad/prisma/schema.prisma:11, apps/servicio-identidad/prisma/schema.prisma:22, apps/servicio-identidad/prisma/schema.prisma:33, apps/servicio-mesas/prisma/schema.prisma:17, apps/servicio-mesas/prisma/schema.prisma:31, apps/servicio-mesas/prisma/schema.prisma:44, apps/servicio-pedidos/prisma/schema.prisma:20, apps/servicio-pedidos/prisma/schema.prisma:36, apps/servicio-pedidos/prisma/schema.prisma:54, apps/servicio-pedidos/prisma/schema.prisma:62, apps/servicio-pedidos/prisma/schema.prisma:72, apps/servicio-pedidos/prisma/schema.prisma:85, apps/servicio-pedidos/prisma/schema.prisma:96, apps/servicio-cuentas/prisma/schema.prisma:16, apps/servicio-cuentas/prisma/schema.prisma:30, apps/servicio-reservas/prisma/schema.prisma:10, apps/servicio-reservas/prisma/schema.prisma:27, apps/servicio-inventario/prisma/schema.prisma:11, apps/servicio-inventario/prisma/schema.prisma:22, apps/servicio-inventario/prisma/schema.prisma:38]
revisado: 2026-06-02
commit: 53877c8
---

# Base de datos

Docker Compose declara bases Postgres separadas por servicio. [infra/docker-compose.yml:21]

Los schemas Prisma documentados estan enlazados desde los indices de cada servicio. [apps/servicio-identidad/prisma/schema.prisma:11]

