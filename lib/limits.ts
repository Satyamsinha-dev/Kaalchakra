import { createHash } from "node:crypto";
import { supabaseAdmin } from "./supabase";

export type LimitResult = { ok: true } | { ok: false; code: "IP_LIMIT" | "DAILY_CAP" };

function intFromEnv(name: string, fallback: number) {
  const n = parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "local";
  const salt = process.env.RATE_LIMIT_SALT ?? "kaalchakra";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function allowNewGeneration(key: string): Promise<LimitResult> {
  const db = supabaseAdmin();

  const ip = await db.rpc("hit_rate_limit", {
    p_key: `gen:${key}`,
    p_limit: intFromEnv("IP_HOURLY_LIMIT", 5),
    p_window_seconds: 3600,
  });
  if (ip.error) throw new Error(`rate limit check failed: ${ip.error.message}`);
  if (ip.data !== true) return { ok: false, code: "IP_LIMIT" };

  const slot = await db.rpc("take_generation_slot", {
    p_cap: intFromEnv("DAILY_GENERATION_CAP", 10),
  });
  if (slot.error) throw new Error(`daily cap check failed: ${slot.error.message}`);
  if (slot.data !== true) return { ok: false, code: "DAILY_CAP" };

  return { ok: true };
}