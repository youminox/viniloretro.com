import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: `Información sobre el uso de cookies en ${SITE_NAME} (${SITE_URL}).`,
  alternates: {
    canonical: `${SITE_URL}/politica-de-cookies/`,
  },
};

export default function PoliticaDeCookiesPage() {
  const pageData = getPageBySlug("politica-de-cookies");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Política de Cookies" },
            ]}
          />
          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-stone-900">
            Política de Cookies
          </h1>
          {pageData && (
            <div
              className="article-content mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
