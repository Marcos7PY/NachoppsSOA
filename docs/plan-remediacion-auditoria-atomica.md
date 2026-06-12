# Plan de implementación atómico — Remediación de auditoría NachoPps SOA

**Origen:** auditoría atómica (informe `auditoria-nachopps.md`). Cubre M-01, M-02, L-01, L-02, L-03 y H-01…H-07, más un hallazgo adicional (V-01) detectado al preparar este plan.

**Convención:** las tareas continúan la numeración del repo (la más alta existente es T-40). Cada tarea es atómica: un PR, un objetivo, criterios de aceptación verificables, rollback claro. El orden de las fases es el orden de ejecución recomendado; dentro de una fase las tareas son paralelizables salvo dependencia explícita.

**Quality gate global (aplica a todo PR de este plan):**

```sh
npm exec nx run-many -- --target=lint --all
npm exec nx run-many -- --target=typecheck --all
npm exec nx run-many -- --target=build --all
npm exec nx run @org/source:test        # respeta los pisos de cobertura (no bajarlos)
npm run drift                            # guard de migraciones
```

Para las tareas de la Fase 1, además: `npm run probar:stock` y `npm run probar:alta-contencion` contra el stack Docker levantado.

---

## Fase 0 — Verificación previa (bloquea el diseño de la Fase 1)

### T-41 · V-01: Confirmar la semántica de `modificadores.precioExtra` en el total

**Hallazgo:** `calcularTotal` (`apps/servicio-pedidos/src/app/app.service.ts:167`) suma `precioUnitario × cantidad` e ignora `modificadores.precioExtra` (campo `Decimal @default(0)` en `schema.prisma:79`). Hoy, un modificador con precio > 0 no se cobraría.

**Acción:**
1. Decidir y documentar la regla de negocio en `docs/decisiones/` (ADR corto): ¿los modificadores son gratuitos (precioExtra siempre 0, campo reservado) o cobrables?
2. **Si son cobrables:** corregir `calcularTotal` para sumar `(precioUnitario + Σ precioExtra) × cantidad` ANTES de implementar T-42, porque la fórmula de recompute de T-42 debe ser idéntica a la de creación. Añadir spec unitario con un ítem con modificador de precio.
3. **Si son gratuitos:** dejar constancia en el ADR y en un comentario sobre `calcularTotal`; extraer la fórmula a una función exportada `calcularTotalItems(items)` en `pedido.mapper.ts` para que T-42 la reutilice y nunca diverjan.

**Archivos:** `apps/servicio-pedidos/src/app/app.service.ts`, `apps/servicio-pedidos/src/app/pedido.mapper.ts`, `docs/decisiones/`, spec nuevo.

**Aceptación:** existe una única función de cálculo de total, usada por creación y (tras T-42) por compensación; spec que fija la fórmula elegida.

---

## Fase 1 — Integridad contable (M-01) — *prioridad máxima*

El defecto tiene dos mitades complementarias. Se corrigen ambas: pedidos como **fuente de verdad del importe cobrable de un pedido activo**, y cuentas como **defensa que excluye estados no cobrables**. Así, un fallo en una capa no reabre el agujero.

### T-42: Recompute de `pedido.total` al rechazar ítems en la compensación de saga

**Dónde:** `apps/servicio-pedidos/src/app/pedidos-saga.service.ts`, método `procesarStockInsuficiente` (≈ líneas 190-250).

**Cambio:** dentro de la misma `$transaction` existente, después del `updateMany` que marca ítems `RECHAZADO_SIN_STOCK` y del `findUnique` que recarga el pedido con ítems:

1. Recalcular el total con la función única de T-41 sobre los ítems con `estado !== RECHAZADO_SIN_STOCK`.
2. Persistirlo en el `update` del pedido (tanto en la rama "todos rechazados → pedido RECHAZADO_SIN_STOCK", donde el total resultante será 0, como en la rama de rechazo parcial, donde hoy **no hay ningún update del pedido** — habrá que añadirlo: `prisma.pedido.update({ where: { id: pedidoId }, data: { total: nuevoTotal } })`).
3. No tocar el `outboxEvent` final: `mapPedidoToDto(pedidoFinal)` ya serializa `total` desde la entidad, así que el `PedidoActualizado` emitido llevará el total corregido automáticamente — siempre que `pedidoFinal` sea la entidad **releída tras el update del total**, no el snapshot previo. Cuidar ese orden.

