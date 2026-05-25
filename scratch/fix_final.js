const fs = require('fs');

let reportesSpec = fs.readFileSync('apps/servicio-reportes/src/app/app.service.spec.ts', 'utf8');
reportesSpec = reportesSpec.replace("import { AppService } from './app.service';", "");
fs.writeFileSync('apps/servicio-reportes/src/app/app.service.spec.ts', reportesSpec);

let identidadAuth = fs.readFileSync('apps/servicio-identidad/src/auth/auth.module.ts', 'utf8');
identidadAuth = identidadAuth.replace(/expiresIn:.*,/, "expiresIn: (process.env.JWT_EXPIRES_IN || '12h') as any,");
fs.writeFileSync('apps/servicio-identidad/src/auth/auth.module.ts', identidadAuth);

let inventarioSpec = fs.readFileSync('apps/servicio-inventario/src/app/app.service.spec.ts', 'utf8');
inventarioSpec = inventarioSpec.replace("mockResolvedValue(productoMock as any, null)", "mockResolvedValue(productoMock as any)");
fs.writeFileSync('apps/servicio-inventario/src/app/app.service.spec.ts', inventarioSpec);

let cuentasEvents = fs.readFileSync('apps/servicio-cuentas/src/app/events.controller.ts', 'utf8');
cuentasEvents = cuentasEvents.replace(/import { any } from '@org\/contracts';/g, "");
cuentasEvents = cuentasEvents.replace(/import { any, RoutingKeys } from '@org\/contracts';/g, "import { RoutingKeys } from '@org/contracts';");
fs.writeFileSync('apps/servicio-cuentas/src/app/events.controller.ts', cuentasEvents);

let cuentasService = fs.readFileSync('apps/servicio-cuentas/src/app/app.service.ts', 'utf8');
cuentasService = cuentasService.replace(/cuentaCerrada,/, "");
fs.writeFileSync('apps/servicio-cuentas/src/app/app.service.ts', cuentasService);

let pedidosMapper = fs.readFileSync('apps/servicio-pedidos/src/app/pedidos.mapper.ts', 'utf8');
pedidosMapper = pedidosMapper.replace(/, PedidoItemEstado/, "");
pedidosMapper = pedidosMapper.replace(/item.estado as PedidoItemEstado/g, "item.estado as any");
fs.writeFileSync('apps/servicio-pedidos/src/app/pedidos.mapper.ts', pedidosMapper);
