# Revisión del estado del sistema — brief para Claude Code

> **Qué es este documento.** No es un informe de resultados. Es una lista de tareas de investigación y verificación sobre el repo. Cada hallazgo está escrito como **hipótesis a confirmar**, no como bug confirmado: la mayoría salen de leer los reportes de stress (`stress-tests/reports/...`), no de leer el código. Antes de "arreglar", **confirma en el código si el problema existe**. Si una hipótesis es falsa, anótalo y sigue.

## Contexto del sistema (inferido de los reportes — verificar)

- Monorepo **Nx** con servicios **NestJS**.
- Microservicios detectados (por colas de RabbitMQ): `servicio-pedidos`, `servicio-inventario`, `mesas`, `cuentas`, `caja`, `reportes`, `identidad`, `notificaciones`.
- Gateway **Kong** en `http://localhost:8000`; los servicios también exponen puertos directos en host (modo dev).
- **RabbitMQ** con colas principales + DLQ por dominio (`dlq.*`).
- Auth con **JWT en cookie httpOnly** (`access_token`); login con rate limit por Kong.
- Contratos/DTOs en `libs/contracts/src/domains/` (p. ej. `inventario.ts`).
- Scripts de prueba: `npm run probar` (49/49), `npm run probar:concurrencia`, `npm run probar:seguridad`.
- Docker Compose con profile `all`; `infra/entrypoint.sh`.

## Lo que ya está bien (no romper)

- Dos bugs reales encontrados y corregidos: **overselling** (C6) y `POST /inventario/productos/lote` aceptando UUIDs inválidos como falso positivo.
- Reserva/descuento atómico de stock en `servicio-pedidos` dentro de la misma transacción que crea el pedido.
- Suite `probar` en verde (49/49). **Cualquier cambio debe mantener 49/49 o sumar, nunca restar.**

## Reglas de trabajo para esta revisión

- [ ] No introducir regresiones: `npm run probar` debe seguir en verde tras cada cambio.
- [ ] Tras tocar un servicio, recompilar con `npm exec nx build <servicio>`.
- [ ] El **happy path** debe seguir dejando las DLQ en `0` (`messages_ready` y `messages_unacknowledged`).
- [ ] Los tests nuevos de fallo deben **limpiar tras de sí** (no dejar mensajes colgados ni datos sucios).
- [ ] Marcar claramente qué tests prueban *corrección* (smoke) y cuáles prueban *carga/rendimiento*. No mezclar.

---

# P1 — Consistencia eventual del stock: idempotencia, fallo de DLQ y reconciliación

**Es el hueco más importante.** La corrección de overselling introdujo **doble fuente de verdad para el stock**: la proyección local en `servicio-pedidos` (transaccional) y la verdad en `servicio-inventario`, sincronizadas por un **evento asíncrono** vía RabbitMQ. Los reportes solo prueban el camino feliz. Las DLQ en `0` confirman que el happy path drena, **no** que el sistema se recupere ante fallos.

### Qué investigar

- [ ] **Idempotencia del consumidor de inventario.** ¿Qué pasa si RabbitMQ re-entrega el mismo evento de descuento de stock (redelivery por nack/timeout/reinicio del consumer)? ¿`servicio-inventario` descuenta dos veces?
  - Buscar el handler que consume de `inventario_queue`. Verificar si usa una clave de idempotencia (id de evento / id de pedido) y si rechaza duplicados.
- [ ] **Divergencia de proyecciones.** Si el evento `pedidos → inventario` falla y cae en `dlq.inventario_queue`, la proyección local de `pedidos` ya descontó pero la verdad de `inventario` no. ¿Cómo se detecta y corrige esa divergencia? ¿Existe reconciliación o reprocesamiento de DLQ?
- [ ] **Política de reintentos / DLQ.** ¿Cuántos reintentos antes de DLQ? ¿Hay backoff? ¿Quién drena las `dlq.*` y bajo qué criterio?
- [ ] **Orden y concurrencia de eventos.** Si llegan dos descuentos del mismo producto desfasados, ¿el resultado final es correcto independientemente del orden?