**Pruebas (ampliar `pedidos-saga.service.spec.ts`):**
- Rechazo parcial: pedido de 2 productos (S/30 + S/20), `StockInsuficiente` del segundo → `pedido.total === 30` y el payload del outbox lleva 30.
- Rechazo total: ambos rechazados → `estado === RECHAZADO_SIN_STOCK`, `total === 0`.
- Idempotencia preservada: reentrega del mismo `StockInsuficiente` no vuelve a recomputar (P2002 corta antes).

**Riesgo/rollback:** cambio acotado a un método; revertir el PR restaura el comportamiento anterior sin migración.

### T-43: `servicio-cuentas` excluye pedidos no cobrables del total de la cuenta

**Dónde:** `apps/servicio-cuentas/src/app/app.service.ts`, los dos `reduce` de recompute (≈ líneas 133-137 y 175-179).

**Cambio:**
1. Definir el conjunto `ESTADOS_NO_COBRABLES = new Set([PedidoEstado.Cancelado, PedidoEstado.RechazadoSinStock])` (importar de `@org/contracts`).
2. En ambos handlers (`procesarPedidoCreado` y `procesarPedidoActualizado`), filtrar el snapshot antes del `reduce`: `snapshot.filter(p => !ESTADOS_NO_COBRABLES.has(p.estado))`. El snapshot **se conserva completo** en el JSON `pedidos` (valor histórico/auditoría); sólo el cálculo excluye.
3. Caso borde ya cubierto que hay que dejar testeado: si la cuenta está `CERRADA` cuando llega el `PedidoActualizado`, el `findFirst({ estado: Abierta })` devuelve null y no se toca nada — añadir spec que lo fije.

Esta tarea depende del tipado de T-52 sólo cosméticamente; puede hacerse antes usando el campo `estado` del snapshot con un type guard local.

**Pruebas (spec de cuentas, nuevo o ampliado):**
- Cuenta con 2 pedidos (S/50 + S/30); llega `PedidoActualizado` del segundo en `CANCELADO` → `cuenta.total === 50`.
- Llega `PedidoActualizado` con `RECHAZADO_SIN_STOCK` → excluido.
- Pedido con rechazo parcial (total ya recomputado por T-42 a S/30) → la cuenta suma 30 (verifica la composición T-42+T-43).
- Reentrega del mismo evento → total estable (idempotencia del replace por índice).

### T-44: Prueba de integración end-to-end de la saga de dinero

**Dónde:** suite e2e existente (`apps/servicio-pedidos-e2e` o una spec de flujo cruzado donde ya viven las pruebas contra el stack Docker/Kong; el repo ya tiene `scripts/pruebas-integracion.ts` como alternativa).

**Escenario a automatizar (contra stack levantado):**
1. Crear pedido con 2 ítems, uno con stock real 0 en inventario (proyección local desincronizada a propósito, como hace `run-stock-idempotency-dlq.js`).
2. Esperar la compensación (`StockInsuficiente` → ítem rechazado).
3. Afirmar: `pedido.total` = sólo ítems servidos; `cuenta.total` igual; el pago en caja por ese monto exacto **es aceptado**; el ticket cierra.
4. Variante: cancelar un pedido consolidado y afirmar que `cuenta.total` lo excluye y el pago por el resto procede.

**Aceptación de la Fase 1 completa:** los tres PRs verdes + este e2e pasando + `npm run probar:stock` sin regresiones.

### T-45: Backfill opcional de cuentas abiertas con total inflado

**Dónde:** `scripts/` (nuevo script TSX, estilo `poblar-datos.ts`).

