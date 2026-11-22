"use client";

import type { Key } from "../lib/dictionary";
import { useLang } from "./LanguageProvider";

export default function T({ k }: { k: Key }) {
  const { t } = useLang();
  return <>{t(k)}</>;
}