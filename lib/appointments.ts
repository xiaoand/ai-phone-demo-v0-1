import { z } from "zod";

export const appointmentSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(7),
  startsAt: z.string().datetime({ offset: true }),
  durationMinutes: z.coerce.number().int().min(15).max(240).default(30),
  topic: z.string().min(1),
  notes: z.string().optional().default("")
});

export type AppointmentRequest = z.infer<typeof appointmentSchema>;

export function appointmentEnd(appointment: AppointmentRequest) {
  const start = new Date(appointment.startsAt);
  return new Date(start.getTime() + appointment.durationMinutes * 60_000).toISOString();
}
