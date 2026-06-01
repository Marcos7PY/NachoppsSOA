import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  @Get()
  healthCheck() {
    return { status: 'OK', service: 'Identidad' };
  }

  /* ── Públicos (sin JWT) ────────────────────────────── */

  @HttpCode(200)
  @Post('auth/login')
  async login(@Body() command: LoginCommand, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(command);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true solo sobre HTTPS
      sameSite: 'lax',                                // localhost:5173 → :8000 es same-site
      maxAge: 1000 * 60 * 60 * 12,                    // 12h, igual que expiresIn del token
      path: '/',
    });
    return result;
  }

  @HttpCode(200)
  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { success: true, message: 'Sesión cerrada correctamente en el servidor' };
  }


  @HttpCode(200)
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
