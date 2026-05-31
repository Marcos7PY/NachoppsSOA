# Documentación atómica desde cero — Nachopps Restobar

> **Para el agente de código (tiene el repo vivo).** Generar la documentación del sistema desde cero, con un esquema atómico y trazable a código, de modo que cada documento sea verificable y no envejezca en silencio.
>
> **Fuente de verdad: el código vivo.** **Toda afirmación factual lleva una cita a `archivo:línea`, migración o reporte de prueba. Sin cita verificable, no se escribe.** Si un dato es ambiguo, se resuelve leyendo el código, no asumiendo.

- Rama de trabajo sugerida: `docs/documentacion-atomica`
- Stack confirmado: monorepo **Nx**, microservicios **NestJS**, PWA **React/Vite**, **Prisma** (Database-per-Service), **RabbitMQ** (`NACHOPPS_EXCHANGE` topic + Transactional Outbox), **Kong** gateway, **Postgres**, **JWT/RBAC**, **OTel + Prometheus**.
- Salida: árbol nuevo bajo `docs/` (ver §3).

---

## 1. Principio rector: qué es un "átomo"

Un átomo es **el documento más pequeño que es verdadero o falso por sí solo** y que se puede leer, verificar y actualizar sin abrir ningún otro. Agrupar por servicio es demasiado grueso: un cambio en un endpoint obliga a releer todo el servicio. El esquema atómico descompone por unidad mínima y las cose con un índice y enlaces cruzados.

**Dos reglas que no se negocian:**

1. **Cita o no se escribe.** Cada hecho se regenera leyendo el archivo fuente y se respalda con `archivo:línea`, migración o reporte. Un átomo que no se puede citar está mal y no se publica. Esto es lo que evita que la doc quede rancia sin que nadie lo note.
2. **Presente, no historia.** Los átomos describen **el estado actual**. Prohibido escribir "nuevo", "ahora", "antes hacía X", "refactorizado a Y" — eso envejece. La historia de cambios vive **solo** en los ADR (§2, tipo F).

---

## 2. Taxonomía de átomos (siete tipos)

Cada tipo tiene su plantilla en §4. Todos llevan front-matter con `fuente`, `revisado` (fecha) y `commit` (hash corto contra el que se generó).

| Tipo | Átomo | Uno por... |
|---|---|---|
| A | **Endpoint** | cada ruta HTTP de cada controlador |
| B | **Evento** | cada `RoutingKey` real (publicador(es), consumidor(es), payload, idempotencia, fallo) |
| C | **Modelo de datos** | cada modelo Prisma / tabla |
| D | **Flujo / saga** | cada flujo de negocio que cruza servicios |
| E | **Librería** | cada lib del shared kernel |
| F | **ADR** | cada decisión de arquitectura |
| G | **Invariante** | cada invariante del sistema (enlaza a la prueba que la verifica) |

El tipo **G (invariante)** es el que conecta la doc con los stress tests: cada invariante apunta al endpoint/modelo/evento que la garantiza **y** al reporte de prueba que la confirma. Eso es lo que hace la doc auditable.

---

## 3. Árbol de salida

```
docs/
  README.md                       # índice maestro (§7)
  arquitectura.md                 # vista de 1 página: servicios, exchange, gateway, datos
  servicios/
    <servicio>/
      _indice.md                  # índice del servicio: enlaza sus átomos A y C
      endpoints/
        GET--raiz.md              # un átomo A por ruta (METHOD--ruta-slug.md)
        POST--pedidos.md
        ...
      datos/
        <Modelo>.md               # un átomo C por modelo Prisma
        ...
  eventos/
    _catalogo.md                  # tabla 1:1 con RoutingKeys; enlaza cada átomo B
    pedido.creado.md              # un átomo B por routing key
    ...
  flujos/
    <slug>.md                     # un átomo D por saga
  invariantes/
    <slug>.md                     # un átomo G por invariante
  decisiones/
    ADR-001-<slug>.md             # un átomo F por decisión
    ...
  libs/
    <lib>.md                      # un átomo E por librería
  operacion/
    levantar-sistema.md           # docker compose, orden de arranque, healthchecks
    base-de-datos.md              # acceso, migraciones, reset destructivo de volúmenes
    rabbitmq.md                   # colas, DLQ, parking, reinyección, monitoreo
```

