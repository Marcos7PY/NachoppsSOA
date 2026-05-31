# Librería Compartida: `@org/shared-rabbitmq`

**Ruta:** `libs/shared-rabbitmq`
**Responsabilidad:** Proveer una conexión global a RabbitMQ (vía `amqp-connection-manager`) y un servicio especializado para la publicación de eventos (`RabbitMQPublisherService`).

## Exportaciones Principales (`src/index.ts`)

### 1. `RabbitMQModule`
- **Archivo:** `libs/shared-rabbitmq/src/lib/rabbitmq.module.ts`
- **Firma:** `export class RabbitMQModule`
- **Funcionamiento paso a paso:**
  1. Define un método estático `forRoot(uri: string): DynamicModule`.
  2. Crea un provider `connectionProvider` inyectando el token `RABBITMQ_CONNECTION` y utilizando una *factory* que ejecuta `amqp.connect([uri])` (donde `uri` proviene de `process.env.RABBITMQ_URI`).
  3. Retorna el módulo configurado exportando `connectionProvider` y `RabbitMQPublisherService`, con la propiedad `global: true`.

### 2. `RabbitMQPublisherService`
- **Archivo:** `libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts`
- **Firma:** `export class RabbitMQPublisherService implements OnModuleInit`
- **Funcionamiento paso a paso:**
  1. En el constructor inyecta el `AmqpConnectionManager` mediante `@Inject(RABBITMQ_CONNECTION)`.
  2. En `onModuleInit()`, invoca `this.connection.createChannel()`. En el setup, asegura (assert) que el exchange `NACHOPPS_EXCHANGE` (proveniente de `@org/contracts`) de tipo `topic` y durable (`durable: true`) exista.
  3. Provee el método genérico `async publish<TPayload>(routingKey: RoutingKey, data: TPayload, producer?: string)`.
  4. Internamente invoca `createEventEnvelope` (de `@org/contracts`) para envolver el payload en la estructura estandarizada `DomainEventEnvelope`.
  5. Ejecuta `this.channelWrapper.publish(NACHOPPS_EXCHANGE, routingKey, envelope)` enviando el evento a RabbitMQ y loguea la publicación.

### 3. Constantes (`rabbitmq.constants.ts`)
- **Archivo:** `libs/shared-rabbitmq/src/lib/rabbitmq.constants.ts`
- **Exportaciones:**
  - `RABBITMQ_CONNECTION`: Token de inyección para el provider.
  - Re-exporta `NACHOPPS_EXCHANGE` desde `@org/contracts`.
