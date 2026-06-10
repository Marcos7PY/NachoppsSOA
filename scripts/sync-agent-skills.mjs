#!/usr/bin/env node
/**
 * Sincronización de skills de agentes IA (plan T-21).
 *
 * Las mismas skills viven duplicadas en varias herramientas (`.cursor`,
 * `.gemini`, `.opencode`, `.github`). Para evitar el drift (p. ej. `monitor-ci`
 * llegó a divergir entre copias), `.agents/skills/` es la **fuente canónica** y
 * este script proyecta su árbol a las demás herramientas, aplicando el único
 * renombre por convención: `.gemini` usa `skill.md` en minúsculas; el resto
 * mantiene `SKILL.md`. El subárbol `references/` y `scripts/` se copia tal cual.
 *
 * Uso:
 *   node scripts/sync-agent-skills.mjs           → escribe las copias (mirror exacto)
 *   node scripts/sync-agent-skills.mjs --check    → CI: falla (exit 1) si hay drift
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, '.agents', 'skills');

/** Herramientas destino y si renombran SKILL.md → skill.md (solo .gemini). */
const TARGETS = [
  { dir: join(ROOT, '.cursor', 'skills'), lowercaseSkill: false },
  { dir: join(ROOT, '.gemini', 'skills'), lowercaseSkill: true },
  { dir: join(ROOT, '.opencode', 'skills'), lowercaseSkill: false },
  { dir: join(ROOT, '.github', 'skills'), lowercaseSkill: false },
];

const checkMode = process.argv.includes('--check');

/** Lista recursiva de archivos (rutas relativas a `base`). */
function listFiles(base, dir = base, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) listFiles(base, full, acc);
    else acc.push(relative(base, full));
  }
  return acc;
}

/** Aplica el renombre de la herramienta a la ruta relativa de un archivo. */
function mapName(relPath, lowercaseSkill) {
  if (lowercaseSkill && basename(relPath) === 'SKILL.md') {
    return join(dirname(relPath), 'skill.md');
  }
  return relPath;
}

if (!existsSync(SOURCE)) {
  console.error(`✗ No existe la fuente canónica: ${relative(ROOT, SOURCE)}`);
  process.exit(1);
}

const sourceFiles = listFiles(SOURCE);
let drift = 0;

for (const target of TARGETS) {
  const rel = relative(ROOT, target.dir);
  // Conjunto de rutas esperadas (con renombre aplicado) para detectar extras.
  const expected = new Set(sourceFiles.map((f) => mapName(f, target.lowercaseSkill)));

  if (checkMode) {
    // 1) Cada archivo canónico debe existir y coincidir en la copia.
    for (const f of sourceFiles) {
      const want = readFileSync(join(SOURCE, f));
      const dest = join(target.dir, mapName(f, target.lowercaseSkill));
      if (!existsSync(dest)) {
        console.error(`✗ ${rel}: falta ${mapName(f, target.lowercaseSkill)}`);
        drift += 1;
      } else if (!readFileSync(dest).equals(want)) {
        console.error(`✗ ${rel}: difiere ${mapName(f, target.lowercaseSkill)}`);
        drift += 1;
      }
    }
    // 2) No debe haber archivos de más (drift en sentido inverso).
    if (existsSync(target.dir)) {
      for (const f of listFiles(target.dir)) {
        if (!expected.has(f)) {
          console.error(`✗ ${rel}: sobra ${f} (no está en la fuente canónica)`);
          drift += 1;
        }
      }
    }
  } else {
    // Mirror exacto: borrar y reescribir desde la fuente.
    rmSync(target.dir, { recursive: true, force: true });
    for (const f of sourceFiles) {
      const dest = join(target.dir, mapName(f, target.lowercaseSkill));
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, readFileSync(join(SOURCE, f)));
    }
    console.log(`✓ ${rel} sincronizado (${sourceFiles.length} archivos)`);
  }
}

if (checkMode) {
  if (drift > 0) {
    console.error(`\n✗ ${drift} divergencia(s). Ejecuta: node scripts/sync-agent-skills.mjs`);
    process.exit(1);
  }
  console.log('✓ Skills de agentes en sync con la fuente canónica .agents/skills');
}
