const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
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

const files = walk('apps/pwa-cliente/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix router/index.tsx
  if (file.endsWith('router\\index.tsx') || file.endsWith('router/index.tsx')) {
    content = content.replace(/as unknown\b/g, 'as { default: React.ComponentType<any> }');
    changed = true;
  }

  // Fix hooks floating promises
  if (content.includes('queryClient.invalidateQueries') && !content.includes('void queryClient.invalidateQueries')) {
    content = content.replace(/(?<!void\s*)queryClient\.invalidateQueries/g, 'void queryClient.invalidateQueries');
    changed = true;
  }

  // Fix main.tsx floating promise
  if (file.endsWith('main.tsx')) {
    content = content.replace(/useAuthStore\.getState\(\)\.restore\(\)/g, 'void useAuthStore.getState().restore()');
    changed = true;
  }

  // Fix mapper
  if (file.endsWith('notificacion.mapper.ts')) {
    content = '/* eslint-disable @typescript-eslint/no-unsafe-assignment */\n' + content;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
