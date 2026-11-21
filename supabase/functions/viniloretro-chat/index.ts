import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SITE = "https://viniloretro.com";
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"];

export interface ArticleRow {
  slug: string;
  title: string;
  category: string;
  category_name: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | null;
  search_text: string | null;
}

export interface ArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

function calculateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  if (model.includes("mini")) {
    return Number((promptTokens * 0.00000015 + completionTokens * 0.0000006).toFixed(6));
  }
  return Number((promptTokens * 0.0000025 + completionTokens * 0.00001).toFixed(6));
}

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "como", "cual", "cuales", "que", "quien", "quienes", "donde", "cuando", "por",
  "para", "con", "sin", "una", "uno", "unos", "unas", "los", "las", "del", "al",
  "hola", "buenas", "buenos", "dias", "tardes", "noches", "quiero", "puedo",
  "saber", "dime", "favor", "recomienda", "recomendame", "mejor", "mejores",
  "sobre", "este", "esta", "estos", "estas", "mas", "muy", "hay", "tiene",
  "tienen", "son", "fue", "eran", "todo", "todos", "toda", "todas", "guia", "pagina"
]);

const SYNONYMS: Record<string, string[]> = {
  tornamesa: ["tocadiscos", "vinilo"],
  tornamesas: ["tocadiscos", "vinilo"],
  giradiscos: ["tocadiscos", "vinilo"],
  picu: ["tocadiscos", "maquinas"],
  fonografo: ["tocadiscos", "maquinas"],
  gramofono: ["tocadiscos", "maquinas"],
  pua: ["aguja", "pua", "capsula"],
  puas: ["aguja", "pua", "capsula"],
  aguja: ["aguja", "pua", "capsula"],
  agujas: ["aguja", "pua", "capsula"],
  bocinas: ["altavoces", "conecta"],
  parlantes: ["altavoces", "conecta"],
  bafles: ["altavoces", "conecta"],
  altavoces: ["altavoces", "conecta"],
  cincuenta: ["50", "decada-50"],
  sesenta: ["60", "decada-60"],
  setenta: ["70", "decada-70"],
  ochenta: ["80", "decada-80"],
  noventa: ["90", "decada-90"],
  tenor: ["opera", "cantantes-de-opera"],
  tenores: ["opera", "cantantes-de-opera"],
  soprano: ["opera", "cantantes-de-opera"],
  sopranos: ["opera", "cantantes-de-opera"],
  lirico: ["opera", "cantantes-de-opera"],
  lirica: ["opera", "cantantes-de-opera"],
};

function stemWord(w: string): string {
  if (w.length > 5 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("s")) return w.slice(0, -1);
  return w;
}

function extractTokens(text: string): string[] {
  const raw = norm(text)
    .split(" ")
    .filter((w) => (w.length >= 3 || /^(50|60|70|80|90)$/.test(w)) && !STOPWORDS.has(w));
  const expanded: string[] = [];
  for (const w of raw) {
    expanded.push(w);
    if (SYNONYMS[w]) {
      for (const syn of SYNONYMS[w]) expanded.push(syn);
    }
  }
  return Array.from(new Set(expanded));
}

let catalogCache: { at: number; rows: ArticleRow[]; bySlug: Map<string, ArticleRow> } | null = null;

async function loadCatalog(): Promise<{ rows: ArticleRow[]; bySlug: Map<string, ArticleRow> }> {
  if (catalogCache && Date.now() - catalogCache.at < 10 * 60 * 1000 && catalogCache.rows.length > 0) {
    return catalogCache;
  }
  const pages = await Promise.all([
    supabase
      .from("viniloretro_articles")
      .select("slug, title, category, category_name, excerpt, featured_image, read_time, search_text")
      .eq("active", true)
      .range(0, 999),
    supabase
      .from("viniloretro_articles")
      .select("slug, title, category, category_name, excerpt, featured_image, read_time, search_text")
      .eq("active", true)
      .range(1000, 1999),
  ]);

  const rows: ArticleRow[] = [];
  const bySlug = new Map<string, ArticleRow>();
  for (const p of pages) {
    if (Array.isArray(p.data)) {
      for (const r of p.data as ArticleRow[]) {
        if (!bySlug.has(r.slug)) {
          bySlug.set(r.slug, r);
          rows.push(r);
        }
      }
    }
  }
  catalogCache = { at: Date.now(), rows, bySlug };
  return catalogCache;
}