Convención de nombres de endpoint: `METHOD--ruta-con-guiones.md` (p. ej. `PATCH--pedidos-id-estado.md`). Anclas estables dentro de cada átomo para enlazar a secciones.

---

## 4. Plantillas por tipo de átomo

### A — Endpoint

```markdown
---
tipo: endpoint
servicio: servicio-pedidos
metodo: POST
ruta: /pedidos
handler: apps/servicio-pedidos/src/app/app.controller.ts:NN
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:NN, apps/servicio-pedidos/src/app/app.service.ts:NN]
revisado: AAAA-MM-DD
commit: <hash>
---

# POST /pedidos

**Propósito.** (Una frase.)

**Autorización.** Guard(s) y roles exigidos (RBAC). Citar dónde se aplica.

**Entrada.** DTO/Command, campos, tipos, validaciones (class-validator si aplica).

**Salida.** Shape de respuesta + códigos posibles con su significado
(p. ej. 201 creado / 400 stock insuficiente / 404 mesa inexistente / 503 dependencia).

**Efectos.** Qué escribe en BD (qué modelos → enlazar átomos C) y qué eventos
emite vía Outbox (→ enlazar átomos B). Indicar si es transaccional.

**Invariantes que toca.** (→ enlazar átomos G.)

**Errores.** Cada error y cuándo se produce.
```

### B — Evento

```markdown
---
tipo: evento
routingKey: pedido.creado
exchange: NACHOPPS_EXCHANGE (topic)
payload: libs/contracts/src/domains/pedidos.ts:NN
fuente: [<rutas de publicador y consumidores>]
revisado: AAAA-MM-DD
commit: <hash>
---

# pedido.creado

**Payload.** Interface tipada (campos + tipos), citando el archivo en contracts.
Recordar la envoltura `DomainEventEnvelope<T>` (pattern/data/metadata).

**Productor(es).** Servicio + método + "vía Outbox (tabla `outbox_events`)".

**Consumidor(es).** Por cada uno: servicio, handler (`@EventPattern`), cola/binding,
y qué hace al recibirlo (→ enlazar endpoints/modelos afectados).

**Idempotencia.** Clave usada, UNIQUE en BD que la respalda, y tratamiento del
duplicado (P2002 → ACK como "ya procesado"). Si el consumidor NO es idempotente, decirlo.

**Camino de fallo.** Reintentos (backoff), a qué DLQ va, política de reinyección
(`x-reinjection-count`, `MAX_REINJECTIONS`) y si tiene parking.

**Invariantes.** (→ enlazar átomos G.)
```

### C — Modelo de datos

```markdown
---
tipo: modelo
servicio: servicio-inventario
tabla: productos
modelo: Producto
fuente: [apps/servicio-inventario/prisma/schema.prisma:NN, <migraciones>]
revisado: AAAA-MM-DD
commit: <hash>
---

# Producto (tabla `productos`)

**Campos.** Nombre, tipo, default, nullable.

**Índices.** Incluir únicos y **únicos parciales** (estos suelen codificar una
invariante de negocio → enlazar átomo G). Citar la migración que los crea.

**Relaciones.** A qué otros modelos.

**Escritores / lectores.** Qué métodos escriben y cuáles leen (→ enlazar A/B).

**Invariantes garantizadas por la BD.** (p. ej. "único parcial (fecha,hora) activo
⇒ un solo slot ⇒ la carrera se traduce a 409".) → enlazar átomo G.
```

### D — Flujo / saga

```markdown
---
tipo: flujo
nombre: pago-cierra-cuenta-libera-mesa
disparador: <endpoint o evento>
fuente: [<rutas de todos los pasos>]
revisado: AAAA-MM-DD
commit: <hash>
---

# Pago → cierre de cuenta → liberación de mesa

**Disparador.** Endpoint o evento que inicia el flujo.

**Secuencia.** Paso a paso: servicio → acción → evento emitido → consumidor.
Enlazar cada paso a su átomo A/B.

**Estados y transiciones.** De las entidades involucradas.

**Fallo y reconvergencia.** Qué pasa si un paso cae: a qué DLQ va, cómo reinyecta,
cómo reconverge el sistema. (→ enlazar átomo B del evento afectado.)

**Invariantes de extremo a extremo.** (→ enlazar átomos G.)

**Diagrama (opcional).** Mermaid de secuencia.
```

