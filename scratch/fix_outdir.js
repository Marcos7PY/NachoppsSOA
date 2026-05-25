const fs = require('fs');

const apps = ['servicio-identidad', 'servicio-mesas', 'servicio-pedidos', 'servicio-cuentas', 'servicio-reservas', 'servicio-inventario', 'servicio-notificaciones', 'servicio-caja', 'servicio-reportes'];

apps.forEach(app => {
  const tsConfigPath = `apps/${app}/tsconfig.app.json`;
  if (fs.existsSync(tsConfigPath)) {
    let tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    tsConfig.compilerOptions.outDir = `../../dist/apps/${app}`;
    tsConfig.compilerOptions.rootDir = `../../`;
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  }
});
