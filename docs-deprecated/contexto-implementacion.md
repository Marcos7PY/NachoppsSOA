# Contexto de Implementación — Nachopps


## Bloque 0 — Mensajería y contratos
### FILE: libs/contracts/src/messaging/envelope.ts
```typescript
/** Metadatos opcionales en eventos de dominio. */
export interface EventMetadata {
  correlationId?: string;
  occurredAt: string;
  producer?: string;
  idempotencyKey?: string;
}

/**
 * Formato estándar de mensaje NestJS RMQ + publicador interno.
 * @see ADR-004, ADR-007
 */
export interface DomainEventEnvelope<TPayload> {
  pattern: string;
  data: TPayload;
  metadata?: EventMetadata;
}

export function createEventEnvelope<TPayload>(
  pattern: string,
  data: TPayload,
  producer?: string,
): DomainEventEnvelope<TPayload> {
  return {
    pattern,
    data,
    metadata: {
      occurredAt: new Date().toISOString(),
      producer,
    },
  };
}

```

### FILE: libs/contracts/src/events/routing-keys.ts
```typescript
/**
 * Routing keys AMQP (topic). Convención: dominio.accion en minúsculas.
 * Nombres de evento de negocio (APF2) en PascalCase viven en tipos/payloads.
 */
export const RoutingKeys = {
  // Reservas
  ReservaCreada: 'reserva.creada',
  ReservaCancelada: 'reserva.cancelada',
  ReservaConfirmada: 'reserva.confirmada',

  // Mesas
  MesaCreada: 'mesa.creada',
  MesaActualizada: 'mesa.actualizada',
  MesaAsignada: 'mesa.asignada',
  MesaLiberada: 'mesa.liberada',

  // Pedidos
  PedidoCreado: 'pedido.creado',
  PedidoListo: 'pedido.listo',
  PedidoActualizado: 'pedido.actualizado',

  // Cuentas
  CuentaAbierta: 'cuenta.abierta',
  CuentaCerrada: 'cuenta.cerrada',
  TicketGenerado: 'ticket.generado',

  // Caja
  PagoRegistrado: 'pago.registrado',
  ArqueoRealizado: 'arqueo.realizado',

  // Inventario
  StockBajo: 'stock.bajo',
  StockDescontado: 'stock.descontado',
  ProductoCreado: 'producto.creado',
  ProductoActualizado: 'producto.actualizado',

  // Identidad
  UsuarioAutenticado: 'usuario.autenticado',
} as const;

export type RoutingKey = (typeof RoutingKeys)[keyof typeof RoutingKeys];

/** Binding de cola consumidor amplio (desarrollo / notificaciones). */
export const CONSUMER_BINDING_ALL_DOMAIN_EVENTS = '*.*' as const;

```

### FILE: libs/contracts/src/index.ts
```typescript
export * from './messaging/exchange';
export * from './messaging/envelope';
export * from './events/routing-keys';
export * from './domains/reservas';
export * from './domains/pedidos';
export * from './domains/mesas';
export * from './domains/cuentas';
export * from './domains/caja';
export * from './domains/inventario';
export * from './domains/identidad';

```

### FILE: libs/contracts/src/domains/pedidos.ts
```typescript
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, ValidateNested, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export const PedidoEstado = {
  Pendiente: 'PENDIENTE',
  EnPreparacion: 'EN_PREPARACION',
  Listo: 'LISTO',
  Entregado: 'ENTREGADO',
  Pagado: 'PAGADO',
  Cancelado: 'CANCELADO',
} as const;

export type PedidoEstado = (typeof PedidoEstado)[keyof typeof PedidoEstado];

export const ItemArea = {
  Cocina: 'COCINA',
  Bar: 'BAR',
} as const;

export type ItemArea = (typeof ItemArea)[keyof typeof ItemArea];

export class ModificadorItem {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsOptional()
  @IsNumber()
  precioExtra?: number;
}

export class PedidoItemDto {
  @IsOptional()
  @IsString()
  id?: string;
  @IsString()
  productoId: string;
  @IsString()
  nombre: string;
  @IsNumber()
  cantidad: number;
  @IsNumber()
  precioUnitario: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModificadorItem)
  modificadores?: ModificadorItem[];
  @IsOptional()
  @IsEnum(ItemArea)
  area?: ItemArea;
  @IsOptional()
  @IsString()
  notas?: string;
  @IsOptional()
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;
}

export class PedidoDto {
  @IsString()
  id: string;
  @IsString()
  mesaId: string;
  @IsOptional()
  @IsNumber()
  numeroMesa?: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];
  @IsNumber()
  total: number;
  @IsEnum(PedidoEstado)
  estado: PedidoEstado;
  @IsString()
  createdAt: string;
}

export class PedidoItemInput {
  @IsOptional()
  @IsString()
  id?: string;
  @IsString()
  @IsNotEmpty()
  productoId: string;
  @IsNumber()
  cantidad: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModificadorItem)
  modificadores?: ModificadorItem[];
  @IsOptional()
  @IsEnum(ItemArea)
  area?: ItemArea;
  @IsOptional()
  @IsString()
  notas?: string;
  @IsOptional()
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;
  @IsOptional()
  @IsNumber()
  identificadorComensal?: number;
}

export class CrearPedidoCommand {
  @IsString()
  @IsNotEmpty()
  mesaId: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PedidoItemInput)
  items: PedidoItemInput[];
}

export class ActualizarEstadoPedidoCommand {
  @IsEnum(PedidoEstado)
  estado: PedidoEstado;
}

export class PedidoCreadoPayload {
  @Type(() => PedidoDto)
  @ValidateNested()
  pedido: PedidoDto;
}

export class PedidoListoPayload {
  @IsString()
  pedidoId: string;
  @IsString()
  mesaId: string;
}

export class PedidoActualizadoPayload {
  @Type(() => PedidoDto)
  @ValidateNested()
  pedido: PedidoDto;
}

```

### FILE: libs/contracts/src/domains/cuentas.ts
```typescript
import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export const CuentaEstado = {
  Abierta: 'ABIERTA',
  Cerrada: 'CERRADA',
  Pagada: 'PAGADA',
} as const;

export type CuentaEstado = (typeof CuentaEstado)[keyof typeof CuentaEstado];

export class CuentaAbiertaPayload {
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
}

export class CuentaCerradaPayload {
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
  @IsNumber()
  total: number;
}

export class TicketGeneradoPayload {
  @IsString()
  ticketId: string;
  @IsString()
  cuentaId: string;
}

export class CuentaDto {
  @IsString()
  id: string;
  @IsString()
  mesaId: string;
  @IsArray()
  pedidos: any[]; // Se poblará con detalles de pedidos
  @IsNumber()
  total: number;
  @IsEnum(CuentaEstado)
  estado: CuentaEstado;
  @IsOptional()
  @IsString()
  ticket?: string | null;
  @IsString()
  createdAt: string;
  @IsString()
  updatedAt: string;
}

export class TicketDto {
  @IsString()
  id: string;
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
  @IsArray()
  items: any[];
  @IsNumber()
  subtotal: number;
  @IsNumber()
  descuento: number;
  @IsNumber()
  total: number;
  @IsString()
  fecha: string;
}

export class AbrirCuentaCommand {
  @IsString()
  mesaId: string;
}

export class CerrarCuentaCommand {
  @IsOptional()
  @IsNumber()
  descuento?: number;
}

export class DividirCuentaCommand {
  @IsString()
  metodo: 'IGUALES' | 'POR_ITEMS';
  @IsOptional()
  @IsNumber()
  numPartes?: number;
}

```

### FILE: libs/contracts/src/domains/inventario.ts
```typescript
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class StockBajoPayload {
  @IsString()
  productoId: string;
  @IsString()
  nombre: string;
  @IsNumber()
  stockActual: number;
  @IsNumber()
  stockMinimo: number;
}

export class StockDescontadoPayload {
  @IsString()
  productoId: string;
  @IsNumber()
  cantidad: number;
  @IsString()
  motivo: string;
}

export class CategoriaDto {
  @IsString()
  id: string;
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string | null;
}

export class CrearCategoriaCommand {
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class ProductoDto {
  @IsString()
  id: string;
  @IsString()
  categoriaId: string;
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string | null;
  @IsNumber()
  precio: number;
  @IsBoolean()
  disponible: boolean;
  @IsOptional()
  @IsNumber()
  stockActual?: number | null;
}

export class CrearProductoCommand {
  @IsString()
  categoriaId: string;
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string;
  @IsNumber()
  precio: number;
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
  @IsOptional()
  @IsNumber()
  stockActual?: number;
}

export class ProductoCreadoPayload {
  @IsString()
  id: string;
  @IsString()
  nombre: string;
  @IsNumber()
  precio: number;
  @IsOptional()
  @IsNumber()
  stockActual?: number | null;
  @IsOptional()
  @IsString()
  categoriaNombre?: string;
  @IsBoolean()
  disponible: boolean;
}

export class ProductoActualizadoPayload {
  @IsString()
  id: string;
  @IsString()
  nombre: string;
  @IsNumber()
  precio: number;
  @IsOptional()
  @IsNumber()
  stockActual?: number | null;
  @IsOptional()
  @IsString()
  categoriaNombre?: string;
  @IsBoolean()
  disponible: boolean;
}

```

### FILE: libs/contracts/src/domains/reservas.ts
```typescript
import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export const ReservaEstado = {
  Pendiente: 'PENDIENTE',
  Confirmada: 'CONFIRMADA',
  Cancelada: 'CANCELADA',
  Expirada: 'EXPIRADA',
} as const;

export type ReservaEstado = (typeof ReservaEstado)[keyof typeof ReservaEstado];

export class ReservaDto {
  @IsString()
  id: string;
  @IsString()
  clienteId: string;
  @IsString()
  clienteNombre: string;
  @IsString()
  clienteTelefono: string;
  @IsString()
  fecha: string;
  @IsString()
  hora: string;
  @IsOptional()
  @IsString()
  mesaPreferida?: string | null;
  @IsNumber()
  numComensales: number;
  @IsEnum(ReservaEstado)
  estado: ReservaEstado;
  @IsString()
  createdAt: string;
}

export class CrearReservaCommand {
  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ obj, value }) => value ?? obj.nombreCliente)
  clienteNombre?: string;

  @IsOptional()
  @IsString()
  clienteTelefono?: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsOptional()
  @IsString()
  mesaPreferida?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ obj, value }) => value ?? obj.personas)
  numComensales?: number;
}

export class ReservaCreadaPayload {
  @IsNotEmpty()
  reserva: ReservaDto;
}

export class ReservaCanceladaPayload {
  @IsString()
  reservaId: string;
  @IsOptional()
  @IsString()
  motivo?: string;
}

```

### FILE: libs/contracts/src/domains/identidad.ts
```typescript
import { IsEmail, IsString, IsEnum, IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export const RolUsuario = {
  Admin: 'ADMIN',
  Cajero: 'CAJERO',
  Cocina: 'COCINA',
  Mesero: 'MESERO',
  Recepcion: 'RECEPCION',
  Gerencia: 'GERENCIA',
  Sistema: 'SISTEMA',
} as const;

export type RolUsuario = (typeof RolUsuario)[keyof typeof RolUsuario];

/* ── DTOs ────────────────────────────────────────────── */

export class UsuarioDto {
  @IsString()
  id: string;

  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsBoolean()
  activo: boolean;

  @IsString()
  createdAt: string;
}

/* ── Commands ────────────────────────────────────────── */

export class LoginCommand {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CrearUsuarioCommand {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;
}

export class CambiarRolCommand {
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}

/* ── Responses ───────────────────────────────────────── */

export class LoginResponseDto {
  @IsString()
  access_token: string;
  
  usuario: Omit<UsuarioDto, 'activo' | 'createdAt'>;
}

/* ── Event payloads ──────────────────────────────────── */

export class UsuarioAutenticadoPayload {
  @IsString()
  userId: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsEmail()
  email: string;
}

```

### FILE: libs/shared-rabbitmq/src/lib/rabbitmq-publisher.service.ts
```typescript
import { Inject, Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import {
  createEventEnvelope,
  DomainEventEnvelope,
  NACHOPPS_EXCHANGE,
  RoutingKey,
} from '@org/contracts';
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';
import { context, propagation } from '@opentelemetry/api';

@Injectable()
export class RabbitMQPublisherService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQPublisherService.name);
  private channelWrapper!: amqp.ChannelWrapper;

  constructor(
    @Inject(RABBITMQ_CONNECTION)
    private readonly connection: amqp.AmqpConnectionManager,
    @Optional()
    @Inject('RABBITMQ_OPTIONS')
    private readonly options?: { queue?: string, bindings?: string[] }
  ) {}

  onModuleInit() {
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange('NACHOPPS_DLX', 'topic', { durable: true });
        this.logger.log(`Exchange "NACHOPPS_DLX" declarado`);

        await channel.assertExchange(NACHOPPS_EXCHANGE, 'topic', { durable: true });
        this.logger.log(`Exchange "${NACHOPPS_EXCHANGE}" declarado`);

        if (this.options?.queue && this.options?.bindings?.length) {
          const dlq = `dlq.${this.options.queue}`;
          await channel.assertQueue(dlq, { durable: true });
          await channel.bindQueue(dlq, 'NACHOPPS_DLX', dlq);

          await channel.assertQueue(this.options.queue, { 
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'NACHOPPS_DLX',
              'x-dead-letter-routing-key': dlq,
            }
          });
          
          for (const routingKey of this.options.bindings) {
            await channel.bindQueue(this.options.queue, NACHOPPS_EXCHANGE, routingKey);
            this.logger.log(`Cola "${this.options.queue}" atada a "${routingKey}"`);
          }
        }
      },
    });
  }

  async publish<TPayload>(
    routingKey: RoutingKey,
    data: TPayload,
    producer?: string,
  ): Promise<void> {
    const envelope: DomainEventEnvelope<TPayload> = createEventEnvelope(
      routingKey,
      data,
      producer,
    );

    const ctx = context.active();
    const carrier: Record<string, string> = {};
    propagation.inject(ctx, carrier);

    await this.channelWrapper.publish(NACHOPPS_EXCHANGE, routingKey, envelope, {
      headers: carrier
    });
    this.logger.log(`Evento publicado: ${routingKey}`);
  }
}

```

### FILE: libs/shared-rabbitmq/src/lib/rabbitmq.module.ts
```typescript
import { DynamicModule, Module } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';

export interface RabbitMQModuleOptions {
  uri: string;
  queue?: string;
  bindings?: string[];
}

@Module({})
export class RabbitMQModule {
  static forRoot(options: RabbitMQModuleOptions | string): DynamicModule {
    const uri = typeof options === 'string' ? options : options.uri;
    const queue = typeof options === 'string' ? undefined : options.queue;
    const bindings = typeof options === 'string' ? [] : (options.bindings || []);

    const connectionProvider = {
      provide: RABBITMQ_CONNECTION,
      useFactory: () => amqp.connect([uri]),
    };

    const optionsProvider = {
      provide: 'RABBITMQ_OPTIONS',
      useValue: { queue, bindings },
    };

    return {
      module: RabbitMQModule,
      providers: [connectionProvider, optionsProvider, RabbitMQPublisherService],
      exports: [connectionProvider, RabbitMQPublisherService],
      global: true,
    };
  }
}

```

### FILE: libs/shared-rabbitmq/src/lib/rabbitmq.constants.ts
```typescript
export { NACHOPPS_EXCHANGE } from '@org/contracts';

export const RABBITMQ_CONNECTION = 'RABBITMQ_CONNECTION';

```

### FILE: libs/shared-rabbitmq/src/index.ts
```typescript
export { RabbitMQModule } from './lib/rabbitmq.module';
export { RabbitMQPublisherService } from './lib/rabbitmq-publisher.service';
export { NACHOPPS_EXCHANGE, RABBITMQ_CONNECTION } from './lib/rabbitmq.constants';

```