**Cambio:** script one-off que recorre cuentas `ABIERTA`, recalcula `total` con la regla de T-43 sobre su snapshot y corrige discrepancias, logueando cada ajuste. Se ejecuta manualmente tras desplegar T-42/T-43. No es migración Prisma (es corrección de datos, no de schema); documentar en `docs/operacion/`.

**Nota:** si el sistema aún no tiene datos productivos reales, esta tarea se cierra como N/A con una línea en el CHANGELOG.

---

## Fase 2 — Endurecimiento de despliegue (M-02, H-04)

### T-46: Fail-fast de `CORS_ORIGIN` en producción

**Dónde:** `libs/observabilidad/src/bootstrap.ts` (≈ línea 62) y `apps/servicio-notificaciones/src/app/notifications.gateway.ts` (≈ línea 19).

**Cambio:**
1. En `bootstrapNachoppsService`, junto al check de `RABBITMQ_URI`: si `NODE_ENV === 'production'` y `!process.env.CORS_ORIGIN`, lanzar `Error('CORS_ORIGIN environment variable is required in production')`. El fallback a `localhost:4200` queda sólo para dev.
2. El decorador `@WebSocketGateway` se evalúa en import-time, así que no puede lanzar limpio ahí: extraer el cómputo de orígenes a una función `resolveWsCorsOrigins()` en el mismo archivo que aplique la misma regla (throw en prod sin variable) y se invoque en el objeto de opciones. Como el gateway se importa durante el bootstrap, el throw aborta el arranque igualmente.
3. Actualizar `.env.example` (la variable ya está marcada OBLIGATORIO — añadir "(fail-fast)") y el README en la sección de seguridad.

**Pruebas:** spec unitario de `resolveWsCorsOrigins` y del guard de bootstrap con `NODE_ENV` mockeado (3 casos: prod sin var → throw; prod con var → lista; dev sin var → fallback).

**Riesgo:** un despliegue existente sin la variable dejará de arrancar — ese es exactamente el objetivo; anunciar en CHANGELOG bajo *Breaking/Security*.

### T-47: `GRAFANA_PASS` obligatorio en prod

**Dónde:** `infra/docker-compose.prod.yml` (≈ línea 501).

**Cambio:** `GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASS:?GRAFANA_PASS es obligatorio en produccion}` — mismo patrón `:?` que el resto de secretos. Actualizar `.env.example` (quitar el aire de opcional a `GRAFANA_PASS=change_me`).

**Mientras se está ahí (mismo PR, misma naturaleza):** resolver la contradicción del puerto de Jaeger — el comentario dice *"Sin exponer puertos en prod"* pero publica `16686:16686` (UI sin autenticación). Opciones: eliminar el `ports:` (acceso por SSH túnel/red interna) o dejarlo y corregir el comentario con una advertencia explícita de que exige firewall. Recomendado: eliminarlo y documentar el túnel en `docs/operacion/`.

**Aceptación:** `docker compose -f infra/docker-compose.prod.yml config` falla sin `GRAFANA_PASS`; Jaeger no publicado (o decisión contraria documentada).

---

## Fase 3 — Consistencia de patrones (L-01)

### T-48: `procesarPagoRecibido` atómico e idempotente por construcción

**Dónde:** `apps/servicio-pedidos/src/app/app.service.ts` (≈ líneas 470-485).

**Cambio:** sustituir el `findMany` + bucle de `update` por un único statement:

```ts
await this.prisma.pedido.updateMany({
  where: { mesaId: payload.mesaId, estado: { notIn: [PedidoEstado.Pagado, PedidoEstado.Cancelado, PedidoEstado.RechazadoSinStock] } },
  data: { estado: PedidoEstado.Pagado },
});
```

Un solo `updateMany` es atómico por sí mismo (no necesita `$transaction`) e idempotente por convergencia (la reentrega encuentra 0 filas). Añadir `RechazadoSinStock` al `notIn`: un pedido rechazado no debe pasar a `PAGADO` por un pago de la mesa.

