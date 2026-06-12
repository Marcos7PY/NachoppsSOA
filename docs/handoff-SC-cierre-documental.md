# Handoff S-C — Cierre documental (.env.example · README · nota de migraciones)

> **Sesión autocontenida, solo documentación.** Sin prerequisitos de stack ni de código.
> Esfuerzo: < 1 hora. Salida: 1 commit `docs:`. Puede ejecutarse en cualquier momento,
> incluso en paralelo con S-A/S-B; si S-B cambia semántica de T-34, este commit puede ir
> antes o después sin conflicto.

## Contexto mínimo

Tras implementar T-31…T-42 quedaron tres piezas de documentación desalineadas o pendientes.
Son menores, pero el estilo del proyecto (planes v5.x con evidencia anclada) exige que el
repo no afirme nada que el código contradiga.

## Tarea 1 — `.env.example`: comentario obsoleto de `SERVICE_AUD_ENFORCE`

El bloque actual dice:

> "Rollout: dejar SERVICE_AUD_ENFORCE sin definir (tolerante, solo warn) hasta confirmar
> que todos emiten `aud`; luego ponerlo en 'true' para rechazo estricto."

T-37 (`c266372`) ya fijó `'true'` en los 18 sitios de ambos compose: el rollout terminó.
Reemplazar por algo del estilo:

```
# T-17/T-37: rechazo estricto de tokens S2S con audiencia incorrecta. Activo ('true')
# en ambos compose desde T-37; dejarlo en 'true'. El modo tolerante (warn) existe solo
# como mecanismo de rollback temporal ante un incidente de despliegue.
SERVICE_AUD_ENFORCE=true
```

Además: descomentar/añadir la variable con su valor (hoy está comentada como `# SERVICE_AUD_ENFORCE=true`).

## Tarea 2 — README: confirmar que el drift de T-33 quedó cerrado

La auditoría externa marcó como drift la afirmación "circuit breaker en llamadas síncronas
(pedidos→inventario, caja→cuentas)" cuando solo caja lo tenía. T-33 (`515a51d`) implementó
los breakers en pedidos, así que la afirmación **probablemente ya es verdadera** — pero hay
que verificarlo, no asumirlo:

```bash
grep -rn "CircuitBreakerOptions" apps --include="*.ts" | grep -v spec
# esperado: caja (cuentas) + pedidos (MesasHttpClient, InventarioHttpClient)
grep -n "circuit breaker" README.md
```

Si coincide → ningún cambio (registrar el grep como evidencia). Si el README menciona solo
una de las dos rutas o omite mesas, actualizar la frase a la realidad:
"circuit breaker en llamadas síncronas (pedidos→mesas, pedidos→inventario, caja→cuentas)".

## Tarea 3 — Runbook: opción futura de migraciones fuera del runtime

T-32 movió `prisma` (CLI) a `dependencies` porque `entrypoint.sh` ejecuta `migrate deploy`
al arrancar. Es el trade-off correcto hoy, pero el CLI es de lo más pesado que queda en la
imagen (~888MB en identidad). Añadir a `docs/operacion/` (junto al runbook de
`/telemetry/metrics` de T-41) una nota corta:

```
## Futuro: migraciones como job dedicado

El runtime incluye el CLI de Prisma solo para `migrate deploy` en el entrypoint. Si se
necesita reducir más la imagen o desacoplar migración de arranque (réplicas, rollouts),
el patrón es: imagen/job de migración propia (init-container en K8s o servicio one-shot
en compose con `depends_on: condition: service_completed_successfully`), y el runtime
queda solo con el cliente generado. No planificado; registrar aquí la decisión si se hace.
```

## Tarea 4 — Actualizar el tablero del plan

En `docs/plan-remediacion-auditoria-externa.md` (si ya está commiteado en el repo), marcar
T-31…T-42 con su hash de cierre y dejar explícito que la evidencia runtime pendiente vive
en el handoff S-A. Mantener el formato de tablero del plan v5.1.

## Aceptación

- `grep -rn "dejar SERVICE_AUD_ENFORCE sin definir" .env.example` → 0.
- Grep de Tarea 2 registrado en el cuerpo del commit.
- Nota de migraciones presente en `docs/operacion/`.
- Un solo commit: `docs: cierre documental post T-31…T-42 (env, README, runbook)`.
