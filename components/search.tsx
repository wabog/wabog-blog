"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type SearchIndexItem = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SearchBar({ posts }: { posts: SearchIndexItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const q = normalize(query.trim());
  const hasQuery = q.length > 0;

  const results = hasQuery
    ? posts
        .filter((post) => {
          const haystack = normalize(
            `${post.title} ${post.excerpt} ${post.tags.join(" ")}`
          );
          return haystack.includes(q);
        })
        .slice(0, 6)
    : [];

  const showDropdown = open && (hasQuery ? results.length > 0 || q.length >= 2 : false);

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className="search-bar">
        <span className="search-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="search"
          className="search-input"
          placeholder="Buscar guías, radicados, Rama Judicial…"
          aria-label="Buscar en el blog"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        {hasQuery ? (
          <button
            type="button"
            className="search-clear"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
          >
            ✕
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div className="search-dropdown" role="listbox" aria-label="Resultados de búsqueda">
          {results.length > 0 ? (
            results.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="search-result"
                role="option"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="search-result-title">{post.title}</span>
                <span className="search-result-meta">
                  {post.tags.map((tag) => (
                    <span key={tag} className="search-result-tag">
                      {tag}
                    </span>
                  ))}
                </span>
              </Link>
            ))
          ) : (
            <p className="search-empty">
              Sin resultados para «{query.trim()}». Prueba con otro término.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}