**Limitación conocida que se documenta, no se resuelve aquí:** el matching es por `mesaId`, así que un pedido creado entre el pago y el consumo del evento (siguiente cliente de la misma mesa) podría marcarse pagado. Resolverlo bien exige que `PagoRegistrado` transporte los `pedidoIds` de la cuenta (cambio de contrato + productor). Se abre como tarea de backlog T-48b con esa especificación; no se mete en este PR para mantenerlo atómico.

**Pruebas:** spec con reentrega (segunda llamada no cambia nada) y con pedido `RECHAZADO_SIN_STOCK` presente (no se toca).

---

## Fase 4 — Blindaje de seguridad por regresión (L-02, L-03)

### T-49: Test de invariante contra confusión de algoritmo JWT

**Dónde:** spec nuevo en `libs/shared-auth/src/lib/` + `docs/invariantes/`.

**Cambio:** spec que construye un token **HS256 firmado usando la clave pública RS256 como secreto** y verifica que `makeJwtSecretOrKeyProvider` + verificación lo **rechazan** (el provider devuelve `SERVICE_JWT_SECRET`, distinto, así que la firma no valida). Casos adicionales: `alg: none` → rechazado; `alg: RS512` → rechazado ("Algoritmo JWT no soportado"). Documentar la invariante en `docs/invariantes/jwt-confusion-algoritmo.md`: *el secreto HS256 jamás puede derivarse de, ni igualarse a, la clave pública*.

**Aceptación:** los 3 casos rojos→verdes en CI; cualquier regresión futura del `secretOrKeyProvider` rompe el build.

### T-50: Runbook del `degraded_mode` del jwt-cache

**Dónde:** `docs/operacion/jwt-cache-degraded.md` (nuevo) + `infra/kong/README.md`.

**Cambio (solo documental, el código queda igual):** dejar firmado el trade-off: con `degraded_mode: true`, si identidad cae, los tokens cacheados siguen válidos hasta su `exp` (máx. 15 min con la config actual) **incluyendo tokens revocados por logout**. Incluir: cómo desactivarlo (config del plugin en `kong.yml.template`), cómo vaciar la caché (reload de Kong), y el procedimiento ante sospecha de token comprometido durante una degradación (rotar `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY`, que invalida todo). Enlazar desde `seguridad-owasp-top10.md`.

---

## Fase 5 — Higiene (H-01…H-07)

### T-51: Comentario de aislamiento en los advisory locks `1234`

**Dónde:** los 4 call sites (`servicio-cuentas/app.service.ts:96,157`, `servicio-caja/app.service.ts:322`, `servicio-inventario/app.service.ts:222`).

**Cambio:** comentario de una línea en cada uno: `// classid 1234 compartido entre servicios A PROPÓSITO: cada servicio tiene su propia BD (database-per-service), el espacio de locks no se cruza.` Cero cambio funcional.

### T-52: Tipar los handlers de eventos con los contratos existentes

**Dónde:** `apps/servicio-inventario/src/app/app.service.ts` (`procesarPedidoCreado(pedido: any)`), `apps/servicio-cuentas/src/app/app.service.ts` (los `(p: any)` de los reduce y el snapshot), `apps/servicio-pedidos/src/app/app.service.ts` (`upsertProductoLocalConPrisma(prisma: any, …)`).

**Cambio (alcance acotado a handlers de eventos, no a los 51 `any` del repo):**
1. Inventario: `procesarPedidoCreado(pedido: PedidoCreadoPayload['pedido'])` con guard de runtime conservado (los payloads cruzan el bus; el tipo no sustituye la validación defensiva).
2. Cuentas: declarar `type PedidoSnapshot = PedidoDto` y tipar `snapshot: PedidoSnapshot[]`; los `reduce` dejan de necesitar `any` y el filtro de T-43 queda type-safe (`p.estado` deja de ser `any` — exactamente la clase de bug que M-01 representó).
3. Pedidos: tipar el parámetro `prisma` con el tipo del cliente transaccional (`Prisma.TransactionClient` del cliente generado) en `upsertProductoLocalConPrisma` y `reducirStockAutomaticoConPrisma` (inventario).
4. Eliminar los `eslint-disable @typescript-eslint/no-explicit-any` que queden huérfanos.

