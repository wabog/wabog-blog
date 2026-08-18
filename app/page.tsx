import Link from "next/link";
import { FeaturedPost } from "@/components/featured-post";
import { PostCard } from "@/components/post-card";
import { SearchBar } from "@/components/search";
import { getAllPosts, getAllTags, getCuratedTagOrder, getLatestPost } from "@/lib/posts";

export const metadata = {
  title: "Blog de Wabog — Gestión legal inteligente",
  description:
    "Guías y novedades sobre la Rama Judicial de Colombia, radicados, vigilancia procesal y automatización legal con la IA de Wabog.",
};

export default function HomePage() {
  const posts = getAllPosts();
  const latest = getLatestPost();
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

  const rest = latest ? posts.filter((p) => p.slug !== latest.slug) : posts;

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
              <a href="https://wabog.com" className="btn btn-accent" data-analytics="hero_empieza_gratis">
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
            {orderedTags.map((t, i) => (
              <Link
                key={t.slug}
                href={`/tag/${t.slug}`}
                className="topic-card"
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
            ))}
          </div>
        </div>
      </section>

      {latest ? (
        <section className="home-section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Recién publicado</h2>
              <span className="section-sub">{latest.date} · {latest.readingTime} min</span>
            </div>
            <FeaturedPost post={latest} />
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
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
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
              <a href="https://wabog.com" className="cta-pill" data-analytics="closing_empieza_gratis">
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