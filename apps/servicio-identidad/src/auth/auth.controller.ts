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
