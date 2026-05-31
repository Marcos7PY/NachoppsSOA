# Revisión de la documentación atómica generada

> **Qué es esto.** Lista para auditar lo que devuelva el agente contra los criterios del brief (`generar-doc-atomica-para-codex.md`, §8). Está ordenada por **rendimiento**: primero los controles baratos que permiten rechazar de inmediato un lote flojo, después la verificación profunda. **Ningún grep detecta hechos inventados** — eso solo lo atrapa el spot-check de citas (R2). Cada bloque trae qué confirmar, cómo, criterio de cierre y espacio para evidencia.
>
> Comandos en PowerShell, ejecutados **desde la raíz del repo**. Equivalente Git Bash al final de cada uno cuando aplica.

- Fecha de revisión: _________
- Rama revisada: `docs/documentacion-atomica`
- Commit del repo contra el que se generó: _________

---

## Empieza por aquí — triage de 2 minutos (fail-fast)

Tres greps que, si fallan, justifican devolver el lote **antes** de revisar a fondo. Son los delatores más comunes de generación perezosa (plantilla copiada sin rellenar) o de historia mal puesta.

```powershell
# 1) Placeholders de plantilla sin resolver (NN, <hash>, fecha sin rellenar, marcas de verificación)
Get-ChildItem .\docs -Recurse -Filter *.md | Select-String -Pattern "NN|<hash>|AAAA-MM-DD|<!-- verificar"

# 2) Marcadores temporales prohibidos (debe describir presente, no historia)
Get-ChildItem .\docs -Recurse -Filter *.md | Select-String -Pattern "\bnuevo\b|\bantes\b|\bahora\b|refactoriz|ya no|se elimin|deprecat|migrad"

# 3) Conteo total de átomos (sanity: ¿son los que esperabas, o sospechosamente pocos?)
(Get-ChildItem .\docs -Recurse -Filter *.md).Count
```

> Git Bash: `grep -rnE "patrón" docs/` y `find docs -name '*.md' | wc -l`.

**Si (1) o (2) devuelven líneas → devolver el lote.** Un `NN` o un `<!-- verificar -->` que sobrevivió significa que el agente no rellenó ese átomo; un marcador temporal significa que metió historia donde va presente.

**Resultado triage:**
> _Pegar aquí las tres salidas (idealmente las dos primeras vacías)._

---

## R1 — Estructura y conteo por tipo

**Qué confirmar.** El árbol coincide con §3 del brief y hay átomos de cada tipo (A endpoints, B eventos, C modelos, D flujos, E libs, F ADR, G invariantes).

```powershell
# Vista del árbol
tree /F .\docs

# Conteo por carpeta-tipo
"endpoints:  " + (Get-ChildItem .\docs\servicios -Recurse -Filter *.md | Where-Object FullName -match '\\endpoints\\').Count
"datos:      " + (Get-ChildItem .\docs\servicios -Recurse -Filter *.md | Where-Object FullName -match '\\datos\\').Count
"eventos:    " + (Get-ChildItem .\docs\eventos -Filter *.md | Where-Object Name -ne '_catalogo.md').Count
"flujos:     " + (Get-ChildItem .\docs\flujos -Filter *.md).Count
"invariantes:" + (Get-ChildItem .\docs\invariantes -Filter *.md).Count
"adr:        " + (Get-ChildItem .\docs\decisiones -Filter *.md).Count
"libs:       " + (Get-ChildItem .\docs\libs -Filter *.md).Count
```

**Criterio de cierre.** El árbol existe completo; los conteos son razonables (no hay carpetas vacías ni tipos ausentes). Libs ≈ 6, invariantes y flujos cubren al menos los mínimos de §6.

**Resultado / evidencia:**
> _Pegar conteos._

---

## R2 — Trazabilidad: cita o no se escribe *(el bloque que más pesa)*

**Qué confirmar.** (a) Cada átomo tiene `fuente:` en el front-matter; (b) **las citas son reales**: el `archivo:línea` existe y la afirmación está de verdad ahí.

**Parte mecánica — átomos sin `fuente:`**

