# Informe de concurrencia, limites y seguridad

Fecha: 2026-05-29
Rama: `codex/concurrency-limits-tests`
Baseline: `4f65c4a Merge pull request #2 from Marcos7PY/codex/docker-green-baseline`
Base URL: `http://localhost:8000`

## Alcance ejecutado

Se agrego y ejecuto `npm run probar:concurrencia`, que corre escenarios focalizados con datos reales descubiertos/creados por el sistema:

- C3: muchos pedidos simultaneos sobre la misma mesa.
- C7: reservas simultaneas para la misma fecha/hora.
- C5: pagos duplicados concurrentes sobre la misma cuenta.
- C6: pedidos simultaneos contra stock compartido bajo.
- S3/S4: autenticacion obligatoria, token invalido y validacion de cantidad cero.

## Hallazgo corregido

La primera corrida reprodujo overselling: 10 pedidos aceptados contra un producto con stock inicial 8. El stock final quedaba en 0, pero el sistema habia aceptado mas pedidos que unidades disponibles.

Correccion aplicada:

- `servicio-pedidos` ahora reserva/descuenta atomicamente su proyeccion local de stock dentro de la misma transaccion que crea el pedido.
- Si la proyeccion local no tiene stock suficiente, el pedido falla con `400`.
- El evento asincrono hacia inventario sigue actualizando la fuente principal y mantiene el drenaje por RabbitMQ.

Tambien se corrigio el build Docker para normalizar CRLF en `infra/entrypoint.sh` dentro de la imagen, evitando fallos de arranque en Alpine.

## Resultado final

Comando:

```powershell
$env:CONCURRENCY='8'
npm run probar:concurrencia
```

Resultado: `5/5` invariantes OK.

| Escenario | Status | p95 | Invariante |
|---|---:|---:|---|
| C3 misma mesa, muchos pedidos | `{"201":8}` | 179ms | 8 pedidos, 1 cuenta abierta, snapshot con 8 pedidos |
| C7 reservas mismo slot | `{"201":1,"409":7}` | 63ms | 1 reserva activa para la franja |
| C5 pago duplicado concurrente | `{"201":1,"400":7}` | 113ms | 1 transaccion y cuenta cerrada |
| C6 stock compartido | `{"201":8,"400":2}` | 169ms | exitos no exceden stock y stock final 0 |
| S3/S4 seguridad y limites | `{"400":1,"401":5}` | 9ms | rechazos esperados |

Reporte automatico final:

```text
stress-tests/reports/concurrency-limits-2026-05-29T21-33-25-301Z.md
```

## Verificacion

- `npm exec nx build servicio-pedidos`: OK.
- `npm run probar`: OK, `49/49`.
- RabbitMQ final: `0` en `messages_ready` y `messages_unacknowledged` para colas principales y DLQ.
- Docker Compose profile `all`: contenedores requeridos arriba; DBs, RabbitMQ, Kong, identidad y reportes healthy.
