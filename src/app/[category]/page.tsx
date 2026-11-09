import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostBySlug,
  getPostsByCategory,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
} from "@/lib/data";

type Params = Promise<{ category: string }>;

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: `Categoría no encontrada | ${SITE_NAME}` };
  }

  const canonicalUrl = `${SITE_URL}/${category.slug}/`;
  return {
    title: `${category.name}: Guías, Historia y Artículos Destacados`,
    description: category.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | ${SITE_NAME}`,
      description: category.description,
      url: canonicalUrl,
      type: "website",
      locale: "es_ES",
      siteName: SITE_NAME,
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    // If accessed as /:slug/ without category prefix, permanently redirect to /:category/:slug/
    const matchingPost = getPostBySlug(categorySlug);
    if (matchingPost) {
      permanentRedirect(getPostUrl(matchingPost));
    }
    notFound();
  }

  const posts = getPostsByCategory(categorySlug);
  const allCategories = getAllCategories().filter((c) => c.count > 1);

  // Prioritize Top SEO posts at the top of the category page
  const sortedPosts = [
    ...posts.filter((p) => p.isTopSeo),
    ...posts.filter((p) => !p.isTopSeo),
  ];

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: category.name },
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} | ${SITE_NAME}`,
    description: category.description,
    url: `${SITE_URL}/${category.slug}/`,
    inLanguage: "es",
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <main className="min-h-screen bg-white pb-20">
        {/* Category Header Banner */}
        <section className="bg-gradient-to-br from-stone-950 via-[#231710] to-stone-900 py-14 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <span className="inline-block rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-300">
              💿 {posts.length} Artículos Publicados
            </span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
              {category.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base sm:text-lg text-stone-300 leading-relaxed">
              {category.description}
            </p>

            {/* Other Category Quick Switcher */}
            <div className="mt-8 flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}/`}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    c.slug === category.slug
                      ? "bg-amber-500 text-stone-950"
                      : "bg-white/10 text-stone-200 hover:bg-white/20"
                  }`}
                >
                  {c.name} ({c.count})
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <AdBanner className="mb-10" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => (
              <Link
                key={post.id}
                href={getPostUrl(post)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] overflow-hidden bg-stone-100 relative">
                  <img
                    src={getImageUrl(post.featuredImageUrl)}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {post.isTopSeo && (
                    <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold text-stone-950 shadow">
                      ★ Destacado
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs text-stone-400">
                    <span>⏱️ {post.readTime} de lectura</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">
                      ✓ Guía Verificada
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-stone-600 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Leer guía completa →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