```powershell
Get-ChildItem .\docs\servicios,.\docs\eventos,.\docs\flujos,.\docs\invariantes,.\docs\libs,.\docs\decisiones -Recurse -Filter *.md |
  Where-Object { $_.Name -notmatch '^_' } |
  Where-Object { -not (Select-String -Path $_.FullName -Pattern '^fuente:' -Quiet) } |
  Select-Object FullName
```

(Los índices `_indice.md`, `_catalogo.md`, `README.md`, `arquitectura.md` son navegación y no necesitan `fuente:`; por eso se excluyen.)

**Parte humana — spot-check de citas (no se puede automatizar).** Elegí **8–10 átomos al azar** repartidos entre tipos (incluí al menos 2 endpoints, 2 eventos, 2 modelos, 2 invariantes). Para cada uno: abrí el `archivo:línea` citado y confirmá que la afirmación está ahí y vigente.

```powershell
# Abrir un archivo en una línea exacta (VS Code)
code -g apps\servicio-pedidos\src\app\app.service.ts:NN
```

Buscás tres cosas: cita que **no apunta a nada** (línea inexistente o archivo movido), cita que apunta a un lugar pero **dice otra cosa** que el átomo, y método/campo/tabla **que no existe** en el código. Cualquiera de las tres es hallucinación y descalifica el átomo.

**Criterio de cierre.** Cero átomos sin `fuente:`. En el muestreo, **0 de 8–10** con cita rota o afirmación que no corresponde. Si aparece aunque sea una, ampliá el muestreo: una hallucinación rara vez viene sola.

**Resultado / evidencia:**
> _Listar los 8–10 átomos muestreados y el veredicto de cada uno (OK / cita rota / contradice código)._

---

## R3 — Catálogo de eventos 1:1 con `RoutingKeys`

**Qué confirmar.** Hay exactamente un átomo B por cada routing key del enum; el catálogo no inventa eventos ni se deja ninguno; las definidas-pero-no-usadas están marcadas.

```powershell
# Routing keys declaradas en el enum (valores string 'dominio.accion')
(Select-String -Path .\libs\contracts\src\events\routing-keys.ts -Pattern "'([a-z]+\.[a-z.]+)'" -AllMatches).Matches.Value |
  Sort-Object -Unique

# Átomos de evento existentes
Get-ChildItem .\docs\eventos -Filter *.md | Where-Object Name -ne '_catalogo.md' |
  ForEach-Object { $_.BaseName } | Sort-Object
```

Compará ambas listas. Deben casar salvo las que el catálogo marque explícitamente como "definida, sin consumidores".

**Criterio de cierre.** 1:1 entre enum y átomos B; faltantes y sobrantes = 0; definidas-no-usadas anotadas como tales.

**Resultado / evidencia:**
> _Pegar el diff o confirmar coincidencia._

---

## R4 — Cobertura de endpoints y modelos

**Qué confirmar.** Todo endpoint real de los controladores tiene su átomo A; todo modelo Prisma tiene su átomo C.

```powershell
# Endpoints reales (decoradores de ruta en controladores)
Get-ChildItem .\apps -Recurse -Filter *.controller.ts |
  Select-String -Pattern "@(Get|Post|Put|Patch|Delete)\(" |
  Measure-Object | Select-Object -ExpandProperty Count
# ...y compará con el conteo de átomos endpoints de R1

# Modelos Prisma reales
Get-ChildItem .\apps -Recurse -Filter schema.prisma |
  Select-String -Pattern "^\s*model\s+\w+"
# ...y compará con el conteo de átomos datos de R1
```

**Criterio de cierre.** N.º de endpoints reales = n.º de átomos A. N.º de modelos Prisma = n.º de átomos C. Si hay diferencia, identificar cuál quedó sin documentar.

**Resultado / evidencia:**
> _Endpoints reales: __ vs átomos A: __ . Modelos: __ vs átomos C: __ ._

---

## R5 — Invariantes enlazan a su prueba

**Qué confirmar.** Cada átomo G referencia (a) el mecanismo que la garantiza y (b) el comando + reporte que la verifica.

