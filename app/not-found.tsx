import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="article-container">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Este artículo no existe</h1>
        <p className="notfound-text">
          La página que buscas no está en el blog de Wabog. Tal vez el enlace
          cambió o el contenido ya no está disponible.
        </p>
        <Link href="/" className="btn btn-accent" data-analytics="notfound_volver_blog">
          Volver al blog
        </Link>
      </div>
    </div>
  );
}