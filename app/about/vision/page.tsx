import type { Metadata } from "next";
import Link from "next/link";
import AboutShell from "../../../components/AboutShell";
import ChakraLogo from "../../../components/ChakraLogo";
import SectionHeading from "../../../components/SectionHeading";
import T from "../../../components/T";
import type { Key } from "../../../lib/dictionary";

export const metadata: Metadata = {
  title: "The Vision · KAALCHAKRA",
  description: "KAALCHAKRA is an interactive journey through imagined futures.",
};

const SECTIONS: { title: Key; body: Key }[] = [
  { title: "vision.s1.title", body: "vision.s1.body" },
  { title: "vision.s2.title", body: "vision.s2.body" },
  { title: "vision.s3.title", body: "vision.s3.body" },
  { title: "vision.s4.title", body: "vision.s4.body" },
  { title: "vision.s5.title", body: "vision.s5.body" },
];

export default function VisionPage() {
  return (
    <AboutShell overlay="bg-ivory/25">
      <Link
        href="/about"
        className="mb-10 w-fit text-xs uppercase tracking-widest text-ink/70 underline-offset-4 hover:underline"
      >
        <T k="about.back" />
      </Link>

      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <ChakraLogo className="mx-auto h-16 w-16 opacity-80" />
          <h1 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">
            <T k="vision.h1a" /> <em className="text-terracotta"><T k="vision.h1b" /></em>
          </h1>
          <p className="mt-8 font-serif text-xl leading-relaxed text-ink/90 md:text-2xl">
            <T k="vision.intro" />
          </p>
        </div>

        <div className="mt-16 space-y-12 rounded-sm bg-ivory/70 p-8 backdrop-blur-sm md:p-12">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <SectionHeading><T k={s.title} /></SectionHeading>
              <p className="leading-relaxed text-ink/85"><T k={s.body} /></p>
            </section>
          ))}

          <section id="disclaimer" className="scroll-mt-8 border-t border-gold/50 pt-10">
            <SectionHeading><T k="vision.fictionTitle" /></SectionHeading>
            <p className="leading-relaxed text-ink/85"><T k="vision.fictionBody" /></p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/time-machine"
            className="inline-block rounded-full border-2 border-gold/70 bg-ink px-10 py-4 text-sm uppercase tracking-widest text-ivory shadow-lg transition hover:bg-midnight"
          >
            <T k="home.cta" />
          </Link>
        </div>
      </div>
    </AboutShell>
  );
}