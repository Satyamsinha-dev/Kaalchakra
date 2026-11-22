import type { WorldBible } from "./worldBible";

export function worldBiblePrompt(year: number) {
  const label = year.toLocaleString("en-US");
  return `You are the world-builder for KAALCHAKRA, a fictional newspaper from the future.

Imagine the world in the year ${label} AD and write its "World Bible": a coherent fictional world that every newspaper story will be based on.

Rules:
- This is pure fiction and speculation, not a prediction.
- Write in plain, simple English. A 15-year-old must understand every sentence. Use short sentences. No jargon. If you invent a technical term, explain it in the same sentence using everyday words.
- Ground every field in ordinary daily life: food, school, jobs, travel, money, families, festivals, sports.
- Be specific: invent a few named places, organisations and projects, but keep names short and easy to say. Never stack abstract nouns.
- Include real tension: at least three things people argue about, and at least two groups who lose out or feel left behind.
- Do not use real living people. Invent new names.
- Scale everything to how far ${label} is from today. For a near year, build on today's trends. For a far year, assume deep change: new societies, possibly new forms of humanity. If the year is 2026 or earlier, write it as an alternate history that diverged from our own.
- Give India a real place in the world, but keep a truly global view: no region should be ignored.
- Each text field must be 2 to 4 short sentences.

Return ONLY a JSON object with exactly these keys:
{
  "eraName": "a short, simple, evocative name for this era",
  "overview": "the big picture of the world in this year",
  "history": [ { "year": 0, "event": "..." } ],
  "geopolitics": "who holds power, borders, governance, conflicts",
  "technology": "the technologies people use every day",
  "environment": "climate, nature, energy",
  "economy": "how people earn, spend and trade",
  "societyAndCulture": "daily life, values, art, language, religion",
  "spaceExploration": "humanity's presence beyond Earth",
  "indiaSnapshot": "what India is like in this year",
  "recurringNames": ["named places, organisations, projects and ordinary people (first names) that stories can reuse"]
}

"history" must have 6 to 8 events, in chronological order, each with a numeric "year" earlier than ${label}.
"recurringNames" must have 8 to 10 entries, short and easy to say.`;
}

export function editionPrompt(year: number, world: WorldBible) {
  const label = year.toLocaleString("en-US");
  return `You are the editor-in-chief of KAALCHAKRA, a fictional newspaper published in the year ${label} AD.

Write today's front-page edition. Use ONLY the World Bible below as the truth of this world. Every story must be consistent with it and with each other, and should reuse its recurring names, places and events.

WORLD BIBLE:
${JSON.stringify(world)}

HOW TO WRITE (most important):
- Write for everyone, like a friendly newsroom that respects its readers. Simple words, short sentences (about 18 words at most). A 15-year-old must follow every line without help.
- No jargon. If a story needs a new invention or idea, explain it in one plain sentence, ideally with an everyday comparison ("it works like...").
- Every story is about PEOPLE. Open with a specific person, place or moment (a small scene), then say what happened, then why it matters, then what could happen next.
- Headlines: at most 8 words. Concrete and curious. Start with a person or a surprising fact. Never stack abstract nouns.
- Make readers want to continue: end each paragraph with something that pulls the reader into the next one.
- Include tension. Show disputes, costs, risks and people who lose out. Do not simply praise the future.
- Keep a human voice. Allow a little humour or warmth where it fits.

Rules:
- Write from inside that world, as if the year ${label} were ordinary. Do not explain the world to an outsider.
- This is fiction. Do not use real living people, real companies or real brands. Invent new names.
- Concrete details over vague claims: names, places, numbers and short quotes from invented people.
- No story may contradict the World Bible. Never mention the World Bible itself.

Structure:
- "lead": the single biggest story of the day, in any section.
- "stories": exactly 5 stories, one for each section in this order: India, World, Science & Technology, Society, Beyond Earth.
- "briefs": exactly 3 very short items. Make them surprising, light or funny everyday news.

Fields of every story:
- "section": one of "India", "World", "Science & Technology", "Society", "Beyond Earth"
- "headline": at most 8 words
- "subtitle": one short sentence
- "summary": 1 to 2 sentences for the front page that make the reader curious, like a hook
- "byline": e.g. "By Anika Rao, Science Desk" using an invented name, or "By KAALCHAKRA Bureau"
- "body": array of paragraphs, each only 1 to 3 short sentences. 7 paragraphs for the lead, 5 for the other stories
- "highlights": 3 to 4 short points, at most 10 words each, in plain words. They work as a "read this in 30 seconds" summary
- "whatThisMeans": 1 to 2 sentences speaking directly to the reader as "you", about why this matters in daily life
- "imagePrompt": one English sentence describing a single cinematic scene to illustrate the story, with no text, no logos and no real people

Fields of every brief: "headline" and "text" (one short sentence).

Return ONLY a JSON object: { "lead": {...}, "stories": [...], "briefs": [...] }`;
}