# Seguridad — Mapeo OWASP Top 10 (2021)

Estado de los controles del sistema frente a cada categoría del OWASP Top 10, y
herramientas de verificación continua (SonarQube — SAST, ZAP — DAST).

## Herramientas

| Herramienta | Tipo | Cómo usarla |
| --- | --- | --- |
| SonarQube Community | SAST (análisis estático) | `docker compose -f infra/sonarqube/docker-compose.sonarqube.yml up -d` → UI en `http://localhost:9000` (admin/admin, cambiar clave, generar token) → `pwsh scripts/sonar-scan.ps1 -Token <token> [-WithCoverage]` |
| OWASP ZAP | DAST (escaneo dinámico) | Con el stack levantado: `pwsh scripts/zap-baseline.ps1` (Kong `:8000`) o `-Target http://host.docker.internal:4200` para la PWA. Informes en `logs/zap/`. Reglas en `infra/zap/zap-baseline.conf`. |

El escaneo ZAP baseline es **pasivo** (spider + análisis de respuestas, no ataca).
Para un escaneo activo autenticado usar `zap-full-scan.py` apuntando a un entorno
desechable, nunca a datos reales.

## Mapeo por categoría

### A01 — Broken Access Control
- **Cubierto:** JWT validado en el gateway (plugin `jwt-cache` de Kong, `infra/kong/`) y guards de roles en los servicios NestJS (`libs/shared-auth`). Rate-limiting global y por ruta en Kong.
- **Verificar:** que toda ruta nueva pase por Kong y declare guard de rol; ZAP baseline detecta endpoints que responden sin autenticación.

### A02 — Cryptographic Failures
- **Cubierto:** contraseñas con bcrypt y re-hash automático si los rounds quedaron por debajo de `SALT_ROUNDS` (`apps/servicio-identidad/src/auth/auth.service.ts`); refresh tokens opacos almacenados hasheados y con rotación + revocación en cascada.
- **Pendiente:** TLS termina fuera del stack local; en producción exigir HTTPS extremo a extremo y cookies `Secure`.

### A03 — Injection
- **Cubierto:** Prisma (queries parametrizadas, sin SQL concatenado); `ValidationPipe` global con `whitelist` + `forbidNonWhitelisted` + `transform` (`libs/observabilidad/src/bootstrap.ts`).
- **Verificar:** SonarQube marca cualquier `$queryRawUnsafe`/interpolación; regla 40018 de ZAP en FAIL.

### A04 — Insecure Design
- **Cubierto:** límites de concurrencia, idempotencia y DLQ probados por stress-tests (`stress-tests/`); invariantes documentadas en `docs/invariantes/`.

### A05 — Security Misconfiguration
- **Cubierto:** `helmet` con opciones centralizadas (`libs/shared-auth/src/lib/helmet.config.ts`), CORS con allowlist explícita (Kong + Nest), Swagger deshabilitado en producción, `GlobalExceptionFilter` evita fugas de stack traces.
- **Fail-fast prod:** `CORS_ORIGIN`, `GRAFANA_PASS` y secretos de infraestructura son obligatorios; Jaeger no publica UI sin autenticación en el compose productivo.
- **Verificar:** reglas ZAP 10020/10021/10038/10055 (cabeceras) en FAIL.

### A06 — Vulnerable and Outdated Components
- **Cubierto parcialmente:** `npm audit` manual.
- **Pendiente:** automatizar `npm audit --omit=dev --audit-level=high` en CI (`.github/workflows/ci.yml`) o activar Dependabot.

### A07 — Identification and Authentication Failures
- **Cubierto:** login con bcrypt + comparación constante, refresh tokens rotados con detección de reuso (revocación de la familia), rate-limiting agresivo en rutas de auth (Kong), cookies con `httpOnly`/`SameSite`.
- **JWT S2S:** `SERVICE_AUD_ENFORCE=true` es la configuración estándar. El modo tolerante queda solo como rollback temporal y debe retirarse en la siguiente release mayor (T-56b). Invariante de confusión de algoritmo: `docs/invariantes/jwt-confusion-algoritmo.md`.

