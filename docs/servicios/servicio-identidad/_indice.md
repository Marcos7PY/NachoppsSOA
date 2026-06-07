---
tipo: indice-servicio
servicio: servicio-identidad
fuente: [apps/servicio-identidad/src/auth/auth.controller.ts:39]
revisado: 2026-06-02
commit: 53877c8
---

# servicio-identidad

**Endpoints.**

- [GET /](endpoints/GET--raiz.md) [apps/servicio-identidad/src/auth/auth.controller.ts:39]
- [POST /auth/login](endpoints/POST--auth-login.md) [apps/servicio-identidad/src/auth/auth.controller.ts:47]
- [POST /auth/logout](endpoints/POST--auth-logout.md) [apps/servicio-identidad/src/auth/auth.controller.ts:75]
- [POST /auth/validate](endpoints/POST--auth-validate.md) [apps/servicio-identidad/src/auth/auth.controller.ts:96]
- [GET /auth/me](endpoints/GET--auth-me.md) [apps/servicio-identidad/src/auth/auth.controller.ts:104]
- [POST /usuarios](endpoints/POST--usuarios.md) [apps/servicio-identidad/src/auth/auth.controller.ts:113]
- [GET /usuarios](endpoints/GET--usuarios.md) [apps/servicio-identidad/src/auth/auth.controller.ts:120]
- [PATCH /usuarios/:id/rol](endpoints/PATCH--usuarios-id-rol.md) [apps/servicio-identidad/src/auth/auth.controller.ts:127]

**Modelos de datos.**

- [Usuario](datos/Usuario.md) [apps/servicio-identidad/prisma/schema.prisma:11]
- [AuditoriaLog](datos/AuditoriaLog.md) [apps/servicio-identidad/prisma/schema.prisma:22]
- [OutboxEvent](datos/OutboxEvent.md) [apps/servicio-identidad/prisma/schema.prisma:33]

**Eventos consumidos.**

- Sin `@EventPattern` detectado en controladores del servicio.
