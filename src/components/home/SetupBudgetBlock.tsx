"use client";

import Link from "next/link";
import { useState } from "react";
import OpenChatButton from "@/components/OpenChatButton";

export type SetupOption = {
  key: string;
  label: string;
  tier: string;
  needleHours: number;
  needleType: string;
  img: string;
  alt: string;
  desc: string;
  components: string;
  href: string;
};

const WEEKS_PER_MONTH = 4.33;

/**
 * Planificador interactivo de Setup Analógico y Calculadora de Vida Útil de Aguja:
 * Alterna entre 3 niveles de equipamiento y calcula horas de escucha al mes y cuántos meses
 * dura la púa antes de requerir reemplazo preventivo para no dañar los vinilos.
 */
export default function SetupBudgetBlock({
  options,
}: {
  options: SetupOption[];
}) {
  const [k, setK] = useState(options[0].key);
  const [hoursPerWeek, setHoursPerWeek] = useState(6);

  const p = options.find((o) => o.key === k) || options[0];
  const hoursPerMonth = Math.round(hoursPerWeek * WEEKS_PER_MONTH);
  const lpsPerMonth = Math.round((hoursPerMonth * 60) / 42); // ~42 min promedio por LP
  const monthsLifespan = Math.max(
    1,
    Math.round(p.needleHours / Math.max(1, hoursPerMonth))
  );

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="card card-static spot relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f59e0b]/15 blur-3xl" />
        <div className="relative">
          <div
            className="inline-flex flex-wrap rounded-full bg-[#fdfaf5] border border-[var(--line)] p-1"
            role="tablist"
            aria-label="Nivel de Setup Analógico"
          >
            {options.map((o) => (
              <button
                key={o.key}
                role="tab"
                type="button"
                aria-selected={o.key === k}
                onClick={() => setK(o.key)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  o.key === k
                    ? "bg-[#b45309] text-white shadow"
                    : "text-[var(--muted)] hover:text-[#1c130e]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_1.15fr]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[250px] overflow-hidden rounded-2xl border border-[var(--line)] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={p.img}
                src={p.img}
                alt={p.alt}
                className="h-full w-full object-cover"
                style={{ animation: "fadeup .45s ease both" }}
              />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#b45309]">
                {p.tier}
              </p>
              <p
                className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1c130e]"
                aria-live="polite"
              >
                {p.needleHours.toLocaleString("es-PE")} h
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#78350f]">
                Vida útil estimada · {p.needleType}
              </p>
              <p className="mt-2.5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {p.desc}
              </p>
              <p className="mt-2 rounded-xl bg-[#fdfaf5] border border-amber-200/70 px-3 py-2 text-xs text-[#1c130e]">
                <strong>Cadena recomendada:</strong> {p.components}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={p.href}
              className="btn btn-buy shine flex-1 text-sm"
              data-magnetic
            >
              Ver guía de {p.label.toLowerCase()} →
            </Link>
            <OpenChatButton
              label="Pedir recomendación IA"
              prompt={`Quiero armar o mejorar un ${p.label} (${p.components}). ¿Qué tocadiscos, aguja y altavoces me recomiendas?`}
              className="btn btn-ghost text-sm"
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#291206] via-[#120b07] to-[#451a03] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#fbbf24]/15 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#fde047]">
          Calculadora de Desgaste de Aguja / Púa
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          ¿Cada cuánto debes cambiar tu aguja?
        </h3>
        <p className="mt-2 text-sm text-white/70">
          Desliza cuántas horas por semana escuchas tus discos de vinilo. Calculamos tu volumen
          mensual de LPs y cuántos meses durará tu púa actual ({p.needleType}) sin deteriorar los
          surcos.
        </p>

        <label
          htmlFor="vr-week"
          className="mt-6 flex items-center justify-between text-sm font-semibold"
        >
          <span>Horas de escucha por semana</span>
          <span className="rounded-full bg-white/10 px-3.5 py-1 font-display text-lg text-[#fde047]">
            {hoursPerWeek} h / sem
          </span>
        </label>
        <input
          id="vr-week"
          type="range"
          min={1}
          max={20}
          step={1}
          value={hoursPerWeek}
          onChange={(e) => setHoursPerWeek(Number(e.target.value))}
          className="mt-3 w-full accent-[#fbbf24]"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-white/45">
          {[1, 4, 8, 12, 16, 20].map((n) => (
            <span key={n}>{n}h</span>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Horas / mes", `${hoursPerMonth} h`],
            ["Discos LP / mes", `~${lpsPerMonth} LPs`],
            ["Duración de púa", `${monthsLifespan} meses`],
          ].map(([l, val], i) => (
            <div
              key={l}
              className={`glass flex flex-col-reverse p-3 ${
                i === 2 ? "border-[#fbbf24]/50 bg-[#fbbf24]/10" : ""
              }`}
            >
              <dt className="mt-1 text-[0.7rem] leading-tight text-white/65">{l}</dt>
              <dd
                className={`font-display font-extrabold ${
                  i === 2
                    ? "text-xl text-[#fde047] sm:text-2xl"
                    : "text-xl sm:text-2xl"
                }`}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs text-white/60">
          Con {hoursPerWeek} h semanales (~{hoursPerMonth} h al mes, equivalente a escuchar unos{" "}
          {lpsPerMonth} álbumes LP completos), una <strong>{p.needleType.toLowerCase()}</strong> de{" "}
          {p.needleHours} horas rinde aproximadamente{" "}
          <strong className="text-[#fde047]">{monthsLifespan} meses</strong> de reproducción segura.
        </p>
      </div>
    </div>
  );
}
