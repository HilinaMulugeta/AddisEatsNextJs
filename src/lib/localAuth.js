import { z } from "zod";

export const ACCOUNTS_STORAGE_KEY = "addis-eats-accounts";
export const AUTH_SESSION_KEY = "addis-eats-session";
export const AUTH_CHANGED_EVENT = "addis-eats-auth-change";
const EMPTY_ACCOUNTS = "[]";
const PBKDF2_ITERATIONS = 310000;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

function readAccounts() {
  const accounts = JSON.parse(
    window.localStorage.getItem(ACCOUNTS_STORAGE_KEY) || EMPTY_ACCOUNTS,
  );
  if (
    !Array.isArray(accounts) ||
    accounts.some(
      (account) =>
        typeof account.id !== "string" ||
        typeof account.name !== "string" ||
        typeof account.email !== "string" ||
        typeof account.salt !== "string" ||
        typeof account.passwordHash !== "string",
    )
  ) {
    throw new Error("Saved account data has an invalid format.");
  }
  return accounts;
}

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return new Uint8Array(hash);
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export async function registerLocalAccount(input) {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const accounts = readAccounts();
  if (accounts.some((account) => account.email === parsed.data.email)) {
    return {
      ok: false,
      fieldErrors: { email: ["An account with this email already exists."] },
    };
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account = {
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    salt: toBase64(salt),
    passwordHash: toBase64(await hashPassword(parsed.data.password, salt)),
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(
    ACCOUNTS_STORAGE_KEY,
    JSON.stringify([...accounts, account]),
  );
  return { ok: true, account: { id: account.id, name: account.name, email: account.email } };
}

export async function signInLocalAccount(input) {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Email or password is incorrect." };

  const account = readAccounts().find(
    (entry) => entry.email === parsed.data.email,
  );
  if (!account) return { ok: false, error: "Email or password is incorrect." };

  const actual = await hashPassword(parsed.data.password, fromBase64(account.salt));
  const expected = fromBase64(account.passwordHash);
  if (
    actual.length !== expected.length ||
    actual.some((byte, index) => byte !== expected[index])
  ) {
    return { ok: false, error: "Email or password is incorrect." };
  }

  window.sessionStorage.setItem(AUTH_SESSION_KEY, account.id);
  notifyAuthChanged();
  return {
    ok: true,
    account: { id: account.id, name: account.name, email: account.email },
  };
}

export function getCurrentLocalAccount() {
  const accountId = window.sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!accountId) return null;
  const account = readAccounts().find((entry) => entry.id === accountId);
  return account
    ? { id: account.id, name: account.name, email: account.email }
    : null;
}

export function getLocalAccountSnapshot() {
  try {
    return JSON.stringify(getCurrentLocalAccount());
  } catch {
    return JSON.stringify({ error: "Saved account data could not be read." });
  }
}

export function getServerAccountSnapshot() {
  return "null";
}

export function subscribeToLocalAccount(callback) {
  window.addEventListener(AUTH_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function signOutLocalAccount() {
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
  notifyAuthChanged();
}

export function getSafeRedirectPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/checkout";
  }
  try {
    const parsed = new URL(value, "https://addiseats.local");
    return parsed.origin === "https://addiseats.local"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : "/checkout";
  } catch {
    return "/checkout";
  }
}
