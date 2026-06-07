import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
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
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? '7');

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
      nombre: usuario.nombre,
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

  /* ── Refresh tokens (plan 1.4) ─────────────────────── */

  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  private signAccessToken(usuario: { id: string; email: string; rol: string; nombre: string }): string {
    return this.jwt.sign({ sub: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre });
  }

  /** Crea un refresh token opaco, guarda su hash y devuelve el valor en claro. */
  async issueRefreshToken(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = randomBytes(48).toString('base64url');
    const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 3600 * 1000);
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: this.hashToken(token), expiresAt },
    });
    return { token, expiresAt };
  }

  /**
   * Rota un refresh token: valida, emite uno nuevo y revoca el anterior. Si llega
   * un token YA revocado (reuso), revoca toda la cadena del usuario y rechaza.
   */
  async rotateRefreshToken(rawToken: string): Promise<{
    access_token: string;
    refresh: { token: string; expiresAt: Date };
    usuario: { id: string; nombre: string; email: string; rol: RolUsuario };
  }> {
    const tokenHash = this.hashToken(rawToken);
    const existing = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!existing) throw new UnauthorizedException('Refresh token inválido');

    if (existing.revokedAt) {
      // Reuso detectado: alguien presentó un token ya rotado → revocar todo.
      await this.prisma.refreshToken.updateMany({
        where: { userId: existing.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      this.logger.warn(`Reuso de refresh token detectado para usuario ${existing.userId}; cadena revocada`);
      throw new UnauthorizedException('Refresh token ya utilizado');
    }
    if (existing.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    const usuario = await this.prisma.usuario.findUnique({ where: { id: existing.userId } });
    if (!usuario || !usuario.activo) throw new UnauthorizedException('Usuario no disponible');

    const nuevo = await this.issueRefreshToken(usuario.id);
    const nuevoReg = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hashToken(nuevo.token) } });
    await this.prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), replacedById: nuevoReg?.id ?? null },
    });

    return {
      access_token: this.signAccessToken(usuario),
      refresh: nuevo,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol as RolUsuario },
    };
  }

  /** Revoca el refresh token presentado (logout). No lanza si no existe. */
  async revokeRefreshTokenByRaw(rawToken?: string | null): Promise<void> {
    if (!rawToken) return;
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
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
