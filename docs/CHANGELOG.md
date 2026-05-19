# Changelog — Agent Academy

Todas las versiones notables de este proyecto están documentadas aquí.  
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/).

---

## [v11] — 2026-05-19

### Añadido
- 30 ejercicios prácticos `🧪 Prueba esto` en páginas conceptuales
- 6 obj-bar faltantes (usos, plataformas, console, skills, nocode, tam)
- Widget calculadora de costos interactiva (modelo × tarea × volumen)
- Widget comparador API vs Managed Agents según volumen de documentos
- Comparador visual Chatbot vs Workflow vs Agente con tarjetas clicables
- 6 casos sectoriales reales en acordeones (banca, e-commerce, salud, logística, documentación, inteligencia comercial)
- `pg-claude-code` y `pg-cowork` (Módulo 3)
- Quiz M6 (Vertex AI — 6 preguntas)
- Estructura correcta EX[6] (gobierno) y EX[7] (logística) con kpis como objetos `{n,l}`
- Tabla de fiabilidad con ejemplos concretos (Masiv, datos privados, datos públicos)
- Guía práctica cuándo usar Proyectos vs Artefactos vs Flujos (claude101)

### Corregido
- **P0-1:** `acc-bd` → `acc-body` (30 instancias) — acordeones no funcionaban
- **P0-2:** IDs duplicados pg-usos vs pg-tam (`tam-docs`, etc.) → sufijo `-pg` + `calcTAM2()`
- **P1-3:** `EX[]` duplicado eliminado; EX[6]/EX[7] reconstruidos con estructura correcta
- **P1-4:** `claude101` back button apuntaba a `llms` → corregido a `intro-ia`
- **P1-5:** `python` back button apuntaba a `nocode` → corregido a `tam`
- **P2-6:** RAG grid div sin cerrar → `</div>` añadido antes de `<h3>`
- **P3-8:** `cierre-m4` eyebrow decía "M4" → corregido a "M7"
- **C2:** `QANS` no se limpiaba en retries → usa `Object.keys(QANS).filter(startsWith)`
- **C3:** `nb()` retornaba objeto falso → ahora retorna `null`
- **C4:** Race condition timer → capturado como `_capturedId` en closure
- **M5:** `rAF` redundante en scroll eliminado
- **M6:** `addCopyButtons` usa `requestAnimationFrame` en vez de `setTimeout(80)`
- **M7:** `calcROI/calcTAM` init envueltos en `try{}catch{}`
- **M12:** `swTab` null guard añadido
- **M14:** `shuffleQ` seed incluye `Date.now()/60000`
- **Layout:** `html,body{overflow:hidden}` eliminado — root cause de páginas vacías en versiones previas
- **Layout:** Vuelto al modelo de v5 (position:sticky sidebar + window.scrollTo) que garantiza visualización correcta en todas las páginas

### Cambiado
- Patrones 1-4 y 5-8 unificados en una sola página con tabs
- Bloques de código excesivos en `patrones` y `python` envueltos en acordeones colapsables
- Referencias específicas a "TAM" generalizadas a "integrador/equipo de integraciones"
- Script tag de apertura restaurado (`<scr\n` → `<script>`)

---

## [v10] — 2026-05-17

### Añadido
- Módulo 5: AWS Bedrock (7 páginas)
- Módulo 6: Google Vertex AI (6 páginas)
- Módulo 7: Referencia y seguridad (8 páginas)
- Examen final con 15 preguntas y calificación
- Calculadora ROI para comparar versiones de agentes
- Explorador de casos de uso con 6 sectores

### Corregido
- Navegación secuencial completa M1→M7→Evaluación
- Quiz M1 y M2 redireccionaban a módulos incorrectos

---

## [v8] — 2026-05-10

### Añadido
- Módulo 3: Plataformas y herramientas (MCP, Console, Managed Agents)
- Módulo 4: Implementación práctica (n8n, Python, ejercicios)
- Quizzes M3A y M3

---

## [v5] — 2026-05-05

### Añadido
- Módulos M1 y M2 completos
- Sistema de quizzes interactivo con feedback
- Dark mode
- Progress bar en sidebar
- Layout base (sticky sidebar + window.scrollTo) ← layout de referencia
