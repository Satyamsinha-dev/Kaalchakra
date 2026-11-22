"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";

type Orb = { id: number; x: number; y: number; speed: number; kind: "shard" | "void" };
type Pop = { id: number; x: number; y: number; label: string; good: boolean };

const ROUND_SECONDS = 30;
const BEST_KEY = "kc-best-score";

const copy = {
  en: {
    title: "While your newspaper is being written",
    sub: "Catch the golden Time Shards. Avoid the dark voids.",
    play: "Play",
    again: "Play again",
    score: "Score",
    best: "Best",
    time: "Time",
    combo: "Combo",
    over: "Time's up!",
    final: "You scored",
    note: "Your edition keeps loading in the background.",
  },
  hi: {
    title: "आपका अखबार लिखे जाने तक",
    sub: "सुनहरे टाइम शार्ड्स पकड़िए। काले शून्य से बचिए।",
    play: "खेलिए",
    again: "फिर खेलिए",
    score: "स्कोर",
    best: "सर्वश्रेष्ठ",
    time: "समय",
    combo: "कॉम्बो",
    over: "समय पूरा!",
    final: "आपका स्कोर",
    note: "आपका संस्करण पीछे लोड होता रहेगा।",
  },
};

export default function WaitingGame({ onStart }: { onStart: () => void }) {
  const { lang } = useLang();
  const c = copy[lang];

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [best, setBest] = useState(0);
  const [shake, setShake] = useState(0);

  const orbsRef = useRef<Orb[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const bestRef = useRef(0);
  const idRef = useRef(1);

  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem(BEST_KEY) ?? "0", 10) || 0;
      bestRef.current = saved;
      setBest(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    let last = performance.now();
    const endAt = last + ROUND_SECONDS * 1000;
    let acc = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const left = Math.max(0, (endAt - now) / 1000);
      const elapsed = ROUND_SECONDS - left;

      acc += dt;
      const interval = Math.max(0.35, 0.8 - elapsed * 0.015);
      while (acc >= interval) {
        acc -= interval;
        orbsRef.current.push({
          id: idRef.current++,
          x: 10 + Math.random() * 80,
          y: -10,
          speed: 30 + Math.random() * 20 + elapsed * 0.8,
          kind: Math.random() < 0.22 ? "void" : "shard",
        });
      }

      const kept: Orb[] = [];
      for (const o of orbsRef.current) {
        const y = o.y + o.speed * dt;
        if (y > 110) {
          if (o.kind === "shard") comboRef.current = 0;
          continue;
        }
        kept.push({ ...o, y });
      }
      orbsRef.current = kept;
      setOrbs(kept);
      setCombo(comboRef.current);
      setTimeLeft(Math.ceil(left));

      if (left <= 0) {
        orbsRef.current = [];
        setOrbs([]);
        if (scoreRef.current > bestRef.current) {
          bestRef.current = scoreRef.current;
          setBest(scoreRef.current);
          try {
            localStorage.setItem(BEST_KEY, String(scoreRef.current));
          } catch {}
        }
        setPhase("over");
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  function start() {
    orbsRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setOrbs([]);
    setPops([]);
    setTimeLeft(ROUND_SECONDS);
    setPhase("playing");
    onStart();
  }

  function hit(o: Orb) {
    orbsRef.current = orbsRef.current.filter((x) => x.id !== o.id);
    setOrbs(orbsRef.current);

    let label: string;
    let good: boolean;
    if (o.kind === "shard") {
      comboRef.current += 1;
      const gain = 10 * (1 + Math.floor(comboRef.current / 5));
      scoreRef.current += gain;
      label = `+${gain}`;
      good = true;
    } else {
      comboRef.current = 0;
      scoreRef.current = Math.max(0, scoreRef.current - 15);
      label = "-15";
      good = false;
      setShake((n) => n + 1);
    }
    setScore(scoreRef.current);
    setCombo(comboRef.current);

    const pid = idRef.current++;
    setPops((p) => [...p, { id: pid, x: o.x, y: o.y, label, good }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== pid)), 600);
  }

  return (
    <div className="kc-rise w-full max-w-md rounded-2xl border border-gold/60 bg-ivory/80 p-4 text-left backdrop-blur-sm">
      <style>{`
        @keyframes kc-pop { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -170%) scale(1.3); } }
        @keyframes kc-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
      `}</style>

      <p className="text-center font-serif text-lg">{c.title}</p>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] uppercase tracking-widest text-ink/70">
        <div>
          {c.score}
          <p className="font-serif text-xl normal-case tracking-normal text-ink">{score}</p>
        </div>
        <div>
          {c.combo}
          <p className="font-serif text-xl normal-case tracking-normal text-ink">x{combo}</p>
        </div>
        <div>
          {c.time}
          <p className="font-serif text-xl normal-case tracking-normal text-ink">{timeLeft}</p>
        </div>
        <div>
          {c.best}
          <p className="font-serif text-xl normal-case tracking-normal text-ink">{best}</p>
        </div>
      </div>

      <div
        key={shake}
        className="relative mt-3 h-64 touch-none select-none overflow-hidden rounded-xl border border-gold/40"
        style={{
          background: "linear-gradient(180deg, rgba(182,154,101,0.22), rgba(182,154,101,0.05))",
          animation: shake ? "kc-shake 0.25s" : undefined,
        }}
      >
        {orbs.map((o) => (
          <div
            key={o.id}
            onPointerDown={(e) => {
              e.preventDefault();
              hit(o);
            }}
            className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full"
            style={{
              left: `${o.x}%`,
              top: `${o.y}%`,
              background:
                o.kind === "shard"
                  ? "radial-gradient(circle, #fff6dc 0%, #E8CF94 45%, #B69A65 100%)"
                  : "radial-gradient(circle, #3a3a3a 0%, #111 70%)",
              boxShadow: o.kind === "shard" ? "0 0 18px rgba(232,207,148,0.9)" : "0 0 14px rgba(0,0,0,0.6)",
            }}
          >
            <span className={o.kind === "shard" ? "text-[#7a5a1e]" : "text-white/60"}>
              {o.kind === "shard" ? "✦" : "●"}
            </span>
          </div>
        ))}

        {pops.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none absolute font-serif text-lg font-bold"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              color: p.good ? "#7a5a1e" : "#A34C36",
              animation: "kc-pop 0.6s ease-out forwards",
            }}
          >
            {p.label}
          </span>
        ))}

        {phase !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-ivory/70 p-4 text-center">
            <div>
              {phase === "over" ? (
                <>
                  <p className="font-serif text-2xl">{c.over}</p>
                  <p className="mt-1 text-sm">
                    {c.final} {score}
                  </p>
                </>
              ) : (
                <p className="text-sm">{c.sub}</p>
              )}
              <button
                type="button"
                onClick={start}
                className="mt-4 rounded-full border-2 border-gold/70 bg-ink px-8 py-3 text-xs uppercase tracking-widest text-ivory"
              >
                {phase === "over" ? c.again : c.play}
              </button>
              <p className="mt-3 text-xs text-ink/60">{c.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}