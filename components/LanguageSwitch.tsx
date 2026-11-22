"use client";

import { useEffect, useRef, useState } from "react";
import { LANGS } from "../lib/dictionary";
import { useLang } from "./LanguageProvider";

export default function LanguageSwitch() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="whitespace-nowrap"
      >
        {current.short} ▾
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-50 mt-3 min-w-36 rounded-sm border border-gold/60 bg-ivory p-1 text-ink shadow-lg">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gold/15 ${
                  l.code === lang ? "text-terracotta" : ""
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}