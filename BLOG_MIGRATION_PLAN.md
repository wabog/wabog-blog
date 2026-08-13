# PLAN.md — Migración del blog Wabog: Ghost → Next.js

## Contexto
- Blog actual: Ghost CMS en `blog.wabog.com` (contenido público, sin members/newsletter).
- Landing: repo estático (`elgidiom/wabog`) en GitHub Pages para `wabog.com` — **NO se toca**.
- Blog nuevo: proyecto **separado** en `~/Documentos/wabog_blog` (Next.js).
- Contenido actual: **< 20 posts en español**; objetivo futuro: **publicación diaria** para SEO y AEO.
- GA4: `G-3MJTDC5BSK`. Identidad: `--primary-100:#1454fa`, `--bg-100:#fffefb`, tipografía Inter (tokens en `wabog/style.css`).

## Decisiones tomadas
- **Migración total** (no híbrido con Worker): Ghost se cierra definitivamente.
- Slugs **1:1** para no romper URLs/SEO.
- Blog sigue en el subdominio `blog.wabog.com`.
- Formato de autoría: **MDX con schema de bloques tipados** (Zod validado) — rápido de escribir a diario, tipado como una consulta de artículo.

## Fase 1 — Fundación: modelo de contenido tipado
- Schema Zod `BlogBlock` = unión discriminada: `paragraph`, `heading`, `list`, `quote`, `image`, `embed`, `code`, `callout`, `cta_pill`, `faq`, `tldr`, `table`, `divider`, `youtube`.
- Frontmatter tipado por post: `title, slug, date, updatedAt, tags, excerpt, coverImage, readingTime (calculado), author`.
- `lib/registry.tsx`: mapea cada bloque a su componente React tipado.
- Estructura: `content/posts/<slug>.mdx` + contenido en bloques.

## Fase 2 — Migración de los <20 posts de Ghost
1. Export JSON en Ghost (`Settings → Export`).
2. Script one-off `scripts/migrate-ghost.mjs`: parsea export → convierte HTML/mobiledoc a bloques tipados.
3. Preservar slugs, reescribir enlaces internos.
4. Re-hospedar imágenes (fuera de Ghost) en `/public` o CDN antes de apagarlo.
5. Verificación manual post a post.

## Fase 3 — App Next.js (blog.wabog.com)
- App Router, contenido **SSG en build** (+ rebuild por CI en cada push).
- Rutas: `/` (lista), `/post/[slug]`, `/tag/[tag]`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, 404.
- **SEO/AEO**: JSON-LD `Article`/`BlogPosting`, `FAQPage` alimentado por bloques `faq`, `Blog` en home, `BreadcrumbList`, OG/Twitter cards, canonical, `rss.xml` imitando el feed de Ghost, scripts de lectura de IA (llms.txt opcional).
- Diseño: navbar/footer consistentes con la landing (GEMINI.md las exige iguales en todas las páginas). GA4 `G-3MJTDC5BSK` + tracking con `data-analytics`.

## Fase 4 — Deploy y corte
- Opción A (CF nativo): **Cloudflare Pages + OpenNext** (encaja con el stack CF).
- Opción B (más simple): Vercel + `CNAME blog.wabog.com`.
- DNS: apuntar `blog.wabog.com` → nuevo host; verificar (URLs, RSS, performance) antes de dar de baja Ghost. Rollback = volver DNS.

## Fase 5 — Workflow de publicación diaria
- `npm run post:nuevo`: scaffold MDX con frontmatter y bloques vacíos.
- CI/CD: PR → validación Zod de todos los posts en build → previews → merge = publicar.
- `scripts/audit.mjs`: valida que cada post tenga `excerpt`, `tags`, `cover`, bloques válidos.

## Riesgos
- Imágenes propias de Ghost deben re-hospedarse (revisar de dónde viene cada una).
- Enlaces internos entre posts → reescribir.
- El buscador de Ghost se pierde; evaluar Fuse.js cuando haya >30 posts.

## Criterio de éxito
- Todos los URLs de Ghost responden igual en Next.js (mismo path), RSS/sitemap consistentes, Ghost dado de baja, y un post nuevo publicado en < 5 min con el flujo editorial.