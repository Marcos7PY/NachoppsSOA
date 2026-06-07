# Guía de contribución

## Convención de commits (Conventional Commits)

Los mensajes de commit siguen [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<ámbito opcional>): <descripción en imperativo>

[cuerpo opcional]

[footer opcional]
```

**Tipos permitidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
`test`, `build`, `ci`, `chore`, `revert`.

Ejemplos:

```
feat(pedidos): compensar la saga de stock con StockInsuficiente
fix(caja): idempotencia en POST /pagos
docs: actualizar CHANGELOG con las mejoras de producción
```

- Usa el imperativo ("agrega", no "agregado"/"agrega").
- El ámbito suele ser el servicio o área (`pedidos`, `caja`, `kong`, `ci`…).
- Cambios incompatibles: añade `!` tras el tipo/ámbito y un footer `BREAKING CHANGE:`.

## Validación automática

La configuración vive en `commitlint.config.cjs`. Para validar los mensajes
localmente y en CI:

```sh
npm i -D @commitlint/cli @commitlint/config-conventional husky
npx husky init
echo 'npx --no -- commitlint --edit "$1"' > .husky/commit-msg
```

## CHANGELOG

Toda entrada relevante se registra en `CHANGELOG.md` bajo `[Unreleased]`, agrupada
en `Added` / `Changed` / `Fixed` / `Security` / `Tests`. Al publicar una versión,
se mueve el bloque `[Unreleased]` a su número de versión con fecha.

## Antes de abrir un PR

- `pnpm nx affected -t typecheck build test` (o `npm exec nx ...`) en verde.
- Sin drift de migraciones: `npm run drift` (requiere un Postgres shadow).
- Si tocas un `schema.prisma`, incluye su migración.