### Formas a extraer
- **EventMetadata.idempotencyKey**: NO. El tipo `EventMetadata` en `envelope.ts` no incluye `idempotencyKey`.
- **Firma publish(...)**: 
  ```typescript
  async publish<TPayload>(
    routingKey: RoutingKey,
    data: TPayload,
    producer?: string,
  ): Promise<void>
  ```
  El `OutboxProcessor` lee el evento como un todo y ejecuta: `await this.rabbitmq.publish(event.routingKey as any, payload, 'servicio-X');`.

## Bloque 1 — servicio-cuentas
### FILE: apps/servicio-cuentas/src/app/app.service.ts
```typescript
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CuentaDto,
  TicketDto,
  AbrirCuentaCommand,
  CerrarCuentaCommand,
  DividirCuentaCommand,
  CuentaEstado,
  RoutingKeys,
  CuentaCerradaPayload,
  TicketGeneradoPayload,
  DomainEventEnvelope,
  PagoRegistradoPayload,
} from '@org/contracts';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async listarCuentas(): Promise<{ cuentas: CuentaDto[] }> {
    const cuentas = await this.prisma.cuenta.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return {
      cuentas: cuentas.map(c => ({
        id: c.id,
        mesaId: c.mesaId,
        pedidos: c.pedidos as any[],
        total: Number(c.total),
        estado: c.estado as CuentaEstado,
        ticket: c.ticket,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }))
    };
  }

  async abrirCuenta(command: AbrirCuentaCommand, origen: 'manual' | 'fallback' = 'manual'): Promise<{ message: string; cuenta: CuentaDto }> {
    const cuentaExistente = await this.prisma.cuenta.findFirst({
      where: { mesaId: command.mesaId, estado: CuentaEstado.Abierta }
    });

    if (cuentaExistente) {
      if (origen === 'fallback') {
        return { message: 'Cuenta ya existe.', cuenta: this.mapToDto(cuentaExistente) };
      }
      throw new BadRequestException('La mesa ya tiene una cuenta abierta.');
    }

    const cuenta = await this.prisma.$transaction(async (prisma) => {
      const c = await prisma.cuenta.create({
        data: {
          mesaId: command.mesaId,
          estado: CuentaEstado.Abierta,
          pedidos: [],
          total: 0
        }
      });

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.CuentaAbierta,
          payload: JSON.stringify({
            cuentaId: c.id,
            mesaId: c.mesaId,
            origen,
          }),
          status: 'PENDING',
        }
      });

      return c;
    });

    this.logger.log(`Cuenta abierta para la mesa ${command.mesaId} (origen: ${origen})`);
    return { message: 'Cuenta abierta exitosamente', cuenta: this.mapToDto(cuenta) };
  }

  async procesarPedidoCreado(envelope: DomainEventEnvelope<any>): Promise<void> {
    const payload = envelope.data ?? envelope;
    const pedidoDto = payload.pedido;
    if (!pedidoDto || !pedidoDto.mesaId) {
      this.logger.warn('PedidoCreado sin mesaId — ignorado');
      return;
    }

    let cuenta = await this.prisma.cuenta.findFirst({
      where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta }
    });

    if (!cuenta) {
      const resultado = await this.abrirCuenta({ mesaId: pedidoDto.mesaId }, 'fallback');
      cuenta = await this.prisma.cuenta.findUnique({ where: { id: resultado.cuenta.id } });
    }
    if (!cuenta) return;

    const snapshotActual = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];
    snapshotActual.push(pedidoDto);

    await this.prisma.cuenta.update({
      where: { id: cuenta.id },
      data: {
        total: { increment: pedidoDto.total },
        pedidos: snapshotActual as any
      },
    });
    this.logger.log(`Añadido pedido ${pedidoDto.id} a la cuenta ${cuenta.id}`);
  }

  async procesarPedidoActualizado(envelope: DomainEventEnvelope<any>): Promise<void> {
    const payload = envelope.data ?? envelope;
    const pedidoDto = payload.pedido;
    if (!pedidoDto || !pedidoDto.mesaId) return;

    const cuenta = await this.prisma.cuenta.findFirst({
      where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta }
    });
    if (!cuenta) return;

    const snapshotActual = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];
    const index = snapshotActual.findIndex((p: any) => p.id === pedidoDto.id);
    
    let deltaTotal = 0;
    if (index >= 0) {
      deltaTotal = pedidoDto.total - ((snapshotActual[index] as any).total || 0);
      snapshotActual[index] = pedidoDto;
    } else {
      deltaTotal = pedidoDto.total;
      snapshotActual.push(pedidoDto);
    }

    await this.prisma.cuenta.update({
      where: { id: cuenta.id },
      data: {
        total: { increment: deltaTotal },
        pedidos: snapshotActual as any
      },
    });
    this.logger.log(`Snapshot de pedido ${pedidoDto.id} actualizado en cuenta ${cuenta.id}`);
  }

  async procesarPagoRegistrado(envelope: DomainEventEnvelope<PagoRegistradoPayload>): Promise<void> {
    const payload = envelope.data ?? (envelope as unknown as PagoRegistradoPayload);

    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: payload.cuentaId },
    });

    if (!cuenta) {
      this.logger.warn(`Cuenta ${payload.cuentaId} no encontrada — ignorado`);
      return;
    }

    if (cuenta.estado !== CuentaEstado.Abierta) {
      this.logger.warn(
        `Cuenta ${payload.cuentaId} ya está ${cuenta.estado} — ignorado`
      );
      return;
    }

    await this.cerrarCuenta(cuenta.id, {});
    this.logger.log(
      `Cuenta ${cuenta.id} cerrada automáticamente por PagoRegistrado`
    );
  }

  async obtenerCuenta(id: string): Promise<CuentaDto> {
    const cuenta = await this.prisma.cuenta.findUnique({ where: { id } });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    return this.mapToDto(cuenta);
  }

  async obtenerCuentaPorMesa(mesaId: string): Promise<CuentaDto> {
    const cuenta = await this.prisma.cuenta.findFirst({
      where: { mesaId, estado: CuentaEstado.Abierta }
    });
    if (!cuenta) {
      throw new NotFoundException(`No hay cuenta abierta para la mesa ${mesaId}`);
    }
    return this.obtenerCuenta(cuenta.id);
  }

  async cerrarCuenta(id: string, command: CerrarCuentaCommand): Promise<{ message: string; ticket: TicketDto }> {
    const cuenta = await this.prisma.cuenta.findUnique({ where: { id } });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    if (cuenta.estado !== CuentaEstado.Abierta) {
      throw new BadRequestException(`La cuenta no está abierta. Estado actual: ${cuenta.estado}`);
    }

    const pedidos = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];

    if (pedidos.length === 0) {
      throw new BadRequestException('La cuenta no tiene pedidos.');
    }

    const subtotal = Number(cuenta.total);
    const descuento = command.descuento || 0;
    const total = Math.max(0, subtotal - descuento);
    const ticketId = uuidv4();

    const cuentaCerradaPayload: CuentaCerradaPayload = {
      cuentaId: id,
      mesaId: cuenta.mesaId,
      total,
    };
    
    const ticketGeneradoPayload: TicketGeneradoPayload = {
      ticketId,
      cuentaId: id,
    };

    await this.prisma.$transaction(async (prisma) => {
      await prisma.cuenta.update({
        where: { id },
        data: {
          estado: CuentaEstado.Cerrada,
          total,
          ticket: ticketId,
        }
      });

      await prisma.outboxEvent.createMany({
        data: [
          {
            routingKey: RoutingKeys.CuentaCerrada,
            payload: JSON.stringify(cuentaCerradaPayload),
            status: 'PENDING',
          },
          {
            routingKey: RoutingKeys.TicketGenerado,
            payload: JSON.stringify(ticketGeneradoPayload),
            status: 'PENDING',
          }
        ]
      });
    });

    const ticket: TicketDto = {
      id: ticketId,
      cuentaId: id,
      mesaId: cuenta.mesaId,
      items: pedidos.flatMap((p: any) => p.items || []),
      subtotal,
      descuento,
      total,
      fecha: new Date().toISOString()
    };

    this.logger.log(`Cuenta ${id} cerrada. Ticket ${ticketId} generado. Total: S/ ${total}`);

    return { message: 'Cuenta cerrada exitosamente', ticket };
  }

  async dividirCuenta(id: string, command: DividirCuentaCommand): Promise<any> {
    const cuenta = await this.obtenerCuenta(id);
    const pedidos = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];

    if (!pedidos || pedidos.length === 0) {
      throw new BadRequestException('La cuenta no tiene pedidos para dividir.');
    }

    if (command.metodo === 'IGUALES') {
      const numPartes = command.numPartes || 1;
      const montoPorParte = cuenta.total / numPartes;
      return {
        metodo: 'IGUALES',
        partes: Array(numPartes).fill(0).map((_, i) => ({
          parte: i + 1,
          monto: montoPorParte
        }))
      };
    }

    if (command.metodo === 'POR_ITEMS') {
      const partes: Record<number, number> = {};
      const allItems = pedidos.flatMap((p: any) => p.items || []);
      allItems.forEach(item => {
        const comensal = item.comensal || 1;
        const subtotal = Number(item.precioUnitario) * item.cantidad;
        partes[comensal] = (partes[comensal] || 0) + subtotal;
      });

      return {
        metodo: 'POR_ITEMS',
        partes: Object.entries(partes).map(([comensal, monto]) => ({
          comensal: Number(comensal),
          monto
        }))
      };
    }

    throw new BadRequestException('Método de división no soportado');
  }

  private mapToDto(c: any): CuentaDto {
    return {
      id: c.id,
      mesaId: c.mesaId,
      pedidos: typeof c.pedidos === 'string' ? JSON.parse(c.pedidos) : c.pedidos,
      total: Number(c.total),
      estado: c.estado as CuentaEstado,
      ticket: c.ticket,
      createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}

```

### FILE: apps/servicio-cuentas/src/app/app.controller.ts
```typescript
import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AbrirCuentaCommand,
  CerrarCuentaCommand,
  DividirCuentaCommand
} from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    return { status: 'OK', service: 'Cuentas' };
  }

  @Post()
  abrirCuenta(@Body() command: AbrirCuentaCommand) {
    return this.appService.abrirCuenta(command);
  }

  @Get('mesa/:mesaId')
  obtenerCuentaPorMesa(@Param('mesaId', ParseUUIDPipe) mesaId: string) {
    return this.appService.obtenerCuentaPorMesa(mesaId);
  }

  @Get(':id')
  obtenerCuenta(@Param('id', ParseUUIDPipe) id: string) {
    return this.appService.obtenerCuenta(id);
  }

  @Post(':id/dividir')
  dividirCuenta(@Param('id', ParseUUIDPipe) id: string, @Body() command: DividirCuentaCommand) {
    return this.appService.dividirCuenta(id, command);
  }

  @Post(':id/cerrar')
  cerrarCuenta(@Param('id', ParseUUIDPipe) id: string, @Body() command: CerrarCuentaCommand) {
    return this.appService.cerrarCuenta(id, command);
  }
}

```

### FILE: apps/servicio-cuentas/src/app/events.controller.ts
```typescript
import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DomainEventEnvelope, RoutingKeys, PagoRegistradoPayload } from '@org/contracts';
import { AppService } from './app.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {

  constructor(
    private readonly appService: AppService,
  ) {}

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ): Promise<void> {
    await this.appService.procesarPedidoCreado(envelope);
  }

  @EventPattern(RoutingKeys.PedidoActualizado)
  async handlePedidoActualizado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ): Promise<void> {
    await this.appService.procesarPedidoActualizado(envelope);
  }

  @EventPattern(RoutingKeys.PagoRegistrado)
  async handlePagoRegistrado(
    @Payload() envelope: DomainEventEnvelope<PagoRegistradoPayload>,
  ): Promise<void> {
    await this.appService.procesarPagoRegistrado(envelope);
  }
}

```

### FILE: apps/servicio-cuentas/src/app/outbox.processor.ts
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, 'servicio-cuentas');
          
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          
          this.logger.debug(`Evento ${event.id} publicado exitosamente`);
        } catch (error) {
          this.logger.error(`Error publicando evento ${event.id}:`, error);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'FAILED' },
          });
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

```

### FILE: apps/servicio-cuentas/src/app/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { OutboxProcessor } from './outbox.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
      queue: 'cuentas_queue',
      bindings: ['pedido.creado', 'pedido.actualizado', 'pago.registrado']
    })
  ],
  controllers: [AppController, EventsController],
  providers: [
    AppService,
    OutboxProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

```

### FILE: apps/servicio-cuentas/src/main.ts
```typescript
import { initTracing } from '@org/observabilidad';
initTracing('servicio-cuentas');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'],
      queue: 'cuentas_queue',
      queueOptions: { 
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'NACHOPPS_DLX',
          'x-dead-letter-routing-key': 'dlq.cuentas_queue'
        }
      },
      exchange: 'nachopps_exchange',
      exchangeType: 'topic',
      noAck: false,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Cuentas')
    .setDescription('Gestión de cuentas por mesa, división y cierre')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  const port = process.env.PORT || 3005;
  await app.listen(port);
  Logger.log(`🚀 Servicio Cuentas corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

```

### FILE: apps/servicio-cuentas/prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum CuentaEstado {
  ABIERTA
  CERRADA
  PAGADA
}

model Cuenta {
  id        String       @id @default(uuid())
  mesaId    String
  pedidos   Json
  total     Float        @default(0)
  estado    CuentaEstado @default(ABIERTA)
  ticket    String?
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  
  @@index([mesaId, estado])
  @@map("cuentas")
}

model OutboxEvent {
  id         String   @id @default(uuid())
  routingKey String
  payload    String
  status     String   @default("PENDING") // PENDING, PROCESSED, FAILED
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([status, createdAt])
  @@map("outbox_events")
}

```

### PrismaService de cuentas
Comando: `Get-ChildItem -Path "apps/servicio-cuentas/src" -Filter "prisma.service.ts" -Recurse | Select-Object -ExpandProperty FullName`
```text
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-cuentas\src\prisma\prisma.service.ts
```

### FILE: apps/servicio-cuentas/src/prisma/prisma.service.ts
```typescript
import { Injectable, INestApplication } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { createBasePrismaService } from '@org/shared-prisma';

const BasePrisma = createBasePrismaService(PrismaClient);

@Injectable()
export class PrismaService extends BasePrisma {
  protected readonly serviceName = 'servicio-cuentas';

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}

```


### Formas a extraer
- **Payload CuentaAbierta**: `{ cuentaId: c.id, mesaId: c.mesaId, origen }` (`apps/servicio-cuentas/src/app/app.service.ts:65`)
- **Payload CuentaCerrada**: `{ cuentaId: id, mesaId: cuenta.mesaId, total }` (`...:212`)
- **Payload TicketGenerado**: `{ ticketId, cuentaId: id }` (`...:218`)
- **Shape de CuentaDto y mapToDto**:
  ```typescript
  private mapToDto(c: any): CuentaDto {
    return {
      id: c.id,
      mesaId: c.mesaId,
      pedidos: typeof c.pedidos === 'string' ? JSON.parse(c.pedidos) : c.pedidos,
      total: Number(c.total),
      estado: c.estado as CuentaEstado,
      ticket: c.ticket,
      createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
  ```
- **¿procesarPedidoActualizado reescribe snapshot[index] = pedidoDto?**: SÍ. `snapshotActual[index] = pedidoDto;` (`apps/servicio-cuentas/src/app/app.service.ts:131`)

