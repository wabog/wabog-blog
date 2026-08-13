export type BlogTag = {
  slug: string;
  name: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  tags: BlogTag[];
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  author: string;
};

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3 | 4; id?: string; text: string }
  | { type: "list"; ordered: false; items: string[] }
  | { type: "list"; ordered: true; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "embed"; url: string; title?: string }
  | { type: "code"; lang?: string; code: string }
  | { type: "callout"; tone: "info" | "success" | "warning" | "danger"; title?: string; text: string }
  | { type: "cta_pill"; label: string; href: string }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "tldr"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "divider" }
  | { type: "youtube"; videoId: string };

export type Post = PostMeta & {
  blocks: BlogBlock[];
};