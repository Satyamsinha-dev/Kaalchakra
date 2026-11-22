"use client";

import { useCallback, useEffect, useState } from "react";

const RINGS = [
  { r: 90, w: 1.2, d: "0.1s" },
  { r: 76, w: 1, d: "0.3s" },
  { r: 56, w: 1.4, d: "0.5s" },
  { r: 34, w: 1, d: "0.7s" },
];

export default function IntroPortal() {
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    setDone(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "1") {
      setDone(true);
      return;
    }
    const t1 = setTimeout(finish, 3400);
    const t2 = setTimeout(() => {
      delete root.dataset.intro;
    }, 7000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [finish]);

  if (done) return null;

  return (
    <div className="kc-intro fixed inset-0 z-[100] items-center justify-center overflow-hidden bg-ivory">
      <div className="kc-intro-zoom relative grid place-items-center">
        <div className="kc-intro-glow absolute h-[20vmin] w-[20vmin] rounded-full" />
        <svg
          viewBox="-100 -100 200 200"
          className="relative h-[min(68vmin,420px)] w-[min(68vmin,420px)] text-gold"
          fill="none"
          stroke="currentColor"
        >
          <g className="kc-intro-spin">
            {RINGS.map((ring) => (
              <circle
                key={ring.r}
                r={ring.r}
                strokeWidth={ring.w}
                className="kc-intro-ring"
                style={{ animationDelay: ring.d }}
              />
            ))}
            <g strokeWidth="0.9" className="kc-intro-ring" style={{ animationDelay: "0.9s" }}>
              {Array.from({ length: 8 }, (_, i) => (
                <line key={i} x1="0" y1="-34" x2="0" y2="-90" transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <path
              d="M0 -30 L6 -6 L30 0 L6 6 L0 30 L-6 6 L-30 0 L-6 -6 Z"
              fill="currentColor"
              fillOpacity="0.4"
              strokeWidth="1"
              className="kc-intro-ring"
              style={{ animationDelay: "1.1s" }}
            />
            <circle r="3.5" fill="currentColor" className="kc-intro-ring" style={{ animationDelay: "1.2s" }} />
          </g>
        </svg>
        <p className="kc-intro-text absolute -bottom-2 font-serif text-2xl tracking-[0.4em] text-ink md:text-3xl">
          KAALCHAKRA
        </p>
      </div>
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 text-xs uppercase tracking-widest text-ink/60 hover:text-ink"
      >
        Skip
      </button>
    </div>
  );
}