## Bloque 2 — servicio-inventario
### FILE: apps/servicio-inventario/src/app/app.service.ts
```typescript
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CategoriaDto, 
  ProductoDto, 
  CrearCategoriaCommand, 
  CrearProductoCommand,
  RoutingKeys,
  ProductoCreadoPayload,
  ProductoActualizadoPayload,
} from '@org/contracts';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): { message: string; service: string } {
    return { message: 'Servicio de Inventario activo', service: 'servicio-inventario' };
  }

  // --- CATEGORÍAS ---

  async listarCategorias(): Promise<{ categorias: CategoriaDto[] }> {
    const categorias = await this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }
    });
    return { categorias };
  }

  async crearCategoria(command: CrearCategoriaCommand): Promise<{ message: string; categoria: CategoriaDto }> {
    const categoria = await this.prisma.categoria.create({
      data: {
        nombre: command.nombre,
        descripcion: command.descripcion,
      }
    });
    return { message: 'Categoría creada exitosamente', categoria };
  }

  // --- PRODUCTOS ---

  async listarProductos(categoriaId?: string): Promise<{ productos: ProductoDto[] }> {
    const where = categoriaId ? { categoriaId } : {};
    const productos = await this.prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: { nombre: 'asc' }
    });
    return { productos: productos as unknown as ProductoDto[] };
  }

  async obtenerProducto(id: string): Promise<ProductoDto> {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { categoria: true }
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async obtenerProductosLote(ids: string[]): Promise<{ productos: ProductoDto[] }> {
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: ids } },
      include: { categoria: true },
    });
    return { productos: productos as unknown as ProductoDto[] };
  }

  async crearProducto(command: CrearProductoCommand): Promise<{ message: string; producto: ProductoDto }> {
    const categoria = await this.prisma.categoria.findUnique({ where: { id: command.categoriaId } });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${command.categoriaId} no encontrada`);
    }

    const producto = await this.prisma.$transaction(async (prisma) => {
      const p = await prisma.producto.create({
        data: {
          categoriaId: command.categoriaId,
          nombre: command.nombre,
          descripcion: command.descripcion,
          precio: command.precio,
          disponible: command.disponible ?? true,
          stockActual: command.stockActual ?? null,
        }
      });

      const payload: ProductoCreadoPayload = {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        stockActual: p.stockActual,
        categoriaNombre: categoria.nombre,
        disponible: p.disponible,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ProductoCreado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        }
      });

      return p;
    });
    
    return { message: 'Producto creado exitosamente', producto };
  }

  async actualizarStock(id: string, cantidad: number): Promise<{ message: string; producto: ProductoDto }> {
    const producto = await this.prisma.producto.findUnique({ where: { id }, include: { categoria: true } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const stockBase = producto.stockActual ?? 0;
    const nuevoStock = Math.max(0, stockBase + cantidad);

    const actualizado = await this.prisma.$transaction(async (prisma) => {
      const p = await prisma.producto.update({
        where: { id },
        data: { stockActual: nuevoStock }
      });

      const payload: ProductoActualizadoPayload = {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        stockActual: p.stockActual,
        categoriaNombre: producto.categoria?.nombre,
        disponible: p.disponible,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ProductoActualizado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        }
      });

      return p;
    });

    return { message: 'Stock actualizado', producto: actualizado };
  }

  async reducirStockAutomatico(id: string, cantidad: number): Promise<void> {
    const producto = await this.prisma.producto.findUnique({ where: { id }, include: { categoria: true } });
    
    if (!producto) {
      this.logger.warn(`Producto ${id} no encontrado para reducción de stock`);
      return;
    }

    if (producto.stockActual === null) {
      return;
    }

    const actualizado = await this.prisma.producto.updateMany({
      where: {
        id,
        stockActual: { gte: cantidad }
      },
      data: { 
        stockActual: { decrement: cantidad }
      }
    });

    if (actualizado.count === 0) {
      this.logger.warn(`Stock insuficiente para producto ${id} — no se pudo decrementar ${cantidad}`);
      return;
    }

    const productoDespues = await this.prisma.producto.findUnique({ where: { id } });
    if (productoDespues && productoDespues.stockActual === 0 && productoDespues.disponible) {
      await this.prisma.producto.update({
        where: { id },
        data: { disponible: false }
      });
    }

    await this.prisma.outboxEvent.create({
      data: {
        routingKey: RoutingKeys.ProductoActualizado,
        payload: JSON.stringify({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          stockActual: productoDespues?.stockActual,
          categoriaNombre: producto.categoria?.nombre,
          disponible: productoDespues?.disponible ?? producto.disponible,
        } satisfies ProductoActualizadoPayload),
        status: 'PENDING',
      }
    });

    this.logger.log(`Stock reducido para ${productoDespues?.nombre ?? id}: -> ${productoDespues?.stockActual}`);
  }
}

```

### FILE: apps/servicio-inventario/src/app/app.controller.ts
```typescript
import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CrearCategoriaCommand, CrearProductoCommand } from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getHello();
  }

  // --- CATEGORÍAS ---

  @Get('categorias')
  listarCategorias() {
    return this.appService.listarCategorias();
  }

  @Post('categorias')
  crearCategoria(@Body() body: CrearCategoriaCommand) {
    return this.appService.crearCategoria(body);
  }

  // --- PRODUCTOS ---

  @Get('productos')
  listarProductos(@Query('categoriaId') categoriaId?: string) {
    return this.appService.listarProductos(categoriaId);
  }

  @Get('productos/:id')
  obtenerProducto(@Param('id') id: string) {
    return this.appService.obtenerProducto(id);
  }

  @Post('productos/lote')
  obtenerProductosLote(@Body('ids') ids: string[]) {
    return this.appService.obtenerProductosLote(ids);
  }

  @Post('productos')
  crearProducto(@Body() body: CrearProductoCommand) {
    return this.appService.crearProducto(body);
  }

  @Patch('productos/:id/stock')
  actualizarStock(@Param('id') id: string, @Body('stock') stock: number) {
    return this.appService.actualizarStock(id, stock);
  }
}

```

### FILE: apps/servicio-inventario/src/app/events.controller.ts
```typescript
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DomainEventEnvelope, RoutingKeys } from '@org/contracts';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ) {
    const payload = envelope.data ?? envelope;
    
    const pedido = payload.pedido ?? payload;
    
    if (!pedido.items || !Array.isArray(pedido.items)) {
      this.logger.warn('PedidoCreado sin items. Ignorando.');
      return;
    }

    this.logger.log(`Procesando pedido.creado con ${pedido.items.length} items`);
    
    for (const item of pedido.items) {
      if (item.productoId && item.cantidad) {
        await this.appService.reducirStockAutomatico(item.productoId, item.cantidad);
        this.logger.log(`Stock reducido: ${item.productoId} (-${item.cantidad})`);
      }
    }
  }
}

```

### FILE: apps/servicio-inventario/src/app/outbox.processor.ts
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, 'servicio-inventario');
          
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          
          this.logger.debug(`Evento ${event.id} publicado exitosamente`);
        } catch (error) {
          this.logger.error(`Error publicando evento ${event.id}:`, error);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'FAILED' },
          });
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

```

### FILE: apps/servicio-inventario/src/app/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { OutboxProcessor } from './outbox.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
      queue: 'inventario_queue',
      bindings: ['pedido.creado']
    }),
  ],
  controllers: [AppController, EventsController],
  providers: [
    AppService,
    OutboxProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

```

### FILE: apps/servicio-inventario/src/main.ts
```typescript
import { initTracing } from '@org/observabilidad';
initTracing('servicio-inventario');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672'],
      queue: 'inventario_queue',
      queueOptions: { 
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'NACHOPPS_DLX',
          'x-dead-letter-routing-key': 'dlq.inventario_queue'
        }
      },
      exchange: 'nachopps_exchange',
      exchangeType: 'topic',
      noAck: false,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Inventario')
    .setDescription('Productos, categorías, stock y validación por lote')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  const port = process.env.PORT || 3007;
  await app.listen(port);
  Logger.log(`🚀 Servicio Inventario corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

```

### FILE: apps/servicio-inventario/prisma/schema.prisma
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
  output          = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Categoria {
  id          String     @id @default(uuid())
  nombre      String
  descripcion String?
  productos   Producto[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("categorias")
}

model Producto {
  id          String    @id @default(uuid())
  categoriaId String
  categoria   Categoria @relation(fields: [categoriaId], references: [id])
  nombre      String
  descripcion String?
  precio      Float
  disponible  Boolean   @default(true)
  stockActual Int?      
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([categoriaId])
  @@map("productos")
}

model OutboxEvent {
  id         String   @id @default(uuid())
  routingKey String
  payload    String
  status     String   @default("PENDING")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([status, createdAt])
  @@map("outbox_events")
}

```

### FILE: apps/servicio-inventario/src/prisma/prisma.service.ts
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { createBasePrismaService } from '@org/shared-prisma';

const BasePrisma = createBasePrismaService(PrismaClient);

@Injectable()
export class PrismaService extends BasePrisma {
  protected readonly serviceName = 'servicio-inventario';
}

```


### Formas a extraer
- **Payload ProductoCreado**: `{ id, nombre, precio, stockActual, categoriaNombre, disponible }` (`apps/servicio-inventario/src/app/app.service.ts:89`)
- **Payload ProductoActualizado**: Ídem que ProductoCreado. (`...:125`)
- **Handler de PedidoCreado**:
  ```typescript
  for (const item of pedido.items) {
    if (item.productoId && item.cantidad) {
      await this.appService.reducirStockAutomatico(item.productoId, item.cantidad);
    }
  }
  ```
  NO extrae ni incluye `pedido.id`. Solo extrae `items`.
- **Shape de ProductoDto**: Se usa implicitamente el tipo de Prisma `Producto`.

## Bloque 3 — servicio-pedidos
### FILE: apps/servicio-pedidos/src/app/app.service.ts
```typescript
import { Injectable, NotFoundException, BadRequestException, Logger, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { 
  PedidoDto, 
  CrearPedidoCommand,
  ActualizarEstadoPedidoCommand,
  PedidoItemInput,
  PedidoEstado,
  ItemArea,
  RoutingKeys,
  PagoRegistradoPayload
} from '@org/contracts';
import axios from 'axios';
import {
  PedidoItemMapeado,
  MesaLocalEntity,
  PedidoEntity,
} from './types';

interface ProductoRemotoLote {
  id: string;
  nombre: string;
  precio: number;
  stockActual: number | null;
  categoria?: { nombre: string } | null;
  disponible: boolean;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly HTTP_TIMEOUT_MS = 5000;
  private readonly INVENTARIO_URL =
    process.env['INVENTARIO_SERVICE_URL'] ?? 'http://servicio-inventario:3000/api';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async crearPedido(command: CrearPedidoCommand): Promise<{ message: string; pedido: PedidoDto }> {
    const mesaLocal = await this.validarMesa(command.mesaId);
    const itemsProcesados = await this.validarYMapearItems(command.items);
    const total = this.calcularTotal(itemsProcesados);
    const pedido = await this.persistirPedido(command.mesaId, mesaLocal.numero, itemsProcesados, total);

    this.logger.log(`Pedido ${pedido.id} creado con eventos en Outbox`);
    return { 
      message: 'Pedido creado exitosamente', 
      pedido: this.mapToDto(pedido) 
    };
  }

  private async validarMesa(mesaId: string): Promise<MesaLocalEntity> {
    const mesa = await this.prisma.mesaLocal.findUnique({ where: { id: mesaId } });
    if (!mesa) {
      throw new NotFoundException(`La mesa con ID ${mesaId} no existe o no está sincronizada.`);
    }
    return mesa;
  }

  private async asegurarProductosLocales(productoIds: string[]): Promise<void> {
    const existentes = await this.prisma.productoLocal.findMany({
      where: { id: { in: productoIds } }
    });
    const existentesIds = new Set(existentes.map(p => p.id));
    const faltantes = productoIds.filter(id => !existentesIds.has(id));

    if (faltantes.length > 0) {
      this.logger.warn(`Cold-start: ${faltantes.length} productos no están en proyección local, cargando desde inventario`);
      let token: string;
      try {
        token = this.jwtService.sign(
          { sub: 'servicio-pedidos', email: 'pedidos@internal', rol: 'SISTEMA' },
          { expiresIn: '1h' },
        );
      } catch {
        throw new ServiceUnavailableException('No se pudo generar token para inventario. Reintente.');
      }

      try {
        const { data } = await axios.post<ProductoRemotoLote[]>(
          `${this.INVENTARIO_URL}/productos/lote`,
          { ids: faltantes },
          {
            timeout: this.HTTP_TIMEOUT_MS,
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const productos = Array.isArray(data) ? data : (data as any).productos ?? [];
        for (const p of productos) {
          await this.prisma.productoLocal.upsert({
            where: { id: p.id },
            create: {
              id: p.id,
              nombre: p.nombre,
              precio: p.precio,
              stockActual: p.stockActual ?? null,
              categoriaNombre: p.categoria?.nombre ?? 'COCINA',
              disponible: p.disponible ?? true,
            },
            update: {
              nombre: p.nombre,
              precio: p.precio,
              stockActual: p.stockActual ?? null,
              categoriaNombre: p.categoria?.nombre ?? 'COCINA',
              disponible: p.disponible ?? true,
            },
          });
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number }; code?: string; message?: string };
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          throw new ServiceUnavailableException('El servicio de inventario no responde. Reintente.');
        }
        if (axiosError.code === 'ECONNREFUSED') {
          throw new ServiceUnavailableException('El servicio de inventario no está disponible.');
        }
        this.logger.error(`Error en cold-start de productos: ${axiosError.message}`);
        throw new InternalServerErrorException('No se pudieron cargar productos desde inventario. Reintente.');
      }
    }
  }

  private async validarYMapearItems(itemsToProcess: PedidoItemInput[]): Promise<PedidoItemMapeado[]> {
    const ids = itemsToProcess.map(i => i.productoId);
    await this.asegurarProductosLocales(ids);

    const productos = await this.prisma.productoLocal.findMany({
      where: { id: { in: ids } }
    });
    const mapa = new Map(productos.map(p => [p.id, p]));

    return itemsToProcess.map(item => {
      const p = mapa.get(item.productoId);
      if (!p) throw new NotFoundException(`Producto ${item.productoId} no encontrado`);
      if (item.cantidad < 1) {
        throw new BadRequestException(`La cantidad para ${p.nombre} debe ser al menos 1.`);
      }
      if (p.stockActual !== null && p.stockActual < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${p.nombre}. Disponible: ${p.stockActual}`);
      }

      return {
        productoId: p.id,
        nombre: p.nombre,
        cantidad: item.cantidad,
        precioUnitario: Number(p.precio),
        area: p.categoriaNombre?.toLowerCase().includes('bebida') ? 'BAR' : 'COCINA',
        notas: item.notas,
        comensal: item.identificadorComensal || 1,
        modificadores: item.modificadores || [],
      } satisfies PedidoItemMapeado;
    });
  }

  private calcularTotal(items: PedidoItemMapeado[]): number {
    return items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
  }

  private async persistirPedido(mesaId: string, numeroMesa: number, items: PedidoItemMapeado[], total: number): Promise<PedidoEntity> {
    return this.prisma.$transaction(async (prisma) => {
      const pedido = await prisma.pedido.create({
        data: {
          mesaId,
          numeroMesa,
          estado: PedidoEstado.Pendiente,
          total,
          items: {
            create: items.map(item => ({
              productoId: item.productoId,
              nombre: item.nombre,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              area: item.area,
              notas: item.notas,
              comensal: item.comensal,
              modificadores: {
                create: item.modificadores.map(m => ({
                  nombre: m.nombre,
                  precioExtra: m.precioExtra || 0
                }))
              }
            }))
          }
        },
        include: {
          items: {
            include: { modificadores: true }
          }
        }
      });

      const pedidoDto = this.mapToDto(pedido);

      await prisma.outboxEvent.createMany({
        data: [
          {
            routingKey: RoutingKeys.PedidoCreado,
            payload: JSON.stringify({ pedido: pedidoDto }),
            status: 'PENDING',
          },
          {
            routingKey: RoutingKeys.PedidoActualizado,
            payload: JSON.stringify({ pedido: pedidoDto }),
            status: 'PENDING',
          }
        ]
      });

      return pedido;
    });
  }


  async listarPedidos(mesaId?: string): Promise<{ pedidos: PedidoDto[] }> {
    const where = mesaId ? { mesaId } : {};
    const pedidos = await this.prisma.pedido.findMany({
      where,
      include: {
        items: {
          include: { modificadores: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { pedidos: pedidos.map(p => this.mapToDto(p)) };
  }

  async actualizarEstado(id: string, command: ActualizarEstadoPedidoCommand): Promise<{ message: string; pedido: PedidoDto }> {
    const pedido = await this.prisma.$transaction(async (prisma) => {
      const p = await prisma.pedido.update({
        where: { id },
        data: { estado: command.estado },
        include: { items: { include: { modificadores: true } } }
      });

      const pedidoDto = this.mapToDto(p);
      const outboxData: Array<{ routingKey: string; payload: string; status: string }> = [];

      if (command.estado === PedidoEstado.Listo) {
        outboxData.push({
          routingKey: RoutingKeys.PedidoListo,
          payload: JSON.stringify({
            pedidoId: p.id,
            mesaId: p.mesaId,
          }),
          status: 'PENDING',
        });
      }

      outboxData.push({
        routingKey: RoutingKeys.PedidoActualizado,
        payload: JSON.stringify({ pedido: pedidoDto }),
        status: 'PENDING',
      });

      await prisma.outboxEvent.createMany({ data: outboxData });

      return p;
    });

    return { message: 'Estado del pedido actualizado', pedido: this.mapToDto(pedido) };
  }

  async actualizarEstadoItem(itemId: string, command: ActualizarEstadoPedidoCommand): Promise<{ message: string }> {
    return this.prisma.$transaction(async (prisma) => {
      const item = await prisma.pedidoItem.update({
        where: { id: itemId },
        data: { estado: command.estado }
      });

      const pedidoId = item.pedidoId;
      const allItems = await prisma.pedidoItem.findMany({ where: { pedidoId } });
      
      const isOrderReady = allItems.every(i => i.estado === PedidoEstado.Listo || i.estado === PedidoEstado.Entregado);
      
      if (isOrderReady) {
        await prisma.pedido.update({
          where: { id: pedidoId },
          data: { estado: PedidoEstado.Listo }
        });

        const pedidoCompleto = await prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { items: { include: { modificadores: true } } }
        });

        if (pedidoCompleto) {
          await prisma.outboxEvent.createMany({
            data: [
              {
                routingKey: RoutingKeys.PedidoListo,
                payload: JSON.stringify({
                  pedidoId: pedidoId,
                  mesaId: pedidoCompleto.mesaId,
                }),
                status: 'PENDING',
              },
              {
                routingKey: RoutingKeys.PedidoActualizado,
                payload: JSON.stringify({ pedido: this.mapToDto(pedidoCompleto) }),
                status: 'PENDING',
              }
            ]
          });
        }
      } else {
        const pedido = await prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { items: { include: { modificadores: true } } }
        });
        if (pedido) {
          await prisma.outboxEvent.create({
            data: {
              routingKey: RoutingKeys.PedidoActualizado,
              payload: JSON.stringify({ pedido: this.mapToDto(pedido) }),
              status: 'PENDING',
            }
          });
        }
      }

      return { message: 'Estado del ítem actualizado exitosamente' };
    });
  }

  async upsertMesaLocal(mesa: { id: string; numero: number }): Promise<void> {
    await this.prisma.mesaLocal.upsert({
      where: { id: mesa.id },
      update: { numero: mesa.numero },
      create: { id: mesa.id, numero: mesa.numero }
    });
  }

  async upsertProductoLocal(producto: {
    id: string;
    nombre: string;
    precio: number;
    stockActual: number | null;
    categoriaNombre: string;
    disponible: boolean;
  }): Promise<void> {
    await this.prisma.productoLocal.upsert({
      where: { id: producto.id },
      update: {
        nombre: producto.nombre,
        precio: producto.precio,
        stockActual: producto.stockActual,
        categoriaNombre: producto.categoriaNombre,
        disponible: producto.disponible,
      },
      create: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stockActual: producto.stockActual,
        categoriaNombre: producto.categoriaNombre,
        disponible: producto.disponible,
      },
    });
  }

  private mapToDto(p: PedidoEntity): PedidoDto {
    return {
      id: p.id,
      mesaId: p.mesaId,
      numeroMesa: p.numeroMesa ?? undefined,
      estado: p.estado as PedidoEstado,
      total: Number(p.total),
      createdAt: p.createdAt.toISOString(),
      items: p.items.map(i => ({
        id: i.id,
        productoId: i.productoId,
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: Number(i.precioUnitario),
        area: (i.area as ItemArea) ?? undefined,
        notas: i.notas ?? undefined,
        estado: i.estado as PedidoEstado,
        modificadores: i.modificadores.map(m => ({
          nombre: m.nombre,
          precioExtra: Number(m.precioExtra)
        }))
      }))
    };
  }

  async procesarPagoRecibido(payload: PagoRegistradoPayload): Promise<void> {
    this.logger.log(`Procesando pago recibido para cuenta ${payload.cuentaId} y mesa ${payload.mesaId}`);
    
    const pedidos = await this.prisma.pedido.findMany({
      where: { mesaId: payload.mesaId, estado: { notIn: [PedidoEstado.Pagado, PedidoEstado.Cancelado] } }
    });

    for (const pedido of pedidos) {
      await this.prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          estado: PedidoEstado.Pagado,
        },
      });
    }
  }
}

