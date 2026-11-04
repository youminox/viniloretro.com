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

const DECADE_LINKS = [
  { slug: "decada-50", label: "Años 50", count: 600 },
  { slug: "decada-60", label: "Años 60", count: 255 },
  { slug: "decada-70", label: "Años 70", count: 235 },
  { slug: "decada-80", label: "Años 80", count: 208 },
  { slug: "decada-90", label: "Años 90", count: 243 },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [decadesOpen, setDecadesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [indexData, setIndexData] = useState<SearchIndexItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && indexData.length === 0) {
      fetch("/search-index.json")
        .then((res) => res.json())
        .then((data: SearchIndexItem[]) => setIndexData(data))
        .catch(() => {});
    }
  }, [searchOpen, indexData.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDecadesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults =
    query.trim().length >= 2
      ? indexData
          .filter((item) => {
            const q = query
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            const titleNorm = item.t
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            return (
              titleNorm.includes(q) ||
              item.s.includes(q) ||
              item.n.toLowerCase().includes(q)
            );
          })
          .slice(0, 8)
      : [];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-amber-400 shadow-sm ring-2 ring-amber-500/40 transition-transform duration-300 group-hover:rotate-45">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" strokeDasharray="3 2" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <span className="block text-xl font-extrabold tracking-tight text-stone-900">
              Vinilo<span className="text-primary">Retro</span>
            </span>
            <span className="block text-[11px] font-medium text-stone-500 -mt-1">
              Tocadiscos & Cultura Musical
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-700">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link
            href="/resenas/"
            className="hover:text-primary transition-colors"
          >
            Reseñas de Tocadiscos
          </Link>
          <Link
            href="/curiosidades/"
            className="hover:text-primary transition-colors"
          >
            Guías y Agujas
          </Link>

          {/* Decades Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDecadesOpen((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer py-2"
            >
              Décadas Musicales
              <svg
                className={`h-4 w-4 transition-transform ${
                  decadesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {decadesOpen && (
              <div className="absolute left-0 mt-2 w-60 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                {DECADE_LINKS.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${d.slug}/`}
                    onClick={() => setDecadesOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-light-bg hover:text-primary transition-colors"
                  >
                    <span>🎵 {d.label}</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                      {d.count}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/cantantes-de-opera/"
            className="hover:text-primary transition-colors"
          >
            Ópera
          </Link>
          <Link
            href="/hola-hablamos/"
            className="hover:text-primary transition-colors"
          >
            Sobre Nosotros
          </Link>
        </nav>

        {/* Actions: Quick Search + Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-700 hover:border-primary hover:text-primary transition cursor-pointer"
            aria-label="Buscar artículos"
          >
            <svg
              className="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="hidden sm:inline">Buscar en 1,895 guías...</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden rounded-xl border border-stone-200 p-2 text-stone-700 hover:bg-stone-100"
            aria-label="Abrir menú"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Instant Search Bar */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-stone-50/95 px-4 py-4 shadow-inner">
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca tocadiscos, agujas, cantantes de los 50, 60, 70, 80, 90 u ópera..."
                autoFocus
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pl-11 text-sm text-stone-900 shadow-xs focus:border-primary focus:outline-none"
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

            {searchResults.length > 0 && (
              <div className="mt-2 divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white shadow-lg max-h-80 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={`${item.c}-${item.s}`}
                    href={`/${item.c}/${item.s}/`}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-light-bg transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {item.t}
                      </p>
                      <span className="text-xs font-medium text-primary">
                        {item.n} · {item.r} de lectura
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      Ver →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-5 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/resenas/"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-light-bg px-3.5 py-2.5 text-xs font-bold text-primary-dark"
            >
              🎛️ Reseñas de Tocadiscos
            </Link>
            <Link
              href="/curiosidades/"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-light-bg px-3.5 py-2.5 text-xs font-bold text-primary-dark"
            >
              💿 Guías y Agujas
            </Link>
            {DECADE_LINKS.map((d) => (
              <Link
                key={d.slug}
                href={`/${d.slug}/`}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-semibold text-stone-700"
              >
                🎵 {d.label} ({d.count})
              </Link>
            ))}
            <Link
              href="/cantantes-de-opera/"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-semibold text-stone-700"
            >
              🎭 Cantantes de Ópera
            </Link>
            <Link
              href="/hola-hablamos/"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-stone-200 px-3.5 py-2 text-xs font-semibold text-stone-700"
            >
              👋 Sobre Charlie Lingán
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
