import { appendFile } from "fs/promises";
import { NextResponse } from "next/server";
import { verifyRetellSignature } from "@/lib/retell";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyRetellSignature(rawBody, request.headers.get("x-retell-signature"))) {
    return NextResponse.json({ error: "invalid Retell signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody || "{}");
  await appendFile("retell-calls.ndjson", `${JSON.stringify({ receivedAt: new Date().toISOString(), event })}\n`);

  return NextResponse.json({ ok: true });
}
