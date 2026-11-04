"use client";

import { useState } from "react";
import Link from "next/link";

interface AdvisorTab {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tip: string;
  guides: {
    title: string;
    desc: string;
    href: string;
    tag: string;
  }[];
}

const ADVISOR_TABS: AdvisorTab[] = [
  {
    id: "comprar",
    badge: "🎛️ Guía de Compra",
    title: "Quiero elegir mi próximo Tocadiscos de Vinilo",
    subtitle:
      "Evita errores al comprar tu primer equipo o actualizar tu tornamesa con nuestras comparativas verificadas.",
    tip: "Consejo Experto: Fíjate siempre en que el tocadiscos tenga contrapeso ajustable o aguja de diamante reemplazable (como Audio-Technica) para cuidar los surcos de tus vinilos.",
    guides: [
      {
        title: "¿Qué tener en cuenta al comprar un Tocadiscos? Guía Completa",
        desc: "Tracción por correa vs. directa, preamplificador integrado y velocidades 33/45/78 RPM.",
        href: "/curiosidades/guia-completa-que-tener-en-cuenta-al-comprar-un-tocadiscos/",
        tag: "Lectura Esencial",
      },
      {
        title: "Encuentra el Tocadiscos Perfecto en El Corte Inglés",
        desc: "Análisis de los modelos más buscados en España por calidad acústica y diseño.",
        href: "/resenas/encuentra-el-tocadiscos-perfecto-en-el-corte-ingles/",
        tag: "Top España",
      },
      {
        title: "Mejor Tocadiscos de Vinilo en Liverpool: Guía Definitiva",
        desc: "Comparativa de tornamesas vintage y modernas disponibles en México.",
        href: "/resenas/encuentra-el-mejor-tocadiscos-de-vinilo-en-liverpool-guia-de-compra-definitiva/",
        tag: "Top México",
      },
      {
        title: "Tocadiscos Bluetooth: Nostalgia y Tecnología en un Solo Equipo",
        desc: "Cómo conectar tu tocadiscos sin cables a bocinas y auriculares modernos.",
        href: "/resenas/tocadiscos-bluetooth-combina-nostalgia-y-tecnologia-en-un-solo-dispositivo/",
        tag: "Moderno",
      },
    ],
  },
  {
    id: "agujas",
    badge: "💎 Mantenimiento y Púas",
    title: "Diagnóstico de Aguja, Púa y Cuidado de Discos",
    subtitle:
      "¿El sonido distorsiona o salta? Aprende a detectar cuándo cambiar la púa y cómo limpiar tus discos LP.",
    tip: "Consejo Experto: Una aguja de zafiro dura unas 50-100 horas de reproducción, mientras que una de diamante alcanza entre 500 y 1,000 horas sin dañar el vinilo.",
    guides: [
      {
        title: "¿Cómo saber cuándo cambiar la púa de un tocadiscos?",
        desc: "Señales auditivas y visuales para reemplazar la aguja a tiempo.",
        href: "/curiosidades/como-saber-cuando-cambiar-la-pua-de-un-tocadiscos-consejos-y-senales/",
        tag: "Diagnóstico",
      },
      {
        title: "¿Cómo saber qué aguja comprar para mi tocadiscos?",
        desc: "Compatibilidad de cápsulas fonocaptoras, agujas cónicas y elípticas.",
        href: "/curiosidades/descubre-la-aguja-perfecta-como-saber-que-aguja-comprar-para-tocadiscos/",
        tag: "Repuestos",
      },
      {
        title: "¿Cómo saber si un disco de vinilo está en buen estado?",
        desc: "Guía para inspeccionar surcos, alabeos y clasificación Goldmine al coleccionar.",
        href: "/curiosidades/descubre-la-calidad-como-saber-si-un-disco-de-vinilo-esta-en-buen-estado/",
        tag: "Coleccionismo",
      },
      {
        title: "El Arte de Cuidar un Tocadiscos: Consejos y Trucos",
        desc: "Nivelación del plato, limpieza antiestática y calibración del brazo.",
        href: "/curiosidades/el-arte-de-cuidar-un-tocadiscos-consejos-y-trucos/",
        tag: "Mantenimiento",
      },
    ],
  },
  {
    id: "sonido",
    badge: "🔊 Audio y Conexión",
    title: "Conectar Altavoces y Mejorar la Calidad de Sonido",
    subtitle:
      "Sácale el máximo partido cálido y analógico a tu tornamesa con la configuración correcta de audio.",
    tip: "Consejo Experto: Nunca coloques los altavoces sobre la misma superficie o mueble que el tocadiscos; las vibraciones acústicas se transmiten a la aguja y generan acople.",
    guides: [
      {
        title: "Conecta tu Tocadiscos Fácilmente: Paso a Paso",
        desc: "Diferencias entre salida Phono y Line (RCA), amplificadores y bocinas activas.",
        href: "/curiosidades/conecta-tu-tocadiscos-facilmente-como-se-conecta-un-tocadiscos/",
        tag: "Instalación",
      },
      {
        title: "Los Mejores Altavoces para tu Tocadiscos",
        desc: "Qué monitores activos y pasivos destacan las frecuencias medias del vinilo.",
        href: "/resenas/encuentra-los-mejores-altavoces-para-tu-tocadiscos-calidad-de-sonido-inigualable/",
        tag: "Sonido Hi-Fi",
      },
      {
        title: "¿Cómo funciona un Tocadiscos de Vinilo por dentro?",
        desc: "La física detrás de los surcos, la cápsula magnética y la conversión analógica.",
        href: "/curiosidades/descubre-la-magia-como-funciona-un-tocadiscos-de-vinilo/",
        tag: "Técnico",
      },
      {
        title: "¿Cuándo dejaron de usarse los discos de vinilo y por qué volvieron?",
        desc: "El reportaje histórico sobre la transición al CD y el renacimiento del formato LP.",
        href: "/curiosidades/cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo/",
        tag: "Citado en Prensa",
      },
    ],
  },
  {
    id: "historia",
    badge: "🎶 Joyas por Época",
    title: "Explorar los Grandes Íconos del Vinilo por Década y País",
    subtitle:
      "Recorre los artistas y movimientos musicales que hicieron historia desde los años 50 hasta los 90.",
    tip: "Dato Cultural: Los álbumes editados entre 1955 y 1989 fueron masterizados originalmente de forma 100% analógica (AAA) pensando en el rango dinámico del disco de vinilo.",
    guides: [
      {
        title: "Cantantes de Pop en los Años 80 en Argentina e Italia",
        desc: "Las voces y bandas que transformaron el pop en español e italiano en los 80.",
        href: "/decada-80/cantantes-de-pop-en-los-anos-80-en-argentina/",
        tag: "Años 80",
      },
      {
        title: "Cantantes Representativos de los 90 en Brasil y Latinoamérica",
        desc: "Los íconos que definieron la música brasileña y latina en los años 90.",
        href: "/decada-90/cantantes-representativos-de-los-90-en-brasil/",
        tag: "Años 90",
      },
      {
        title: "Principales Exponentes de la Ópera en Italia",
        desc: "De Pavarotti y Callas a las grandes leyendas líricas de los teatros italianos.",
        href: "/cantantes-de-opera/principales-exponentes-de-la-opera-en-italia/",
        tag: "Ópera Clásica",
      },
      {
        title: "Cantantes Famosos de los Años 50 y su Influencia en el Jazz",
        desc: "Las voces inmortales que dieron origen a la era dorada del LP de 12 pulgadas.",
        href: "/decada-50/cantantes-famosos-de-los-anos-50-y-su-influencia-en-el-genero-jazz/",
        tag: "Años 50",
      },
    ],
  },
];