### E — Librería

```markdown
---
tipo: libreria
nombre: "@org/shared-rabbitmq"
ruta: libs/shared-rabbitmq
estado: activa            # o: codigo-muerto (con motivo)
fuente: [libs/shared-rabbitmq/src/index.ts, ...]
revisado: AAAA-MM-DD
commit: <hash>
---

# @org/shared-rabbitmq

**Responsabilidad.** (Una frase.)

**Exportaciones.** Cada una: firma, archivo, qué hace.

**Cómo se consume.** Ejemplo de import/uso.

**Estado.** Activa, o código muerto + por qué se conserva (si una lib no se usa por
el patrón Database-per-Service, explicarlo aquí, no en cada servicio).
```

### F — ADR (decisión de arquitectura)

```markdown
---
tipo: adr
id: ADR-002
estado: aceptada          # propuesta | aceptada | superada-por ADR-NNN
fecha: AAAA-MM-DD
fuente: [<rutas que materializan la decisión>]
---

# ADR-002 — Migración HTTP → Eventos (proyecciones locales)

**Contexto.** Qué problema existía.

**Decisión.** Qué se decidió.

**Consecuencias.** Positivas y negativas (incl. cold-start HTTP residual si lo hay).

**Alternativas descartadas.** Y por qué.

**Átomos afectados.** (→ enlazar A/B/C/D que materializan la decisión.)
```

> Cualquier marcador temporal que tiente al escribir un átomo ("esto es nuevo", "esto reemplazó a...") se traduce a un ADR aquí. Los átomos A/C/B/D quedan en presente; la evolución vive en `decisiones/`.

### G — Invariante

```markdown
---
tipo: invariante
slug: no-oversell
estado: verificada        # verificada | sin-verificar
fuente: [<mecanismo>, <prueba>]
revisado: AAAA-MM-DD
commit: <hash>
---

# El sistema nunca vende stock que no tiene (no oversell)

**Enunciado.** (Una frase verificable.)

**Por qué importa.** Qué se rompe si falla.

**Mecanismo que la garantiza.** (→ enlazar al endpoint/modelo/evento concreto;
p. ej. reserva atómica `UPDATE ... WHERE "stockActual" >= cantidad RETURNING`
+ `pg_advisory_xact_lock` por producto, en servicio-pedidos.)

**Prueba que la verifica.** Comando + reporte (`npm run probar:stock`,
`stress-tests/reports/...md`, escenarios C5/C6/C7), con el resultado observado.
```

---

## 5. Reglas de trazabilidad y anti-staleness (obligatorias)

- [ ] **Cita o no se escribe.** Cada afirmación factual referencia `archivo:línea`, una migración, o un reporte de prueba.
- [ ] **El código manda.** Toda afirmación se verifica leyendo el archivo fuente; nada se asume ni se infiere "de memoria".
- [ ] **Presente, no historia.** Prohibidos "nuevo", "antes", "ahora", "se refactorizó". Eso va a ADR (tipo F).
- [ ] **Front-matter con `revisado` y `commit`** en cada átomo, para saber contra qué versión se verificó.
- [ ] **Sin huérfanos.** Todo átomo se enlaza desde al menos un índice (`README`, `_catalogo`, o `_indice` de servicio).

---

## 6. Inventario de partida (verificar y completar contra el repo)

Punto de arranque; **el agente debe enumerar lo real** leyendo el repo y corregir faltantes o sobrantes.

**Servicios (10):** `pwa-cliente` (React/Vite), `servicio-identidad`, `servicio-mesas`, `servicio-pedidos`, `servicio-cuentas`, `servicio-reservas`, `servicio-inventario`, `servicio-notificaciones`, `servicio-caja`, `servicio-reportes`.

**Librerías (6):** `contracts`, `observabilidad`, `resiliencia`, `shared-auth`, `shared-rabbitmq`, `shared-prisma`.

