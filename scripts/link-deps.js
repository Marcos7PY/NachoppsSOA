const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'apps');
const services = fs.readdirSync(appsDir).filter(name => name.startsWith('servicio-'));

services.forEach(service => {
  const pkgPath = path.join(appsDir, service, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.dependencies) pkg.dependencies = {};
    pkg.dependencies['@org/observabilidad'] = '*';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`Linked @org/observabilidad in ${service}`);
  }
});