```powershell
# Cada invariante debería mencionar un comando de prueba o un reporte
Get-ChildItem .\docs\invariantes -Filter *.md |
  ForEach-Object {
    $tieneprueba = Select-String -Path $_.FullName -Pattern "probar|stress-tests|reports" -Quiet
    "{0,-40} prueba: {1}" -f $_.Name, $tieneprueba
  }
```

**Criterio de cierre.** Todas en `prueba: True`. Las que figuren como `verificada` tienen el resultado observado citado (no solo el nombre del comando).

**Resultado / evidencia:**
> _Pegar salida; señalar cualquiera sin prueba._

---

## R6 — Sin huérfanos

**Qué confirmar.** Todo átomo está enlazado desde al menos un índice (`README`, `_catalogo`, `_indice`).

```powershell
# Aprox: un átomo está enlazado si su nombre aparece en algún OTRO .md
$atoms = Get-ChildItem .\docs -Recurse -Filter *.md |
  Where-Object { $_.Name -notin '_catalogo.md','_indice.md','README.md','arquitectura.md' }
foreach ($a in $atoms) {
  $hits = Get-ChildItem .\docs -Recurse -Filter *.md |
    Select-String -Pattern ([regex]::Escape($a.Name)) |
    Where-Object { $_.Path -ne $a.FullName }
  if (-not $hits) { "HUERFANO: $($a.FullName)" }
}
```

**Criterio de cierre.** Cero huérfanos. El `README` enlaza todas las secciones; cada `_indice.md` enlaza los átomos A/C de su servicio.

**Resultado / evidencia:**
> _Pegar lista de huérfanos (idealmente vacía)._

---

## R7 — Self-check por átomo (muestreo)

Sobre los mismos 8–10 átomos de R2, confirmá las cuatro preguntas del brief:

- [ ] **¿Un solo tema?** El átomo cubre exactamente una cosa.
- [ ] **¿Cada hecho citado?** Ya cubierto en R2.
- [ ] **¿Sin marcadores históricos?** Ya cubierto en triage, reconfirmá en estos.
- [ ] **¿Enlaces resuelven?** Los `→ datos/...md`, `→ eventos/...md` apuntan a archivos que existen.

```powershell
# Verificar que los enlaces internos relativos apunten a archivos existentes (aprox)
# (revisar manualmente los → en los átomos muestreados)
```

**Resultado / evidencia:**
> _Veredicto por átomo._

---

## Tabla de aceptación

| Control | Qué garantiza | Estado |
|---|---|---|
| Triage | Sin placeholders ni historia | ☐ / OK |
| R1 | Estructura y tipos completos | ☐ / OK |
| R2 | Trazabilidad real (citas verificadas) | ☐ / OK |
| R3 | Catálogo de eventos 1:1 | ☐ / OK |
| R4 | Cobertura endpoints + modelos | ☐ / OK |
| R5 | Invariantes con prueba | ☐ / OK |
| R6 | Sin huérfanos | ☐ / OK |
| R7 | Self-check por átomo | ☐ / OK |

**Aceptable** cuando todo está en OK. R2 es bloqueante: un lote con citas rotas no se acepta aunque el resto pase.

---

## Si falla — qué pedirle al agente

Devolver con el detalle concreto, no "está mal":

- **Placeholders sin resolver** → "rellenar `fuente`/`handler`/`payload` con `archivo:línea` reales en estos átomos: [lista]".
- **Cita rota o falsa (R2)** → "el átomo X afirma Y citando `archivo:línea`, pero ahí no está; corregir la cita o el hecho". Esto es lo más grave: pedir que **revise todas** las citas de ese tipo, no solo la señalada.
- **Marcador temporal** → "reescribir en presente; mover la historia al ADR correspondiente".
- **Evento faltante/sobrante (R3)** → "el catálogo no casa con `RoutingKeys`: falta/sobra Z".
- **Endpoint/modelo sin átomo (R4)** → "falta el átomo de [ruta/modelo]".
- **Huérfano (R6)** → "enlazar [átomo] desde su índice".