**Eventos:** un átomo B por cada `RoutingKey` de `libs/contracts/src/events/routing-keys.ts`. El catálogo (`eventos/_catalogo.md`) debe casar **1:1** con el enum real; marcar las definidas pero no usadas.

**Flujos a documentar (mínimo):**
- [ ] Crear pedido → descuento de stock (inventario, decremento atómico condicional) + apertura/append de cuenta + push a KDS.
- [ ] Pago → cuenta pagada → cierre de cuenta → liberación de mesa + registro de venta diaria + pedidos a PAGADO.
- [ ] Apertura de cuenta → ocupación de mesa.
- [ ] Reposición de stock → proyección local en pedidos **aplicada como delta** (no absoluto).
- [ ] Reserva crear/cancelar → notificación; **slot único activo → 409**.
- [ ] Fallo de consumidor → DLQ → reinyección → reconvergencia → parking al superar el tope.

**Invariantes a documentar (mínimo) — cada una enlaza a su prueba:**
- [ ] No oversell (autoridad de stock en `pedidos.productos_locales`).
- [ ] Idempotencia directa (`pedido.creado` en inventario; `idempotency_keys.key @unique`; P2002 → ya procesado).
- [ ] Idempotencia inversa (`producto.creado`/`producto.actualizado` en pedidos; clave propia + UNIQUE).
- [ ] Reposición como **delta**, no absoluto (no re-infla en ventana stale).
- [ ] Trust boundary de `stockSyncMode`: aumentar exige `REPOSICION` **y** `stockDelta > 0`.
- [ ] Exactamente 1 éxito bajo carrera (C5/C7) y nunca exceder stock (C6).
- [ ] Un solo slot de reserva activo por `(fecha, hora)`.
- [ ] Happy path deja todas las colas (incl. `dlq.*` y `parking.*`) en `0 ready / 0 unacked`.
- [ ] Retención de `idempotency_keys` (7 días) en **pedidos e inventario**.

**ADR a formalizar (mínimo):** Database-per-Service; Transactional Outbox; migración HTTP→Eventos con proyecciones locales; decremento atómico condicional `updateMany` en inventario; reserva con advisory lock + `UPDATE ... RETURNING` en pedidos; reposición como delta; ACK/NACK manual con `noAck:false` en reportes; DLQ + parking + tope de reinyección.

**Infra transversal (en `operacion/` y `arquitectura.md`):** exchange `NACHOPPS_EXCHANGE` topic; `OutboxProcessor` (cron ~5s); `RabbitMQRetryInterceptor` (backoff 1s→2s→4s, máx 3, ACK/NACK automático — no invocar manual); Kong (`3000/min`, `30000/h`, parametrizable); OTel + Prometheus.

---

## 7. Índice maestro (`docs/README.md`)

- [ ] Una frase de qué es Nachopps + enlace a `arquitectura.md`.
- [ ] Secciones que enlazan: Servicios (cada `_indice.md`), Catálogo de eventos, Flujos, Invariantes, Decisiones (ADR), Librerías, Operación.
- [ ] Tabla "evento → productor → consumidores" como mapa rápido (enlazando a los átomos B).
- [ ] **Sin contenido factual sin cita** aquí tampoco; el README es navegación, no fuente.

---

## 8. Criterios de aceptación

- [ ] Cada átomo cubre **exactamente una** cosa y se entiende sin abrir otro.
- [ ] **Toda** afirmación factual tiene cita a `archivo:línea` / migración / reporte.
- [ ] **Cero** marcadores temporales ("nuevo", "antes", "ahora", "refactorizado").
- [ ] El catálogo de eventos casa **1:1** con `RoutingKeys` (sin huérfanos ni faltantes; definidas-no-usadas marcadas).
- [ ] **Todo** endpoint real tiene su átomo A; **todo** modelo Prisma tiene su átomo C.
- [ ] **Cada** invariante (G) enlaza al mecanismo (A/B/C) **y** a la prueba que la verifica.
- [ ] El `README` enlaza todo; no hay átomos huérfanos.
- [ ] Los datos reflejan el estado **actual** del sistema (idempotencia directa e inversa, `stockSyncMode`+delta, advisory lock, slot único 409, DLQ/parking, retención 7d). Si el código no coincide con lo esperado, se documenta el código real.

