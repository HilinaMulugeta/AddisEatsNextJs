import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  SITE_URL: z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"), "must use HTTPS")
    .default("https://addiseats.et"),
  SESSION_SECRET: z.string().min(32, "must contain at least 32 characters"),
});

let validatedEnv;

export function getServerEnv() {
  if (validatedEnv) return validatedEnv;

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues
      .map(({ path, message }) => `${path.join(".")}: ${message}`)
      .join("; ");
    throw new Error(`Invalid server environment: ${problems}`);
  }

  validatedEnv = result.data;
  return validatedEnv;
}

export function getSessionSecret() {
  return getServerEnv().SESSION_SECRET;
}
