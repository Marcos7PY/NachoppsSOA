const fs = require('fs');
const glob = require('glob');
glob.sync('apps/servicio-*/prisma/schema.prisma').forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/^[ \t]*engineType\s*=\s*"library".*$\n/gm, '');
  c = c.replace(/^[ \t]*previewFeatures\s*=\s*\["driverAdapters"\].*$\n/gm, '');
  fs.writeFileSync(f, c);
  console.log('Updated ' + f);
});
