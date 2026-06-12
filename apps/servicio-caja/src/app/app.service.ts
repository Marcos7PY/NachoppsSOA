import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { getOrCreateCounter, getOrCreateHistogram } from '@org/observabilidad';
import { PrismaService } from '../prisma/prisma.service';
import {
  ListarTransaccionesQuery,
  PagoRegistradoPayload,
  RoutingKeys,
  TransaccionDto,
  TransaccionListResponse,
} from '@org/contracts';
import { Prisma } from '../generated/prisma';
import {
  AbrirTurnoCajaCommand,
  CerrarTurnoCajaCommand,
  CrearMovimientoCajaCommand,
  PagarCuentaCajaCommand,
  RegistrarArqueoCajaCommand,
} from './caja.dto';
import { CuentasHttpClient, CuentaRemota } from './cuentas-http.client';

const METODOS = ['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN', 'TRANSFERENCIA'] as const;

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  // Métricas de negocio (plan 5.2): pagos/min y distribución de montos.
  private readonly pagosCounter = getOrCreateCounter(
    'pagos_registrados_total', 'Pagos registrados en caja', ['metodo'],
  );
  private readonly pagoMontoHistogram = getOrCreateHistogram(
    'pago_monto_soles', 'Distribución del monto de los pagos (soles)',
    [10, 25, 50, 100, 200, 500, 1000],
    ['metodo'],
  );
  constructor(
    private readonly prisma: PrismaService,
    private readonly cuentasHttp: CuentasHttpClient,
  ) {}

  private usuario(usuarioId?: string | null) {
    return usuarioId ?? 'sistema';
  }

  private n(value: unknown): number {
    return Number(value ?? 0);
  }

  private money(value: number | string | Prisma.Decimal) {
    return new Prisma.Decimal(value);
  }

  async abrirTurno(command: AbrirTurnoCajaCommand, usuarioId?: string | null) {
    const abierto = await this.prisma.turnoCaja.findFirst({
      where: { estado: 'ABIERTA' },
      orderBy: { abiertoAt: 'desc' },
    });

    if (abierto) return this.mapTurno(abierto);

    const fondoInicial = this.money(command.fondoInicial ?? 0);
    let turno;
    try {
      turno = await this.prisma.$transaction(async (prisma) => {
        const creado = await prisma.turnoCaja.create({
          data: {
            cajaId: command.cajaId ?? 'T01',
            cajaNombre: command.cajaNombre ?? 'Terminal 01',
            usuarioId: this.usuario(usuarioId),
            cajeroNombre: command.cajeroNombre,
            fondoInicial,
            estado: 'ABIERTA',
          },
        });

        await prisma.movimientoCaja.create({
          data: {
            turnoId: creado.id,
            tipo: 'APERTURA',
            donde: 'Fondo inicial',
            metodo: 'EFECTIVO',
            monto: fondoInicial,
          },
        });

        return creado;
      });
    } catch (error) {
      // T-25: carrera con otra apertura concurrente — el índice único parcial
      // `turnos_caja_un_abierto` rechaza el segundo INSERT con P2002. Devolver el
      // turno ya abierto (misma semántica que "si ya hay uno, devolverlo").
      if (this.isUniqueConstraintViolation(error)) {
        const existente = await this.prisma.turnoCaja.findFirst({
          where: { estado: 'ABIERTA' },
          orderBy: { abiertoAt: 'desc' },
        });
        if (existente) return this.mapTurno(existente);
      }
      throw error;
    }

    this.logger.log(`Turno de caja ${turno.id} abierto`);
    return this.mapTurno(turno);
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2002';
  }

  async obtenerTurnoActivo(_usuarioId?: string | null) {
    const turno = await this.prisma.turnoCaja.findFirst({
      where: { estado: 'ABIERTA' },
      orderBy: { abiertoAt: 'desc' },
    });
    return turno ? this.mapTurno(turno) : null;
  }

  async obtenerResumenTurnoActivo(_usuarioId?: string | null) {
    const turno = await this.prisma.turnoCaja.findFirst({
      where: { estado: 'ABIERTA' },
      orderBy: { abiertoAt: 'desc' },
    });

    if (!turno) {
      return {
        turno: null,
        movimientos: [],
        ventas: [],
        totalVentas: 0,
        totalEgresos: 0,
        totalIngresos: 0,
        propinas: 0,
        porMetodo: this.emptyMetodoTotals(),
        efectivoEsperado: 0,
        comprobantes: 0,
        pendientes: 0,
        arqueo: null,
        cierre: null,
      };
    }

    return this.obtenerResumenTurno(turno.id);
  }

  async obtenerResumenTurno(id: string) {
    const turno = await this.prisma.turnoCaja.findUnique({
      where: { id },
      include: {
        movimientos: { orderBy: { createdAt: 'desc' } },
        arqueos: { orderBy: { createdAt: 'desc' }, take: 1 },
        cierre: true,
      },
    });

    if (!turno) throw new NotFoundException(`Turno ${id} no encontrado`);
    return this.buildResumen(turno);
  }

  async listarMovimientosTurno(id: string) {
    const movimientos = await this.prisma.movimientoCaja.findMany({
      where: { turnoId: id },
      orderBy: { createdAt: 'desc' },
    });
    return { data: movimientos.map((m) => this.mapMovimiento(m)) };
  }

  async crearMovimiento(id: string, command: CrearMovimientoCajaCommand) {
    const turno = await this.prisma.turnoCaja.findUnique({ where: { id } });
    if (!turno) throw new NotFoundException(`Turno ${id} no encontrado`);
    if (turno.estado !== 'ABIERTA') {
      throw new BadRequestException('El turno ya está cerrado.');
    }

    const absMonto = Math.abs(command.monto);
    const monto = command.tipo === 'EGRESO' ? -absMonto : absMonto;
    const movimiento = await this.prisma.movimientoCaja.create({
      data: {
        turnoId: id,
        tipo: command.tipo,
        donde: command.donde,
        metodo: 'EFECTIVO',
        monto: this.money(monto),
        motivo: command.motivo,
      },
    });

    return this.mapMovimiento(movimiento);
  }

  async registrarArqueo(id: string, command: RegistrarArqueoCajaCommand, usuarioId?: string | null) {
    const turno = await this.prisma.turnoCaja.findUnique({
      where: { id },
      include: { movimientos: true },
    });
    if (!turno) throw new NotFoundException(`Turno ${id} no encontrado`);

    const efectivoEsperado = this.computeEfectivoEsperado(turno.movimientos);
    const efectivoContado = this.sumDenominaciones(command.denominaciones);
    const diferencia = efectivoContado.minus(efectivoEsperado);

    const arqueo = await this.prisma.arqueoCaja.create({
      data: {
        turnoId: id,
        denominaciones: command.denominaciones,
        efectivoEsperado,
        efectivoContado,
        diferencia,
        usuarioId: this.usuario(usuarioId),
      },
    });

    return this.mapArqueo(arqueo);
  }

  async cerrarTurno(id: string, command: CerrarTurnoCajaCommand, usuarioId?: string | null) {
    const cierre = await this.prisma.$transaction(async (prisma) => {
      const turno = await prisma.turnoCaja.findUnique({
        where: { id },
        include: {
          movimientos: { orderBy: { createdAt: 'desc' } },
          arqueos: { orderBy: { createdAt: 'desc' }, take: 1 },
          cierre: true,
        },
      });

      if (!turno) throw new NotFoundException(`Turno ${id} no encontrado`);
      if (turno.estado !== 'ABIERTA') {
        throw new BadRequestException('El turno ya está cerrado.');
      }

      const efectivoEsperado = this.computeEfectivoEsperado(turno.movimientos);
      const efectivoContado = this.sumDenominaciones(command.denominaciones);
      const diferencia = efectivoContado.minus(efectivoEsperado);

      const arqueo = await prisma.arqueoCaja.create({
        data: {
          turnoId: id,
          denominaciones: command.denominaciones,
          efectivoEsperado,
          efectivoContado,
          diferencia,
          usuarioId: this.usuario(usuarioId),
        },
      });

      const resumen = this.buildResumen({
        ...turno,
        arqueos: [arqueo],
        cierre: null,
      });

      const cierreCreado = await prisma.cierreCaja.create({
        data: {
          turnoId: id,
          montoEsperado: efectivoEsperado,
          montoReal: efectivoContado,
          diferencia,
          usuarioId: this.usuario(usuarioId),
          resumen,
        },
      });

      const turnoCerrado = await prisma.turnoCaja.update({
        where: { id },
        data: { estado: 'CERRADA', cerradoAt: new Date() },
      });

      return { turno: turnoCerrado, arqueo, cierre: cierreCreado, resumen };
    });

    this.logger.log(`Turno de caja ${id} cerrado`);
    return {
      turno: this.mapTurno(cierre.turno),
      arqueo: this.mapArqueo(cierre.arqueo),
      cierre: this.mapCierre(cierre.cierre),
      resumen: cierre.resumen,
    };
  }

  async registrarPago(
    command: PagarCuentaCajaCommand,
    usuarioId?: string | null,
  ): Promise<{ message?: string; transaccion: TransaccionDto; ticket?: unknown; turno: unknown }> {
    const turno = await this.prisma.turnoCaja.findFirst({
      where: { estado: 'ABIERTA' },
      orderBy: { abiertoAt: 'desc' },
    });
    if (!turno) {
      throw new BadRequestException('No hay turno de caja abierto.');
    }

    let cuentaRemota: CuentaRemota;
    try {
      cuentaRemota = await this.cuentasHttp.fetchCuenta(command.cuentaId);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status: number }; code?: string };
      if (axiosError.response?.status === 404) {
        throw new NotFoundException(`Cuenta ${command.cuentaId} no encontrada.`);
      }
      throw new ServiceUnavailableException('No se pudo obtener la cuenta. Reintente.');
    }

    const descuento = this.money(command.descuento ?? 0);
    const montoRecibido = this.money(command.montoRecibido);
    const totalConDescuento = Prisma.Decimal.max(
      new Prisma.Decimal(0),
      this.money(cuentaRemota.total).minus(descuento),
    );

    if (!montoRecibido.equals(totalConDescuento)) {
      throw new BadRequestException(
        `El pago debe cubrir el total exacto. Total con descuento: ${totalConDescuento.toNumber()}, recibido: ${montoRecibido.toNumber()}.`,
      );
    }

    const transaccion = await this.prisma.$transaction(async (prisma) => {
      // classid 1234 compartido entre servicios A PROPOSITO: cada servicio tiene su propia BD (database-per-service), el espacio de locks no se cruza.
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${command.cuentaId}), 1, 8))::bit(32)::int)`;

      const cuenta = await prisma.cuentaAbierta.upsert({
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
          mesaId: cuentaRemota.mesaId,
        },
      });

      if (cuenta.estado !== 'ABIERTA') {
        throw new BadRequestException(`La cuenta ya está ${cuenta.estado.toLowerCase()}.`);
      }

      const pagosPrevios = await prisma.transaccion.aggregate({
        where: { cuentaId: command.cuentaId },
        _sum: { monto: true },
      });
      const montoTotalPagado = this.money(pagosPrevios._sum.monto ?? 0);

      if (montoTotalPagado.greaterThan(0)) {
        throw new BadRequestException('La cuenta ya tiene un pago registrado.');
      }

      const tx = await prisma.transaccion.create({
        data: {
          cuentaId: command.cuentaId,
          turnoId: turno.id,
          mesaId: cuenta.mesaId,
          monto: montoRecibido,
          descuento,
          metodo: command.metodo,
          referencia: command.referencia,
          notas: command.notas,
        },
      });

      await prisma.movimientoCaja.create({
        data: {
          turnoId: turno.id,
          tipo: 'VENTA',
          cuentaId: command.cuentaId,
          transaccionId: tx.id,
          mesaId: cuenta.mesaId,
          donde: command.mesaNumero ? `Mesa ${command.mesaNumero}` : `Mesa ${cuenta.mesaId}`,
          metodo: command.metodo,
          monto: montoRecibido,
          descuento,
          propina: this.money(command.propina ?? 0),
          motivo: command.notas,
        },
      });

      const payload: PagoRegistradoPayload = {
        transaccionId: tx.id,
        cuentaId: command.cuentaId,
        mesaId: cuenta.mesaId,
        monto: montoRecibido.toNumber(),
        metodo: command.metodo,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.PagoRegistrado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        },
      });

      return tx;
    });

    let ticket: unknown;
    try {
      const cierre = await this.cuentasHttp.cerrarCuenta(command.cuentaId, descuento.toNumber());
      ticket = cierre?.ticket;
      await this.prisma.cuentaAbierta.update({
        where: { cuentaId: command.cuentaId },
        data: { estado: 'CERRADA', total: totalConDescuento },
      });
    } catch (error) {
      this.logger.warn(`Pago ${transaccion.id} registrado; cierre remoto pendiente: ${(error as Error).message}`);
    }

    const transaccionDto = this.mapTransaccion(transaccion);
    this.pagosCounter.inc({ metodo: command.metodo });
    this.pagoMontoHistogram.observe({ metodo: command.metodo }, montoRecibido.toNumber());
    this.logger.log(`Pago registrado para cuenta ${command.cuentaId}`);
    return {
      message: ticket ? 'Pago registrado, cuenta cerrada y ticket generado' : 'Pago registrado; cierre de cuenta en proceso',
      transaccion: transaccionDto,
      ticket,
      turno: this.mapTurno(turno),
    };
  }

  async listarTransacciones(query: ListarTransaccionesQuery = {}): Promise<TransaccionListResponse> {
    const limit = this.normalizeLimit(query.limit);
    const where: Prisma.TransaccionWhereInput = {
      ...(query.metodo ? { metodo: query.metodo } : {}),
      ...(query.updatedSince
        ? { createdAt: { gte: new Date(query.updatedSince) } }
        : {}),
    };

    const transacciones = await this.prisma.transaccion.findMany({
      where,
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = transacciones.length > limit;
    const data = transacciones.slice(0, limit);

    return {
      data: data.map((t) => this.mapTransaccion(t)),
      nextCursor: hasMore ? data.at(-1)?.id ?? null : null,
    };
  }

  private normalizeLimit(limit?: number): number {
    const parsed = Number(limit ?? 20);
    if (!Number.isFinite(parsed)) return 20;
    return Math.min(Math.max(Math.trunc(parsed), 1), 100);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private buildResumen(turno: any) {
    const movimientos = Array.isArray(turno.movimientos) ? turno.movimientos : [];
    const ventas = movimientos.filter((m: any) => m.tipo === 'VENTA');
    const ingresos = movimientos.filter((m: any) => m.tipo === 'INGRESO');
    const egresos = movimientos.filter((m: any) => m.tipo === 'EGRESO');
    const totalVentas = this.sum(ventas.map((m: any) => m.monto));
    const totalIngresos = this.sum(ingresos.map((m: any) => m.monto));
    const totalEgresos = this.sum(egresos.map((m: any) => m.monto));
    const propinas = this.sum(movimientos.map((m: any) => m.propina ?? 0));
    const porMetodo = this.emptyMetodoTotals();

    ventas.forEach((m: any) => {
      if (m.metodo in porMetodo) porMetodo[m.metodo] += this.n(m.monto);
    });

    return {
      turno: this.mapTurno(turno),
      movimientos: movimientos.map((m: any) => this.mapMovimiento(m)),
      ventas: ventas.map((m: any) => this.mapMovimiento(m)),
      totalVentas: totalVentas.toNumber(),
      totalEgresos: totalEgresos.toNumber(),
      totalIngresos: totalIngresos.toNumber(),
      propinas: propinas.toNumber(),
      porMetodo,
      efectivoEsperado: this.computeEfectivoEsperado(movimientos).toNumber(),
      comprobantes: ventas.length,
      pendientes: 0,
      arqueo: turno.arqueos?.[0] ? this.mapArqueo(turno.arqueos[0]) : null,
      cierre: turno.cierre ? this.mapCierre(turno.cierre) : null,
    };
  }

  private computeEfectivoEsperado(movimientos: any[]) {
    return this.sum(
      movimientos
        .filter((m) => m.metodo === 'EFECTIVO')
        .map((m) => this.money(m.monto).plus(this.money(m.propina ?? 0))),
    );
  }

  private sum(values: unknown[]) {
    return values.reduce(
      (acc: Prisma.Decimal, value) => acc.plus(this.money(value as any)),
      new Prisma.Decimal(0),
    );
  }

  private sumDenominaciones(denominaciones: Record<string, number>) {
    return Object.entries(denominaciones).reduce((acc, [denom, count]) => {
      const d = Number(denom);
      const q = Number(count);
      if (!Number.isFinite(d) || !Number.isFinite(q) || q < 0) return acc;
      return acc.plus(new Prisma.Decimal(d).times(q));
    }, new Prisma.Decimal(0));
  }

  private emptyMetodoTotals() {
    return METODOS.reduce((acc, metodo) => {
      acc[metodo] = 0;
      return acc;
    }, {} as Record<string, number>);
  }

  private mapTransaccion(t: any): TransaccionDto {
    return {
      id: t.id,
      cuentaId: t.cuentaId,
      monto: this.n(t.monto),
      descuento: this.n(t.descuento),
      metodo: t.metodo,
      referencia: t.referencia || undefined,
      notas: t.notas || undefined,
      createdAt: t.createdAt.toISOString(),
    };
  }

  private mapTurno(t: any) {
    return {
      id: t.id,
      cajaId: t.cajaId,
      cajaNombre: t.cajaNombre,
      usuarioId: t.usuarioId,
      cajeroNombre: t.cajeroNombre ?? null,
      fondoInicial: this.n(t.fondoInicial),
      estado: t.estado,
      abiertoAt: t.abiertoAt.toISOString(),
      cerradoAt: t.cerradoAt?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  }

  private mapMovimiento(m: any) {
    return {
      id: m.id,
      turnoId: m.turnoId,
      tipo: m.tipo,
      cuentaId: m.cuentaId ?? null,
      transaccionId: m.transaccionId ?? null,
      mesaId: m.mesaId ?? null,
      donde: m.donde,
      metodo: m.metodo,
      monto: this.n(m.monto),
      descuento: this.n(m.descuento),
      propina: this.n(m.propina),
      motivo: m.motivo ?? null,
      createdAt: m.createdAt.toISOString(),
    };
  }

  private mapArqueo(a: any) {
    return {
      id: a.id,
      turnoId: a.turnoId,
      denominaciones: a.denominaciones,
      efectivoEsperado: this.n(a.efectivoEsperado),
      efectivoContado: this.n(a.efectivoContado),
      diferencia: this.n(a.diferencia),
      usuarioId: a.usuarioId,
      createdAt: a.createdAt.toISOString(),
    };
  }

  private mapCierre(c: any) {
    return {
      id: c.id,
      turnoId: c.turnoId ?? null,
      montoEsperado: this.n(c.montoEsperado),
      montoReal: this.n(c.montoReal),
      diferencia: this.n(c.diferencia),
      usuarioId: c.usuarioId,
      resumen: c.resumen ?? null,
      createdAt: c.createdAt.toISOString(),
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
