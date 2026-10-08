import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_COOKIE } from "./constants";
import { getSessionSecret } from "./env";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function signSessionId(sessionId) {
  return createHmac("sha256", getSessionSecret())
    .update(sessionId)
    .digest("base64url");
}

export function createSessionToken(sessionId) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const signedValue = `${sessionId}.${expiresAt}`;
  return `${signedValue}.${signSessionId(signedValue)}`;
}

export async function getSessionId() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const signatureSeparator = token.lastIndexOf(".");
  if (signatureSeparator < 1) return null;

  const signedValue = token.slice(0, signatureSeparator);
  const valueSeparator = signedValue.lastIndexOf(".");
  if (valueSeparator < 1) return null;

  const sessionId = signedValue.slice(0, valueSeparator);
  const expiresAt = Number(signedValue.slice(valueSeparator + 1));
  if (!sessionId || !Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() / 1000) {
    return null;
  }

  const signature = token.slice(signatureSeparator + 1);
  const expected = signSessionId(signedValue);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);

  if (
    actualBytes.length !== expectedBytes.length ||
    !timingSafeEqual(actualBytes, expectedBytes)
  ) {
    return null;
  }

  return sessionId;
}
