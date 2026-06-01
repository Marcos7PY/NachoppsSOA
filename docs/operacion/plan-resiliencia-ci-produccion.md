# Plan de continuidad - resiliencia real, CI/CD y operacion produccion

Fecha local: 2026-05-31  
Workspace: `C:\Users\MARCOS\Desktop\BackActual`  
Estado: plan para continuar en otra sesion  
Alcance: backend, infraestructura, CI/CD y operacion. La PWA queda fuera de este plan.

## Resumen ejecutivo

El sistema backend esta funcional y con evidencia fuerte previa:

- Integracion funcional: `npm run probar` con `49/49`, `0` fallas.
- Stock, idempotencia, DLQ y parking: `npm run probar:stock` con `12/12` invariantes OK.
- Concurrencia C5/C6/C7: evidencia previa hasta `200 x 100` en Fase 3.
- RabbitMQ: cierres previos con colas y DLQ en `0 ready / 0 unacked`.

Lo que falta cerrar no es principalmente CRUD, sino validacion operacional:

1. Resiliencia real ante caidas de servicios, RabbitMQ y DB criticas.
2. CI/CD con compuertas automaticas suficientes.
3. Preparacion de operacion produccion: secretos, migraciones, backups, observabilidad, alertas y runbooks.

## Contexto importante

Existe un plan historico vigente en:

```text
docs/operacion/plan-pruebas-tope-resiliencia-pentest.md
```

Y un handoff reciente en:

```text
docs/handoff-pruebas-tope-resiliencia-pentest.md
```

Ese handoff dejo la validacion maxima bloqueada con observaciones: durante alta contencion, Kong empezo a responder `429 API rate limit exceeded` en `CONCURRENCY=50`, antes de completar las fases de estres extremo `200 x 100`, resiliencia y smoke final.

Interpretacion: no asumir automaticamente fallo funcional del dominio. Primero separar el problema de rate limit para que las pruebas de carga y resiliencia no se contaminen con `429` esperados por politica de gateway.

## Principios de ejecucion

- Ejecutar fallos reales de a uno. No reiniciar varios componentes a la vez.
- No continuar a la siguiente fase si queda backlog inesperado en RabbitMQ, DLQ con mensajes no explicados, contenedor unhealthy o datos inconsistentes.
- Despues de cada fallo, clasificar el resultado:
  - OK: recupera y las invariantes quedan verdes.
  - Degradacion transitoria: hubo timeouts/status `0`/latencia alta, pero recupera sin corrupcion.
  - Fallo funcional: se rompe una invariante de negocio.
  - Fallo operacional: contenedor no recupera, cola no drena, DB no reconecta, etc.
- Guardar evidencia en Markdown: comandos, reportes, logs relevantes, estado de colas, estado de Docker y conclusion.
- No borrar volumenes Docker durante estas pruebas.
- No ejecutar pentest, alta carga y resiliencia al mismo tiempo.

## Fase 0 - Preflight

Objetivo: confirmar estado inicial sano y reproducible.

Comandos:

```powershell
git status --short --branch
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing -TimeoutSec 5
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
npm run probar
Start-Sleep -Seconds 70
npm run probar:stock
```

Criterios:

- Kong responde. La ruta raiz puede devolver `404 no Route matched`, eso es normal si no hay route raiz.
- `npm run probar`: `49/49`, `0` fallas.
- `npm run probar:stock`: `12/12` invariantes OK.
- RabbitMQ sin backlog inesperado.
- Registrar cambios locales existentes antes de iniciar.

## Fase 1 - Aislar rate limit para pruebas pesadas

Objetivo: evitar que `429` de Kong o login rate limit contamine resiliencia y carga.

Opciones aceptables:

1. Mantener rate limit normal para pentest y seguridad.
2. Usar una ventana/consumer key dedicada para pruebas de carga controlada.
3. Ajustar temporalmente politicas de rate limit solo para endpoints de setup usados por runners.
4. Ejecutar runners con pausas explicitas cuando el objetivo no sea probar rate limiting.

Pendiente de decision tecnica:

- Definir si se toca configuracion Kong en `infra/kong/kong.yml.template`.
- Definir si los runners deben soportar una credencial/consumer especial de carga.
- Definir si se documenta un perfil local de "stress" separado del perfil normal.

Criterio:

