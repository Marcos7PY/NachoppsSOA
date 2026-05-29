# Informe de seguridad y limites

Fecha: 2026-05-29
Rama: `codex/security-and-limit-tests`
Baseline: `ff7534b Merge pull request #3 from Marcos7PY/codex/concurrency-limits-tests`
Base URL: `http://localhost:8000`

## Alcance ejecutado

Se agrego y ejecuto `npm run probar:seguridad`, con checks focalizados sobre:

- JWT por cookie `access_token`.
- Atributos de cookie de login.
- CORS para origen permitido y origen no listado.
- RBAC de usuarios no admin contra endpoints administrativos.
- Bypass por puertos directos publicados en host.
- Payloads invalidos.
- Rate limit de login por Kong.

## Hallazgo corregido

`POST /inventario/productos/lote` aceptaba `ids` invalidos como `["no-uuid"]` y respondia exitosamente con lista vacia. Esto ocultaba payloads malformados como falsos positivos.

Correccion aplicada:

- Se agrego `ObtenerProductosLoteCommand` en `libs/contracts/src/domains/inventario.ts`.
- El DTO exige `ids` como array no vacio y cada item como UUID valido.
- El controller de inventario ahora recibe el DTO completo y deja que `ValidationPipe` devuelva `400` ante payloads invalidos.

## Resultado final

Comando:

```powershell
npm run probar:seguridad
```

Resultado: `7/7` invariantes OK.

| Escenario | Status | p95 | Invariante |
|---|---:|---:|---|
| JWT por cookie httpOnly | `{"200":2}` | 12ms | Cookie autentica rutas protegidas |
| Cookie de login segura | `{"200":1}` | 72ms | `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` |
| CORS permitido/no listado | `{"200":2}` | 3ms | Origen permitido reflejado; origen no listado sin CORS permisivo |
| RBAC no admin | `{"403":2}` | 7ms | MESERO no gestiona usuarios |
| Puertos directos sin token | `{"401":3}` | 12ms | Direct ports quedan protegidos por JWT |
| Payloads invalidos | `{"400":4}` | 8ms | Inputs invalidos no producen 2xx ni 5xx |
| Rate limit login | `{"401":2,"429":8}` | 69ms | Kong corta intentos tras el limite |

Reporte automatico final:

```text
stress-tests/reports/security-limits-2026-05-29T22-12-34-240Z.md
```

## Verificacion

- `npm exec nx build servicio-inventario`: OK.
- `npm run probar:seguridad`: OK, `7/7`.
- `npm run probar`: OK, `49/49`.
- RabbitMQ final: `0` en `messages_ready` y `messages_unacknowledged` para colas principales y DLQ.
