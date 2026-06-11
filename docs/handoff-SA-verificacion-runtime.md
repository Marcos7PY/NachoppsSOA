# Handoff S-A — Verificación runtime sobre el stack prod (P-53 · aud · P-59 · regresión)

> **Sesión autocontenida.** Único prerequisito: poder levantar `infra/docker-compose.prod.yml`
> en la máquina local (Docker + `.env` completo). **Agrupa todos los pendientes que requieren
> el stack vivo** — no dividir en sesiones separadas: el costo dominante es levantar el stack.
> No depende de S-B, S-C ni S-D.

## Contexto mínimo

El plan de remediación de la auditoría externa (T-31…T-42) está implementado en `dev`
(10 commits, Suite 1 en 504/504). Quedó pendiente **solo la evidencia runtime** que no se
puede producir sin el stack:

- **P-53** — smoke del compose prod completo con las **imágenes nuevas de T-32** (Dockerfile
  sin ts-node, `npm ci --omit=dev`; verificado hasta ahora solo en identidad: 1.8GB→888MB).
- **Grep de `aud` en vivo** — T-37 fijó `SERVICE_AUD_ENFORCE: 'true'` en los 18 sitios de
  ambos compose; hay que confirmar que ningún servicio emite tokens S2S sin `aud` correcto.
- **P-59** — rechazo estricto de un token S2S con audiencia cruzada.
- **Regresión del breaker (T-33)** — pedidos→mesas/inventario ahora pasa por
  `MesasHttpClient`/`InventarioHttpClient` con circuit breaker; confirmar que caos y
  concurrencia no regresionan.

## Pasos

### 1. Build y arranque (≈30 min de pared)

```bash
docker compose -f infra/docker-compose.prod.yml build   # 9 servicios, imágenes T-32
docker compose -f infra/docker-compose.prod.yml up -d
docker compose -f infra/docker-compose.prod.yml ps      # todos healthy
```

Registrar tabla de tamaños: `docker images | grep nachopps` (evidencia de P-52 extendida a
los 9; el baseline previo era ~1.8GB por servicio, identidad quedó en 888MB).

### 2. P-53 — Smoke 4/4 (runbook §4 del plan v5.1)

1. Login vía Kong (`POST :8000/v1/identidad/auth/login`) → 200, cookies `access_token` +
   `nachopps.csrf_token`.
2. Pedido E2E: crear mesa→cuenta→pedido con CSRF header → 201 y estados consistentes.
3. Evento outbox publicado: verificar en logs del productor `Evento publicado:` y consumo
   en el servicio destino (o `outbox_pending_total` vuelve a 0 en Prometheus).
4. WebSocket: conectar a `/notificaciones/socket.io` con el token → recibir evento en vivo
   del pedido creado.

Atajo aceptable: `npm run poblar-y-probar` contra el stack prod cubre 1–3; el WS se
verifica aparte (la PWA o un cliente socket.io con el JWT).

### 3. Grep de warns `aud` en vivo

Con el stack corriendo y **después** de `poblar-y-probar` + suites del paso 4:

```bash
docker compose -f infra/docker-compose.prod.yml logs --since=2h \
  | grep -i "no coincide con SERVICE_NAME" | wc -l   # esperado: 0
```

> Nota: con `SERVICE_AUD_ENFORCE=true` el modo tolerante ya no aplica — un `aud` incorrecto
> produce 401, no warn. Por eso el grep debe complementarse con: ninguna llamada S2S
> legítima falló durante las suites (revisar 401 en logs de pedidos→mesas/inventario y
> caja→cuentas).

### 4. Suites de estrés (regresión T-33/T-34)

```bash
npm run probar:concurrencia
npm run probar:caos          # incluye caída de inventario: el breaker debe abrir y recuperar
npm run probar:seguridad
npm run probar:stock
```

Criterio: resultados ≥ baseline de `stress-tests/reports/BASELINE.md`. En el escenario de
caos con inventario caído, verificar en logs de pedidos la apertura del circuito (503
inmediatos sin timeout de 5s acumulado) y el cierre tras `resetTimeout`.

### 5. P-59 — Audiencia cruzada → 401

Generar un token S2S firmado con `SERVICE_JWT_SECRET` del entorno, `rol: SISTEMA`,
`aud: 'servicio-mesas'`, y presentarlo **dentro de la red** contra servicio-caja
(p. ej. `docker exec` + curl a `http://servicio-caja:3000/api/...`):

```bash
# esperado: 401 Audiencia del token de servicio inválida
```

Repetir con `aud` correcto → 2xx/4xx de negocio (no 401). Documentar ambos.

## Criterios de aceptación / evidencia a registrar

| Ítem | Evidencia |
|------|-----------|
| P-52 ext. | Tabla de tamaños de las 9 imágenes |
| P-53 | Smoke 4/4 con salidas (status codes, evento WS) |
| aud en vivo | grep = 0 + cero 401 S2S espurios en suites |
| P-59 | 401 con aud cruzado, OK con aud correcto |
| Regresión | Reportes de las 4 suites ≥ BASELINE |

Cerrar con un commit `docs: evidencia runtime S-A` que actualice el plan de remediación
externa (tabla de tareas → todas con evidencia anclada al HEAD) al estilo v5.1.

## Si algo falla

- Imagen no arranca → sospechar del bundle T-32 (alias `@org/*` o cliente Prisma no
  incluido); comparar con identidad, que está verificada.
- 401 S2S espurios → un servicio emite `aud` distinto a `SERVICE_NAME` del destino;
  revisar `getServiceToken(audience)` del llamador, NO bajar el flag a tolerante.
- Breaker abierto en reposo → umbral 50% con poco tráfico es sensible; revisar que el 404
  siga excluido como error (decisión de T-33).
