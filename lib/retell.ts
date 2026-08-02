import crypto from "crypto";

export type RetellFunctionBody = {
  name?: string;
  call?: {
    call_id?: string;
    from_number?: string;
    to_number?: string;
    direction?: string;
    transcript?: string;
  };
  args?: unknown;
};

export function verifyRetellSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RETELL_WEBHOOK_SECRET;
  if (!secret) {
    return true;
  }

  if (!signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");
  const hexDigest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqual(signature, digest) || timingSafeEqual(signature, hexDigest);
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
