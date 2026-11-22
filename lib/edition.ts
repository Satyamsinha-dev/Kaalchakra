import type { WorldBible } from "./worldBible";

export const SECTIONS = ["India", "World", "Science & Technology", "Society", "Beyond Earth"] as const;
export type Section = (typeof SECTIONS)[number];

export type RawStory = {
  section: Section;
  headline: string;
  subtitle: string;
  summary: string;
  byline: string;
  body: string[];
  highlights: string[];
  whatThisMeans: string;
  imagePrompt: string;
};

export type Story = RawStory & { id: string; readingMinutes: number };
export type Brief = { headline: string; text: string };
export type RawEdition = { lead: RawStory; stories: RawStory[]; briefs: Brief[] };
export type Edition = {
  year: number;
  dateLabel: string;
  lead: Story;
  stories: Story[];
  briefs: Brief[];
};

function isStr(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function isStrArray(x: unknown, min: number): x is string[] {
  return Array.isArray(x) && x.length >= min && x.every(isStr);
}

function isRawStory(x: unknown): x is RawStory {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.section === "string" &&
    (SECTIONS as readonly string[]).includes(o.section) &&
    isStr(o.headline) &&
    isStr(o.subtitle) &&
    isStr(o.summary) &&
    isStr(o.byline) &&
    isStrArray(o.body, 3) &&
    isStrArray(o.highlights, 3) &&
    isStr(o.whatThisMeans) &&
    isStr(o.imagePrompt)
  );
}

function isBrief(x: unknown): x is Brief {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return isStr(o.headline) && isStr(o.text);
}

export function isRawEdition(x: unknown): x is RawEdition {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    isRawStory(o.lead) &&
    Array.isArray(o.stories) &&
    o.stories.length >= 4 &&
    o.stories.every(isRawStory) &&
    Array.isArray(o.briefs) &&
    o.briefs.length >= 2 &&
    o.briefs.every(isBrief)
  );
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function editionDateLabel(year: number) {
  const now = new Date();
  const d = new Date(Date.UTC(2000, now.getUTCMonth(), now.getUTCDate()));
  d.setUTCFullYear(year);
  if (Number.isNaN(d.getTime())) {
    return `${now.getUTCDate()} ${MONTHS[now.getUTCMonth()]} ${year}`;
  }
  return `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${year}`;
}

function toStory(raw: RawStory, id: string): Story {
  const words = raw.body.join(" ").split(/\s+/).length;
  return { ...raw, id, readingMinutes: Math.max(1, Math.round(words / 220)) };
}

export function finalizeEdition(year: number, raw: RawEdition): Edition {
  return {
    year,
    dateLabel: editionDateLabel(year),
    lead: toStory(raw.lead, "lead"),
    stories: raw.stories.map((s, i) => toStory(s, `story-${i + 1}`)),
    briefs: raw.briefs.slice(0, 3),
  };
}

export function editionPrompt(year: number, world: WorldBible) {
  const label = year.toLocaleString("en-US");
  return `You are the editor-in-chief of KAALCHAKRA, a fictional newspaper published in the year ${label} AD.

Write today's front-page edition. Use ONLY the World Bible below as the truth of this world. Every story must be consistent with it and with each other, and should reuse its recurring names, institutions and events.

WORLD BIBLE:
${JSON.stringify(world)}

Rules:
- Write from inside that world, as if the year ${label} were ordinary and today's history were the distant past. Do not explain the world to an outsider.
- Include tension. Not everything is good news: show disputes, costs, risks, trade-offs and people who lose out. Do not simply praise the future.
- This is fiction. Do not use real living people, real companies or real brands. Invent new names.
- Concrete details over vague claims: names, places, numbers, quotes from invented people.
- No story may contradict the World Bible. Do not mention the World Bible itself.

Structure:
- "lead": the single biggest story of the day, in any section.
- "stories": exactly 5 stories, one for each section in this order: India, World, Science & Technology, Society, Beyond Earth.
- "briefs": exactly 3 very short news items.

Fields of every story:
- "section": one of "India", "World", "Science & Technology", "Society", "Beyond Earth"
- "headline": at most 10 words
- "subtitle": one sentence
- "summary": 1 to 2 sentences for the front page
- "byline": e.g. "By Anika Rao, Science Desk" using an invented name, or "By KAALCHAKRA Bureau"
- "body": array of paragraphs, 2 to 4 sentences each. 6 paragraphs for the lead, 4 to 5 for other stories
- "highlights": 3 to 4 short phrases, at most 8 words each
- "whatThisMeans": 1 to 2 sentences on why it matters
- "imagePrompt": one English sentence describing a single cinematic scene to illustrate the story, with no text, no logos and no real people

Fields of every brief: "headline" and "text" (one sentence).

Return ONLY a JSON object: { "lead": {...}, "stories": [...], "briefs": [...] }`;
}