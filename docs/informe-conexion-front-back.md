# Informe de conexion Front/Back

Fecha de revision: 2026-06-01  
Workspace: `C:\Users\MARCOS\Desktop\BackActual`

## Resumen ejecutivo

La conexion principal entre frontend y backend esta implementada de forma coherente:

```text
pwa-cliente -> fetch centralizado -> Kong :8000 -> microservicios NestJS /api -> Prisma/Postgres
```

La mayoria de endpoints llamados por la PWA existen y coinciden con controladores reales. Tambien hay una arquitectura backend-backend razonable basada en outbox transaccional, RabbitMQ, DLQ, reintentos y bases de datos separadas por servicio.

Sin embargo, hay problemas importantes:

1. El frontend no pasa typecheck.
2. El front duplica contratos en vez de consumir `@org/contracts`.
3. La autenticacion usa dos fuentes de verdad: cookie HttpOnly y token en `localStorage`.
4. El WebSocket depende demasiado de Kong para seguridad y no valida JWT en el gateway NestJS.
5. Kong enruta dentro de Docker usando `host.docker.internal` en vez de nombres internos de servicio.
6. Las invalidaciones por socket pueden disparar demasiados refetches.
7. Varios listados no tienen paginacion ni limites consistentes.

Comando ejecutado:

```powershell
npm exec nx run pwa-cliente:typecheck
```

Resultado: falla con errores TypeScript en `DeliveryScreen.tsx` y `MesasScreen.tsx`.

## Arquitectura real detectada

### Proyectos Nx relevantes

Frontend:

- `pwa-cliente`

Backends:

- `servicio-identidad`
- `servicio-mesas`
- `servicio-pedidos`
- `servicio-cuentas`
- `servicio-reservas`
- `servicio-inventario`
- `servicio-notificaciones`
- `servicio-caja`
- `servicio-reportes`

Librerias compartidas:

- `contracts`
- `shared-prisma`
- `@org/shared-auth`
- `@org/shared-rabbitmq`
- `@org/resiliencia`
- `@org/observabilidad`

Dato critico: el grafo Nx muestra que `pwa-cliente` no depende estaticamente de `contracts`. Eso significa que el frontend mantiene tipos locales, no contratos compartidos compilables.

## Flujo HTTP Front -> Back

El cliente HTTP central esta en:

- `apps/pwa-cliente/src/api/client.ts`

Puntos clave:

- `BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'`
- Agrega `Content-Type: application/json`
- Agrega `Authorization: Bearer <token>` si hay token local
- Usa `credentials: 'include'`
- En `401` limpia token local y emite `CustomEvent('auth:expired')`
- En `429` normaliza mensaje de rate limit

Esto significa que la PWA apunta al gateway Kong, no directamente a microservicios.

## Gateway Kong

Archivo:

- `infra/kong/kong.yml.template`

Kong publica:

- Proxy: `http://localhost:8000`
- Admin: `http://localhost:8001`

Kong aplica:

- CORS global
- rate limiting global
- plugin `jwt-cache`
- plugin JWT por servicio protegido

### Tabla de rutas

