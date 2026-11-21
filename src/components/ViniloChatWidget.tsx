"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { CHAT_ENDPOINT, OPEN_CHAT_EVENT } from "@/lib/chat-constants";

const STORAGE_VISITOR_KEY = "vr_chat_visitor_v1";
const STORAGE_SESSION_KEY = "vr_chat_session_v1";
const STORAGE_MESSAGES_KEY = "vr_chat_messages_v1";

export interface ChatArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedArticles?: ChatArticleCard[];
  suggestedOptions?: string[];
  createdAt: string;
}

const INITIAL_QUICK_OPTIONS = [
  "🎛️ ¿Qué tocadiscos de vinilo me recomiendas comprar?",
  "💎 ¿Cada cuánto cambiar la aguja o púa y cuál elegir?",
  "🔊 Cómo conectar mi tocadiscos a altavoces o Bluetooth",
  "🕺 Grandes cantantes y bandas de los años 70 y 80",
  "🎷 Leyendas del Jazz y Rock & Roll de los 50 y 60",
  "🎤 Clásicos de los años 90 y Cantantes de Ópera",
  "💿 Cómo limpiar y cuidar mis discos de vinilo LP",
];

const DEFAULT_WELCOME =
  "¡Hola! 👋 Soy tu Asesor Musical y de Vinilos IA de Vinilo Retro. Pregúntame qué tocadiscos comprar, cómo cambiar la aguja o púa, cómo conectar tus altavoces o cualquier duda sobre los grandes discos y cantantes de los años 50, 60, 70, 80, 90 y la ópera.";

