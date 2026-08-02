# Credentials Setup

This file prepares the credentials needed for the AI phone demo. Do not commit real secrets. Store local values in `.env.local` and production values in your deployment platform's encrypted environment variables.

## Required Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://your-public-demo-url.example

RETELL_API_KEY=key_...
RETELL_AGENT_ID=agent_...
RETELL_WEBHOOK_SECRET=optional_shared_secret

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.6-luna

GOOGLE_CALENDAR_ID=primary-or-calendar-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=calendar-writer@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_TIMEZONE=America/Los_Angeles

SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_API_KEY=SK...
TWILIO_API_SECRET=...
TWILIO_FROM_NUMBER=+15551234567
```

## OpenAI API Key

1. Open the OpenAI Platform dashboard.
2. Create or select the project for this demo.
3. Create a project API key and copy it once.
4. Add it as `OPENAI_API_KEY`.
5. Keep `OPENAI_MODEL=gpt-5.6-luna` for short SMS copy generation unless you intentionally choose a different model.

Validation:

- `OPENAI_API_KEY` exists in `.env.local`.
- `/api/retell/function` still succeeds if OpenAI is unavailable because the app has a deterministic fallback message.

Official reference: OpenAI project API keys docs say project keys can be listed and deleted through the API, but issuing keys requires user authorization in the platform dashboard.

## Retell AI

1. Open the Retell dashboard.
2. Create a voice agent for the appointment assistant.
3. Copy the API key into `RETELL_API_KEY`.
4. Copy the voice agent id into `RETELL_AGENT_ID`.
5. Buy or import a phone number and bind the inbound agent to that number.
6. Configure these URLs after your app has a public HTTPS URL:

```text
Inbound webhook:      ${NEXT_PUBLIC_APP_URL}/api/retell/inbound
Call event webhook:   ${NEXT_PUBLIC_APP_URL}/api/retell/webhook
Custom function URL:  ${NEXT_PUBLIC_APP_URL}/api/retell/function
Custom function name: book_appointment
```

Function schema:

```json
{
  "customerName": "string",
  "phone": "string",
  "startsAt": "ISO 8601 string with timezone",
  "durationMinutes": "number",
  "topic": "string",
  "notes": "string"
}
```

Validation:

- Call the Retell phone number.
- Confirm the agent asks for missing appointment fields.
- Confirm Retell calls `book_appointment` when all fields are collected.

## Twilio SMS

1. Open Twilio Console.
2. Confirm the account has SMS capability and a valid sending number.
3. Copy Account SID into `TWILIO_ACCOUNT_SID`.
4. Create a Standard API Key.
5. Copy the key SID into `TWILIO_API_KEY`.
6. Copy the key secret into `TWILIO_API_SECRET`.
7. Copy the SMS capable number into `TWILIO_FROM_NUMBER`.
8. Set `SMS_PROVIDER=twilio`.

Local fallback:

- Use `SMS_PROVIDER=console` before real SMS testing. The app logs the outgoing message instead of sending it.

Validation:

- Use `/api/retell/function` with a verified test recipient.
- Confirm the Twilio Message SID appears in the API response.

Official reference: Twilio recommends API keys for production API authentication. Account SID and Auth Token are acceptable for local testing, but API Key/Secret is safer for deployed apps.

## Google Cloud Calendar API

1. Create or select a Google Cloud project.
2. Enable Google Calendar API.
3. Create a service account, for example `calendar-writer`.
4. Create a JSON key for the service account.
5. Copy `client_email` to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
6. Copy `private_key` to `GOOGLE_PRIVATE_KEY`, preserving newline escapes as `\n`.
7. Open the Google Calendar you want to write to.
8. Share the calendar with the service account email.
9. Grant permission to make changes to events.
10. Copy the calendar id into `GOOGLE_CALENDAR_ID`; use `primary` only when the authenticated identity can access it.

Validation:

- Call `/api/retell/function` with a future appointment time.
- Confirm the returned `calendar.demo` is `false`.
- Open Google Calendar and verify the event appears.

Official reference: Google Calendar `events.insert` creates an event at `POST /calendars/{calendarId}/events` and requires authorized access plus event `start` and `end` fields.

## Demo Readiness Checklist

- [ ] `.env.local` contains all required values.
- [ ] `NEXT_PUBLIC_APP_URL` is an HTTPS URL reachable by Retell.
- [ ] Retell number is bound to the appointment voice agent.
- [ ] Retell `book_appointment` custom function points to the deployed endpoint.
- [ ] Twilio sending number can send SMS to the test recipient country.
- [ ] Google Calendar is shared with the service account.
- [ ] One complete test call creates a calendar event and sends a confirmation SMS.
