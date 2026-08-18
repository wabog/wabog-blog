import fs from "node:fs";
import path from "node:path";
import { estimateReadingTime } from "./reading-time";
import type { BlogTag, Post } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

/** Taxonomía curada y alineada con el producto: slug -> nombre visible. */
const CURATED_TAGS: Record<string, string> = {
  "vigilancia-judicial": "Vigilancia judicial",
  "ia-legal": "IA para abogados",
  legaltech: "LegalTech",
  "marketing-legal": "Marketing jurídico",
  "panorama-juridico": "Panorama jurídico",
};

/** Alias de tags legados de Ghost hacia la taxonomía curada. */
const TAG_ALIASES: Record<string, string> = {
  "vigilancia-judicial-2": "vigilancia-judicial",
  "alertas-judiciales": "vigilancia-judicial",
  notificaciones: "vigilancia-judicial",
  whatsapp: "vigilancia-judicial",
  ia: "ia-legal",
  confidencialidad: "ia-legal",
  "etica-legal": "ia-legal",
  errores: "ia-legal",
  automatizacion: "legaltech",
  marketing: "marketing-legal",
  abogados: "marketing-legal",
  clientes: "marketing-legal",
  legal: "panorama-juridico",
  tendencias: "panorama-juridico",
};

/** Posts sin tags en Ghost, clasificados manualmente por slug. */
const POST_TAG_OVERRIDES: Record<string, string[]> = {
  "como-crear-estrategia-legaltech-despacho": ["legaltech"],
  "por-que-tu-despacho-necesita-software-de-vigilancia-judicial-en-2026-4": [
    "vigilancia-judicial",
  ],
  "el-futuro-de-la-practica-legal-en-colombia-3-tendencias-que-estan-transformando-los-despachos": [
    "panorama-juridico",
    "legaltech",
  ],
};

function normalizeTags(post: Post): BlogTag[] {
  const source = POST_TAG_OVERRIDES[post.slug] ?? post.tags.map((t) => TAG_ALIASES[t.slug] ?? t.slug);

  const seen = new Set<string>();
  const tags: BlogTag[] = [];
  for (const slug of source) {
    const name = CURATED_TAGS[slug];
    if (!name || seen.has(slug)) continue;
    seen.add(slug);
    tags.push({ slug, name });
  }
  return tags.length > 0 ? tags : [{ slug: "guias", name: "Guías" }];
}

function loadPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));

  return files
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")) as Post;
      return {
        ...raw,
        tags: normalizeTags(raw),
        readingTime: estimateReadingTime(raw.blocks),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const posts: Post[] = loadPosts();

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags.some((t) => t.slug === tag));
}

export function getAllTags(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const current = map.get(tag.slug);
      if (current) {
        current.count += 1;
      } else {
        map.set(tag.slug, { slug: tag.slug, name: tag.name, count: 1 });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getCuratedTagOrder(): string[] {
  return Object.keys(CURATED_TAGS);
}

/** Número de semana ISO de una fecha (1–53). */
export function getWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Artículo destacado semanal por rotación determinista: según la semana del
 * año se elige un post de forma estable durante toda la semana (sin backend).
 */
export function getFeaturedPost(): { post: Post | undefined; week: number } {
  const now = new Date();
  const week = getWeekNumber(now);
  const post = posts.length > 0 ? posts[week % posts.length] : undefined;
  return { post, week };
}