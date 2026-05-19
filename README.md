# Agent Academy — Bootcamp de IA Empresarial

> **© 2026 Andrés Muñoz / Masiv Integrations — Todos los derechos reservados.**  
> Reproducción prohibida sin autorización expresa por escrito.

---

## ¿Qué es?

Bootcamp interactivo de IA diseñado para equipos de integraciones: TAMs, PMs y desarrolladores. Cubre desde fundamentos de LLMs hasta agentes en producción con Claude, AWS Bedrock y Google Vertex AI.

**59 páginas · 7 módulos · 6 quizzes + examen final · 8 casos sectoriales reales**

---

## Estructura del proyecto

```
agent-academy/
│
├── index.html                  ← App completa (standalone, no build)
├── vercel.json                 ← Deployment config para Vercel
├── .gitignore
├── README.md
│
├── src/
│   ├── css/
│   │   └── main.css            ← Hoja de estilos (fuente de edición)
│   ├── js/
│   │   ├── data.js             ← Quiz data, ejemplos, constantes
│   │   └── engine.js           ← Navegación, quiz engine, widgets
│   └── html/
│       ├── nav.html            ← Sidebar (referencia)
│       └── pages.html          ← Todas las páginas (referencia)
│
├── public/
│   └── favicon.svg
│
└── docs/
    ├── CHANGELOG.md
    ├── CONTENT.md
    └── DEPLOY.md
```

> **Importante:** `index.html` es autocontenido para producción — incluye todo. Los archivos en `src/` son la fuente de edición. Vercel sirve directamente la raíz del repo.

---

## Módulos

| # | Módulo | Páginas | Temas principales |
|---|--------|---------|-------------------|
| M1 | IA Fundamental | 9 | LLMs, tokens, RAG, costos, ecosistema Claude |
| M2 | Prompts y Agentes | 8 | Prompt Engineering, 8 patrones de agentes |
| M3 | Plataformas y herramientas | 13 | MCP, Console, Managed Agents, Skills, Claude Code |
| M4 | Implementación práctica | 7 | n8n, agente de integraciones, casos por sector |
| M5 | AWS Bedrock | 7 | Arquitectura, Converse API, Bedrock Agents |
| M6 | Google Vertex AI | 6 | Model Garden, Grounding, RAG Engine |
| M7 | Referencia y seguridad | 8 | Glosario, seguridad, planes, buenas prácticas |
| — | Evaluación | 1 | Examen final (15 preguntas, 70% para aprobar) |

---

## Deployment

### Vercel (recomendado — 0 configuración)

```bash
# Opción A: CLI
npm i -g vercel
vercel              # preview
vercel --prod       # producción
```

**Opción B: GitHub + Vercel (recomendado para CI/CD)**
1. Push el repo a GitHub
2. En [vercel.com](https://vercel.com) → Import Git Repository
3. Framework: **Other** (sitio estático, no build)
4. Deploy → URL automática en cada push a `main`

### GitHub Pages

En el repo: **Settings → Pages → Source: Deploy from branch → main / (root)**

URL resultante: `https://[usuario].github.io/agent-academy/`

### Local

```bash
# Python (incluido en macOS/Linux)
python3 -m http.server 3000

# Node
npx serve .

# VS Code: instalar extensión "Live Server", click derecho en index.html
```

---

## Flujo de trabajo Git recomendado

```
main          ← producción, auto-deploy a Vercel
├── develop   ← integración de features
└── fix/xxx   ← hotfixes (merge directo a main + develop)
```

```bash
# Setup inicial
git clone https://github.com/[usuario]/agent-academy.git
cd agent-academy

# Nueva feature
git checkout -b feature/nuevo-modulo
# ... editar src/css/main.css, src/js/data.js, etc.
# ... sincronizar cambios a index.html
git add .
git commit -m "feat: agrega módulo de RCS"
git push origin feature/nuevo-modulo
# → Pull Request a develop → merge → auto-deploy
```

---

## Cómo editar contenido

### Editar estilos

```
1. Editar src/css/main.css
2. Copiar el bloque completo al <style> de index.html (reemplazar todo)
```

### Editar preguntas de quiz

```
1. Abrir src/js/data.js
2. Buscar el quiz: const QS (M1/M2/M4), QS_M3A, QS_M5, QS_M6, EXAM_QS
3. Estructura de cada pregunta:
   {
     q:   'Texto de la pregunta',
     opts: ['A. opción', 'B. opción', 'C. opción', 'D. opción'],
     cor:  1,           // índice correcto (0-3)
     lv:   'Básico',    // Básico | Intermedio | Avanzado
     exp:  'Explicación de por qué esta es la respuesta correcta',
     lec:  'mcp'        // id de la página de repaso
   }
4. Copiar los cambios al <script> de index.html
```

### Editar una página existente

```
1. Abrir src/html/pages.html
2. Buscar id="pg-[nombre]" (ej: id="pg-mcp")
3. El div de la página tiene esta estructura:
   <div class="page" id="pg-[nombre]"><div class="pi">
     <div class="ey">M3 · 1 de 13</div>
     <div class="obj-bar">🎯 Objetivo de la lección</div>
     <h1>Título</h1>
     [contenido]
     <div class="nav-btns">
       <button onclick="go('pagina-anterior',nb('..'))">← Anterior</button>
       <button onclick="go('pagina-siguiente',nb('..'))">Siguiente →</button>
     </div>
   </div></div>
4. Editar y sincronizar a index.html
```

### Agregar una página nueva

```
1. Crear el div en src/html/pages.html (ver estructura arriba)
2. Agregar el id al array ALL en src/js/data.js (posición correcta)
3. Agregar el botón de nav en el sidebar: src/html/nav.html
4. Sincronizar todos los cambios a index.html
```

---

## Stack técnico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| HTML | HTML5 semántico | Sin framework — máxima portabilidad |
| CSS | CSS3 custom props | Variables de tema, dark mode nativo |
| JS | Vanilla ES2020 | Sin dependencias, bundle 0KB |
| Fuentes | Google Fonts (CDN) | Instrument Sans + JetBrains Mono |
| Deploy | Vercel Static | CDN global, HTTPS automático, 0 config |

---

## Créditos

**Diseñado y desarrollado por Andrés Muñoz**  
TAM / Masiv Integrations  
© 2026 — Todos los derechos reservados
