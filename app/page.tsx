import Link from "next/link";
import type { CSSProperties } from "react";
import { FeaturedPost } from "@/components/featured-post";
import { PostCard } from "@/components/post-card";
import { SearchBar } from "@/components/search";
import { getAllPosts, getAllTags, getCuratedTagOrder, getFeaturedPost } from "@/lib/posts";

const TOPIC_COLORS: Record<string, { bg: string; fg: string }> = {
  "vigilancia-judicial": { bg: "#003f8f", fg: "#ffffff" },
  "ia-legal": { bg: "#1454fa", fg: "#ffffff" },
  legaltech: { bg: "#6e80ff", fg: "#ffffff" },
  "marketing-legal": { bg: "#71c4ef", fg: "#003f8f" },
  "panorama-juridico": { bg: "#e5e2ff", fg: "#003f8f" },
};

export const metadata = {
  title: "Blog de Wabog — Gestión legal inteligente",
  description:
    "Guías y novedades sobre la Rama Judicial de Colombia, radicados, vigilancia procesal y automatización legal con la IA de Wabog.",
};

export default function HomePage() {
  const posts = getAllPosts();
  const { post: featured, week } = getFeaturedPost();
  const tags = getAllTags();
  const tagOrder = getCuratedTagOrder();
  const orderedTags = tagOrder
    .map((slug) => tags.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const searchIndex = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags.map((tag) => tag.name),
  }));

  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;
  const visible = rest.slice(0, 12);

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="hero-center">
            <span className="home-eyebrow">El blog de Wabog · Colombia</span>
            <h1 className="home-title">
              La justicia colombiana, explicada para no perder tus{" "}
              <em>términos</em>
            </h1>

            <div className="search-hero">
              <SearchBar posts={searchIndex} />
            </div>

            <div className="home-actions">
              <a href="https://app.wabog.com" className="btn btn-accent" data-analytics="hero_empieza_gratis">
                Empieza 15 días gratis
              </a>
              <a href="#articulos" className="btn btn-ghost" data-analytics="hero_ver_guias">
                Ver artículos <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-topics">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">La ruta jurídica</h2>
              <p className="section-sub">
                Recorré el blog por tema, como si fueran los autos de tu expediente.
              </p>
            </div>
          </div>
          <div className="topics-row">
            {orderedTags.map((t, i) => {
              const color = TOPIC_COLORS[t.slug] ?? TOPIC_COLORS[Object.keys(TOPIC_COLORS)[0]];
              return (
                <Link
                  key={t.slug}
                  href={`/tag/${t.slug}`}
                  className="topic-card"
                  style={{ "--topic-bg": color.bg, "--topic-fg": color.fg } as CSSProperties}
                  data-analytics={`home_tema_${t.slug}`}
                >
                  <span className="topic-instance">
                    Auto N.° {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="topic-name">{t.name}</span>
                  <span className="topic-count">
                    {t.count} artículo{t.count === 1 ? "" : "s"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {featured ? (
        <section className="home-section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2 className="section-title">Destacado de la semana</h2>
                <p className="section-sub">
                  Semana {week} · {featured.readingTime} min de lectura
                </p>
              </div>
            </div>
            <FeaturedPost post={featured} />
          </div>
        </section>
      ) : null}

      <section id="articulos" className="home-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Últimos artículos</h2>
              <p className="section-sub">
                {posts.length} guías para optimizar la operación de tu despacho.
              </p>
            </div>
          </div>
          <div className="posts-grid">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="section-footer">
            <Link href="/articulos" className="btn btn-outline" data-analytics="home_ver_todos">
              Ver todos los artículos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-closing-cta">
        <div className="container">
          <div className="closing-card">
            <h3>¿Listo para no volver a perder un término?</h3>
            <p>
              Vigila tus radicados en tiempo real y recibe cada actuación de
              tus procesos por WhatsApp.
            </p>
            <div className="closing-actions">
              <a href="https://app.wabog.com" className="cta-pill" data-analytics="closing_empieza_gratis">
                Empieza 15 días gratis
              </a>
              <a href="https://wabog.com" className="closing-secondary" data-analytics="closing_ver_sitio">
                Conoce cómo funciona →
              </a>
            </div>
            <small className="closing-note">Sin tarjeta. Sin compromiso.</small>
          </div>
        </div>
      </section>
    </>
  );
}