import { NextResponse } from "next/server";
import { appUrl } from "@/lib/env";
import { verifyRetellSignature } from "@/lib/retell";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyRetellSignature(rawBody, request.headers.get("x-retell-signature"))) {
    return NextResponse.json({ error: "invalid Retell signature" }, { status: 401 });
  }

  const payload = rawBody ? JSON.parse(rawBody) : {};

  return NextResponse.json({
    agent_id: process.env.RETELL_AGENT_ID,
    dynamic_variables: {
      caller_phone: payload.from_number ?? "",
      booking_api_url: `${appUrl()}/api/retell/function`
    },
    metadata: {
      source: "ai-phone-demo",
      received_at: new Date().toISOString()
    }
  });
}
