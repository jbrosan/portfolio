/* eslint-disable node/no-process-env */

import { z } from "zod";

/**
 * Keep this minimal and runtime-safe.
 * If you need more vars later, add them here.
 */
const EnvSchema = z.object({
    // Required for both migrate & seed
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Only used by seed; optional here and validated in seed logic if needed
    SEED_USER_ID: z.string().uuid().optional(),

    // Optional: switchable strictness (if you want)
    NODE_ENV: z.string().optional(),
    BUILDING: z.string().optional(),
});

export function getEnv({ strict } = {}) {
    const parsed = EnvSchema.safeParse(process.env);
    const isStrict = strict ?? (process.env.BUILDING !== "1" && process.env.NODE_ENV === "production");

    if (!parsed.success) {
        if (isStrict) {
            const msg = parsed.error.issues.map(i => `- ${i.path.join(".")}: ${i.message}`).join("\n");
            throw new Error(`Invalid environment:\n${msg}`);
        }
        // Non-strict: return best-effort defaults (not really needed here, but keeps behavior consistent)
        return EnvSchema.parse({});
    }
    return parsed.data;
}
