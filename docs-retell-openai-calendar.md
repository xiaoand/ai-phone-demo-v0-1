# Integration Notes

## Retell

Retell sends custom function calls to your endpoint with `name`, `call`, and `args` unless args-only payload mode is enabled. This project supports both shapes in `/api/retell/function`.

Retell webhooks send call lifecycle events to `/api/retell/webhook`; this demo stores them in `retell-calls.ndjson` for lightweight local inspection.

Inbound calls can use `/api/retell/inbound` to attach dynamic variables and ensure the configured agent is selected.

## OpenAI

The OpenAI call is intentionally narrow: it only rewrites the SMS confirmation text. Appointment decisions stay deterministic and schema-validated in application code.

## Google Calendar

The calendar module uses a service account JWT with the `https://www.googleapis.com/auth/calendar` scope and calls `calendar.events.insert`.

## Demo Limitations

- No persistent database.
- No duplicate appointment prevention.
- No calendar free/busy check.
- SMS falls back to console logging unless Twilio is configured.
- Retell signature verification is HMAC based and should be confirmed against the final Retell account configuration before public exposure.
