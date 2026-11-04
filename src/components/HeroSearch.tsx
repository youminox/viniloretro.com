"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchIndexItem {
  t: string;
  s: string;
  c: string;
  n: string;
  r: string;
}

const POPULAR_CHIPS = [
  { label: "Tocadiscos", query: "tocadiscos" },
  { label: "Aguja / Púa", query: "aguja" },
  { label: "Años 80", query: "anos 80" },
  { label: "Años 90", query: "90" },
  { label: "Ópera Italiana", query: "opera en italia" },
  { label: "Jazz Años 50", query: "jazz" },
  { label: "Bluetooth", query: "bluetooth" },
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [indexData, setIndexData] = useState<SearchIndexItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchIndexItem[]) => setIndexData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedQuery = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const results =
    normalizedQuery.length >= 2
      ? indexData
          .filter((item) => {
            const titleNorm = item.t
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            return (
              titleNorm.includes(normalizedQuery) ||
              item.s.includes(normalizedQuery) ||
              item.n.toLowerCase().includes(normalizedQuery)
            );
          })
          .slice(0, 8)
      : [];

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl relative">
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 h-5 w-5 text-amber-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          placeholder="Busca entre 1,895 artículos: tocadiscos, agujas, cantantes de los 80, ópera..."
          className="w-full rounded-2xl border-2 border-amber-400/40 bg-white py-4 pl-12 pr-28 text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 shadow-2xl focus:border-amber-400 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-600 hover:bg-stone-200 cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Popular Search Chips */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-amber-200/80 font-semibold">
          Búsquedas rápidas:
        </span>
        {POPULAR_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              setQuery(chip.query);
              setIsFocused(true);
            }}
            className="rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 px-3 py-1 font-semibold text-stone-200 transition cursor-pointer backdrop-blur-xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Instant Results Dropdown */}
      {isFocused && normalizedQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-[62px] z-40 rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl text-left max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm text-stone-500">
              No encontramos resultados exactos para &ldquo;{query}&rdquo;.
              Prueba con otra palabra clave (ej. &ldquo;tocadiscos&rdquo;,
              &ldquo;aguja&rdquo;, &ldquo;años 80&rdquo;).
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {results.map((item) => (
                <Link
                  key={`${item.c}-${item.s}`}
                  href={`/${item.c}/${item.s}/`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-light-bg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">
                      {item.t}
                    </p>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      {item.n} · ⏱️ {item.r}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    Leer guía →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
