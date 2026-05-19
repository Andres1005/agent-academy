# Mapa de contenido — Agent Academy

## Estructura de páginas por módulo

### M1 — IA Fundamental (9 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `home` | Inicio | Descripción del bootcamp, módulos |
| `intro-ia` | ¿Qué es la IA? | Fiabilidad calibrada, tabla de confianza, ejemplos concretos |
| `claude101` | Cómo usar claude.ai | Proyectos vs Artefactos vs Flujos, guía when-to-use |
| `llms` | Cómo funcionan los LLMs | Tokens, temperatura, ventana de contexto |
| `rag` | RAG y contexto | RAG vs Fine-tuning vs Contexto, árbol de decisión |
| `herramientas` | Herramientas de Claude | Búsqueda web, Files API, Batch API, Projects |
| `ecosistema` | Ecosistema Claude | Planes, cobro web vs API, créditos |
| `costos` | Costos reales | Calculadora interactiva, widget API vs Managed Agents |
| `quiz1` | Quiz M1 | 6 preguntas fundamentos |
| `cierre-m1` | Cierre M1 | Resumen, próximos pasos |

### M2 — Prompts y Agentes (8 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `prompting` | Prompt Engineering | Estructura, técnicas, ejemplos |
| `agentes` | Arquitectura de Agentes | Chatbot vs Workflow vs Agente, comparador interactivo |
| `patrones` | 8 patrones avanzados | Tabs 1-4 y 5-8, código en acordeones |
| `usos` | Cuándo usar agentes | ROI calculator, casos de uso por volumen |
| `plataformas` | Claude vs GPT-4o | Tabla comparativa, casos de elección |
| `quiz2` | Quiz M2 | 6 preguntas prompts y agentes |
| `cierre-m2` | Cierre M2 | Resumen M2 |

### M3 — Plataformas y herramientas (13 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `mcp` | Qué es MCP | Protocolo, arquitectura, servidores |
| `mcp-usar` | Cómo usar MCP | Web, API, Desktop — por entorno |
| `mcp-avanzado` | MCP Avanzado | FastMCP, servidores custom, seguridad |
| `subagentes` | Subagentes | Orquestador y delegados, jerarquías |
| `console-org` | Console — Workspaces | Organización, API keys, spend limits |
| `console-compilar` | Console — Herramientas | Files API, Batch API, Skills |
| `console` | Managed Agents en Console | 4 IDs, crear agente, environments |
| `managed` | Managed Agents — concepto | Vaults, Sessions, cuándo usar |
| `skills` | Agent Skills | Skills vs System Prompt, instalación |
| `claude-code` | Claude Code | CLI para coding agéntico |
| `cowork` | Claude Cowork | Desktop tool, automatización |
| `quiz3a` | Quiz M3A | 6 preguntas plataformas |
| `cierre-m3a` | Cierre M3A | Resumen plataformas |

### M4 — Implementación práctica (7 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `nocode` | Workflows sin código | n8n + Claude, diseño de flujos |
| `tam` | Agente de integraciones | V1/V2/V3 progresivo, calcTAM2 |
| `python` | Python para Claude | SDK, tool use, código en acordeones |
| `ejercicios` | Ejercicios prácticos | Laboratorios guiados |
| `ejemplos` | Casos por sector | 8 casos: banca, e-commerce, salud, logística, docs, BI, gobierno, logística |
| `quiz3` | Quiz M4 | 6 preguntas implementación |
| `cierre-m3` | Cierre M4 | Resumen módulo |

### M5 — AWS Bedrock (7 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `bedrock-intro` | Intro Bedrock | Catálogo multi-proveedor, casos de uso |
| `bedrock-tech` | Bedrock Técnico | Converse API vs InvokeModel |
| `bedrock-costos` | Bedrock Costos | On-demand vs Provisioned, comparativa |
| `bedrock-practica` | Lab práctico | Configuración, primer agente |
| `bedrock-agents` | Bedrock Agents | Action Groups, Knowledge Bases |
| `quiz5` | Quiz M5 | 6 preguntas Bedrock |
| `cierre-m5` | Cierre M5 | Resumen Bedrock |

### M6 — Google Vertex AI (6 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `vertex-intro` | Intro Vertex AI | Model Garden, habilitar Claude |
| `vertex-tech` | Vertex Técnico | AnthropicVertex SDK, sin API key |
| `vertex-practica` | Lab Vertex | Primer llamado, configuración |
| `vertex-avanzado` | Vertex Avanzado | Grounding, RAG Engine, Veo 3 |
| `quiz6` | Quiz M6 | 6 preguntas Vertex AI |
| `cierre-m6` | Cierre M6 | Resumen Vertex |

### M7 — Referencia y seguridad (8 páginas)

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `glosario` | Glosario | Términos LLMs, agentes, plataforma — 3 categorías colapsables |
| `seg-datos` | Seguridad de datos | Retención 7/30 días, ZDR, cifrado |
| `seg-api-vs-agents` | Seguridad API vs Agents | WIF, Vault, comparativa |
| `seg-planes` | Seguridad por plan | Free/Pro/Max/Team/Enterprise/API |
| `seg-practicas` | Buenas prácticas | Checklist de implementación segura |
| `seg-advertencias` | Advertencias críticas | HITL, datos sensibles, regulación |
| `recursos` | Recursos | Links oficiales, comunidades, herramientas |
| `cierre-m4` | Cierre M7 | Resumen final del bootcamp |

### Evaluación

| ID | Título | Elementos clave |
|----|--------|-----------------|
| `examen` | Examen final | 15 preguntas, 70% para aprobar, referencias a lecciones |

---

## Convenciones de clases CSS

| Clase | Uso |
|-------|-----|
| `.page` | Contenedor de página (display:none por defecto) |
| `.page.on` | Página activa (display:block) |
| `.pi` | Page inner — wrapper de contenido |
| `.ey` | Eyebrow — label de módulo/posición |
| `.obj-bar` | Objetivo de la lección (barra verde) |
| `.note .teal/.gold/.red/.blue` | Callouts de diferentes tipos |
| `.note-hd` | Header de un callout |
| `.acc` | Acordeón colapsable |
| `.acc-hd` | Header del acordeón (clickable) |
| `.acc-body` | Cuerpo del acordeón (hidden/visible) |
| `.wiz` | Wizard con tabs |
| `.wt` | Tab button del wizard |
| `.wp` | Tab panel del wizard |
| `.card` | Tarjeta de contenido |
| `.step` | Paso numerado |
| `.tbl` | Tabla con estilos |
| `.code` | Bloque de código |
| `.nav-btns` | Contenedor de botones de navegación |
| `.btn .btn-p` | Botón primario (teal) |
| `.btn .btn-g` | Botón ghost (secondary) |
