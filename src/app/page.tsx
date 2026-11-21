import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TurntableAdvisor from "@/components/TurntableAdvisor";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import ReadingProgress from "@/components/ReadingProgress";
import ClientEffects from "@/components/ClientEffects";
import SplitHeading from "@/components/SplitHeading";
import OpenChatButton from "@/components/OpenChatButton";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import AnalogSoundWave from "@/components/home/AnalogSoundWave";
import VinylOrbit, { type OrbitItem } from "@/components/home/VinylOrbit";
import VinylCounters, { type CounterItem } from "@/components/home/VinylCounters";
import DayNightSlider from "@/components/home/DayNightSlider";
import MomentsCarousel, { type Moment } from "@/components/home/MomentsCarousel";
import SetupBudgetBlock, { type SetupOption } from "@/components/home/SetupBudgetBlock";
import {
  getAllPosts,
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
  title: {
    absolute: `${SITE_NAME} — Mejores Tocadiscos de Vinilo, Guías de Agujas y Música de los 50 a los 90`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const CLAIMS = [
  "Tocadiscos de Vinilo Hi-Fi",
  "Agujas y Púas de Diamante",
  "Preamplificador Phono RIAA",
  "Tracción por Correa & Directa",
  "Altavoces Activos y Pasivos",
  "Discos LP 33⅓ & 45 RPM",
  "Calibración de Contrapeso",
  "Limpieza Antiestática de Surcos",
];

const CLAIMS_2 = [
  "Rock & Roll y Jazz Años 50",
  "Invasión Británica Años 60",
  "Rock Sinfónico y Disco Años 70",
  "Pop y Rock en Español Años 80",
  "Clásicos Alternativos Años 90",
  "Grandes Voces de la Ópera",
  "Masterización 100% Analógica",
  "Coleccionismo Goldmine NM/VG+",
];

const HOME_FAQS = [
  {
    q: "¿Qué tener en cuenta al comprar un tocadiscos de vinilo hoy en día?",
    a: "Lo más importante es verificar si incluye preamplificador de phono integrado (para conectarlo directamente a altavoces activos) o si requiere amplificador externo, elegir tracción por correa para escuchar en casa con menos vibración, y asegurarse de que utilice una cápsula con aguja de diamante reemplazable y contrapeso regulable.",
  },
  {
    q: "¿Cada cuánto tiempo se debe cambiar la aguja o púa de un tocadiscos?",
    a: "Una púa de diamante estándar (cónica o elíptica) dura entre 500 y 1,000 horas de reproducción, mientras que las agujas genéricas de zafiro o rubí duran entre 50 y 100 horas. Si notas distorsión o sibilancia en las voces agudas o que el brazo salta en discos limpios, es momento de reemplazarla.",
  },
  {
    q: "¿Cómo funciona el Asesor Musical y de Vinilos IA de Vinilo Retro?",
    a: "Haz clic en el botón flotante 'Asesor IA Vinilos' en cualquier momento y pregúntale qué tocadiscos comprar según tu presupuesto, cómo conectar tus altavoces, qué aguja de repuesto necesitas o cualquier consulta sobre discos, cantantes y bandas de los años 50, 60, 70, 80, 90 y la ópera. Te responderá al instante y te guiará a las guías exactas de nuestra enciclopedia.",
  },
  {
    q: "¿Cuándo dejaron de usarse masivamente los discos de vinilo y por qué han vuelto?",
    a: "El vinilo cedió su lugar principal frente al CD a finales de los años 80 y principios de los 90 por la portabilidad digital. Sin embargo, en la última década ha vivido un renacimiento histórico gracias a la calidez de su sonido analógico sin compresión agresiva, el arte de sus portadas de 12 pulgadas y el ritual de escucha consciente.",
  },
  {
    q: "¿Cómo conectar un tocadiscos a altavoces modernos o por Bluetooth?",
    a: "Si tu tocadiscos tiene selector PHONO/LINE, ponlo en LINE para conectarlo por cable RCA directo a altavoces activos (autoamplificados). Si solo tiene salida PHONO, necesitas un preamplificador de phono externo o un amplificador con entrada Phono dedicada. Muchos modelos actuales también integran transmisor Bluetooth para auriculares o parlantes inalámbricos.",
  },
  {
    q: "¿Cómo se llaman los aparatos antiguos para reproducir discos de vinilo?",
    a: "Según la época y el país, han recibido nombres como fonógrafo, gramófono (de manivela y discos de pizarra a 78 RPM), picú (pick-up), tornamesa, giradiscos, combinado, consola estereofónica o tocadiscos de vinilo.",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  resenas: "🎛️",
  curiosidades: "💎",
  "decada-50": "🎷",
  "decada-60": "🎸",
  "decada-70": "🕺",
  "decada-80": "🎹",
  "decada-90": "🎤",
  "cantantes-de-opera": "🎭",
  "cantantes-influyentes": "⭐",
};

export default function HomePage() {
  const allPosts = getAllPosts();
  const turntableGuides = getFeaturedTurntableGuides(6);
  const topSeoPosts = getTopSeoPosts(9);
  const categories = getAllCategories();

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

  const orbit: OrbitItem[] = [
    {
      k: "aguja-diamante",
      name: "Aguja y Púa de Diamante",
      img: "/images/Como-saber-cuando-cambiar-la-pua-de-un-tocadiscos.jpg",
      role: "El punto de contacto microscópico con el surco",
      d: "Tallada en diamante cónico o elíptico, recorre las paredes del vinilo con una fuerza de apoyo de 1.5 a 2.5 gramos. Reemplazarla a tiempo (cada 600–800 h) evita el desgaste irreversible de tus discos LP.",
      href: "/curiosidades/como-saber-cuando-cambiar-la-pua-de-un-tocadiscos-consejos-y-senales/",
    },
    {
      k: "tocadiscos-compra",
      name: "Plato y Tracción",
      img: "/images/Que-tener-en-cuenta-al-comprar-un-tocadiscos.jpg",
      role: "Estabilidad de giro a 33⅓ y 45 RPM",
      d: "La tracción por correa aísla las vibraciones del motor para una escucha doméstica silenciosa, mientras que la tracción directa ofrece par alto instantáneo y precisión de cuarzo.",
      href: "/curiosidades/guia-completa-que-tener-en-cuenta-al-comprar-un-tocadiscos/",
    },
    {
      k: "preamp-conexion",
      name: "Preamplificador Phono",
      img: "/images/Como-se-conecta-un-tocadiscos.jpg",
      role: "Ecualización de curva RIAA y ganancia",
      d: "La señal que sale de la cápsula magnética es de apenas 3 a 5 milivoltios. El preamplificador Phono restaura los graves y atenúa los agudos según el estándar RIAA para llevarla a nivel de línea.",
      href: "/curiosidades/conecta-tu-tocadiscos-facilmente-como-se-conecta-un-tocadiscos/",
    },
    {
      k: "altavoces-hifi",
      name: "Altavoces y Acústica",
      img: "/images/altavoces-para-tocadiscos.jpg",
      role: "Proyección estéreo cálida sin retroalimentación",
      d: "Los monitores activos o pasivos deben ubicarse en una superficie independiente del tocadiscos para evitar que las ondas graves hagan vibrar la aguja (acople acústico).",
      href: "/resenas/encuentra-los-mejores-altavoces-para-tu-tocadiscos-calidad-de-sonido-inigualable/",
    },
    {
      k: "decada-50-60",
      name: "Años 50 y 60",
      img: "/images/cantantes-famosos-de-los-anos-50-y-su-influencia-en-el-genero-jazz.jpg",
      role: "855 artículos · Jazz, Rock & Roll e Invasión Británica",
      d: "El nacimiento del LP de microsurco de 12 pulgadas: de las leyendas del Jazz, Blues, Bolero y Elvis en los 50 a la revolución de The Beatles, el Soul y la psicodelia de los 60.",
      href: "/decada-50/",
    },
    {
      k: "decada-70",
      name: "Extraordinarios Años 70",
      img: "/images/Analisis-del-estilo-musical-de-Queen-en-los-70.jpg",
      role: "235 artículos · Rock Sinfónico, Hard Rock y Disco",
      d: "La cumbre del álbum conceptual en vinilo: Queen, Led Zeppelin, Pink Floyd, David Bowie, ABBA, Bob Marley, Carlos Santana y las producciones analógicas más ambiciosas.",
      href: "/decada-70/",
    },
    {
      k: "decada-80-90",
      name: "Años 80 y 90",
      img: "/images/Cantantes-de-pop-en-los-anos-80-en-Argentina.jpg",
      role: "451 artículos · Pop, Synth-Pop y Rock en Español",
      d: "Los grandes himnos de Argentina, España, México, Italia, Brasil y el mundo: del synth-pop y el rock latino de los 80 al rock alternativo, grunge y baladas de los 90.",
      href: "/decada-80/",
    },
    {
      k: "opera-lirica",
      name: "Cantantes de Ópera",
      img: "/images/principales-exponentes-de-la-opera-en-Italia.jpg",
      role: "258 artículos · Tenores, Sopranos y Barítonos",
      d: "La música lírica fue uno de los primeros géneros en brillar en alta fidelidad: grabaciones históricas de La Scala, Nápoles, Viena y Madrid donde el vinilo captura cada armónico vocal.",
      href: "/cantantes-de-opera/",
    },
  ];

  const counters: CounterItem[] = [
    {
      v: allPosts.length,
      dec: 0,
      u: "artículos",
      l: "Enciclopedia Total",
      pct: 100,
      note: "Guías técnicas, reseñas y biografías musicales",
    },
    {
      v: 600,
      dec: 0,
      u: "guías",
      l: "Década de los 50",
      pct: 94,
      note: "Jazz, Rock & Roll, Blues, Tango y Bolero",
    },
    {
      v: 698,
      dec: 0,
      u: "guías",
      l: "Años 60, 70 y 80",
      pct: 96,
      note: "Rock clásico, Psicodelia, Disco y Pop en español",
    },
    {
      v: 258,
      dec: 0,
      u: "artículos",
      l: "Cantantes de Ópera",
      pct: 86,
      note: "Tenores, sopranos y grandes teatros líricos",
    },
    {
      v: 243,
      dec: 0,
      u: "guías",
      l: "Década de los 90",
      pct: 84,
      note: "Rock alternativo, Pop latino y grandes voces",
    },
    {
      v: 95,
      dec: 0,
      u: "manuales",
      l: "Tocadiscos y Agujas",
      pct: 90,
      note: "33 reseñas de tornamesas + 62 guías técnicas",
    },
  ];

  const moments: Moment[] = [
    {
      img: "/images/Que-tener-en-cuenta-al-comprar-un-tocadiscos.jpg",
      t: "Tu Primer Tocadiscos",
      d: "Tracción por correa vs. directa, contrapeso y preamplificador integrado: cómo elegir sin equivocarte.",
      href: "/curiosidades/guia-completa-que-tener-en-cuenta-al-comprar-un-tocadiscos/",
      alt: "Guía para comprar tu primer tocadiscos de vinilo",
      tag: "Guía de Compra",
    },
    {
      img: "/images/Como-saber-cuando-cambiar-la-pua-de-un-tocadiscos.jpg",
      t: "Cambio de Púa o Aguja",
      d: "Señales auditivas y visuales para detectar una aguja gastada antes de que raye tus discos LP.",
      href: "/curiosidades/como-saber-cuando-cambiar-la-pua-de-un-tocadiscos-consejos-y-senales/",
      alt: "Aguja de tocadiscos sobre disco de vinilo",
      tag: "Mantenimiento",
    },
    {
      img: "/images/tocadiscos-bluetooth.jpg",
      t: "Tocadiscos Bluetooth vs RCA",
      d: "Cuándo conviene conectar sin cables a bocinas modernas y cuándo usar cable RCA hacia monitores Hi-Fi.",
      href: "/resenas/tocadiscos-bluetooth-combina-nostalgia-y-tecnologia-en-un-solo-dispositivo/",
      alt: "Tocadiscos con conectividad Bluetooth y salida analógica",
      tag: "Conectividad",
    },
    {
      img: "/images/Cantantes-de-pop-en-los-anos-80-en-Argentina.jpg",
      t: "Íconos de los Años 80",
      d: "Las voces y bandas que revolucionaron el Pop y el Rock en Argentina, España, México e Italia.",
      href: "/decada-80/cantantes-de-pop-en-los-anos-80-en-argentina/",
      alt: "Cantantes y discos de vinilo de los años 80",
      tag: "Años 80",
    },
    {
      img: "/images/Analisis-del-estilo-musical-de-Queen-en-los-70.jpg",
      t: "Leyendas de los Años 70",
      d: "De Queen, Led Zeppelin y Bowie a ABBA y Bob Marley: los álbumes que definieron el sonido analógico.",
      href: "/decada-70/",
      alt: "Grandes bandas de rock de los años 70 en vinilo",
      tag: "Años 70",
    },
    {
      img: "/images/principales-exponentes-de-la-opera-en-Italia.jpg",
      t: "Voces Inmortales de la Ópera",
      d: "Recorrido por los tenores, sopranos y barítonos más sublimes de Italia, España, Francia y el mundo.",
      href: "/cantantes-de-opera/principales-exponentes-de-la-opera-en-italia/",
      alt: "Grandes cantantes de ópera en formato vinilo",
      tag: "Música Lírica",
    },
    {
      img: "/images/Cuando-dejaron-de-usarse-los-discos-de-vinilo.jpg",
      t: "El Renacer del Vinilo",
      d: "El reportaje histórico citado en prensa internacional sobre cómo el disco LP volvió a conquistar al mundo.",
      href: "/curiosidades/cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo/",
      alt: "Colección de discos de vinilo clásicos",
      tag: "Historia LP",
    },
  ];

  const setupOptions: SetupOption[] = [
    {
      key: "inicial",
      label: "Setup Inicial Casa",
      tier: "Para empezar con buen pie · Plug & Play",
      needleHours: 500,
      needleType: "Aguja de Diamante Cónica (ej. ATN3600L)",
      img: "/images/tocadiscos-bluetooth.jpg",
      alt: "Tocadiscos de entrada con preamplificador integrado",
      desc: "Ideal para disfrutar tus primeros LPs en la sala sin complicaciones: tocadiscos automático con preamplificador Phono integrado y conexión directa a altavoces activos o Bluetooth.",
      components: "Tocadiscos con Preamp Phono + Cápsula MM con aguja cónica de diamante + Par de altavoces activos.",
      href: "/curiosidades/guia-completa-que-tener-en-cuenta-al-comprar-un-tocadiscos/",
    },
    {
      key: "hifi",
      label: "Setup Hi-Fi Entusiasta",
      tier: "Máximo equilibrio acústico y cuidado del surco",
      needleHours: 800,
      needleType: "Aguja de Diamante Elíptica (ej. AT-VM95E / Ortofon 2M Red)",
      img: "/images/altavoces-para-tocadiscos.jpg",
      alt: "Equipo tocadiscos Hi-Fi con altavoces dedicados",
      desc: "Para quienes buscan separación estéreo superior y detalle en agudos: brazo con contrapeso y antiskating ajustables, aguja elíptica que penetra mejor el microsurco y monitores dedicados.",
      components: "Tornamesa manual de correa + Cápsula con púa elíptica + Amplificador integrado + Altavoces de estantería.",
      href: "/resenas/encuentra-los-mejores-altavoces-para-tu-tocadiscos-calidad-de-sonido-inigualable/",
    },
    {
      key: "coleccionista",
      label: "Setup Coleccionista",
      tier: "Alta fidelidad audiófila y preservación de época",
      needleHours: 1000,
      needleType: "Aguja MicroLinear / Shibata de Larga Duración",
      img: "/images/Como-cuidar-un-tocadiscos.jpg",
      alt: "Cuidado y calibración de tocadiscos de colección",
      desc: "Pensado para colecciones de ediciones originales de los años 50 a 90 y ópera: plato pesado acrílico o de aluminio amortiguado, preamplificador externo a válvulas o discreto y limpieza húmeda.",
      components: "Giradiscos Hi-Fi + Cápsula MicroLinear + Preamp Phono dedicado + Cepillo de fibra de carbono.",
      href: "/curiosidades/el-arte-de-cuidar-un-tocadiscos-consejos-y-trucos/",
    },
  ];

  const bentoOrder = [
    "curiosidades",
    "resenas",
    "decada-50",
    "decada-70",
    "decada-80",
    "cantantes-de-opera",
  ];
  const bentoCats = bentoOrder
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

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
      <ReadingProgress />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* 1–2. Hero 3D con Partículas, Buscador Instantáneo y Escenario Tilt */}
        <Hero totalPosts={allPosts.length} totalCategories={categories.length} />

        {/* 3. Doble Cinta Marquee de Audio Analógico y Décadas */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track font-display text-lg font-bold text-[#1c130e]/85"
                aria-hidden={k === 1}
              >
                {CLAIMS.map((t) => (
                  <span key={t} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-[#fbbf24] to-[#b45309]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden>
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-sm font-semibold uppercase tracking-[0.14em] text-[#78350f]/75"
              >
                {CLAIMS_2.map((t) => (
                  <span key={t} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. ¿Qué es Vinilo Retro? + Mosaico Spotlight */}
        <section id="que-es" className="wrap py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Pasión por el formato físico
              </span>
              <SplitHeading
                text="La cultura del tocadiscos y el vinilo,"
                accent={{
                  text: "explicada con rigor técnico",
                  className: "text-[#b45309]",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                <strong className="text-[#1c130e]">Vinilo Retro</strong> es la enciclopedia en
                español dedicada al sonido analógico y su legado cultural. Reunimos{" "}
                <strong className="text-[#1c130e]">
                  {allPosts.length.toLocaleString("es-PE")} artículos, manuales técnicos y
                  biografías
                </strong>{" "}
                para que elijas el tocadiscos ideal, cuides tus agujas y descubras los álbumes e
                intérpretes más importantes desde los años 50 hasta los 90 y la ópera clásica.
              </p>
              <div
                className="mt-6 rounded-2xl border border-amber-300/70 bg-amber-50/80 p-5"
                data-reveal
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
                  💿 Lo que encontrarás en nuestra enciclopedia
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.95rem] text-[#1c130e]">
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-amber-700">•</span>
                    Guías de compra y reseñas honestas de tocadiscos vintage, Bluetooth y Hi-Fi.
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-amber-700">•</span>
                    Manuales de diagnóstico de agujas, calibración de brazo y conexión de altavoces.
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-amber-700">•</span>
                    Asesor IA interactivo en tiempo real para responder todas tus dudas de vinilos y
                    música.
                  </li>
                </ul>
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link href="/resenas/" className="btn btn-ghost" data-magnetic>
                  Explorar 33 Reseñas de Tocadiscos
                </Link>
                <Link href="/curiosidades/" className="btn btn-ghost" data-magnetic>
                  Ver 62 Guías de Agujas y Cuidado
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-3xl shadow-[0_30px_60px_-35px_rgba(45,20,5,0.65)]"
                data-reveal
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Que-tener-en-cuenta-al-comprar-un-tocadiscos.jpg"
                  alt="Tocadiscos de vinilo clásico en sala de escucha"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#78350f]">
                  Sonido 100% Analógico · 33⅓ y 45 RPM
                </span>
              </div>
              {[
                [
                  "🎛️",
                  "Comparativas de Tornamesas",
                  "Qué modelos cuidan tus discos y cuáles ofrecen mejor fidelidad acústica.",
                ],
                [
                  "💎",
                  "Agujas, Púas y Cápsulas",
                  "Diferencias entre diamante y zafiro, puntas cónicas vs. elípticas y recambios.",
                ],
                [
                  "🎶",
                  "Cinco Décadas de Música",
                  "De los años 50 a los 90: rock, pop, jazz, soul, disco y baladas por país.",
                ],
                [
                  "🎭",
                  "Grandes Voces de la Ópera",
                  "258 biografías y análisis de los tenores, sopranos y barítonos históricos.",
                ],
              ].map(([e, t, d], i) => (
                <div
                  key={t}
                  className="card spot p-5"
                  data-reveal
                  data-reveal-delay={String(i)}
                >
                  <p className="text-2xl" aria-hidden>
                    {e}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight text-[#1c130e]">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Historia fijada GSAP: del surco a tus oídos */}
        <ScrollStory />

        {/* 6. La ciencia del sonido analógico (SVG animado) */}
        <section className="relative isolate overflow-hidden bg-[#120b07] py-24 text-white">
          <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[#d97706]/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#78350f]/40 blur-3xl" />
          <div className="hero-grid opacity-50" />
          <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow !text-[#fde047]" data-reveal>
                Ingeniería acústica, sin humo
              </span>
              <SplitHeading
                text="Cómo nace la calidez del"
                accent={{ text: "sonido analógico en vinilo", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-white/80" data-reveal>
                A diferencia del audio digital comprimido, en un disco de vinilo la onda sonora está{" "}
                <strong className="text-white">esculpida físicamente en un microsurco en espiral</strong>.
                La <strong className="text-white">aguja de diamante</strong> lee simultáneamente las
                dos paredes en ángulo de 45° (canales izquierdo y derecho) y la{" "}
                <strong className="text-white">cápsula magnética</strong> induce una corriente
                continua rica en armónicos naturales.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3" data-reveal>
                {[
                  ["💎", "Lectura 45°/45°"],
                  ["🧲", "Cápsula MM/MC"],
                  ["〰️", "Curva Phono RIAA"],
                ].map(([e, t]) => (
                  <div key={t} className="glass p-4 text-center">
                    <p className="text-2xl" aria-hidden>
                      {e}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{t}</p>
                  </div>
                ))}
              </div>
              <div className="glass mt-6 p-5 text-sm text-white/80" data-reveal>
                <strong className="text-[#fde047]">Consejo de oro para tu equipo:</strong> nunca
                coloques los altavoces sobre la misma tabla o mueble que el tocadiscos. Las
                vibraciones del grave regresan por la madera hasta la aguja y ensucian la nitidez
                del vinilo.
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/curiosidades/descubre-la-magia-como-funciona-un-tocadiscos-de-vinilo/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Cómo funciona un tocadiscos por dentro
                </Link>
                <Link
                  href="/curiosidades/descubre-la-aguja-perfecta-como-saber-que-aguja-comprar-para-tocadiscos/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Qué aguja comprar para tu cápsula
                </Link>
              </div>
            </div>
            <div data-reveal>
              <AnalogSoundWave />
            </div>
          </div>
        </section>

        {/* 7. Órbita interactiva de componentes del tocadiscos y décadas */}
        <section className="wrap py-24">
          <VinylOrbit
            items={orbit}
            center="/images/El-Renacer-del-Vinilo-La-Magia-de-los-Discos-de-Vinilo.jpg"
          />
          <p className="mt-10 text-center text-sm text-[var(--muted)]">
            ¿Buscas un artista, década o guía de mantenimiento específica?{" "}
            <Link href="/mapa-del-sitio/" className="font-bold text-[#b45309] underline">
              Explorar el índice completo de los {allPosts.length.toLocaleString("es-PE")} artículos →
            </Link>
          </p>
        </section>

        {/* 8. Contadores animados y Ficha Técnica del Vinilo LP */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#2b1206] via-[#120b07] to-[#3d1808] py-24 text-white">
          <div className="hero-aurora opacity-40" />
          <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="eyebrow !text-[#fde047]" data-reveal>
                La enciclopedia en números reales
              </span>
              <SplitHeading
                text="Nuestro archivo musical y técnico,"
                accent={{ text: "cifra por cifra", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-4 max-w-xl text-white/75" data-reveal>
                Desde el nacimiento del microsurco en los años 50 hasta las reediciones audiófilas de
                180 gramos de hoy: documentamos cada década, género y componente del tocadiscos.
              </p>
              <div className="mt-8">
                <VinylCounters data={counters} />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/curiosidades/cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Historia y renacimiento del vinilo
                </Link>
                <Link
                  href="/curiosidades/explorando-la-nostalgia-como-se-llaman-las-maquinas-tocadiscos/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Evolución de las máquinas tocadiscos
                </Link>
              </div>
            </div>

            <div
              className="mx-auto w-full max-w-[430px] rounded-3xl bg-white p-6 text-[#1c130e] shadow-2xl"
              data-reveal
            >
              <div className="border-b-4 border-[#1c130e] pb-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#b45309]">
                  Estándar Técnico Analógico
                </p>
                <h3 className="font-display text-3xl font-extrabold leading-tight">
                  Ficha del Vinilo LP 12&quot;
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Parámetros de referencia para reproducción y conservación de alta fidelidad
                </p>
              </div>
              <dl className="mt-4 divide-y divide-stone-200 text-sm">
                {[
                  [
                    "💿 Velocidades Estándar",
                    "33⅓ y 45 RPM",
                    "78 RPM para discos históricos de pizarra",
                  ],
                  [
                    "⚖️ Fuerza de Apoyo (VTF)",
                    "1.5 g – 2.5 g",
                    "Según cápsula MM/MC y contrapeso calibrado",
                  ],
                  [
                    "💎 Vida Útil Púa Diamante",
                    "500 – 1,000 h",
                    "Versus 50–100 h en agujas de zafiro o rubí",
                  ],
                  [
                    "🎚️ Ecualización Estándar",
                    "Curva RIAA",
                    "Preamplificador Phono integrado o externo",
                  ],
                  [
                    "🧼 Conservación Óptima",
                    "Vertical · < 25 °C",
                    "Funda interior antiestática de polietileno",
                  ],
                ].map(([k, v, sub]) => (
                  <div key={k} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <dt className="font-bold text-[#1c130e]">{k}</dt>
                      <dd className="text-xs text-[var(--muted)]">{sub}</dd>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#fdfaf5] border border-amber-300/80 px-3 py-1 font-extrabold text-xs text-[#78350f]">
                      {v}
                    </span>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-2xl bg-amber-50 p-3.5 text-xs text-[#78350f]">
                <strong>Regla del coleccionista:</strong> nunca apiles tus discos de vinilo en
                horizontal; la presión acumulada provoca alabeos (warping) que hacen saltar la
                aguja.
              </div>
            </div>
          </div>
        </section>

        {/* 9. Escena Día ↔ Noche: el ritual de escucha según la hora */}
        <section className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Un ritual sin prisa
              </span>
              <SplitHeading
                text="De la mañana a la medianoche,"
                accent={{
                  text: "cada hora tiene su vinilo",
                  className: "text-[#b45309]",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-lg text-[var(--muted)]" data-reveal>
              Arrastra la escena para cambiar la luz del día sobre tu rincón de escucha. Cambia la
              atmósfera de la sala, pero el ritual analógico permanece intacto:{" "}
              <strong className="text-[#1c130e]">
                sacar el LP de su portada, pasar el cepillo antiestático y posar la aguja en el
                primer surco
              </strong>
              .
            </p>
          </div>

          <div data-reveal>
            <DayNightSlider />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [
                "Mañanas de Jazz & Años 50",
                "Voces cálidas, saxofón, blues y los orígenes del LP",
                "/images/cantantes-famosos-de-los-anos-50-y-su-influencia-en-el-genero-jazz.jpg",
                "/decada-50/",
              ],
              [
                "Tardes de Rock & Pop 60s–80s",
                "Himnos inmortales, guitarras analógicas y discos icónicos",
                "/images/Analisis-del-estilo-musical-de-Queen-en-los-70.jpg",
                "/decada-70/",
              ],
              [
                "Noches de Ópera & Clásicos 90s",
                "Escucha profunda con grandes tenores, sopranos y baladas",
                "/images/principales-exponentes-de-la-opera-en-Italia.jpg",
                "/cantantes-de-opera/",
              ],
            ].map(([t, d, src, href], i) => (
              <Link
                key={t}
                href={href}
                className="card spot overflow-hidden group"
                data-reveal
                data-reveal-delay={String(i)}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#d97706] to-[#78350f] font-display font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-tight group-hover:text-[#b45309] transition-colors">
                      {t}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{d}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. Carrusel Horizontal 4:5 de Momentos, Épocas y Dudas Reales */}
        <section className="overflow-hidden bg-[#fdfaf5] py-24 border-y border-[var(--line)]">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Guías para coleccionistas y melómanos
              </span>
              <SplitHeading
                text="Momentos, épocas y"
                accent={{ text: "dudas reales resueltas", className: "text-[#b45309]" }}
                className="section-title mt-3"
              />
            </div>
            <MomentsCarousel items={moments} />
          </div>
        </section>

        {/* 11. Planificador de Setup Analógico, Calculadora de Vida Útil de Aguja y Asesor de Guías */}
        <section id="setup-analogico" className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Planifica tu cadena de audio
              </span>
              <SplitHeading
                text="Elige tu setup ideal."
                accent={{
                  text: "Calcula la vida de tu aguja.",
                  className: "text-[#b45309]",
                }}
                className="section-title mt-3"
              />
            </div>
            <ul className="grid gap-2 text-[var(--muted)]" data-reveal>
              {[
                "Comparativas reales entre agujas cónicas, elípticas y MicroLinear",
                "Guías paso a paso para conectar salidas Phono, Line RCA y Bluetooth",
                "Diagnóstico temprano de desgaste de púa para proteger tus vinilos",
                "Asesor IA activo 24/7 para recomendarte equipos y discos a medida",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-400/25 text-sm font-bold text-[#78350f]">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <SetupBudgetBlock options={setupOptions} />
          </div>

          <div className="mt-14" data-reveal>
            <TurntableAdvisor />
          </div>
        </section>

        {/* AdSense Banner #1 */}
        <div className="mx-auto max-w-5xl px-4 py-4">
          <AdBanner />
        </div>

        {/* 12. Bento Grid de Categorías + Guías Esenciales de Tocadiscos + Top SEO + Explorador */}
        <section className="bg-gradient-to-b from-white to-[#fdfaf5] py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Arquitectura de la enciclopedia
              </span>
              <SplitHeading
                text="Todo sobre vinilos y música,"
                accent={{ text: "ordenado por época y tema", className: "text-[#b45309]" }}
                className="section-title mt-3"
              />
            </div>

            {/* Bento Grid Principal */}
            <div className="grid auto-rows-[minmax(195px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
              {bentoCats.map((c, i) => {
                const big = i === 0;
                const wide = i === 1 || i === 4 || i === 5;
                const sampleArticles = getPostsByCategory(c.slug).slice(0, 5);
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    className={`card spot group flex flex-col p-7 ${
                      big
                        ? "spot-dark border-transparent bg-gradient-to-br from-[#2b1206] via-[#451a03] to-[#b45309] text-white md:col-span-2 lg:row-span-2"
                        : ""
                    } ${wide ? "lg:col-span-2" : ""}`}
                    data-reveal
                    data-reveal-delay={String(i % 4)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                          big ? "bg-white/15" : "bg-[#fdfaf5] border border-amber-200/70"
                        }`}
                        aria-hidden
                      >
                        {CATEGORY_ICONS[c.slug] || "💿"}
                      </span>
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          big ? "text-[#fde047]" : "text-[#b45309]"
                        }`}
                      >
                        {c.count} artículos
                      </span>
                    </div>
                    <h3
                      className={`mt-5 font-display font-extrabold ${
                        big ? "text-3xl sm:text-4xl" : "text-2xl text-[#1c130e]"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        big ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {c.description}
                    </p>
                    {big && (
                      <ul className="mt-6 space-y-2 text-sm text-white/90">
                        {sampleArticles.map((a) => (
                          <li key={a.id} className="truncate">
                            → {a.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span
                      className={`mt-auto pt-5 font-bold ${
                        big ? "text-[#fde047]" : "text-[#b45309]"
                      }`}
                    >
                      Explorar categoría →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Directorio Completo de Categorías */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}/`}
                  className="card spot p-3.5 flex flex-col justify-between group"
                  data-reveal
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl">{CATEGORY_ICONS[cat.slug] || "💿"}</span>
                    <span className="text-[11px] font-extrabold text-[#b45309]">
                      {cat.count}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xs font-bold text-[#1c130e] group-hover:text-[#b45309] transition-colors line-clamp-2">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>

            {/* Guías Esenciales de Tocadiscos, Agujas y Altavoces */}
            <div className="mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="eyebrow" data-reveal>
                    Especialistas en Tornamesas y Audio Analógico
                  </span>
                  <h3
                    className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#1c130e]"
                    data-reveal
                  >
                    Guías Esenciales de Tocadiscos, Agujas y Altavoces
                  </h3>
                </div>
                <div className="flex gap-3" data-reveal>
                  <Link
                    href="/resenas/"
                    className="text-sm font-bold text-[#b45309] hover:underline"
                  >
                    Ver 33 Reseñas →
                  </Link>
                  <span className="text-stone-300">|</span>
                  <Link
                    href="/curiosidades/"
                    className="text-sm font-bold text-[#b45309] hover:underline"
                  >
                    Ver 62 Guías Técnicas →
                  </Link>
                </div>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {turntableGuides.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="card spot group flex flex-col overflow-hidden"
                    data-reveal
                    data-reveal-delay={String(idx % 3)}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(post.featuredImageUrl)}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#120b07]/90 px-3 py-1 text-[11px] font-bold text-amber-300">
                        {post.categoryName}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 flex items-center gap-2 text-xs text-stone-500">
                        <span>⏱️ {post.readTime} de lectura</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">
                          ✓ Guía Experta
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-[#1c130e] group-hover:text-[#b45309] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#b45309]">
                        Leer guía completa →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rankings y Reportajes Más Leídos (Top SEO) */}
            <div className="mt-20">
              <div className="mb-8">
                <span className="eyebrow" data-reveal>
                  🔥 Lo Más Consultado en Latinoamérica y España
                </span>
                <h3
                  className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#1c130e]"
                  data-reveal
                >
                  Rankings y Reportajes Destacados de la Comunidad
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]" data-reveal>
                  Nuestros artículos más leídos en buscadores y citados en medios internacionales
                  como el diario <em>La Razón</em>.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {topSeoPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="card spot group flex gap-4 p-4"
                    data-reveal
                    data-reveal-delay={String(idx % 3)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(post.featuredImageUrl)}
                      alt={post.title}
                      className="h-22 w-24 shrink-0 rounded-xl object-cover bg-stone-100"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase text-[#b45309]">
                          {post.categoryName}
                        </span>
                        <h4 className="mt-0.5 font-display text-sm font-bold text-[#1c130e] group-hover:text-[#b45309] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-stone-500">
                        ⏱️ {post.readTime} · Leer →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* AdSense Banner #2 */}
            <div className="mx-auto max-w-5xl py-10">
              <AdBanner />
            </div>

            {/* Explorador Interactivo de Guías por Categoría */}
            <div className="mt-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="eyebrow" data-reveal>
                  Catálogo Interactivo
                </span>
                <h3
                  className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#1c130e]"
                  data-reveal
                >
                  Explora Nuestras Guías por Categoría
                </h3>
              </div>
              <BlogExplorerClient
                initialPosts={explorerPosts}
                categories={categories}
              />
            </div>
          </div>
        </section>

        {/* 13. Criterio Editorial + Autor E-E-A-T (Charlie Lingán) */}
        <section className="wrap py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Rigor analógico y musical
              </span>
              <SplitHeading
                text="Análisis con criterio acústico,"
                accent={{ text: "no fichas copiadas", className: "text-[#b45309]" }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                Un tocadiscos no es solo un objeto decorativo: de su aguja, su brazo y su
                preamplificador depende la salud de tus discos LP. Aquí evaluamos cada equipo y
                documentamos cada época musical con profundidad real.
              </p>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="Consultar una duda al Asesor IA"
                  className="btn btn-buy"
                  magnetic
                />
                <Link href="/hola-hablamos/" className="btn btn-ghost" data-magnetic>
                  Sobre Charlie Lingán
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card spot p-6" data-reveal>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                  ✓ Estándar ViniloRetro.com
                </span>
                <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
                  <li>• Verificación de cápsula, tipo de púa y fuerza de apoyo</li>
                  <li>• Guías claras de conexión Phono, Line RCA y altavoces</li>
                  <li>• Contexto histórico y discográfico por década y país</li>
                  <li>• Asesor IA entrenado con los 1,895 artículos del portal</li>
                </ul>
              </div>
              <div className="card spot p-6" data-reveal data-reveal-delay="1">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                  ⚠️ Reseñas superficiales en internet
                </span>
                <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
                  <li>• Ignoran si la aguja es de zafiro genérico o diamante real</li>
                  <li>• No explican si necesitas preamplificador Phono externo</li>
                  <li>• Sin guía de mantenimiento, limpieza ni repuestos</li>
                  <li>• Listados genéricos sin contexto musical ni histórico</li>
                </ul>
              </div>

              {/* Tarjeta de Autor E-E-A-T: Charlie Lingán */}
              <div
                className="card spot sm:col-span-2 p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6"
                data-reveal
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/charlie-lingan.jpg"
                  alt="Charlie Lingán — Fundador de Vinilo Retro"
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover shadow-md shrink-0 border-2 border-amber-400"
                  loading="lazy"
                />
                <div className="text-center sm:text-left">
                  <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-[#78350f]">
                    Dirección Editorial y Experiencia
                  </span>
                  <h3 className="mt-2 font-display text-xl font-extrabold text-[#1c130e]">
                    ¡Hola! Soy Charlie Lingán, fundador de Vinilo Retro
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)] leading-relaxed">
                    Apasionado por la música y el emprendimiento digital. Creamos{" "}
                    <strong>Vinilo Retro</strong> para preservar el legado de los años 50, 60, 70,
                    80, 90 y la ópera clásica, y ayudar a cada coleccionista a disfrutar del sonido
                    analógico en su máxima expresión.
                  </p>
                  <Link
                    href="/hola-hablamos/"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#b45309] hover:underline"
                  >
                    Conoce mi historia y contáctame →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14. Preguntas Frecuentes (FAQ) con Acordeones */}
        <section className="wrap pb-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Preguntas frecuentes
              </span>
              <SplitHeading
                text="Respuestas rápidas sobre vinilos y tocadiscos"
                className="section-title mt-3"
              />
              <p className="mt-4 text-[var(--muted)]" data-reveal>
                ¿Tienes una duda específica sobre tu tornamesa, una aguja de repuesto o un artista
                de colección? Nuestro Asesor IA te responde al instante.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton label="Preguntar al Asesor IA" className="btn btn-buy" />
                <Link href="/curiosidades/" className="btn btn-ghost">
                  Ver manuales técnicos
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {HOME_FAQS.map((f) => (
                <details
                  key={f.q}
                  className="card card-static group p-5 open:shadow-lg"
                  data-reveal
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-[#1c130e]">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fdfaf5] border border-amber-200 text-[#b45309] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[var(--muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 15. CTA Final con Aurora, Grilla y Tocadiscos Flotante */}
        <section className="wrap pb-16">
          <div className="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-[#2b1206] via-[#120b07] to-[#b45309] px-6 py-14 text-white sm:px-14 sm:py-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/El-Renacer-del-Vinilo-La-Magia-de-los-Discos-de-Vinilo.jpg"
              alt=""
              className="absolute inset-0 -z-[2] h-full w-full object-cover opacity-20 mix-blend-luminosity"
            />
            <div className="hero-grid opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#f59e0b]/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-[#d97706]/30 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="text-center lg:text-left">
                <SplitHeading
                  text="¿Buscas tu próximo tocadiscos o disco de colección?"
                  accent={{
                    text: "El Asesor IA te guía al instante",
                    className: "text-[#fde047]",
                  }}
                  className="text-3xl font-extrabold sm:text-5xl"
                />
                <p className="mt-4 text-lg text-white/85">
                  Pregúntale por modelos de tocadiscos, agujas de diamante, conexión de altavoces o
                  los mejores álbumes de los años 50, 60, 70, 80, 90 y la ópera.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <OpenChatButton
                    label="Abrir Asesor IA de Vinilos y Música"
                    className="btn btn-lime shine text-base"
                    magnetic
                  />
                  <Link href="/resenas/" className="btn btn-glass" data-magnetic>
                    Explorar reseñas de tocadiscos
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[360px]">
                <div className="absolute inset-[12%] rounded-full bg-amber-400/20 blur-3xl" />
                <div className="float-y relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-amber-300/30 shadow-[0_30px_50px_rgba(0,0,0,0.6)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Que-tener-en-cuenta-al-comprar-un-tocadiscos.jpg"
                    alt="Tocadiscos de vinilo reproduciendo un LP clásico"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ClientEffects />
    </>
  );
}
