# Wabog Blog

Blog oficial de **Wabog — Gestión legal inteligente**. Next.js (SSG) + contenido MDX con schema de bloques tipado (Zod).

- Repositorio: `github.com/wabog/wabog-blog`
- Producción: `blog.wabog.com` (Cloudflare Pages)
- Plan de migración desde Ghost: ver [`BLOG_MIGRATION_PLAN.md`](BLOG_MIGRATION_PLAN.md)
## Atribución de campañas

`lib/attribution.ts` usa el núcleo sin dependencias `lib/attribution-core.cjs`,
con el mismo contrato que home/landings y Ayuda. Conserva fechas y hasta 50
contactos/30 días en el navegador; al salir transmite un sobre `wbg_touches` de
hasta 8 contactos, además de primero/último legacy. No reinicia la fecha al cruzar
un dominio ni comparte el click ID de una visita con otra.

`npm test` verifica el contrato; `npm run lint` y `npm run build` validan integración.
El E2E entre sitios vive en la rama de app (`tests/attribution_cross_sites_e2e.mjs`):
usa las compilaciones reales y Auth/DB locales, sin tráfico a destinos externos.
Desplegar primero la app compatible (PR #309). No requiere dependencias ni
credenciales nuevas. Hosting existente en Cloudflare Pages; recepción de alerta
real de IT no verificada. No fusionar/publicar sin autorización explícita.
