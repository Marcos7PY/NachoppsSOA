const fs=require('fs');
const app='servicio-identidad';

let pkg=JSON.parse(fs.readFileSync(`apps/${app}/package.json`, 'utf8'));
pkg.nx.targets.build.executor='nx:run-commands';
pkg.nx.targets.build.options={
  command: `tsc -p apps/${app}/tsconfig.app.json && npx tsc-alias -p apps/${app}/tsconfig.app.json && node -e "const fs=require('fs'); if(fs.existsSync('apps/${app}/src/generated')) fs.cpSync('apps/${app}/src/generated', 'dist/apps/${app}/apps/${app}/src/generated', {recursive: true})"`
};
pkg.nx.targets.build.configurations={production:{}};
fs.writeFileSync(`apps/${app}/package.json`, JSON.stringify(pkg,null,2));

let tsc=JSON.parse(fs.readFileSync(`apps/${app}/tsconfig.app.json`, 'utf8'));
tsc.compilerOptions.declaration=false;
tsc.compilerOptions.declarationMap=false;
tsc.compilerOptions.emitDeclarationOnly=false;
tsc.compilerOptions.composite=false;
tsc.references=[];
fs.writeFileSync(`apps/${app}/tsconfig.app.json`, JSON.stringify(tsc,null,2));

let base=JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8'));
base.compilerOptions.esModuleInterop=true;
base.compilerOptions.isolatedModules=false;
fs.writeFileSync('tsconfig.base.json', JSON.stringify(base,null,2));

let nx=JSON.parse(fs.readFileSync('nx.json', 'utf8'));
nx.sync = { disabled: true };
fs.writeFileSync('nx.json', JSON.stringify(nx,null,2));
