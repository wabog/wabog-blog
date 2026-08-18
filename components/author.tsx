/* eslint-disable @next/next/no-img-element */
export function authorInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function isBrandAuthor(name: string): boolean {
  return /wabog/i.test(name);
}

export function AuthorAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`author-avatar author-avatar--${size}${isBrandAuthor(name) ? " author-avatar--brand" : ""}`}
      aria-hidden="true"
    >
      {isBrandAuthor(name) ? (
        <img src="/waboglogo.webp" alt="" />
      ) : (
        authorInitials(name)
      )}
    </span>
  );
}

export function AuthorBio({ author }: { author: string }) {
  const brand = isBrandAuthor(author);
  const name = brand ? "Equipo Wabog" : author;
  const description = brand
    ? "Wabog automatiza la vigilancia de procesos judiciales y te notifica por WhatsApp cada actuación relevante de la Rama Judicial."
    : "Contenido editorial del blog de Wabog: guías y análisis para la práctica legal en Colombia.";

  return (
    <aside className="author-bio">
      <AuthorAvatar name={author} size="lg" />
      <div className="author-bio-body">
        <span className="author-bio-name">Escrito por {name}</span>
        <p className="author-bio-text">{description}</p>
        <a
          href="https://wabog.com"
          target="_blank"
          rel="noopener noreferrer"
          className="author-bio-link"
          data-analytics="article_author_cta"
        >
          Conoce Wabog <span aria-hidden="true">→</span>
        </a>
      </div>
    </aside>
  );
}
