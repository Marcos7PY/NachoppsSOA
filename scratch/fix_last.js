const fs = require('fs');

function replace(file, search, replaceStr) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replaceStr);
  fs.writeFileSync(file, content);
}
function replaceAll(file, search, replaceStr) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(search).join(replaceStr);
  fs.writeFileSync(file, content);
}

replace('apps/servicio-identidad/src/auth/auth.module.ts', 'expiresIn: process.env.JWT_EXPIRES_IN || \'12h\'', 'expiresIn: (process.env.JWT_EXPIRES_IN || \'12h\') as any');
replace('apps/servicio-identidad/src/auth/auth.module.ts', 'expiresIn: process.env.JWT_EXPIRES_IN,', 'expiresIn: process.env.JWT_EXPIRES_IN as any,');

let content = fs.readFileSync('apps/servicio-inventario/src/app/app.service.spec.ts', 'utf8');
content = content.replace(/mockResolvedValue\(productoMock\s*,\s*null\)/g, 'mockResolvedValue(productoMock as any)');
fs.writeFileSync('apps/servicio-inventario/src/app/app.service.spec.ts', content);

replaceAll('apps/servicio-cuentas/src/app/events.controller.ts', "import { PedidoCreadoPayload as any } from '@org/contracts';", "");
replaceAll('apps/servicio-cuentas/src/app/events.controller.ts', "import { PedidoCreadoPayload as any, RoutingKeys } from '@org/contracts';", "import { RoutingKeys } from '@org/contracts';");
replaceAll('apps/servicio-cuentas/src/app/events.controller.ts', "import { any, RoutingKeys } from '@org/contracts';", "import { RoutingKeys } from '@org/contracts';");
replaceAll('apps/servicio-cuentas/src/app/events.controller.ts', "import { any } from '@org/contracts';", "");

replace('apps/servicio-cuentas/src/app/app.service.ts', 'cuentaCerrada,', '');

replace('apps/servicio-pedidos/src/app/app.controller.ts', 'Ctx, RmqContext', '');
replace('apps/servicio-pedidos/src/app/app.controller.ts', 'Ctx, RmqContext,', '');
replace('apps/servicio-pedidos/src/app/app.controller.ts', 'Ctx,', '');
replace('apps/servicio-pedidos/src/app/app.controller.ts', 'RmqContext,', '');

let mapper = fs.readFileSync('apps/servicio-pedidos/src/app/pedidos.mapper.ts', 'utf8');
mapper = mapper.replace('items: pedido.items?.map(item => ({', 'items: (pedido as any).items?.map((item: any) => ({');
fs.writeFileSync('apps/servicio-pedidos/src/app/pedidos.mapper.ts', mapper);