| Ruta llamada por front | Servicio Kong | Upstream configurado | Backend esperado |
|---|---|---|---|
| `/identidad/auth/login` | `servicio-identidad-public` | `http://host.docker.internal:3001/api/auth` | `POST /api/auth/login` |
| `/identidad/auth/me` | `servicio-identidad` | `http://host.docker.internal:3001/api` | `GET /api/auth/me` |
| `/identidad/usuarios` | `servicio-identidad` | `http://host.docker.internal:3001/api` | `GET/POST /api/usuarios` |
| `/mesas` | `servicio-mesas` | `http://host.docker.internal:3002/api` | `GET/POST /api` |
| `/mesas/:id` | `servicio-mesas` | `http://host.docker.internal:3002/api` | `GET /api/:id` |
| `/mesas/:id/estado` | `servicio-mesas` | `http://host.docker.internal:3002/api` | `PATCH /api/:id/estado` |
| `/pedidos` | `servicio-pedidos` | `http://host.docker.internal:3004/api` | `GET/POST /api` |
| `/pedidos/:id/estado` | `servicio-pedidos` | `http://host.docker.internal:3004/api` | `PATCH /api/:id/estado` |
| `/pedidos/items/:itemId/estado` | `servicio-pedidos` | `http://host.docker.internal:3004/api` | `PATCH /api/items/:itemId/estado` |
| `/cuentas` | `servicio-cuentas` | `http://host.docker.internal:3005/api` | `POST /api` |
| `/cuentas/mesa/:mesaId` | `servicio-cuentas` | `http://host.docker.internal:3005/api` | `GET /api/mesa/:mesaId` |
| `/cuentas/:id` | `servicio-cuentas` | `http://host.docker.internal:3005/api` | `GET /api/:id` |
| `/cuentas/:id/cerrar` | `servicio-cuentas` | `http://host.docker.internal:3005/api` | `POST /api/:id/cerrar` |
| `/cuentas/:id/dividir` | `servicio-cuentas` | `http://host.docker.internal:3005/api` | `POST /api/:id/dividir` |
| `/caja/pagos` | `servicio-caja` | `http://host.docker.internal:3009/api` | `POST /api/pagos` |
| `/reservas` | `servicio-reservas` | `http://host.docker.internal:3006/api` | `GET/POST /api` |
| `/reservas/disponibilidad` | `servicio-reservas` | `http://host.docker.internal:3006/api` | `GET /api/disponibilidad` |
| `/reservas/:id/confirmar` | `servicio-reservas` | `http://host.docker.internal:3006/api` | `PATCH /api/:id/confirmar` |
| `/reservas/:id` | `servicio-reservas` | `http://host.docker.internal:3006/api` | `DELETE /api/:id` |
| `/inventario/categorias` | `servicio-inventario` | `http://host.docker.internal:3007/api` | `GET/POST /api/categorias` |
| `/inventario/productos` | `servicio-inventario` | `http://host.docker.internal:3007/api` | `GET/POST /api/productos` |
| `/inventario/productos/:id/stock` | `servicio-inventario` | `http://host.docker.internal:3007/api` | `PATCH /api/productos/:id/stock` |
| `/notificaciones` | `servicio-notificaciones` | `http://host.docker.internal:3008/api` | `GET /api` |
| `/reportes/resumen` | `servicio-reportes` | `http://host.docker.internal:3010/api` | `GET /api/resumen` |

Conclusión: el routing HTTP principal esta bien alineado.

## Autenticacion

### Flujo actual

1. Front llama `POST /identidad/auth/login`.
2. `servicio-identidad` valida credenciales.
3. Backend genera JWT.
4. Backend devuelve el token en JSON.
5. Backend tambien setea cookie `access_token` HttpOnly.
6. Front guarda `access_token` en `localStorage`.
7. En requests posteriores, front manda:
   - cookie, por `credentials: 'include'`
   - header `Authorization: Bearer <token>`, por token local

Archivos:

- `apps/pwa-cliente/src/api/auth.api.ts`
- `apps/pwa-cliente/src/api/client.ts`
- `apps/servicio-identidad/src/auth/auth.controller.ts`
- `apps/servicio-identidad/src/auth/auth.service.ts`
- `libs/shared-auth/src/lib/jwt.strategy.ts`

### Problema

Hay dos fuentes de verdad para sesion:

- Cookie HttpOnly: mejor para navegador.
- `localStorage`: mas vulnerable ante XSS.

### Recomendacion

Para la PWA, usar solo cookie HttpOnly:

- eliminar persistencia de token en `localStorage`
- eliminar envio automatico de `Authorization`
- mantener `credentials: 'include'`
- dejar Bearer solo para clientes no-browser o llamadas internas service-to-service

## WebSocket / tiempo real

### Flujo actual

Frontend:

- `apps/pwa-cliente/src/services/socket.service.ts`
- `BASE_URL = VITE_API_BASE_URL ?? http://localhost:8000`
- `WS_PATH = VITE_WS_PATH ?? /notificaciones/socket.io`

Backend:

- `apps/servicio-notificaciones/src/app/notifications.gateway.ts`
- `@WebSocketGateway({ path: '/api/socket.io' })`

Kong:

- recibe `/notificaciones/socket.io`
- hace `strip_path`
- deriva a `http://host.docker.internal:3008/api/socket.io`

La ruta esta bien conectada.

### Problemas

1. El gateway WebSocket no valida JWT en `handleConnection`.
2. El token se manda tambien por query string: `query: { jwt: token }`.
3. Como `docker-compose.yml` publica el puerto `3008:3000`, un cliente podria intentar conectar directo al servicio y saltarse Kong.

### Recomendaciones

- Validar token en `NotificationsGateway`.
- Evitar token por query string.
- Usar cookie HttpOnly o `socket.handshake.auth.token`.
- Si la intencion es que solo Kong exponga el servicio, no publicar puertos internos en produccion.

