import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type PageProps = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const tags = getAllTags();
  const current = tags.find((t) => t.slug === tag);
  if (!current) {
    return { title: "Etiqueta no encontrada" };
  }
  return {
    title: current.name,
    description: `Artículos sobre ${current.name.toLowerCase()} en el blog de Wabog.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const tags = getAllTags();
  const current = tags.find((t) => t.slug === tag);

  if (!current || posts.length === 0) notFound();

  return (
    <>
      <section className="tag-hero">
        <div className="container">
          <h1 className="tag-title">#{current.name}</h1>
          <p className="tag-sub">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"} sobre{" "}
            {current.name.toLowerCase()}.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="tag-list">
          {tags.map((t) => (
            <Link
              key={t.slug}
              href={`/tag/${t.slug}`}
              className={`tag-pill${t.slug === tag ? " is-active" : ""}`}
            >
              {t.name}
              <span aria-hidden="true"> · {t.count}</span>
            </Link>
          ))}
        </div>

        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}