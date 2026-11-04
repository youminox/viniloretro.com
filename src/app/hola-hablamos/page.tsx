import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "¡Hola! ¿Hablamos? — Charlie Lingán, Fundador de Vinilo Retro",
  description:
    "Conoce la historia de Charlie Lingán, emprendedor y fundador de Vinilo Retro. Ponte en contacto para consultas sobre tocadiscos de vinilo y cultura musical.",
  alternates: {
    canonical: `${SITE_URL}/hola-hablamos/`,
  },
};

export default function HolaHablamosPage() {
  const pageData = getPageBySlug("hola-hablamos");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Charlie Lingán",
      alternateName: "Carlos Eden Lingan Borja",
      url: `${SITE_URL}/hola-hablamos/`,
      image: `${SITE_URL}/images/charlie-lingan.jpg`,
      jobTitle: "Emprendedor y Editor Fundador",
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      sameAs: ["https://charlielingan.com/"],
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "¡Hola! ¿Hablamos? — Charlie Lingán" },
            ]}
          />

          <div className="mt-6 rounded-3xl border border-stone-200 bg-light-bg p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center gap-8">
            <img
              src="/images/charlie-lingan.jpg"
              alt="Charlie Lingán"
              className="h-36 w-36 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
            />
            <div>
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-primary-dark">
                Fundador & Editor de {SITE_NAME}
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900">
                ¡Hola! ¿Hablamos?... Charlie Lingán, emprendedor que te escucha
              </h1>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Bienvenido a <strong>Vinilo Retro</strong>, nuestra plataforma
                dedicada a los tocadiscos de vinilo, el cuidado de colecciones
                analógicas y la historia de los grandes cantantes de los años 50
                a los 90.
              </p>
            </div>
          </div>

          {pageData && (
            <div
              className="article-content mt-10 max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