**Aceptación:** `typecheck` verde; conteo de `any` en handlers de eventos = 0; specs existentes sin cambios de comportamiento.

### T-53: Banner DEV ONLY en compose de desarrollo y seed

**Dónde:** `infra/docker-compose.yml` (cabecera) y `scripts/poblar-datos.ts` (cabecera).

**Cambio:** bloque de comentario inequívoco: *"SOLO DESARROLLO. Credenciales débiles a propósito (postgres `secret`, admin `nachopps123`, `SERVICE_JWT_SECRET` fijo). NUNCA usar este archivo en un VPS/host público; producción usa docker-compose.prod.yml + .env real."* Enlazar desde el README.

### T-54: Consolidar configuración de agentes duplicada

**Dónde:** `.agents/`, `.cursor/`, `.gemini/`, `.opencode/` (~1 MB, varios `SKILL.md` byte-a-byte idénticos).

**Cambio:** elegir `.agents/` como fuente canónica y generar el resto con un script `scripts/sync-agent-configs.sh` (cp -r selectivo) ejecutable on-demand + check opcional en CI de que no han divergido (diff -r, exit 1). Alternativa mínima si no se quiere script: documento `docs/operacion/agentes.md` que declare la canonicidad y el procedimiento manual. No usar symlinks (fricción en Windows/git).

### T-55: Decisión de alcance del módulo Compras (mock)

**Dónde:** backlog/`docs/planeamiento_*` — sin código.

**Cambio:** registrar decisión explícita con fecha: (a) construir `servicio-compras` (esbozo de eventos y dominio en `docs/servicios/`), (b) eliminar el módulo de la PWA, o (c) mantener el mock con etiqueta visible "demo" en la UI. Lo que no debe seguir es el estado tácito.

### T-56: `SERVICE_AUD_ENFORCE` — cerrar la puerta tolerante en la documentación

**Dónde:** `.env.example`, `docs/seguridad-owasp-top10.md`.

**Cambio:** el comentario actual del `.env.example` ya es bueno; reforzarlo con la fecha límite de retiro del modo tolerante y abrir tarea de backlog T-56b: *eliminar la rama `warn` del `jwt.strategy.ts` (T-17) en la siguiente release mayor*, dejando el enforcement incondicional. Mantener el flag un ciclo más como rollback es razonable; mantenerlo para siempre no.

---

## Orden de ejecución y dependencias

```
Fase 0:  T-41 (V-01) ──┐
                        ├──► T-42 ──► T-44 ──► T-45 (opcional)
Fase 1:        T-43 ───┘        (T-43 ∥ T-42; T-44 requiere ambos)
Fase 2:  T-46 ∥ T-47            (independientes de todo)
Fase 3:  T-48                   (independiente)
Fase 4:  T-49 ∥ T-50            (independientes)
Fase 5:  T-51…T-56              (independientes; T-52 idealmente antes o junto a T-43)
```

Estimación gruesa por tarea (implementación + pruebas + PR): T-41 0.5-1 d (depende de la decisión de negocio) · T-42 1 d · T-43 0.5 d · T-44 1 d · T-45 0.5 d · T-46 0.5 d · T-47 0.25 d · T-48 0.5 d · T-49 0.5 d · T-50 0.25 d · Fase 5 completa 1-1.5 d. **Total: ~7-8 días de trabajo efectivo.**

## Definición de hecho (global)

1. Quality gate completo verde en CI (lint, typecheck, build, test con pisos de cobertura intactos o subidos, drift).
2. e2e de la Fase 1 (T-44) pasando contra el stack Docker.
3. `probar:stock`, `probar:alta-contencion` y `probar:caos` sin regresiones.
4. CHANGELOG actualizado: M-01 bajo *Fixed*, T-46/T-47 bajo *Security*, resto bajo *Changed/Docs*.
5. Cero nuevos `any` introducidos; los pisos de cobertura suben al menos 1 pp con los specs nuevos de las Fases 1 y 4 (medir antes de fijar el número, siguiendo la práctica de calibración ya documentada en `vitest.config.mts`).