```

### FILE: apps/servicio-pedidos/src/app/outbox.processor.ts
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, 'servicio-pedidos');
          
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          
          this.logger.debug(`Evento ${event.id} publicado exitosamente`);
        } catch (error) {
          this.logger.error(`Error publicando evento ${event.id}:`, error);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'FAILED' },
          });
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

```

### FILE: apps/servicio-pedidos/prisma/schema.prisma
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
  output          = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum PedidoEstado {
  PENDIENTE
  EN_PREPARACION
  LISTO
  ENTREGADO
  CANCELADO
  PAGADO
}

model Pedido {
  id             String       @id @default(uuid())
  mesaId         String
  numeroMesa     Int?
  estado         PedidoEstado @default(PENDIENTE)
  total          Decimal      @default(0) @db.Decimal(10, 2)
  items          PedidoItem[]
  comensales     Int          @default(1)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([mesaId])
  @@index([estado])
  @@map("pedidos")
}

model PedidoItem {
  id             String        @id @default(uuid())
  pedidoId       String
  pedido         Pedido        @relation(fields: [pedidoId], references: [id])
  productoId     String
  nombre         String
  cantidad       Int
  precioUnitario Decimal       @db.Decimal(10, 2)
  area           String?       @default("COCINA")
  notas          String?
  estado         String        @default("PENDIENTE")
  modificadores  Modificador[]
  comensal       Int           @default(1)

  @@index([pedidoId])
  @@map("pedido_items")
}

model MesaLocal {
  id        String   @id
  numero    Int
  updatedAt DateTime @updatedAt

  @@map("mesas_local")
}

model Modificador {
  id           String     @id @default(uuid())
  pedidoItemId String
  pedidoItem   PedidoItem @relation(fields: [pedidoItemId], references: [id])
  nombre       String
  precioExtra  Decimal    @default(0) @db.Decimal(10, 2)

  @@map("modificadores")
}

model OutboxEvent {
  id         String   @id @default(uuid())
  routingKey String
  payload    String
  status     String   @default("PENDING")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([status, createdAt])
  @@map("outbox_events")
}

model ProductoLocal {
  id              String  @id
  nombre          String
  precio          Decimal @db.Decimal(10, 2)
  stockActual     Int?
  categoriaNombre String  @default("COCINA")
  disponible      Boolean @default(true)

  @@map("productos_locales")
}

```


### Formas a extraer
- **Payload exacto de OutboxEvent PedidoCreado**:
  `payload: JSON.stringify({ pedido: pedidoDto })` (`apps/servicio-pedidos/src/app/app.service.ts:202`).
  El `PedidoDto` INCLUYE `id` y sus items tienen `productoId`, `cantidad`, etc.
- **Aritmética monetaria**: `return items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);` (`...:160`)

## Bloque 4 — servicio-caja
### FILE: apps/servicio-caja/src/app/app.service.ts
```typescript
import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ServiceTokenService } from '@org/shared-auth';
import { PrismaService } from '../prisma/prisma.service';
import { PagarPedidoCommand, TransaccionDto, RoutingKeys, PagoRegistradoPayload } from '@org/contracts';
import { CircuitBreakerOptions } from '@org/resiliencia';
import axios from 'axios';

interface CuentaRemota {
  id: string;
  mesaId: string;
  total: number;
  estado: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly CUENTAS_URL =
    process.env['CUENTAS_SERVICE_URL'] ?? 'http://servicio-cuentas:3000/api';
  private readonly HTTP_TIMEOUT_MS = 5000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceTokenService: ServiceTokenService,
  ) {}

  private getServiceToken(): string {
    return this.serviceTokenService.generateServiceToken('servicio-caja');
  }

  @CircuitBreakerOptions({ timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 })
  private async fetchCuenta(cuentaId: string): Promise<CuentaRemota> {
    const res = await axios.get<CuentaRemota>(`${this.CUENTAS_URL}/${cuentaId}`, {
      timeout: this.HTTP_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${this.getServiceToken()}` },
    });
    return res.data;
  }

  async registrarPago(command: PagarPedidoCommand): Promise<{ message?: string; transaccion: TransaccionDto }> {
    const transaccion = await this.prisma.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${command.cuentaId}), 1, 8))::bit(32)::int)`;

      let cuenta = await prisma.cuentaAbierta.findUnique({
        where: { cuentaId: command.cuentaId },
      });

      let cuentaRemota: CuentaRemota;
      try {
        cuentaRemota = await this.fetchCuenta(command.cuentaId);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number }; code?: string };
        if (axiosError.response?.status === 404) {
          throw new NotFoundException(`Cuenta ${command.cuentaId} no encontrada.`);
        }
        throw new ServiceUnavailableException('No se pudo obtener la cuenta. Reintente.');
      }

      cuenta = await prisma.cuentaAbierta.upsert({
        where: { cuentaId: command.cuentaId },
        create: {
          cuentaId: cuentaRemota.id,
          mesaId: cuentaRemota.mesaId,
          total: cuentaRemota.total,
          estado: cuentaRemota.estado,
        },
        update: {
          total: cuentaRemota.total,
          estado: cuentaRemota.estado,
        },
      });

      if (cuenta.estado !== 'ABIERTA') {
        throw new BadRequestException(`La cuenta ya está ${cuenta.estado.toLowerCase()}.`);
      }

      const pagosPrevios = await prisma.transaccion.aggregate({
        where: { cuentaId: command.cuentaId },
        _sum: { monto: true }
      });
      const montoTotalPagado = Number(pagosPrevios._sum.monto || 0);

      if (montoTotalPagado + command.montoRecibido > Number(cuenta.total)) {
        throw new BadRequestException(
          `Pago duplicado o excedente. Total de cuenta: ${cuenta.total}, Ya pagado: ${montoTotalPagado}, Intentando pagar: ${command.montoRecibido}.`
        );
      }

      if (montoTotalPagado + command.montoRecibido < Number(cuenta.total)) {
        throw new BadRequestException(
          `Pago insuficiente. Total de cuenta: ${cuenta.total}, Ya pagado: ${montoTotalPagado}, Intentando pagar: ${command.montoRecibido}. Faltan: ${Number(cuenta.total) - (montoTotalPagado + command.montoRecibido)}.`
        );
      }

      const tx = await prisma.transaccion.create({
        data: {
          cuentaId: command.cuentaId,
          monto: command.montoRecibido,
          metodo: command.metodo,
        }
      });

      const payload: PagoRegistradoPayload = {
        transaccionId: tx.id,
        cuentaId: command.cuentaId,
        mesaId: cuenta.mesaId,
        monto: command.montoRecibido,
        metodo: command.metodo,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.PagoRegistrado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        }
      });

      return tx;
    });

    const transaccionDto: TransaccionDto = {
      id: transaccion.id,
      cuentaId: transaccion.cuentaId,
      monto: Number(transaccion.monto),
      metodo: transaccion.metodo,
      referencia: transaccion.referencia || undefined,
      notas: transaccion.notas || undefined,
      createdAt: transaccion.createdAt.toISOString()
    };

    this.logger.log(`Pago registrado para cuenta ${command.cuentaId}`);
    return { message: 'Pago registrado y evento encolado', transaccion: transaccionDto };
  }

  async listarTransacciones(): Promise<TransaccionDto[]> {
    const data = await this.prisma.transaccion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return data.map(t => ({
      id: t.id,
      cuentaId: t.cuentaId,
      monto: Number(t.monto),
      metodo: t.metodo,
      referencia: t.referencia || undefined,
      notas: t.notas || undefined,
      createdAt: t.createdAt.toISOString()
    }));
  }
}

```

### FILE: apps/servicio-caja/src/app/outbox.processor.ts
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, 'servicio-caja');
          
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          
          this.logger.debug(`Evento ${event.id} publicado exitosamente`);
        } catch (error) {
          this.logger.error(`Error publicando evento ${event.id}:`, error);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'FAILED' },
          });
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

```

### FILE: apps/servicio-caja/prisma/schema.prisma
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
  output          = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Transaccion {
  id          String   @id @default(uuid())
  cuentaId    String
  monto       Decimal  @db.Decimal(10, 2)
  metodo      String   // EFECTIVO, TARJETA, etc.
  referencia  String?
  notas       String?
  createdAt   DateTime @default(now())

  @@index([cuentaId])
  @@map("transacciones")
}

model OutboxEvent {
  id         String   @id @default(uuid())
  routingKey String
  payload    String
  status     String   @default("PENDING") // PENDING, PROCESSED, FAILED
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([status, createdAt])
  @@map("outbox_events")
}

model CierreCaja {
  id           String   @id @default(uuid())
  montoEsperado Decimal  @db.Decimal(10, 2)
  montoReal     Decimal  @db.Decimal(10, 2)
  diferencia    Decimal  @db.Decimal(10, 2)
  usuarioId     String
  createdAt     DateTime @default(now())

  @@map("cierres_caja")
}

model CuentaAbierta {
  cuentaId String   @id
  mesaId   String
  total    Decimal  @db.Decimal(10, 2)
  estado   String

  @@map("cuentas_abiertas")
}

```

### Búsqueda hashToInt / advisory en caja
Comando: `Select-String -Path "apps/servicio-caja/src/**/*.ts" -Pattern "hashToInt|hashtext|advisory"`
```text
apps\servicio-caja\src\app\app.service.ts:42:      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${command.cuentaId}), 1, 8))::bit(32)::int)`;
```


### Formas a extraer
- **Línea exacta de pg_advisory_xact_lock(...)**: 
  ```typescript
  await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${command.cuentaId}), 1, 8))::bit(32)::int)`;
  ```
  (`apps/servicio-caja/src/app/app.service.ts:42`). Forma de 2 argumentos con namespace 1234 y un cast md5->bit(32)->int.
- **¿Firma de hashToInt si existe?**: NO existe la función reutilizable `hashToInt`. El cast es inline.

## Bloque 5 — servicio-reservas
### FILE: apps/servicio-reservas/src/app/reservas.service.ts
```typescript
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CrearReservaCommand,
  ReservaCreadaPayload,
  ReservaCanceladaPayload,
  ReservaEstado,
  RoutingKeys,
} from '@org/contracts';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';
import { PrismaService } from '../prisma/prisma.service';
import { toReservaDto } from './reservas.mapper';

