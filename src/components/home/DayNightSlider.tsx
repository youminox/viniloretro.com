"use client";

import { useCallback, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Escena arrastrable día ↔ noche: cambia la luz sobre la sala de escucha, mostrando el ritual y el disco ideal según la hora. */
export default function DayNightSlider() {
  const [v, setV] = useState(22);
  const [touched, setTouched] = useState(false);
  const scene = useRef<HTMLDivElement>(null);

  const t = v / 100;
  const dusk = clamp(1 - Math.abs(t - 0.5) * 2.4);
  const night = clamp((t - 0.45) / 0.45);
  const stars = clamp((t - 0.62) / 0.3);
  const sunX = 110 + t * 520;
  const sunY = 95 + Math.pow(t, 1.6) * 330;
  const sunO = 1 - clamp((t - 0.55) / 0.2);
  const moonY = 420 - clamp((t - 0.5) / 0.5) * 320;
  const hour = 8 + t * 15;
  const hh = Math.floor(hour);
  const mm = Math.round(((hour - hh) * 60) / 15) * 15;
  const time = `${String((hh + (mm === 60 ? 1 : 0)) % 24).padStart(2, "0")}:${String(
    mm === 60 ? 0 : mm
  ).padStart(2, "0")}`;

  const phase =
    t < 0.34
      ? "Mañana · Jazz, Soul & Café"
      : t < 0.67
      ? "Tarde · Rock Clásico 60s–80s"
      : "Noche · Baladas, Blues & Ópera";

  const ritualNote =
    t < 0.34
      ? "Despierta la sala con Jazz de los 50, Bossa Nova o Soul clásico a 33⅓ RPM"
      : t < 0.67
      ? "El momento para subir el volumen con himnos de los 60, 70, 80 y 90"
      : "Luz cálida, aguja limpia y las grandes voces de la Ópera y el Blues nocturno";

  const fromPointer = useCallback((clientX: number) => {
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setV(Math.round(clamp((clientX - r.left) / r.width) * 100));
    setTouched(true);
  }, []);

  return (
    <div className="daynight bg-[#0f0a07] shadow-[0_40px_80px_-40px_rgba(28,15,8,0.75)]">
      <div
        ref={scene}
        className="relative aspect-[4/5] cursor-ew-resize select-none sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") {
            if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId))
              fromPointer(e.clientX);
          }
        }}
      >
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="dn-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7cc8f2" />
              <stop offset="1" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="dn-dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4c1d95" />
              <stop offset="0.52" stopColor="#d97706" />
              <stop offset="1" stopColor="#fde047" />
            </linearGradient>
            <linearGradient id="dn-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#080604" />
              <stop offset="0.7" stopColor="#1e1008" />
              <stop offset="1" stopColor="#451a03" />
            </linearGradient>
            <radialGradient id="dn-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff7d1" />
              <stop offset="0.5" stopColor="#ffd166" />
              <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dn-lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="450" fill="url(#dn-day)" />
          <rect width="800" height="450" fill="url(#dn-dusk)" opacity={dusk} />
          <rect width="800" height="450" fill="url(#dn-night)" opacity={night} />

          {/* Estrellas */}
          <g opacity={stars} fill="#fef08a">
            {[
              [60, 40, 1.6],
              [140, 90, 1.1],
              [230, 30, 1.4],
              [320, 70, 1],
              [410, 25, 1.5],
              [500, 85, 1.1],
              [590, 35, 1.3],
              [690, 70, 1],
              [760, 30, 1.4],
              [100, 160, 1],
              [380, 140, 0.9],
              [720, 150, 1.2],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>

          {/* Sol */}
          <g opacity={sunO}>
            <circle cx={sunX} cy={sunY} r="90" fill="url(#dn-sun)" />
            <circle cx={sunX} cy={sunY} r="30" fill="#ffe08a" />
          </g>

          {/* Luna */}
          <g transform={`translate(640 ${moonY})`} opacity={clamp((t - 0.5) / 0.25)}>
            <circle r="30" fill="#fdf3d8" />
            <circle cx="12" cy="-8" r="26" fill="#180d06" opacity={0.9 * night + 0.1} />
          </g>

          {/* Horizonte y edificios de ciudad */}
          <path
            d="M0 330 C120 290 210 300 300 320 C400 280 520 290 620 315 C700 300 760 305 800 310 L800 450 L0 450 Z"
            fill={night > 0.5 ? "#1c130e" : "#b89f86"}
            opacity="0.9"
          />
          <path
            d="M0 330 C120 290 210 300 300 320 C400 280 520 290 620 315 C700 300 760 305 800 310 L800 450 L0 450 Z"
            fill="#160f0b"
            opacity={night}
          />
          <g fill={t > 0.5 ? "#120c08" : "#8c745c"}>
            {[
              [40, 300, 40, 150],
              [90, 270, 36, 180],
              [135, 310, 50, 140],
              [520, 285, 40, 165],
              [565, 255, 46, 195],
              [618, 300, 36, 150],
              [660, 275, 44, 175],
              [712, 305, 48, 145],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="3" />
            ))}
          </g>
          <g fill="#ffd27a" opacity={night}>
            {[
              [100, 285],
              [112, 310],
              [100, 335],
              [150, 325],
              [530, 300],
              [578, 270],
              [590, 300],
              [578, 330],
              [672, 290],
              [684, 320],
              [725, 318],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="7" height="9" rx="1" />
            ))}
          </g>

          {/* Luz cálida de lámpara nocturna */}
          <circle cx="400" cy="335" r="205" fill="url(#dn-lamp)" opacity={night} />

          {/* Mueble de madera audiófilo */}
          <rect x="0" y="392" width="800" height="58" fill={night > 0.5 ? "#3b1f10" : "#b88a5e"} />
          <rect x="0" y="392" width="800" height="58" fill="#241208" opacity={night * 0.72} />
          <rect x="0" y="388" width="800" height="6" fill="#ffffff" opacity="0.2" />

          {/* Altavoz izquierdo y derecho (separados del plato) */}
          <g transform="translate(215 316)">
            <rect width="46" height="74" rx="6" fill="#1c1917" stroke="#78350f" strokeWidth="2" />
            <circle cx="23" cy="22" r="8" fill="#44403c" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="23" cy="50" r="14" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
          </g>
          <g transform="translate(539 316)">
            <rect width="46" height="74" rx="6" fill="#1c1917" stroke="#78350f" strokeWidth="2" />
            <circle cx="23" cy="22" r="8" fill="#44403c" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="23" cy="50" r="14" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
          </g>

          {/* Tocadiscos central sobre el mueble */}
          <rect
            x="295"
            y="354"
            width="210"
            height="36"
            rx="7"
            fill="#78350f"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          {/* Tapa acrílica abierta */}
          <path
            d="M302 354 L318 296 L482 296 L498 354"
            fill="rgba(255,255,255,0.12)"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="2"
          />
          {/* Plato y vinilo en perspectiva */}
          <ellipse cx="392" cy="350" rx="68" ry="12" fill="#0c0a09" stroke="#d6d3d1" strokeWidth="2" />
          <ellipse cx="392" cy="350" rx="22" ry="4.5" fill="#f59e0b" />
          {/* Brazo sobre el disco */}
          <path
            d="M475 344 L446 350 L432 351"
            fill="none"
            stroke="#fde68a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Portada de LP apoyada junto al tocadiscos */}
          <g transform="translate(604 328) rotate(5)">
            <rect
              width="62"
              height="62"
              rx="4"
              fill="#92400e"
              stroke="#fde68a"
              strokeWidth="1.5"
            />
            <circle cx="31" cy="31" r="18" fill="#1c1917" />
            <circle cx="31" cy="31" r="6" fill="#fbbf24" />
          </g>

          {/* Ondas musicales saliendo del tocadiscos */}
          <g
            className="steam"
            fill="none"
            stroke="#fde047"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.9"
          >
            <path d="M368 286 C355 262 382 246 368 220" />
            <path d="M398 282 C385 256 412 238 398 208" />
            <path d="M428 286 C415 262 442 246 428 220" />
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/30 bg-black/35 px-4 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-amber-300">
            {phase}
          </p>
          <p className="font-display text-3xl font-extrabold tabular-nums">{time}</p>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 max-w-[54%] rounded-2xl border border-white/30 bg-black/35 px-4 py-3 text-right text-white backdrop-blur-md sm:right-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#fde047]">
            La calidez analógica permanece
          </p>
          <p className="font-display text-xs font-bold leading-snug sm:text-base">{ritualNote}</p>
        </div>

        {!touched && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1c130e] shadow-lg sm:bottom-5 sm:px-4 sm:py-2 sm:text-sm">
            ← Arrastra para pasar de la mañana a la sesión nocturna →
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 bg-[#0f0a07] px-5 py-4 text-white sm:px-7">
        <span aria-hidden>☀️</span>
        <label className="sr-only" htmlFor="dn-range">
          Hora del día en la sala de escucha
        </label>
        <input
          id="dn-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(Number(e.target.value));
            setTouched(true);
          }}
          aria-valuetext={`${phase}, ${time}`}
        />
        <span aria-hidden>🌙</span>
      </div>
    </div>
  );
}
