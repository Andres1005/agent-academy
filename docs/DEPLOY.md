# Guía de Deployment — Agent Academy

## Opción 1: Vercel + GitHub (recomendado)

### Setup inicial (una sola vez)

1. **Push a GitHub**
   ```bash
   git init
   git add .
   git commit -m "chore: initial commit"
   git remote add origin https://github.com/[usuario]/agent-academy.git
   git push -u origin main
   ```

2. **Conectar Vercel**
   - Ir a [vercel.com](https://vercel.com) → New Project
   - Import Git Repository → seleccionar `agent-academy`
   - Framework Preset: **Other**
   - Build Command: *(dejar vacío)*
   - Output Directory: `.` (punto — raíz del proyecto)
   - Click **Deploy**

3. **Resultado**
   - URL de producción: `https://agent-academy.vercel.app` (o custom domain)
   - Cada push a `main` despliega automáticamente
   - Cada PR genera un preview URL

### Variables de entorno
Este proyecto no requiere variables de entorno (es 100% estático).

---

## Opción 2: GitHub Pages

1. En el repo GitHub: **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` / Folder: `/ (root)`
4. Save → esperar ~2 minutos
5. URL: `https://[usuario].github.io/agent-academy/`

**Nota:** GitHub Pages sirve desde la raíz, pero las rutas relativas (`src/css/main.css`) funcionan correctamente porque index.html está en la raíz.

---

## Opción 3: Netlify

```toml
# netlify.toml (crear en raíz si se usa Netlify)
[build]
  publish = "."
  command = ""

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```

---

## Opción 4: Servidor propio (Nginx)

```nginx
server {
    listen 80;
    server_name academy.masiv.com;
    root /var/www/agent-academy;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|svg|png|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Dominio personalizado en Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Add `academy.masiv.com`
3. En tu DNS: agregar CNAME `academy` → `cname.vercel-dns.com`
4. Vercel gestiona HTTPS automáticamente (Let's Encrypt)

---

## Monitoreo

Para monitoreo básico de uptime, agregar en `index.html` antes de `</body>`:

```html
<!-- Vercel Analytics (opcional, gratuito) -->
<script defer src="/_vercel/insights/script.js"></script>
```

Activar en Vercel Dashboard → Project → Analytics.
