import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MesaDto, CrearMesaCommand, ActualizarEstadoMesaCommand, MesaEstado, RoutingKeys } from '@org/contracts';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async listarMesas(): Promise<{ mesas: MesaDto[] }> {
    const mesas = await this.prisma.mesa.findMany({
      orderBy: { numero: 'asc' }
    });
    return { mesas: mesas as unknown as MesaDto[] };
  }

  async crearMesa(command: CrearMesaCommand): Promise<{ message: string; mesa: MesaDto }> {
    const existe = await this.prisma.mesa.findUnique({ where: { numero: command.numero } });
    if (existe) {
      throw new ConflictException(`La mesa número ${command.numero} ya existe.`);
    }

    const mesa = await this.prisma.$transaction(async (prisma) => {
      const m = await prisma.mesa.create({
        data: {
          numero: command.numero,
          capacidad: command.capacidad || 4,
          ubicacion: command.ubicacion || 'Salon Principal',
          estado: MesaEstado.Libre,
        }
      });

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.MesaCreada,
          payload: JSON.stringify({ mesa: m }),
          status: 'PENDING',
        }
      });

      return m;
    });

    const mesaDto = mesa as unknown as MesaDto;
    return { message: 'Mesa creada exitosamente', mesa: mesaDto };
  }

  async actualizarEstado(id: string, command: ActualizarEstadoMesaCommand): Promise<{ message: string; mesa: MesaDto }> {
    const mesa = await this.prisma.mesa.findUnique({ where: { id } });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada.`);
    }

    if (mesa.estado === command.estado) {
      return { message: 'Estado sin cambios', mesa: mesa as unknown as MesaDto };
    }

    const resultado = await this.prisma.$transaction(async (prisma) => {
      const { count } = await prisma.mesa.updateMany({
        where: { id, estado: mesa.estado },
        data: {
          estado: command.estado,
          cuentaAsociada: command.cuentaAsociada,
        }
      });

      if (count === 0) {
        return { conflicto: true };
      }

      const actualizada = await prisma.mesa.findUnique({ where: { id } });
      const mesaDto = actualizada as unknown as MesaDto;

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.MesaActualizada,
          payload: JSON.stringify({ mesa: mesaDto }),
          status: 'PENDING',
        }
      });

      return { conflicto: false, mesaDto };
    });

    if (resultado.conflicto) {
      this.logger.warn(`Conflicto de estado en mesa ${id}: esperado ${mesa.estado}`);
      throw new ConflictException(`El estado de la mesa fue modificado por otra transacción.`);
    }

    return { message: 'Estado de mesa actualizado', mesa: resultado.mesaDto! };
  }

  async obtenerMesa(id: string): Promise<MesaDto> {
    const mesa = await this.prisma.mesa.findUnique({ where: { id } });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada.`);
    }
    return mesa as unknown as MesaDto;
  }
}
