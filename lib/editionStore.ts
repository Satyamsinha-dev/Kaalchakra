import type { Edition } from "./edition";
import { supabaseAdmin } from "./supabase";
import type { WorldBible } from "./worldBible";

export type EditionStatus = "generating" | "ready" | "failed";
export type ClaimResult = "claimed" | EditionStatus;

export type EditionRow = {
  year: number;
  status: EditionStatus;
  world: WorldBible | null;
  content: Edition | null;
  error: string | null;
  lease_until: string | null;
};

const now = () => new Date().toISOString();

export async function claimEdition(year: number): Promise<ClaimResult> {
  const { data, error } = await supabaseAdmin().rpc("claim_edition", { p_year: year });
  if (error) throw new Error(`claim_edition failed: ${error.message}`);
  return data as ClaimResult;
}

export async function getEdition(year: number): Promise<EditionRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("editions")
    .select("year,status,world,content,error,lease_until")
    .eq("year", year)
    .maybeSingle();
  if (error) throw new Error(`read failed: ${error.message}`);
  return data as EditionRow | null;
}

export async function saveWorld(year: number, world: WorldBible) {
  const { error } = await supabaseAdmin()
    .from("editions")
    .update({ world, updated_at: now() })
    .eq("year", year);
  if (error) throw new Error(`saveWorld failed: ${error.message}`);
}

export async function saveReady(year: number, edition: Edition, model: string) {
  const { error } = await supabaseAdmin()
    .from("editions")
    .update({
      content: edition,
      model,
      status: "ready",
      error: null,
      lease_until: null,
      ready_at: now(),
      updated_at: now(),
    })
    .eq("year", year);
  if (error) throw new Error(`saveReady failed: ${error.message}`);
}

export async function saveFailed(year: number, message: string) {
  const { error } = await supabaseAdmin()
    .from("editions")
    .update({
      status: "failed",
      error: message.slice(0, 600),
      lease_until: null,
      updated_at: now(),
    })
    .eq("year", year);
  if (error) throw new Error(`saveFailed failed: ${error.message}`);
}