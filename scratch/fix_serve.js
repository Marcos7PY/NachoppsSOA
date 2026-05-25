const fs = require('fs');

const apps = ['servicio-identidad', 'servicio-mesas', 'servicio-pedidos', 'servicio-cuentas', 'servicio-reservas', 'servicio-inventario', 'servicio-notificaciones', 'servicio-caja', 'servicio-reportes'];

apps.forEach(app => {
  const pkgPath = `apps/${app}/package.json`;
  if (fs.existsSync(pkgPath)) {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.nx && pkg.nx.targets && pkg.nx.targets.serve) {
      pkg.nx.targets.serve = {
        "executor": "nx:run-commands",
        "dependsOn": ["build"],
        "options": {
          "command": `node dist/apps/${app}/apps/${app}/src/main.js`
        }
      };
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }
  }
});

