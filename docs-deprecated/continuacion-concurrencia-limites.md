# Continuacion: pruebas de concurrencia, limites y seguridad

## Estado alcanzado

- Se aplico el contrato estricto de eventos RabbitMQ:
  - Los consumers reciben payload de dominio directo con `@Payload()`.
  - Se elimino la compatibilidad con `DomainEventEnvelope`.
  - Se elimino el fallback `envelope.data ?? envelope`.
- El publisher RabbitMQ conserva el paquete de transporte de Nest `{ pattern, data }`, pero el payload que reciben los handlers es el dominio directo.
- Se agregaron pruebas unitarias para consumers relevantes.
- Se corrigieron carreras detectadas en `scripts/pruebas-integracion.ts`.
- Se valido el sistema con:
  - Build OK.
  - Tests unitarios OK.
  - `npm run poblar` OK.
  - `npm run probar` OK con `49/49`.
  - RabbitMQ sin mensajes pendientes ni `unacked` en colas principales y DLQ.
- Se commiteo y pusheo el hito en:
  - Rama: `codex/docker-green-baseline`
  - Commit: `04950fc` (`Enforce strict RabbitMQ event payloads`)
- El usuario indico que ya hizo merge del PR.

## Que hacer al iniciar la siguiente sesion

1. Actualizar la rama base local:

```powershell
git checkout main
git pull
```

2. Confirmar que el baseline sigue verde:

```powershell
npm run probar
```

3. Opcionalmente verificar RabbitMQ:

```powershell
docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
```

El resultado esperado es `0` en `messages_ready` y `messages_unacknowledged` para colas principales y DLQ.

4. Crear una rama nueva para la fase siguiente:

```powershell
git checkout -b codex/concurrency-limits-tests
```

## Siguiente fase recomendada

Continuar con `docs/plan-pruebas-funcionales-integracion-seguridad-concurrencia.md`.

Prioridad sugerida:

1. Pruebas de concurrencia.
2. Pruebas de limites.
3. Casos negativos de seguridad y autorizacion.

## Casos que conviene atacar primero

- Doble apertura simultanea de cuenta para la misma mesa.
- Doble reserva simultanea de la misma mesa/franja.
- Pedidos simultaneos contra stock bajo.
- Pagos duplicados o reintentos del mismo pago.
- Cierre de cuenta mientras hay pedidos/pagos en transito.
- Transiciones invalidas de estado en mesas, pedidos y cuentas.
- Validaciones de limites:
  - Cantidades en cero o negativas.
  - Montos invalidos.
  - IDs inexistentes.
  - Payloads incompletos.
  - Fechas de reserva invalidas.
- Seguridad:
  - Endpoints sin token.
  - Token invalido.
  - Usuario con rol insuficiente.
  - Acceso cruzado a recursos que no corresponden.

## Criterio de exito para la fase

- Las pruebas nuevas reproducen escenarios concurrentes reales.
- Los bugs encontrados quedan corregidos con validaciones, transacciones o restricciones idempotentes donde corresponda.
- `npm run probar` vuelve a quedar verde.
- RabbitMQ queda sin mensajes pendientes ni `unacked`.
- Se documenta el resultado en `docs/informe-pruebas.md` o en un informe nuevo de la fase.

