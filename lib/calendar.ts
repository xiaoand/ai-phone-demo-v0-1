import { google } from "googleapis";
import { appointmentEnd, type AppointmentRequest } from "@/lib/appointments";

export async function createCalendarEvent(appointment: AppointmentRequest) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!calendarId || !clientEmail || !privateKey) {
    console.warn("Google Calendar is not configured; returning demo event.");
    return {
      id: `demo-${Date.now()}`,
      htmlLink: undefined,
      demo: true
    };
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  const calendar = google.calendar({ version: "v3", auth });
  const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE ?? "America/Los_Angeles";

  const result = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `${appointment.topic} - ${appointment.customerName}`,
      description: [
        `客户：${appointment.customerName}`,
        `电话：${appointment.phone}`,
        appointment.notes ? `备注：${appointment.notes}` : undefined
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: appointment.startsAt,
        timeZone
      },
      end: {
        dateTime: appointmentEnd(appointment),
        timeZone
      }
    }
  });

  return {
    id: result.data.id,
    htmlLink: result.data.htmlLink,
    demo: false
  };
}