@Injectable()
export class ReservasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publisher: RabbitMQPublisherService,
  ) {}

  async listar(): Promise<{ reservas: ReturnType<typeof toReservaDto>[] }> {
    const reservas = await this.prisma.reserva.findMany({
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
    });
    return { reservas: reservas.map(toReservaDto) };
  }

  async crear(command: CrearReservaCommand) {
    const clienteNombre = command.clienteNombre ?? 'Sin nombre';
    const numComensales = command.numComensales ?? 2;

    await this.assertSlotDisponible(command.fecha, command.hora);

    const reserva = await this.prisma.reserva.create({
      data: {
        clienteId: command.clienteId ?? null,
        clienteNombre,
        clienteTelefono: command.clienteTelefono ?? null,
        fecha: new Date(command.fecha),
        hora: command.hora,
        mesaPreferida: command.mesaPreferida,
        numComensales,
        estado: ReservaEstado.Pendiente,
      },
    });

    const dto = toReservaDto(reserva);
    const payload: ReservaCreadaPayload = { reserva: dto };

    await this.publisher.publish(RoutingKeys.ReservaCreada, payload, 'servicio-reservas');

    return { message: 'Reserva creada', reserva: dto };
  }

  async confirmar(id: string) {
    const reserva = await this.findOrThrow(id);
    if (reserva.estado !== ReservaEstado.Pendiente) {
      throw new ConflictException('Solo se pueden confirmar reservas pendientes');
    }

    const updated = await this.prisma.reserva.update({
      where: { id },
      data: { estado: ReservaEstado.Confirmada },
    });

    return { message: 'Reserva confirmada', reserva: toReservaDto(updated) };
  }

  async cancelar(id: string, motivo?: string) {
    await this.findOrThrow(id);

    const updated = await this.prisma.reserva.update({
      where: { id },
      data: { estado: ReservaEstado.Cancelada },
    });

    const payload: ReservaCanceladaPayload = { reservaId: id, motivo };
    await this.publisher.publish(RoutingKeys.ReservaCancelada, payload, 'servicio-reservas');

    return { message: 'Reserva cancelada', reserva: toReservaDto(updated) };
  }

  async consultarDisponibilidad(fecha: string, hora: string) {
    const conflictos = await this.prisma.reserva.count({
      where: {
        fecha: new Date(fecha),
        hora,
        estado: { in: [ReservaEstado.Pendiente, ReservaEstado.Confirmada] },
      },
    });

    return {
      fecha,
      hora,
      disponible: conflictos === 0,
      capacidadRestante: conflictos === 0 ? 1 : 0,
    };
  }

  private async assertSlotDisponible(fecha: string, hora: string): Promise<void> {
    const { disponible } = await this.consultarDisponibilidad(fecha, hora);
    if (!disponible) {
      throw new ConflictException('No hay disponibilidad para la fecha y hora solicitadas');
    }
  }

  private async findOrThrow(id: string) {
    const reserva = await this.prisma.reserva.findUnique({ where: { id } });
    if (!reserva) {
      throw new NotFoundException(`Reserva ${id} no encontrada`);
    }
    return reserva;
  }
}

```

### FILE: apps/servicio-reservas/src/app/app.controller.ts
```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CrearReservaCommand } from '@org/contracts';
import { ReservasService } from './reservas.service';

@Controller()
export class AppController {
  constructor(private readonly reservas: ReservasService) {}

  @Get()
  listar() {
    return this.reservas.listar();
  }

  @Get('disponibilidad')
  disponibilidad(@Query('fecha') fecha: string, @Query('hora') hora: string) {
    return this.reservas.consultarDisponibilidad(fecha, hora);
  }

  @Post()
  crear(@Body() body: CrearReservaCommand) {
    return this.reservas.crear(body);
  }

  @Patch(':id/confirmar')
  confirmar(@Param('id') id: string) {
    return this.reservas.confirmar(id);
  }

  @Delete(':id')
  cancelar(@Param('id') id: string, @Body() body?: { motivo?: string }) {
    return this.reservas.cancelar(id, body?.motivo);
  }
}

```

### FILE: apps/servicio-reservas/src/app/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { ReservasService } from './reservas.service';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    RabbitMQModule.forRoot(
      process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672'
    ),
  ],
  controllers: [AppController],
  providers: [
    ReservasService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

```

### FILE: apps/servicio-reservas/src/main.ts
```typescript
import { initTracing } from '@org/observabilidad';
initTracing('servicio-reservas');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Reservas')
    .setDescription('Agenda, confirmación y disponibilidad de reservas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3006;
  await app.listen(port);
  Logger.log(`🚀 Servicio Reservas corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

```

### FILE: apps/servicio-reservas/prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"}

model Reserva {
  id              String   @id @default(uuid())
  clienteId       String?
  clienteNombre   String
  clienteTelefono String?
  fecha           DateTime @db.Date
  hora            String
  mesaPreferida   String?
  numComensales   Int      @default(2)
  estado          String   @default("PENDIENTE")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([fecha, hora])
  @@index([estado])
}

```

### FILE: apps/servicio-reservas/src/prisma/prisma.service.ts
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { createBasePrismaService } from '@org/shared-prisma';

const BasePrisma = createBasePrismaService(PrismaClient);

@Injectable()
export class PrismaService extends BasePrisma {
  protected readonly serviceName = 'servicio-reservas';
}

```


### Formas a extraer
- **Payload ReservaCreada**: `{ reserva: dto }` (`apps/servicio-reservas/src/app/reservas.service.ts:51`)
- **Línea publish**: `await this.publisher.publish(RoutingKeys.ReservaCreada, payload, 'servicio-reservas');` (`...:53`)

## Bloque 6 — servicio-identidad
### FILE: apps/servicio-identidad/src/auth/auth.service.ts
```typescript
import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  CrearUsuarioCommand,
  LoginCommand,
  LoginResponseDto,
  UsuarioAutenticadoPayload,
  RoutingKeys,
  CambiarRolCommand,
  RolUsuario,
} from '@org/contracts';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';
import { toUsuarioDto } from './usuarios.mapper';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly publisher: RabbitMQPublisherService,
  ) {}

  /* ── Login ─────────────────────────────────────────── */

  async login(command: LoginCommand): Promise<LoginResponseDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: command.email },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(command.password, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const access_token = this.jwt.sign(payload);

    // Registrar auditoría
    await this.registrarAuditoria('LOGIN', usuario.id, 'servicio-identidad');

    // Publicar evento UsuarioAutenticado
    const eventoPayload: UsuarioAutenticadoPayload = {
      userId: usuario.id,
      rol: usuario.rol as RolUsuario,
      email: usuario.email,
    };
    await this.publisher.publish(
      RoutingKeys.UsuarioAutenticado,
      eventoPayload,
      'servicio-identidad',
    );

    this.logger.log(`✅ Login exitoso: ${usuario.email} (${usuario.rol})`);

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol as RolUsuario,
      },
    };
  }

  /* ── Validar token ─────────────────────────────────── */

  async validarToken(token: string) {
    try {
      const payload = this.jwt.verify(token);
      return { valid: true, payload };
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /* ── Perfil del usuario autenticado ────────────────── */

  async obtenerPerfil(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return toUsuarioDto(usuario);
  }

  /* ── CRUD de usuarios (solo ADMIN) ─────────────────── */

  async crearUsuario(command: CrearUsuarioCommand) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: command.email },
    });

    if (existe) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const hashedPassword = await bcrypt.hash(command.password, SALT_ROUNDS);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: command.nombre,
        email: command.email,
        password: hashedPassword,
        rol: command.rol,
      },
    });

    await this.registrarAuditoria('CREAR_USUARIO', usuario.id, 'servicio-identidad');

    this.logger.log(`✅ Usuario creado: ${usuario.email} (${usuario.rol})`);
    return toUsuarioDto(usuario);
  }

  async listarUsuarios() {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return usuarios.map(toUsuarioDto);
  }

  async cambiarRol(id: string, command: CambiarRolCommand) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const actualizado = await this.prisma.usuario.update({
      where: { id },
      data: { rol: command.rol },
    });

    await this.registrarAuditoria(`CAMBIAR_ROL:${command.rol}`, id, 'servicio-identidad');

    this.logger.log(`✅ Rol actualizado: ${actualizado.email} → ${command.rol}`);
    return toUsuarioDto(actualizado);
  }

  /* ── Auditoría ─────────────────────────────────────── */

  async registrarAuditoria(accion: string, usuarioId: string, servicio: string, ip?: string) {
    await this.prisma.auditoriaLog.create({
      data: { accion, usuarioId, servicio, ip },
    });
  }
}