**Self-check antes de cerrar (por átomo):** ¿un solo tema? ¿cada hecho citado? ¿sin marcadores históricos? ¿enlaces resuelven? Si alguno falla, no está listo.

---

## 9. Entregable esperado

Un commit en `docs/documentacion-atomica` que: (a) añade el árbol completo de §3; (b) incluye una nota corta de cierre listando cuántos átomos por tipo se generaron. Si algún átomo se decide no escribir, dejar el motivo por escrito.

---

## Apéndice — dos átomos de ejemplo (formato, NO contenido)

> Ejemplos de **forma**. Los valores son ilustrativos y **deben verificarse y completarse** contra el código vivo. Los `<!-- verificar -->` marcan lo que el agente debe confirmar.

### Ejemplo átomo B — `eventos/pedido.creado.md`

```markdown
---
tipo: evento
routingKey: pedido.creado
exchange: NACHOPPS_EXCHANGE (topic)
payload: libs/contracts/src/domains/pedidos.ts:NN   <!-- verificar línea -->
fuente: [apps/servicio-pedidos/src/app/app.service.ts:NN, apps/servicio-inventario/src/app/events.controller.ts:NN]
revisado: AAAA-MM-DD
commit: <hash>
---

# pedido.creado

**Payload.** Envoltura `DomainEventEnvelope<T>` con `pattern`, `data`, `metadata`
(correlationId, occurredAt, producer, idempotencyKey). Campos de `data`: <!-- enumerar desde contracts -->.

**Productor.** servicio-pedidos, en `persistirPedido` vía Outbox (tabla `outbox_events`).

**Consumidores.**
- servicio-inventario (`@EventPattern`, cola `inventario_queue`): decremento atómico
  condicional `updateMany WHERE stockActual >= cantidad`. → datos/Producto.md
- servicio-cuentas: agrega ítems al snapshot de la cuenta (abre si no existe). <!-- verificar -->
- servicio-notificaciones: transmite al KDS. <!-- verificar -->

**Idempotencia.** Clave `idempotency_keys.key @unique` en inventario; P2002 → ACK
"ya procesado". <!-- verificar nombre de tabla/índice y que el consumidor la reclama en la misma transacción -->

**Camino de fallo.** Retry backoff (1/2/4s, máx 3) → `dlq.inventario_queue`;
reinyección con `x-reinjection-count`; al superar `MAX_REINJECTIONS` → `parking.inventario_queue`.

**Invariantes.** → invariantes/no-oversell.md, invariantes/idempotencia-directa.md
```

### Ejemplo átomo A — `servicios/servicio-pedidos/endpoints/POST--pedidos.md`

```markdown
---
tipo: endpoint
servicio: servicio-pedidos
metodo: POST
ruta: /pedidos
handler: apps/servicio-pedidos/src/app/app.controller.ts:NN   <!-- verificar -->
fuente: [apps/servicio-pedidos/src/app/app.controller.ts:NN, apps/servicio-pedidos/src/app/app.service.ts:NN]
revisado: AAAA-MM-DD
commit: <hash>
---

# POST /pedidos

**Propósito.** Crea un pedido para una mesa con sus ítems.

**Autorización.** `JwtAuthGuard` global. Roles: <!-- verificar RBAC -->.

**Entrada.** `{ mesaId, items[] }`; cada item `{ productoId, cantidad, ... }`. <!-- verificar DTO/validaciones -->

**Salida.** `{ message, pedido }`. 201 creado / 400 stock insuficiente o validación /
404 mesa o producto inexistente / 503 dependencia. <!-- verificar códigos reales -->

**Efectos.** Transaccional: crea `Pedido`+`PedidoItem`(+`Modificador`) e inserta
`OutboxEvent` (pedido.creado, pedido.actualizado). Reserva stock con
`UPDATE ... WHERE "stockActual" >= cantidad RETURNING` + `pg_advisory_xact_lock`. <!-- verificar -->
→ datos/Pedido.md, datos/ProductoLocal.md, eventos/pedido.creado.md

**Invariantes que toca.** → invariantes/no-oversell.md

**Errores.** 400 si algún item supera stock disponible; 404 si la mesa no está en
la caché local `MesaLocal`. <!-- verificar -->
```