## Contratos y tipos

### Estado actual

El backend usa `@org/contracts`.

El frontend tiene tipos locales en:

- `apps/pwa-cliente/src/types/*.ts`

Ejemplo:

- `mesa.types.ts` dice que esta basado en `libs/contracts/src/domains/mesas.ts`
- `pedido.types.ts` dice que esta basado en `libs/contracts/src/domains/pedidos.ts`

Pero el frontend no importa `@org/contracts`.

### Riesgo

Hay drift entre DTO real, VM y pantalla. El caso concreto ya aparece en el typecheck:

- `MesaDto.numero` es `number`
- `MesaVM.numero` es `string`
- `MesaVM.numeroRaw` es `number`
- pantallas usan `m.numero < 90` y `m.numero === 99`

Eso debe usar `numeroRaw`.

### Recomendacion

Opciones:

1. Importar DTOs y commands desde `@org/contracts` en el front.
2. Generar cliente tipado desde OpenAPI.
3. Mantener DTOs locales, pero agregar tests de contrato que comparen runtime schemas.

La opcion mas limpia en este monorepo es consumir `@org/contracts` o generar tipos desde una fuente unica.

## Errores de typecheck detectados

Comando:

```powershell
npm exec nx run pwa-cliente:typecheck
```

Errores relevantes:

```text
src/screens/ops/DeliveryScreen.tsx(16,9): 'paramMesaNumero' is declared but its value is never read.
src/screens/ops/DeliveryScreen.tsx(50,36): Operator '<' cannot be applied to types 'string' and 'number'.
src/screens/ops/DeliveryScreen.tsx(50,67): arithmetic operation over string.
src/screens/ops/DeliveryScreen.tsx(66,42): comparison string vs number.
src/screens/ops/DeliveryScreen.tsx(67,40): comparison string vs number.
src/screens/ops/MesasScreen.tsx(46,42): Operator '<' cannot be applied to types 'string' and 'number'.
src/screens/ops/MesasScreen.tsx(286,40): 'cuentaActiva' is possibly 'null'.
```

### Causa

Uso incorrecto de `MesaVM.numero` como si fuera numerico.

### Correccion recomendada

- Reemplazar logica numerica sobre `m.numero` por `m.numeroRaw`.
- Mantener `m.numero` solo para presentacion.
- Agregar guard/null check antes de renderizar `cuentaActiva.total`.

## Rendimiento

### Frontend

#### Problema: invalidacion agresiva por socket

`socket.service.ts` invalida multiples stores por evento:

- pedidos
- mesas
- cuentas
- notificaciones

Esto esta bien funcionalmente, pero bajo carga puede generar rafagas:

```text
pedido.actualizado -> GET /pedidos + GET /mesas + GET /cuentas/:id
cuenta.abierta -> GET /mesas + GET /pedidos + GET /cuentas/:id
mesa.actualizada -> GET /mesas + GET /pedidos
```

Recomendacion:

- debounce/coalescing por 250-500 ms
- deduplicar requests en vuelo
- usar payload de socket para patch local cuando sea suficiente

#### Problema: stores sin cache temporal

Los stores hacen `fetch()` en montaje/foco y `invalidate()` en eventos. No hay TTL ni deduplicacion.

Recomendacion:

- `lastFetchedAt`
- no refetchear si hay request en vuelo
- cache corto para pantallas de lectura

#### Problema: service worker cachea estaticos, pero ignora API

Eso es correcto para consistencia, pero limita modo offline real.

Recomendacion:

- Para POS offline, agregar cola local de mutaciones idempotentes.
- Para lectura, cachear snapshots no sensibles con estrategia stale-while-revalidate.

### Backend

#### Listados sin paginacion

Endpoints con riesgo:

- `GET /pedidos`
- `GET /reservas`
- `GET /inventario/productos`
- `GET /identidad/usuarios`
- `GET /caja`

`notificaciones` si limita a 50.

Recomendacion:

- `limit`
- `cursor`
- filtros por fecha/estado
- `updatedSince` para sync incremental

#### Reportes con datos simulados

`servicio-reportes` calcula `topProductos` con una lista estatica y factores derivados del total de ventas, no de items reales.

Esto no rompe la conexion front/back, pero si rompe la veracidad funcional del dashboard.

Recomendacion:

- Emitir en `CuentaCerradaPayload` los items/productos del ticket o mantener una proyeccion de ventas por producto.

