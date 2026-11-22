import Link from "next/link";
import { SITE_NAME } from "@/lib/data";

const TOP_SEO_FOOTER_LINKS = [
  {
    href: "/curiosidades/cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo/",
    label: "¿Cuándo dejaron de usarse los discos de vinilo?",
  },
  {
    href: "/resenas/encuentra-el-tocadiscos-perfecto-en-el-corte-ingles/",
    label: "Tocadiscos en El Corte Inglés: Guía de Compra",
  },
  {
    href: "/resenas/encuentra-el-mejor-tocadiscos-de-vinilo-en-liverpool-guia-de-compra-definitiva/",
    label: "Mejor Tocadiscos de Vinilo en Liverpool",
  },
  {
    href: "/curiosidades/explorando-la-nostalgia-como-se-llaman-las-maquinas-tocadiscos/",
    label: "¿Cómo se llaman las máquinas tocadiscos?",
  },
  {
    href: "/decada-80/cantantes-de-pop-en-los-anos-80-en-argentina/",
    label: "Cantantes de Pop de los Años 80 en Argentina",
  },
  {
    href: "/decada-90/cantantes-representativos-de-los-90-en-brasil/",
    label: "Cantantes Representativos de los 90 en Brasil",
  },
  {
    href: "/decada-80/cantantes-de-pop-en-los-anos-80-en-italia/",
    label: "Cantantes de Pop en los Años 80 en Italia",
  },
  {
    href: "/cantantes-de-opera/principales-exponentes-de-la-opera-en-italia/",
    label: "Principales Exponentes de la Ópera en Italia",
  },
  {
    href: "/decada-90/cantantes-de-los-90-nacidos-en-espana/",
    label: "Top Cantantes de los 90 Nacidos en España",
  },
  {
    href: "/decada-90/solistas-femeninas-de-los-90-chile/",
    label: "Solistas Femeninas de los 90 en Chile",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-stone-950 font-black">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white">
                Vinilo<span className="text-amber-400">Retro</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Portal especializado en tocadiscos de vinilo, mantenimiento de
              agujas, sonido analógico y la mayor enciclopedia en español sobre
              los cantantes e íconos de los años 50, 60, 70, 80, 90 y la ópera.
            </p>
            <p className="text-xs text-stone-400">
              Proyecto editorial dirigido por{" "}
              <Link
                href="/hola-hablamos/"
                className="font-semibold text-amber-400 hover:underline"
              >
                Charlie Lingán
              </Link>
              .
            </p>
          </div>

          {/* Categories & Decades */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Secciones y Décadas
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/resenas/"
                  className="hover:text-white transition-colors"
                >
                  Reseñas de Tocadiscos (33)
                </Link>
              </li>
              <li>
                <Link
                  href="/curiosidades/"
                  className="hover:text-white transition-colors"
                >
                  Guías, Agujas y Curiosidades (62)
                </Link>
              </li>
              <li>
                <Link
                  href="/decada-50/"
                  className="hover:text-white transition-colors"
                >
                  Música de la Década de los 50 (600)
                </Link>
              </li>
              <li>
                <Link
                  href="/decada-60/"
                  className="hover:text-white transition-colors"
                >
                  Música de la Década de los 60 (255)
                </Link>
              </li>
              <li>
                <Link
                  href="/decada-70/"
                  className="hover:text-white transition-colors"
                >
                  Música de la Década de los 70 (235)
                </Link>
              </li>
              <li>
                <Link
                  href="/decada-80/"
                  className="hover:text-white transition-colors"
                >
                  Música de la Década de los 80 (208)
                </Link>
              </li>
              <li>
                <Link
                  href="/decada-90/"
                  className="hover:text-white transition-colors"
                >
                  Música de la Década de los 90 (243)
                </Link>
              </li>
              <li>
                <Link
                  href="/cantantes-de-opera/"
                  className="hover:text-white transition-colors"
                >
                  Cantantes de Ópera (258)
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa-del-sitio/"
                  className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Mapa del Sitio (1,895 Guías)
                </Link>
              </li>
            </ul>
          </div>

          {/* Top SEO Articles (Internal Authority Boost) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              Guías y Rankings Más Consultados
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-stone-400">
              {TOP_SEO_FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-amber-300 transition-colors line-clamp-1"
                  >
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} {SITE_NAME} (viniloretro.com). Todos
              los derechos reservados.
            </p>
            <p className="text-[11px] text-stone-500">
              En calidad de Afiliado de Amazon, {SITE_NAME} obtiene ingresos por
              las compras adscritas que cumplen los requisitos aplicables.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/hola-hablamos/"
              className="hover:text-white transition-colors"
            >
              Sobre Nosotros / Contacto
            </Link>
            <Link
              href="/politica-privacidad/"
              className="hover:text-white transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/politica-de-cookies/"
              className="hover:text-white transition-colors"
            >
              Política de Cookies
            </Link>
            <Link
              href="/aviso-legal/"
              className="hover:text-white transition-colors"
            >
              Aviso Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
