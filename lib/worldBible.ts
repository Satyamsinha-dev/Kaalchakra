export type WorldBible = {
  eraName: string;
  overview: string;
  history: { year: number; event: string }[];
  geopolitics: string;
  technology: string;
  environment: string;
  economy: string;
  societyAndCulture: string;
  spaceExploration: string;
  indiaSnapshot: string;
  recurringNames: string[];
};

const TEXT_KEYS = [
  "eraName",
  "overview",
  "geopolitics",
  "technology",
  "environment",
  "economy",
  "societyAndCulture",
  "spaceExploration",
  "indiaSnapshot",
] as const;

export function isWorldBible(x: unknown): x is WorldBible {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;

  const texts = TEXT_KEYS.every((k) => typeof o[k] === "string" && (o[k] as string).length > 0);
  if (!texts) return false;

  const history =
    Array.isArray(o.history) &&
    o.history.length >= 3 &&
    o.history.every((h) => {
      if (!h || typeof h !== "object") return false;
      const item = h as Record<string, unknown>;
      return typeof item.year === "number" && typeof item.event === "string";
    });
  if (!history) return false;

  return Array.isArray(o.recurringNames) && o.recurringNames.every((n) => typeof n === "string");
}

export function worldBiblePrompt(year: number) {
  const label = year.toLocaleString("en-US");
  return `You are the world-builder for KAALCHAKRA, a fictional newspaper from the future.

Imagine the world in the year ${label} AD and write its "World Bible": a coherent, internally consistent fictional world that every newspaper story will be based on.

Rules:
- This is pure fiction and speculation, not a prediction.
- Be specific and concrete: invent named institutions, treaties, projects, cities and technologies, and keep them consistent with each other.
- Do not use real living people as characters. Invent new names.
- Scale everything to how far ${label} is from today. For a near year, build on today's trends. For a far year, assume deep change: new civilisations, new forms of society, possibly new forms of humanity. If the year is 2026 or earlier, write it as an alternate history that diverged from our own.
- Give India a real place in the world, but keep a truly global view: no region should be ignored.
- Keep each text field to 3 to 5 sentences.

Return ONLY a JSON object with exactly these keys:
{
  "eraName": "a short evocative name for this era",
  "overview": "the big picture of the world in this year",
  "history": [ { "year": 0, "event": "..." } ],
  "geopolitics": "power blocs, borders, governance, conflicts",
  "technology": "dominant technologies and how people use them",
  "environment": "climate, nature, energy",
  "economy": "how wealth, work and trade function",
  "societyAndCulture": "daily life, values, art, language, religion",
  "spaceExploration": "humanity's presence beyond Earth",
  "indiaSnapshot": "what India is like in this year",
  "recurringNames": ["named institutions, places, projects and fictional people that stories can reuse"]
}

"history" must have 6 to 8 events, in chronological order, each with a numeric "year" earlier than ${label}, covering how this world came to be.
"recurringNames" must have 8 to 12 entries.`;
}