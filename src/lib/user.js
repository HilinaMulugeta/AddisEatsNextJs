import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { z } from "zod";
import database from "./database.js";

const scrypt = promisify(scryptCallback);

export const signInSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80, "Name must be 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128, "Password must be 128 characters or fewer."),
});

function toUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

export function getUserProfile(userId) {
  const row = database.prepare("SELECT id, name, email FROM users WHERE id = ?").get(userId);
  return toUser(row);
}

export async function createUser({ name, email, password }) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash: `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`,
    createdAt: new Date().toISOString(),
  };

  try {
    database.prepare(`
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (@id, @name, @email, @passwordHash, @createdAt)
    `).run(user);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") return null;
    throw error;
  }

  return { id: user.id, name: user.name, email: user.email };
}

export async function verifyUserCredentials(email, password) {
  const row = database
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ? COLLATE NOCASE")
    .get(email);
  if (!row) return null;

  const [algorithm, saltHex, hashHex] = row.password_hash.split("$");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) {
    throw new Error("Stored password hash has an unsupported format.");
  }

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  return toUser(row);
}
