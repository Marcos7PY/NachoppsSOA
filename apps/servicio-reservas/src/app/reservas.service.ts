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
import { PrismaService } from '../prisma/prisma.service';
import { toReservaDto } from './reservas.mapper';

@Injectable()
export class ReservasService {
  constructor(
    private readonly prisma: PrismaService,
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

    // M2.A: crear reserva + outbox en la misma transacción
    const reserva = await this.prisma.$transaction(async (prisma) => {
      const r = await prisma.reserva.create({
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

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ReservaCreada,
          payload: JSON.stringify({ reserva: toReservaDto(r) } satisfies ReservaCreadaPayload),
          status: 'PENDING',
        },
      });

      return r;
    });

    const dto = toReservaDto(reserva);
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

    // M2.A: cancelar reserva + outbox en la misma transacción
    const updated = await this.prisma.$transaction(async (prisma) => {
      const r = await prisma.reserva.update({
        where: { id },
        data: { estado: ReservaEstado.Cancelada },
      });

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ReservaCancelada,
          payload: JSON.stringify({ reservaId: id, motivo } satisfies ReservaCanceladaPayload),
          status: 'PENDING',
        },
      });

      return r;
    });

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
