import Link from "next/link";
import type { Post } from "@/lib/types";
import { Cover } from "./cover";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function PostCard({ post }: { post: Post }) {
  const primaryTag = post.tags[0];
  return (
    <article className="post-card">
      <Link href={`/${post.slug}`} className="post-card-media" aria-label={post.title}>
        <Cover src={post.coverImage} title={post.title} />
      </Link>
      <div className="post-card-body">
        {primaryTag ? (
          <Link href={`/tag/${primaryTag.slug}`} className="post-tag-pill">
            {primaryTag.name}
          </Link>
        ) : null}
        <Link href={`/${post.slug}`} className="post-card-title">
          {post.title}
        </Link>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-footer">
          <div className="post-meta">
            <span>{formatDate(post.date)}</span>
            <span className="dot" />
            <span>{post.readingTime} min de lectura</span>
          </div>
        </div>
      </div>
    </article>
  );
}