### Tests a añadir (en `stress-tests/`, escenario nuevo, p. ej. `D1`/`D2`)

- [ ] **D1 — Redelivery idempotente:** forzar el reprocesamiento del mismo evento de stock y verificar que el stock en `inventario` solo se descuenta una vez.
- [ ] **D2 — Fallo a DLQ y reconciliación:** simular fallo del consumidor de inventario (parar consumer / forzar excepción), generar pedidos, comprobar que el mensaje aterriza en `dlq.inventario_queue`, y verificar el mecanismo de recuperación (re-drenaje o reconciliación) que vuelve a igualar proyección local y verdad.

### Criterio de aceptación

- [ ] Documentado (en código o doc) qué garantiza la idempotencia y dónde está la clave.
- [ ] Existe un test que demuestra que una re-entrega **no** produce doble descuento.
- [ ] Existe un test que demuestra que tras un fallo a DLQ, el sistema reconcilia (o queda documentado explícitamente que la reconciliación es manual y por qué).

---

# P2 — Profundidad y realismo de las pruebas de concurrencia

La concurrencia base fue **8** y cada escenario corrió **una sola vez**. Las race conditions son probabilísticas y suelen aparecer solo bajo **contención alta**. Pasar C6 con 8–10 intentos puede significar que las requests casi se serializaron y la carrera real nunca se ejercitó. El propio informe lo admite ("con la concurrencia configurada"), lo cual es honesto pero también marca el límite.

### Qué investigar / cambiar

- [ ] Subir la concurrencia de los escenarios críticos (C3, C5, C6, C7) a niveles altos: probar **50, 100 y, si aguanta, 200+** peticiones simultáneas.
- [ ] **Repetir** cada escenario en bucle (p. ej. 100 iteraciones) antes de declararlo OK. Un solo pase no prueba ausencia de carrera.
- [ ] Confirmar que el cliente de prueba realmente dispara en paralelo y no de forma escalonada (revisar el runner en `stress-tests/`).
- [ ] Revisar de dónde sale el aislamiento: si el lock/transacción descansa en restricciones de BD (unique, `SELECT ... FOR UPDATE`, versión optimista), verificar que sigue siendo correcto bajo alta contención y no solo "rápido".

### Criterio de aceptación

- [ ] C5 (pago duplicado) y C7 (reserva del mismo slot) mantienen **exactamente 1 éxito** con concurrencia ≥ 100 y a lo largo de N iteraciones.
- [ ] C6 (stock compartido) nunca vende más que el stock inicial, con stock final exacto, bajo alta contención repetida.
- [ ] El informe distingue "concurrencia probada" (número y nº de iteraciones) de "concurrencia soportada".

---

# P3 — Profundidad de las pruebas de seguridad

Los checks actuales son **smoke** (buenos como invariantes, pero superficiales). Faltan las clases de fallo más comunes en un sistema multiusuario.

### Qué investigar / añadir

- [ ] **Autorización a nivel de objeto (IDOR).** RBAC solo verifica que `MESERO` no gestiona usuarios (403). Falta: ¿puede el usuario A leer/modificar la **cuenta**, **pedido** o **reserva** del usuario B cambiando el id en la URL? Añadir prueba que confirme `403/404` en acceso cruzado.
- [ ] **Robustez del JWT.** Hoy solo se prueba token válido vs inválido. Añadir:
  - [ ] Token **expirado** → `401`.
  - [ ] Token con **payload manipulado** (cambiar rol/`sub`) → `401`.
  - [ ] Ataque **`alg: none`** y firma con algoritmo incorrecto → `401`. Verificar que el verificador fija el algoritmo esperado y no acepta `none`.
- [ ] **Alcance del rate limit de login.** ¿El límite de 5/min es por **IP**, por **usuario** o **global**? Probar:
  - [ ] ¿Se puede saltar variando un header (`X-Forwarded-For` u origen)?
  - [ ] ¿Aplica también a **registro** y **reset de password**, o solo a login?
- [ ] **CORS:** ya se prueba permitido vs no listado; confirmar además que no se refleja `Access-Control-Allow-Credentials: true` junto a un origen comodín.