- Seguridad debe seguir validando que rate limit responde `429`.
- Resiliencia y stress no deben fallar por `429` en endpoints auxiliares salvo que ese sea el objetivo explicito.

## Fase 2 - Resiliencia real por servicios

Objetivo: reiniciar servicios criticos y demostrar reconvergencia sin corrupcion.

### 2.1 Reinicio de inventario

```powershell
docker restart nachopps-servicio-inventario
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker logs --tail 120 nachopps-servicio-inventario
```

Criterios:

- `probar:stock` termina `12/12` OK.
- No queda backlog inesperado.
- Inventario reconecta a DB y RabbitMQ.
- No hay doble descuento ni perdida de idempotencia.

### 2.2 Reinicio de pedidos

```powershell
docker restart nachopps-servicio-pedidos
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker logs --tail 120 nachopps-servicio-pedidos
```

Criterios:

- Proyeccion local de stock sigue consistente.
- Redelivery no duplica efectos.
- Colas limpias.

### 2.3 Reinicio de reservas

```powershell
docker restart nachopps-servicio-reservas
Start-Sleep -Seconds 20
npm run probar:concurrencia
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker logs --tail 120 nachopps-servicio-reservas
```

Criterios:

- C7 mantiene una sola reserva activa por slot.
- No aparecen duplicados tras reinicio.

## Fase 3 - Resiliencia de infraestructura

Objetivo: validar recuperacion ante fallos de broker y DB criticas.

### 3.1 Reinicio de RabbitMQ

```powershell
docker restart nachopps-rabbitmq
Start-Sleep -Seconds 40
docker ps --format "table {{.Names}}\t{{.Status}}"
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Criterios:

- Consumidores reconectan.
- `probar:stock` queda `12/12` OK.
- No queda backlog final inesperado.

### 3.2 Reinicio de DB pedidos

```powershell
docker restart nachopps-db-pedidos
Start-Sleep -Seconds 30
docker restart nachopps-servicio-pedidos
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Criterios:

- Pedidos reconecta.
- No se rompe idempotencia inversa.
- No se corrompe proyeccion local.

### 3.3 Reinicio de DB inventario

```powershell
docker restart nachopps-db-inventario
Start-Sleep -Seconds 30
docker restart nachopps-servicio-inventario
Start-Sleep -Seconds 20
npm run probar:stock
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Criterios:

- Inventario reconecta.
- Stock final coincide con esperado.
- DLQ/parking sin residuos inesperados.

### 3.4 Reinicio de DB reservas

```powershell
docker restart nachopps-db-reservas
Start-Sleep -Seconds 30
docker restart nachopps-servicio-reservas
Start-Sleep -Seconds 20
npm run probar:concurrencia
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Criterios:

- Reservas reconecta.
- Slot unico activo sigue protegido.
- C7 permanece verde.

## Fase 4 - Smoke final de resiliencia

Objetivo: confirmar que el sistema queda limpio despues de provocar fallos.

```powershell
npm run probar
Start-Sleep -Seconds 70
npm run probar:stock
Start-Sleep -Seconds 70
npm run probar:seguridad
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker ps --format "table {{.Names}}\t{{.Status}}"
git status --short --branch
```

Criterios:

- Integracion: `49/49`, `0` fallas.
- Stock/DLQ: `12/12` OK.
- Seguridad: `7/7` OK.
- RabbitMQ: colas principales, DLQ y parking en `0 ready / 0 unacked`, salvo hallazgo documentado.
- Contenedores principales arriba y saludables cuando aplique.

Entregable:

```text
docs/handoff-resiliencia-real.md
```

Debe incluir:

- fecha local;
- branch y commit;
- comandos ejecutados;
- resultados por bloque;
- logs relevantes;
- reportes generados;
- estado final RabbitMQ;
- estado final Docker;
- conclusion: cerrado, cerrado con observaciones o bloqueado.

## Fase 5 - CI rapido para PR

Objetivo: que ningun PR entre sin compuerta basica.

Estado actual:

```text
.github/workflows/ci.yml
```

Actualmente ejecuta:

- checkout;
- setup Node;
- `npm ci`;
- Prisma generate;
- `npx nx run-many -t build --parallel`.

Mejora propuesta:

- Mantener `npm ci`.
- Mantener Prisma generate.
- Agregar validacion Nx con `affected` cuando aplique.
- Ejecutar build y test de proyectos afectados.
- Guardar logs si falla.

Comando base recomendado segun docs Nx para CI:

