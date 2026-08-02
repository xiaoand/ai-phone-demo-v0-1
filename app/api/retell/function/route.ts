import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/appointments";
import { createCalendarEvent } from "@/lib/calendar";
import { buildConfirmationMessage } from "@/lib/openai";
import { verifyRetellSignature, type RetellFunctionBody } from "@/lib/retell";
import { sendSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyRetellSignature(rawBody, request.headers.get("x-retell-signature"))) {
    return NextResponse.json({ error: "invalid Retell signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody || "{}") as RetellFunctionBody;
  const args = body.args ?? body;

  if (body.name && body.name !== "book_appointment") {
    return NextResponse.json({ error: `unsupported function: ${body.name}` }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(args);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "预约信息不完整，请继续询问客户姓名、电话、开始时间、时长和预约事项。",
        issues: parsed.error.flatten()
      },
      { status: 422 }
    );
  }

  const appointment = parsed.data;
  const event = await createCalendarEvent(appointment);
  const smsBody = await buildConfirmationMessage(appointment, event.htmlLink);
  const sms = await sendSms(appointment.phone, smsBody);

  return NextResponse.json({
    success: true,
    message: "预约已创建，短信确认已发送。",
    appointment,
    calendar: event,
    sms
  });
}