function toArticleCard(r: ArticleRow): ArticleCard {
  const img = r.featured_image || "/images/El-Renacer-del-Vinilo-La-Magia-de-los-Discos-de-Vinilo.jpg";
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryName: r.category_name,
    url: `${SITE}/${r.category}/${r.slug}/`,
    image: img.startsWith("http") ? img : `${SITE}${img}`,
    readTime: r.read_time || "7 min",
    excerpt: (r.excerpt || "").slice(0, 145),
  };
}

function searchArticles(rows: ArticleRow[], userMessage: string, historyText: string, limit = 16): ArticleRow[] {
  const primaryTokens = extractTokens(userMessage);
  const contextTokens = extractTokens(historyText).filter((t) => !primaryTokens.includes(t));
  const fullPhrase = norm(userMessage);

  if (primaryTokens.length === 0 && contextTokens.length === 0) {
    const starterSlugs = [
      "guia-completa-que-tener-en-cuenta-al-comprar-un-tocadiscos",
      "como-saber-cuando-cambiar-la-pua-de-un-tocadiscos-consejos-y-senales",
      "descubre-la-aguja-perfecta-como-saber-que-aguja-comprar-para-tocadiscos",
      "conecta-tu-tocadiscos-facilmente-como-se-conecta-un-tocadiscos",
      "encuentra-los-mejores-altavoces-para-tu-tocadiscos-calidad-de-sonido-inigualable",
      "cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo",
      "cantantes-de-pop-en-los-anos-80-en-argentina",
      "principales-exponentes-de-la-opera-en-italia",
    ];
    const picked: ArticleRow[] = [];
    for (const s of starterSlugs) {
      const f = rows.find((r) => r.slug === s);
      if (f) picked.push(f);
    }
    return picked.length > 0 ? picked : rows.slice(0, 8);
  }

  const scored: Array<{ r: ArticleRow; score: number }> = [];

  for (const r of rows) {
    const titleNorm = norm(r.title);
    const catNorm = norm(`${r.category_name} ${r.category}`);
    const bodyNorm = r.search_text || `${titleNorm} ${catNorm} ${norm(r.excerpt || "")}`;

    let score = 0;

    if (fullPhrase.length >= 5 && titleNorm.includes(fullPhrase)) {
      score += 45;
    }

    let matchedPrimary = 0;
    for (const tok of primaryTokens) {
      const stem = stemWord(tok);
      if (titleNorm.includes(tok) || (stem.length >= 4 && titleNorm.includes(stem))) {
        score += 16;
        matchedPrimary++;
      } else if (catNorm.includes(tok) || (stem.length >= 4 && catNorm.includes(stem))) {
        score += 9;
        matchedPrimary++;
      } else if (bodyNorm.includes(tok) || (stem.length >= 4 && bodyNorm.includes(stem))) {
        score += 5;
        matchedPrimary++;
      }
    }

    if (matchedPrimary >= 2) {
      score += matchedPrimary * 8;
    }

    // Boost technical turntable guides when user asks about equipment
    if (
      (r.category === "resenas" || r.category === "curiosidades") &&
      primaryTokens.some((t) =>
        ["tocadiscos", "aguja", "pua", "altavoces", "bluetooth", "vinilo", "limpiar", "conecta", "comprar"].includes(t)
      )
    ) {
      score += 10;
    }

    for (const cTok of contextTokens.slice(-5)) {
      const stem = stemWord(cTok);
      if (titleNorm.includes(cTok) || (stem.length >= 4 && titleNorm.includes(stem))) {
        score += 3;
      }
    }

    if (score > 0) {
      scored.push({ r, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.r);
}

const CATEGORIES_OVERVIEW = `
ESTRUCTURA Y CATEGORÍAS OFICIALES DE VINILORETRO.COM (Fundador y Director Editorial: Charlie Lingán):
- Reseñas y Comparativas de Tocadiscos (33 guías): ${SITE}/resenas/ (tocadiscos Bluetooth, Crosley, Audio-Technica, guías de compra en El Corte Inglés, Liverpool, etc.)
- Guías Técnicas y Curiosidades del Vinilo (62 manuales): ${SITE}/curiosidades/ (cuándo cambiar la púa o aguja, qué aguja comprar, cómo conectar un tocadiscos a altavoces, cómo limpiar y cuidar vinilos, cómo funciona un tocadiscos, historia del vinilo)
- Década de los 50 (600 artículos): ${SITE}/decada-50/ (origen del Rock & Roll, leyendas del Jazz, Blues, Bolero, Tango y grandes voces de los años 50)
- Década de los 60 (255 artículos): ${SITE}/decada-60/ (invasión británica, The Beatles, The Rolling Stones, Bob Dylan, Janis Joplin, Soul, Rock Psicodélico y cantautores)
- Década de los 70 (235 artículos): ${SITE}/decada-70/ (Queen, Led Zeppelin, Pink Floyd, ABBA, David Bowie, Bob Marley, Eric Clapton, Bee Gees, Carlos Santana, KISS, música Disco, Rock Sinfónico y baladas)
- Década de los 80 (208 artículos): ${SITE}/decada-80/ (íconos del Pop y Rock en español e internacional en Argentina, España, Italia, México, Brasil, EE. UU. y Reino Unido)
- Década de los 90 (243 artículos): ${SITE}/decada-90/ (Rock alternativo, Grunge, Britpop, Pop latino, R&B, bandas mixtas, solistas y álbumes emblemáticos de fin de siglo)
- Cantantes de Ópera y Música Lírica (258 artículos): ${SITE}/cantantes-de-opera/ (tenores, sopranos, barítonos y grandes voces de Italia, España, Francia, Alemania y teatros líricos del mundo)
- Contacto / Sobre Charlie Lingán: ${SITE}/hola-hablamos/
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || (req.method === "GET" ? "config" : "chat");

    // 1. Load live config
    const { data: configRow } = await supabase
      .from("viniloretro_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = configRow || {
      is_enabled: true,
      ai_model: "gpt-4o-mini",
      temperature: 0.4,
      max_messages_per_session: 25,
      daily_budget_usd: 5.0,
      welcome_message:
        "¡Hola! 👋 Soy tu Asesor Musical y de Vinilos IA de Vinilo Retro. Pregúntame qué tocadiscos comprar, cómo cambiar la aguja o púa, cómo conectar tus altavoces o cualquier duda sobre los grandes discos y cantantes de los años 50, 60, 70, 80, 90 y la ópera.",
      custom_instructions: "",
    };

    const activeModel = ALLOWED_MODELS.includes(config.ai_model) ? config.ai_model : "gpt-4o-mini";

    if (mode === "config" || req.method === "GET") {
      return json({
        is_enabled: config.is_enabled,
        welcome_message: config.welcome_message,
        ai_model: activeModel,
        max_messages_per_session: config.max_messages_per_session,
      });
    }

    // 2. Track click on an article link or card
    if (mode === "track_click") {
      const { session_id, visitor_id, article_slug, article_title, category, target_url, page_url } = body;
      if (target_url) {
        await supabase.from("viniloretro_chat_clicks").insert({
          session_id: session_id || null,
          visitor_id: String(visitor_id || "anon").slice(0, 80),
          article_slug: article_slug ? String(article_slug).slice(0, 180) : null,
          article_title: article_title ? String(article_title).slice(0, 240) : null,
          category: category ? String(category).slice(0, 80) : null,
          target_url: String(target_url).slice(0, 500),
          page_url: page_url ? String(page_url).slice(0, 500) : null,
        });

        if (session_id) {
          const { data: sess } = await supabase
            .from("viniloretro_chat_sessions")
            .select("clicks_count, clicked_urls")
            .eq("id", session_id)
            .maybeSingle();
          if (sess) {
            const urls = Array.isArray(sess.clicked_urls) ? sess.clicked_urls : [];
            if (!urls.includes(target_url)) urls.push(target_url);
            await supabase
              .from("viniloretro_chat_sessions")
              .update({
                clicks_count: (sess.clicks_count || 0) + 1,
                clicked_urls: urls,
              })
              .eq("id", session_id);
          }
        }
      }
      return json({ success: true });
    }

    // 3. Chat Completion Mode
    if (!config.is_enabled) {
      return json({
        reply: `En este momento el Asesor IA está en mantenimiento breve. Puedes explorar nuestras +1,895 guías de tocadiscos, agujas e historia musical en [Vinilo Retro](${SITE}/).`,
        recommended_articles: [],
        suggested_options: ["Ver guías de tocadiscos", "Explorar décadas musicales"],
        disabled: true,
      });
    }

    const userMessage = String(body.message || "").trim().slice(0, 1000);
    if (!userMessage) {
      return json({ error: "Mensaje vacío" }, 400);
    }

    const visitorId = String(body.visitor_id || "vr-" + crypto.randomUUID().slice(0, 8)).slice(0, 80);
    const pageUrl = String(body.page_url || SITE + "/").slice(0, 500);
    const userAgent = String(body.user_agent || req.headers.get("user-agent") || "").slice(0, 300);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    // Check daily budget
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { data: todaySessions } = await supabase
      .from("viniloretro_chat_sessions")
      .select("estimated_cost_usd")
      .gte("last_message_at", startOfDay.toISOString());

    const spentToday = (todaySessions || []).reduce(
      (acc: number, r: any) => acc + Number(r.estimated_cost_usd || 0),
      0
    );

    if (spentToday >= Number(config.daily_budget_usd || 5)) {
      return json({
        reply: `Has alcanzado el límite de consultas automáticas del día. Puedes usar el buscador principal o explorar todas nuestras categorías en [Vinilo Retro](${SITE}/).`,
        recommended_articles: [],
        suggested_options: [],
      });
    }

    // Load or create session
    let existingSession: any = null;
    if (sessionId) {
      const { data: s } = await supabase
        .from("viniloretro_chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      existingSession = s;
    }

    if (
      existingSession &&
      existingSession.messages_count >= (config.max_messages_per_session || 25) * 2
    ) {
      return json({
        session_id: existingSession.id,
        reply: `Hemos llegado al máximo de mensajes por conversación. Puedes abrir cualquiera de las guías recomendadas o iniciar una nueva consulta sobre vinilos y música en [Vinilo Retro](${SITE}/).`,
        recommended_articles: [],
        suggested_options: [],
      });
    }

    if (!existingSession) {
      const { data: created, error: createErr } = await supabase
        .from("viniloretro_chat_sessions")
        .insert({
          visitor_id: visitorId,
          page_url: pageUrl,
          user_agent: userAgent,
          first_user_message: userMessage.slice(0, 250),
          last_user_message: userMessage.slice(0, 250),
          messages_count: 1,
          model_used: activeModel,
        })
        .select("*")
        .single();

      if (!createErr && created) {
        existingSession = created;
        sessionId = created.id;
      }
    }

    if (sessionId) {
      await supabase.from("viniloretro_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    // Search matching articles in our 1,895-article catalog
    const catalog = await loadCatalog();
    const recentHistoryText = history
      .slice(-3)
      .map((h: any) => h?.content || "")
      .join(" ");
    const candidateRows = searchArticles(catalog.rows, userMessage, recentHistoryText, 16);

    const candidatesPrompt =
      candidateRows.length > 0
        ? candidateRows
            .map(
              (r) =>
                `- SLUG: "${r.slug}" | TÍTULO: "${r.title}" | CATEGORÍA: ${r.category_name} | URL: ${SITE}/${r.category}/${r.slug}/ | RESUMEN: ${(r.excerpt || "").slice(0, 155)}`
            )
            .join("\n")
        : "No se encontraron artículos exactos con esos términos en el índice.";

    const systemPrompt = `Eres el Asesor Musical y Especialista en Sonido Analógico IA Oficial de Vinilo Retro (${SITE}), la enciclopedia en español con 1,895 artículos dedicada a los tocadiscos de vinilo, mantenimiento de agujas y púas, altavoces, coleccionismo de discos LP y la historia musical de los años 50, 60, 70, 80, 90 y la ópera (fundada por Charlie Lingán).

Tu misión es responder TODAS las consultas de los usuarios con pasión melómana, precisión técnica y claridad:
- Consultas sobre LA PÁGINA (${SITE}): qué secciones, categorías y guías tenemos, quién es Charlie Lingán y cómo navegar la enciclopedia.
- Consultas sobre TOCADISCOS, AGUJAS Y AUDIO ANALÓGICO: cómo elegir un tocadiscos (tracción por correa vs. directa, preamplificador Phono integrado vs. externo, contrapeso ajustable, antiskating, Bluetooth vs. RCA, modelos vintage o modernos como Audio-Technica, Crosley, Sony, Pioneer, Technics, Pro-Ject), cada cuánto cambiar la aguja o púa (diamante 500–1,000 horas vs. zafiro/rubí 50–100 horas, agujas cónicas vs. elípticas), cómo conectar altavoces activos o pasivos, cómo calibrar el brazo y cómo limpiar y conservar discos de vinilo (33⅓, 45 y 78 RPM, clasificación Goldmine M/NM/VG+).
- Consultas sobre MÚSICA, VINILOS, CANTANTES, BANDAS Y ÉPOCAS: biografías, discos LP imprescindibles, canciones, estilos y rankings de artistas de los años 50, 60, 70, 80, 90 (rock, pop, jazz, blues, soul, disco, rock en español, baladas, tango, bolero) y grandes cantantes de ópera (tenores, sopranos, barítonos en Italia, España, Francia y el mundo).

REGLAS OBLIGATORIAS DE ORIENTACIÓN:
1. CUANDO SÍ TENEMOS ARTÍCULOS EN EL LISTADO DE ABAJO QUE RESPONDEN O COMPLEMENTAN LA CONSULTA DEL USUARIO:
   - Responde su duda directamente con datos útiles y guíalo a entre 1 y 3 artículos del listado usando enlaces Markdown exactos: [Título del Artículo](${SITE}/categoria/slug/).
   - Incluye esos slugs exactos (máximo 3) en el arreglo "recommended_slugs" para que el chat muestre las tarjetas interactivas con portada y botón directo.
2. CUANDO EL USUARIO PREGUNTA POR UN MODELO DE TOCADISCOS, PROBLEMA TÉCNICO, DISCO, CANTANTE, BANDA O TEMA MUSICAL QUE NO TIENE UN ARTÍCULO EXACTO EN EL LISTADO:
   - ¡NUNCA dejes al usuario sin respuesta! Respóndele tú mismo con una explicación técnica o musical completa, detallada y práctica (pasos de diagnóstico, recomendaciones reales de discos/equipos o historia del artista).
   - Al final, si algún artículo o categoría oficial del listado de abajo se relaciona (por década, género o cuidado de tocadiscos), sugiérelo como lectura complementaria.
3. NUNCA inventes URLs ni slugs que no aparezcan en el listado de ARTÍCULOS ENCONTRADOS o en las CATEGORÍAS OFICIALES. Todos los enlaces deben pertenecer a ${SITE}/.
4. Contexto actual del visitante: está navegando en la página ${pageUrl}.
${config.custom_instructions ? "5. INSTRUCCIÓN ADICIONAL DEL ADMINISTRADOR: " + config.custom_instructions : ""}

${CATEGORIES_OVERVIEW}

ARTÍCULOS ENCONTRADOS EN VINILORETRO.COM PARA ESTA CONSULTA (USA SOLO ESTOS SLUGS Y URLS EXACTAS):
${candidatesPrompt}

FORMATO DE RESPUESTA (JSON ESTRICTO):
Responde ÚNICAMENTE con un objeto JSON válido con estas 3 llaves exactas:
{
  "reply": "Tu respuesta experta, cercana y bien estructurada en español (máximo 3 párrafos cortos o viñetas claras, con enlaces Markdown [Título](${SITE}/categoria/slug/) cuando enlaces a nuestras guías)",
  "recommended_slugs": ["slug-exacto-1", "slug-exacto-2"],
  "suggested_options": [
    "Pregunta corta u opción 1 para seguir conversando",
    "Pregunta corta u opción 2 para seguir conversando",
    "Pregunta corta u opción 3 para seguir conversando"
  ]
}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
        chatMessages.push({ role: h.role, content: h.content.slice(0, 1200) });
      }
    }
    chatMessages.push({ role: "user", content: userMessage });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages: chatMessages,
        temperature: Number(config.temperature) || 0.4,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      throw new Error("OpenAI status " + openaiRes.status);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent,
        recommended_slugs: candidateRows.slice(0, 2).map((r) => r.slug),
        suggested_options: [
          "¿Qué tocadiscos me recomiendas?",
          "¿Cuándo cambiar la aguja?",
          "Mejores cantantes de los 80",
        ],
      };
    }

    const slugs: string[] = Array.isArray(parsed.recommended_slugs)
      ? parsed.recommended_slugs.slice(0, 3)
      : [];
    const recommendedArticles: ArticleCard[] = slugs
      .map((s) => catalog.bySlug.get(s))
      .filter((r): r is ArticleRow => Boolean(r))
      .map(toArticleCard);

    const suggestedOptions: string[] = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options.slice(0, 3).map((s: unknown) => String(s).slice(0, 72))
      : [];

    const replyText: string =
      parsed.reply ||
      `Te recomiendo explorar nuestras guías de tocadiscos y décadas musicales en [Vinilo Retro](${SITE}/).`;

    const promptTokens = openaiData.usage?.prompt_tokens || 0;
    const completionTokens = openaiData.usage?.completion_tokens || 0;
    const totalTokens = openaiData.usage?.total_tokens || promptTokens + completionTokens;
    const costUsd = calculateCostUsd(activeModel, promptTokens, completionTokens);

    // Save assistant message & update session metrics
    if (sessionId && existingSession) {
      await supabase.from("viniloretro_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: replyText,
        recommended_articles: recommendedArticles,
        suggested_options: suggestedOptions,
        model: activeModel,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const prevRecs: string[] = Array.isArray(existingSession.recommended_articles)
        ? existingSession.recommended_articles
        : [];
      for (const ra of recommendedArticles) {
        if (!prevRecs.includes(ra.title)) prevRecs.push(ra.title);
      }

      await supabase
        .from("viniloretro_chat_sessions")
        .update({
          last_user_message: userMessage.slice(0, 250),
          messages_count: (existingSession.messages_count || 1) + 2,
          recommended_articles: prevRecs.slice(0, 30),
          prompt_tokens: (existingSession.prompt_tokens || 0) + promptTokens,
          completion_tokens: (existingSession.completion_tokens || 0) + completionTokens,
          total_tokens: (existingSession.total_tokens || 0) + totalTokens,
          estimated_cost_usd: Number(
            (Number(existingSession.estimated_cost_usd || 0) + costUsd).toFixed(6)
          ),
          model_used: activeModel,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    // Record in global token_usage table
    await supabase.from("token_usage").insert({
      source: "viniloretro.com",
      content_type: "ai_chat",
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
      slug: sessionId || visitorId,
    });

    return json({
      session_id: sessionId,
      reply: replyText,
      recommended_articles: recommendedArticles,
      suggested_options: suggestedOptions,
      model: activeModel,
    });
  } catch (err: any) {
    console.error("viniloretro-chat error:", err);
    return json(
      {
        error: err.message || "Error interno",
        reply: `Tuvimos un inconveniente momentáneo al procesar tu consulta. Puedes explorar nuestras +1,895 guías de tocadiscos y música en [Vinilo Retro](${SITE}/).`,
        recommended_articles: [],
        suggested_options: ["Intentar de nuevo"],
      },
      500
    );
  }
});
