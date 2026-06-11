# Migraciones con Prisma — estado actual y opción futura

## Estado actual (T-32)

`prisma` (CLI) está en `dependencies` porque `entrypoint.sh` ejecuta `prisma migrate deploy`
al arrancar el contenedor. Es el trade-off correcto para el estadio actual del proyecto: simple,
sin infraestructura adicional, y el deploy es atómico (si migra, arranca; si no, no).

El coste es que el CLI de Prisma (~888 MB en `servicio-identidad`) queda en la imagen de runtime.

## Futuro: migraciones como job dedicado

El runtime incluye el CLI de Prisma solo para `migrate deploy` en el entrypoint. Si se
necesita reducir más la imagen o desacoplar migración de arranque (réplicas, rollouts),
el patrón es: imagen/job de migración propia (init-container en K8s o servicio one-shot
en compose con `depends_on: condition: service_completed_successfully`), y el runtime
queda solo con el cliente generado. No planificado; registrar aquí la decisión si se hace.
