# Plan maestro de pruebas funcionales, integracion, seguridad y concurrencia

Fecha base: 2026-05-29
Baseline de codigo: `e821c3d fix: stabilize docker backend baseline`
Rama sugerida: `codex/docker-green-baseline`
Stack objetivo: Docker Compose profile `all`, sin PWA.
Gateway principal: `http://localhost:8000`

Este documento esta escrito contra el estado real del codigo. No asume endpoints que no existan.

## Objetivo

Encontrar el limite operativo del sistema NachoPps hasta degradacion o caida controlada, midiendo:

- Correctitud funcional de punta a punta.
- Integracion HTTP entre servicios.
- Integracion asincrona via RabbitMQ/outbox.
- Seguridad de autenticacion, autorizacion, validacion y rate limiting.
- Concurrencia sobre recursos compartidos: mesas, cuentas, stock, reservas y pagos.
- Umbrales de saturacion: latencia, errores, colas, CPU, memoria, conexiones y recuperacion.

La meta no es solo "que pase", sino saber donde empieza a doblarse.

## Alcance real del sistema

### Servicios Docker

| Servicio | Puerto host | Ruta Kong | DB | Health directo |
|---|---:|---|---|---|
| identidad | 3001 | `/identidad` | `identidad_db` | `GET /api` |
| mesas | 3002 | `/mesas` | `mesas_db` | `GET /api` |
| pedidos | 3004 | `/pedidos` | `pedidos_db` | `GET /api` |
| cuentas | 3005 | `/cuentas` | `cuentas_db` | `GET /api` |
| reservas | 3006 | `/reservas` | `reservas_db` | `GET /api` |
| inventario | 3007 | `/inventario` | `inventario_db` | `GET /api` |
| notificaciones | 3008 | `/notificaciones` | `notificaciones_db` | `GET /api` |
| caja | 3009 | `/caja` | `caja_db` | `GET /api/health` |
| reportes | 3010 | `/reportes` | `reportes_db` | `GET /api` |
| Kong | 8000/8001 | gateway/admin | n/a | `kong health` |
| RabbitMQ | 5672/15672 | n/a | n/a | `rabbitmq-diagnostics check_running` |

### Rutas HTTP cubiertas

Todas las rutas bajo Kong requieren JWT salvo login publico.

#### Identidad

- `GET /identidad`
- `POST /identidad/auth/login`
- `POST /identidad/auth/validate`
- `GET /identidad/auth/me`
- `POST /identidad/usuarios`
- `GET /identidad/usuarios`
- `PATCH /identidad/usuarios/:id/rol`

#### Mesas

- `GET /mesas`
- `GET /mesas/:id`
- `POST /mesas`
- `PATCH /mesas/:id/estado`

#### Pedidos

- `POST /pedidos`
- `GET /pedidos`
- `GET /pedidos?mesaId=:mesaId`
- `PATCH /pedidos/:id/estado`
- `PATCH /pedidos/items/:itemId/estado`

#### Cuentas

- `GET /cuentas`
- `POST /cuentas`
- `GET /cuentas/mesa/:mesaId`
- `GET /cuentas/:id`
- `POST /cuentas/:id/dividir`
- `POST /cuentas/:id/cerrar`

#### Caja

- `GET /caja/health`
- `GET /caja`
- `POST /caja/pagos`

#### Inventario

- `GET /inventario`
- `GET /inventario/categorias`
- `POST /inventario/categorias`
- `GET /inventario/productos`
- `GET /inventario/productos?categoriaId=:categoriaId`
- `GET /inventario/productos/:id`
- `POST /inventario/productos/lote`
- `POST /inventario/productos`
- `PATCH /inventario/productos/:id/stock`

#### Reservas

- `GET /reservas`
- `GET /reservas/disponibilidad?fecha=YYYY-MM-DD&hora=HH:mm`
- `POST /reservas`
- `PATCH /reservas/:id/confirmar`
- `DELETE /reservas/:id`

#### Reportes

- `GET /reportes`
- `GET /reportes/resumen`

#### Notificaciones

- `GET /notificaciones`
- WebSocket gateway interno de notificaciones, validar por logs/eventos salvo que se agregue cliente WS dedicado.

### Eventos RabbitMQ relevantes

| Routing key | Productor esperado | Consumidores esperados |
|---|---|---|
| `usuario.autenticado` | identidad | outbox/logs |
| `mesa.creada` | mesas | pedidos |
| `mesa.actualizada` | mesas | pedidos |
| `pedido.creado` | pedidos | cuentas, inventario, notificaciones |
| `pedido.actualizado` | pedidos | cuentas, notificaciones |
| `pedido.listo` | pedidos | notificaciones |
| `cuenta.abierta` | cuentas | mesas, caja |
| `cuenta.cerrada` | cuentas | mesas, caja, reportes |
| `ticket.generado` | cuentas | outbox/logs |
| `pago.registrado` | caja | cuentas, pedidos |
| `producto.creado` | inventario | pedidos |
| `producto.actualizado` | inventario | pedidos |
| `reserva.creada` | reservas | notificaciones |
| `reserva.cancelada` | reservas | notificaciones |

## Reglas de ejecucion

1. No usar `scripts/reconstruir-y-probar.ps1` durante estas pruebas salvo decision explicita. Es destructivo.
2. No bajar contenedores entre fases funcionales. Solo reiniciar si una fase busca recuperacion.
3. Toda prueba de carga debe registrar estado antes, durante y despues.
4. Toda prueba destructiva de limites debe tener criterio de corte.
5. Para repetir con datos limpios, tomar snapshot manual del estado o recrear volumenes con una ventana separada.
6. PWA queda fuera de alcance.

## Preparacion

### Preflight obligatorio

