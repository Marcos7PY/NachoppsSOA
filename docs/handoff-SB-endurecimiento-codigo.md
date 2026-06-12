# Handoff S-B — Endurecimiento post-cambios (consumidores de `email`/`nombre` · semántica T-34)

> **Sesión autocontenida, solo código.** No requiere el stack ni depende de S-A/S-C/S-D.
> Prerequisito: repo en `dev` con los 10 commits del plan de remediación externa.
> Esfuerzo estimado: 0.5 día. Salida: 1–2 commits atómicos + specs nuevos si aplica.

## Contexto mínimo

Dos cambios del plan dejaron flancos que hay que revisar (no son bugs confirmados, son
revisiones dirigidas):

1. **`367beda`** hizo `email` y `nombre` **opcionales** en `JwtPayload` (fiel a los tokens
   S2S reales, que no los llevan). El `validate()` de la estrategia devuelve el payload tal
   cual, así que cualquier consumidor aguas abajo que asuma esos campos presentes puede
   recibir `undefined` en requests S2S.
2. **T-34 (`9f0c1ff`)** introdujo compare-and-swap en `rotateRefreshToken`. Hay que verificar
   qué camino toma el **perdedor de una carrera legítima** (dos pestañas refrescan a la vez):
   si converge con el camino de "reuso genuino" y revoca la cadena completa, el usuario queda
   deslogueado en ambas pestañas — funcionalmente seguro pero agresivo en UX.

## Parte 1 — Consumidores de `email`/`nombre` (≈2h)

### Inventario

```bash
# Endpoints que aceptan tokens S2S (rol SISTEMA) y usan el user del request:
grep -rn "@User()\|req.user\|request.user" apps --include="*.ts" | grep -v spec
grep -rn "\.email\b" apps libs --include="*.ts" | grep -v spec | grep -v "command.email\|usuario.email\|where.*email"
grep -rn "user\.nombre\|mesero\b" apps --include="*.ts" | grep -v spec | head -30
```

Foco especial: **servicio-pedidos** (recibe llamadas de usuario con `mesero` derivado del
token) y cualquier `logger.log` o auditoría que interpole `user.email`/`user.nombre`.

### Criterio de decisión por hallazgo

- Interpolación en logs/auditoría → tolerar `undefined` con `?? 'S2S'` o `?? payload.aud`.
- Lógica de negocio (p. ej. asignar mesero a un pedido) → si el endpoint puede ser invocado
  S2S, hacer el campo explícitamente opcional en el flujo o rechazar S2S en ese endpoint
  (`rol !== 'SISTEMA'`) si no tiene sentido de negocio.
- Tipos: si un DTO interno declara `email: string` y se alimenta del token, alinear el tipo
  con la realidad (`string | undefined`) en vez de castear.

### Aceptación

Spec nuevo (P-62): request con token S2S válido (sin `email`/`nombre`) contra al menos un
endpoint protegido de pedidos y uno de caja → 2xx sin `TypeError` y log/auditoría legible.
`npx nx run-many -t test` en verde.

## Parte 2 — Semántica de carrera en T-34 (≈2h)

### Verificación

Leer `rotateRefreshToken` en `apps/servicio-identidad/src/auth/auth.service.ts` y responder:

> Cuando `updateMany({ where: { id, revokedAt: null } })` devuelve `count !== 1`,
> ¿el código (a) lanza 401 simple, o (b) entra al camino de reuso y revoca
> **toda la cadena** del usuario?

También revisar P-56: ¿el spec de concurrencia afirma solo "exactamente uno gana" o también
afirma qué pasa con las sesiones restantes del usuario?

### Si es (b), ajustar a esta semántica

- **Carrera perdida** (el token fue revocado hace < ~10s y tiene `replacedById`): responder
  401 `Refresh token ya utilizado` **sin** revocar la cadena. La pestaña perdedora hará
  login o reintentará; la ganadora sigue viva.
- **Reuso genuino** (token revocado sin ventana de gracia, o presentado mucho después):
  mantener la revocación de cadena completa + warn, como hasta ahora — esa es la defensa
  contra robo de token y no debe relajarse.

Implementación sugerida: en el camino `count !== 1`, releer el registro; si
`revokedAt > now() - GRACE_MS` y `replacedById != null` → 401 simple; en caso contrario →
revocación de cadena. `GRACE_MS` ≈ 10_000, constante con comentario.

### Aceptación

- P-56 extendido: 2 refresh concurrentes → 1 gana, el perdedor recibe 401 **y** la cadena
  del ganador sigue válida (un refresh posterior con el token nuevo → 200).
- Caso de reuso tardío (mock de reloj o `revokedAt` antiguo) → cadena revocada, 401.
- Suite de identidad en verde, pisos de cobertura intactos.

## Commits sugeridos

1. `fix(auth): tolerar payloads S2S sin email/nombre en consumidores (P-62)`
2. `fix(identidad): distinguir carrera de refresh de reuso genuino (T-34b, P-56)`
   — solo si la verificación confirma el camino (b).
