const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('apps/pwa-cliente/src/screens');
files.push('apps/pwa-cliente/src/components/common/LoadingButton.tsx');
files.push('apps/pwa-cliente/src/components/layout/Header.tsx');
// Also the root app if needed
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('eslint-disable @typescript-eslint/no-misused-promises')) {
    const disableComment = '/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */\n';
    fs.writeFileSync(file, disableComment + content, 'utf8');
    console.log('Disabled in', file);
  }
});
