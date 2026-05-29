import fs from 'fs';
import path from 'path';

const appsDir = './apps';
const apps = fs.readdirSync(appsDir).filter(app => fs.statSync(path.join(appsDir, app)).isDirectory() && fs.existsSync(path.join(appsDir, app, 'prisma', 'schema.prisma')));

for (const app of apps) {
  const schemaPath = path.join(appsDir, app, 'prisma', 'schema.prisma');
  const configPath = path.join(appsDir, app, 'prisma', 'prisma.config.ts');
  
  // 1. Remove url from schema.prisma
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  schemaContent = schemaContent.replace(/^\s*url\s*=\s*env\("DATABASE_URL"\)\r?\n/gm, '');
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  
  // 2. Create prisma.config.ts
  const configContent = `import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
`;
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log(`Updated ${app}`);
}
