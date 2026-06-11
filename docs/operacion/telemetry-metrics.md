# Exposición del endpoint `/telemetry/metrics` (T-41)

> Runbook de la nota de auditoría externa 2026-06-11 (hallazgo T-41, severidad baja).

## Qué es

Cada uno de los 9 servicios expone `GET /api/telemetry/metrics` (Prometheus
exposition format, vía `@willsoto/nestjs-prometheus`). El `JwtAuthGuard` compartido
lo excluye explícitamente de la autenticación (`jwt-auth.guard.ts`): **el endpoint es
anónimo a nivel de servicio por diseño**, porque el scraper de Prometheus no maneja
JWT de usuario.

## Por qué no es un agujero en producción

- **Kong lo bloquea externamente**: la ruta tiene `request-termination` y responde
  `404` a cualquier cliente que entre por el gateway. Solo el scrape interno de la
  red de Docker llega al endpoint.
- Las métricas no contienen PII: contadores/histogramas de negocio (pedidos,
  latencias) y métricas de proceso Node.

## Riesgo residual en desarrollo

En el compose de dev los puertos host `3001–3010` mapean directo a los servicios,
así que **cualquier equipo de la LAN puede leer las métricas** sin pasar por Kong.
Aceptado para dev; no exponer esos puertos fuera de redes de confianza.

## Mitigaciones opcionales (si el despliegue sale de una red confiable)

1. **Allowlist por IP interna**: limitar `/telemetry/metrics` a la IP/red del
   Prometheus (middleware o regla de red Docker).
2. **Token de scrape**: secreto estático compartido (`Authorization: Bearer <token>`
   configurado en `scrape_configs` de Prometheus) verificado por el guard antes de
   la exención.
3. **No publicar puertos de servicio** en el host en despliegues prod-like: el único
   punto de entrada debe ser Kong.

## Verificación rápida

```sh
# Desde fuera (vía Kong): debe responder 404
curl -i http://localhost:8000/api/telemetry/metrics

# Desde dentro de la red Docker (scrape): debe responder 200 con texto Prometheus
docker exec <contenedor-prometheus> wget -qO- http://servicio-pedidos:3000/api/telemetry/metrics | head
```