#### Outbox cada segundo con lotes de 50

El patron es correcto, pero en alto volumen puede acumular backlog.

Recomendacion:

- metricas de backlog por servicio
- indice por `(status, createdAt)`
- lock/claim atomico si hay multiples instancias
- ajustar batch size por servicio

## Comunicacion entre microservicios

### Patrones detectados

1. Eventos por RabbitMQ:
   - mesas publica `mesa.creada`, `mesa.actualizada`
   - pedidos publica `pedido.creado`, `pedido.actualizado`, `pedido.listo`
   - cuentas publica `cuenta.abierta`, `cuenta.cerrada`, `ticket.generado`
   - caja publica `pago.registrado`
   - reservas publica `reserva.creada`, `reserva.cancelada`
   - inventario publica `producto.creado`, `producto.actualizado`

2. HTTP interno:
   - pedidos consulta inventario por lote en cold-start
   - caja consulta cuentas antes de pagar

### Fortalezas

- Outbox transaccional.
- DLQ por cola.
- Reintentos con backoff.
- Idempotencia en varios consumidores.
- Proyecciones locales para desacoplar servicios.

### Riesgos

- Algunas llamadas HTTP internas usan fallback URLs orientadas a Docker.
- Las colas y bindings mezclan strings literales y `RoutingKeys`.
- Si hay varias replicas, el outbox processor necesita claim atomico para evitar doble publicacion.

## Seguridad

### Bueno

- Kong protege rutas con JWT.
- CORS restringido a localhost dev.
- Cookies HttpOnly en login.
- Rate limit global y rate limit especifico para login.
- `ValidationPipe` con `whitelist`, `forbidNonWhitelisted` y `transform`.

### Mejorable

1. Quitar token de `localStorage`.
2. Validar WebSocket en backend.
3. No exponer puertos internos de servicios en produccion.
4. Separar secretos dev/prod.
5. Revisar `sameSite: 'lax'` si se despliega front/back en dominios distintos.
6. Agregar CSRF si se migra a cookie-only y hay operaciones state-changing cross-site.

## Lo que esta mal conectado o fragil

### Critico

- Front no compila por uso incorrecto de tipos `MesaVM`.
- WebSocket backend no autentica conexiones directas.

### Alto

- Token duplicado: cookie + localStorage.
- Contratos duplicados en front.
- Kong dentro de Docker apunta a `host.docker.internal`.

### Medio

- Refetch excesivo por socket.
- Listados sin paginacion.
- `DELETE /reservas/:id` con body.
- `topProductos` de reportes no sale de ventas reales por producto.

### Bajo

- `paramMesaNumero` declarado y no usado.
- Mensajes de error genericos en algunos stores.
- Algunos bindings usan strings en vez de constantes compartidas.

## Plan de mejora recomendado

### Fase 1: estabilizacion inmediata

1. Corregir typecheck del front.
2. Usar `numeroRaw` para logica numerica de mesas.
3. Agregar guard para `cuentaActiva`.
4. Ejecutar `npm exec nx run pwa-cliente:typecheck` hasta verde.

### Fase 2: seguridad de sesion

1. Migrar PWA a cookie-only.
2. Eliminar `localStorage` para JWT.
3. Validar JWT en `NotificationsGateway`.
4. Quitar token de query string en Socket.IO.

### Fase 3: contratos

1. Decidir fuente unica de contratos.
2. Conectar `pwa-cliente` a `@org/contracts` o generar cliente tipado.
3. Agregar tests de contrato para endpoints principales.

### Fase 4: rendimiento

1. Debounce de invalidaciones por socket.
2. Deduplicar requests en vuelo.
3. Paginacion/cursor en listados.
4. Indices y metricas de outbox backlog.

### Fase 5: despliegue

1. Cambiar upstreams Kong Compose a nombres internos de servicio.
2. No publicar puertos internos salvo dev.
3. Separar config dev/prod.

## Conclusión

La integracion general esta bien encaminada y el sistema tiene una arquitectura backend bastante robusta para eventos y consistencia eventual. El mayor riesgo actual esta en la frontera front/back: tipos duplicados, typecheck roto, autenticacion duplicada y WebSocket sin validacion propia.

La prioridad no deberia ser agregar mas features, sino cerrar la brecha de contrato y seguridad:

1. compilar el front,
2. unificar contratos,
3. simplificar auth,
4. proteger socket,
5. reducir refetch innecesario.