```powershell
git status --short
git log -1 --oneline
docker compose -f infra\docker-compose.yml --profile all ps
docker compose -f infra\docker-compose.yml --profile all config --quiet
```

Criterio de exito:

- Rama esperada o commit esperado visible.
- Ningun contenedor requerido esta `Exited`, `Restarting` o `unhealthy`.
- `config --quiet` sale con codigo 0.

### Levantar stack si no esta arriba

```powershell
docker compose -f infra\docker-compose.yml --profile all up -d --wait --wait-timeout 240
```

### Seed minimo

```powershell
$env:DATABASE_URL='postgresql://nachopps:secret@localhost:5439/identidad_db?schema=public'
Push-Location apps\servicio-identidad
node ..\..\scripts\seed-admin.js
Pop-Location
```

Credenciales base:

- Email: `admin@nachopps.pe`
- Password: `nachopps123`

### Poblar datos funcionales

```powershell
npm run poblar
```

Validar que existan:

- Al menos 12 mesas.
- Categorias de inventario.
- Productos con stock y productos sin stock controlado.
- Usuario admin.

### Variables de sesion sugeridas

```powershell
$BASE='http://localhost:8000'
$loginBody = @{ email='admin@nachopps.pe'; password='nachopps123' } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$BASE/identidad/auth/login" -ContentType 'application/json' -Body $loginBody
$TOKEN = $login.access_token
$AUTH = @{ Authorization = "Bearer $TOKEN" }
```

## Evidencia a capturar

### Estado Docker

```powershell
docker compose -f infra\docker-compose.yml --profile all ps
docker stats --no-stream
```

### Logs de servicios criticos

```powershell
docker logs --tail 200 nachopps-servicio-identidad
docker logs --tail 200 nachopps-servicio-pedidos
docker logs --tail 200 nachopps-servicio-cuentas
docker logs --tail 200 nachopps-servicio-inventario
docker logs --tail 200 nachopps-servicio-caja
docker logs --tail 200 nachopps-kong
docker logs --tail 200 nachopps-rabbitmq
```

