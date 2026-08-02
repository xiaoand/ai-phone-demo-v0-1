# AI Employee Demo V0.1

Next.js + Retell AI + OpenAI demo for an AI phone agent that answers calls, books appointments, sends SMS confirmations, and writes Google Calendar events.

## What Is Included

- Retell inbound webhook: `POST /api/retell/inbound`
- Retell custom function endpoint: `POST /api/retell/function`
- Retell call event webhook: `POST /api/retell/webhook`
- Retell browser test call endpoint: `POST /api/retell/web-call`
- Google Calendar event creation through a service account
- SMS confirmation through Twilio, with a console fallback for local demo runs
- OpenAI-generated Chinese confirmation message, with a deterministic fallback
- Small operations dashboard at `/`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in Retell, OpenAI, Google Calendar, and SMS values.

4. Start the app:

```bash
npm run dev
```

5. Expose the local server for Retell during testing:

```bash
ngrok http 3000
```

Set `NEXT_PUBLIC_APP_URL` to the public HTTPS URL.

## Retell Configuration

Create or update a Retell phone agent:

- Inbound webhook URL: `${NEXT_PUBLIC_APP_URL}/api/retell/inbound`
- Agent webhook URL: `${NEXT_PUBLIC_APP_URL}/api/retell/webhook`
- Custom function name: `book_appointment`
- Custom function URL: `${NEXT_PUBLIC_APP_URL}/api/retell/function`
- Method: `POST`
- Payload mode: wrapped JSON or args-only are both supported

Function arguments:

```json
{
  "customerName": "王小明",
  "phone": "+14155550100",
  "startsAt": "2026-08-03T10:00:00-07:00",
  "durationMinutes": 30,
  "topic": "业务咨询",
  "notes": "客户希望中文沟通"
}
```

Suggested agent instruction:

```text
你是预约助理。请用中文自然接听电话，确认客户姓名、手机号、预约事项、日期、时间和预计时长。
当信息齐全时调用 book_appointment。调用成功后告知客户预约已完成，短信确认已发送。
如果客户给出的日期时间不明确，请追问到可以形成 ISO 8601 带时区时间。
```

## Google Calendar

Use a service account with Calendar API enabled. Share the target Google Calendar with the service account email and grant write access. The Calendar API `events.insert` call requires `calendarId`, `start`, and `end`; this demo also writes summary and description.

## SMS

For live SMS:

```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+15551234567
```

For local demos, leave `SMS_PROVIDER=console`; the message is logged instead of sent.

## 48 Hour Delivery Plan

Day 1:

- Create Next.js API shell and environment contract.
- Configure Retell phone number, inbound webhook, and function schema.
- Validate the appointment endpoint with manual JSON requests.
- Share Google Calendar with the service account and verify event creation.

Day 2:

- Add Twilio credentials and test SMS to an internal number.
- Run one full Retell test call.
- Review call transcript in Retell and tune the agent prompt.
- Record demo script and known limitations.

## Manual Test

```bash
curl -X POST http://localhost:3000/api/retell/function \
  -H "Content-Type: application/json" \
  -d '{
    "name": "book_appointment",
    "args": {
      "customerName": "王小明",
      "phone": "+14155550100",
      "startsAt": "2026-08-03T10:00:00-07:00",
      "durationMinutes": 30,
      "topic": "业务咨询",
      "notes": "第一次咨询"
    }
  }'
```

## Git Commit Plan

Recommended incremental commits:

1. `chore: scaffold next app for ai phone demo`
2. `feat: add retell appointment endpoints`
3. `feat: write appointments to google calendar`
4. `feat: add sms confirmation and openai copy`
5. `docs: add retell setup and 48 hour delivery plan`

## Assumptions

The original Chinese development specification was not present in this workspace, so this implementation follows the requirements in the task message. It is designed as a demo integration skeleton; production hardening should add durable storage, retry queues, idempotency keys, observability, stricter Retell signature verification based on the final Retell account secret format, and consent/compliance copy for SMS.
