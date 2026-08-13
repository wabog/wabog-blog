import type { BlogBlock } from "@/lib/types";
import { headingId } from "@/lib/reading-time";

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function buildToc(blocks: BlogBlock[]): TocItem[] {
  const items: TocItem[] = [];
  for (const block of blocks) {
    if (block.type === "heading" && block.level !== 4) {
      items.push({
        id: block.id ?? headingId(block.text),
        text: block.text,
        level: block.level,
      });
    }
  }
  return items;
}

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="toc" aria-label="Contenido del artículo">
      <span className="toc-label">Contenido</span>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} data-level={item.level}>
          {item.text}
        </a>
      ))}
    </nav>
  );
}