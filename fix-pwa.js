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

const files = walk('apps/pwa-cliente/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace onEvent={async (args) => { ... }}
  const regex1 = /(on\w+)=\{(async\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\})\}/g;
  let newContent = content.replace(regex1, (match, p1, p2) => {
    return `${p1}={(...args) => { void (${p2})(...args); }}`;
  });
  
  // Replace onEvent={async () => func()}
  const regex2 = /(on\w+)=\{(async\s*\([^)]*\)\s*=>\s*[^{][^}]*?)\}/g;
  newContent = newContent.replace(regex2, (match, p1, p2) => {
    if (p2.includes('void')) return match;
    return `${p1}={(...args) => { void (${p2})(...args); }}`;
  });

  // Replace as any
  if (newContent.includes('as any')) {
    newContent = newContent.replace(/as any/g, 'as unknown');
  }
  
  // Replace : any
  if (newContent.includes(': any')) {
    newContent = newContent.replace(/: any\b/g, ': unknown');
  }

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
  }
});
