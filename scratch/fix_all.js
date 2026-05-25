const fs = require('fs');

const apps = ['servicio-identidad', 'servicio-mesas', 'servicio-pedidos', 'servicio-cuentas', 'servicio-reservas', 'servicio-inventario', 'servicio-notificaciones', 'servicio-caja', 'servicio-reportes'];

apps.forEach(app => {
  const tsConfigPath = `apps/${app}/tsconfig.app.json`;
  if (fs.existsSync(tsConfigPath)) {
    let tsc = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    tsc.compilerOptions.rootDir = '../../';
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsc, null, 2));
  }
});

const prismaFiles = [
  'apps/servicio-cuentas/src/prisma/prisma.service.ts',
  'apps/servicio-mesas/src/prisma/prisma.service.ts',
  'apps/servicio-caja/src/prisma/prisma.service.ts',
];
prismaFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace('\\n  async onModuleInit()', '\n  async onModuleInit()');
    fs.writeFileSync(file, c);
  }
});

let eventosCuentas = fs.readFileSync('apps/servicio-cuentas/src/app/events.controller.ts', 'utf8');
eventosCuentas = eventosCuentas.replace("import { any } from '@org/contracts';", "import { PedidoCreadoPayload as any } from '@org/contracts';");
fs.writeFileSync('apps/servicio-cuentas/src/app/events.controller.ts', eventosCuentas);

let mapperPedidos = fs.readFileSync('apps/servicio-pedidos/src/app/pedidos.mapper.ts', 'utf8');
mapperPedidos = mapperPedidos.replace("montoPagado: 0 as any,", "");
fs.writeFileSync('apps/servicio-pedidos/src/app/pedidos.mapper.ts', mapperPedidos);

