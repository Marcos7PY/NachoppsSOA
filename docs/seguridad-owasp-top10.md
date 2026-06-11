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
- **Verificar:** reglas ZAP 10020/10021/10038/10055 (cabeceras) en FAIL.

### A06 — Vulnerable and Outdated Components
- **Cubierto parcialmente:** `npm audit` manual.
- **Pendiente:** automatizar `npm audit --omit=dev --audit-level=high` en CI (`.github/workflows/ci.yml`) o activar Dependabot.

### A07 — Identification and Authentication Failures
- **Cubierto:** login con bcrypt + comparación constante, refresh tokens rotados con detección de reuso (revocación de la familia), rate-limiting agresivo en rutas de auth (Kong), cookies con `httpOnly`/`SameSite`.

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

## Rutina recomendada

1. **En cada PR:** lint + tests (ya en CI) y revisar issues nuevos de SonarQube.
2. **Semanal o pre-release:** `pwsh scripts/sonar-scan.ps1 -Token <t> -WithCoverage` + `pwsh scripts/zap-baseline.ps1` con el stack `dev` levantado.
3. **Pre-producción:** ZAP full scan autenticado contra entorno staging + `npm audit`.
