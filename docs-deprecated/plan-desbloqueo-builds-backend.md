# Plan: Desbloquear Builds Backend Nx/TypeScript

## Summary

El objetivo es dejar verdes los builds backend, empezando por `servicio-notificaciones:build`, sin tocar logica de negocio.

La causa raiz actual es configuracion TypeScript inconsistente: los servicios compilan fuentes de libs directamente con `tsc -p`, pero tambien declaran `references` a esas mismas libs, lo que dispara `TS6305`. Ademas, `libs/shared-rabbitmq/tsconfig.json` no sigue el patron de las libs hermanas y rompe si se intenta construir como proyecto.

## Key Changes

### Normalizar `libs/shared-rabbitmq`

- Convertir `libs/shared-rabbitmq/tsconfig.json` en wrapper con `files: []`, `include: []` y referencia a `./tsconfig.lib.json`.
- Crear `libs/shared-rabbitmq/tsconfig.lib.json` siguiendo el patron de `observabilidad`/`resiliencia`:
  - `rootDir: "src"`
  - `outDir: "dist"`
  - `emitDeclarationOnly: true`
  - `experimentalDecorators: true`
  - `emitDecoratorMetadata: true`
  - `types: ["node"]`
- No incluir `../contracts/src/**/*.ts` directamente en esta lib.
- Si necesita referencia explicita a contratos, usar:
  - `references: [{ "path": "../contracts/tsconfig.lib.json" }]`

### Alinear los `tsconfig.app.json` de servicios backend

- En cada `apps/servicio-*/tsconfig.app.json`, quitar el bloque `references` cuando el mismo archivo ya incluye `../../libs/**/*.ts`.
- Mantener los `include` actuales de libs para preservar el patron runtime existente: los servicios siguen compilando sus dependencias compartidas dentro de `dist/apps/<servicio>`.
- No cambiar aun los comandos `tsc -p ... && tsc-alias ...`; esta intervencion busca desbloquear con minimo cambio estructural.

### Mantener dependencias ya agregadas

- `@nestjs/jwt` debe permanecer en `apps/servicio-notificaciones/package.json`, porque el gateway ahora inyecta `JwtService`.
- Ejecutar `npm install --package-lock-only` solo si `package-lock.json` queda desactualizado.

## Test Plan

### Confirmar arreglo principal

```powershell
npm exec -- nx run servicio-notificaciones:build --skipNxCache
```

### Validar todos los servicios backend

```powershell
npm exec -- nx run-many --target=build --projects=servicio-identidad,servicio-mesas,servicio-pedidos,servicio-cuentas,servicio-reservas,servicio-inventario,servicio-notificaciones,servicio-caja,servicio-reportes --skipNxCache --outputStyle=static
```

### Regresion general

```powershell
npm exec -- nx run pwa-cliente:typecheck --skipNxCache
npm exec -- nx run pwa-cliente:build --skipNxCache
npm exec -- nx run-many --target=test --outputStyle=static
```

### Confirmar limpieza de artefactos

```powershell
git status --short
```

No commitear `*.tsbuildinfo`, `dist/`, ni salidas generadas salvo que ya esten intencionalmente versionadas.

## Assumptions

- La sesion nueva parte del estado actual del repo, incluyendo los cambios previos de seguridad/front/WebSocket.
- Esta tarea no implementa F3/F4/F5 adicionales del plan original; solo desbloquea builds backend para que lo siguiente sea verificable.
- Se prefiere el arreglo minimo compatible con el patron actual del repo antes de migrar a una estrategia mas limpia de project references o buildable libs.
