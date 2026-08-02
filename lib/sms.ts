export async function sendSms(to: string, body: string) {
  if (process.env.SMS_PROVIDER !== "twilio") {
    console.log("SMS console fallback", { to, body });
    return { provider: "console", sid: `console-${Date.now()}` };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !from) {
    throw new Error("Twilio is selected but TWILIO_ACCOUNT_SID or TWILIO_FROM_NUMBER is missing.");
  }

  const username = apiKey || accountSid;
  const password = apiSecret || authToken;

  if (!password) {
    throw new Error("Twilio is selected but TWILIO_API_SECRET or TWILIO_AUTH_TOKEN is missing.");
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ To: to, From: from, Body: body })
  });

  if (!response.ok) {
    throw new Error(`Twilio SMS failed: ${response.status} ${await response.text()}`);
  }

  const payload = (await response.json()) as { sid: string };
  return { provider: "twilio", sid: payload.sid };
}
