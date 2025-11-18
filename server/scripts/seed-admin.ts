// server/scripts/seed-admin.ts

/* eslint-disable no-console */

import "dotenv/config";
import { eq } from "drizzle-orm";

import env from "../../app/utils/env";
import { db } from "../db/client";
import { user } from "../db/schema";

async function main() {
    const adminEmail = env.ADMIN_EMAIL;
    const adminName = env.ADMIN_NAME ?? "Administrator";

    // 1) See if this email already exists
    const existing = await db
        .select({ id: user.id, role: user.role })
        .from(user)
        .where(eq(user.email, adminEmail))
        .limit(1);

    if (existing.length > 0) {
        const { id, role } = existing[0];
        console.log(
            `[seed-admin] User with email ${adminEmail} already exists (id=${id}, role=${role ?? "null"}). No changes made.`,
        );
        return;
    }

    // 2) Insert the admin user
    const [inserted] = await db
        .insert(user)
        .values({
            email: adminEmail,
            name: adminName,
            role: "admin",
            emailVerified: true,
        })
        .returning({
            id: user.id,
        });

    console.log(
        `[seed-admin] Created admin user with email ${adminEmail} and id=${inserted.id}.`,
    );
}

void main().catch((error) => {
    console.error("[seed-admin] Failed:", error);
    process.exit(1);
});
