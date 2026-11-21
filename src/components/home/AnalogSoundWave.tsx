/** SVG animado: vibraciones mecánicas del microsurco que la aguja de diamante y la cápsula magnética transforman en ondas analógicas cálidas. Solo corre en pantalla. */
export default function AnalogSoundWave() {
  const drops = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x: 200 + Math.cos(a) * 46,
      y: 210 + Math.sin(a) * 46,
      dx: `${Math.cos(a) * 150}px`,
      dy: `${Math.sin(a) * 150}px`,
      d: `${(i % 6) * 0.65}s`,
      r: 7 + (i % 3) * 2,
    };
  });
  const strands = Array.from({ length: 7 }).map((_, i) => {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    const x1 = 200 + Math.cos(a) * 30,
      y1 = 210 + Math.sin(a) * 30;
    const x2 = 200 + Math.cos(a) * 124,
      y2 = 210 + Math.sin(a) * 124;
    const mx = 200 + Math.cos(a + 0.5) * 82,
      my = 210 + Math.sin(a + 0.5) * 82;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  });

  return (
    <div className="gel-scene relative mx-auto aspect-square w-full max-w-[460px]">
      <svg
        viewBox="0 0 400 420"
        className="h-full w-full"
        role="img"
        aria-label="Ilustración: la aguja de diamante convierte las vibraciones del microsurco en ondas armónicas analógicas"
      >
        <defs>
          <filter id="fg-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
            <feColorMatrix
              in="b"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
          </filter>
          <radialGradient id="fg-gel" cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#fef08a" />
            <stop offset="0.55" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#78350f" />
          </radialGradient>
          <radialGradient id="fg-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fbbf24" stopOpacity="0.35" />
            <stop offset="1" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="210" r="190" fill="url(#fg-halo)" />
        <circle
          cx="200"
          cy="210"
          r="152"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeDasharray="4 7"
        />
        <circle
          cx="200"
          cy="210"
          r="116"
          fill="none"
          stroke="rgba(251,191,36,0.16)"
          strokeDasharray="8 6"
        />

        {strands.map((d, i) => (
          <path
            key={i}
            d={d}
            className="fiber-strand"
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.65"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        <g filter="url(#fg-goo)">
          <circle className="gel-blob" cx="200" cy="210" r="46" fill="url(#fg-gel)" />
          <circle
            className="gel-blob"
            cx="178"
            cy="196"
            r="26"
            fill="#f59e0b"
            style={{ animationDelay: "0.4s" }}
          />
          <circle
            className="gel-blob"
            cx="224"
            cy="226"
            r="24"
            fill="#b45309"
            style={{ animationDelay: "0.9s" }}
          />
          {drops.map((p, i) => (
            <circle
              key={i}
              className="drop"
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="#fde047"
              style={{
                ["--dx" as string]: p.dx,
                ["--dy" as string]: p.dy,
                animationDelay: p.d,
              }}
            />
          ))}
        </g>

        <g fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700">
          <g transform="translate(14 40)">
            <rect
              width="124"
              height="26"
              rx="13"
              fill="rgba(251,191,36,0.18)"
              stroke="rgba(251,191,36,0.55)"
            />
            <text x="62" y="17" textAnchor="middle" fill="#fef3c7">
              microsurco LP
            </text>
          </g>
          <g transform="translate(256 58)">
            <rect
              width="130"
              height="26"
              rx="13"
              fill="rgba(245,158,11,0.18)"
              stroke="rgba(245,158,11,0.6)"
            />
            <text x="65" y="17" textAnchor="middle" fill="#fde68a">
              aguja de diamante
            </text>
          </g>
          <g transform="translate(124 372)">
            <rect
              width="152"
              height="26"
              rx="13"
              fill="rgba(180,83,9,0.25)"
              stroke="rgba(251,191,36,0.6)"
            />
            <text x="76" y="17" textAnchor="middle" fill="#fef08a">
              calidez analógica RIAA
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
