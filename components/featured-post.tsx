import Link from "next/link";
import type { Post } from "@/lib/types";
import { Cover } from "./cover";
import { formatDate } from "./post-card";

export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="featured-card">
      <Link href={`/${post.slug}`} className="featured-card-media" aria-label={post.title}>
        <Cover src={post.coverImage} title={post.title} />
      </Link>
      <div className="featured-card-body">
        <Link href={`/tag/${post.tags[0]?.slug}`} className="post-tag-pill">
          {post.tags[0]?.name ?? "Wabog"}
        </Link>
        <Link href={`/${post.slug}`} className="featured-card-title">
          {post.title}
        </Link>
        <p className="featured-card-excerpt">{post.excerpt}</p>
        <div className="post-meta">
          <span>{post.author}</span>
          <span className="dot" />
          <span>{formatDate(post.date)}</span>
          <span className="dot" />
          <span>{post.readingTime} min de lectura</span>
        </div>
        <Link href={`/${post.slug}`} className="read-more">
          Leer artículo <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}