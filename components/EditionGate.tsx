"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Edition } from "../lib/edition";
import { loadEdition } from "../lib/editionClient";
import { newspaperText } from "../lib/newspaperText";
import ChakraLogo from "./ChakraLogo";
import { useLang } from "./LanguageProvider";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; edition: Edition };

export default function EditionGate({
  year,
  children,
}: {
  year: number;
  children: (edition: Edition) => React.ReactNode;
}) {
  const { lang } = useLang();
  const tx = newspaperText[lang];
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    loadEdition(year)
      .then((edition) => alive && setState({ status: "ready", edition }))
      .catch((err) => {
        console.error(err);
        if (alive) setState({ status: "error" });
      });
    return () => {
      alive = false;
    };
  }, [year, attempt]);

  if (state.status === "ready") return <>{children(state.edition)}</>;

  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        {state.status === "loading" ? (
          <>
            <ChakraLogo className="h-20 w-20" />
            <p className="mt-6 font-serif text-xl italic">{tx.loading}</p>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl">{tx.errorTitle}</p>
            <p className="mt-3 text-sm text-ink/70">{tx.errorBody}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="rounded-full border-2 border-gold/70 bg-ink px-8 py-3 text-xs uppercase tracking-widest text-ivory"
              >
                {tx.retry}
              </button>
              <Link href="/time-machine" className="text-xs uppercase tracking-widest underline underline-offset-4">
                {tx.another}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}