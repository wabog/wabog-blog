import type { BlogBlock } from "./types";

const WORDS_PER_MINUTE = 200;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function headingId(text: string): string {
  return slugify(text);
}

export function estimateReadingTime(blocks: BlogBlock[]): number {
  let words = 0;

  const count = (text: string) => {
    words += text.trim().split(/\s+/).filter(Boolean).length;
  };

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        count(block.text);
        break;
      case "quote":
      case "tldr":
        count(block.text);
        break;
      case "code":
        count(block.code);
        break;
      case "heading":
        count(block.text);
        break;
      case "list":
        for (const item of block.items) count(item);
        break;
      case "callout":
        count(block.text);
        if (block.title) count(block.title);
        break;
      case "faq":
        for (const item of block.items) {
          count(item.question);
          count(item.answer);
        }
        break;
      case "table":
        for (const row of block.rows) for (const cell of row) count(cell);
        break;
      default:
        break;
    }
  }

  if (words === 0) return 1;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function withReadingTime<T extends { blocks: BlogBlock[] }>(post: T): T & { readingTime: number } {
  return { ...post, readingTime: estimateReadingTime(post.blocks) };
}