import type { Metadata } from "next";
import Link from "next/link";
import AboutShell from "../../components/AboutShell";
import Rule from "../../components/Rule";
import T from "../../components/T";
import type { Key } from "../../lib/dictionary";

export const metadata: Metadata = {
  title: "About · KAALCHAKRA",
  description: "The creator and the vision behind KAALCHAKRA.",
};

const CARDS: { n: string; href: string; title: Key; line: Key }[] = [
  { n: "01", href: "/about/creator", title: "about.creatorTitle", line: "about.creatorLine" },
  { n: "02", href: "/about/vision", title: "about.visionTitle", line: "about.visionLine" },
];

export default function AboutPage() {
  return (
    <AboutShell overlay="bg-ivory/35">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mx-auto flex w-full max-w-xl items-center gap-4 text-xs uppercase tracking-[0.35em] text-ink/70">
          <Rule />
          <span><T k="about.label" /></span>
          <Rule />
        </div>
        <h1 className="mt-6 text-center font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-tight">
          <T k="about.h1a" /> <em className="text-terracotta"><T k="about.h1b" /></em>
        </h1>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-sm border border-gold/60 bg-ivory/60 p-8 backdrop-blur-sm transition hover:border-gold hover:bg-ivory/80 md:p-10"
            >
              <p className="text-xs tracking-[0.3em] text-gold">{c.n}</p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl"><T k={c.title} /></h2>
              <p className="mt-3 text-ink/75"><T k={c.line} /></p>
              <p className="mt-8 text-xs uppercase tracking-widest text-terracotta">
                <T k="about.read" /> <span className="inline-block transition group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AboutShell>
  );
}