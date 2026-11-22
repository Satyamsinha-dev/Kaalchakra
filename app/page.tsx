
import Link from "next/link";
import GoldDust from "../components/GoldDust";
import HeroBackground from "../components/HeroBackground";
import Rule from "../components/Rule";
import SiteHeader from "../components/SiteHeader";
import T from "../components/T";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-ivory">
      <HeroBackground src="/hero-bg.jpg" />

      <div className="absolute inset-0 bg-linear-to-b from-ivory/0 via-ivory/10 to-ivory/90 md:hidden" />

      <div className="absolute inset-0 hidden bg-linear-to-r from-ivory/80 from-0% via-ivory/35 via-40% to-transparent to-60% md:block" />

      <GoldDust />

      <div className="relative z-10 flex min-h-dvh flex-col px-6 py-6 md:px-14">
        <SiteHeader controlsClassName="text-white" />

        <section className="flex flex-1 items-end pb-6 pt-[42vh] md:items-center md:pb-0 md:pt-0">
          <div className="flex w-full flex-col items-center text-center md:w-[48%]">
            <div
              className="kc-rise mb-6 flex w-full max-w-[560px] items-center gap-4 text-xs uppercase tracking-[0.3em] text-terracotta md:mb-8"
              style={d("0.1s")}
            >
              <Rule />

              <span className="whitespace-nowrap">
                <span className="font-hindi tracking-normal">
                  कालचक्र
                </span>{" "}
                · <T k="brand.tagline" />
              </span>

              <Rule />
            </div>

            <h1 className="font-serif text-[clamp(2.3rem,4.6vw,5rem)] leading-[1.05]">
              <span
                className="kc-rise hi-wrap block md:whitespace-nowrap"
                style={d("0.3s")}
              >
                <T k="home.h1a" />
              </span>

              <em
                className="kc-rise block text-[1.1em] text-terracotta"
                style={d("0.6s")}
              >
                <T k="home.h1b" />
              </em>
            </h1>

            <p
              className="kc-rise mt-4 font-serif text-lg text-ink/80 md:mt-6 md:text-xl"
              style={d("0.9s")}
            >
              <T k="home.sub" />
            </p>

            <div className="kc-rise" style={d("1.2s")}>
              <Link
                href="/time-machine"
                className="kc-btn mt-8 inline-block rounded-full border-2 border-gold/70 bg-ink px-8 py-4 text-sm uppercase tracking-widest text-ivory shadow-lg transition hover:bg-midnight md:mt-10 md:px-10"
              >
                <T k="home.cta" />
              </Link>
            </div>

            <div
              className="kc-rise flex w-full flex-col items-center"
              style={d("1.5s")}
            >
              <div className="mt-6 flex w-full max-w-[420px] items-center gap-3 text-gold md:mt-8">
                <Rule />
                <span>✦</span>
                <Rule />
              </div>

              <p className="mt-3 font-serif text-[11px] uppercase tracking-[0.18em] text-ink/70">
                <T k="home.hint" />
              </p>
            </div>
          </div>
        </section>

        <footer className="pb-2 text-xs text-ink/60">
          <T k="disclaimer.short" />
        </footer>
      </div>
    </main>
  );
}
