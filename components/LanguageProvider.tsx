"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dictionary, type Key, type Lang } from "../lib/dictionary";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string };

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => dictionary.en[k],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Page khulne ke baad saved language padho
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kc-lang");
      if (saved === "en" || saved === "hi") setLangState(saved);
    } catch {}
  }, []);

  // <html lang="..."> badlo, taaki CSS Hindi fonts laga sake
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("kc-lang", l);
    } catch {}
  }, []);

  const t = useCallback((k: Key) => dictionary[lang][k], [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);