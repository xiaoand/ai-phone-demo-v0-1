import OpenAI from "openai";
import type { AppointmentRequest } from "@/lib/appointments";

export async function buildConfirmationMessage(appointment: AppointmentRequest, calendarLink?: string) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackMessage(appointment, calendarLink);
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
      input: [
        {
          role: "system",
          content:
            "你为中文电话预约 Demo 生成短信确认文案。只输出短信正文，语气专业简洁，少于70个中文字符。"
        },
        {
          role: "user",
          content: JSON.stringify({ appointment, calendarLink })
        }
      ]
    });

    return response.output_text?.trim() || fallbackMessage(appointment, calendarLink);
  } catch (error) {
    console.error("OpenAI confirmation failed", error);
    return fallbackMessage(appointment, calendarLink);
  }
}

function fallbackMessage(appointment: AppointmentRequest, calendarLink?: string) {
  const when = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: process.env.GOOGLE_CALENDAR_TIMEZONE ?? "America/Los_Angeles"
  }).format(new Date(appointment.startsAt));

  const link = calendarLink ? ` ${calendarLink}` : "";
  return `${appointment.customerName}，您的${appointment.topic}已预约：${when}。如需调整请回复本短信。${link}`;
}
