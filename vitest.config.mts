import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
          decoratorsBeforeExport: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: 'es2021',
      },
      module: {
        type: 'es6',
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['apps/servicio-{pedidos,caja,cuentas,inventario,identidad,mesas,reservas,notificaciones,reportes}/src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*-e2e/**'],
    onConsoleLog: () => false,
  },
});