### Colas RabbitMQ

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker exec nachopps-rabbitmq rabbitmqctl list_exchanges name type durable
docker exec nachopps-rabbitmq rabbitmqctl list_bindings source_name destination_name routing_key
```

### Kong

```powershell
Invoke-RestMethod http://localhost:8001/status
```

### DB checks base

Ejecutar segun servicio si una fase falla:

```powershell
docker exec nachopps-db-cuentas psql -U nachopps -d cuentas_db -c 'select estado, count(*) from "Cuenta" group by estado;'
docker exec nachopps-db-cuentas psql -U nachopps -d cuentas_db -c 'select status, count(*) from outbox_events group by status;'
docker exec nachopps-db-inventario psql -U nachopps -d inventario_db -c 'select status, count(*) from outbox_events group by status;'
docker exec nachopps-db-identidad psql -U nachopps -d identidad_db -c 'select status, count(*) from outbox_events group by status;'
```

## Criterios de salud y caida

### Salud

El sistema esta sano si:

- Login por Kong responde 200.
- Rutas protegidas sin token responden 401.
- Rutas protegidas con token responden 2xx.
- RabbitMQ no acumula colas de forma permanente.
- Outbox no queda creciendo indefinidamente en `PENDING`.
- No hay contenedores en `Restarting`.
- `docker stats` no muestra memoria creciendo sin estabilizarse.

### Degradacion suave

Marcar degradacion suave si aparece cualquiera:

- p95 de latencia mayor a 2 segundos durante 3 mediciones consecutivas.
- 1 a 2 por ciento de errores HTTP 5xx.
- Cola RabbitMQ con `messages_ready` creciendo pero drenando despues de la carga.
- Outbox `PENDING` sube durante carga pero baja al terminar.
- CPU sostenida sobre 85 por ciento en uno o mas servicios.

### Degradacion fuerte

Marcar degradacion fuerte si aparece cualquiera:

- p95 mayor a 5 segundos.
- 5xx entre 2 y 10 por ciento.
- Timeouts de cliente.
- `messages_ready` o `messages_unacknowledged` no baja 2 minutos despues del fin de carga.
- Postgres rechaza conexiones.
- Kong devuelve 502/503/504.

### Caida

Marcar caida si aparece cualquiera:

- Contenedor de servicio sale o entra en restart loop.
- RabbitMQ unhealthy.
- Postgres unhealthy.
- Login ya no responde.
- Mas de 10 por ciento de requests fallan en una ventana de 60 segundos.
- Recuperacion tarda mas de 5 minutos despues de detener carga.

### Corte de seguridad

Detener carga si:

- Docker Desktop consume memoria hasta afectar la maquina.
- Se observan escrituras infinitas de logs.
- Un contenedor reinicia mas de 3 veces en 2 minutos.
- Las DB dejan de responder a `pg_isready`.

## Fase 0: smoke baseline

### F0.1 Estado general

Comando:

```powershell
docker compose -f infra\docker-compose.yml --profile all ps
```

Esperado:

- DBs: healthy.
- RabbitMQ: healthy.
- Kong: healthy.
- Identidad: healthy.
- Reportes: healthy.
- Servicios sin healthcheck: `Up`.

### F0.2 Login por gateway

```powershell
$body = @{ email='admin@nachopps.pe'; password='nachopps123' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:8000/identidad/auth/login -ContentType 'application/json' -Body $body
```

Esperado:

- HTTP 200.
- `access_token` presente.
- `usuario.rol = ADMIN`.
- Cookie `access_token` presente si se inspeccionan headers.

### F0.3 Ruta protegida sin token

```powershell
try { Invoke-WebRequest http://localhost:8000/mesas } catch { [int]$_.Exception.Response.StatusCode }
```

Esperado: `401`.

### F0.4 Ruta protegida con token

```powershell
Invoke-RestMethod -Uri http://localhost:8000/mesas -Headers $AUTH
```

Esperado:

- HTTP 200.
- Array o envoltorio con mesas.

## Fase 1: pruebas funcionales completas

Tambien existe el script:

```powershell
npm run probar
```

Ese script ya cubre varios flujos. Esta fase define la matriz granular que debe existir como objetivo final, aunque se ejecute manualmente o se automatice.

### F1 Identidad y usuarios

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F1.1 | Login valido | `POST /identidad/auth/login` con admin | 200, token, usuario ADMIN |
| F1.2 | Login password invalido | Password incorrecta | 401 |
| F1.3 | Login email invalido | Email `no-es-email` | 400 por validation pipe |
| F1.4 | Login con campo extra | Agregar `campoExtra` | 400 si `forbidNonWhitelisted` esta activo |
| F1.5 | Validar token valido | `POST /identidad/auth/validate` | Payload valido |
| F1.6 | Validar token manipulado | Alterar firma | 401 o invalid=false segun implementacion |
| F1.7 | Perfil propio | `GET /identidad/auth/me` | Datos del usuario autenticado |
| F1.8 | Crear usuario ADMIN | `POST /identidad/usuarios` | 201/200, usuario creado |
| F1.9 | Crear usuario duplicado | Repetir email | 400/409 |
| F1.10 | Crear usuario password corto | Password menor a 8 | 400 |
| F1.11 | Listar usuarios como ADMIN | `GET /identidad/usuarios` | Lista incluye admin |
| F1.12 | Cambiar rol | `PATCH /identidad/usuarios/:id/rol` | Rol actualizado |
| F1.13 | Usuario no admin gestiona usuarios | Token MESERO/CAJERO | 403 |

Payloads:

```json
{
  "nombre": "Mesero Test",
  "email": "mesero.test@nachopps.pe",
  "password": "nachopps123",
  "rol": "MESERO"
}
```

```json
{
  "rol": "CAJERO"
}
```

### F2 Mesas

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F2.1 | Listar mesas | `GET /mesas` | 200, al menos 12 |
| F2.2 | Obtener mesa existente | `GET /mesas/:id` | 200 |
| F2.3 | Obtener UUID inexistente | UUID valido sin registro | 404 |
| F2.4 | Obtener ID invalido | `GET /mesas/nope` | 400 por `ParseUUIDPipe` |
| F2.5 | Crear mesa | `POST /mesas` | 201/200 y evento `mesa.creada` |
| F2.6 | Crear mesa numero duplicado | Repetir `numero` | 400/409/500 segun DB; documentar |
| F2.7 | Cambiar a OCUPADA | `PATCH /estado` | Estado `OCUPADA` |
| F2.8 | Cambiar a LIBRE | `PATCH /estado` | Estado `LIBRE`, `cuentaAsociada` nula |
| F2.9 | Estado invalido | `estado=ROTA` | 400 |
| F2.10 | Propagacion a pedidos | Crear mesa y luego crear pedido sobre ella | pedidos reconoce mesa sincronizada |

Payload:

```json
{
  "numero": 901,
  "capacidad": 4,
  "ubicacion": "QA"
}
```

### F3 Inventario

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F3.1 | Health simple | `GET /inventario` | 200 |
| F3.2 | Listar categorias | `GET /inventario/categorias` | 200 |
| F3.3 | Crear categoria | `POST /inventario/categorias` | Categoria creada |
| F3.4 | Listar productos | `GET /inventario/productos` | Productos con precio numerico |
| F3.5 | Filtrar por categoria | `GET /productos?categoriaId=...` | Solo esa categoria |
| F3.6 | Obtener producto | `GET /productos/:id` | Producto con `precio` number |
| F3.7 | Obtener lote | `POST /productos/lote` | Solo ids solicitados |
| F3.8 | Crear producto stock controlado | `stockActual=100` | Producto creado y evento outbox |
| F3.9 | Crear producto sin stock | Omitir stock | `stockActual=null` o equivalente |
| F3.10 | Categoria inexistente | Crear producto con categoria fake | 404 |
| F3.11 | Actualizar stock positivo | `stock=10` | stock aumenta |
| F3.12 | Actualizar stock negativo | `stock=-5` | stock baja sin ser menor que 0 |
| F3.13 | Stock a cero | Bajar hasta 0 | producto queda no disponible si logica aplica |
| F3.14 | Precio decimal | `precio=12.35` | Persistencia sin drift decimal |

Payloads:

```json
{
  "nombre": "Categoria QA",
  "descripcion": "Carga funcional"
}
```

```json
{
  "categoriaId": "<categoriaId>",
  "nombre": "Producto QA",
  "descripcion": "Producto de prueba",
  "precio": 12.35,
  "disponible": true,
  "stockActual": 100
}
```

### F4 Pedidos

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F4.1 | Crear pedido minimo | Mesa valida + 1 item | Pedido `PENDIENTE` |
| F4.2 | Crear pedido multi item | Cocina + bar | Total correcto |
| F4.3 | Pedido sin items | `items=[]` | 400 |
| F4.4 | Pedido con cantidad 0 | `cantidad=0` | 400 |
| F4.5 | Producto inexistente | UUID inexistente | 404 |
| F4.6 | Stock insuficiente | Cantidad mayor a stock | 400 |
| F4.7 | Mesa inexistente | UUID no sincronizado | 404 |
| F4.8 | Estado pedido `EN_PREPARACION` | `PATCH /:id/estado` | Estado actualizado |
| F4.9 | Estado pedido `LISTO` | `PATCH /:id/estado` | Evento `pedido.listo` |
| F4.10 | Estado pedido `ENTREGADO` | `PATCH /:id/estado` | Pedido entregado |
| F4.11 | Estado item | `PATCH /items/:itemId/estado` | Solo item cambia |
| F4.12 | Listar por mesa | `GET /pedidos?mesaId=...` | Solo pedidos de esa mesa |
| F4.13 | Modificadores | Item con extras | Total suma extras si codigo lo soporta; documentar si no |
| F4.14 | Comensal | `identificadorComensal` | Persistencia para dividir por items |

Payload:

```json
{
  "mesaId": "<mesaId>",
  "items": [
    {
      "productoId": "<productoId>",
      "cantidad": 2,
      "area": "COCINA",
      "notas": "Sin cebolla",
      "identificadorComensal": 1
    }
  ]
}
```

### F5 Cuentas

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F5.1 | Abrir manualmente | `POST /cuentas` con mesa libre | Cuenta `ABIERTA` |
| F5.2 | Abrir duplicada | Repetir misma mesa | 400 `mesa ya tiene cuenta abierta` |
| F5.3 | Autoapertura por pedido | Crear pedido sin cuenta | Cuenta se crea via evento `pedido.creado` |
| F5.4 | Mesa ocupada por cuenta | Despues de cuenta abierta | Mesa `OCUPADA`, `cuentaAsociada` |
| F5.5 | Dos pedidos misma mesa | Crear dos pedidos | Una sola cuenta, total recomputado |
| F5.6 | Actualizar pedido | Cambiar estado/item | Snapshot en cuenta se actualiza |
| F5.7 | Dividir iguales | `POST /:id/dividir` | Partes con monto igual |
| F5.8 | Dividir por items | Items con comensal | Suma por comensal |
| F5.9 | Cerrar sin pedidos | Cuenta vacia | 400 |
| F5.10 | Cerrar con descuento | `descuento` valido | Total final correcto |
| F5.11 | Cerrar cuenta | `POST /:id/cerrar` | Cuenta `CERRADA`, eventos `cuenta.cerrada` y `ticket.generado` |
| F5.12 | Cerrar cuenta cerrada | Repetir cierre | 400 |

Payloads:

```json
{
  "mesaId": "<mesaId>"
}
```

```json
{
  "metodo": "IGUALES",
  "numPartes": 3
}
```

```json
{
  "descuento": 5
}
```

### F6 Caja y pagos

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F6.1 | Health caja | `GET /caja/health` | 200 |
| F6.2 | Pago efectivo | Cuenta abierta con total | Transaccion creada |
| F6.3 | Pago tarjeta | Metodo `TARJETA` | Transaccion creada |
| F6.4 | Pago Yape | Metodo `YAPE` | Transaccion creada |
| F6.5 | Pago transferencia | Metodo `TRANSFERENCIA` | Transaccion creada |
| F6.6 | Pago Plin | Metodo `PLIN` | Transaccion creada |
| F6.7 | Monto insuficiente | `montoRecibido < total` | 400 |
| F6.8 | Cuenta inexistente | UUID fake | 404 |
| F6.9 | Cuenta ya cerrada | Repetir pago | 400 |
| F6.10 | Evento pago registrado | Despues del pago | cuenta cierra, pedidos pasan a `PAGADO` si aplica |
| F6.11 | Caja lista transacciones | `GET /caja` | Incluye transaccion |
| F6.12 | Reportes recibe venta | `GET /reportes/resumen` | Venta aparece luego de evento |

Payload:

```json
{
  "cuentaId": "<cuentaId>",
  "montoRecibido": 100,
  "metodo": "EFECTIVO"
}
```

### F7 Reservas

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F7.1 | Listar reservas | `GET /reservas` | 200 |
| F7.2 | Consultar disponibilidad libre | Fecha/hora nueva | `disponible=true` |
| F7.3 | Crear reserva minima | nombre, fecha, hora | Reserva `PENDIENTE` |
| F7.4 | Crear reserva alias frontend | `nombreCliente`, `personas` | Se transforma a `clienteNombre`, `numComensales` |
| F7.5 | Slot ocupado | Misma fecha/hora | 409 |
| F7.6 | Confirmar pendiente | `PATCH /:id/confirmar` | `CONFIRMADA` |
| F7.7 | Confirmar no pendiente | Confirmar de nuevo | 409 |
| F7.8 | Cancelar | `DELETE /:id` | `CANCELADA`, evento outbox |
| F7.9 | Cancelar inexistente | UUID fake | 404 |
| F7.10 | Evento notificacion | Crear/cancelar | logs en notificaciones |

Payload:

```json
{
  "clienteNombre": "Cliente QA",
  "clienteTelefono": "999999999",
  "fecha": "2026-06-15",
  "hora": "20:00",
  "mesaPreferida": "Terraza",
  "numComensales": 4
}
```

### F8 Reportes

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F8.1 | Health reportes | `GET /reportes` | 200 |
| F8.2 | Resumen vacio/no vacio | `GET /reportes/resumen` | 200 con estructura estable |
| F8.3 | Venta post pago | Completar flujo pago | Resumen aumenta |
| F8.4 | Multiples pagos | 5 pagos | Conteo/monto acumulado correcto |
| F8.5 | Idempotencia evento | Reentrega manual si se implementa | No duplica ventas |

### F9 Notificaciones

| ID | Caso | Pasos | Esperado |
|---|---|---|---|
| F9.1 | Health notificaciones | `GET /notificaciones` | 200 |
| F9.2 | Pedido creado | Crear pedido | Log `pedido.creado` recibido |
| F9.3 | Pedido actualizado | Cambiar estado | Log `pedido.actualizado` recibido |
| F9.4 | Pedido listo | Estado `LISTO` | Log/evento listo |
| F9.5 | Reserva creada | Crear reserva | Log `reserva.creada` |
| F9.6 | Reserva cancelada | Cancelar reserva | Log `reserva.cancelada` |
| F9.7 | Cliente WebSocket | Conectar cliente WS | Recibe broadcast |

## Fase 2: flujos integrados punta a punta

### I1 Pedido a pago basico

Secuencia:

1. Login admin.
2. Obtener mesa libre.
3. Obtener producto con stock suficiente.
4. Crear pedido.
5. Esperar cuenta por mesa.
6. Verificar mesa ocupada.
7. Marcar pedido entregado.
8. Dividir cuenta por iguales.
9. Pagar cuenta.
10. Esperar cuenta cerrada.
11. Esperar mesa libre.
12. Verificar transaccion en caja.
13. Verificar resumen en reportes.
14. Verificar colas/outbox drenadas.

Invariantes:

- Una sola cuenta abierta por mesa.
- Total cuenta = suma de pedidos.
- Stock baja exactamente por cantidad pedida.
- Pago no puede registrar menos que total.
- Mesa vuelve a `LIBRE`.

### I2 Dos pedidos a la misma mesa

Secuencia:

1. Crear pedido A.
2. Crear pedido B inmediatamente despues.
3. Consultar cuenta.
4. Verificar que no se crearon dos cuentas abiertas.
5. Verificar total = A + B.
6. Actualizar pedido A.
7. Verificar total recalculado.
8. Pagar.

Riesgo que busca:

- Doble apertura de cuenta por carreras de eventos.
- Drift de totales con `increment` vs recompute decimal.

### I3 Tres mesas simultaneas

Secuencia:

1. Seleccionar mesas 4, 5, 6.
2. Crear pedidos en paralelo.
3. Esperar tres cuentas.
4. Pagar tres cuentas.
5. Confirmar tres mesas libres.

Riesgo que busca:

- Bloqueos cruzados.
- Eventos perdidos.
- Outbox acumulado.

### I4 Stock compartido por muchos pedidos

Secuencia:

1. Crear producto con stock 20.
2. Crear 20 pedidos simultaneos de cantidad 1 sobre mesas distintas.
3. Esperar inventario.
4. Verificar stock final 0.
5. Crear pedido 21.
6. Esperar rechazo por stock insuficiente o no decremento.

Riesgo que busca:

- Overselling.
- Doble decremento por reentrega.
- Race condition en `decrement`.

### I5 Reservas bajo conflicto

Secuencia:

1. Elegir fecha/hora futura.
2. Lanzar 20 creaciones simultaneas para mismo slot.
3. Contar exitosas y fallidas.
4. Consultar reservas.

Esperado ideal:

- Exactamente 1 exitosa y 19 rechazadas con 409.

Si hay mas de 1 exitosa:

- Hay condicion de carrera: `assertSlotDisponible` no esta protegido por constraint unico o transaccion serializable.

### I6 Pago duplicado concurrente

Secuencia:

1. Crear cuenta abierta con total.
2. Lanzar 10 `POST /caja/pagos` simultaneos sobre la misma cuenta.
3. Consultar transacciones por `cuentaId`.
4. Consultar estado de cuenta.

Esperado ideal:

- Exactamente 1 pago exitoso.
- 9 rechazos por cuenta cerrada o conflicto.
- Una sola transaccion.

Si hay mas de 1 transaccion:

- Hay race condition de pago duplicado.

### I7 Reentrega de eventos

Requiere publicacion manual RabbitMQ o helper dedicado.

Casos:

- Reemitir `pedido.creado` con mismo `pedido.id`.
- Reemitir `producto.actualizado`.
- Reemitir `pago.registrado`.
- Reemitir `cuenta.cerrada`.

Esperado:

- Inventario no descuenta dos veces el mismo pedido.
- Cuentas no duplica pedido en snapshot.
- Reportes no duplica venta, si existe idempotencia; si no existe, documentar como limite.

## Fase 3: seguridad

### S1 Autenticacion obligatoria

Probar sin token:

| Ruta | Esperado |
|---|---|
| `GET /mesas` | 401 |
| `GET /pedidos` | 401 |
| `GET /cuentas` | 401 |
| `GET /reservas` | 401 |
| `GET /inventario/productos` | 401 |
| `GET /caja` | 401 |
| `GET /reportes/resumen` | 401 |
| `GET /notificaciones` | 401 |
| `GET /identidad/auth/me` | 401 |

### S2 Tokens invalidos

| ID | Token | Esperado |
|---|---|---|
| S2.1 | Sin header | 401 |
| S2.2 | `Bearer basura` | 401 |
| S2.3 | Token con firma alterada | 401 |
| S2.4 | Token con `alg=none` | 401 |
| S2.5 | Token expirado | 401 |
| S2.6 | Token con `iss` incorrecto | 401 por Kong |
| S2.7 | Token valido por cookie | 200 |
| S2.8 | Token valido por header | 200 |

### S3 Roles

| Caso | Token | Ruta | Esperado |
|---|---|---|---|
| Admin crea usuario | ADMIN | `POST /identidad/usuarios` | 2xx |
| Mesero crea usuario | MESERO | `POST /identidad/usuarios` | 403 |
| Cajero lista usuarios | CAJERO | `GET /identidad/usuarios` | 403 |
| Gerencia cambia rol | GERENCIA | `PATCH /identidad/usuarios/:id/rol` | 403 salvo regla distinta |

### S4 Validacion de payloads

Probar en todos los servicios:

- Campos extra.
- Campos requeridos ausentes.
- Tipos incorrectos.
- Strings vacios.
- Numeros negativos.
- UUID invalido.
- Arrays vacios.
- Enums invalidos.
- Payload muy grande.

Esperado:

- 400 para validacion.
- 404 para recurso inexistente valido.
- No 500 por input del cliente.

### S5 Rate limiting de login

Kong tiene rate limit especifico para `/identidad/auth` de 5 intentos/min por IP.

Prueba:

```powershell
1..10 | ForEach-Object {
  try {
    Invoke-WebRequest -Method Post -Uri http://localhost:8000/identidad/auth/login `
      -ContentType 'application/json' `
      -Body '{"email":"admin@nachopps.pe","password":"bad"}'
  } catch {
    [int]$_.Exception.Response.StatusCode
  }
}
```

Esperado:

- Primeros intentos: 401.
- Luego: 429.

### S6 CORS y cookies

Validar:

- `Origin: http://localhost:4200` permitido.
- `Origin: http://localhost:5173` permitido.
- Origen no listado no debe recibir CORS permisivo.
- Login setea cookie `access_token`.
- Cookie tiene `HttpOnly`, `SameSite=Lax`, `Path=/`.
- En produccion debe ser `Secure=true`.

### S7 Bypass del gateway

Probar servicios directos:

```powershell
Invoke-WebRequest http://localhost:3002/api/mesas
Invoke-WebRequest http://localhost:3005/api/cuentas
Invoke-WebRequest http://localhost:3007/api/productos
```

Esperado:

- Sin token: 401 si el servicio tiene guard global.
- Con token: 200.

Si alguna ruta directa sensible queda abierta:

- Documentar como exposicion por puertos host.
- Recomendacion futura: no publicar puertos internos en entornos no-dev.

### S8 Resiliencia a errores

Casos:

- Apagar inventario y crear pedido.
- Apagar cuentas y pagar.
- Apagar RabbitMQ y crear pedido.
- Apagar reportes y pagar.

Esperado:

- Errores 503/5xx controlados.
- Sin excepciones con stack trace sensible en respuesta.
- Al recuperar RabbitMQ, outbox drena eventos pendientes.

## Fase 4: concurrencia controlada

### Herramienta existente

```powershell
$env:CONCURRENCY='20'
$env:ROUNDS='50'
node stress-tests\run-all-stress-tests.js
```

Advertencia: el script actual contiene algunos payloads de ejemplo con productos fake (`test-product`, `stress-product`, `prod-1`). Para pruebas definitivas de flujo completo, ajustar a productos reales obtenidos de `/inventario/productos`.

### C1 Lecturas puras

Objetivo: medir techo de lectura sin mutaciones.

Endpoints:

- `GET /mesas`
- `GET /pedidos`
- `GET /cuentas`
- `GET /inventario/productos`
- `GET /reservas`
- `GET /caja`
- `GET /reportes/resumen`

Rampa:

| Nivel | Concurrencia | Requests por endpoint | Duracion objetivo |
|---|---:|---:|---:|
| C1.1 | 1 | 100 | corta |
| C1.2 | 5 | 500 | corta |
| C1.3 | 10 | 1000 | corta |
| C1.4 | 25 | 2500 | media |
| C1.5 | 50 | 5000 | media |
| C1.6 | 100 | 10000 | hasta degradacion |
| C1.7 | 200 | 20000 | hasta degradacion fuerte |

Medir:

- RPS.
- p50/p95/p99.
- 5xx.
- Kong 502/503/504.
- CPU/memoria.

### C2 Login burst

Objetivo: medir bcrypt nativo y rate limiting.

Rutas:

- `POST /identidad/auth/login`
- `POST /identidad/auth/validate`

Escenarios:

- Login valido repetido.
- Login invalido para activar 429.
- Token validation con token valido.
- Token validation con token manipulado.

Rampa:

| Nivel | Concurrencia | Rounds | Esperado |
|---|---:|---:|---|
| C2.1 | 1 | 20 | 200 |
| C2.2 | 5 | 50 | 200/429 segun ruta |
| C2.3 | 10 | 100 | latencia bcrypt observable |
| C2.4 | 25 | 250 | posible CPU alta en identidad |
| C2.5 | 50 | 500 | buscar p95 > 5s o 5xx |

Limite esperado:

- Identidad sera uno de los primeros cuellos por bcrypt.
- Si rate limit aplica, la prueba de passwords invalidos debe saturar con 429, no con caida.

### C3 Misma mesa, muchos pedidos

Objetivo: probar advisory lock y una sola cuenta abierta.

Setup:

1. Mesa libre.
2. Producto con stock alto o sin stock controlado.

Carga:

- 10, 25, 50, 100 pedidos simultaneos sobre la misma mesa.

Esperado:

- N pedidos creados.
- 1 cuenta abierta.
- Cuenta tiene N pedidos en snapshot.
- Total = suma exacta.
- Sin duplicados por `pedido.id`.
- Outbox drena.

Falla critica:

- Mas de una cuenta abierta para la misma mesa.
- Total menor o mayor a la suma.
- Mesa no queda ocupada.

### C4 Mesas distintas, pedidos simultaneos

Objetivo: throughput real de operacion restaurante.

Setup:

- 20 mesas disponibles.
- 3 productos reales.

Carga:

- Cada worker elige mesa distinta.
- Crea pedido.
- Espera cuenta.
- Marca entregado.
- Paga.

Rampa:

| Nivel | Mesas simultaneas | Ciclos completos |
|---|---:|---:|
| C4.1 | 5 | 5 |
| C4.2 | 10 | 10 |
| C4.3 | 20 | 20 |
| C4.4 | 40 | 40, creando mesas QA adicionales |
| C4.5 | 80 | 80, creando mesas QA adicionales |

Esperado:

- Todos los ciclos terminan.
- Cuentas cerradas.
- Mesas libres.
- Transacciones exactas.
- Reportes acumula ventas.

### C5 Pago duplicado

Objetivo: buscar doble cobro.

Setup:

- Una cuenta abierta con total 100.

Carga:

- 2, 5, 10, 25 pagos simultaneos contra misma cuenta.

Esperado ideal:

- 1 transaccion.
- 1 evento `pago.registrado`.
- Cuenta cerrada.
- Demas requests 400/409.

Falla critica:

- Mas de una transaccion para misma cuenta.
- Reportes duplica venta.

### C6 Stock compartido

Objetivo: encontrar overselling.

Setup:

- Producto QA con `stockActual=50`.

Cargas:

- 50 pedidos simultaneos de cantidad 1.
- 60 pedidos simultaneos de cantidad 1.
- 10 pedidos simultaneos de cantidad 10.

Esperado:

- Stock nunca negativo.
- Exitos no exceden stock.
- Pedidos rechazados si no hay stock suficiente.
- Reentrega de evento no descuenta dos veces.

### C7 Reservas mismo slot

Objetivo: detectar carrera en disponibilidad.

Setup:

- Fecha futura unica.
- Hora unica.

Cargas:

- 2 simultaneas.
- 5 simultaneas.
- 10 simultaneas.
- 50 simultaneas.

Esperado ideal:

- 1 reserva por fecha/hora.
- Resto 409.

Falla probable a investigar:

- Como disponibilidad se consulta antes de crear, si no existe constraint unico o lock transaccional, pueden pasar dos reservas en carrera.

### C8 Outbox y RabbitMQ bajo presion

Objetivo: medir si eventos quedan pendientes.

Carga:

- Crear 100 pedidos.
- Crear 100 reservas.
- Crear 100 productos.
- Crear 100 pagos.

Medir antes/durante/despues:

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
docker exec nachopps-db-pedidos psql -U nachopps -d pedidos_db -c 'select status, count(*) from outbox_events group by status;'
docker exec nachopps-db-cuentas psql -U nachopps -d cuentas_db -c 'select status, count(*) from outbox_events group by status;'
docker exec nachopps-db-caja psql -U nachopps -d caja_db -c 'select status, count(*) from outbox_events group by status;'
```

Esperado:

- `PENDING` sube durante carga.
- `PROCESSED` sube al drenar.
- `FAILED` no crece salvo falla inducida.

## Fase 5: pruebas de limite hasta caida

Estas pruebas son intencionalmente agresivas. Ejecutarlas una por una.

### Metodo de rampa

Para cada escenario:

1. Capturar baseline.
2. Ejecutar nivel de carga.
3. Esperar 60 segundos.
4. Capturar metricas.
5. Si sano, duplicar concurrencia.
6. Si degradado suave, repetir mismo nivel.
7. Si degradado fuerte, subir solo 25 por ciento.
8. Si cae, detener y medir recuperacion.

### L1 Lecturas gateway

Objetivo: saber cuanto aguanta Kong + servicios con GET.

Rampa:

| Nivel | Concurrencia | Requests totales |
|---|---:|---:|
| L1.1 | 50 | 5000 |
| L1.2 | 100 | 10000 |
| L1.3 | 200 | 20000 |
| L1.4 | 400 | 40000 |
| L1.5 | 800 | 80000 |

Caida esperada:

- Primero latencia.
- Luego 502/503/504 si upstream satura.
- Posible saturacion de CPU en Kong o Node.

### L2 Login/bcrypt

Objetivo: techo de CPU en identidad.

Rampa:

| Nivel | Concurrencia | Logins |
|---|---:|---:|
| L2.1 | 10 | 100 |
| L2.2 | 25 | 250 |
| L2.3 | 50 | 500 |
| L2.4 | 100 | 1000 |
| L2.5 | 200 | 2000 |

Medir:

- CPU de `nachopps-servicio-identidad`.
- p95 login.
- Timeouts.
- Si rate limit interfiere, probar directo contra `http://localhost:3001/api/auth/login` para aislar bcrypt, documentando que se esta saltando Kong.

### L3 Escritura completa restaurante

Objetivo: limite real de negocio.

Cada worker:

1. Crea mesa QA unica.
2. Crea pedido.
3. Espera cuenta.
4. Marca pedido entregado.
5. Paga.
6. Verifica mesa libre.

Rampa:

| Nivel | Workers simultaneos | Ciclos por worker |
|---|---:|---:|
| L3.1 | 5 | 5 |
| L3.2 | 10 | 10 |
| L3.3 | 25 | 10 |
| L3.4 | 50 | 10 |
| L3.5 | 100 | 10 |

Indicadores de caida:

- Cuentas abiertas colgadas.
- Mesas ocupadas sin cuenta.
- Pagos duplicados.
- Stock inconsistente.
- Outbox pendiente permanente.

### L4 RabbitMQ apagado durante carga

Objetivo: comprobar degradacion y recuperacion outbox.

Secuencia:

1. Iniciar carga de pedidos a 25 concurrentes.
2. Detener RabbitMQ:

```powershell
docker stop nachopps-rabbitmq
```

3. Mantener carga 60 segundos.
4. Reiniciar RabbitMQ:

```powershell
docker start nachopps-rabbitmq
```

5. Esperar 120 segundos.
6. Revisar outbox y colas.

Esperado:

- HTTP puede seguir aceptando operaciones que persisten outbox.
- Eventos quedan `PENDING`.
- Al volver RabbitMQ, outbox drena.
- Sin perdida de datos.

Caida/falla:

- Servicios crashean.
- Outbox no drena.
- Eventos se marcan `FAILED` masivamente.

### L5 DB de un servicio apagada

Objetivo: comportamiento ante dependencia critica.

Casos:

- Apagar `db-cuentas` y crear pedidos.
- Apagar `db-inventario` y crear pedidos.
- Apagar `db-caja` y pagar.

Esperado:

- Errores controlados.
- Servicios no caen en loop.
- Al volver DB, servicio recupera conexion.

Comandos:

```powershell
docker stop nachopps-db-cuentas
docker start nachopps-db-cuentas
```

### L6 Kong apagado

Objetivo: confirmar frontera de gateway.

Secuencia:

1. Ejecutar carga contra Kong.
2. Detener Kong.
3. Confirmar que gateway falla.
4. Probar servicio directo con token para aislar si servicios siguen vivos.
5. Reiniciar Kong.

Esperado:

- Gateway no disponible mientras Kong esta abajo.
- Servicios directos siguen arriba.
- Kong vuelve healthy.

## Fase 6: matriz de datos esperados

### Invariantes de DB

Despues de una corrida funcional completa:

| Servicio | Invariante |
|---|---|
| mesas | No hay mesa `OCUPADA` con `cuentaAsociada` cerrada |
| cuentas | No hay mas de una cuenta `ABIERTA` por `mesaId` |
| cuentas | `total` de cuenta cerrada coincide con ticket/transaccion |
| caja | Una cuenta cerrada por pago tiene una transaccion principal |
| inventario | `stockActual` nunca negativo |
| inventario | Reentrega de pedido no duplica decremento |
| reservas | No hay dos reservas activas mismo `fecha` + `hora` si esa es la regla |
| reportes | Ventas coinciden con cuentas cerradas pagadas |
| outbox | `PENDING` vuelve a 0 o a un numero estable despues de carga |

### Consultas de auditoria sugeridas

```powershell
docker exec nachopps-db-cuentas psql -U nachopps -d cuentas_db -c 'select "mesaId", count(*) from "Cuenta" where estado = ''ABIERTA'' group by "mesaId" having count(*) > 1;'
docker exec nachopps-db-inventario psql -U nachopps -d inventario_db -c 'select id, nombre, "stockActual" from "Producto" where "stockActual" < 0;'
docker exec nachopps-db-caja psql -U nachopps -d caja_db -c 'select "cuentaId", count(*) from "Transaccion" group by "cuentaId" having count(*) > 1;'
docker exec nachopps-db-reservas psql -U nachopps -d reservas_db -c 'select fecha, hora, count(*) from "Reserva" where estado <> ''CANCELADA'' group by fecha, hora having count(*) > 1;'
```

Si alguna consulta falla por nombre real de tabla/columna, ajustar contra el Prisma schema del servicio. La prueba sigue siendo valida como invariante.

## Registro de resultados

Para cada corrida guardar:

- Fecha/hora.
- Commit.
- Rama.
- Comando ejecutado.
- Concurrencia.
- Rounds.
- Duracion.
- Total requests.
- Exitos.
- Fallos por status code.
- p50/p95/p99/max.
- `docker stats`.
- RabbitMQ queues.
- Outbox por servicio.
- Contenedores reiniciados.
- Tiempo de recuperacion.
- Hallazgos funcionales.

Formato sugerido:

````md
## Corrida YYYY-MM-DD HH:mm

- Commit:
- Escenario:
- Concurrency:
- Rounds:
- Resultado:
- Primer sintoma:
- Punto de caida:
- Recuperacion:

| Metrica | Valor |
|---|---:|
| Requests | |
| 2xx | |
| 4xx esperados | |
| 5xx | |
| Timeouts | |
| p50 | |
| p95 | |
| p99 | |
| max | |

### Evidencia

```text
pegar salida relevante
```

### Decision

- Aceptado:
- Bloqueante:
- Requiere fix:
````

## Orden recomendado de ejecucion

1. Fase 0: smoke baseline.
2. `npm run probar`.
3. Fase 1 manual para huecos no cubiertos por el script.
4. Fase 2 punta a punta.
5. Fase 3 seguridad.
6. Fase 4 concurrencia controlada.
7. Fase 5 limite hasta caida.
8. Auditoria DB/RabbitMQ final.
9. Informe de limites.

## Gaps actuales detectados en los scripts existentes

El script `scripts/pruebas-integracion.ts` ya cubre una parte importante, pero faltan o deben reforzarse:

- Roles no admin contra rutas admin.
- Cookie JWT como mecanismo principal, no solo bearer.
- Rate limit de login por Kong.
- CORS.
- Direct ports bypass.
- Reservas concurrentes mismo slot.
- Pago duplicado concurrente.
- Reentrega manual de eventos RabbitMQ.
- Pruebas con RabbitMQ caido y recuperacion outbox.
- Pruebas con DB caida por servicio.
- WebSocket real de notificaciones.
- Medicion p95/p99 y RPS por fase.
- Auditoria SQL final de invariantes.

El script `stress-tests/run-all-stress-tests.js` existe, pero antes de usarlo como fuente de verdad hay que reemplazar payloads fake por productos/mesas reales descubiertos dinamicamente.

## Resultado esperado final

El informe final debe responder estas preguntas con numeros:

1. Cuantos logins concurrentes aguanta identidad antes de p95 > 5s.
2. Cuantos GET/s aguanta Kong antes de 5xx.
3. Cuantos ciclos pedido-cuenta-pago por minuto aguanta el sistema.
4. En que concurrencia aparece primera inconsistencia de negocio.
5. Si RabbitMQ cae, cuantos eventos se acumulan y cuanto tarda en drenar.
6. Si una DB cae, que servicios fallan y cuales se mantienen.
7. Cual es el primer componente que satura.
8. Cual es el punto exacto de caida.
9. Si el sistema se recupera solo.
10. Que fixes son obligatorios antes de considerar produccion.
