import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import TurntableAdvisor from "@/components/TurntableAdvisor";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import {
  getFeaturedTurntableGuides,
  getTopSeoPosts,
  getPostsByCategory,
  getAllCategories,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
} from "@/lib/data";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Mejores Tocadiscos de Vinilo, Guías de Agujas y Música de los 50 a los 90`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const DECADE_CARDS = [
  {
    slug: "decada-50",
    era: "Años 50",
    title: "La Era Dorada de los 50",
    desc: "El origen del Rock & Roll, las grandes voces del Jazz, Blues, Bolero y Tango en formato LP.",
    badge: "600 artículos",
    accent: "from-amber-900 to-stone-900",
  },
  {
    slug: "decada-60",
    era: "Años 60",
    title: "La Revolución de los 60",
    desc: "La invasión británica, el auge del Soul, la psicodelia y los cantautores que cambiaron el mundo.",
    badge: "255 artículos",
    accent: "from-stone-900 to-amber-950",
  },
  {
    slug: "decada-70",
    era: "Años 70",
    title: "Extraordinarios Años 70",
    desc: "Rock sinfónico, la fiebre de la música Disco, Funk y las grandes baladas románticas en vinilo.",
    badge: "235 artículos",
    accent: "from-amber-950 to-stone-900",
  },
  {
    slug: "decada-80",
    era: "Años 80",
    title: "Inolvidables Años 80",
    desc: "Íconos del Pop y Rock en Argentina, España, Italia, Brasil, México y Estados Unidos.",
    badge: "208 artículos",
    accent: "from-stone-900 to-stone-800",
  },
  {
    slug: "decada-90",
    era: "Años 90",
    title: "Clásicos de los Años 90",
    desc: "Grandes solistas, bandas de rock alternativo, pop latino y voces legendarias de fin de siglo.",
    badge: "243 artículos",
    accent: "from-amber-900 to-stone-950",
  },
  {
    slug: "cantantes-de-opera",
    era: "Música Lírica",
    title: "Cantantes de Ópera",
    desc: "Tenores, sopranos y barítonos inmortales de Italia, España, Francia y los grandes teatros del mundo.",
    badge: "258 artículos",
    accent: "from-stone-950 to-amber-900",
  },
];

const HOME_FAQS = [
  {
    q: "¿Qué tener en cuenta al comprar un tocadiscos de vinilo hoy en día?",
    a: "Lo más importante es verificar si incluye preamplificador de phono integrado (para conectarlo directamente a altavoces activos) o si requiere amplificador externo, elegir tracción por correa para escuchar en casa con menos vibración, y asegurarse de que utilice una cápsula con aguja de diamante reemplazable.",
  },
  {
    q: "¿Cada cuánto tiempo se debe cambiar la aguja o púa de un tocadiscos?",
    a: "Una púa de diamante estándar dura entre 500 y 1,000 horas de reproducción, mientras que las agujas genéricas de zafiro o rubí duran entre 50 y 100 horas. Si notas distorsión en las voces agudas o que el brazo salta en discos limpios, es momento de reemplazarla.",
  },
  {
    q: "¿Cuándo dejaron de usarse masivamente los discos de vinilo y por qué han vuelto?",
    a: "El vinilo cedió su lugar principal frente al CD a finales de los años 80 y principios de los 90 por la portabilidad digital. Sin embargo, en la última década ha vivido un renacimiento histórico gracias a la calidez de su sonido analógico, el arte de sus portadas y el ritual de escucha consciente.",
  },
  {
    q: "¿Cómo se llaman los aparatos antiguos para reproducir discos de vinilo?",
    a: "Según la época y el país, han recibido nombres como fonógrafo, gramófono (de manivela y discos de pizarra a 78 RPM), picú (pick-up), tornamesa, giradiscos, combinado o tocadiscos de vinilo.",
  },
];

export default function HomePage() {
  const turntableGuides = getFeaturedTurntableGuides(6);
  const topSeoPosts = getTopSeoPosts(9);
  const categories = getAllCategories();

  // Combine a balanced set of 48 posts across categories for the interactive explorer
  const explorerPosts = [
    ...turntableGuides,
    ...topSeoPosts,
    ...getPostsByCategory("curiosidades").slice(0, 8),
    ...getPostsByCategory("resenas").slice(0, 8),
    ...getPostsByCategory("decada-80").slice(0, 6),
    ...getPostsByCategory("decada-90").slice(0, 6),
    ...getPostsByCategory("cantantes-de-opera").slice(0, 6),
    ...getPostsByCategory("decada-50").slice(0, 6),
  ].filter(
    (post, index, self) => self.findIndex((p) => p.id === post.id) === index
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* Hero Section with Instant Search */}
        <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-[#231710] to-stone-900 py-20 sm:py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
              💿 Enciclopedia del Sonido Analógico y Tocadiscos
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Descubre la Magia de los{" "}
              <span className="text-amber-400">Tocadiscos de Vinilo</span> y la
              Música que Hizo Historia
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-stone-300 leading-relaxed">
              Guías técnicas de compra, mantenimiento de agujas y altavoces, y
              más de <strong className="text-white">1,895 artículos</strong>{" "}
              sobre los cantantes e íconos de los años 50, 60, 70, 80, 90 y la
              ópera.
            </p>

            <div className="mt-9">
              <HeroSearch />
            </div>

            {/* Quick Category Pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/resenas/"
                className="rounded-full bg-amber-500 px-4 py-2 text-xs font-extrabold text-stone-950 hover:bg-amber-400 transition shadow-md"
              >
                🎛️ Reseñas de Tocadiscos
              </Link>
              <Link
                href="/curiosidades/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                💎 Agujas, Púas y Cuidado
              </Link>
              <Link
                href="/decada-50/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🎷 Años 50
              </Link>
              <Link
                href="/decada-60/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🎸 Años 60
              </Link>
              <Link
                href="/decada-70/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🕺 Años 70
              </Link>
              <Link
                href="/decada-80/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🎹 Años 80
              </Link>
              <Link
                href="/decada-90/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🎤 Años 90
              </Link>
              <Link
                href="/cantantes-de-opera/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🎭 Cantantes de Ópera
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Turntable Advisor Section */}
        <section className="py-14 bg-light-bg border-b border-stone-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TurntableAdvisor />
          </div>
        </section>

        {/* AdSense Banner #1 */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <AdBanner />
        </div>

        {/* Section 1: Featured Turntable Buying & Care Guides */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Especialistas en Tornamesas y Audio Analógico
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900">
                  Guías Esenciales de Tocadiscos, Agujas y Altavoces
                </h2>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/resenas/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver 33 Reseñas →
                </Link>
                <span className="text-stone-300">|</span>
                <Link
                  href="/curiosidades/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver 62 Guías Técnicas →
                </Link>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {turntableGuides.map((post) => (
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
                    <span className="absolute top-3 left-3 rounded-full bg-stone-900/90 px-3 py-1 text-[11px] font-bold text-amber-300">
                      {post.categoryName}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-stone-400">
                      <span>⏱️ {post.readTime} de lectura</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">
                        ✓ Guía Experta
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-600 line-clamp-3 flex-1">
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
        </section>

        {/* Section 2: Explore by Musical Decades & Opera */}
        <section className="py-16 bg-stone-950 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Enciclopedia Musical en Vinilo
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
                Explora la Historia Musical por Década y Género
              </h2>
              <p className="mt-3 text-stone-400 text-sm sm:text-base">
                Más de 1,800 biografías, rankings por país y análisis de los
                artistas que grabaron los álbumes más importantes del siglo XX.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DECADE_CARDS.map((card) => {
                const samplePosts = getPostsByCategory(card.slug).slice(0, 3);
                return (
                  <div
                    key={card.slug}
                    className={`rounded-2xl border border-stone-800 bg-gradient-to-br ${card.accent} p-6 flex flex-col justify-between transition hover:border-amber-500/60`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-extrabold text-amber-300">
                          {card.era}
                        </span>
                        <span className="text-xs font-semibold text-stone-400">
                          {card.badge}
                        </span>
                      </div>
                      <Link href={`/${card.slug}/`}>
                        <h3 className="mt-4 text-xl font-extrabold text-white hover:text-amber-300 transition-colors">
                          {card.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                        {card.desc}
                      </p>

                      <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-stone-300">
                        {samplePosts.map((sp) => (
                          <li key={sp.id}>
                            <Link
                              href={getPostUrl(sp)}
                              className="hover:text-amber-300 transition-colors line-clamp-1 flex items-center gap-1.5"
                            >
                              <span className="text-amber-400">♪</span>
                              <span>{sp.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/${card.slug}/`}
                      className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-amber-400 hover:text-stone-950 px-4 py-2.5 text-xs font-extrabold text-white transition"
                    >
                      Explorar {card.era} →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Top SEO Trending Articles (Ahrefs + Google Search Console Boost) */}
        <section className="py-16 bg-light-bg border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                🔥 Lo Más Leído en Latinoamérica y España
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900">
                Rankings y Reportajes Destacados de la Comunidad
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Nuestros artículos más consultados en Google y citados en medios
                internacionales como el diario <em>La Razón</em>.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topSeoPosts.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs transition hover:border-primary hover:shadow-md"
                >
                  <img
                    src={getImageUrl(post.featuredImageUrl)}
                    alt={post.title}
                    className="h-22 w-24 shrink-0 rounded-xl object-cover bg-stone-100"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-primary">
                        {post.categoryName}
                      </span>
                      <h3 className="mt-0.5 text-sm font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-stone-400">
                      ⏱️ {post.readTime} · Leer →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AdSense Banner #2 */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <AdBanner />
        </div>

        {/* Section 4: Interactive Article Explorer */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Catálogo Interactivo
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900">
                Explora Nuestras Guías por Categoría
              </h2>
            </div>

            <BlogExplorerClient
              initialPosts={explorerPosts}
              categories={categories}
            />
          </div>
        </section>

        {/* Section 5: Charlie Lingán Author & E-E-A-T Section */}
        <section className="py-16 bg-light-bg border-t border-stone-200">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <img
                src="/images/charlie-lingan.jpg"
                alt="Charlie Lingán — Fundador de Vinilo Retro"
                className="h-32 w-32 sm:h-36 sm:w-36 rounded-2xl object-cover shadow-md shrink-0 border-2 border-amber-400"
                loading="lazy"
              />
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-primary-dark">
                  Dirección Editorial y Experiencia
                </span>
                <h2 className="text-2xl font-extrabold text-stone-900">
                  ¡Hola! Soy Charlie Lingán, apasionado por la música y el
                  emprendimiento
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  En <strong>Vinilo Retro</strong> reunimos guías prácticas,
                  análisis técnicos de tocadiscos y una enciclopedia dedicada a
                  preservar el legado musical de los años 50, 60, 70, 80, 90 y
                  la ópera clásica para todos los amantes del formato analógico
                  en habla hispana.
                </p>
                <div className="pt-2">
                  <Link
                    href="/hola-hablamos/"
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-amber-400 hover:bg-stone-800 transition"
                  >
                    Conoce mi historia y contáctame →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Home FAQ Section */}
        <section className="py-16 bg-white border-t border-stone-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Preguntas Frecuentes
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-stone-900">
                Dudas Comunes sobre Tocadiscos y Discos de Vinilo
              </h2>
            </div>

            <div className="space-y-4">
              {HOME_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-light-bg/60 p-6"
                >
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
