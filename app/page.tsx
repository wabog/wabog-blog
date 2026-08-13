import { FeaturedPost } from "@/components/featured-post";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getAllTags, getLatestPost } from "@/lib/posts";
import type { Post } from "@/lib/types";

export const metadata = {
  title: "Blog de Wabog — Gestión legal inteligente",
  description:
    "Guías y novedades sobre la Rama Judicial de Colombia, radicados, vigilancia procesal y automatización legal con la IA de Wabog.",
};

function groupPostsByTag(posts: Post[]) {
  const sections: { slug: string; name: string; posts: Post[] }[] = [];
  for (const tag of getAllTags()) {
    const tagPosts = posts.filter((p) => p.tags.some((t) => t.slug === tag.slug));
    if (tagPosts.length > 0) {
      sections.push({ slug: tag.slug, name: tag.name, posts: tagPosts });
    }
  }
  return sections;
}

export default function HomePage() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latest = getLatestPost();
  const sections = groupPostsByTag(posts);

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="home-eyebrow">El blog de Wabog · Colombia</span>
              <h1 className="home-title">
                La justicia colombiana, explicada para no perder tus{" "}
                <em>términos</em>
              </h1>
              <p className="home-subtitle">
                Guías prácticas sobre la Rama Judicial, radicados y vigilancia
                procesal. Escritas por el equipo de Wabog para abogados y
                despachos que quieren dejar de revisar procesos a mano.
              </p>
              <div className="home-actions">
                <a href="https://wabog.com" className="btn btn-accent" data-analytics="hero_empieza_gratis">
                  Empieza 15 días gratis
                </a>
                <a href="#temas" className="btn btn-ghost" data-analytics="hero_ver_guias">
                  Recorre por tema <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <div className="hero-stamp" aria-hidden="true">
              <div className="hero-stamp-ring">
                <span>⚖</span>
                <strong>{posts.length}</strong>
                <small>guías publicadas</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="chapters" id="temas">
        <div className="container">
          <span className="chapters-kicker">Recorre por tema</span>
          <div className="chapters-grid">
            {getAllTags().map((tag) => (
              <a key={tag.slug} href={`/tag/${tag.slug}`} className="chapter-card">
                <span className="chapter-card-top">
                  <span className="chapter-card-kicker">CAP.</span>
                  <span className="chapter-card-count">{tag.count} {tag.count === 1 ? "artículo" : "artículos"}</span>
                </span>
                <strong className="chapter-card-title">{tag.name}</strong>
                <span className="chapter-card-link">Ver todo <span aria-hidden="true">→</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <section key={section.slug} className="cat-section">
          <div className="container">
            <div className="cat-head">
              <span className="cat-kicker">Capítulo {String(index + 1).padStart(2, "0")}</span>
              <h2 className="cat-title">{section.name}</h2>
              <p className="cat-sub">
                {section.posts.length}{" "}
                {section.posts.length === 1 ? "artículo sobre este tema." : "artículos sobre este tema."}
              </p>
            </div>

            <div className="cat-layout">
              <FeaturedPost post={section.posts[0]} />
              <div className="posts-grid">
                {section.posts.slice(1).map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {latest ? (
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
      ) : null}
    </>
  );
}