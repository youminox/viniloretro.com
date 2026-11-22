import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: `Aviso legal y condiciones de uso de ${SITE_NAME} (${SITE_URL}).`,
  alternates: {
    canonical: `${SITE_URL}/aviso-legal/`,
  },
};

export default function AvisoLegalPage() {
  const pageData = getPageBySlug("aviso-legal");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Aviso Legal" },
            ]}
          />
          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-stone-900">
            Aviso Legal
          </h1>
          {pageData && (
            <div
              className="article-content mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          )}
          <section className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-xl font-extrabold text-stone-900">
              Participación en el Programa de Afiliados de Amazon
            </h2>
            <p className="mt-2 text-sm text-stone-700 leading-relaxed">
              En calidad de Afiliado de Amazon, <strong>{SITE_NAME}</strong> (
              {SITE_URL}) obtiene ingresos por las compras adscritas que cumplen
              los requisitos aplicables. Algunos enlaces publicados en nuestras
              guías y reseñas dirigen a Amazon.es y Amazon.com bajo los
              identificadores oficiales del programa Amazon Associates, sin que
              ello suponga ningún coste adicional para el lector.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
