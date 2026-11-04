"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post, Category } from "@/lib/data";

interface BlogExplorerProps {
  initialPosts: Post[];
  categories: Category[];
}

export default function BlogExplorerClient({
  initialPosts,
  categories,
}: BlogExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCat =
      selectedCategory === "all" || post.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.categoryName.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-10 space-y-5">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Filtrar artículos por título, artista o tema..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pl-11 text-sm text-stone-900 focus:border-primary focus:bg-white focus:outline-none"
            />
            <svg
              className="absolute left-3.5 top-3.5 h-5 w-5 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setVisibleCount(12);
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-md"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            Destacados ({initialPosts.length})
          </button>
          {categories
            .filter((c) => c.count > 1)
            .map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setVisibleCount(12);
                }}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white shadow-md"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
        </div>
      </div>

      {/* Posts Grid — Dinamica.pe Card Layout */}
      {displayedPosts.length === 0 ? (
        <div className="py-16 text-center text-stone-500">
          No se encontraron artículos en esta vista. Usa el buscador superior
          para consultar las 1,895 guías completas.
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${post.category}/${post.slug}/`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] overflow-hidden bg-stone-100 relative">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-stone-900/85 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-amber-300 shadow">
                    {post.categoryName}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs text-stone-400">
                    <span>⏱️ {post.readTime} de lectura</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">
                      ✓ Guía Verificada
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 transition-colors group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-stone-600 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Leer artículo completo
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < filteredPosts.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="rounded-xl border-2 border-primary bg-white px-7 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white transition cursor-pointer"
              >
                Mostrar más artículos ({filteredPosts.length - visibleCount}{" "}
                restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
