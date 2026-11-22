import type { Lang } from "./dictionary";

type Era = { name: Record<Lang, string>; teaser: Record<Lang, string> };

const ERAS: Record<string, Era> = {
  alt: {
    name: { en: "Alternate Timeline", hi: "वैकल्पिक समयरेखा" },
    teaser: {
      en: "Not tomorrow, but another telling of the past.",
      hi: "आने वाला कल नहीं, अतीत की एक और कहानी।",
    },
  },
  near: {
    name: { en: "The Near Future", hi: "निकट भविष्य" },
    teaser: {
      en: "The world just beyond today.",
      hi: "आज से बस ज़रा आगे की दुनिया।",
    },
  },
  century: {
    name: { en: "Distant Centuries", hi: "सुदूर सदियाँ" },
    teaser: {
      en: "A world our great-grandchildren would barely recognise.",
      hi: "एक ऐसी दुनिया जिसे हमारे परपोते-परपोतियाँ भी मुश्किल से पहचानेंगे।",
    },
  },
  millennium: {
    name: { en: "A New Millennium", hi: "एक नई सहस्राब्दी" },
    teaser: {
      en: "Whole civilisations rise and fade between these years.",
      hi: "इन वर्षों के बीच पूरी सभ्यताएँ उठती और ढलती हैं।",
    },
  },
  deep: {
    name: { en: "Deep Time", hi: "गहरा काल" },
    teaser: {
      en: "Humanity, if it is still human, scattered among the stars.",
      hi: "अगर मानवता तब भी मानव है, तो तारों के बीच बिखरी हुई।",
    },
  },
  cosmic: {
    name: { en: "The Cosmic Age", hi: "ब्रह्मांडीय युग" },
    teaser: {
      en: "Beyond history as we know it.",
      hi: "इतिहास की हमारी हर समझ से परे।",
    },
  },
};

export function getEra(year: number, lang: Lang) {
  const id =
    year <= 2026 ? "alt"
    : year < 2100 ? "near"
    : year < 3000 ? "century"
    : year < 10000 ? "millennium"
    : year < 1_000_000 ? "deep"
    : "cosmic";
  return { id, name: ERAS[id].name[lang], teaser: ERAS[id].teaser[lang] };
}