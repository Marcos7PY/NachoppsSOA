import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async obtenerNotificaciones() {
    return this.prisma.notificacion.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 50,
    });
  }

  async registrarNotificacion(pattern: string, data: any) {
    const contenido = this.formatContenido(pattern, data);
    this.logger.log(`Guardando notificación en BD para el evento: ${pattern}`);

    try {
      const notificacion = await this.prisma.notificacion.create({
        data: {
          eventoOrigen: pattern,
          destinatario: 'TODOS',
          canal: 'UI',
          contenido,
          estado: 'PENDIENTE',
        },
      });
      return notificacion;
    } catch (err) {
      this.logger.error(`Error al persistir notificación: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  private formatContenido(pattern: string, data: any): string {
    try {
      if (!data) return `Actualización de ${pattern}`;
      if (pattern.includes('pedido.creado') || pattern.includes('creado')) {
        const mesa = data.numeroMesa != null 
          ? `Mesa ${data.numeroMesa}` 
          : data.mesaNumero != null 
          ? `Mesa ${data.mesaNumero}`
          : `Mesa ${data.mesaId || '??'}`;
        return `Nuevo pedido registrado para la ${mesa} por un total de S/ ${Number(data.total || 0).toFixed(2)}.`;
      }
      if (pattern.includes('pedido.actualizado') || pattern.includes('actualizado')) {
        const mesa = data.numeroMesa != null 
          ? `Mesa ${data.numeroMesa}` 
          : data.mesaNumero != null 
          ? `Mesa ${data.mesaNumero}`
          : `Mesa ${data.mesaId || '??'}`;
        const estadoStr = String(data.estado || '').replace(/_/g, ' ').toLowerCase();
        return `El pedido de la ${mesa} ha cambiado al estado ${estadoStr}.`;
      }
      if (pattern.includes('reserva.creada') || pattern.includes('reserva')) {
        return `Nueva reserva registrada a nombre de ${data.clienteNombre || 'Cliente'} para el ${data.fecha || ''} a las ${data.hora || ''}.`;
      }
      if (pattern.includes('reserva.cancelada')) {
        return `La reserva a nombre de ${data.clienteNombre || 'Cliente'} ha sido cancelada.`;
      }
      return typeof data === 'object' ? JSON.stringify(data) : String(data);
    } catch {
      return `Actualización de ${pattern} recibida.`;
    }
  }
}
