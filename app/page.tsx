import { FeaturedPost } from "@/components/featured-post";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getLatestPost } from "@/lib/posts";

export const metadata = {
  title: "Blog de Wabog — Gestión legal inteligente",
  description:
    "Guías y novedades sobre la Rama Judicial de Colombia, radicados, vigilancia procesal y automatización legal con la IA de Wabog.",
};

export default function HomePage() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featured = getLatestPost();
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <span className="home-eyebrow">El blog de WABOG</span>
          <h1 className="home-title">
            Justicia colombiana explicada y automatizada para tu despacho
          </h1>
          <p className="home-subtitle">
            Guías prácticas sobre la Rama Judicial, radicados y vigilancia
            procesal, y cómo la IA de Wabog te libera del trabajo manual.
          </p>
          <div className="home-actions">
            <a href="https://wabog.com" className="btn btn-accent" data-analytics="hero_empieza_gratis">
              Empieza 15 días gratis
            </a>
            <a href="#guias" className="btn btn-ghost" data-analytics="hero_ver_guias">
              Ver guías
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        {featured ? <FeaturedPost post={featured} /> : null}

        <div className="section-head" id="guias">
          <span className="section-sub">
            {rest.length} {rest.length === 1 ? "guía más" : "guías más"}
          </span>
        </div>

        <div className="posts-grid">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}