export default function ViniloChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showTeaser, setShowTeaser] = useState(true);
  const [visitorId, setVisitorId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingPromptRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      let vid = localStorage.getItem(STORAGE_VISITOR_KEY);
      if (!vid) {
        vid =
          "vr-" +
          Math.random().toString(36).slice(2, 10) +
          "-" +
          Date.now().toString(36);
        localStorage.setItem(STORAGE_VISITOR_KEY, vid);
      }
      setVisitorId(vid);

      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) setSessionId(savedSession);

      const savedMessages = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }

    fetch(CHAT_ENDPOINT, { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.is_enabled === "boolean") {
          setIsEnabled(data.is_enabled);
        }
        if (data?.welcome_message) {
          setWelcomeMessage(data.welcome_message);
        }
      })
      .catch(() => {
        // fallback to default enabled
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen, isLoading]);

  const persistMessages = useCallback(
    (nextMessages: ChatMessage[], nextSessionId?: string | null) => {
      setMessages(nextMessages);
      try {
        localStorage.setItem(
          STORAGE_MESSAGES_KEY,
          JSON.stringify(nextMessages.slice(-24))
        );
        if (nextSessionId) {
          localStorage.setItem(STORAGE_SESSION_KEY, nextSessionId);
        }
      } catch {
        // ignore
      }
    },
    []
  );

  const trackArticleClick = (
    targetUrl: string,
    article?: { slug?: string; title?: string; category?: string }
  ) => {
    try {
      fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "track_click",
          session_id: sessionId,
          visitor_id: visitorId,
          article_slug: article?.slug || null,
          article_title: article?.title || null,
          category: article?.category || null,
          target_url: targetUrl,
          page_url:
            typeof window !== "undefined"
              ? window.location.href
              : "https://viniloretro.com/",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: "u-" + Date.now(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const updatedWithUser = [...messages, userMsg];
      persistMessages(updatedWithUser, sessionId);
      setInput("");
      setIsLoading(true);

      try {
        const historyPayload = updatedWithUser.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            session_id: sessionId,
            visitor_id: visitorId,
            message: trimmed,
            history: historyPayload.slice(0, -1),
            page_url:
              typeof window !== "undefined"
                ? window.location.href
                : "https://viniloretro.com/",
            user_agent:
              typeof navigator !== "undefined" ? navigator.userAgent : "",
          }),
        });

        const data = await res.json();
        const newSessId = data.session_id || sessionId;
        if (newSessId && newSessId !== sessionId) {
          setSessionId(newSessId);
        }

        const assistantMsg: ChatMessage = {
          id: "a-" + Date.now(),
          role: "assistant",
          content:
            data.reply ||
            "Te recomiendo revisar nuestras guías de tocadiscos y décadas musicales en [Vinilo Retro](https://viniloretro.com/curiosidades/).",
          recommendedArticles: Array.isArray(data.recommended_articles)
            ? data.recommended_articles
            : [],
          suggestedOptions: Array.isArray(data.suggested_options)
            ? data.suggested_options
            : [],
          createdAt: new Date().toISOString(),
        };

        persistMessages([...updatedWithUser, assistantMsg], newSessId);
      } catch {
        const fallbackMsg: ChatMessage = {
          id: "a-err-" + Date.now(),
          role: "assistant",
          content:
            "En este momento hubo una demora en la conexión. Puedes explorar nuestras +1,895 guías de tocadiscos y música en [Vinilo Retro](https://viniloretro.com/curiosidades/).",
          suggestedOptions: ["Intentar de nuevo"],
          createdAt: new Date().toISOString(),
        };
        persistMessages([...updatedWithUser, fallbackMsg], sessionId);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, persistMessages, sessionId, visitorId]
  );

  // Listen for custom open chat events triggered from page buttons
  useEffect(() => {
    const handleOpenEvent = (ev: Event) => {
      const customEv = ev as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setShowTeaser(false);
      if (customEv.detail?.prompt) {
        pendingPromptRef.current = customEv.detail.prompt;
      }
    };
    window.addEventListener(OPEN_CHAT_EVENT, handleOpenEvent);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isOpen && pendingPromptRef.current && !isLoading) {
      const p = pendingPromptRef.current;
      pendingPromptRef.current = null;
      sendMessage(p);
    }
  }, [isOpen, isLoading, sendMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setSessionId(null);
    try {
      localStorage.removeItem(STORAGE_MESSAGES_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const toLocalOrFullHref = (url: string) => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      return url.replace(/^https?:\/\/(www\.)?viniloretro\.com/i, "") || "/";
    }
    return url;
  };

  const toImageSrc = (imgUrl: string) => {
    if (!imgUrl)
      return "/images/El-Renacer-del-Vinilo-La-Magia-de-los-Discos-de-Vinilo.jpg";
    return imgUrl.replace(/^https?:\/\/(www\.)?viniloretro\.com/i, "");
  };

  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g;
      const parts = line.split(tokenRegex);

      return (
        <p key={lineIdx} className="leading-relaxed mb-1.5 last:mb-0">
          {parts.map((part, i) => {
            const linkMatch = part.match(
              /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/
            );
            if (linkMatch) {
              const [, label, url] = linkMatch;
              return (
                <a
                  key={i}
                  href={toLocalOrFullHref(url)}
                  onClick={() => trackArticleClick(url, { title: label })}
                  className="inline-flex items-center gap-1 font-bold text-[#b45309] underline decoration-[#f59e0b] decoration-2 underline-offset-2 hover:text-[#78350f] transition-colors"
                >
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              );
            }

            const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
            if (boldMatch) {
              return (
                <strong key={i} className="font-bold text-[#1c130e]">
                  {boldMatch[1]}
                </strong>
              );
            }

            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (!isEnabled) return null;

  const latestAssistantMsg =
    messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1]
      : null;

  return (
    <div className="fixed bottom-[86px] right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[415px] h-[590px] max-h-[80vh] rounded-3xl bg-white border border-[#e7dacb] shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Asesor Musical y de Vinilos IA Vinilo Retro"
        >
          {/* Header */}
          <div
            className="px-4 py-3.5 text-white flex items-center justify-between gap-3 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #1c110a 0%, #5c2808 55%, #b45309 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full bg-white/15 border border-amber-400/40 grid place-items-center shrink-0">
                <span className="text-xl" aria-hidden="true">
                  💿
                </span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#8CC63F] border-2 border-[#1c110a]"
                  title="En línea"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[15px] leading-tight truncate text-white">
                    Asesor IA · Vinilo Retro
                  </h3>
                  <span className="inline-flex items-center whitespace-nowrap shrink-0 leading-none text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#fef3c7] text-[#78350f]">
                    En línea
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 truncate mt-0.5">
                  Tocadiscos, agujas, vinilos y música · +1,895 guías
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-xs text-white transition-colors cursor-pointer"
                  title="Reiniciar conversación"
                  aria-label="Reiniciar conversación"
                >
                  ↺
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-sm font-bold text-white transition-colors cursor-pointer"
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fdfaf5]"
            data-lenis-prevent
          >
            {/* Welcome Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1c110a] text-amber-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 border border-amber-500/40">
                💿
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-[#e7dacb] p-3.5 text-[13.5px] text-[#1c130e] shadow-sm max-w-[88%]">
                <p className="leading-relaxed">{welcomeMessage}</p>
              </div>
            </div>

            {/* Initial Quick Options */}
            {messages.length === 0 && !isLoading && (
              <div className="pl-9 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#786554]">
                  Elige qué quieres consultar hoy:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-[#e5c9a8] text-[#78350f] hover:bg-[#b45309] hover:text-white hover:border-[#b45309] transition-all shadow-sm cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2.5">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-[#b45309] text-white px-3.5 py-2.5 text-[13.5px] max-w-[85%] shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1c110a] text-amber-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 border border-amber-500/40">
                      💿
                    </div>
                    <div className="space-y-2.5 max-w-[88%] min-w-0">
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-[#e7dacb] p-3.5 text-[13.5px] text-[#291d16] shadow-sm">
                        {renderFormattedContent(msg.content)}
                      </div>

                      {/* Recommended Article Cards */}
                      {msg.recommendedArticles &&
                        msg.recommendedArticles.length > 0 && (
                          <div className="space-y-2">
                            {msg.recommendedArticles.map((art) => (
                              <div
                                key={art.slug}
                                className="rounded-2xl bg-white border border-[#e5c9a8] p-3 shadow-sm hover:border-[#b45309] transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={toImageSrc(art.image)}
                                    alt={art.title}
                                    className="w-16 h-16 rounded-xl object-cover bg-[#f5efe6] shrink-0 border border-[#e7dacb]"
                                    loading="lazy"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b45309] block truncate">
                                      {art.categoryName} · ⏱️ {art.readTime}
                                    </span>
                                    <h4 className="font-extrabold text-xs sm:text-[13px] text-[#1c130e] line-clamp-2 leading-snug">
                                      {art.title}
                                    </h4>
                                  </div>
                                </div>
                                <a
                                  href={toLocalOrFullHref(art.url)}
                                  onClick={() =>
                                    trackArticleClick(art.url, {
                                      slug: art.slug,
                                      title: art.title,
                                      category: art.category,
                                    })
                                  }
                                  className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1c110a] via-[#78350f] to-[#b45309] hover:from-[#29180e] hover:to-[#92400e] text-amber-200 font-extrabold text-xs py-2 px-3 transition-colors shadow-sm"
                                >
                                  <span>Leer guía en Vinilo Retro</span>
                                  <span aria-hidden="true">→</span>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Suggested Follow-up Options */}
            {latestAssistantMsg &&
              latestAssistantMsg.suggestedOptions &&
              latestAssistantMsg.suggestedOptions.length > 0 &&
              !isLoading && (
                <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                  {latestAssistantMsg.suggestedOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#b45309]/40 text-[#78350f] hover:bg-[#b45309] hover:text-white transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1c110a] text-amber-400 grid place-items-center text-xs font-bold shrink-0">
                  💿
                </div>
                <div className="rounded-2xl bg-white border border-[#e7dacb] px-4 py-3 text-xs text-[#786554] flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#b45309] animate-bounce" />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#f59e0b] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#1c110a] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="ml-1 font-medium">
                    Buscando en la enciclopedia del vinilo...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#e7dacb] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre tocadiscos, agujas, vinilos o música..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-[#dfd0be] bg-[#fdfaf5] px-4 py-2.5 text-[13.5px] text-[#1c130e] placeholder:text-[#8c7a6b] focus:outline-none focus:border-[#b45309]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#b45309] hover:bg-[#78350f] disabled:opacity-45 text-white grid place-items-center shrink-0 transition-colors cursor-pointer"
              aria-label="Enviar consulta"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Callout Pill + Main Trigger Button */}
      <div className="flex items-center gap-2.5">
        {!isOpen && showTeaser && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white border border-[#e5c9a8] shadow-lg px-3.5 py-2 text-xs font-semibold text-[#1c130e]">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
              <span>
                ¿Dudas de tocadiscos, vinilos o música?{" "}
                <strong className="text-[#b45309]">
                  Pregúntale a la IA →
                </strong>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeaser(false)}
              className="text-[#786554] hover:text-[#1c130e] ml-1 text-[11px] cursor-pointer"
              aria-label="Ocultar aviso"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full px-4 py-3 sm:px-5 sm:py-3.5 text-white font-extrabold text-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #1c110a 0%, #78350f 52%, #d97706 100%)",
            boxShadow: "0 14px 30px -6px rgba(180, 83, 9, 0.65)",
          }}
          aria-label={
            isOpen
              ? "Cerrar Asesor IA de Vinilo Retro"
              : "Abrir Asesor IA de Vinilo Retro"
          }
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fbbf24]" />
          </span>
          <span>{isOpen ? "Cerrar Asesor IA" : "Asesor IA Vinilos"}</span>
          <span className="text-base" aria-hidden="true">
            💿
          </span>
        </button>
      </div>
    </div>
  );
}
