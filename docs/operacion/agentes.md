# Configuracion de agentes

La fuente canonica de instrucciones y skills locales es `.agents/`.

Los directorios `.cursor/`, `.gemini/` y `.opencode/` son copias para otras
herramientas. Para sincronizarlos, ejecutar:

```sh
node scripts/sync-agent-skills.mjs --check
node scripts/sync-agent-skills.mjs
```

No usar symlinks: generan friccion en Windows y en clones con configuraciones de
Git distintas.