```powershell
npm exec nx affected -t build,test --parallel
```

Notas:

- Verificar base/head correctos en GitHub Actions antes de implementar `affected`.
- No meter stress, resiliencia ni pentest pesado en cada PR.
- Si `affected` se vuelve incomodo al inicio, usar `nx run-many -t build,test --parallel` como primer paso y optimizar despues.

Criterio:

- PR falla si build o tests unitarios fallan.
- CI no depende de CLI global de Nx.

## Fase 6 - CI de integracion Docker

Objetivo: validar que el sistema completo levanta y que los flujos reales pasan.

Workflow sugerido:

- Trigger manual y/o push a `main`.
- Levantar Docker Compose sin PWA.
- Migrar/sincronizar schemas.
- Poblar datos.
- Ejecutar:
  - `npm run probar`
  - `npm run probar:stock`
  - `npm run probar:seguridad`
- Subir artifacts:
  - `docs/informe-pruebas.md`
  - `stress-tests/reports/*.md`
  - logs de servicios si falla.

Criterio:

- Integracion Docker es obligatoria antes de release.
- Fallas por `429` deben clasificarse como politica de gateway, no mezclarse con errores funcionales.

## Fase 7 - CI pesado manual/nightly

Objetivo: ejecutar carga, stress y resiliencia fuera del ciclo rapido de PR.

Trigger:

- `workflow_dispatch`.
- Nightly opcional.
- Antes de release.

Bloques:

1. Alta contencion.
2. Estres `200 x 100`.
3. Resiliencia real.
4. Smoke final.

Criterio:

- Si falla, se genera handoff automatico o artifact con diagnostico minimo.
- No bloquea todo desarrollo diario, pero si debe bloquear release.

## Fase 8 - CD staging

Objetivo: desplegar imagenes reproducibles en ambiente controlado.

Pasos:

- Build Docker por servicio.
- Tag con commit SHA.
- Push a registry.
- Deploy a staging.
- Ejecutar smoke post-deploy:
  - health de Kong;
  - `npm run probar` contra staging si es viable;
  - chequeo RabbitMQ;
  - chequeo de servicios.

Criterio:

- No promover a produccion sin smoke staging verde.

## Fase 9 - CD produccion

Objetivo: despliegue seguro y reversible.

Pendientes antes de activar:

- Definir registry.
- Definir host/orquestador de produccion.
- Definir estrategia de deploy:
  - rolling;
  - blue/green;
  - recreate controlado.
- Definir rollback:
  - imagen anterior;
  - migraciones compatibles;
  - smoke post-rollback.

Criterio:

- Produccion no se actualiza sin:
  - CI rapido verde;
  - integracion Docker verde;
  - staging verde;
  - plan de rollback claro.

## Fase 10 - Operacion produccion

Objetivo: que el sistema sea operable, observable y recuperable.

### 10.1 Secretos y configuracion

Pendientes:

- Sacar secretos reales de archivos versionados.
- Gestionar por ambiente:
  - `JWT_SECRET`;
  - `KONG_JWT_SECRET`;
  - passwords DB;
  - password RabbitMQ;
  - credenciales de registry;
  - credenciales de observabilidad si aplica.
- Documentar rotacion.
- Validar que `.env.example` sea solo plantilla.

Criterio:

- No hay secretos productivos hardcodeados.
- Rotar secreto JWT/Kong tiene runbook.

### 10.2 Migraciones

Pendientes:

- Definir comando oficial de migracion por servicio.
- Definir orden de ejecucion.
- Definir check previo y posterior.
- Documentar que hacer si una migracion falla.

Criterio:

- Release incluye migraciones reproducibles.
- Hay forma de verificar que cada DB quedo en version esperada.

### 10.3 Backups y restore

Pendientes:

- Backups por DB.
- Frecuencia.
- Retencion.
- Ubicacion segura.
- Prueba real de restore.

DB criticas:

- identidad;
- mesas;
- pedidos;
- cuentas;
- reservas;
- inventario;
- caja;
- reportes;
- notificaciones.

Criterio:

- No basta con tener backups: debe existir evidencia de restore exitoso.

### 10.4 Observabilidad

Ya existe base:

- Prometheus en `infra/prometheus/prometheus.yml`.
- Grafana en compose.
- Jaeger/OTEL en compose.
- Libreria `@org/observabilidad`.

Pendientes:

