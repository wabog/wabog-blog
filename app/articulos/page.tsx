import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Todos los artículos",
  description:
    "Todas las guías de Wabog sobre vigilancia judicial, IA legal y legaltech en Colombia.",
  alternates: { canonical: "/articulos/" },
  openGraph: { url: "/articulos/" },
};

export default function AllPostsPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="tag-hero">
        <div className="container">
          <h1 className="tag-title">Todos los artículos</h1>
          <p className="tag-sub">
            {posts.length} {posts.length === 1 ? "guía" : "guías"} para optimizar
            la operación de tu despacho.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="posts-grid posts-grid--all">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
