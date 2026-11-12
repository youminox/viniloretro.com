import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  getAllCategories,
  getPostsByCategory,
  getPostUrl,
  SITE_NAME,
  SITE_URL,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Mapa del Sitio e Índice Completo de Guías",
  description:
    "Índice general completo con las 1,895 guías de compra de tocadiscos, mantenimiento de agujas, reseñas y enciclopedia musical de los años 50, 60, 70, 80, 90 y ópera.",
  alternates: {
    canonical: `${SITE_URL}/mapa-del-sitio/`,
  },
};

export default function MapaDelSitioPage() {
  const categories = getAllCategories().filter((c) => c.count > 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Mapa del Sitio" },
            ]}
          />

          <div className="mt-6 border-b border-stone-200 pb-8">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-dark">
              💿 Índice General Completo
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-stone-900">
              Mapa del Sitio — Todas las Guías y Artículos de {SITE_NAME}
            </h1>
            <p className="mt-2 max-w-3xl text-stone-600 text-sm sm:text-base">
              Explora el archivo completo de <strong>1,895 artículos</strong>{" "}
              organizados por sección temática y década musical.
            </p>

            {/* Quick Category Jump Links */}
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#cat-${cat.slug}`}
                  className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-xs font-bold text-stone-800 transition hover:border-primary hover:text-primary"
                >
                  {cat.name} ({cat.count})
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-14">
            {categories.map((cat) => {
              const catPosts = getPostsByCategory(cat.slug);
              return (
                <section
                  key={cat.slug}
                  id={`cat-${cat.slug}`}
                  className="scroll-mt-24"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-200 pb-3 mb-5">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                      <Link
                        href={`/${cat.slug}/`}
                        className="hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </h2>
                    <Link
                      href={`/${cat.slug}/`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Ver categoría ({catPosts.length} artículos) →
                    </Link>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-xs sm:text-sm">
                    {catPosts.map((post) => (
                      <li key={post.id} className="truncate py-0.5">
                        <Link
                          href={getPostUrl(post)}
                          className="text-stone-700 hover:text-primary transition-colors"
                        >
                          • {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
