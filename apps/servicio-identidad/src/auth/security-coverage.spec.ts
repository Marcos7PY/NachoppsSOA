import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceRoot = process.cwd();

function readWorkspaceFile(...segments: string[]) {
  return readFileSync(join(workspaceRoot, ...segments), 'utf8');
}

describe('cobertura de guards HTTP mutantes', () => {
  it.each([
    'servicio-mesas',
    'servicio-pedidos',
    'servicio-cuentas',
    'servicio-reservas',
    'servicio-inventario',
    'servicio-caja',
    'servicio-reportes',
  ])('%s usa JwtAuthGuard global compartido', (serviceName) => {
    const moduleSource = readWorkspaceFile(
      'apps',
      serviceName,
      'src',
      'app',
      'app.module.ts',
    );

    expect(moduleSource).toContain("import { APP_GUARD } from '@nestjs/core'");
    expect(moduleSource).toContain(
      "import { SharedAuthModule, JwtAuthGuard } from '@org/shared-auth'",
    );
    expect(moduleSource).toMatch(
      /\{\s*provide:\s*APP_GUARD,\s*useClass:\s*JwtAuthGuard\s*\}/,
    );
  });

  it('identidad protege logout cookie-only y mutaciones administrativas', () => {
    const controllerSource = readWorkspaceFile(
      'apps',
      'servicio-identidad',
      'src',
      'auth',
      'auth.controller.ts',
    );

    expect(controllerSource).toMatch(
      /@UseGuards\(JwtAuthGuard\)\s+@Post\('auth\/logout'\)/,
    );
    expect(controllerSource).toMatch(
      /@UseGuards\(JwtAuthGuard,\s*RolesGuard\)\s+@Roles\('ADMIN'\)\s+@Post\('usuarios'\)/,
    );
    expect(controllerSource).toMatch(
      /@UseGuards\(JwtAuthGuard,\s*RolesGuard\)\s+@Roles\('ADMIN'\)\s+@Patch\('usuarios\/:id\/rol'\)/,
    );
  });

  it('mantiene auth/validate público solo para validación explícita de token', () => {
    const controllerSource = readWorkspaceFile(
      'apps',
      'servicio-identidad',
      'src',
      'auth',
      'auth.controller.ts',
    );

    expect(controllerSource).toMatch(
      /@Post\('auth\/validate'\)\s+async validate\(@Body\(\) body: \{ token: string \}\)/,
    );
  });
});
