#!/usr/bin/env node
// One-off: migra los posts de Ghost (Content API) a content/posts/<slug>.json
// con bloques tipados y descarga las covers a public/covers/.
//
// Uso: node --env-file=.env scripts/migrate-ghost.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const API_URL = process.env.GHOST_API_URL ?? "https://blog.wabog.com";
const CONTENT_KEY = process.env.GHOST_CONTENT_KEY;

if (!CONTENT_KEY) {
  console.error("Falta GHOST_CONTENT_KEY en .env");
  process.exit(1);
}

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  aacute: "á",
  eacute: "é",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
  uuml: "ü",
  Aacute: "Á",
  Eacute: "É",
  Iacute: "Í",
  Oacute: "Ó",
  Uacute: "Ú",
  Ntilde: "Ñ",
  Uuml: "Ü",
};

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z0-9]+);/gi, (m, name) => NAMED_ENTITIES[name] ?? m);
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

function isoDate(iso) {
  if (!iso) return undefined;
  return iso.slice(0, 10);
}

const BLOCKS_RE = /<(h2|h3|h4|p)([^>]*)>([\s\S]*?)<\/\1>/g;
const CTA_RE = /<!--kg-card-begin: html-->[\s\S]*?<!--kg-card-end: html-->/;

function htmlToBlocks(html) {
  const withoutCta = html.replace(CTA_RE, "");
  const blocks = [];

  for (const match of withoutCta.matchAll(BLOCKS_RE)) {
    const [, tag, , inner] = match;
    const text = stripTags(inner);
    if (!text) continue;

    if (tag === "p") {
      blocks.push({ type: "paragraph", text });
    } else {
      blocks.push({
        type: "heading",
        level: Number(tag.slice(1)),
        text,
      });
    }
  }

  if (blocks.length === 0 && stripTags(html)) {
    blocks.push({ type: "paragraph", text: stripTags(html) });
  }

  return blocks;
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`imagen ${url}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

async function main() {
  const url = `${API_URL}/ghost/api/content/posts/?key=${CONTENT_KEY}&limit=all&formats=html&include=tags,authors`;
  console.log(`Consultando ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Error: HTTP ${res.status}`);
    process.exit(1);
  }
  const data = await res.json();
  const posts = (data.posts ?? []).sort((a, b) =>
    (a.published_at ?? "").localeCompare(b.published_at ?? "")
  );

  console.log(`Posts encontrados: ${posts.length}`);

  const coversDir = path.join(ROOT, "public", "covers");
  fs.mkdirSync(coversDir, { recursive: true });
  const postsDir = path.join(ROOT, "content", "posts");
  fs.mkdirSync(postsDir, { recursive: true });

  let coversSaved = 0;
  for (const p of posts) {
    let coverImage;

    if (p.feature_image) {
      try {
        const ext = path.extname(new URL(p.feature_image).pathname) || ".webp";
        const dest = path.join(coversDir, `${p.slug}${ext}`);
        await downloadImage(p.feature_image, dest);
        coverImage = `/covers/${p.slug}${ext}`;
        coversSaved += 1;
      } catch (err) {
        console.warn(`  ! cover fallida para ${p.slug}: ${err.message}`);
      }
    }

    const tags = (p.tags ?? []).map((t) => ({ slug: t.slug, name: t.name }));

    const post = {
      slug: p.slug,
      title: p.title,
      date: isoDate(p.published_at),
      updatedAt: isoDate(p.updated_at),
      tags,
      excerpt: (p.custom_excerpt || p.excerpt || "").trim(),
      coverImage,
      readingTime: Math.max(1, p.reading_time ?? 1),
      author: p.primary_author?.name ?? "Equipo Wabog",
      blocks: htmlToBlocks(p.html ?? ""),
    };

    fs.writeFileSync(
      path.join(postsDir, `${p.slug}.json`),
      JSON.stringify(post, null, 2) + "\n"
    );
    console.log(`  ok ${p.slug} (${post.blocks.length} bloques, cover=${coverImage ?? "no"})`);
  }

  console.log(`\nDone. Covers guardadas: ${coversSaved}. JSON en content/posts/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