export default function TurntableAdvisor() {
  const [activeTabId, setActiveTabId] = useState<string>("comprar");
  const activeTab =
    ADVISOR_TABS.find((t) => t.id === activeTabId) || ADVISOR_TABS[0];

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-lg">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-dark">
          🎛️ Asesor Interactivo Vinilo Retro
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-stone-900">
          ¿En qué podemos ayudarte hoy con tu Tocadiscos o Colección?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-stone-600">
          Selecciona lo que estás buscando y accede directamente a nuestras
          guías técnicas y rankings más consultados:
        </p>
      </div>

      {/* Selector Buttons */}
      <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ADVISOR_TABS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-md"
                  : "border-stone-200 bg-stone-50/70 text-stone-800 hover:border-amber-400 hover:bg-white"
              }`}
            >
              <span
                className={`inline-block text-xs font-extrabold ${
                  isActive ? "text-amber-400" : "text-primary"
                }`}
              >
                {tab.badge}
              </span>
              <p className="mt-1 text-sm font-bold line-clamp-2">{tab.title}</p>
            </button>
          );
        })}
      </div>

      {/* Active Recommendation Panel */}
      <div className="mt-8 rounded-2xl border border-amber-200/70 bg-light-bg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">
              {activeTab.title}
            </h3>
            <p className="mt-1 text-sm text-stone-600">{activeTab.subtitle}</p>
          </div>
          <Link
            href={activeTab.id === "historia" ? "/decada-80/" : "/curiosidades/"}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition"
          >
            Ver todas las guías →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {activeTab.guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-primary hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-primary-dark">
                    {g.tag}
                  </span>
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Leer →
                  </span>
                </div>
                <h4 className="mt-2.5 text-base font-bold text-stone-900 group-hover:text-primary transition-colors">
                  {g.title}
                </h4>
                <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-amber-50/90 border border-amber-200 px-4 py-3 text-xs sm:text-sm text-stone-800 flex items-start gap-2.5">
          <span className="text-base">💡</span>
          <p className="font-medium leading-relaxed">{activeTab.tip}</p>
        </div>
      </div>
    </div>
  );
}
