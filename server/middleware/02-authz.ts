import { auth } from "#server/utils/auth";
import { db } from "#server/db/client";
import { user as userTable } from "#server/db/schema/auth";
import { eq } from "drizzle-orm";

type UserStatus = "pending" | "active" | "disabled";
type UserRole = "admin" | "user";

function hasRole(roleRaw: string | null | undefined, role: UserRole) {
    return String(roleRaw ?? "")
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
        .includes(role);
}

function isPublicPath(path: string): boolean {
    if (path.startsWith("/_nuxt")) return true;
    if (path.startsWith("/__nuxt_error")) return true;
    if (path === "/favicon.ico") return true;
    if (path === "/robots.txt") return true;
    if (path.startsWith("/sitemap")) return true;

    if (path === "/") return true;
    if (path.startsWith("/auth")) return true;

    // Better-Auth endpoints
    if (path.startsWith("/api/auth")) return true;

    return false;
}

export default defineEventHandler(async (event) => {
    const path = event.path ?? "/";
    if (isPublicPath(path)) return;

    const session = await auth.api.getSession({ headers: event.headers });

    if (!session?.user?.id) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const userRow = await db.query.user.findFirst({
        where: eq(userTable.id, session.user.id),
        columns: {
            emailVerified: true,
            status: true,
            role: true,
        },
    });

    if (!userRow) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    if (!userRow.emailVerified) {
        throw createError({ statusCode: 403, statusMessage: "Email not verified" });
    }

    if ((userRow.status as UserStatus) !== "active") {
        throw createError({ statusCode: 403, statusMessage: "Account pending approval" });
    }

    // ✅ Server-enforced admin protection
    if (path.startsWith("/admin") && !hasRole(userRow.role, "admin")) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
});
