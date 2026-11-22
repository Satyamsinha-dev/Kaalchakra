"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getEra } from "../../lib/eras";
import { useLang } from "../../components/LanguageProvider";
import Rule from "../../components/Rule";
import SiteHeader from "../../components/SiteHeader";

const MILESTONES = [2045, 2099, 2500, 3000, 5000, 10000, 1000000];
const MAX_YEAR = 1_000_000_000;

function yearToPos(year: number) {
  const n = MILESTONES.length;
  if (year <= MILESTONES[0]) return 0;
  if (year >= MILESTONES[n - 1]) return 1;
  const i = MILESTONES.findIndex((m, idx) => year >= m && year < MILESTONES[idx + 1]);
  const frac = (year - MILESTONES[i]) / (MILESTONES[i + 1] - MILESTONES[i]);
  return (i + frac) / (n - 1);
}

function posToYear(pos: number) {
  const n = MILESTONES.length;
  const x = Math.min(Math.max(pos, 0), 1) * (n - 1);
  const i = Math.min(Math.floor(x), n - 2);
  const frac = x - i;
  return Math.round(MILESTONES[i] + frac * (MILESTONES[i + 1] - MILESTONES[i]));
}

// Random year: log scale pe, taaki 2045 aur 500,000 dono ke chance barabar hon
function randomYear() {
  const lo = Math.log10(2030);
  const hi = Math.log10(1_000_000);
  const y = Math.round(10 ** (lo + Math.random() * (hi - lo)));
  return y >= 10000 ? Math.round(y / 100) * 100 : y;
}

const fmt = (n: number) => (n < 10000 ? String(n) : n.toLocaleString("en-US"));

export default function TimeMachinePage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const [year, setYear] = useState(3000);
  const [draft, setDraft] = useState("3000");

  function choose(y: number) {
    setYear(y);
    setDraft(String(y));
  }

  function commitDraft(): number {
    const n = parseInt(draft, 10);
    if (!n || n < 1) {
      setDraft(String(year));
      return year;
    }
    const y = Math.min(n, MAX_YEAR);
    choose(y);
    return y;
  }

  function moveTo(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    choose(posToYear((clientX - rect.left) / rect.width));
  }

  function step(dir: 1 | -1) {
    if (dir === 1) {
      const next = MILESTONES.find((m) => m > year);
      if (next) choose(next);
    } else {
      const prev = [...MILESTONES].reverse().find((m) => m < year);
      if (prev) choose(prev);
    }
  }

  const pct = yearToPos(year) * 100;
  const len = fmt(year).length;
  const yearSize =
    len <= 5 ? "clamp(3.5rem,9vw,7rem)" : len <= 9 ? "clamp(2.8rem,7vw,5.5rem)" : "clamp(2rem,5vw,4rem)";
  const era = getEra(year, lang);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/timeline-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-ivory/25" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 md:px-14">
        <SiteHeader />

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex w-full max-w-xl items-center gap-4 text-xs uppercase tracking-[0.35em] text-ink/70">
            <Rule />
            <span className="whitespace-nowrap">{t("tm.destination")}</span>
            <Rule />
          </div>

          <h1 className="mt-6 font-serif leading-none" style={{ fontSize: yearSize }}>
            {fmt(year)} <span className="text-[0.4em]">{t("year.suffix")}</span>
          </h1>

          {/* Era naam + teaser: era badalte hi dobara fade-in hota hai */}
          <div key={era.id} className="kc-rise mt-4 min-h-[4.5rem]">
            <p className="text-xs uppercase tracking-[0.3em] text-terracotta">{era.name}</p>
            <p className="mx-auto mt-2 max-w-md font-serif text-lg italic text-ink/70">{era.teaser}</p>
          </div>

          {/* Timeline */}
          <div className="mt-10 flex w-full max-w-6xl items-center gap-3 md:gap-6">
            <button
              type="button"
              aria-label={t("tm.prev")}
              onClick={() => step(-1)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold text-xl md:h-12 md:w-12"
            >
              ‹
            </button>

            <div className="flex-1 px-6 md:px-12">
              <div
                ref={trackRef}
                className="relative h-16 cursor-pointer touch-none select-none"
                onPointerDown={(e) => {
                  dragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  moveTo(e.clientX);
                }}
                onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
                onPointerUp={() => (dragging.current = false)}
                onPointerCancel={() => (dragging.current = false)}
              >
                <div className="absolute left-0 right-0 top-10 h-0.5 -translate-y-1/2 bg-gold/50" />
                <div
                  className="absolute left-0 top-10 h-0.5 -translate-y-1/2 bg-gold"
                  style={{ width: `${pct}%` }}
                />

                {MILESTONES.map((m, i) => {
                  const left = `${(i / (MILESTONES.length - 1)) * 100}%`;
                  return (
                    <div key={m}>
                      <span
                        className="absolute top-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
                        style={{ left }}
                      />
                      <span
                        className={`absolute top-0 hidden -translate-x-1/2 whitespace-nowrap font-serif text-sm sm:block ${
                          m === year ? "text-terracotta" : "text-ink/80"
                        }`}
                        style={{ left }}
                      >
                        {fmt(m)}
                      </span>
                    </div>
                  );
                })}

                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Year"
                  aria-valuemin={1}
                  aria-valuemax={MAX_YEAR}
                  aria-valuenow={year}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") choose(Math.min(year + 1, MAX_YEAR));
                    if (e.key === "ArrowLeft") choose(Math.max(year - 1, 1));
                  }}
                  className="absolute top-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-gold bg-ivory text-gold shadow-[0_0_24px_rgba(182,154,101,0.9)] outline-none"
                  style={{ left: `${pct}%` }}
                >
                  ✦
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label={t("tm.next")}
              onClick={() => step(1)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold text-xl md:h-12 md:w-12"
            >
              ›
            </button>
          </div>

          {/* Manual year input */}
          <div className="mt-8 flex w-fit items-center gap-4 rounded-full border border-gold/60 bg-ivory/50 px-6 py-3 backdrop-blur-sm">
            <span className="font-serif text-ink/80">{t("tm.enter")}</span>
            <span className="h-6 w-px bg-ink/30" />
            <input
              inputMode="numeric"
              aria-label={t("tm.enter")}
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={commitDraft}
              onKeyDown={(e) => e.key === "Enter" && commitDraft()}
              className="w-36 border-b border-ink/40 bg-transparent font-serif text-2xl outline-none focus:border-terracotta"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                const y = commitDraft();
                router.push(`/travel?year=${y}`);
              }}
              className="kc-btn rounded-full border-2 border-gold/70 bg-ink px-12 py-4 text-sm uppercase tracking-widest text-ivory shadow-lg transition hover:bg-midnight"
            >
              {t("tm.continue")}
            </button>
            <button
              type="button"
              onClick={() => choose(randomYear())}
              className="rounded-full border border-gold/70 bg-ivory/40 px-8 py-4 text-sm uppercase tracking-widest backdrop-blur-sm transition hover:bg-gold/20"
            >
              ✦ {lang === "hi" ? "मुझे चौंकाइए" : "Surprise me"}
            </button>
          </div>

          <p className="mt-6 font-serif text-sm text-ink/70">{t("home.sub")}</p>
        </section>

        <footer className="pb-2 text-xs text-ink/60">{t("disclaimer.short")}</footer>
      </div>
    </main>
  );
}