import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Las URLs del blog terminan en "/" (next.config: trailingSlash). Un enlace interno sin
// "/" final responde 308 y Google puede indexarlo como URL duplicada (GROWTH-42).
const dir = new URL('../content/posts/', import.meta.url).pathname;
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const slugs = new Set(files.map((f) => f.replace(/\.json$/, '')));

function* strings(value, path = '') {
  if (typeof value === 'string') yield [path, value];
  else if (Array.isArray(value)) for (const [i, v] of value.entries()) yield* strings(v, `${path}[${i}]`);
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

test('los enlaces internos del blog llevan "/" final y apuntan a un post que existe', () => {
  const errors = [];
  for (const file of files) {
    const post = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    for (const [path, text] of strings(post)) {
      for (const [url] of text.matchAll(/https?:\/\/(?:www\.)?blog\.wabog\.com(?:\/[^\s"'<>)\]]*)?/g)) {
        const { pathname } = new URL(url);
        if (pathname === '/' || /\.[a-z0-9]+$/i.test(pathname)) continue;
        if (!pathname.endsWith('/')) errors.push(`${file} ${path}: ${url} sin "/" final`);
        const slug = pathname.split('/').filter(Boolean)[0];
        if (pathname.split('/').filter(Boolean).length === 1 && !slugs.has(slug))
          errors.push(`${file} ${path}: ${url} no corresponde a ningún post`);
      }
      if (/(^|\.)(href|url)$/.test(path) && text.startsWith('/') && !text.split(/[?#]/)[0].endsWith('/'))
        errors.push(`${file} ${path}: ${text} sin "/" final`);
    }
  }
  assert.deepEqual(errors, []);
});
