import { finalizeEdition, isRawEdition } from "./edition";
import { getEdition, saveFailed, saveReady, saveWorld } from "./editionStore";
import { generateJson } from "./gemini";
import { editionPrompt, worldBiblePrompt } from "./prompts";
import { isWorldBible } from "./worldBible";

export async function generateEdition(year: number) {
  try {
    const existing = await getEdition(year);
    let world = existing?.world ?? null;

    if (!world) {
      const w = await generateJson(worldBiblePrompt(year), isWorldBible, { maxOutputTokens: 8000 });
      world = w.data;
      await saveWorld(year, world);
    }

    const e = await generateJson(editionPrompt(year, world), isRawEdition, { maxOutputTokens: 20000 });
    await saveReady(year, finalizeEdition(year, e.data), e.model);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await saveFailed(year, message).catch(() => {});
  }
}