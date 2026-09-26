import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://blog.wabog.com";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const posts = getAllPosts();
  const lastBuildDate = posts[0]?.updatedAt ?? posts[0]?.date ?? new Date().toISOString();
  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${SITE_URL}/${post.slug}/`;
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(post.excerpt)}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Blog de Wabog</title>
        <link>${SITE_URL}/</link>
        <description>Guías sobre vigilancia judicial, IA legal y LegalTech en Colombia.</description>
        <language>es-CO</language>
        <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
