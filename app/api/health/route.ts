import { NextResponse } from "next/server";
import { envStatus } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "ai-phone-demo",
    checks: envStatus()
  });
}
