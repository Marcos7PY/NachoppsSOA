const fs = require('fs');

let inventarioSpec = fs.readFileSync('apps/servicio-inventario/src/app/app.service.spec.ts', 'utf8');
inventarioSpec = inventarioSpec.replace(/mockResolvedValue\(productoMock,\s*null\)/g, "mockResolvedValue(productoMock as any)");
fs.writeFileSync('apps/servicio-inventario/src/app/app.service.spec.ts', inventarioSpec);

let cuentasEvents = fs.readFileSync('apps/servicio-cuentas/src/app/events.controller.ts', 'utf8');
cuentasEvents = cuentasEvents.replace(/DomainEventEnvelope, any/, "DomainEventEnvelope");
fs.writeFileSync('apps/servicio-cuentas/src/app/events.controller.ts', cuentasEvents);
