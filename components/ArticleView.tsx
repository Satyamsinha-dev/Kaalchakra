"use client";

import Link from "next/link";
import type { Edition } from "../lib/edition";
import { newspaperText } from "../lib/newspaperText";
import ChakraLogo from "./ChakraLogo";
import FadeIn from "./FadeIn";
import { useLang } from "./LanguageProvider";
import PaperControls from "./PaperControls";
import SiteFooter from "./SiteFooter";
import StoryArt from "./StoryArt";

const fmt = (n: number) => (n < 10000 ? String(n) : n.toLocaleString("en-US"));

export default function ArticleView({ edition, id }: { edition: Edition; id: string }) {
  const { lang } = useLang();
  const tx = newspaperText[lang];
  const base = `/newspaper/${edition.year}`;

  const all = [edition.lead, ...edition.stories];
  const index = all.findIndex((s) => s.id === id);

  if (index === -1) {
    return (
      <main className="grid min-h-screen place-items-center bg-ivory px-6 text-center">
        <div>
          <p className="font-serif text-2xl">{tx.notFound}</p>
          <Link href={base} className="mt-4 inline-block text-xs uppercase tracking-widest underline underline-offset-4">
            {tx.back}
          </Link>
        </div>
      </main>
    );
  }

  const story = all[index];
  const prev = all[index - 1];
  const next = all[index + 1];
  const related = all
    .filter((s) => s.id !== id)
    .sort((a, b) => Number(b.section === story.section) - Number(a.section === story.section))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-ivory">
      <FadeIn className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/30 pb-3">
          <Link href="/" className="flex items-center gap-3">
            <ChakraLogo className="h-10 w-10" />
            <span className="font-serif text-xl tracking-wide">KAALCHAKRA</span>
          </Link>
          <p className="hidden text-sm md:block">
            {tx.edition} {fmt(edition.year)} <span className="mx-2 text-ink/30">|</span> {edition.dateLabel}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <PaperControls />
            <Link
              href={base}
              className="rounded-full border-2 border-gold/70 bg-ink px-5 py-2 text-xs uppercase tracking-widest text-ivory"
            >
              {tx.back}
            </Link>
          </div>
        </header>

        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[15rem_minmax(0,1fr)_16rem]">
          <article className="order-1 lg:order-2">
            <span className="inline-flex rounded-full border border-gold/70 px-4 py-1 text-xs uppercase tracking-widest">
              {tx.sections[story.section]}
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.05] md:text-6xl">{story.headline}</h1>
            <p className="mt-4 font-serif text-xl italic leading-snug text-ink/80 md:text-2xl">{story.subtitle}</p>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70">
              <span>{story.byline}</span>
              <span className="text-ink/30">|</span>
              <span>{edition.dateLabel}</span>
              <span className="text-ink/30">|</span>
              <span>
                {story.readingMinutes} {tx.minRead}
              </span>
            </p>

            <StoryArt section={story.section} className="mt-6 aspect-[16/8] w-full" />

            <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed">
              {story.body.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-terracotta"
                      : ""
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </article>

          <aside className="order-2 lg:order-3">
            <h2 className="flex items-center gap-2 border-b border-ink/30 pb-2 font-serif text-2xl font-bold">
              <span className="text-gold">✦</span> {tx.highlights}
            </h2>
            <ul className="mt-3 space-y-3">
              {story.highlights.map((h) => (
                <li key={h} className="flex gap-2 border-b border-ink/15 pb-3 text-sm">
                  <span className="text-gold">✦</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-gold/15 p-4">
              <h3 className="font-serif text-xl font-bold">{tx.means}</h3>
              <p className="mt-2 text-sm leading-relaxed">{story.whatThisMeans}</p>
            </div>
          </aside>

          <aside className="order-3 lg:order-1">
            <h2 className="flex items-center gap-2 border-b border-ink/30 pb-2 font-serif text-2xl font-bold">
              <span className="text-gold">✦</span> {tx.related}
            </h2>
            <div className="divide-y divide-ink/20">
              {related.map((s) => (
                <Link key={s.id} href={`${base}/${s.id}`} className="flex gap-3 py-3 hover:text-terracotta">
                  <StoryArt section={s.section} className="h-16 w-16 shrink-0" />
                  <div>
                    <p className="font-serif text-base font-semibold leading-tight">{s.headline}</p>
                    <p className="mt-1 text-xs italic text-terracotta">{tx.readMore}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <nav className="flex items-center justify-between gap-4 border-t border-ink/30 py-4 text-sm">
          {prev ? (
            <Link href={`${base}/${prev.id}`} className="hover:text-terracotta">
              ← {tx.prev}
            </Link>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-2 text-ink/70">
            {index + 1} / {all.length}
            <span className="ml-2 flex gap-1.5">
              {all.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-2 w-2 rounded-full ${i === index ? "bg-terracotta" : "border border-gold/70"}`}
                />
              ))}
            </span>
          </span>
          {next ? (
            <Link href={`${base}/${next.id}`} className="hover:text-terracotta">
              {tx.next} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="pb-2 text-center text-xs text-ink/60">{tx.fiction}</p>
        <SiteFooter />
      </FadeIn>
    </main>
  );
}