- Dashboards por servicio.
- Dashboard RabbitMQ.
- Dashboard Kong.
- Dashboard DB.
- Trazas utiles por flujo critico.
- Retencion de metricas/logs.

Metricas minimas:

- latencia p95/p99 por servicio;
- tasa de errores 4xx/5xx;
- `429` por route en Kong;
- reinicios de contenedores;
- profundidad de colas RabbitMQ;
- profundidad de DLQ y parking;
- conexiones DB;
- tiempo de respuesta DB;
- uso CPU/memoria por contenedor.

### 10.5 Alertas

Alertas minimas:

- servicio down;
- Kong unhealthy;
- RabbitMQ unhealthy;
- DB down;
- cola principal con backlog sostenido;
- DLQ o parking con mensajes;
- 5xx elevado;
- `429` elevado fuera de pruebas;
- p95/p99 alto sostenido;
- contenedor reiniciando en bucle;
- disco alto;
- backup fallido.

Criterio:

- Cada alerta debe tener runbook asociado.

### 10.6 Runbooks

Crear documentos en `docs/operacion/runbooks/`.

Runbooks prioritarios:

- `rabbitmq-backlog.md`
- `dlq-parking.md`
- `servicio-no-reconecta-db.md`
- `kong-429-masivo.md`
- `stock-divergente.md`
- `deploy-fallido.md`
- `restore-db.md`
- `rotacion-secretos.md`

Cada runbook debe incluir:

- sintomas;
- impacto;
- diagnostico rapido;
- comandos;
- mitigacion;
- recuperacion;
- validacion final;
- cuando escalar.

## Backlog especifico detectado

### Caja avanzada

`PLIN` existe en contratos, pero no esta probado en integracion.

Pendiente:

- Agregar caso PLIN a `scripts/pruebas-integracion.ts`.
- Confirmar que `servicio-caja` persiste y reporta el metodo correctamente.

### Arqueo y turnos

`arqueo.realizado` esta definido como routing key, pero la documentacion atomica lo marca sin productor/consumidor detectado.

Pendiente de decision:

- Si arqueos/turnos son alcance backend real, implementar endpoints y evento.
- Si no son alcance, limpiar contratos/docs para no prometer funcionalidad inexistente.

### Eventos definidos sin uso

Revisar:

- `reserva.confirmada`;
- `mesa.asignada`;
- `mesa.liberada`;
- `arqueo.realizado`;
- `stock.bajo`;
- `stock.descontado`;
- otros marcados en `docs/eventos/_catalogo.md`.

Decision:

- Implementar si son parte del dominio esperado.
- O documentar como reservados/futuros.
- O eliminar si generan confusion.

## Orden recomendado para la proxima sesion

1. Leer este archivo.
2. Leer `docs/handoff-pruebas-tope-resiliencia-pentest.md`.
3. Ejecutar Fase 0 preflight.
4. Decidir estrategia de rate limit para pruebas pesadas.
5. Ejecutar Fase 2 y Fase 3 de resiliencia real.
6. Ejecutar Fase 4 smoke final.
7. Crear `docs/handoff-resiliencia-real.md`.
8. Luego implementar CI rapido.
9. Luego implementar CI integracion Docker.
10. Luego documentar operacion produccion y runbooks.

## Comandos de referencia

Listar proyectos Nx:

```powershell
npm exec nx show projects --json
```

Build todos los proyectos:

```powershell
npm exec nx run-many -t build --parallel
```

Tests por Nx:

```powershell
npm exec nx run-many -t test --parallel
```

CI affected:

```powershell
npm exec nx affected -t build,test --parallel
```

Pruebas actuales de sistema:

```powershell
npm run probar
npm run probar:seguridad
npm run probar:stock
npm run probar:concurrencia
npm run probar:alta-contencion
```

RabbitMQ queues:

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

Docker estado:

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker stats --no-stream
```

## Criterio final de cierre del plan

Este plan puede marcarse cerrado cuando:

- resiliencia real queda ejecutada y documentada;
- CI rapido protege PRs;
- CI integracion Docker protege `main` o release;
- existe workflow manual/nightly para stress/resiliencia;
- staging tiene CD con smoke post-deploy;
- produccion tiene estrategia de deploy y rollback;
- secretos productivos no estan hardcodeados;
- backups y restore estan probados;
- dashboards y alertas minimas existen;
- runbooks prioritarios estan documentados.
