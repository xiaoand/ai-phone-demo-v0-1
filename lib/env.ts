const requiredGroups = [
  { name: "Retell API", keys: ["RETELL_API_KEY", "RETELL_AGENT_ID"] },
  { name: "OpenAI", keys: ["OPENAI_API_KEY"] },
  {
    name: "Google Calendar",
    keys: ["GOOGLE_CALENDAR_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"]
  },
  { name: "SMS", keys: ["SMS_PROVIDER"] }
];

export function envStatus() {
  return requiredGroups.map((group) => ({
    name: group.name,
    ready: group.keys.every((key) => Boolean(process.env[key]))
  }));
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
