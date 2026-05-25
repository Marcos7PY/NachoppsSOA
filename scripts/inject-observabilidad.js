const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'apps');
const services = fs.readdirSync(appsDir).filter(name => name.startsWith('servicio-'));

services.forEach(service => {
  console.log(`Procesando ${service}...`);
  
  // 1. Modificar app.module.ts
  const appModulePath = path.join(appsDir, service, 'src', 'app', 'app.module.ts');
  if (fs.existsSync(appModulePath)) {
    let content = fs.readFileSync(appModulePath, 'utf8');
    
    // Evitar inyecciones dobles
    if (!content.includes('ObservabilidadModule')) {
      // Añadir importación al inicio
      content = `import { ObservabilidadModule } from '@org/observabilidad';\n` + content;
      
      // Inyectar en el array de imports
      content = content.replace(/imports:\s*\[/, 'imports: [\n    ObservabilidadModule,');
      fs.writeFileSync(appModulePath, content);
      console.log(`  - app.module.ts actualizado`);
    }
  }

  // 2. Modificar main.ts
  const mainPath = path.join(appsDir, service, 'src', 'main.ts');
  if (fs.existsSync(mainPath)) {
    let content = fs.readFileSync(mainPath, 'utf8');
    
    if (!content.includes('initTracing')) {
      content = `import { initTracing } from '@org/observabilidad';\n// Iniciar OpenTelemetry ANTES de NestJS\ninitTracing('${service}');\n\n` + content;
      fs.writeFileSync(mainPath, content);
      console.log(`  - main.ts actualizado`);
    }
  }
});

console.log('✅ Inyección completada.');
