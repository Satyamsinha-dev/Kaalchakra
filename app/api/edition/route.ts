import { after, connection, NextRequest, NextResponse } from "next/server";
import { claimEdition, getEdition } from "../../../lib/editionStore";
import { generateEdition } from "../../../lib/generateEdition";
import { allowNewGeneration, clientKey } from "../../../lib/limits";

export const maxDuration = 300;

function parseYear(value: unknown) {
  const year = typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(year) || year < 1 || year > 1_000_000_000) return null;
  return year;
}

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  await connection();
  const year = parseYear(request.nextUrl.searchParams.get("year"));
  if (!year) return fail("year must be between 1 and 1000000000", 400);

  try {
    const row = await getEdition(year);
    if (!row) return NextResponse.json({ ok: true, status: "none" });

    if (row.status === "ready" && row.content) {
      return NextResponse.json({ ok: true, status: "ready", edition: row.content });
    }
    if (row.status === "failed") {
      return NextResponse.json({ ok: true, status: "failed", error: row.error });
    }

    const expired = !row.lease_until || new Date(row.lease_until).getTime() < Date.now();
    return NextResponse.json({ ok: true, status: expired ? "stale" : "generating" });
  } catch (e) {
    return fail(e instanceof Error ? e.message : String(e), 500);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const year = parseYear(body?.year);
  if (!year) return fail("year must be between 1 and 1000000000", 400);

  try {
    const row = await getEdition(year);

    if (row?.status === "ready") {
      return NextResponse.json({ ok: true, status: "ready" });
    }

    const leaseValid =
      row?.status === "generating" && !!row.lease_until && new Date(row.lease_until).getTime() > Date.now();
    if (leaseValid) {
      return NextResponse.json({ ok: true, status: "generating" }, { status: 202 });
    }

    const allowed = await allowNewGeneration(clientKey(request));
    if (!allowed.ok) {
      const message =
        allowed.code === "DAILY_CAP"
          ? "Today's free generation limit is used up. Saved editions still open."
          : "Too many new editions from this device. Please try again later.";
      return NextResponse.json({ ok: false, code: allowed.code, error: message }, { status: 429 });
    }

    const result = await claimEdition(year);
    if (result === "claimed") {
      after(() => generateEdition(year));
      return NextResponse.json({ ok: true, status: "generating" }, { status: 202 });
    }

    return NextResponse.json({ ok: true, status: result }, { status: 202 });
  } catch (e) {
    return fail(e instanceof Error ? e.message : String(e), 500);
  }
}