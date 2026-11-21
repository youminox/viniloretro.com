"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    t: "El Disco LP de 12\" Entra al Plato (33⅓ RPM)",
    d: "El vinilo limpio y libre de estática se apoya sobre el mat del plato con tracción estable y sin vibraciones.",
  },
  {
    n: "02",
    t: "El Brazo Desciende y la Aguja de Diamante Lee el Surco",
    d: "Con el contrapeso calibrado (1.5 a 2.5 g), la púa recorre las paredes izquierda y derecha del microsurco estéreo.",
  },
  {
    n: "03",
    t: "Preamp Phono RIAA y Ondas Cálidas en tu Sala",
    d: "La cápsula magnética convierte la vibración en señal eléctrica, el preamp ecualiza la curva RIAA y los altavoces llenan la noche de música.",
  },
];

/** Escena fijada con GSAP ScrollTrigger: el vinilo entra al plato, el brazo se posa en el surco, el disco gira y emergen las ondas cálidas bajo la noche estrellada. */
export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (reduce) {
          gsap.set(q(".vinyl-disc"), { opacity: 1, scale: 1 });
          gsap.set(q(".tonearm"), { rotate: 24, svgOrigin: "305 125" });
          gsap.set(q(".sound-waves, .night, .moon, .stars, .warm-glow"), { opacity: 1 });
          gsap.set(q(".step"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2000",
            scrub: 0.7,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });

        tl.to(q(".step-0"), { opacity: 1, duration: 0.2 }, 0)
          .to(q(".step-0 .dot"), { backgroundColor: "#D97706", color: "#fff", duration: 0.2 }, 0)
          .fromTo(
            q(".vinyl-disc"),
            { opacity: 0, scale: 0.72, y: -40 },
            { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power2.out" },
            0
          )
          .to(q(".vinyl-grooves"), { rotate: 360, svgOrigin: "190 250", duration: 1.2 }, 0.2)
          .to(q(".step-0"), { opacity: 0.8, duration: 0.2 }, 1.05)
          .to(q(".step-1"), { opacity: 1, duration: 0.2 }, 1.05)
          .to(q(".step-1 .dot"), { backgroundColor: "#78350F", color: "#fff", duration: 0.2 }, 1.05)
          .fromTo(
            q(".tonearm"),
            { rotate: 0, svgOrigin: "305 125" },
            { rotate: 25, svgOrigin: "305 125", duration: 0.7, ease: "power2.inOut" },
            1.1
          )
          .to(q(".stylus-spark"), { opacity: 1, scale: 1.25, duration: 0.35 }, 1.65)
          .to(q(".vinyl-grooves"), { rotate: 1080, svgOrigin: "190 250", duration: 2.2 }, 1.2)
          .to(q(".step-1"), { opacity: 0.8, duration: 0.2 }, 2.2)
          .to(q(".step-2"), { opacity: 1, duration: 0.2 }, 2.2)
          .to(
            q(".step-2 .dot"),
            { backgroundColor: "#F59E0B", color: "#1c1106", duration: 0.2 },
            2.2
          )
          .to(q(".warm-glow"), { opacity: 0.95, duration: 0.5 }, 2.25)
          .to(q(".sound-waves"), { opacity: 1, duration: 0.4 }, 2.4)
          .to(q(".night"), { opacity: 1, duration: 0.6 }, 2.6)
          .fromTo(q(".moon"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 2.75)
          .to(q(".stars"), { opacity: 1, duration: 0.5 }, 2.85)
          .to(q(".done"), { opacity: 1, y: 0, duration: 0.4 }, 3.1)
          .to(q(".bar"), { scaleX: 1, duration: 3.5 }, 0);
      }, el);
    };

    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io?.disconnect();
          init();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="del-surco-a-tus-oidos"
      ref={root}
      className="relative bg-gradient-to-b from-white via-[#fdfaf5] to-white"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-10 lg:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="eyebrow">Del surco a tus oídos</span>
            <h2 className="section-title mt-3">
              Tres pasos. <span className="text-[#b45309]">El ritual analógico perfecto.</span>
            </h2>
            <div className="mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#78350f]" />
            </div>
            <ol className="mt-6 space-y-3 sm:mt-8 sm:space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`step step-${i} flex gap-4`} style={{ opacity: 0.8 }}>
                  <span className="dot grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white font-display font-extrabold text-[#1c130e] shadow-md">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-xl">{s.t}</p>
                    <p className="text-sm text-[#57493e] sm:text-base">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p
              className="done mt-6 hidden text-sm text-[var(--muted)] sm:block"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              Regla de oro del vinilo: “Un tocadiscos nivelado y una aguja de diamante limpia
              preservan tus discos LP por décadas sin desgaste del microsurco.”
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[430px]">
            <svg
              viewBox="0 0 400 440"
              className="relative w-full drop-shadow-[0_30px_50px_rgba(90,35,10,0.28)]"
              role="img"
              aria-label="Animación: un disco de vinilo LP se coloca en el plato del tocadiscos, el brazo desciende sobre el surco y emergen ondas musicales cálidas"
            >
              <defs>
                <linearGradient id="vr-day" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fef3c7" />
                  <stop offset="1" stopColor="#fdfaf5" />
                </linearGradient>
                <linearGradient id="vr-night" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0f0906" />
                  <stop offset="0.65" stopColor="#261209" />
                  <stop offset="1" stopColor="#4c1f0b" />
                </linearGradient>
                <linearGradient id="vr-plinth" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#78350f" />
                  <stop offset="0.5" stopColor="#451a03" />
                  <stop offset="1" stopColor="#290f02" />
                </linearGradient>
                <radialGradient id="vr-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#fbbf24" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
                </radialGradient>
                <clipPath id="vr-panel">
                  <rect x="0" y="0" width="400" height="440" rx="36" />
                </clipPath>
              </defs>

              <g clipPath="url(#vr-panel)">
                {/* Cielo Día / Noche */}
                <rect width="400" height="440" fill="url(#vr-day)" />
                <circle cx="330" cy="65" r="24" fill="#F59E0B" opacity="0.85" />
                <rect className="night" width="400" height="440" fill="url(#vr-night)" opacity="0" />
                <g className="stars" opacity="0" fill="#fef08a">
                  {[
                    [40, 38, 1.5],
                    [92, 76, 1.1],
                    [150, 28, 1.4],
                    [225, 62, 1],
                    [58, 118, 1.2],
                    [265, 32, 1.5],
                    [362, 115, 1.1],
                    [188, 92, 0.9],
                  ].map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} />
                  ))}
                </g>
                <g className="moon" opacity="0">
                  <circle cx="324" cy="66" r="25" fill="#fef3c7" />
                  <circle cx="335" cy="58" r="21" fill="#1e0e07" />
                </g>

                {/* Halo cálido de escucha */}
                <circle className="warm-glow" cx="195" cy="250" r="175" fill="url(#vr-glow)" opacity="0" />

                {/* Plinto de madera caoba del tocadiscos */}
                <rect
                  x="42"
                  y="110"
                  width="316"
                  height="280"
                  rx="24"
                  fill="url(#vr-plinth)"
                  stroke="#b45309"
                  strokeWidth="3"
                />
                <rect
                  x="52"
                  y="120"
                  width="296"
                  height="260"
                  rx="18"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                />

                {/* Plato metálico base */}
                <circle cx="190" cy="250" r="114" fill="#27241d" stroke="#d6d3d1" strokeWidth="4" />
                <circle cx="190" cy="250" r="106" fill="#1c1917" />

                {/* Disco de Vinilo LP */}
                <g className="vinyl-disc">
                  <g className="vinyl-grooves">
                    <circle cx="190" cy="250" r="104" fill="#0c0a09" />
                    {/* Reflejo de luz en el vinilo */}
                    <path
                      d="M115 175 L265 325"
                      stroke="rgba(251, 191, 36, 0.16)"
                      strokeWidth="26"
                      strokeLinecap="round"
                    />
                    {/* Surcos concéntricos */}
                    <circle
                      cx="190"
                      cy="250"
                      r="92"
                      fill="none"
                      stroke="#292524"
                      strokeWidth="1.2"
                      strokeDasharray="18 6"
                    />
                    <circle
                      cx="190"
                      cy="250"
                      r="78"
                      fill="none"
                      stroke="#3f3a36"
                      strokeWidth="1.2"
                      strokeDasharray="12 5"
                    />
                    <circle
                      cx="190"
                      cy="250"
                      r="64"
                      fill="none"
                      stroke="#292524"
                      strokeWidth="1.2"
                      strokeDasharray="22 8"
                    />
                    <circle
                      cx="190"
                      cy="250"
                      r="50"
                      fill="none"
                      stroke="#44403c"
                      strokeWidth="1.2"
                    />
                    {/* Galleta central ámbar/dorada */}
                    <circle cx="190" cy="250" r="34" fill="#d97706" stroke="#fde68a" strokeWidth="2" />
                    <circle cx="190" cy="250" r="24" fill="#78350f" />
                    <text
                      x="190"
                      y="246"
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="800"
                      fill="#fef3c7"
                    >
                      VINILO RETRO
                    </text>
                    <text
                      x="190"
                      y="258"
                      textAnchor="middle"
                      fontSize="6"
                      fontWeight="700"
                      fill="#fde047"
                    >
                      33⅓ RPM · LP
                    </text>
                    {/* Eje central (Spindle) */}
                    <circle cx="190" cy="250" r="4.5" fill="#e7e5e4" />
                  </g>
                </g>

                {/* Controles de velocidad 33 / 45 RPM */}
                <rect x="64" y="346" width="22" height="14" rx="4" fill="#d97706" />
                <text x="75" y="356" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">
                  33
                </text>
                <rect x="92" y="346" width="22" height="14" rx="4" fill="#57534e" />
                <text x="103" y="356" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">
                  45
                </text>

                {/* Brazo fonocaptor (Tonearm) + Contrapeso + Portacápsula */}
                <g className="tonearm">
                  {/* Base del pivote */}
                  <circle cx="305" cy="155" r="22" fill="#292524" stroke="#a8a29e" strokeWidth="2.5" />
                  <circle cx="305" cy="155" r="11" fill="#d6d3d1" />
                  {/* Contrapeso trasero */}
                  <rect x="296" y="120" width="18" height="20" rx="4" fill="#57534e" stroke="#d6d3d1" />
                  {/* Tubo del brazo */}
                  <path
                    d="M305 155 L305 285 L284 316"
                    fill="none"
                    stroke="#e7e5e4"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Portacápsula (Headshell) y púa */}
                  <rect
                    x="273"
                    y="308"
                    width="18"
                    height="26"
                    rx="3"
                    transform="rotate(28 282 321)"
                    fill="#f59e0b"
                    stroke="#1c1917"
                    strokeWidth="1.5"
                  />
                  {/* Destello de aguja en el surco */}
                  <circle
                    className="stylus-spark"
                    cx="275"
                    cy="330"
                    r="7"
                    fill="#fde047"
                    opacity="0"
                  />
                </g>

                {/* Ondas musicales cálidas emergiendo del vinilo */}
                <g
                  className="sound-waves steam"
                  opacity="0"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                >
                  <path d="M135 120 C120 92 150 76 135 46" />
                  <path d="M190 112 C175 82 205 64 190 32" />
                  <path d="M245 120 C230 92 260 76 245 46" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
