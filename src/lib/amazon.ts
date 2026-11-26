export const AMAZON_TAG_US = "viniloretro-20";
export const AMAZON_TAG_ES = "viniloretro-21";

export type AmazonStoreRegion = "ES" | "US";

export interface AmazonProductRecommendation {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  features: string[];
  categoryType: "turntable" | "vinyl" | "needle" | "cleaner" | "speaker";
  /** Direct ASIN on Amazon.com if fixed product */
  asinUS?: string;
  /** Direct ASIN on Amazon.es if fixed product */
  asinES?: string;
  /** Search query fallback or primary dynamic vinyl search on Amazon.com */
  queryUS: string;
  /** Search query fallback or primary dynamic vinyl search on Amazon.es */
  queryES: string;
  ctaLabel: string;
}

/**
 * Generates an official Amazon Affiliate link with automatic geolocation store support:
 * - Spain (ES): amazon.es with tag=viniloretro-21
 * - USA & Latin America (US): amazon.com with tag=viniloretro-20
 */
export function buildAmazonUrl(
  product: AmazonProductRecommendation,
  region: AmazonStoreRegion
): string {
  if (region === "ES") {
    if (product.asinES) {
      return `https://www.amazon.es/dp/${product.asinES}?tag=${AMAZON_TAG_ES}`;
    }
    const q = encodeURIComponent(product.queryES);
    return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG_ES}`;
  }

  if (product.asinUS) {
    return `https://www.amazon.com/dp/${product.asinUS}?tag=${AMAZON_TAG_US}`;
  }
  const q = encodeURIComponent(product.queryUS);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG_US}`;
}

/**
 * Detects whether the user is browsing from Spain/Europe or Americas
 * based on browser timezone and language locale.
 */
export function detectUserAmazonRegion(): AmazonStoreRegion {
  if (typeof window === "undefined") {
    return "ES"; // Default SSR fallback (Spain is #1 country in GSC with 62 clicks / 6,391 imp.)
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();

    if (
      tz === "Europe/Madrid" ||
      tz === "Atlantic/Canary" ||
      tz === "Europe/Ceuta" ||
      lang === "es-es"
    ) {
      return "ES";
    }

    if (tz.startsWith("Europe/")) {
      return "ES";
    }

    return "US";
  } catch {
    return "ES";
  }
}

// ============================================================================
// CURATED HARDWARE & ACCESSORY CATALOG (TOP SELLERS ON AMAZON.ES & AMAZON.COM)
// ============================================================================

export const CATALOG = {
  AT_LP60X: {
    id: "at-lp60x",
    badge: "🏆 #1 Más Vendido Calidad/Precio",
    title: "Audio-Technica AT-LP60X — Tocadiscos Automático Hi-Fi",
    subtitle:
      "El giradiscos más recomendado del mundo para empezar y cuidar tus vinilos sin desgastarlos.",
    features: [
      "Tracción por correa automática (33 1/3 y 45 RPM) con brazo equilibrado",
      "Preamplificador Phono integrado para conectar directo a cualquier altavoz",
      "Cápsula Dual Magnet con aguja de diamante reemplazable ATN3600L",
    ],
    categoryType: "turntable",
    asinUS: "B07N3XJ66N",
    asinES: "B07N3XJ66N",
    queryUS: "Audio-Technica AT-LP60X turntable",
    queryES: "Audio-Technica AT-LP60X tocadiscos",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  AT_LP60XBT: {
    id: "at-lp60xbt",
    badge: "📶 Mejor Tocadiscos Bluetooth",
    title: "Audio-Technica AT-LP60XBT — Tocadiscos Inalámbrico Bluetooth",
    subtitle:
      "Sonido analógico de alta fidelidad con conexión directa sin cables a barras de sonido y bocinas Bluetooth.",
    features: [
      "Conectividad Bluetooth 5.0 aptX + Salida RCA analógica con preamplificador",
      "Funcionamiento 100% automático (Start/Stop) que evita rayar los discos",
      "Aguja de diamante de larga duración y plato de aluminio antirresonancia",
    ],
    categoryType: "turntable",
    asinUS: "B07N3RFXRL",
    asinES: "B07N3RFXRL",
    queryUS: "Audio-Technica AT-LP60XBT Bluetooth turntable",
    queryES: "Audio-Technica AT-LP60XBT tocadiscos bluetooth",
    ctaLabel: "Ver oferta en Amazon",
  } satisfies AmazonProductRecommendation,

  AT_LP120XUSB: {
    id: "at-lp120xusb",
    badge: "🎛️ Nivel Profesional / Coleccionista",
    title: "Audio-Technica AT-LP120XUSB — Tracción Directa Profesional",
    subtitle:
      "Inspirado en los míticos platos de estudio: motor de tracción directa, contrapeso ajustable y aguja elíptica.",
    features: [
      "Cápsula AT-VM95E con aguja elíptica verde de alta precisión acústica",
      "Control antideslizamiento (Anti-Skating), contrapeso y 3 velocidades (33/45/78)",
      "Salida USB para digitalizar vinilos y preamplificador Phono seleccionable",
    ],
    categoryType: "turntable",
    asinUS: "B07N3S4X3P",
    asinES: "B07N3S4X3P",
    queryUS: "Audio-Technica AT-LP120XUSB turntable",
    queryES: "Audio-Technica AT-LP120XUSB tocadiscos",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  SONY_PSLX310BT: {
    id: "sony-pslx310bt",
    badge: "✨ Diseño Minimalista Premium",
    title: "Sony PS-LX310BT — Giradiscos Automático con Bluetooth",
    subtitle:
      "Elegancia japonesa, emparejamiento Bluetooth con un solo botón y 3 niveles de ganancia de audio.",
    features: [
      "Brazo de aluminio en forma de J para una lectura limpia y cálida del surco",
      "Reproducción automática en un paso con retorno automático del brazo",
      "Conexión inalámbrica a altavoces o auriculares Bluetooth y salida RCA",
    ],
    categoryType: "turntable",
    asinUS: "B07PBLD4QN",
    asinES: "B07PBLD4QN",
    queryUS: "Sony PS-LX310BT turntable",
    queryES: "Sony PS-LX310BT tocadiscos bluetooth",
    ctaLabel: "Ver disponibilidad en Amazon",
  } satisfies AmazonProductRecommendation,

  CROSLEY_CRUISER_PLUS: {
    id: "crosley-cruiser-plus",
    badge: "🧳 Favorito Estilo Maletín Retro",
    title: "Crosley Cruiser Plus — Tocadiscos Maletín Vintage con Bluetooth",
    subtitle:
      "El icono portátil de estética años 50/60 con altavoces integrados y entrada/salida Bluetooth.",
    features: [
      "Diseño de maletín retro portátil con asa y múltiples colores de colección",
      "Reproduce discos de 33 1/3, 45 y 78 RPM + Control de Pitch",
      "Altavoces estéreo integrados + Salida Bluetooth para conectar a bocinas externas",
    ],
    categoryType: "turntable",
    asinUS: "B09G8LN8ZT",
    asinES: "B09G8LN8ZT",
    queryUS: "Crosley Cruiser Plus Vintage Turntable",
    queryES: "Crosley Cruiser Plus tocadiscos maletin",
    ctaLabel: "Ver colores y precio en Amazon",
  } satisfies AmazonProductRecommendation,

  VICTROLA_EMPIRE_6IN1: {
    id: "victrola-6in1",
    badge: "📻 Clásico en Madera Años 50",
    title: "Victrola 6-en-1 Nostalgic — Centro Musical de Madera Vintage",
    subtitle:
      "Inspirado en los fonógrafos y consolas antiguas: combina Vinilo, CD, Cassette, Radio FM y Bluetooth.",
    features: [
      "Acabado artesanal en madera caoba/roble con dial analógico iluminado",
      "Tocadiscos de 3 velocidades + Reproductor de CD, Cassette y Radio",
      "Altavoces estéreo incorporados: listo para sonar sin equipos adicionales",
    ],
    categoryType: "turntable",
    asinUS: "B00NQL8Z16",
    asinES: "B00NQL8Z16",
    queryUS: "Victrola 6-in-1 Nostalgic Wood Record Player",
    queryES: "Victrola 6-in-1 tocadiscos madera retro",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  MARSHALL_ACTON_III: {
    id: "marshall-acton-iii",
    badge: "🎸 El Altavoz Rockero Definitivo",
    title: "Marshall Acton III — Altavoz Bluetooth y Entrada Analógica para Vinilo",
    subtitle:
      "El compañero perfecto para cualquier tocadiscos: estética de amplificador clásico Marshall y sonido potente.",
    features: [
      "Entrada auxiliar de 3.5 mm (para conectar tu tocadiscos por cable) + Bluetooth 5.2",
      "Controles analógicos superiores de graves, agudos y volumen en latón",
      "Escena sonora estereofónica amplia que resalta la calidez de los discos LP",
    ],
    categoryType: "speaker",
    asinUS: "B0BC27MM5Z",
    asinES: "B0BC27MM5Z",
    queryUS: "Marshall Acton III Bluetooth Speaker",
    queryES: "Marshall Acton III altavoz",
    ctaLabel: "Ver oferta Marshall en Amazon",
  } satisfies AmazonProductRecommendation,

  EDIFIER_R1280DB: {
    id: "edifier-r1280db",
    badge: "🔊 Mejores Monitores para Tocadiscos",
    title: "Edifier R1280DB — Altavoces Activos de Estantería en Madera (42W RMS)",
    subtitle:
      "Los altavoces más recomendados por audiófilos para conectar directamente a tu tocadiscos sin amplificador externo.",
    features: [
      "Doble entrada RCA analógica + Bluetooth + Óptica con mando a distancia",
      "Caja acústica en madera MDF que elimina resonancias y realza los bajos del vinilo",
      "Ecualizador lateral de agudos y graves para ajustar el sonido a tu sala",
    ],
    categoryType: "speaker",
    asinUS: "B0719C132V",
    asinES: "B0719C132V",
    queryUS: "Edifier R1280DB Powered Bluetooth Bookshelf Speakers",
    queryES: "Edifier R1280DB altavoces activos tocadiscos",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  NEEDLE_ATN3600L: {
    id: "needle-atn3600l",
    badge: "💎 Aguja Oficial #1 en Ventas",
    title: "Audio-Technica ATN3600L — Aguja de Diamante de Repuesto Oficial",
    subtitle:
      "El repuesto original con punta de diamante (hasta 1.000 horas de vida útil) para AT-LP60X, Sony, Lenco y más.",
    features: [
      "Punta cónica de diamante de 0.6 mil que protege los surcos de tus vinilos",
      "Compatible con Audio-Technica AT-LP60 / AT-LP60X, Sony PS-LX310BT y Pioneer",
      "Instalación en 10 segundos sin herramientas (sistema clic)",
    ],
    categoryType: "needle",
    asinUS: "B00066XTBA",
    asinES: "B00066XTBA",
    queryUS: "Audio-Technica ATN3600L replacement stylus",
    queryES: "Audio-Technica ATN3600L aguja tocadiscos",
    ctaLabel: "Ver repuesto en Amazon",
  } satisfies AmazonProductRecommendation,

  NEEDLE_ATVMN95E: {
    id: "needle-atvmn95e",
    badge: "🟢 Mejora Acústica Elíptica",
    title: "Audio-Technica AT-VMN95E — Aguja Elíptica Verde de Alta Fidelidad",
    subtitle:
      "Repuesto oficial para cápsulas serie VM95 (AT-LP120X, AT-LPW40): mayor detalle en agudos y menor distorsión.",
    features: [
      "Punta elíptica de diamante (0.3 x 0.7 mil) que sigue el surco con máxima precisión",
      "Compatible con toda la familia de cápsulas Audio-Technica VM95",
      "Fabricación japonesa calibrada para audiófilos y coleccionistas",
    ],
    categoryType: "needle",
    asinUS: "B07JXDD39G",
    asinES: "B07JXDD39G",
    queryUS: "Audio-Technica AT-VMN95E Elliptical Replacement Stylus",
    queryES: "Audio-Technica AT-VMN95E aguja eliptica",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  NEEDLE_UNIVERSAL_PACK: {
    id: "needle-universal-pack",
    badge: "🔧 Compatible con Maletines (Pack x4)",
    title: "Pack de 4 Agujas de Rubí/Diamante Universales (Crosley, Victrola, Lauson)",
    subtitle:
      "El repuesto universal económico compatible con el 90% de los tocadiscos de maletín y vintage del mercado.",
    features: [
      "Incluye 4 púas de repuesto en estuche protector para años de música segura",
      "Compatible con Crosley (NP1/NP6), Victrola, Ion, Jensen, Boytone y Prixton",
      "Elimina saltos y distorsión causados por agujas desgastadas",
    ],
    categoryType: "needle",
    queryUS: "turntable replacement needles pack of 4 Crosley Victrola",
    queryES: "agujas repuesto tocadiscos pack 4 Crosley Victrola",
    ctaLabel: "Ver pack de 4 en Amazon",
  } satisfies AmazonProductRecommendation,

  CLEANING_KIT_4IN1: {
    id: "cleaning-kit-4in1",
    badge: "✨ Imprescindible para Coleccionistas",
    title: "Kit Profesional de Limpieza 4 en 1 para Discos de Vinilo y Agujas",
    subtitle:
      "Elimina estática, polvo profundo y chasquidos de tus LPs antiguos y nuevos para duplicar su vida útil.",
    features: [
      "Cepillo curvo de terciopelo antiestático + Líquido limpiador sin alcohol",
      "Incluye cepillo de fibra de carbono para limpiar la púa del tocadiscos",
      "Recupera la claridad de sonido en vinilos de los años 50, 60, 70, 80 y 90",
    ],
    categoryType: "cleaner",
    queryUS: "vinyl record cleaning kit velvet brush alcohol free",
    queryES: "kit limpieza discos vinilo cepillo terciopelo liquido",
    ctaLabel: "Ver kit de limpieza en Amazon",
  } satisfies AmazonProductRecommendation,

  VINYL_SLEEVES_PACK: {
    id: "vinyl-sleeves-pack",
    badge: "🛡️ Protección de Archivo (12\")",
    title: "Pack de 50 Fundas Antiestáticas Interiores y Exteriores para Vinilos LP",
    subtitle:
      "Protege las portadas originales de la humedad y evita que el papel raye o cargue de estática tus discos.",
    features: [
      "Polietileno virgen de alta densidad sin ácido (no amarillea con los años)",
      "Revestimiento antiestático de papel de arroz para deslizar el LP suavemente",
      "Tamaño estándar de 12 pulgadas compatible con álbumes simples y dobles (Gatefold)",
    ],
    categoryType: "cleaner",
    queryUS: "vinyl record sleeves inner outer 50 pack 12 inch",
    queryES: "fundas discos vinilo 12 pulgadas antiestaticas pack 50",
    ctaLabel: "Ver fundas en Amazon",
  } satisfies AmazonProductRecommendation,
};

// ============================================================================
// DYNAMIC ARTIST & DECADE VINYL DETECTORS (COVERS ALL 1,895 ARTICLES)
// ============================================================================

interface ArtistVinylEntry {
  keywords: string[];
  artistName: string;
  albumHighlightES: string;
  albumHighlightUS: string;
  queryES: string;
  queryUS: string;
}

const ARTIST_VINYL_MAP: ArtistVinylEntry[] = [
  {
    keywords: ["roxette"],
    artistName: "Roxette",
    albumHighlightES: "Ediciones en Vinilo LP de Look Sharp!, Joyride y Greatest Hits",
    albumHighlightUS: "Ediciones en Vinilo LP de Look Sharp!, Joyride y Greatest Hits",
    queryES: "Roxette vinilo LP",
    queryUS: "Roxette vinyl LP",
  },
  {
    keywords: ["alejandra-guzman", "alejandra guzman", "alejandra guzmán"],
    artistName: "Alejandra Guzmán",
    albumHighlightES: "Álbumes clásicos, Eternamente Bella, Libre y Primera Fila en Vinilo y CD",
    albumHighlightUS: "Álbumes clásicos, Eternamente Bella, Libre y Primera Fila en Vinilo y CD",
    queryES: "Alejandra Guzman vinilo CD",
    queryUS: "Alejandra Guzman vinyl CD",
  },
  {
    keywords: ["red-hot-chili-peppers"],
    artistName: "Red Hot Chili Peppers",
    albumHighlightES: "Vinilos LP de Californication, Blood Sugar Sex Magik y By the Way (180g)",
    albumHighlightUS: "Vinilos LP de Californication, Blood Sugar Sex Magik y By the Way (180g)",
    queryES: "Red Hot Chili Peppers vinilo LP",
    queryUS: "Red Hot Chili Peppers vinyl LP",
  },
  {
    keywords: ["nirvana"],
    artistName: "Nirvana",
    albumHighlightES: "Vinilos LP de MTV Unplugged in New York, Nevermind e In Utero (180g)",
    albumHighlightUS: "Vinilos LP de MTV Unplugged in New York, Nevermind e In Utero (180g)",
    queryES: "Nirvana vinilo LP",
    queryUS: "Nirvana vinyl LP",
  },
  {
    keywords: ["elvis-presley", "elvis presley"],
    artistName: "Elvis Presley",
    albumHighlightES: "Doble Vinilo LP de ELV1S: 30 #1 Hits y ediciones remasterizadas de los 50/60",
    albumHighlightUS: "Doble Vinilo LP de ELV1S: 30 #1 Hits y ediciones remasterizadas de los 50/60",
    queryES: "Elvis Presley vinilo LP",
    queryUS: "Elvis Presley vinyl LP",
  },
  {
    keywords: ["enrique-iglesias"],
    artistName: "Enrique Iglesias",
    albumHighlightES: "Discografía, Greatest Hits y ediciones especiales en Vinilo LP y CD",
    albumHighlightUS: "Discografía, Greatest Hits y ediciones especiales en Vinilo LP y CD",
    queryES: "Enrique Iglesias vinilo CD",
    queryUS: "Enrique Iglesias vinyl",
  },
  {
    keywords: ["lucero"],
    artistName: "Lucero",
    albumHighlightES: "Discografía completa, grandes éxitos de balada y ranchera en formato físico",
    albumHighlightUS: "Discografía completa, grandes éxitos de balada y ranchera en formato físico",
    queryES: "Lucero cantante discos vinilo CD",
    queryUS: "Lucero Latin singer vinyl CD",
  },
  {
    keywords: ["caifanes"],
    artistName: "Caifanes",
    albumHighlightES: "Vinilos LP de El Silencio, El Diablito, El Nervio del Volcán y Discografía",
    albumHighlightUS: "Vinilos LP de El Silencio, El Diablito, El Nervio del Volcán y Discografía",
    queryES: "Caifanes vinilo LP",
    queryUS: "Caifanes vinyl LP",
  },
  {
    keywords: ["the-cranberries", "cranberries"],
    artistName: "The Cranberries",
    albumHighlightES: "Vinilos LP de No Need to Argue, Everybody Else Is Doing It y Stars (Best Of)",
    albumHighlightUS: "Vinilos LP de No Need to Argue, Everybody Else Is Doing It y Stars (Best Of)",
    queryES: "The Cranberries vinilo LP",
    queryUS: "The Cranberries vinyl LP",
  },
  {
    keywords: ["aerosmith"],
    artistName: "Aerosmith",
    albumHighlightES: "Vinilos LP de Greatest Hits, Get a Grip, Toys in the Attic y Pump",
    albumHighlightUS: "Vinilos LP de Greatest Hits, Get a Grip, Toys in the Attic y Pump",
    queryES: "Aerosmith vinilo LP",
    queryUS: "Aerosmith vinyl LP",
  },
  {
    keywords: ["whitney-houston"],
    artistName: "Whitney Houston",
    albumHighlightES: "Vinilos LP de I Will Always Love You (Best Of), The Bodyguard y Whitney",
    albumHighlightUS: "Vinilos LP de I Will Always Love You (Best Of), The Bodyguard y Whitney",
    queryES: "Whitney Houston vinilo LP",
    queryUS: "Whitney Houston vinyl LP",
  },
  {
    keywords: ["backstreet-boys"],
    artistName: "Backstreet Boys",
    albumHighlightES: "Vinilos LP de Millennium, Backstreet's Back y The Essential Backstreet Boys",
    albumHighlightUS: "Vinilos LP de Millennium, Backstreet's Back y The Essential Backstreet Boys",
    queryES: "Backstreet Boys vinilo LP",
    queryUS: "Backstreet Boys vinyl LP",
  },
  {
    keywords: ["chayanne"],
    artistName: "Chayanne",
    albumHighlightES: "Grandes Éxitos, Atado a Tu Amor y Tiempo de Vals en Vinilo LP y CD",
    albumHighlightUS: "Grandes Éxitos, Atado a Tu Amor y Tiempo de Vals en Vinilo LP y CD",
    queryES: "Chayanne vinilo CD",
    queryUS: "Chayanne vinyl CD",
  },
  {
    keywords: ["los-fabulosos-cadillacs", "fabulosos-cadillacs"],
    artistName: "Los Fabulosos Cadillacs",
    albumHighlightES: "Vinilos LP de Vasos Vacíos, Matador, Fabulosos Calavera y Rey Azúcar",
    albumHighlightUS: "Vinilos LP de Vasos Vacíos, Matador, Fabulosos Calavera y Rey Azúcar",
    queryES: "Los Fabulosos Cadillacs vinilo LP",
    queryUS: "Los Fabulosos Cadillacs vinyl LP",
  },
  {
    keywords: ["bon-jovi"],
    artistName: "Bon Jovi",
    albumHighlightES: "Vinilos LP de Slippery When Wet, Cross Road (Greatest Hits) y New Jersey",
    albumHighlightUS: "Vinilos LP de Slippery When Wet, Cross Road (Greatest Hits) y New Jersey",
    queryES: "Bon Jovi vinilo LP",
    queryUS: "Bon Jovi vinyl LP",
  },
  {
    keywords: ["gloria-trevi"],
    artistName: "Gloria Trevi",
    albumHighlightES: "Álbumes clásicos de los 90 y recopilatorios en formato físico y vinilo",
    albumHighlightUS: "Álbumes clásicos de los 90 y recopilatorios en formato físico y vinilo",
    queryES: "Gloria Trevi vinilo CD",
    queryUS: "Gloria Trevi vinyl CD",
  },
  {
    keywords: ["britney-spears"],
    artistName: "Britney Spears",
    albumHighlightES: "Vinilos LP de ...Baby One More Time, Oops!... I Did It Again y Greatest Hits",
    albumHighlightUS: "Vinilos LP de ...Baby One More Time, Oops!... I Did It Again y Greatest Hits",
    queryES: "Britney Spears vinilo LP",
    queryUS: "Britney Spears vinyl LP",
  },
  {
    keywords: ["mariah-carey"],
    artistName: "Mariah Carey",
    albumHighlightES: "Vinilos LP de Music Box, Daydream, Butterfly y #1 to Infinity",
    albumHighlightUS: "Vinilos LP de Music Box, Daydream, Butterfly y #1 to Infinity",
    queryES: "Mariah Carey vinilo LP",
    queryUS: "Mariah Carey vinyl LP",
  },
  {
    keywords: ["andrea-bocelli"],
    artistName: "Andrea Bocelli",
    albumHighlightES: "Vinilos LP de Romanza, Sogno, Si y Duets (30th Anniversary)",
    albumHighlightUS: "Vinilos LP de Romanza, Sogno, Si y Duets (30th Anniversary)",
    queryES: "Andrea Bocelli vinilo LP",
    queryUS: "Andrea Bocelli vinyl LP",
  },
  {
    keywords: ["luciano-pavarotti", "pavarotti"],
    artistName: "Luciano Pavarotti",
    albumHighlightES: "Vinilos LP de The Greatest Hits, The Three Tenors y O Sole Mio",
    albumHighlightUS: "Vinilos LP de The Greatest Hits, The Three Tenors y O Sole Mio",
    queryES: "Luciano Pavarotti vinilo LP",
    queryUS: "Luciano Pavarotti vinyl LP",
  },
  {
    keywords: ["laura-pausini"],
    artistName: "Laura Pausini",
    albumHighlightES: "Vinilos LP de Las Cosas Que Vives, Laura Pausini y 20 Grandes Éxitos",
    albumHighlightUS: "Vinilos LP de Las Cosas Que Vives, Laura Pausini y 20 Grandes Éxitos",
    queryES: "Laura Pausini vinilo LP",
    queryUS: "Laura Pausini vinyl LP",
  },
  {
    keywords: ["eros-ramazzotti"],
    artistName: "Eros Ramazzotti",
    albumHighlightES: "Vinilos LP de Música Es, En Todos los Sentidos, Tutte Storie y Eros",
    albumHighlightUS: "Vinilos LP de Música Es, En Todos los Sentidos, Tutte Storie y Eros",
    queryES: "Eros Ramazzotti vinilo LP",
    queryUS: "Eros Ramazzotti vinyl LP",
  },
  {
    keywords: ["luis-miguel"],
    artistName: "Luis Miguel",
    albumHighlightES: "Vinilos LP de Romance, Segundo Romance, Aries y 20 Años",
    albumHighlightUS: "Vinilos LP de Romance, Segundo Romance, Aries y 20 Años",
    queryES: "Luis Miguel vinilo LP",
    queryUS: "Luis Miguel vinyl LP",
  },
  {
    keywords: ["soda-stereo"],
    artistName: "Soda Stereo",
    albumHighlightES: "Vinilos LP de Canción Animal, Signos, Doble Vida y Comfort y Música Para Volar",
    albumHighlightUS: "Vinilos LP de Canción Animal, Signos, Doble Vida y Comfort y Música Para Volar",
    queryES: "Soda Stereo vinilo LP",
    queryUS: "Soda Stereo vinyl LP",
  },
  {
    keywords: ["pearl-jam"],
    artistName: "Pearl Jam",
    albumHighlightES: "Vinilos LP de Ten, Vs., Vitalogy y Rearviewmirror (180g)",
    albumHighlightUS: "Vinilos LP de Ten, Vs., Vitalogy y Rearviewmirror (180g)",
    queryES: "Pearl Jam vinilo LP",
    queryUS: "Pearl Jam vinyl LP",
  },
  {
    keywords: ["mana", "maná"],
    artistName: "Maná",
    albumHighlightES: "Vinilos LP de ¿Dónde Jugarán los Niños?, Sueños Líquidos y MTV Unplugged",
    albumHighlightUS: "Vinilos LP de ¿Dónde Jugarán los Niños?, Sueños Líquidos y MTV Unplugged",
    queryES: "Mana vinilo LP",
    queryUS: "Mana Latin rock vinyl LP",
  },
  {
    keywords: ["pink-floyd"],
    artistName: "Pink Floyd",
    albumHighlightES: "Vinilos LP de The Dark Side of the Moon, The Wall y Wish You Were Here",
    albumHighlightUS: "Vinilos LP de The Dark Side of the Moon, The Wall y Wish You Were Here",
    queryES: "Pink Floyd vinilo LP",
    queryUS: "Pink Floyd vinyl LP",
  },
  {
    keywords: ["fleetwood-mac"],
    artistName: "Fleetwood Mac",
    albumHighlightES: "Vinilos LP de Rumours (Edición Audiófila 180g), Tango in the Night y Greatest Hits",
    albumHighlightUS: "Vinilos LP de Rumours (Edición Audiófila 180g), Tango in the Night y Greatest Hits",
    queryES: "Fleetwood Mac Rumours vinilo LP",
    queryUS: "Fleetwood Mac Rumours vinyl LP",
  },
  {
    keywords: ["abba"],
    artistName: "ABBA",
    albumHighlightES: "Doble Vinilo LP de ABBA Gold: Greatest Hits, Arrival y Voulez-Vous",
    albumHighlightUS: "Doble Vinilo LP de ABBA Gold: Greatest Hits, Arrival y Voulez-Vous",
    queryES: "ABBA Gold vinilo LP",
    queryUS: "ABBA Gold vinyl LP",
  },
  {
    keywords: ["queen"],
    artistName: "Queen",
    albumHighlightES: "Doble Vinilo LP de Queen Greatest Hits I & II y A Night at the Opera",
    albumHighlightUS: "Doble Vinilo LP de Queen Greatest Hits I & II y A Night at the Opera",
    queryES: "Queen Greatest Hits vinilo LP",
    queryUS: "Queen Greatest Hits vinyl LP",
  },
  {
    keywords: ["ac-dc", "ac/dc"],
    artistName: "AC/DC",
    albumHighlightES: "Vinilos LP de Back in Black, Highway to Hell y The Razors Edge (180g)",
    albumHighlightUS: "Vinilos LP de Back in Black, Highway to Hell y The Razors Edge (180g)",
    queryES: "AC DC Back in Black vinilo LP",
    queryUS: "AC DC Back in Black vinyl LP",
  },
  {
    keywords: ["david-bowie"],
    artistName: "David Bowie",
    albumHighlightES: "Vinilos LP de Legacy (The Very Best Of), Ziggy Stardust y Heroes",
    albumHighlightUS: "Vinilos LP de Legacy (The Very Best Of), Ziggy Stardust y Heroes",
    queryES: "David Bowie vinilo LP",
    queryUS: "David Bowie vinyl LP",
  },
  {
    keywords: ["bob-marley"],
    artistName: "Bob Marley & The Wailers",
    albumHighlightES: "Vinilo LP de Legend (The Best of Bob Marley - Edición 180g)",
    albumHighlightUS: "Vinilo LP de Legend (The Best of Bob Marley - Edición 180g)",
    queryES: "Bob Marley Legend vinilo LP",
    queryUS: "Bob Marley Legend vinyl LP",
  },
  {
    keywords: ["the-jackson-5", "jackson-5", "michael-jackson"],
    artistName: "The Jackson 5 & Michael Jackson",
    albumHighlightES: "Vinilos LP de Greatest Hits, ABC, Thriller y Off the Wall",
    albumHighlightUS: "Vinilos LP de Greatest Hits, ABC, Thriller y Off the Wall",
    queryES: "Jackson 5 Michael Jackson vinilo LP",
    queryUS: "Jackson 5 Michael Jackson vinyl LP",
  },
  {
    keywords: ["the-supremes", "supremes"],
    artistName: "The Supremes",
    albumHighlightES: "Vinilos LP clásicos de Motown y Diana Ross & The Supremes Greatest Hits",
    albumHighlightUS: "Vinilos LP clásicos de Motown y Diana Ross & The Supremes Greatest Hits",
    queryES: "The Supremes Motown vinilo LP",
    queryUS: "The Supremes Motown vinyl LP",
  },
  {
    keywords: ["bob-dylan"],
    artistName: "Bob Dylan",
    albumHighlightES: "Vinilos LP de Highway 61 Revisited, Blonde on Blonde y Greatest Hits",
    albumHighlightUS: "Vinilos LP de Highway 61 Revisited, Blonde on Blonde y Greatest Hits",
    queryES: "Bob Dylan vinilo LP",
    queryUS: "Bob Dylan vinyl LP",
  },
  {
    keywords: ["frank-sinatra"],
    artistName: "Frank Sinatra",
    albumHighlightES: "Vinilos LP de Ultimate Sinatra, In the Wee Small Hours y Come Fly with Me",
    albumHighlightUS: "Vinilos LP de Ultimate Sinatra, In the Wee Small Hours y Come Fly with Me",
    queryES: "Frank Sinatra vinilo LP",
    queryUS: "Frank Sinatra vinyl LP",
  },
  {
    keywords: ["chuck-berry"],
    artistName: "Chuck Berry",
    albumHighlightES: "Vinilos LP de The Great Twenty-Eight y Berry Is on Top",
    albumHighlightUS: "Vinilos LP de The Great Twenty-Eight y Berry Is on Top",
    queryES: "Chuck Berry vinilo LP",
    queryUS: "Chuck Berry vinyl LP",
  },
  {
    keywords: ["mario-lanza"],
    artistName: "Mario Lanza",
    albumHighlightES: "Grabaciones históricas de ópera y canciones napolitanas en Vinilo LP y CD",
    albumHighlightUS: "Grabaciones históricas de ópera y canciones napolitanas en Vinilo LP y CD",
    queryES: "Mario Lanza vinilo CD",
    queryUS: "Mario Lanza vinyl LP",
  },
  {
    keywords: ["perry-como"],
    artistName: "Perry Como",
    albumHighlightES: "Grandes éxitos de los años 50 remasterizados en Vinilo LP",
    albumHighlightUS: "Grandes éxitos de los años 50 remasterizados en Vinilo LP",
    queryES: "Perry Como vinilo LP",
    queryUS: "Perry Como vinyl LP",
  },
  {
    keywords: ["connie-francis"],
    artistName: "Connie Francis",
    albumHighlightES: "Vinilos LP de sus grandes éxitos en italiano, español e inglés de los años 50/60",
    albumHighlightUS: "Vinilos LP de sus grandes éxitos en italiano, español e inglés de los años 50/60",
    queryES: "Connie Francis vinilo LP",
    queryUS: "Connie Francis vinyl LP",
  },
  {
    keywords: ["alanis-morissette"],
    artistName: "Alanis Morissette",
    albumHighlightES: "Vinilo LP de Jagged Little Pill (Edición 180 gramos)",
    albumHighlightUS: "Vinilo LP de Jagged Little Pill (Edición 180 gramos)",
    queryES: "Alanis Morissette Jagged Little Pill vinilo LP",
    queryUS: "Alanis Morissette Jagged Little Pill vinyl LP",
  },
  {
    keywords: ["shakira"],
    artistName: "Shakira",
    albumHighlightES: "Vinilos LP de Pies Descalzos, ¿Dónde Están los Ladrones? y MTV Unplugged",
    albumHighlightUS: "Vinilos LP de Pies Descalzos, ¿Dónde Están los Ladrones? y MTV Unplugged",
    queryES: "Shakira vinilo LP",
    queryUS: "Shakira vinyl LP",
  },
  {
    keywords: ["selena-quintanilla", "selena"],
    artistName: "Selena Quintanilla",
    albumHighlightES: "Vinilos LP de Ones, Amor Prohibido y Dreaming of You",
    albumHighlightUS: "Vinilos LP de Ones, Amor Prohibido y Dreaming of You",
    queryES: "Selena Quintanilla vinilo LP",
    queryUS: "Selena Quintanilla Ones vinyl LP",
  },
  {
    keywords: ["thalia", "thalía"],
    artistName: "Thalía",
    albumHighlightES: "Vinilos LP y ediciones de colección de Amor a la Mexicana, En Éxtasis y Primera Fila",
    albumHighlightUS: "Vinilos LP y ediciones de colección de Amor a la Mexicana, En Éxtasis y Primera Fila",
    queryES: "Thalia vinilo CD",
    queryUS: "Thalia Latin pop vinyl CD",
  },
  {
    keywords: ["boyz-ii-men"],
    artistName: "Boyz II Men",
    albumHighlightES: "Vinilos LP de II, Cooleyhighharmony y Legacy: The Greatest Hits",
    albumHighlightUS: "Vinilos LP de II, Cooleyhighharmony y Legacy: The Greatest Hits",
    queryES: "Boyz II Men vinilo LP",
    queryUS: "Boyz II Men vinyl LP",
  },
  {
    keywords: ["george-michael"],
    artistName: "George Michael & Wham!",
    albumHighlightES: "Vinilos LP de Faith, Listen Without Prejudice, Older y Ladies & Gentlemen",
    albumHighlightUS: "Vinilos LP de Faith, Listen Without Prejudice, Older y Ladies & Gentlemen",
    queryES: "George Michael vinilo LP",
    queryUS: "George Michael vinyl LP",
  },
  {
    keywords: ["carlos-santana", "santana"],
    artistName: "Carlos Santana",
    albumHighlightES: "Vinilos LP de Abraxas, Supernatural y Ultimate Santana (180g)",
    albumHighlightUS: "Vinilos LP de Abraxas, Supernatural y Ultimate Santana (180g)",
    queryES: "Santana Abraxas vinilo LP",
    queryUS: "Santana Abraxas vinyl LP",
  },
  {
    keywords: ["janis-joplin"],
    artistName: "Janis Joplin",
    albumHighlightES: "Vinilos LP de Pearl, Cheap Thrills y Janis Joplin's Greatest Hits",
    albumHighlightUS: "Vinilos LP de Pearl, Cheap Thrills y Janis Joplin's Greatest Hits",
    queryES: "Janis Joplin Pearl vinilo LP",
    queryUS: "Janis Joplin Pearl vinyl LP",
  },
  {
    keywords: ["deep-purple"],
    artistName: "Deep Purple",
    albumHighlightES: "Vinilos LP de Machine Head, Made in Japan y Deep Purple in Rock",
    albumHighlightUS: "Vinilos LP de Machine Head, Made in Japan y Deep Purple in Rock",
    queryES: "Deep Purple Machine Head vinilo LP",
    queryUS: "Deep Purple Machine Head vinyl LP",
  },
  {
    keywords: ["led-zeppelin"],
    artistName: "Led Zeppelin",
    albumHighlightES: "Vinilos LP de Led Zeppelin IV, Physical Graffiti y Mothership (Remastered)",
    albumHighlightUS: "Vinilos LP de Led Zeppelin IV, Physical Graffiti y Mothership (Remastered)",
    queryES: "Led Zeppelin IV vinilo LP",
    queryUS: "Led Zeppelin IV vinyl LP",
  },
  {
    keywords: ["the-clash"],
    artistName: "The Clash",
    albumHighlightES: "Doble Vinilo LP de London Calling y Combat Rock (Edición 180g)",
    albumHighlightUS: "Doble Vinilo LP de London Calling y Combat Rock (Edición 180g)",
    queryES: "The Clash London Calling vinilo LP",
    queryUS: "The Clash London Calling vinyl LP",
  },
  {
    keywords: ["beatles", "paul-mccartney"],
    artistName: "The Beatles & Paul McCartney",
    albumHighlightES: "Vinilos LP de Abbey Road, The Beatles 1, Band on the Run y Revolver",
    albumHighlightUS: "Vinilos LP de Abbey Road, The Beatles 1, Band on the Run y Revolver",
    queryES: "The Beatles Abbey Road vinilo LP",
    queryUS: "The Beatles Abbey Road vinyl LP",
  },
  {
    keywords: ["rolling-stones"],
    artistName: "The Rolling Stones",
    albumHighlightES: "Vinilos LP de Honk (Best Of), Let It Bleed, Sticky Fingers y Exile on Main St.",
    albumHighlightUS: "Vinilos LP de Honk (Best Of), Let It Bleed, Sticky Fingers y Exile on Main St.",
    queryES: "The Rolling Stones vinilo LP",
    queryUS: "The Rolling Stones vinyl LP",
  },
  {
    keywords: ["doors"],
    artistName: "The Doors",
    albumHighlightES: "Vinilos LP de The Doors, L.A. Woman y The Very Best of The Doors",
    albumHighlightUS: "Vinilos LP de The Doors, L.A. Woman y The Very Best of The Doors",
    queryES: "The Doors vinilo LP",
    queryUS: "The Doors vinyl LP",
  },
  {
    keywords: ["genesis"],
    artistName: "Genesis",
    albumHighlightES: "Vinilos LP de Selling England by the Pound, Foxtrot e Invisible Touch",
    albumHighlightUS: "Vinilos LP de Selling England by the Pound, Foxtrot e Invisible Touch",
    queryES: "Genesis vinilo LP",
    queryUS: "Genesis band vinyl LP",
  },
  {
    keywords: ["kiss"],
    artistName: "KISS",
    albumHighlightES: "Vinilos LP de Destroyer, Alive! y Kissworld: The Best of KISS",
    albumHighlightUS: "Vinilos LP de Destroyer, Alive! y Kissworld: The Best of KISS",
    queryES: "KISS Destroyer vinilo LP",
    queryUS: "KISS Destroyer vinyl LP",
  },
];

function buildDynamicVinylProduct(
  slug: string,
  title: string,
  category: string
): AmazonProductRecommendation {
  const haystack = `${slug} ${title.toLowerCase()}`;

  // 1. Check specific artist match first
  for (const entry of ARTIST_VINYL_MAP) {
    if (entry.keywords.some((kw) => haystack.includes(kw))) {
      return {
        id: `vinyl-${entry.keywords[0]}`,
        badge: "💿 Edición en Vinilo LP Coleccionable",
        title: `Vinilos LP y Discografía de ${entry.artistName}`,
        subtitle: entry.albumHighlightES,
        features: [
          `Prensajes oficiales en vinilo de 180 gramos y ediciones remasterizadas de ${entry.artistName}`,
          "Sonido cálido analógico con arte de portada original en gran formato (12 pulgadas)",
          "Envío protegido para coleccionistas con garantía de Amazon",
        ],
        categoryType: "vinyl",
        queryES: entry.queryES,
        queryUS: entry.queryUS,
        ctaLabel: `Ver vinilos de ${entry.artistName} en Amazon`,
      };
    }
  }

  // 2. Check high-traffic regional / decade clusters from Google Search Console
  if (category === "decada-80") {
    if (haystack.includes("argentina")) {
      return {
        id: "vinyl-80s-argentina",
        badge: "🇦🇷 Joyas del Rock y Pop Argentino 80s",
        title: "Vinilos LP de Clásicos de los 80 en Argentina (Soda Stereo, Charly García, Virus)",
        subtitle:
          "Las ediciones en vinilo más buscadas de la era dorada del pop y rock nacional argentino.",
        features: [
          "Álbumes históricos como Signos, Clics Modernos, Locura y grandes baladas de los 80",
          "Ediciones reedición de 180 gramos masterizadas para tocadiscos modernos",
          "Disponibles para envío rápido en Amazon",
        ],
        categoryType: "vinyl",
        queryES: "Soda Stereo Charly Garcia rock argentino vinilo LP",
        queryUS: "Soda Stereo Charly Garcia Argentine rock vinyl LP",
        ctaLabel: "Ver vinilos de los 80 en Amazon",
      };
    }
    if (haystack.includes("italia")) {
      return {
        id: "vinyl-80s-italia",
        badge: "🇮🇹 Clásicos de Italia en los Años 80",
        title: "Vinilos LP de Pop Italiano e Italo Disco de los Años 80",
        subtitle:
          "Recopilatorios en vinilo de las grandes voces italianas: Eros Ramazzotti, Franco Battiato, Umberto Tozzi y Ricchi e Poveri.",
        features: [
          "Ediciones en vinilo LP de baladas románticas italianas e Italo Disco 80s",
          "Sonido analógico original para revivir la década dorada de Sanremo",
          "Ideal para regalo o colección de música europea de los 80",
        ],
        categoryType: "vinyl",
        queryES: "musica italiana años 80 Italo Disco vinilo LP",
        queryUS: "Italian 80s music Italo Disco Eros Ramazzotti vinyl LP",
        ctaLabel: "Ver vinilos italianos de los 80 en Amazon",
      };
    }
    if (haystack.includes("brasil")) {
      return {
        id: "vinyl-80s-brasil",
        badge: "🇧🇷 Leyendas de Brasil en Vinilo",
        title: "Vinilos LP de Balada, MPB y Pop Brasileño de los Años 80",
        subtitle:
          "Los discos inmortales de Roberto Carlos, Caetano Veloso, Djavan, Gal Costa y Legião Urbana.",
        features: [
          "Prensajes en vinilo de 12 pulgadas de las grandes voces románticas de Brasil",
          "Fidelidad acústica superior en voces, cuerdas y arreglos analógicos",
          "Ediciones de colección disponibles en Amazon",
        ],
        categoryType: "vinyl",
        queryES: "Roberto Carlos Caetano Veloso musica brasileña vinilo LP",
        queryUS: "Roberto Carlos Brazilian music 80s MPB vinyl LP",
        ctaLabel: "Ver vinilos brasileños en Amazon",
      };
    }
    return {
      id: "vinyl-80s-general",
      badge: "🕺 Éxitos de los Años 80 en Vinilo",
      title: "Doble Vinilo LP — Los Mejores Éxitos del Pop, Rock y Baladas de los Años 80",
      subtitle:
        "Recopilatorios y álbumes esenciales de la década de 1980 en formato LP de 180 gramos.",
      features: [
        "Los himnos inolvidables de los años 80 masterizados para vinilo",
        "Ediciones dobles Gatefold ideales para escuchar en tornamesa",
        "Stock verificado en Amazon con envío rápido",
      ],
      categoryType: "vinyl",
      queryES: "musica años 80 grandes exitos vinilo LP",
      queryUS: "80s greatest hits vinyl LP record",
      ctaLabel: "Ver vinilos de los años 80 en Amazon",
    };
  }

  if (category === "decada-90") {
    if (haystack.includes("puerto-rico")) {
      return {
        id: "vinyl-90s-puertorico",
        badge: "🇵🇷 Íconos de Puerto Rico en los 90",
        title: "Vinilos LP de Leyendas Puertorriqueñas de los 90 (Ricky Martin, Chayanne, Marc Anthony)",
        subtitle:
          "Los álbumes que conquistaron el mundo desde Puerto Rico en los años 90 en formato Vinilo LP.",
        features: [
          "Ediciones coleccionables de pop latino, balada y salsa romántica de los 90",
          "Sonido remasterizado en vinilo de 12 pulgadas",
          "Disponibles con envío directo desde Amazon",
        ],
        categoryType: "vinyl",
        queryES: "Ricky Martin Marc Anthony Chayanne vinilo LP",
        queryUS: "Ricky Martin Marc Anthony Chayanne Latin 90s vinyl LP",
        ctaLabel: "Ver vinilos de los 90 en Amazon",
      };
    }
    if (haystack.includes("espana") || haystack.includes("españa")) {
      return {
        id: "vinyl-90s-espana",
        badge: "🇪🇸 Pop y Rock Español de los 90",
        title: "Vinilos LP de Grandes Artistas Españoles de los 90 (Alejandro Sanz, Mecano, Héroes del Silencio)",
        subtitle:
          "Reediciones oficiales en vinilo de los álbumes más vendidos de la música española de los años 90.",
        features: [
          "Incluye clásicos como Más, Senderos de Traición, Aidalai y recopilatorios 90s",
          "Prensajes de 180 gramos con encartes y letras originales",
          "Envío rápido en Amazon España y global",
        ],
        categoryType: "vinyl",
        queryES: "Alejandro Sanz Mecano Heroes del Silencio vinilo LP",
        queryUS: "Alejandro Sanz Mecano Heroes del Silencio Spanish 90s vinyl LP",
        ctaLabel: "Ver vinilos españoles de los 90 en Amazon",
      };
    }
    return {
      id: "vinyl-90s-general",
      badge: "💿 Grandes Clásicos de los Años 90",
      title: "Vinilos LP — Los Álbumes Más Icónicos de la Década de los 90",
      subtitle:
        "Las ediciones en vinilo de 180 gramos más buscadas del pop, rock y baladas de los años 90.",
      features: [
        "Reediciones oficiales para coleccionistas de la música de los 90",
        "Máxima fidelidad analógica y portadas originales de 12 pulgadas",
        "Ver catálogo actualizado en Amazon",
      ],
      categoryType: "vinyl",
      queryES: "musica años 90 grandes exitos vinilo LP",
      queryUS: "90s greatest hits classic albums vinyl LP",
      ctaLabel: "Ver vinilos de los años 90 en Amazon",
    };
  }

  if (category === "decada-70") {
    return {
      id: "vinyl-70s-general",
      badge: "🎸 Era Dorada del Vinilo Años 70",
      title: "Vinilos LP — Obras Maestras del Rock, Soul y Disco de los Años 70",
      subtitle:
        "Álbumes grabados de forma 100% analógica en la década de 1970, reediciones audiófilas de 180g.",
      features: [
        "Clásicos inmortales de los años 70 pensados originalmente para el formato LP",
        "Prensajes pesados que garantizan estabilidad y riqueza de graves",
        "Catálogo de coleccionista en Amazon",
      ],
      categoryType: "vinyl",
      queryES: "rock clasico años 70 grandes exitos vinilo LP",
      queryUS: "70s classic rock greatest hits vinyl LP",
      ctaLabel: "Ver vinilos de los años 70 en Amazon",
    };
  }

  if (category === "decada-60") {
    return {
      id: "vinyl-60s-general",
      badge: "🎙️ Leyendas de los Años 60 en LP",
      title: "Vinilos LP — Clásicos del Rock, Soul, Psicodelia y Balada de los Años 60",
      subtitle:
        "Las grabaciones históricas que transformaron la música mundial en los años 60 en vinilo de 12\".",
      features: [
        "Masterización analógica cálida fiel a las ediciones originales de los años 60",
        "Portadas históricas restauradas en alta definición",
        "Imprescindible para toda colección de vinilos retro",
      ],
      categoryType: "vinyl",
      queryES: "musica años 60 clasicos rock soul vinilo LP",
      queryUS: "60s classic rock soul greatest hits vinyl LP",
      ctaLabel: "Ver vinilos de los años 60 en Amazon",
    };
  }

  if (category === "decada-50") {
    return {
      id: "vinyl-50s-general",
      badge: "🎷 Joyas de los Años 50 en Vinilo",
      title: "Vinilos LP — Clásicos del Rock & Roll, Jazz, Soul y Boleros de los Años 50",
      subtitle:
        "Revive el nacimiento del LP de 12 pulgadas con las voces inmortales de la década de 1950.",
      features: [
        "Recopilatorios y álbumes legendarios de Elvis, Sinatra, Jazz, Soul y Mambo",
        "Prensajes en vinilo virgen de 180 gramos para reproducción limpia",
        "Ideal para escuchar en tocadiscos clásicos y modernos",
      ],
      categoryType: "vinyl",
      queryES: "musica años 50 jazz rock and roll vinilo LP",
      queryUS: "1950s classic jazz rock and roll soul vinyl LP",
      ctaLabel: "Ver vinilos de los años 50 en Amazon",
    };
  }

  if (category === "cantantes-de-opera" || haystack.includes("opera") || haystack.includes("soprano") || haystack.includes("tenor")) {
    return {
      id: "vinyl-opera-general",
      badge: "🎭 Grandes Voces de la Ópera en Vinilo",
      title: "Vinilos LP — Las Mejores Arias de Ópera, Sopranos y Tenores Legendarios",
      subtitle:
        "Grabaciones de referencia de Maria Callas, Luciano Pavarotti, Plácido Domingo y Andrea Bocelli en LP.",
      features: [
        "Prensajes audiófilos (Decca / Deutsche Grammophon / Warner Classics) en vinilo 180g",
        "Rango dinámico inigualable para apreciar la acústica real de los grandes teatros",
        "Ediciones de colección disponibles en Amazon",
      ],
      categoryType: "vinyl",
      queryES: "opera clasica Maria Callas Pavarotti vinilo LP",
      queryUS: "classical opera Maria Callas Pavarotti vinyl LP",
      ctaLabel: "Ver vinilos de ópera en Amazon",
    };
  }

  // Fallback general vinyl collection
  return {
    id: "vinyl-coleccion-general",
    badge: "💿 Top Ventas en Discos de Vinilo",
    title: "Discos de Vinilo LP Más Vendidos — Ediciones de Colección 180g",
    subtitle:
      "Explora el catálogo oficial de álbumes clásicos y reediciones remasterizadas en vinilo.",
    features: [
      "Los LPs más vendidos de rock, pop, baladas y jazz en formato analógico",
      "Ediciones nuevas selladas con envío protegido",
      "Compatible con todos los tocadiscos de 33 1/3 RPM",
    ],
    categoryType: "vinyl",
    queryES: "discos de vinilo LP mas vendidos",
    queryUS: "best selling vinyl records LP",
    ctaLabel: "Ver catálogo de vinilos en Amazon",
  };
}

/**
 * Main context engine: Given any of the 1,895 articles (slug, category, title),
 * returns the 3 highest-converting Amazon affiliate products tailored to that exact page.
 */
export function getContextualAmazonProducts(
  slug: string,
  category: string,
  title: string
): {
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
} {
  const s = `${slug} ${title.toLowerCase()}`;

  // 1. MARSHALL TURNTABLE POST (High CTR & exact intent)
  if (s.includes("marshall")) {
    return {
      sectionTitle: "🎸 El Setup Rockero Recomendado en Amazon (Estilo Marshall + Vinilo)",
      sectionSubtitle:
        "Combina el mejor tocadiscos Bluetooth negro mate con el mítico altavoz Marshall Acton III para un sonido analógico demoledor:",
      products: [
        CATALOG.MARSHALL_ACTON_III,
        CATALOG.AT_LP60XBT,
        CATALOG.SONY_PSLX310BT,
      ],
    };
  }

  // 2. NEEDLES & STYLUS POSTS ("aguja", "pua", "púa")
  if (
    s.includes("aguja") ||
    s.includes("pua") ||
    s.includes("púa")
  ) {
    return {
      sectionTitle: "💎 Agujas y Púas de Repuesto Más Vendidas en Amazon",
      sectionSubtitle:
        "Reemplaza tu púa desgastada a tiempo con los repuestos oficiales de diamante compatibles con el 95% de los tocadiscos:",
      products: [
        CATALOG.NEEDLE_ATN3600L,
        CATALOG.NEEDLE_UNIVERSAL_PACK,
        CATALOG.NEEDLE_ATVMN95E,
      ],
    };
  }

  // 3. VINYL VS ACETATE / DURABILITY / CARE & CLEANING POSTS
  if (
    s.includes("acetato") ||
    s.includes("dura") ||
    s.includes("longevidad") ||
    s.includes("cuidar") ||
    s.includes("buen-estado") ||
    s.includes("lp-vs") ||
    s.includes("diferencia-entre-lp")
  ) {
    return {
      sectionTitle: "🛡️ Kits para Conservar y Multiplicar la Vida Útil de tus Vinilos",
      sectionSubtitle:
        "Un disco de vinilo bien cuidado dura más de 70 años sin perder fidelidad. Estos son los accesorios esenciales de mantenimiento:",
      products: [
        CATALOG.CLEANING_KIT_4IN1,
        CATALOG.VINYL_SLEEVES_PACK,
        CATALOG.AT_LP60X,
      ],
    };
  }

  // 4. ANTIQUE / VINTAGE RECORD PLAYERS & GRAMOPHONE HISTORY POSTS
  if (
    s.includes("antiguamente") ||
    s.includes("antiguo") ||
    s.includes("maquina") ||
    s.includes("aparato") ||
    s.includes("crosley") ||
    s.includes("vintage") ||
    s.includes("retro")
  ) {
    return {
      sectionTitle: "📻 Los Mejores Tocadiscos de Estilo Antiguo y Vintage en Amazon",
      sectionSubtitle:
        "Diseño nostálgico de madera o maletín clásico de los años 50 con tecnología moderna (Bluetooth, 3 velocidades y aguja segura):",
      products: [
        CATALOG.VICTROLA_EMPIRE_6IN1,
        CATALOG.CROSLEY_CRUISER_PLUS,
        CATALOG.AT_LP60X,
      ],
    };
  }

  // 5. SPEAKERS & CONNECTION POSTS
  if (s.includes("altavoces") || s.includes("conecta") || s.includes("phono")) {
    return {
      sectionTitle: "🔊 Los Mejores Altavoces y Equipos para Conectar tu Tocadiscos",
      sectionSubtitle:
        "Equipos con preamplificador integrado y monitores activos que se conectan directamente sin complicaciones:",
      products: [
        CATALOG.EDIFIER_R1280DB,
        CATALOG.MARSHALL_ACTON_III,
        CATALOG.AT_LP60XBT,
      ],
    };
  }

  // 6. BLUETOOTH & MODERN TURNTABLES
  if (s.includes("bluetooth") || s.includes("moderno")) {
    return {
      sectionTitle: "📶 Los Mejores Tocadiscos con Bluetooth en Amazon",
      sectionSubtitle:
        "Conecta tus discos de vinilo sin cables a tus altavoces o auriculares inalámbricos con un solo botón:",
      products: [
        CATALOG.AT_LP60XBT,
        CATALOG.SONY_PSLX310BT,
        CATALOG.CROSLEY_CRUISER_PLUS,
      ],
    };
  }

  // 7. PROFESSIONAL / ALL OTHER TURNTABLE REVIEWS (El Corte Inglés, Liverpool, Amazon, Mejores de la historia)
  if (
    category === "resenas" ||
    s.includes("tocadiscos") ||
    s.includes("tornamesa")
  ) {
    return {
      sectionTitle: "🏆 Los 3 Tocadiscos Más Vendidos y Mejor Valorados en Amazon",
      sectionSubtitle:
        "Comparativa directa de los modelos líderes en calidad acústica, cuidado del vinilo y mejor precio con garantía oficial:",
      products: [
        CATALOG.AT_LP60X,
        CATALOG.SONY_PSLX310BT,
        CATALOG.AT_LP120XUSB,
      ],
    };
  }

  // 8. ALL DECADE, ARTIST & OPERA ARTICLES (1,800+ pages)
  const dynamicVinyl = buildDynamicVinylProduct(slug, title, category);

  return {
    sectionTitle: "💿 Escucha esta Música en su Formato Original (Vinilo LP y Equipos)",
    sectionSubtitle:
      "Encuentra las ediciones oficiales en disco de vinilo de 180 gramos y el equipamiento recomendado en Amazon:",
    products: [
      dynamicVinyl,
      CATALOG.AT_LP60X,
      CATALOG.CLEANING_KIT_4IN1,
    ],
  };
}
