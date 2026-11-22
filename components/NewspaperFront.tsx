"use client";

import Link from "next/link";
import { SECTIONS, type Edition, type Story } from "../lib/edition";
import { newspaperText } from "../lib/newspaperText";
import ChakraLogo from "./ChakraLogo";
import FadeIn from "./FadeIn";
import { useLang } from "./LanguageProvider";
import PaperControls from "./PaperControls";
import SiteFooter from "./SiteFooter";
import StoryArt from "./StoryArt";

const fmt = (n: number) => (n < 10000 ? String(n) : n.toLocaleString("en-US"));

export default function NewspaperFront({ edition }: { edition: Edition }) {
  const { lang } = useLang();
  const tx = newspaperText[lang];
  const { year, lead, stories, briefs } = edition;

  const all = [lead, ...stories];
  const anchors: Record<string, string> = {};
  SECTIONS.forEach((s, i) => {
    const first = all.find((x) => x.section === s);
    if (first) anchors[first.id] = `sec-${i}`;
  });

  const href = (s: Story) => `/newspaper/${year}/${s.id}`;
  const side = stories.slice(0, 2);
  const bottom = stories.slice(2, 5);

  return (
    <main className="min-h-screen bg-ivory">
      <FadeIn className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-8">
        <header className="grid items-center gap-4 border-b border-ink/30 pb-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/" aria-label="Home">
              <ChakraLogo className="h-14 w-14" />
            </Link>
            <p className="max-w-[13rem] font-serif text-sm italic text-ink/70">{tx.tagline}</p>
          </div>
          <div className="text-center">
            <h1 className="font-serif text-[clamp(2.6rem,8vw,6rem)] font-bold leading-none tracking-wide">
              KAALCHAKRA
            </h1>
            <p className="font-hindi text-2xl font-bold">कालचक्र</p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <p className="font-hindi text-sm text-ink/80">समय से परे, एक बेहतर कल की ओर</p>
            <PaperControls />
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/30 py-2 text-sm">
          <p>
            <span className="font-semibold">
              {tx.edition} {fmt(year)}
            </span>
            <span className="mx-2 text-ink/30">|</span>
            {edition.dateLabel}
          </p>
          <p className="hidden font-serif italic text-ink/70 sm:block">{tx.motto}</p>
          <Link href="/time-machine" className="text-xs uppercase tracking-widest text-terracotta hover:underline">
            {tx.newYear}
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-b-2 border-ink/50 py-3 font-serif text-sm md:text-base">
          {SECTIONS.map((s, i) => (
            <span key={s} className="flex items-center gap-5">
              {i > 0 && <span className="text-gold">✦</span>}
              <a href={`#sec-${i}`} className="hover:text-terracotta">
                {tx.sections[s]}
              </a>
            </span>
          ))}
        </nav>

        {lang === "hi" && (
          <p className="mt-3 rounded-sm border border-gold/50 bg-gold/10 px-4 py-2 text-center text-sm">
            {tx.hindiNote}
          </p>
        )}

        <div className="grid gap-6 border-b border-ink/30 py-6 lg:grid-cols-12">
          <article id={anchors[lead.id]} className="scroll-mt-6 lg:col-span-4 lg:border-r lg:border-ink/20 lg:pr-6">
            <p className="text-xs uppercase tracking-[0.25em] text-terracotta">{tx.sections[lead.section]}</p>
            <h2 className="mt-2 font-serif text-4xl font-bold leading-[1.05] md:text-5xl">
              <Link href={href(lead)} className="hover:text-terracotta">
                {lead.headline}
              </Link>
            </h2>
            <p className="mt-3 font-serif text-xl italic leading-snug">{lead.subtitle}</p>
            <span className="my-4 block h-px w-16 bg-gold" />
            <p className="text-sm leading-relaxed text-ink/85">{lead.summary}</p>
            <Link href={href(lead)} className="mt-4 inline-block text-sm font-semibold hover:text-terracotta">
              {tx.readFull}
            </Link>
          </article>

          <Link href={href(lead)} className="lg:col-span-5">
            <StoryArt section={lead.section} className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-80" />
          </Link>

          <aside className="lg:col-span-3">
            <h3 className="border-b border-ink/30 pb-2 font-serif text-2xl font-bold">{tx.alsoIn}</h3>
            <div className="divide-y divide-ink/20">
              {side.map((s) => (
                <article key={s.id} id={anchors[s.id]} className="scroll-mt-6 flex gap-3 py-3">
                  <Link href={href(s)} className="shrink-0">
                    <StoryArt section={s.section} className="h-20 w-20" />
                  </Link>
                  <div>
                    <h4 className="font-serif text-lg font-semibold leading-tight">
                      <Link href={href(s)} className="hover:text-terracotta">
                        {s.headline}
                      </Link>
                    </h4>
                    <Link href={href(s)} className="mt-1 inline-block text-xs italic text-terracotta">
                      {tx.readMore}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-2 bg-gold/15 p-4">
              <h3 className="font-serif text-xl font-bold">{tx.briefs}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {briefs.map((b) => (
                  <li key={b.headline} className="flex gap-2">
                    <span className="text-gold">✦</span>
                    <span>
                      <span className="font-semibold">{b.headline}.</span> {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="grid gap-6 py-6 md:grid-cols-3 md:divide-x md:divide-ink/20">
          {bottom.map((s) => (
            <article key={s.id} id={anchors[s.id]} className="scroll-mt-6 md:px-5 md:first:pl-0 md:last:pr-0">
              <p className="text-xs uppercase tracking-[0.25em] text-terracotta">{tx.sections[s.section]}</p>
              <h3 className="mt-1 font-serif text-2xl font-bold leading-tight">
                <Link href={href(s)} className="hover:text-terracotta">
                  {s.headline}
                </Link>
              </h3>
              <Link href={href(s)} className="mt-3 block">
                <StoryArt section={s.section} className="aspect-[16/9] w-full" />
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-ink/85">{s.summary}</p>
              <Link href={href(s)} className="mt-2 inline-block text-xs italic text-terracotta">
                {tx.readMore}
              </Link>
            </article>
          ))}
        </div>

        <div className="border-t border-ink/30 py-6 text-center">
          <p className="font-serif text-xl italic text-ink/80">&ldquo;{tx.quote}&rdquo;</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-ink/60">— KAALCHAKRA</p>
          <p className="mt-4 text-xs text-ink/60">{tx.fiction}</p>
        </div>

        <SiteFooter />
      </FadeIn>
    </main>
  );
}