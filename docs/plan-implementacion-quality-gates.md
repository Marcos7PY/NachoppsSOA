# Plan de implementacion: cierre de quality gates

Fecha de preparacion: 2026-06-11  
Rama base observada: `dev` (`79e6d2e`, 18 commits ahead de `origin/dev`)  
Alcance: corregir las brechas detectadas en typecheck, build/CI, e2e, cobertura e higiene local sin cambiar arquitectura funcional.

## Objetivo

Dejar la codebase en un estado donde los gates de calidad sean coherentes entre desarrollo local y CI:

- `typecheck` verde y confiable.
- `build` sin falsos positivos frente a errores TypeScript.
- e2e backend incapaces de pasar si Jest no descubre pruebas.
- cobertura protegida con umbrales realistas y una ruta clara para subirlos.
- entorno local reproducible con `npm ci`.

## Orden recomendado

1. Corregir errores TypeScript de `pwa-cliente`.
2. Alinear typecheck/build/CI para que no haya falsos verdes.
3. Endurecer e2e backend quitando `passWithNoTests`.
4. Mejorar cobertura en PWA por zonas de mayor riesgo.
5. Limpiar drift local y revisar actualizaciones menores.

## Fase 1: dejar `pwa-cliente:typecheck` verde

### Problemas actuales

Comando que falla:

```sh
npm exec nx run-many -- --target=typecheck --all
```

Errores observados:

- `apps/pwa-cliente/src/main.tsx:29`: `initialTheme` esta tipado como `string`, pero `applyThemeColor` espera `Theme`.
- `apps/pwa-cliente/src/mappers/notificacion.mapper.ts:161`: `replaceAll` no existe porque `apps/pwa-cliente/tsconfig.app.json` redefine `"lib": ["dom"]`.
- `apps/pwa-cliente/src/screens/ops/MesasScreen.tsx:187` y `:282`: mezcla de `Date` vs `number` para `now`.

### Implementacion sugerida

1. En `main.tsx`, importar o reutilizar `Theme` desde `./utils/theme` y tipar `initialTheme` como `Theme`.
2. En `tsconfig.app.json`, cambiar `"lib": ["dom"]` por una configuracion que preserve ES moderno:

```json
"lib": ["dom", "es2022"]
```

3. En `MesasScreen.tsx`, normalizar `now` a `number`, alineado con `useNow()` y `elapsedLabel(iso: string, now: number)`.

### Verificacion

```sh
npm exec nx run pwa-cliente:typecheck
npm exec nx run-many -- --target=typecheck --all
npm exec nx run pwa-cliente:build
```

### Criterio de aceptacion

- `pwa-cliente:typecheck` pasa sin errores.
- `build` de PWA sigue pasando.
- No se introduce `as any` para silenciar tipos.

## Fase 2: eliminar falsos verdes entre build y typecheck

### Problema actual

`npm exec nx run-many -- --target=build --all` pasa aunque `pwa-cliente:typecheck` falla. Esto ocurre porque Vite empaqueta sin validar todos los contratos TypeScript.

### Implementacion sugerida

Opcion conservadora:

1. Mantener `build` como target rapido.
2. Asegurar que CI ejecute siempre `typecheck build test` para proyectos afectados, como ya ocurre en `.github/workflows/ci.yml`.
3. Documentar en README que `build` no reemplaza `typecheck`.

Opcion estricta:

1. Hacer que `pwa-cliente:build` dependa de `pwa-cliente:typecheck` mediante configuracion Nx en `apps/pwa-cliente/package.json`.
2. Evaluar si esto debe aplicarse solo a PWA o tambien a servicios backend.

Recomendacion: aplicar la opcion estricta solo a PWA primero. Es donde ya existe la brecha real.

### Verificacion

```sh
npm exec nx show project pwa-cliente --json
npm exec nx run pwa-cliente:build
npm exec nx affected -t typecheck build test --base=origin/dev --head=HEAD --parallel=3
```

### Criterio de aceptacion

- `pwa-cliente:build` no puede pasar si `pwa-cliente:typecheck` falla.
- CI conserva el orden `typecheck build test`.
- No se ralentizan innecesariamente builds de servicios Nest.

## Fase 3: endurecer e2e backend

### Problema actual

Los 9 proyectos `*-e2e` tienen:

```json
"passWithNoTests": true
```

Hoy existen specs, pero si Jest deja de descubrirlos el gate podria pasar igual.

### Implementacion sugerida

1. Quitar `passWithNoTests: true` en:
   - `apps/servicio-caja-e2e/package.json`
   - `apps/servicio-cuentas-e2e/package.json`
   - `apps/servicio-identidad-e2e/package.json`
   - `apps/servicio-inventario-e2e/package.json`
   - `apps/servicio-mesas-e2e/package.json`
   - `apps/servicio-notificaciones-e2e/package.json`
   - `apps/servicio-pedidos-e2e/package.json`
   - `apps/servicio-reportes-e2e/package.json`
   - `apps/servicio-reservas-e2e/package.json`
