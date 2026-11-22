"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadEdition } from "../lib/editionClient";
import { newspaperText } from "../lib/newspaperText";
import { useLang } from "./LanguageProvider";
import SiteHeader from "./SiteHeader";
import WaitingGame from "./WaitingGame";

const DURATION = 9;
const MAX_YEAR = 1_000_000_000;
const fmt = (n: number) => (n < 10000 ? String(n) : n.toLocaleString("en-US"));

const readyText = {
  en: { title: "Your edition is ready!", open: "Open the edition →" },
  hi: { title: "आपका संस्करण तैयार है!", open: "संस्करण खोलें →" },
};

const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  angle: rnd(i, 1) * Math.PI * 2,
  radius: 200 + rnd(i, 2) * 90,
  size: 1.2 + rnd(i, 3) * 2.8,
  spin: 0.4 + rnd(i, 4) * 1.2,
}));

export default function TravelScene() {
  const params = useSearchParams();
  const router = useRouter();
  const { t: tr, lang } = useLang();
  const tx = newspaperText[lang];
  const rt = readyText[lang];

  const raw = parseInt(params.get("year") ?? "", 10);
  const year = raw >= 1 && raw <= MAX_YEAR ? raw : 3000;

  const startRef = useRef(0);
  const [e, setE] = useState(0);
  const [readyAt, setReadyAt] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    startRef.current = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setE((now - startRef.current) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let alive = true;
    setReadyAt(null);
    setError(false);
    loadEdition(year)
      .then(() => {
        if (alive) setReadyAt((performance.now() - startRef.current) / 1000);
      })
      .catch((err) => {
        console.error(err);
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [year, attempt]);

  const ready = readyAt !== null;
  const t = Math.min(1, e / DURATION);
  const waiting = t >= 1 && !ready && !error;
  const rot = (t * t * 4 + t * 0.15) * 360 + Math.max(0, e - DURATION) * 120;
  const gather = Math.min(1, t * 1.15);
  const glow = 20 + t * 150;
  const portalStart = Math.max(DURATION * 0.82, readyAt ?? Infinity);
  const portal = ready ? Math.min(1, Math.max(0, (e - portalStart) / 1.6)) : 0;
  const open = portal >= 1;
  const pct = ready ? 100 : Math.min(t, 0.9) * 100;

  useEffect(() => {
    if (!open || engaged) return;
    const id = setTimeout(() => router.replace(`/newspaper/${year}`), 400);
    return () => clearTimeout(id);
  }, [open, engaged, router, year]);

  let status = tx.travel.imagining;
  if (ready) status = tx.travel.opening;
  else if (waiting && e > 45) status = tx.travel.slow;
  else if (t > 0.5) status = tx.travel.writing;

  const rings = useMemo(
    () => [
      { r: 170, dash: "2 10", w: 1.2, speed: 1, dir: 1 },
      { r: 140, dash: "40 8 4 8", w: 1.5, speed: 1.6, dir: -1 },
      { r: 110, dash: "none", w: 1, speed: 2.2, dir: 1 },
      { r: 80, dash: "6 6", w: 1.4, speed: 3, dir: -1 },
    ],
    []
  );

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ivory">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/timeline-bg.jpg')",
          transform: `scale(${(1 + t * 0.1).toFixed(3)})`,
        }}
      />
      <div className="absolute inset-0 bg-ivory/30" />

      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="-300 -300 600 600" className="h-[min(92vh,100vw)] w-[min(92vh,100vw)]">
          <defs>
            <radialGradient id="core">
              <stop offset="0%" stopColor="#fff8e1" stopOpacity="1" />
              <stop offset="45%" stopColor="#B69A65" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#B69A65" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle r={glow} fill="url(#core)" />

          <g
            transform={`rotate(${(-rot * 0.3).toFixed(2)})`}
            stroke="#E8CF94"
            strokeWidth="0.8"
            opacity={(0.1 + t * 0.5).toFixed(2)}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1="-190"
                x2="0"
                y2={-(230 + (i % 2) * 55)}
                transform={`rotate(${i * 15})`}
              />
            ))}
          </g>

          {rings.map((ring, i) => (
            <circle
              key={i}
              r={ring.r}
              fill="none"
              stroke="#B69A65"
              strokeWidth={ring.w}
              strokeDasharray={ring.dash === "none" ? undefined : ring.dash}
              opacity={0.55 + t * 0.4}
              transform={`rotate(${(rot * ring.speed * ring.dir).toFixed(2)})`}
            />
          ))}

          <g transform={`rotate(${rot.toFixed(2)})`} stroke="#B69A65" strokeWidth="1.2" opacity="0.8">
            {Array.from({ length: 8 }, (_, i) => (
              <line key={i} x1="0" y1="-30" x2="0" y2="-170" transform={`rotate(${i * 45})`} />
            ))}
            <circle r="26" fill="none" />
          </g>

          {PARTICLES.map((p, i) => {
            const r = p.radius * (1 - gather * 0.92) + 6;
            const a = p.angle + t * p.spin * 4;
            const fade = Math.min(1, t * 4) * (t > 0.9 ? Math.max(0, 1 - (t - 0.9) * 10) : 1);
            return (
              <circle
                key={i}
                cx={(Math.cos(a) * r).toFixed(2)}
                cy={(Math.sin(a) * r).toFixed(2)}
                r={p.size}
                fill="#B69A65"
                opacity={fade.toFixed(2)}
              />
            );
          })}

          {portal > 0 &&
            [0, 0.2, 0.4].map((delay) => {
              const p = Math.max(0, portal - delay) / (1 - delay);
              return (
                <circle
                  key={delay}
                  r={40 + p * 520}
                  fill="none"
                  stroke="#E8CF94"
                  strokeWidth={Math.max(0.3, 3 - p * 2.7)}
                  opacity={((1 - p) * 0.85).toFixed(2)}
                />
              );
            })}
        </svg>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: portal,
          background: "radial-gradient(circle, #fff8e1 0%, #f6e7c1 45%, #F6F1E7 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-dvh flex-col px-4 py-6 sm:px-6 md:px-14">
        <SiteHeader />

        <section className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <p className="font-serif text-lg text-ink/80 sm:text-xl md:text-2xl">{tr("travel.traveling")}</p>
          <h1 className="mt-2 font-serif text-[clamp(2.6rem,12vw,6.5rem)] leading-none">
            {fmt(year)} <span className="text-[0.4em]">{tr("year.suffix")}</span>
          </h1>

          {error ? (
            <div className="mt-10 max-w-md rounded-2xl border border-gold/60 bg-ivory/85 p-6 backdrop-blur-sm">
              <p className="font-serif text-lg">{tx.travel.failed}</p>
              <p className="mt-2 text-sm text-ink/70">{tx.errorBody}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    startRef.current = performance.now();
                    setAttempt((n) => n + 1);
                  }}
                  className="rounded-full border-2 border-gold/70 bg-ink px-8 py-3 text-xs uppercase tracking-widest text-ivory"
                >
                  {tx.retry}
                </button>
                <Link href="/time-machine" className="text-xs uppercase tracking-widest underline underline-offset-4">
                  {tx.another}
                </Link>
              </div>
            </div>
          ) : ready && engaged ? (
            <div className="mt-10 max-w-md rounded-2xl border border-gold/60 bg-ivory/90 p-6 backdrop-blur-sm">
              <p className="font-serif text-2xl">{rt.title}</p>
              <button
                type="button"
                onClick={() => router.replace(`/newspaper/${year}`)}
                className="kc-btn mt-5 rounded-full border-2 border-gold/70 bg-ink px-8 py-3 text-xs uppercase tracking-widest text-ivory"
              >
                {rt.open}
              </button>
            </div>
          ) : (
            <>
              <p className="mt-10 font-serif text-lg italic sm:text-xl">{status}</p>
              <p className="mt-1 text-sm text-ink/70">{tr("travel.wait")}</p>
              <div className="mt-5 h-3 w-full max-w-md overflow-hidden rounded-full border border-gold/70 bg-ivory/60">
                <div className="h-full bg-gold" style={{ width: `${pct.toFixed(1)}%` }} />
              </div>

              {!ready && e > 4 && (
                <div className="mt-8 flex w-full justify-center">
                  <WaitingGame onStart={() => setEngaged(true)} />
                </div>
              )}

              <Link href="/time-machine" className="mt-8 text-xs uppercase tracking-widest text-ink/60 underline">
                {tr("travel.another")}
              </Link>
            </>
          )}
        </section>

        <footer className="pb-2 text-xs text-ink/60">{tr("disclaimer.short")}</footer>
      </div>
    </main>
  );
}