"use client";

import Link from "next/link";
import LanguageSwitch from "./LanguageSwitch";
import T from "./T";
import ThemeToggle from "./ThemeToggle";

export default function PaperControls() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/about" className="text-xs uppercase tracking-widest hover:text-terracotta">
        <T k="nav.about" />
      </Link>
      <span className="h-5 w-px bg-current opacity-30" />
      <LanguageSwitch />
      <span className="h-5 w-px bg-current opacity-30" />
      <ThemeToggle />
    </div>
  );
}