2. Confirmar que cada `jest.config.cts` descubre sus specs.
3. Ejecutar primero un e2e representativo y luego todos si la infraestructura esta disponible.

### Verificacion

```sh
npm exec nx run servicio-identidad-e2e:e2e
npm exec nx run-many -- --target=e2e --all --parallel=1
```

Nota: esta fase requiere runtime/infra preparada. Si no esta disponible, validar al menos discovery con Jest dry-run/help antes de mergear.

### Criterio de aceptacion

- Ningun e2e pasa con 0 tests.
- Todos los e2e siguen pasando cuando la infraestructura esta levantada.
- Los fallos de discovery son visibles en CI/local.

## Fase 4: hacer real el `typecheck` raiz

### Problema actual

El target raiz `@org/source:typecheck` solo ejecuta un `echo`, por lo que da senal debil.

### Implementacion sugerida

Camino incremental:

1. Mantener el target raiz como orquestador, pero cambiarlo a un comando real.
2. Evaluar dos alternativas:
   - `tsc --build --pretty false`
   - `npm exec nx run-many -- --target=typecheck --all`
3. Preferir targets por proyecto si se quiere cache Nx mas granular.

### Riesgo

Un `tsc --build` global puede destapar errores en referencias o tsconfigs que hoy no estan cubiertos por targets Nx. Es deseable, pero conviene hacerlo despues de la Fase 1.

### Verificacion

```sh
npm exec nx run @org/source:typecheck
npm exec nx run-many -- --target=typecheck --all
```

### Criterio de aceptacion

- El target raiz falla si algun typecheck real falla.
- No duplica trabajo excesivo en CI.
- La salida es clara para desarrolladores.

## Fase 5: subir cobertura donde mas duele

### Estado actual observado

`npm exec nx run @org/source:test` pasa:

- 52 archivos de test.
- 511 tests.
- Cobertura global aproximada: `53.41% statements`, `51.75% branches`, `47.04% functions`, `54.49% lines`.

Umbrales actuales en `vitest.config.mts`:

```ts
thresholds: {
  branches: 45,
  functions: 38,
  lines: 53,
  statements: 52,
}
```

### Prioridad de pruebas

1. `apps/pwa-cliente/src/api/*.ts`: clientes HTTP, refresh/auth, errores y query params.
2. `apps/pwa-cliente/src/hooks/queries/*.ts`: estados de loading/error/success y invalidaciones.
3. `apps/pwa-cliente/src/services/socket.service.ts`: reconexion, autenticacion y normalizacion de eventos.
4. Controladores backend con 0% o baja cobertura, solo si contienen logica no trivial.

### Implementacion sugerida

1. Agregar tests unitarios de funciones puras primero.
2. Evitar tests fragiles de layout visual.
3. Subir thresholds solo despues de medir cobertura real en CI/local.

### Verificacion

```sh
npm exec nx run @org/source:test
```

### Criterio de aceptacion

- Cobertura aumenta sin bajar thresholds.
- Nuevos tests cubren comportamiento observable, no detalles cosmeticos.
- No se incrementa notablemente el tiempo de suite.

## Fase 6: higiene local y dependencias

### Drift local

Se observo `@tybys/wasm-util@0.10.2 extraneous` en `node_modules`.

### Implementacion sugerida

```sh
npm ci
npm ls --depth=0
```

### Dependencias outdated

Hay actualizaciones menores disponibles para Nest, React, Vite, Radix, SWC, etc. No hay vulnerabilidades high/critical en produccion:

```sh
npm audit --omit=dev --audit-level=high
```

Recomendacion: no mezclar upgrades masivos con el cierre de quality gates. Hacerlos en PR separado.

## Comandos finales de cierre

Ejecutar antes de cerrar la sesion de implementacion:

```sh
npm exec nx run-many -- --target=lint --all
npm exec nx run-many -- --target=typecheck --all
npm exec nx run-many -- --target=build --all
npm exec nx run @org/source:test
npm audit --omit=dev --audit-level=high
git status --short --branch
```

Si la infraestructura runtime esta levantada:

```sh
npm exec nx run-many -- --target=e2e --all --parallel=1
```

## Riesgos y trade-offs

- Hacer `build` dependiente de `typecheck` mejora seguridad, pero puede hacer mas lento el ciclo local.
- Quitar `passWithNoTests` puede exponer problemas latentes de discovery o entorno e2e.
- Subir cobertura demasiado pronto puede convertir el gate en ruido si los tests son fragiles.
- Actualizar dependencias en el mismo lote complica atribuir regresiones.

## Definicion de done

- `lint`, `typecheck`, `build`, `test` y `audit` pasan.
- Los errores TypeScript de PWA quedan corregidos sin casts innecesarios.
- Los e2e no aceptan suites vacias.
- Los cambios estan documentados en el PR o handoff.
- `git status` solo muestra archivos intencionales.
