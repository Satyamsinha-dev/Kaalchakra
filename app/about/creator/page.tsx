import type { Metadata } from "next";
import Link from "next/link";
import AboutShell from "../../../components/AboutShell";
import ChakraLogo from "../../../components/ChakraLogo";
import T from "../../../components/T";

export const metadata: Metadata = {
  title: "The Creator · KAALCHAKRA",
  description: "Satyam Sinha, the creator of KAALCHAKRA.",
};

export default function CreatorPage() {
  return (
    <AboutShell overlay="bg-ivory/60">
      <Link
        href="/about"
        className="mb-10 w-fit text-xs uppercase tracking-widest text-ink/70 underline-offset-4 hover:underline"
      >
        <T k="about.back" />
      </Link>

      <div className="mx-auto w-full max-w-2xl text-center">
        <ChakraLogo className="mx-auto h-14 w-14 opacity-80" />

        <h1 className="mt-8 font-serif text-5xl leading-tight md:text-7xl"><T k="creator.name" /></h1>
        <p className="mt-4 font-serif text-lg italic text-terracotta md:text-xl"><T k="creator.sub" /></p>
        <span className="mx-auto my-10 block h-px w-24 bg-gold" />

        <div className="space-y-6 font-serif text-lg leading-relaxed text-ink/90 md:text-xl">
          <p><T k="creator.p1" /></p>
          <p><T k="creator.p2" /></p>
          <p><T k="creator.p3" /></p>
          <p><T k="creator.p4" /></p>
          <p className="italic"><T k="creator.p5" /></p>
        </div>

        <Link
          href="/about/vision"
          className="mt-12 inline-block text-xs uppercase tracking-widest text-terracotta underline-offset-4 hover:underline"
        >
          <T k="creator.next" />
        </Link>
      </div>
    </AboutShell>
  );
}