"use client";

import { useParams } from "next/navigation";
import ArticleView from "./ArticleView";
import EditionGate from "./EditionGate";
import NewspaperFront from "./NewspaperFront";

export default function NewspaperRoute() {
  const params = useParams<{ year: string; id?: string }>();
  const year = parseInt(params.year, 10);
  const id = params.id;

  if (!year || year < 1 || year > 1_000_000_000) {
    return (
      <main className="grid min-h-screen place-items-center bg-ivory p-6 text-center font-serif text-xl">
        Invalid year.
      </main>
    );
  }

  return (
    <EditionGate year={year}>
      {(edition) => (id ? <ArticleView edition={edition} id={id} /> : <NewspaperFront edition={edition} />)}
    </EditionGate>
  );
}