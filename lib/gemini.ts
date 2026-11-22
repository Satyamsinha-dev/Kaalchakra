import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
];

function modelList() {
  const fromEnv = process.env.GEMINI_MODELS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_MODELS;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type GenerateResult<T> = { data: T; model: string; ms: number };

export async function generateJson<T>(
  prompt: string,
  validate: (x: unknown) => x is T,
  options: { maxOutputTokens?: number } = {}
): Promise<GenerateResult<T>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing in .env.local");

  const ai = new GoogleGenAI({ apiKey });
  const failures: string[] = [];

  for (const model of modelList()) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const start = Date.now();
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.9,
            maxOutputTokens: options.maxOutputTokens ?? 8000,
          },
        });
        const parsed: unknown = JSON.parse(response.text ?? "");
        if (!validate(parsed)) throw new Error("INVALID_SHAPE");
        return { data: parsed, model, ms: Date.now() - start };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        failures.push(`${model}#${attempt}: ${msg.slice(0, 100)}`);
        const busy = msg.includes("503") || msg.includes("UNAVAILABLE");
        const badOutput = msg.includes("INVALID_SHAPE") || e instanceof SyntaxError;
        if ((busy || badOutput) && attempt < 2) {
          await sleep(2000);
          continue;
        }
        break;
      }
    }
  }

  throw new Error("All models failed: " + failures.join(" | "));
}