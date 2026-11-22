import type { Edition } from "./edition";

type StatusResponse = {
  ok: boolean;
  status?: "none" | "stale" | "generating" | "ready" | "failed";
  edition?: Edition;
  error?: string | null;
};

const POLL_MS = 3000;
const MAX_WAIT_MS = 6 * 60 * 1000;

const inflight = new Map<number, Promise<Edition>>();
const storageKey = (year: number) => `kc-edition-${year}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readStored(year: number): Edition | null {
  try {
    const raw = sessionStorage.getItem(storageKey(year));
    return raw ? (JSON.parse(raw) as Edition) : null;
  } catch {
    return null;
  }
}

function store(year: number, edition: Edition) {
  try {
    sessionStorage.setItem(storageKey(year), JSON.stringify(edition));
  } catch {}
}

async function getStatus(year: number): Promise<StatusResponse> {
  const res = await fetch(`/api/edition?year=${year}`, { cache: "no-store" });
  const json = (await res.json().catch(() => null)) as StatusResponse | null;
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error ?? `Status check failed (${res.status})`);
  }
  return json;
}

async function startGeneration(year: number) {
  const res = await fetch("/api/edition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error ?? `Could not start generation (${res.status})`);
  }
}

async function run(year: number): Promise<Edition> {
  const deadline = Date.now() + MAX_WAIT_MS;
  let restarts = 0;
  let first = true;

  for (;;) {
    const s = await getStatus(year);

    if (s.status === "ready" && s.edition) return s.edition;
    if (s.status === "failed" && !first) throw new Error(s.error ?? "Generation failed");

    const needsStart = s.status === "none" || s.status === "stale" || (s.status === "failed" && first);
    if (needsStart) {
      if (restarts >= 2) throw new Error("Generation could not be started");
      restarts += 1;
      await startGeneration(year);
    }

    first = false;
    if (Date.now() > deadline) throw new Error("Timed out waiting for the edition");
    await sleep(POLL_MS);
  }
}

export function loadEdition(year: number): Promise<Edition> {
  const stored = readStored(year);
  if (stored) return Promise.resolve(stored);

  const running = inflight.get(year);
  if (running) return running;

  const promise = run(year)
    .then((edition) => {
      store(year, edition);
      return edition;
    })
    .finally(() => {
      inflight.delete(year);
    });

  inflight.set(year, promise);
  return promise;
}