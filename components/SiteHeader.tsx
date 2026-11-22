import Link from "next/link";
import ChakraLogo from "./ChakraLogo";
import LanguageSwitch from "./LanguageSwitch";
import T from "./T";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader({ controlsClassName = "text-ink" }: { controlsClassName?: string }) {
  return (
    <header className="flex items-center gap-5">
      <Link href="/" className="flex items-center gap-5">
        <ChakraLogo />
        <span className="hidden h-10 w-px bg-ink/30 sm:block" />
        <div>
          <p className="font-serif text-2xl leading-none tracking-wide">KAALCHAKRA</p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-ink/70">
            <span className="font-hindi tracking-normal">कालचक्र</span> · <T k="brand.tagline" />
          </p>
        </div>
      </Link>
      <span className="hidden h-px flex-1 bg-gold/50 md:block" />
      <div className={`ml-auto flex items-center gap-5 text-sm md:ml-0 ${controlsClassName}`}>
        <Link href="/about" className="text-xs uppercase tracking-widest hover:text-terracotta">
          <T k="nav.about" />
        </Link>
        <span className="h-6 w-px bg-current opacity-30" />
        <LanguageSwitch />
        <span className="h-6 w-px bg-current opacity-30" />
        <ThemeToggle />
      </div>
    </header>
  );
}