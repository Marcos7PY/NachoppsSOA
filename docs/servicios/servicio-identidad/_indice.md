---
tipo: indice-servicio
servicio: servicio-identidad
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:24]
revisado: 2026-05-30
commit: 4c186bb
---

# servicio-identidad

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-identidad/src/auth/auth.controller.ts:28]
- [POST /auth/login](endpoints/POST--auth-login.md) [apps/servicio-identidad/src/auth/auth.controller.ts:36]
- [POST /auth/validate](endpoints/POST--auth-validate.md) [apps/servicio-identidad/src/auth/auth.controller.ts:50]
- [GET /auth/me](endpoints/GET--auth-me.md) [apps/servicio-identidad/src/auth/auth.controller.ts:58]
- [POST /usuarios](endpoints/POST--usuarios.md) [apps/servicio-identidad/src/auth/auth.controller.ts:67]
- [GET /usuarios](endpoints/GET--usuarios.md) [apps/servicio-identidad/src/auth/auth.controller.ts:74]
- [PATCH /usuarios/:id/rol](endpoints/PATCH--usuarios-id-rol.md) [apps/servicio-identidad/src/auth/auth.controller.ts:81]

**Modelos de datos.**

- [Usuario](datos/Usuario.md) [apps/servicio-identidad/prisma/schema.prisma:11]
- [AuditoriaLog](datos/AuditoriaLog.md) [apps/servicio-identidad/prisma/schema.prisma:22]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-identidad/prisma/schema.prisma:33]

**Eventos consumidos.**

- Sin `@EventPattern` detectado en controladores del servicio. [apps/servicio-identidad/src/auth/auth.controller.ts:24]
