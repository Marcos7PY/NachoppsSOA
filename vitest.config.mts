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
  esbuild: false,
  // Desactivar oxc para suprimir el warning de vitest 3/4
  oxc: false,
  test: {
    globals: true,
    environment: 'node',
    include: [
      'apps/servicio-{pedidos,caja,cuentas,inventario,identidad,mesas,reservas,notificaciones,reportes}/src/**/*.spec.ts',
      'apps/pwa-cliente/src/**/*.spec.ts',
      'libs/shared-auth/src/**/*.spec.ts',
      'libs/resiliencia/src/**/*.spec.ts',
      'libs/contracts/src/**/*.spec.ts',
      'libs/observabilidad/src/**/*.spec.ts',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*-e2e/**'],
    onConsoleLog: () => false,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: [
        'apps/servicio-{pedidos,caja,cuentas,inventario,identidad,mesas,reservas,notificaciones,reportes}/src/**/*.ts',
        'apps/pwa-cliente/src/**/*.ts',
        'libs/shared-auth/src/**/*.ts',
      ],
      exclude: [
        '**/*.spec.ts',
        '**/main.ts',
        '**/generated/**',
        '**/prisma/**',
        '**/filters/**',
        '**/types/**',
      ],
      // Pisos anti-regresión calibrados a la cobertura real actual del workspace
      // (medida sobre *.ts de los 9 servicios + shared-auth + pwa-cliente).
      // OBJETIVO: subir progresivamente hacia 80% a medida que se añaden pruebas.
      // No bajar estos números; solo subirlos cuando la cobertura real lo permita.
      thresholds: {
        branches: 32,
        functions: 29,
        lines: 35,
        statements: 34,
      },
    },
  },
});
