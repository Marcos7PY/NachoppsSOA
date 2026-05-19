# Fix: Warnings de webpack y ajuste de noAck

## Warnings a resolver

### Warning 1 — Critical dependency: the request of a dependency is an expression

Viene de NestJS que usa `require()` dinámico para cargar adaptadores opcionales
(websockets, grpc, kafka, etc.). No es un bug, pero webpack lo reporta como warning.

**Fix en `apps/servicio-pedidos/webpack.config.js` y `apps/servicio-notificaciones/webpack.config.js`:**

Agregar `ignoreWarnings` al objeto de configuración de webpack para silenciar
estos warnings conocidos y esperados:

```javascript
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  // Silenciar warnings conocidos de dependencias opcionales de NestJS
  ignoreWarnings: [
    /Critical dependency: the request of a dependency is an expression/,
    /Failed to parse source map/,
  ],
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      externalDependencies: [
        'kafkajs',
        'mqtt',
        'nats',
        'ioredis',
        '@grpc/grpc-js',
        '@grpc/proto-loader',
        'class-validator',
        'class-transformer',
        '@nestjs/websockets',
        '@nestjs/websockets/socket-module',
        'file-type',
      ],
    }),
  ],
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
  },
};
```

Aplicar el mismo `ignoreWarnings` al `webpack.config.js` de `servicio-notificaciones`.
Ese archivo no tiene `TsconfigPathsPlugin` ni `externalDependencies`, mantener el resto igual
y solo agregar el `ignoreWarnings`.

---

### Warning 2 — Failed to parse source map de iterare

Ya cubierto con el regex `/Failed to parse source map/` en `ignoreWarnings` de arriba.
Es un bug del paquete `iterare` que publica source maps apuntando a archivos `.ts`
que no incluye en npm. No requiere otra acción.

---

## Fix: noAck: false requiere acknowledgment manual

En `apps/servicio-notificaciones/src/main.ts` tienes `noAck: false`, lo que significa
que RabbitMQ espera un acknowledgment explícito por cada mensaje. Si no se hace el ack,
el mensaje queda en estado "Unacked" y RabbitMQ lo reencola cuando el consumer se desconecta.

Hay dos opciones:

**Opción A (recomendada para este proyecto): usar `noAck: true`**

Más simple. RabbitMQ considera el mensaje entregado en cuanto lo envía.
Adecuado cuando la pérdida ocasional de un mensaje no es crítica (notificaciones UI, logs).

Cambiar en `apps/servicio-notificaciones/src/main.ts`:
```typescript
noAck: true,  // delivery automático, sin ack manual
```

**Opción B: mantener `noAck: false` y hacer ack manual en el handler**

Adecuado cuando cada mensaje debe procesarse garantizadamente (pagos, inventario).
Requiere inyectar el contexto RMQ en el controller:

```typescript
import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern('pedido.creado')
  async handlePedidoCreado(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`✅ Evento recibido: pedido.creado`);
      this.logger.log(` Datos: ${JSON.stringify(data)}`);
      // lógica de negocio aquí
      channel.ack(originalMsg);  // confirmar procesamiento exitoso
    } catch (error) {
      this.logger.error(`Error procesando pedido.creado`, error);
      channel.nack(originalMsg, false, true);  // reencolar en caso de error
    }
  }
}
```

**Para notificaciones, usar Opción B** porque es la forma correcta a largo plazo
y demuestra manejo robusto de mensajes. Si la lógica falla, el mensaje se reencola.

---

## Resumen de archivos a modificar

- `apps/servicio-pedidos/webpack.config.js` — agregar `ignoreWarnings`
- `apps/servicio-notificaciones/webpack.config.js` — agregar `ignoreWarnings`
- `apps/servicio-notificaciones/src/app/app.controller.ts` — agregar `@Ctx` y ack manual
- `apps/servicio-notificaciones/src/main.ts` — mantener `noAck: false` (para que funcione el ack manual)
