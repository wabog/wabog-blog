import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleRenderer } from "@/components/blocks/article-renderer";
import { Cover } from "@/components/cover";
import { Toc, buildToc } from "@/components/toc";
import { formatDate } from "@/components/post-card";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { BlogBlock, Post } from "@/lib/types";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Artículo no encontrado" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function ArticleJsonLd({ post }: { post: Post }) {
  const faqs = post.blocks.filter((b): b is Extract<BlogBlock, { type: "faq" }> => b.type === "faq");
  const url = `https://blog.wabog.com/${post.slug}`;

  const graph: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage,
      datePublished: post.date,
      dateModified: post.updatedAt ?? post.date,
      author: { "@type": "Organization", name: "Wabog" },
      publisher: {
        "@type": "Organization",
        name: "Wabog",
        logo: { "@type": "ImageObject", url: "https://blog.wabog.com/waboglogo.webp" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: "es",
    },
  ];

  if (faqs.length > 0) {
    for (const faq of faqs) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      });
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = buildToc(post.blocks);

  return (
    <>
      <ArticleJsonLd post={post} />
      <article>
        <header className="article-hero">
          <div className="article-container">
            <div className="article-tags">
              {post.tags.map((tag) => (
                <Link key={tag.slug} href={`/tag/${tag.slug}`} className="post-tag-pill">
                  {tag.name}
                </Link>
              ))}
            </div>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-deck">{post.excerpt}</p>
            <div className="article-meta">
              <span>{post.author}</span>
              <span className="dot" />
              <span>{formatDate(post.date)}</span>
              {post.updatedAt && post.updatedAt !== post.date ? (
                <>
                  <span className="dot" />
                  <span>Actualizado {formatDate(post.updatedAt)}</span>
                </>
              ) : null}
              <span className="dot" />
              <span>{post.readingTime} min de lectura</span>
            </div>
          </div>
        </header>

        {post.coverImage ? (
          <div className="article-container">
            <div className="article-cover">
              <Cover src={post.coverImage} title={post.title} />
            </div>
          </div>
        ) : null}

        <div className="article-container">
          <div className="article-layout">
            <ArticleRenderer blocks={post.blocks} />
            <Toc items={toc} />
          </div>

          <div className="article-end-cta">
            <h3>¿Listo para no volver a perder un término?</h3>
            <p>Vigila tus radicados en tiempo real y recibe las actuaciones de tus procesos por WhatsApp.</p>
            <a
              href="https://wabog.com"
              className="cta-pill"
              data-analytics="article_cta_empieza_gratis"
              data-analytics-location="article_end"
            >
              Empieza 15 días gratis
            </a>
          </div>
        </div>
      </article>
    </>
  );
}