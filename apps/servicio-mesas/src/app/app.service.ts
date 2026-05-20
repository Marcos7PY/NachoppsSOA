import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MesaDto, CrearMesaCommand, ActualizarEstadoMesaCommand, MesaEstado } from '@org/contracts';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

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

    const mesa = await this.prisma.mesa.create({
      data: {
        numero: command.numero,
        capacidad: command.capacidad,
        ubicacion: command.ubicacion || 'Salon Principal',
        estado: MesaEstado.Libre,
      }
    });

    return { message: 'Mesa creada exitosamente', mesa: mesa as unknown as MesaDto };
  }

  async actualizarEstado(id: string, command: ActualizarEstadoMesaCommand): Promise<{ message: string; mesa: MesaDto }> {
    const mesa = await this.prisma.mesa.findUnique({ where: { id } });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada.`);
    }

    const actualizada = await this.prisma.mesa.update({
      where: { id },
      data: {
        estado: command.estado,
        cuentaAsociada: command.cuentaAsociada,
      }
    });

    return { message: 'Estado de mesa actualizado', mesa: actualizada as unknown as MesaDto };
  }

  async obtenerMesa(id: string): Promise<MesaDto> {
    const mesa = await this.prisma.mesa.findUnique({ where: { id } });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada.`);
    }
    return mesa as unknown as MesaDto;
  }
}
