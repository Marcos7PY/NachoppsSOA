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
  ListarUsuariosQuery,
  UsuarioListResponse,
} from '@org/contracts';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma';
import { toUsuarioDto } from './usuarios.mapper';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
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

    // M2.B: auditoría + outbox en la misma transacción (atomicidad garantizada)
    await this.prisma.$transaction(async (prisma) => {
      await prisma.auditoriaLog.create({ data: { accion: 'LOGIN', usuarioId: usuario.id, servicio: 'servicio-identidad' } });
      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.UsuarioAutenticado,
          payload: JSON.stringify({ userId: usuario.id, rol: usuario.rol as RolUsuario, email: usuario.email } satisfies UsuarioAutenticadoPayload),
          status: 'PENDING',
        },
      });
    });

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

  async listarUsuarios(query: ListarUsuariosQuery = {}): Promise<UsuarioListResponse> {
    const limit = this.normalizeLimit(query.limit);
    const where: Prisma.UsuarioWhereInput = {
      ...(query.rol ? { rol: query.rol } : {}),
      ...(query.search
        ? {
            OR: [
              { nombre: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.updatedSince
        ? { updatedAt: { gte: new Date(query.updatedSince) } }
        : {}),
    };

    const usuarios = await this.prisma.usuario.findMany({
      where,
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = usuarios.length > limit;
    const data = usuarios.slice(0, limit);

    return {
      data: data.map(toUsuarioDto),
      nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null,
    };
  }

  private normalizeLimit(limit?: number): number {
    const parsed = Number(limit ?? 20);
    if (!Number.isFinite(parsed)) return 20;
    return Math.min(Math.max(Math.trunc(parsed), 1), 100);
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