```

### FILE: apps/servicio-identidad/src/auth/auth.controller.ts
```typescript
import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginCommand,
  CrearUsuarioCommand,
  CambiarRolCommand,
} from '@org/contracts';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* ── Públicos (sin JWT) ────────────────────────────── */

  @Post('auth/login')
  async login(@Body() command: LoginCommand) {
    return this.authService.login(command);
  }

  @Post('auth/validate')
  async validate(@Body() body: { token: string }) {
    return this.authService.validarToken(body.token);
  }

  /* ── Protegidos (requieren JWT) ────────────────────── */

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async me(@Request() req: any) {
    return this.authService.obtenerPerfil(req.user.sub);
  }

  /* ── Gestión de usuarios (solo ADMIN) ──────────────── */

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('usuarios')
  async crearUsuario(@Body() command: CrearUsuarioCommand) {
    return this.authService.crearUsuario(command);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('usuarios')
  async listarUsuarios() {
    return this.authService.listarUsuarios();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('usuarios/:id/rol')
  async cambiarRol(
    @Param('id') id: string,
    @Body() command: CambiarRolCommand,
  ) {
    return this.authService.cambiarRol(id, command);
  }
}

```

### FILE: apps/servicio-identidad/src/auth/auth.module.ts
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET env variable is required');
        return {
          secret,
          signOptions: {
            expiresIn: (process.env.JWT_EXPIRES_IN || '12h') as any,
            issuer: 'nachopps-identidad',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

```

### FILE: apps/servicio-identidad/src/app/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ObservabilidadModule } from '@org/observabilidad';

@Module({
  imports: [
    ObservabilidadModule,
    PrismaModule,
    RabbitMQModule.forRoot(
      process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
    ),
    AuthModule,
  ],
})
export class AppModule {}

```

### FILE: apps/servicio-identidad/src/main.ts
```typescript
import { initTracing } from '@org/observabilidad';
initTracing('servicio-identidad');

import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Nachopps Restobar — API Identidad')
    .setDescription('Autenticación JWT, gestión de usuarios, roles y refresh tokens')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  Logger.log(`🚀 Servicio Identidad corriendo en: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();

```

### FILE: apps/servicio-identidad/prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
  engineType = "library"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Usuario {
  id        String   @id @default(uuid())
  nombre    String
  email     String   @unique
  password  String
  rol       String   @default("MESERO")
  activo    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AuditoriaLog {
  id        String   @id @default(uuid())
  accion    String
  usuarioId String
  servicio  String
  ip        String?
  createdAt DateTime @default(now())

  @@index([usuarioId])
}

```


### Formas a extraer
- **Payload UsuarioAutenticado**: `{ userId: usuario.id, rol: usuario.rol as RolUsuario, email: usuario.email }` (`apps/servicio-identidad/src/auth/auth.service.ts:63`)
- **Línea publish**: `await this.publisher.publish(RoutingKeys.UsuarioAutenticado, eventoPayload, 'servicio-identidad');` (`...:68`)
- **Flujo de login (token)**: Devuelve `{ access_token, usuario: { ... } }` (`...:76`)

## Bloque 7 — OutboxProcessor canónico
### FILE: apps/servicio-mesas/src/app/outbox.processor.ts
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, 'servicio-mesas');
          
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          
          this.logger.debug(`Evento ${event.id} publicado exitosamente`);
        } catch (error) {
          this.logger.error(`Error publicando evento ${event.id}:`, error);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'FAILED' },
          });
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

```

### FILE: apps/servicio-mesas/src/app/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { OutboxProcessor } from './outbox.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQModule } from '@org/shared-rabbitmq';
import { ObservabilidadModule } from '@org/observabilidad';
import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth';

@Module({
  imports: [
    ObservabilidadModule,
    SharedAuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot({
      uri: process.env['RABBITMQ_URI'] ?? 'amqp://nachopps:nachopps_secret@rabbitmq:5672',
      queue: 'mesas_queue',
      bindings: ['cuenta.abierta', 'cuenta.cerrada']
    }),
  ],
  controllers: [AppController, EventsController],
  providers: [
    AppService,
    OutboxProcessor,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

```

### ScheduleModule / Cron usages
Comando: `Select-String -Path "apps/**/*.ts","libs/**/*.ts" -Pattern "ScheduleModule|@nestjs/schedule|@Cron" | Select-Object -First 20`
```text
(sin resultados)
```


### Formas a extraer
- **Registro de ScheduleModule**: `ScheduleModule.forRoot()` en los imports de `app.module.ts`.
- **package.json**: `@nestjs/schedule` está en `dependencies`.

## Bloque 8 — shared-auth / observabilidad
### FILE: libs/shared-auth/src/lib/jwt.strategy.ts
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET env variable is required');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}

```

### FILE: libs/shared-auth/src/lib/shared-auth.module.ts
```typescript
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ServiceTokenService } from './service-token.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET env variable is required');
        return { secret, signOptions: { expiresIn: '24h', issuer: 'nachopps-identidad' } };
      }
    }),
  ],
  providers: [JwtStrategy, ServiceTokenService],
  exports: [JwtModule, PassportModule, ServiceTokenService],
})
export class SharedAuthModule {}

```

### FILE: libs/shared-auth/src/lib/jwt-auth.guard.ts
```typescript
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.path === '/api/telemetry/metrics' || request.path === '/telemetry/metrics') {
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }

  override handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }
}

```

### FILE: libs/shared-auth/src/index.ts
```typescript
export { JwtAuthGuard } from './lib/jwt-auth.guard';
export { SharedAuthModule } from './lib/shared-auth.module';
export { ServiceTokenService } from './lib/service-token.service';

```

### FILE: libs/observabilidad/src/lib/user.decorator.ts
```typescript
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const UsuarioActual = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const logger = new Logger('UsuarioActualDecorator');
    
    // Solo funciona en contexto HTTP
    if (ctx.getType() !== 'http') {
      return null;
    }

    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Decodificar el JWT sin verificar la firma (Kong ya lo hizo en el API Gateway)
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      return payload.sub || null;
    } catch (error) {
      logger.error('Error al decodificar el token JWT para auditoría', error);
      return null;
    }
  },
);

```


### Formas a extraer
- (Extraídos en los volcados)

## Bloque 9 — Frontend
### FILE: apps/pwa-cliente/src/store/auth.store.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsuarioDto } from '@org/contracts';

interface AuthState {
  token: string | null;
  usuario: Omit<UsuarioDto, 'activo' | 'createdAt'> | null;
  isAuthenticated: boolean;
  
  // Acciones
  setSession: (token: string, usuario: Omit<UsuarioDto, 'activo' | 'createdAt'>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      setSession: (token, usuario) =>
        set({
          token,
          usuario,
          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'nachopps-auth-storage', // Clave en localStorage
    }
  )
);

```

### FILE: apps/pwa-cliente/src/api/client.ts
```typescript
import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

// Crear instancia de Axios apuntando al API Gateway (Kong)
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST: Inyectar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE: Detectar 401 Unauthorized para cerrar sesión
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token expira o es inválido, limpiamos la sesión
      useAuthStore.getState().clearSession();
      // Opcional: Redirigir al login si no estamos ya allí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

```

### FILE: apps/pwa-cliente/src/views/Cocina/Cocina.tsx
```typescript
import React, { useEffect, useState, useMemo } from 'react';
import { ChefHat, CheckCircle2, ArrowRight, Clock, Loader2, RefreshCw, Filter } from 'lucide-react';
import { PedidosApi } from '../../api/pedidos.service';
import { PedidoDto, PedidoEstado } from '@org/contracts';
import { useAuthStore } from '../../store/auth.store';
import { io } from 'socket.io-client';

interface FlatItem {
  pedidoId: string;
  mesaId: string;
  numeroMesa?: number;
  pedidoCreatedAt: string;
  itemId: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  notas?: string;
  estado: PedidoEstado;
  area?: string;
}

type EstacionType = 'TODAS' | 'COCINA' | 'BAR';

export const Cocina = () => {
  const [flatItems, setFlatItems] = useState<FlatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [estacionActiva, setEstacionActiva] = useState<EstacionType>('TODAS');

  const cargarPedidos = async () => {
    try {
      setIsLoading(true);
      const pedidos = await PedidosApi.obtenerPedidos();
      
      const items: FlatItem[] = [];
      pedidos.forEach(p => {
        if (p.estado !== PedidoEstado.Entregado && p.estado !== 'PAGADO') {
          p.items.forEach(i => {
            const estadoItem = i.estado || PedidoEstado.Pendiente;
            if (estadoItem !== PedidoEstado.Entregado) {
              items.push({
                pedidoId: p.id,
                mesaId: p.mesaId,
                numeroMesa: p.numeroMesa,
                pedidoCreatedAt: p.createdAt || new Date().toISOString(),
                itemId: i.id!,
                productoId: i.productoId,
                nombre: i.nombre,
                cantidad: i.cantidad,
                notas: i.notas,
                estado: estadoItem,
                area: i.area || 'COCINA'
              });
            }
          });
        }
      });

      items.sort((a, b) => new Date(a.pedidoCreatedAt).getTime() - new Date(b.pedidoCreatedAt).getTime());
      
      setFlatItems(items);
    } catch (error) {
      console.error('Error cargando KDS', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
    
    const token = useAuthStore.getState().token;
    const socket = io('http://localhost:8000', {
      path: '/notificaciones/socket.io',
      query: { jwt: token },
      extraHeaders: { Authorization: `Bearer ${token}` }
    });

    socket.on('connect', () => {
      console.log('KDS conectado a WebSockets en tiempo real');
    });

    socket.on('pedidoUpdate', (data) => {
      console.log('Notificación recibida en KDS:', data);
      cargarPedidos();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const advanceStatus = async (item: FlatItem) => {
    let nextStatus: PedidoEstado;
    if (item.estado === PedidoEstado.Pendiente) {
      nextStatus = PedidoEstado.EnPreparacion;
    } else if (item.estado === PedidoEstado.EnPreparacion) {
      nextStatus = PedidoEstado.Listo;
    } else {
      nextStatus = PedidoEstado.Entregado;
    }

    setFlatItems(prev => prev.map(i => i.itemId === item.itemId ? { ...i, estado: nextStatus } : i));

    try {
      await PedidosApi.actualizarEstadoItem(item.itemId, { estado: nextStatus });
    } catch (error) {
      cargarPedidos();
      alert('Error al actualizar estado');
    }
  };

  const getBorderColor = (status: PedidoEstado) => {
    switch (status) {
      case PedidoEstado.Pendiente: return 'border-l-4 border-slate-500';
      case PedidoEstado.EnPreparacion: return 'border-l-4 border-orange-500 bg-orange-50';
      case PedidoEstado.Listo: return 'border-l-4 border-primary bg-primary/10';
      default: return 'border-border';
    }
  };

  const getStatusText = (status: PedidoEstado) => {
    switch (status) {
      case PedidoEstado.Pendiente: return 'En Cola';
      case PedidoEstado.EnPreparacion: return 'Preparando...';
      case PedidoEstado.Listo: return '¡LISTO!';
      default: return status;
    }
  };

  const activeItems = useMemo(() => {
    let items = flatItems.filter(i => i.estado !== PedidoEstado.Entregado);
    if (estacionActiva !== 'TODAS') {
      items = items.filter(i => i.area === estacionActiva);
    }
    return items;
  }, [flatItems, estacionActiva]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
            Monitor de Preparación (KDS)
          </h1>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setEstacionActiva('TODAS')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${estacionActiva === 'TODAS' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              Todas las Estaciones
            </button>
            <button 
              onClick={() => setEstacionActiva('COCINA')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${estacionActiva === 'COCINA' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              🔥 Cocina
            </button>
            <button 
              onClick={() => setEstacionActiva('BAR')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${estacionActiva === 'BAR' ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              🍸 Barra
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={cargarPedidos} className="p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted transition-colors">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-1.5 rounded-full font-bold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Sincronizado
          </div>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <CheckCircle2 className="w-24 h-24 mb-4 opacity-20" />
          <p className="text-xl font-medium">Todo limpio. No hay pedidos pendientes en {estacionActiva === 'TODAS' ? 'ninguna estación' : `la estación de ${estacionActiva}`}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeItems.map(item => (
            <div 
              key={item.itemId}
              className={`bg-card rounded-xl shadow-sm hover:shadow-md p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 border border-border ${getBorderColor(item.estado)}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-black text-xl text-foreground">
                    Mesa {item.numeroMesa}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" />
                      {new Date(item.pedidoCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.area === 'BAR' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.area === 'BAR' ? 'BARRA' : 'COCINA'}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xl font-bold flex items-start gap-2 leading-tight">
                    <span className="text-muted-foreground text-base mt-0.5 font-black">x{item.cantidad}</span>
                    {item.nombre}
                  </div>
                  {item.notas && (
                    <div className="mt-3 bg-amber-50 text-amber-800 p-2.5 rounded-lg text-sm italic border border-amber-200/50 shadow-sm">
                      <span className="font-semibold not-italic mr-1">📝 Nota:</span>
                      {item.notas}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-dashed border-border">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado</span>
                  <span className={`font-black uppercase text-sm ${item.estado === PedidoEstado.EnPreparacion ? 'text-orange-600' : item.estado === PedidoEstado.Listo ? 'text-primary' : 'text-slate-600'}`}>
                    {getStatusText(item.estado)}
                  </span>
                </div>

                <button 
                  onClick={() => advanceStatus(item)}
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    item.estado === PedidoEstado.Pendiente ? 'bg-slate-700 hover:bg-slate-800' :
                    item.estado === PedidoEstado.EnPreparacion ? 'bg-orange-500 hover:bg-orange-600' :
                    'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {item.estado === PedidoEstado.Pendiente && <span>Empezar Preparación</span>}
                  {item.estado === PedidoEstado.EnPreparacion && <span>Marcar como Listo</span>}
                  {item.estado === PedidoEstado.Listo && <span>Despachar (Entregar)</span>}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

```

### FILE: apps/pwa-cliente/src/views/Pedidos/Pedidos.tsx
```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Plus, ArrowLeft, Loader2, ShoppingCart, Trash2, CheckCircle, Split } from 'lucide-react';
import { 
  PedidoDto, 
  ProductoDto, 
  MesaDto, 
  CrearPedidoCommand, 
  PedidoEstado,
  ModificadorItem
} from '@org/contracts';
import { PedidosApi } from '../../api/pedidos.service';
import { InventarioApi } from '../../api/inventario.service';
import { MesasApi } from '../../api/mesas.service';
import { CuentasApi } from '../../api/cuentas.service';
import { Modal } from '../../components/Modal/Modal';
import { useAuthStore } from '../../store/auth.store';
import { io } from 'socket.io-client';
import styles from './Pedidos.module.css';

export const Pedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoDto[]>([]);
  const [productos, setProductos] = useState<ProductoDto[]>([]);
  const [mesas, setMesas] = useState<MesaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  
  // Modales
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoDto | null>(null);

  // Formulario de nuevo pedido
  const [mesaId, setMesaId] = useState('');
  const [cart, setCart] = useState<{ 
    productoId: string; 
    nombre: string; 
    cantidad: number; 
    precio: number;
    modificadores: ModificadorItem[];
    notas: string;
  }[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [peds, prods, mss] = await Promise.all([
        PedidosApi.obtenerPedidos(),
        InventarioApi.obtenerProductos(),
        MesasApi.obtenerMesas()
      ]);
      setPedidos(peds);
      setProductos(prods);
      setMesas(mss.filter(m => m.estado === 'LIBRE'));
      
      // Inicializar la categoría seleccionada con la primera disponible si existe
      const uniqueCats = Array.from(new Set(prods.map(p => p.categoria?.nombre || 'Otros')));
      if (uniqueCats.length > 0) {
        setSelectedCategory(uniqueCats[0]);
      }
    } catch (error) {
      console.error('Error al cargar datos de pedidos', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();

    // Conectar a WebSockets mediante Kong API Gateway
    const token = useAuthStore.getState().token;
    const socket = io('http://localhost:8000', {
      path: '/notificaciones/socket.io',
      query: { jwt: token },
      extraHeaders: { Authorization: `Bearer ${token}` }
    });

    socket.on('connect', () => {
      console.log('Comandas conectado a WebSockets en tiempo real');
    });

    socket.on('pedidoUpdate', (data) => {
      console.log('Actualización recibida en Comandas:', data);
      cargarDatos(); // Refrescar los pedidos al instante
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addToCart = (prod: ProductoDto) => {
    const existing = cart.find(item => item.productoId === prod.id);
    
    // VALIDACIÓN DE STOCK EN EL FRONTEND
    if (prod.stockActual !== null) {
      const currentQty = existing ? existing.cantidad : 0;
      if (currentQty >= prod.stockActual) {
        alert(`Stock insuficiente para ${prod.nombre}. Stock disponible: ${prod.stockActual}`);
        return;
      }
    }

    if (existing) {
      setCart(cart.map(item => 
        item.productoId === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        productoId: prod.id, 
        nombre: prod.nombre, 
        cantidad: 1, 
        precio: prod.precio,
        modificadores: [],
        notas: ''
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.productoId !== id));
  };

  const addModifier = (productoId: string, nombre: string) => {
    setCart(cart.map(item => 
      item.productoId === productoId 
        ? { ...item, modificadores: [...item.modificadores, { nombre }] } 
        : item
    ));
  };

  const handleCrearPedido = async () => {
    if (!mesaId) {
      alert('Por favor, selecciona una mesa para la comanda.');
      return;
    }
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega al menos un producto a la comanda.');
      return;
    }
    setIsSubmitting(true);
    try {
      const command: CrearPedidoCommand = {
        mesaId,
        items: cart.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          notas: item.notas,
          modificadores: item.modificadores
        }))
      };
      await PedidosApi.crearPedido(command);
      setIsNewOrderModalOpen(false);
      setCart([]);
      setMesaId('');
      await cargarDatos();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'Error al crear pedido';
      alert(`Error al crear pedido: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCambiarEstado = async (id: string, nuevoEstado: PedidoEstado) => {
    try {
      await PedidosApi.actualizarEstado(id, { estado: nuevoEstado });
      await cargarDatos();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}><Utensils size={32} /> Comandas y Pedidos</h1>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setIsNewOrderModalOpen(true)}>
          <Plus size={18} /> Nueva Comanda
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}><Loader2 size={40} className="spinner" /></div>
      ) : (
        <div className={styles.grid}>
          {pedidos.map(pedido => (
            <div key={pedido.id} className={styles.pedidoCard}>
              <div className={styles.pedidoHeader}>
                <span className={styles.mesaInfo}>Mesa {pedido.numeroMesa || '?'}</span>
                <span className={`${styles.estadoBadge} ${styles[pedido.estado]}`}>
                  {pedido.estado}
                </span>
              </div>
              <div className={styles.itemList}>
                {pedido.items.map((item, idx) => (
                  <div key={idx}>
                    <div className={styles.item}>
                      <span>{item.cantidad}x {item.nombre}</span>
                      <span>S/ {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                    </div>
                    {item.modificadores?.map((m, midx) => (
                      <div key={midx} className={styles.itemModifiers}>+ {m.nombre}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div className={styles.total}>Total: S/ {pedido.total.toFixed(2)}</div>
              
              <div className={styles.actions} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {pedido.estado === 'PENDIENTE' && (
                  <button 
                    className={`${styles.btn} ${styles.btnPrimary}`} 
                    onClick={() => handleCambiarEstado(pedido.id, 'EN_PREPARACION' as PedidoEstado)}
                    style={{ flex: 1 }}
                  >
                    Atender
                  </button>
                )}
                {pedido.estado === 'EN_PREPARACION' && (
                  <button 
                    className={`${styles.btn}`} 
                    onClick={() => handleCambiarEstado(pedido.id, 'LISTO' as PedidoEstado)}
                    style={{ flex: 1, backgroundColor: '#f59e0b', color: 'white' }}
                  >
                    Terminar
                  </button>
                )}
                {pedido.estado === 'LISTO' && (
                  <button 
                    className={`${styles.btn}`} 
                    onClick={() => handleCambiarEstado(pedido.id, 'ENTREGADO' as PedidoEstado)}
                    style={{ flex: 1, backgroundColor: '#10b981', color: 'white' }}
                  >
                    Entregar
                  </button>
                )}
                <button 
                  className={styles.btn} 
                  onClick={() => { setSelectedPedido(pedido); setIsSplitModalOpen(true); }}
                  style={{ background: '#eee' }}
                >
                  <Split size={18} />
                </button>
              </div>
            </div>
          ))}
          {pedidos.length === 0 && <p>No hay pedidos activos.</p>}
        </div>
      )}

      {/* Modal Nuevo Pedido */}
      <Modal isOpen={isNewOrderModalOpen} onClose={() => setIsNewOrderModalOpen(false)} title="Nueva Comanda">
        <div className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Seleccionar Mesa</label>
            <select 
              className={styles.input} 
              value={mesaId} 
              onChange={(e) => setMesaId(e.target.value)}
            >
              <option value="">-- Elegir Mesa --</option>
              {mesas.map(m => (
                <option key={m.id} value={m.id}>Mesa {m.numero} ({m.capacidad} pers.)</option>
              ))}
            </select>
            {mesas.length === 0 && (
              <p style={{ color: '#d97706', fontSize: '0.85rem', marginTop: '0.35rem', fontWeight: 600 }}>
                ⚠️ No hay mesas libres disponibles. Por favor, libera una mesa desde el Mapa de Mesas.
              </p>
            )}
          </div>

          {/* Pestañas de Categorías */}
          <div className={styles.categoryTabs}>
            <button 
              type="button"
              className={`${styles.tabButton} ${selectedCategory === 'TODOS' ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory('TODOS')}
            >
              Todos
            </button>
            {Array.from(new Set(productos.map(p => p.categoria?.nombre || 'Otros'))).map(cat => (
              <button
                type="button"
                key={cat}
                className={`${styles.tabButton} ${selectedCategory === cat ? styles.activeTab : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.productSelector}>
            {Object.entries(
              productos.reduce((acc, prod) => {
                const catName = prod.categoria?.nombre || 'Otros';
                if (!acc[catName]) acc[catName] = [];
                acc[catName].push(prod);
                return acc;
              }, {} as Record<string, ProductoDto[]>)
            )
              .filter(([categoria]) => selectedCategory === 'TODOS' || categoria === selectedCategory)
              .map(([categoria, items]) => (
                <div key={categoria} className={styles.categoryGroup}>
                  <h3 className={styles.categoryTitle}>{categoria}</h3>
                  <div className={styles.categoryGrid}>
                    {items.map(prod => {
                      const sinStock = prod.stockActual !== null && prod.stockActual <= 0;
                      return (
                        <div 
                          key={prod.id} 
                          className={`${styles.productItem} ${sinStock ? styles.noStock : ''}`} 
                          onClick={() => !sinStock && addToCart(prod)}
                          title={sinStock ? 'Sin stock disponible' : ''}
                        >
                          <div style={{ fontWeight: 700 }}>{prod.nombre}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#666' }}>S/ {prod.precio.toFixed(2)}</span>
                            {prod.stockActual !== null && (
                              <span className={styles.stockLabel}>Stock: {prod.stockActual}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.selectedItems}>
            <h3>Items en Comanda</h3>
            {cart.map(item => (
              <div key={item.productoId} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                  <span>{item.cantidad}x <strong>{item.nombre}</strong></span>
                  <button onClick={() => removeFromCart(item.productoId)} style={{ color: 'red', background: 'none', border: 'none' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.modifierInput}>
                  <input 
                    type="text" 
                    placeholder="Agregar modificador (ej. Sin cebolla)" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addModifier(item.productoId, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className={styles.input}
                    style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                  />
                </div>
                {item.modificadores.map((m, i) => (
                  <div key={i} className={styles.itemModifiers}>- {m.nombre}</div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <div style={{ marginRight: 'auto', fontWeight: 800, fontSize: '1.2rem' }}>
              Subtotal: S/ {cart.reduce((s, i) => s + (i.precio * i.cantidad), 0).toFixed(2)}
            </div>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCrearPedido} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="spinner" size={18} /> : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal División de Cuenta */}
      <Modal isOpen={isSplitModalOpen} onClose={() => setIsSplitModalOpen(false)} title="Dividir Cuenta">
        {selectedPedido && (
          <div className={styles.modalForm}>
            <p>Mesa {selectedPedido.numeroMesa} - Total: S/ {selectedPedido.total.toFixed(2)}</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                className={styles.btn} 
                style={{ background: 'var(--color-primary)', color: 'white' }}
                onClick={async () => {
                  const res = await PedidosApi.dividirCuenta(selectedPedido.id, { metodo: 'IGUALES', numPartes: 2 });
                  alert(`Sugerencia: 2 partes de S/ ${res.partes[0].monto.toFixed(2)} c/u`);
                  setIsSplitModalOpen(false);
                }}
              >
                Dividir en 2 Partes Iguales
              </button>
              <button 
                className={styles.btn} 
                style={{ background: '#eee' }}
                onClick={async () => {
                  const res = await PedidosApi.dividirCuenta(selectedPedido.id, { metodo: 'POR_ITEMS' });
                  alert('División por comensales calculada. Ver consola.');
                  console.log(res);
                  setIsSplitModalOpen(false);
                }}
              >
                Dividir por Items / Comensales
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

```

### FILE: apps/pwa-cliente/vite.config.ts
```typescript
// ARCHIVO NO ENCONTRADO: apps/pwa-cliente/vite.config.ts
```

### FILE: apps/pwa-cliente/package.json
```json
{
  "name": "@org/pwa-cliente",
  "version": "0.0.1",
  "private": true,
  "nx": {
    "name": "pwa-cliente",
    "targets": {
      "build": {
        "executor": "nx:run-commands",
        "options": {
          "command": "vite build",
          "cwd": "apps/pwa-cliente"
        }
      },
      "serve": {
        "executor": "nx:run-commands",
        "options": {
          "command": "vite",
          "cwd": "apps/pwa-cliente"
        }
      },
      "preview": {
        "executor": "nx:run-commands",
        "options": {
          "command": "vite preview",
          "cwd": "apps/pwa-cliente"
        }
      }
    },
    "tags": [
      "frontend",
      "pwa"
    ]
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.0",
    "lucide-react": "^1.16.0",
    "react-router-dom": "^7.15.1",
    "tailwind-merge": "^2.6.0",
    "zustand": "^5.0.13"
  }
}

```

### import.meta.env usages
Comando: `Select-String -Path "apps/pwa-cliente/src/**/*.ts","apps/pwa-cliente/src/**/*.tsx" -Pattern "import.meta.env"`
```text
(sin resultados)
```


### Formas a extraer
- **Conexión WebSocket**: Usa `socket.io-client` conectado a `http://localhost:8000`.
- **Axios client**: `baseURL: 'http://localhost:8000'` sin `withCredentials`.

## Bloque 10 — Infra
### FILE: infra/docker-compose.yml
```yml
services:
  # ═══════════════════════════════════════════════════
  # INFRAESTRUCTURA COMPARTIDA
  # ═══════════════════════════════════════════════════
  rabbitmq:
    image: rabbitmq:3-management
    container_name: nachopps-rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: nachopps
      RABBITMQ_DEFAULT_PASS: nachopps_secret
    profiles: ["infra", "all", "dev"]
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "check_running"]
      interval: 10s
      timeout: 5s
      retries: 5

  # BASES DE DATOS
  db-reservas:
    image: postgres:16-alpine
    container_name: nachopps-db-reservas
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: reservas_db
    ports: ["5441:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-reservas:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d reservas_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-mesas:
    image: postgres:16-alpine
    container_name: nachopps-db-mesas
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mesas_db
    ports: ["5433:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-mesas:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d mesas_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-pedidos:
    image: postgres:16-alpine
    container_name: nachopps-db-pedidos
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: pedidos_db
    ports: ["5434:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-pedidos:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d pedidos_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-cuentas:
    image: postgres:16-alpine
    container_name: nachopps-db-cuentas
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: cuentas_db
    ports: ["5435:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-cuentas:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d cuentas_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-inventario:
    image: postgres:16-alpine
    container_name: nachopps-db-inventario
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: inventario_db
    ports: ["5436:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-inventario:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d inventario_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-reportes:
    image: postgres:16-alpine
    container_name: nachopps-db-reportes
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: reportes_db
    ports: ["5438:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-reportes:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d reportes_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-caja:
    image: postgres:16-alpine
    container_name: nachopps-db-caja
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: caja_db
    ports: ["5437:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-caja:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d caja_db"]
      interval: 5s
      timeout: 3s
      retries: 5


  db-identidad:
    image: postgres:16-alpine
    container_name: nachopps-db-identidad
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: identidad_db
    ports: ["5439:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-identidad:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d identidad_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  db-notificaciones:
    image: postgres:16-alpine
    container_name: nachopps-db-notificaciones
    environment:
      POSTGRES_USER: nachopps
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: notificaciones_db
    ports: ["5440:5432"]
    profiles: ["infra", "all", "dev"]
    volumes:
      - nachopps-db-notificaciones:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nachopps -d notificaciones_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  # ═══════════════════════════════════════════════════
  # MICROSERVICIOS
  # ═══════════════════════════════════════════════════
  servicio-identidad:
    image: infra-servicio-identidad
    container_name: nachopps-servicio-identidad
    ports: ["3001:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-identidad:5432/identidad_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      JWT_SECRET: "nachopps_jwt_secret_dev"
      JWT_EXPIRES_IN: "24h"
    profiles: ["all"]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    depends_on:
      db-identidad:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-mesas:
    image: infra-servicio-mesas
    container_name: nachopps-servicio-mesas
    ports: ["3002:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-mesas:5432/mesas_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-mesas:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-pedidos:
    image: infra-servicio-pedidos
    container_name: nachopps-servicio-pedidos
    ports: ["3004:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-pedidos:5432/pedidos_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      INVENTARIO_SERVICE_URL: "http://servicio-inventario:3000/api"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-pedidos:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-cuentas:
    image: infra-servicio-cuentas
    container_name: nachopps-servicio-cuentas
    ports: ["3005:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-cuentas:5432/cuentas_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      PEDIDOS_SERVICE_URL: "http://servicio-pedidos:3000/api"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-cuentas:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-reservas:
    image: infra-servicio-reservas
    container_name: nachopps-servicio-reservas
    ports: ["3006:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-reservas:5432/reservas_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-reservas:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-inventario:
    image: infra-servicio-inventario
    container_name: nachopps-servicio-inventario
    ports: ["3007:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-inventario:5432/inventario_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-inventario:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-notificaciones:
    image: infra-servicio-notificaciones
    container_name: nachopps-servicio-notificaciones
    ports: ["3008:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-notificaciones:5432/notificaciones_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-notificaciones:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-caja:
    image: infra-servicio-caja
    container_name: nachopps-servicio-caja
    ports: ["3009:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-caja:5432/caja_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      CUENTAS_SERVICE_URL: "http://servicio-cuentas:3000/api"
      OTEL_EXPORTER_OTLP_ENDPOINT: "http://otel-collector:4318"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    depends_on:
      db-caja:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  servicio-reportes:
    image: infra-servicio-reportes
    container_name: nachopps-servicio-reportes
    ports: ["3010:3000"]
    environment:
      PORT: "3000"
      DATABASE_URL: "postgresql://nachopps:secret@db-reportes:5432/reportes_db?schema=public"
      RABBITMQ_URI: "amqp://nachopps:nachopps_secret@rabbitmq:5672"
      JWT_SECRET: "nachopps_jwt_secret_dev"
    profiles: ["all"]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    depends_on:
      db-reportes:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  # ═══════════════════════════════════════════════════
  # FRONTEND PWA
  # ═══════════════════════════════════════════════════
  pwa-cliente:
    build:
      context: ..
      dockerfile: apps/pwa-cliente/Dockerfile
    image: infra-pwa-cliente
    container_name: nachopps-pwa-cliente
    ports: ["4200:80"]
    profiles: ["pwa-only"]

  # ═══════════════════════════════════════════════════
  # KONG API GATEWAY (con jwt-cache)
  # ═══════════════════════════════════════════════════
  kong:
    build:
      context: kong
      dockerfile: Dockerfile
    image: infra-kong
    container_name: nachopps-kong
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /kong/kong.yml
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_PROXY_LISTEN: 0.0.0.0:8000
      KONG_PLUGINS: "bundled,jwt-cache"
      KONG_JWT_SECRET: "nachopps_jwt_secret_dev"
      KONG_NGINX_HTTP_LUA_SHARED_DICT: "jwt_cache 12m"
    ports:
      - "8000:8000"
      - "8001:8001"
    volumes:
      - ./kong/kong.yml.template:/tmp/kong.yml.template:ro
    extra_hosts:
      - "host.docker.internal:host-gateway"
    profiles: ["infra", "all", "dev"]
    healthcheck:
      test: ["CMD", "kong", "health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s

  # ═══════════════════════════════════════════════════
  # OBSERVABILIDAD
  # ═══════════════════════════════════════════════════
  otel-collector:
    image: jaegertracing/all-in-one:latest
    container_name: nachopps-jaeger
    ports:
      - "16686:16686"
      - "4318:4318"
      - "4317:4317"
    profiles: ["infra", "all", "dev"]

  prometheus:
    image: prom/prometheus:latest
    container_name: nachopps-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    profiles: ["infra", "all", "dev"]

  grafana:
    image: grafana/grafana:latest
    container_name: nachopps-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    profiles: ["infra", "all", "dev"]

volumes:
  nachopps-db-reservas:
  nachopps-db-mesas:
  nachopps-db-pedidos:
  nachopps-db-cuentas:
  nachopps-db-inventario:
  nachopps-db-caja:
  nachopps-db-reportes:
  nachopps-db-identidad:
  nachopps-db-notificaciones:

```

### FILE: infra/kong/kong.yml.template
```template
# Kong declarative config — NachoPps API Gateway
# Proxy: http://localhost:8000  |  Admin: http://localhost:8001
#
# ESTE ES UN TEMPLATE — se genera kong.yml en el entrypoint vía envsubst
# Variable inyectada: ${KONG_JWT_SECRET}
#
# Rutas: http://localhost:8000/{servicio}/...  →  microservicio en host:PORT/api/...
# Ejemplo: POST http://localhost:8000/pedidos/pedidos  →  localhost:3004/api/pedidos
#
# ── JWT ──────────────────────────────────────────────────────────
# Login:  POST http://localhost:8000/identidad/auth/login  (público, sin JWT)
# Demás:  requieren header "Authorization: Bearer <token>"
# Token emitido por servicio-identidad con iss=nachopps-identidad
# ─────────────────────────────────────────────────────────────────

_format_version: "3.0"
_transform: true

# ── Plugins globales ─────────────────────────────────────────────

plugins:
  - name: cors
    config:
      origins:
        - http://localhost:4200
        - http://localhost:5173
        - http://127.0.0.1:4200
        - http://127.0.0.1:5173
      methods:
        - GET
        - POST
        - PUT
        - PATCH
        - DELETE
        - OPTIONS
      headers:
        - Accept
        - Authorization
        - Content-Type
        - X-Requested-With
      exposed_headers:
        - X-Request-Id
      credentials: true
      max_age: 3600

  - name: rate-limiting
    config:
      minute: 3000
      hour: 30000
      policy: local
      fault_tolerant: true
      hide_client_headers: false

  - name: jwt-cache
    config:
      cache_ttl: 60
      max_entries: 10000
      degraded_mode: true

# ── Consumers (JWT) ──────────────────────────────────────────────

consumers:
  - username: nachopps-app
    jwt_secrets:
      - key: nachopps-identidad
        secret: ${KONG_JWT_SECRET}
        algorithm: HS256

# ── Servicios ────────────────────────────────────────────────────

services:
  # ── Identidad (ruta pública para login, protegida para el resto) ──
  - name: servicio-identidad-public
    url: http://host.docker.internal:3001/api/auth
    routes:
      - name: identidad-login
        paths:
          - /identidad/auth
        strip_path: true
        methods:
          - POST

  - name: servicio-identidad
    url: http://host.docker.internal:3001/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: identidad
        paths: [/identidad]
        strip_path: true

  # ── Mesas ──
  - name: servicio-mesas
    url: http://host.docker.internal:3002/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: mesas
        paths: [/mesas]
        strip_path: true

  # ── Pedidos ──
  - name: servicio-pedidos
    url: http://host.docker.internal:3004/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: pedidos
        paths: [/pedidos]
        strip_path: true

  # ── Cuentas ──
  - name: servicio-cuentas
    url: http://host.docker.internal:3005/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: cuentas
        paths: [/cuentas]
        strip_path: true

  # ── Reservas ──
  - name: servicio-reservas
    url: http://host.docker.internal:3006/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: reservas
        paths: [/reservas]
        strip_path: true

  # ── Inventario ──
  - name: servicio-inventario
    url: http://host.docker.internal:3007/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: inventario
        paths: [/inventario]
        strip_path: true

  # ── Notificaciones ──
  - name: servicio-notificaciones
    url: http://host.docker.internal:3008/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: notificaciones
        paths: [/notificaciones]
        strip_path: true

  # ── Caja ──
  - name: servicio-caja
    url: http://host.docker.internal:3009/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: caja
        paths: [/caja]
        strip_path: true

  # ── Reportes ──
  - name: servicio-reportes
    url: http://host.docker.internal:3010/api
    plugins:
      - name: jwt
        config:
          key_claim_name: iss
          claims_to_verify:
            - exp
    routes:
      - name: reportes
        paths: [/reportes]
        strip_path: true

```

### Búsqueda kong.yml template render
Comando: `Select-String -Path "infra/*","scripts/*" -Pattern "kong.yml" -Recurse`
```text
(sin resultados)
```


### Formas a extraer
- **Rate limiting global**: `minute: 3000, hour: 30000, policy: local`
- **Redis**: No hay servicio Redis en el compose ni variables `REDIS_*` en los `.env`.
- **Renderizado kong.yml**: Usan `docker-entrypoint-wrapper.sh` que hace `envsubst < /kong.yml.template > /kong.yml`.

## Bloque 11 — Build / migración / test
### FILE: package.json
```json
{
  "name": "@org/source",
  "version": "0.0.0",
  "license": "MIT",
  "scripts": {
    "poblar": "npx tsx scripts/poblar-datos.ts",
    "probar": "npx tsx scripts/pruebas-integracion.ts",
    "poblar-y-probar": "npx tsx scripts/poblar-datos.ts && npx tsx scripts/pruebas-integracion.ts"
  },
  "private": true,
  "devDependencies": {
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@nx/devkit": "22.7.2",
    "@nx/eslint": "^22.7.2",
    "@nx/js": "^22.7.2",
    "@nx/nest": "^22.7.2",
    "@nx/node": "22.7.2",
    "@nx/playwright": "22.7.2",
    "@nx/react": "^22.7.2",
    "@nx/vite": "22.7.2",
    "@nx/web": "^22.7.2",
    "@nx/webpack": "22.7.2",
    "@playwright/test": "^1.36.0",
    "@prisma/client": "^7.8.0",
    "@swc-node/register": "^1.11.1",
    "@swc/core": "^1.15.8",
    "@swc/helpers": "0.5.18",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "20.19.9",
    "@types/passport-jwt": "^4.0.1",
    "@types/opossum": "^8.1.9",
    "@types/pg": "^8.20.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.0",
    "@vitest/ui": "~4.1.0",
    "autoprefixer": "10.4.13",
    "jiti": "2.4.2",
    "jsdom": "~22.1.0",
    "jsonwebtoken": "^9.0.3",
    "nx": "22.7.2",
    "postcss": "8.4.38",
    "prettier": "^3.8.1",
    "prisma": "^7.8.0",
    "tailwindcss": "^3.4.19",
    "tsconfig-paths-webpack-plugin": "^4.2.0",
    "tslib": "^2.3.0",
    "typescript": "~5.9.2",
    "unplugin-swc": "^1.5.9",
    "vite": "^8.0.0",
    "vite-tsconfig-paths": "^6.1.1",
    "vitest": "~4.1.0",
    "webpack-cli": "^5.1.4"
  },
  "workspaces": [
    "packages/*",
    "apps/*",
    "libs/*",
    "libs/shared/*"
  ],
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/microservices": "^11.1.21",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/platform-socket.io": "^11.1.22",
    "@nestjs/schedule": "^6.1.3",
    "@nestjs/swagger": "^11.4.4",
    "@nestjs/websockets": "^11.1.22",
    "@opentelemetry/auto-instrumentations-node": "^0.76.0",
    "@opentelemetry/exporter-trace-otlp-http": "^0.218.0",
    "@opentelemetry/sdk-node": "^0.218.0",
    "@prisma/adapter-pg": "^7.8.0",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@willsoto/nestjs-prometheus": "^6.1.0",
    "amqp-connection-manager": "^5.0.0",
    "amqplib": "^2.0.1",
    "axios": "^1.6.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.15.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^16.4.0",
    "lucide-react": "^1.16.0",
    "nest-winston": "^1.10.2",
    "opossum": "^9.0.0",
    "pg": "^8.21.0",
    "prom-client": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0",
    "socket.io-client": "^4.8.3",
    "tailwind-merge": "^3.6.0",
    "uuid": "^14.0.0",
    "winston": "^3.19.0"
  }
}

```

### FILE: nx.json
```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/src/test-setup.[jt]s"
    ],
    "sharedGlobals": []
  },
  "plugins": [
    {
      "plugin": "@nx/webpack/plugin",
      "options": {
        "buildTargetName": "webpack:build",
        "serveTargetName": "webpack:serve",
        "previewTargetName": "preview",
        "buildDepsTargetName": "build-deps",
        "watchDepsTargetName": "watch-deps",
        "serveStaticTargetName": "serve-static"
      }
    }
  ],
  "sync": {
    "disabled": true
  },
  "analytics": false,
  "generators": {
    "@nx/js:typescript-sync": {
      "disabled": true
    },
    "@nx/react": {
      "application": {
        "babel": true,
        "style": "css",
        "linter": "none",
        "bundler": "vite"
      },
      "component": {
        "style": "css"
      },
      "library": {
        "style": "css",
        "linter": "none"
      }
    }
  }
}

```

### FILE: tsconfig.base.json
```json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "importHelpers": true,
    "isolatedModules": false,
    "lib": [
      "es2022"
    ],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "skipLibCheck": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "target": "es2022",
    "baseUrl": ".",
    "paths": {
      "@org/contracts": [
        "libs/contracts/src/index.ts"
      ],
      "@org/shared-rabbitmq": [
        "libs/shared-rabbitmq/src/index.ts"
      ],
      "@org/shared-auth": [
        "libs/shared-auth/src/index.ts"
      ],
      "@org/observabilidad": [
        "libs/observabilidad/src/index.ts"
      ],
      "@org/resiliencia": [
        "libs/resiliencia/src/index.ts"
      ],
      "@org/shared-prisma": [
        "libs/shared-prisma/src/index.ts"
      ]
    },
    "esModuleInterop": true
  }
}

```

### FILE: apps/servicio-cuentas/project.json
```json
// ARCHIVO NO ENCONTRADO: apps/servicio-cuentas/project.json
```

### FILE: scripts/levantar-infra.ps1
```ps1
# Infra local: RabbitMQ, Postgres (todas las BD), Kong Gateway
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Set-Location $root

Write-Host "Levantando infra NachoPps (perfil dev)..." -ForegroundColor Cyan
docker compose -f infra/docker-compose.yml --profile dev up -d

Write-Host ""
Write-Host "Servicios:" -ForegroundColor Green
Write-Host "  RabbitMQ UI    http://localhost:15672  (nachopps / nachopps_secret)"
Write-Host "  Kong Proxy     http://localhost:8000"
Write-Host "  Kong Admin     http://localhost:8001"
Write-Host ""
Write-Host "Luego inicia los microservicios (nx serve) y prueba el gateway:" -ForegroundColor Yellow
Write-Host "  Invoke-RestMethod http://localhost:8000/pedidos"

```

### FILE: scripts/reconstruir-y-probar.ps1
```ps1
# ============================================================
# NachoPps — Reconstrucción + Pruebas de Integración
# Uso: .\scripts\reconstruir-y-probar.ps1
# ============================================================
$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot\..

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  NachoPps — Reconstrucción Completa + Pruebas"
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Verificar que Docker funciona
Write-Host "`n[1/6] Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps 2>&1 | Out-Null
} catch {
    Write-Host " ERROR: Docker no responde. Reinicia Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "   Docker OK" -ForegroundColor Green

# 2. Detener stack si está activo
Write-Host "`n[2/6] Deteniendo stack existente..." -ForegroundColor Yellow
docker compose -f infra/docker-compose.yml --profile all down 2>&1 | Out-Null
Write-Host "   Stack detenido" -ForegroundColor Green

# 3. Remover imágenes viejas (cache de build)
Write-Host "`n[3/6] Limpiando imágenes previas..." -ForegroundColor Yellow
docker image rm infra-servicio-identidad 2>&1 | Out-Null
docker image rm infra-servicio-mesas    2>&1 | Out-Null
docker image rm infra-servicio-pedidos  2>&1 | Out-Null
docker image rm infra-servicio-cuentas  2>&1 | Out-Null
docker image rm infra-servicio-reservas 2>&1 | Out-Null
docker image rm infra-servicio-inventario 2>&1 | Out-Null
docker image rm infra-servicio-notificaciones 2>&1 | Out-Null
docker image rm infra-servicio-caja     2>&1 | Out-Null
docker image rm infra-servicio-reportes 2>&1 | Out-Null
docker image rm infra-pwa-cliente       2>&1 | Out-Null
docker image rm infra-kong              2>&1 | Out-Null
Write-Host "   Imágenes limpiadas" -ForegroundColor Green

# 4. Reconstruir todas las imágenes (entrypoint fix ya aplicado en entrypoint.sh)
Write-Host "`n[4/6] Reconstruyendo imágenes Docker (esto puede tomar varios minutos)..." -ForegroundColor Yellow

$services = @(
    "servicio-identidad",
    "servicio-mesas",
    "servicio-pedidos",
    "servicio-cuentas",
    "servicio-reservas",
    "servicio-inventario",
    "servicio-notificaciones",
    "servicio-caja",
    "servicio-reportes"
)

foreach ($svc in $services) {
    Write-Host "  Construyendo $svc..." -NoNewline
    $buildOutput = docker build --build-arg APP_NAME=$svc -t infra-$svc -f Dockerfile . 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n   Construyendo Kong..." -NoNewline
$buildOutput = docker compose -f infra/docker-compose.yml --profile all build kong 2>&1
$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " FAIL" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    exit 1
}

# 5. Levantar stack
Write-Host "`n[5/6] Levantando stack..." -ForegroundColor Yellow
$upOutput = docker compose -f infra/docker-compose.yml --profile all up -d --wait --wait-timeout 120 2>&1
$upExit = $LASTEXITCODE
$upOutput | Where-Object { $_ -match "Error|error|failed|FAIL" } | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
if ($upExit -ne 0) {
    Write-Host "   ADVERTENCIA: docker compose up retornó $upExit — verificando contenedores..." -ForegroundColor Yellow
    docker compose -f infra/docker-compose.yml --profile all ps 2>&1
}
Write-Host "   Stack levantado (exit: $upExit)" -ForegroundColor Green

# Aplicar schemas de Prisma desde el host (más rápido que dentro de contenedores)
Write-Host "`n   Esperando 15 segundos a que las bases de datos Postgres estén listas para recibir conexiones..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n   Aplicando schemas de Prisma..." -ForegroundColor Yellow

$dbPorts = @{
    "servicio-identidad" = "5439"
    "servicio-mesas" = "5433"
    "servicio-pedidos" = "5434"
    "servicio-cuentas" = "5435"
    "servicio-reservas" = "5441"
    "servicio-inventario" = "5436"
    "servicio-notificaciones" = "5440"
    "servicio-caja" = "5437"
    "servicio-reportes" = "5438"
}

foreach ($svc in $services) {
    $port = $dbPorts[$svc]
    $dbName = "$svc-db"
    $dbName = $dbName -replace "servicio-", ""
    Write-Host "    $svc..." -NoNewline
    $env:DATABASE_URL = "postgresql://nachopps:secret@localhost:$port/$($dbName)_db?schema=public"
    Push-Location apps/$svc
    npx prisma db push --accept-data-loss 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green }
    else { Write-Host " FAIL" -ForegroundColor Red }
    Pop-Location
}

# Seed del usuario admin
Write-Host "`n   Sembrando usuario admin..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://nachopps:secret@localhost:5439/identidad_db?schema=public"
Push-Location apps/servicio-identidad
node "..\..\scripts\seed-admin.js" 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "   Seed admin falló" -ForegroundColor Red }
Pop-Location
Write-Host "   Seed completado" -ForegroundColor Green

# 6. Ejecutar población + pruebas
Write-Host "`n[6/6] Ejecutando población y pruebas..." -ForegroundColor Yellow

Write-Host "`n   >>> POBLACIÓN <<<" -ForegroundColor Cyan
npx tsx scripts/poblar-datos.ts
if ($LASTEXITCODE -ne 0) { Write-Host "Población falló" -ForegroundColor Red; exit 1 }

Write-Host "`n   >>> PRUEBAS DE INTEGRACIÓN <<<" -ForegroundColor Cyan
npx tsx scripts/pruebas-integracion.ts

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Proceso completado. Informe: docs/informe-pruebas.md"
Write-Host "============================================================" -ForegroundColor Cyan

```

### Estrategia de migraciones (carpetas)
Comando: `Get-ChildItem -Path "apps" -Filter "migrations" -Directory -Recurse | Select-Object FullName`
```text
FullName                                                                         
--------                                                                         
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-caja\prisma\migrations          
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-cuentas\prisma\migrations       
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-identidad\prisma\migrations     
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-inventario\prisma\migrations    
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-mesas\prisma\migrations         
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-notificaciones\prisma\migrations
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-pedidos\prisma\migrations       
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-reportes\prisma\migrations      
C:\Users\MARCOS\Desktop\BackActual\apps\servicio-reservas\prisma\migrations
```

### Harness de tests (archivos)
Comando: `Get-ChildItem -Path "apps","libs" -Filter "*.spec.ts" -Recurse | Select-Object -First 1 FullName`
```text
FullName                                                                   
--------                                                                   
C:\Users\MARCOS\Desktop\BackActual\apps\pwa-cliente-e2e\src\example.spec.ts
```

### FILE: apps/pwa-cliente-e2e/src/example.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome');
});

```


### Formas a extraer
- **Estrategia de migraciones**: No hay carpetas de migraciones versionadas (`migrations/`). Se usa `prisma db push` en los scripts de reconstrucción.
- **Harness de tests**: Existe infraestructura basada en Jest (ej. `apps/servicio-cuentas/src/app/app.service.spec.ts`). Se usa `Test.createTestingModule` con Prisma y repositorios en mock.

## Bloque 12 — Variables de entorno
### FILE: .env
```
# ============================================================
# Nachopps Restobar — Variables de Entorno (DESARROLLO)
# NO COMMITEAR ESTE ARCHIVO — contiene secrets reales
# ============================================================

# ── Base de Datos ──────────────────────────────────────
POSTGRES_USER=nachopps
POSTGRES_PASSWORD=secret

# ── RabbitMQ ───────────────────────────────────────────
RABBITMQ_DEFAULT_USER=nachopps
RABBITMQ_DEFAULT_PASS=nachopps_secret

# ── JWT ────────────────────────────────────────────────
JWT_SECRET=nachopps_jwt_secret_dev
JWT_EXPIRES_IN=15m

# ── Kong (API Gateway) ─────────────────────────────────
KONG_JWT_SECRET=nachopps_jwt_secret_dev

# ── Observabilidad ─────────────────────────────────────
GRAFANA_ADMIN_PASSWORD=admin
OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318/v1/traces

```

### FILE: .env.example
```example
# ============================================================
# Nachopps Restobar — Variables de Entorno (template)
# Copiar a .env y reemplazar placeholders con valores reales
# ============================================================

# ── Base de Datos ──────────────────────────────────────
POSTGRES_USER=change_me
POSTGRES_PASSWORD=change_me

# ── RabbitMQ ───────────────────────────────────────────
RABBITMQ_DEFAULT_USER=change_me
RABBITMQ_DEFAULT_PASS=change_me

# ── JWT ────────────────────────────────────────────────
# Mínimo 32 caracteres aleatorios en producción
JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=15m

# ── Kong (API Gateway) ─────────────────────────────────
# Debe coincidir con JWT_SECRET
KONG_JWT_SECRET=change_me_to_a_long_random_secret

# ── Observabilidad ─────────────────────────────────────
GRAFANA_ADMIN_PASSWORD=change_me
OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4318/v1/traces

```

### Uso de process.env
Comando: `Select-String -Path "apps/**/*.ts","libs/**/*.ts" -Pattern "process.env." | Select-Object Line | Sort-Object -Unique Line`
```text
Line                                                               
----                                                               
    url: process.env.DATABASE_URL!,                                
const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';
```


## Bloqueos / sorpresas
- **Redis ausente**: A pesar de que el plan M6 sugería throttling, al no haber Redis en docker-compose, el throttling de Kong se hace en memoria (`policy: local`). Esto está bien si hay 1 réplica, pero es una desviación del stack esperado.
- **IdempotencyKey no reutilizable**: No hay función `hashToInt` en caja, el query de `pg_advisory_xact_lock` es un inline de SQL bruto.
- **cookie-parser y withCredentials ausentes**: No están configurados en absoluto, M4 requerirá instalar y configurar ambos desde cero.
- **Estrategia DB**: Al usar `db push`, las actualizaciones de esquema (como `Float` a `Decimal`) son directas, no se generan archivos SQL incrementales de migración.
