# Librería Compartida: `@org/resiliencia`

**Ruta:** `libs/resiliencia`
**Responsabilidad:** Proveer mecanismos de tolerancia a fallos, específicamente el patrón Circuit Breaker para peticiones salientes y estrategias de reintento para consumidores de RabbitMQ.

## Exportaciones Principales (`src/index.ts`)

### 1. `OrgResilienciaModule`
- **Archivo:** `libs/resiliencia/src/lib/resiliencia.module.ts`
- **Firma:** `export class OrgResilienciaModule {}`
- **Descripción:** Módulo base vacío. No exporta ni provee ningún servicio o interceptor globalmente. Las aplicaciones importan los interceptores/decoradores directamente.

### 2. `@CircuitBreakerOptions()`
- **Archivo:** `libs/resiliencia/src/lib/circuit-breaker.decorator.ts`
- **Firma:** `export function CircuitBreakerOptions(options?: CircuitBreaker.Options)`
- **Dependencias:** `opossum` (v9.0.0).
- **Funcionamiento paso a paso:**
  1. Actúa como un *Method Decorator*.
  2. Obtiene un nombre único combinando el nombre de la clase y el método (`target.constructor.name.propertyKey`).
  3. Establece opciones por defecto: `timeout: 3000`, `errorThresholdPercentage: 50`, `resetTimeout: 30000`, sobreescribiendo con las opciones provistas.
  4. En el primer llamado, instancia `new CircuitBreaker()` envolviendo el método original con `.bind(this)`.
  5. Escucha los eventos `open`, `halfOpen`, `close` y `fallback` para registrarlos en un `Logger('CircuitBreaker')`.
  6. Guarda la instancia en un registro global `CIRCUIT_BREAKER_REGISTRY`.
  7. Ejecuta `breaker.fire(...args)`.
- **Hallazgo:** Este decorador se usa en 2 servicios (`servicio-cuentas` y `servicio-caja`) para proteger llamadas HTTP salientes.

### 3. `RabbitMQRetryInterceptor`
- **Archivo:** `libs/resiliencia/src/lib/rabbitmq-retry.interceptor.ts`
- **Firma:** `export class RabbitMQRetryInterceptor implements NestInterceptor`
- **Funcionamiento paso a paso:**
  1. Verifica que el contexto sea `rpc` o `rmq`. Si no, continúa normalmente (`next.handle()`).
  2. Extrae el `channel` y el `originalMsg` de `RmqContext`.
  3. Configura `maxRetries = 3` e `initialDelay = 1000`.
  4. Si el manejador tiene éxito, intenta hacer `channel.ack(originalMsg)`.
  5. Si falla, usa `retryWhen` de RxJS:
     - Calcula el intento actual. Si supera `maxRetries`, loguea error fatal y ejecuta `channel.nack(originalMsg, false, false)` enviando el mensaje a una Dead Letter Queue (DLQ) sin reencolarlo. Retorna el error.
     - Si está dentro del límite, aplica *Backoff Exponencial* `delayMs = initialDelay * Math.pow(2, index)` (ej: 1000ms, 2000ms, 4000ms).
     - Loguea un warning y espera usando `timer(delayMs)` antes de reintentar el procesamiento.