### Criterio de aceptación

- [ ] Test de IDOR en al menos `cuentas`, `pedidos` y `reservas` pasando en verde.
- [ ] Tests de token expirado, manipulado y `alg:none` devolviendo `401`.
- [ ] Documentado el alcance real del rate limit y demostrado que el bypass por header no funciona.

---

# P4 — Validez de las métricas reportadas

Las latencias **p95/p99 con n≈8 no son percentiles**: colapsan al máximo (por eso C3 muestra `p95=p99=max=179ms`). Y hay un **artefacto roto**: `RPS=0` en S3/S4.

### Qué investigar / cambiar

- [ ] Para reportes de *corrección* (n bajo): **eliminar p95/p99** y reportar solo min/máx/promedio, dejando explícito que es un smoke, no un benchmark.
- [ ] Para reportes de *rendimiento*: subir el volumen de requests lo suficiente para que los percentiles tengan sentido estadístico (cientos+).
- [ ] Corregir el cálculo de **RPS** que da `0` en S3/S4 (revisar el divisor de tiempo en el runner de `stress-tests/`).

### Criterio de aceptación

- [ ] Ningún reporte muestra `RPS=0` por un bug de cálculo.
- [ ] Los percentiles solo aparecen cuando el tamaño de muestra los hace significativos; si no, se reportan promedios con la aclaración correspondiente.

---

# P5 — Cookie `Secure` sobre HTTP (verificación)

El base URL es `http://localhost:8000` (sin TLS) y la cookie de login sale con flag **`Secure`** y aun así el test "JWT por cookie" pasó. Una cookie `Secure` no debería viajar por HTTP plano. Los navegadores tratan `localhost` como excepción, pero un cliente HTTP programático no necesariamente.

### Qué investigar

- [ ] Determinar **por qué pasó** el test: ¿el cliente HTTP del runner ignora el flag `Secure` y reenvía la cookie igual? Si es así, el test no refleja el comportamiento real de un navegador.
- [ ] Decidir y documentar la política: `Secure` condicionado por entorno (off en dev sin TLS / on en prod), o TLS también en dev.

### Criterio de aceptación

- [ ] Queda claro y documentado el comportamiento de la cookie por entorno, y el test refleja el comportamiento real (no un cliente que ignora `Secure`).

---

# P6 — Cobertura y consolidación de informes

- [ ] **Escenarios faltantes en el catálogo.** Los IDs usados (C3, C5, C6, C7, S3, S4) implican que existen o existieron C1, C2, C4, S1, S2. Localizar en `stress-tests/` qué cubren esos IDs. Si no existen, **renumerar o documentar explícitamente el alcance** para que un hueco intencional no se confunda con un olvido.
- [ ] **Matriz de cobertura.** Crear una tabla única que liste todos los escenarios (concurrencia + seguridad + nuevos D1/D2), su estado (cubierto / pendiente / fuera de alcance) y por qué. Esto reemplaza la sensación de catálogo incompleto.
- [ ] **Solapamiento de informes.** El informe de seguridad ya re-ejecuta los checks S3/S4 del informe de concurrencia. Consolidar en un solo documento, o aclarar explícitamente que el de seguridad **reemplaza** la sección de seguridad del de concurrencia.

### Criterio de aceptación

- [ ] Existe una matriz de cobertura con "fuera de alcance" marcado de forma explícita.
- [ ] No hay ambigüedad sobre qué informe es la fuente de verdad para seguridad.

---

## Orden sugerido de ataque

1. **P1** (riesgo de corrección real en el diseño de doble fuente de stock).
2. **P2** (sin alta contención, la afirmación central del informe de concurrencia no está demostrada).
3. **P3** (clases de fallo de seguridad más comunes).
4. **P4** y **P5** (calidad de medición y un detalle de config).
5. **P6** (presentación y cobertura).

## Entregable esperado de Claude Code

Por cada P: (a) si la hipótesis se confirma o no, con la evidencia en código; (b) el cambio aplicado o el test añadido; (c) salida de `npm run probar` mostrando que sigue en verde. Si algún punto se decide **no** abordar, dejar la razón escrita.
