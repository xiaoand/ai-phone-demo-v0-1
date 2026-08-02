import { NextResponse } from "next/server";
import Retell from "retell-sdk";

export const dynamic = "force-dynamic";

export async function POST() {
  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.RETELL_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json({ error: "RETELL_API_KEY and RETELL_AGENT_ID are required." }, { status: 400 });
  }

  const client = new Retell({ apiKey });
  const webCall = await client.call.createWebCall({
    agent_id: agentId
  });

  return NextResponse.json(webCall);
}