### A08 — Software and Data Integrity Failures
- **Cubierto:** patrón outbox + DLX en RabbitMQ garantiza integridad de eventos; lockfile (`package-lock.json`) versionado.
- **Pendiente:** firmar imágenes Docker / pin de digests en producción.

### A09 — Security Logging and Monitoring Failures
- **Cubierto:** logs JSON estructurados con `trace_id`/`correlationId` (Winston), stack Loki/Promtail/Grafana + Prometheus/Alertmanager (`infra/`), tracing OTel→Jaeger.

### A10 — Server-Side Request Forgery (SSRF)
- **Cubierto:** los servicios no hacen peticiones HTTP salientes a URLs controladas por el usuario; la comunicación interna es por RabbitMQ con destinos fijos.
- **Verificar:** SonarQube alerta si se introduce `fetch`/`axios` con URL derivada de input.

## Hallazgos aceptados

- **Google Fonts sin Subresource Integrity** (`apps/pwa-cliente/index.html`): el CSS de Google Fonts varía por user-agent, por lo que SRI no es aplicable. Alternativa futura: self-host de las fuentes.
- **Cabecera `Server` de Kong**: mitigado con `KONG_HEADERS: 'off'` en `infra/docker-compose.yml` (replicar en `docker-compose.prod.yml`).
- **`typescript:S7764` (`globalThis` vs `window`)**: en una PWA que solo corre en navegador, `window` es el idioma natural. Desactivada en el Quality Profile clonado **"Nachopps way (TS)"**, asignado al proyecto (2026-06-11).
- **`Web:S5725` (Google Fonts sin SRI)**: marcada como *aceptada* en SonarQube con comentario; misma justificación que arriba.
- **ZAP `10049` y `90005` (2026-06-11)**: aceptados en `docs/operacion/seguridad-interna-mtls-zap.md`; `10049` aparece en rutas 404 cacheables y `90005` corresponde a headers `Sec-Fetch-*` ausentes en requests del scanner.

## Estado SonarQube (2026-06-11, cierre del plan de remediación)

- **Quality gate: PASSED** · 0 bugs · 0 vulnerabilidades abiertas · 0 code smells.
- Quality gate del proyecto: **"Nachopps way"** (clon de Sonar way con `new_coverage` al 50%).
- La línea base de *New Code* se fijó en el análisis del cierre de la remediación
  (`SPECIFIC_ANALYSIS` 2026-06-11): la deuda de cobertura previa queda medida como
  cobertura global (~40%) y el gate exige cobertura solo al código nuevo.

## Cierre S-E (2026-06-11)

- `Math.random()` eliminado de la PWA para claves de idempotencia e ids efimeros; las claves `Idempotency-Key` usan Web Crypto.
- Imagen Docker de la PWA migrada a `nginxinc/nginx-unprivileged` en puerto 8080, con `COPY` explicito y config nginx versionada.
- Hotspots `http://` internos: dictamen registrado en Sonar como **Safe** con justificacion de red Docker interna, S2S HS256 con audiencia estricta y TLS en Kong; mTLS interno queda documentado como mejora futura.
- Nota operativa de ZAP/cobertura/mTLS: `docs/operacion/seguridad-interna-mtls-zap.md`.
- **Quality gate final:** PASSED sobre `12ba476` (`logs/security-run-20260611-185423`).
  Valores auditados: `new_violations = 0`, `new_security_hotspots_reviewed = 100.0%`,
  `new_coverage = 77.2%`, cobertura global Sonar `41.9%`, `0` bugs, `0`
  vulnerabilidades y `0` code smells.
- Hotspots revisados: los 3 `http://` internos quedaron `SAFE`; el hotspot historico
  del Dockerfile quedo `SAFE` tras verificar imagen `nginx-unprivileged` y smoke
  `whoami=nginx`.

## Rutina recomendada

1. **En cada PR:** lint + tests (ya en CI) y revisar issues nuevos de SonarQube.
2. **Semanal o pre-release:** `pwsh scripts/sonar-scan.ps1 -Token <t> -WithCoverage` + `pwsh scripts/zap-baseline.ps1` con el stack `dev` levantado.
3. **Pre-producción:** ZAP full scan autenticado contra entorno staging + `npm audit`.
