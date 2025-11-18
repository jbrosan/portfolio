// server/scripts/seed.mjs
/* eslint-disable no-console */

import crypto from "node:crypto";
import pg from "pg";

/** ---------- Helpers ---------- */

function slugify(s) {
    return s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036F]/g, "") // strip accents
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}

function nowIso() {
    return new Date().toISOString();
}

/** ---------- Environment ---------- */

// eslint-disable-next-line node/no-process-env
const { DATABASE_URL, SEED_USER_ID, ADMIN_EMAIL } = process.env;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

console.log("ADMIN_EMAIL:", ADMIN_EMAIL);
console.log("DATABASE_URL:", DATABASE_URL);

if (!SEED_USER_ID && !ADMIN_EMAIL) {
    console.error("Either SEED_USER_ID or ADMIN_EMAIL must be set.");
    process.exit(1);
}

/** ---------- Data ---------- */

const CATEGORY_NAMES = [
    "Leadership",
    "Technology",
    "Business Acumen",
    "Results Driven",
    "Building Coalitions & Relationships",
    "Leading Change & Agility",
];

const CORE_COMPETENCIES = [
    "Strategic Planning",
    "Vision Development",
    "Change Management",
    "Strategic Advisory",
    "Financial Acumen",
    "Governance",
    "Process Optimization",
    "Risk Management",
    "Legal",
    "Contract Management",
    "Regulatory Compliance",
    "Strategic Decision Making",
    "Collaboration",
    "Accurate Meeting Minutes",
    "Communication Management",
    "Corporate Record Management",
    "Microsoft Office",
    "AS400",
    "PRIMS",
    "Boss Warehouse Management",
    "Loopnet",
    "ERP System Integrations and Upgrades",
    "Quillbot",
    "AI/ML Strategy",
    "Cloud Architecture",
    "Data Analytics",
    "Grammarly",
    "Agile Methodology",
    "Team Building",
    "Sensitive Material Management",
    "Executive Coaching",
    "Stakeholder Management",
    "Board Relations",
    "Active Listening",
    "Self-Motivation",
    "Networking",
    "Stakeholder and Shareholder Management",
    "Mergers & Acquisitions (M&A)",
    "Financial Strategy and Planning",
    "Investment Management",
    "Treasury Management",
    "Capital Allocation",
    "Asset Management",
    "Capital Project Management",
    "Real Estate Development",
    "Internal Auditor",
    "Audit Compliance",
    "Financial Operations",
    "Financial Reporting",
    "GAAP and IFRS",
    "Japan Operations",
    "Accurate Reporting",
    "Cross Functional Team Leadership",
    "Cash Flow Management",
    "Strategic Alignment",
    "Cybersecurity",
    "Environmental Compliance",
    "Problem Solving",
    "Employee Benefits",
    "Community Engagement",
    "Conflict Resolution",
];

const CATEGORY_MAP = {
    "Leadership": [
        "Strategic Planning",
        "Vision Development",
        "Strategic Advisory",
        "Team Building",
        "Executive Coaching",
        "Cross Functional Team Leadership",
        "Strategic Alignment",
        "Self-Motivation",
    ],
    "Technology": [
        "Microsoft Office",
        "AS400",
        "PRIMS",
        "Boss Warehouse Management",
        "Loopnet",
        "ERP System Integrations and Upgrades",
        "Quillbot",
        "AI/ML Strategy",
        "Cloud Architecture",
        "Data Analytics",
        "Grammarly",
        "Cybersecurity",
    ],
    "Business Acumen": [
        "Financial Acumen",
        "Governance",
        "Risk Management",
        "Legal",
        "Contract Management",
        "Regulatory Compliance",
        "Strategic Decision Making",
        "Mergers & Acquisitions (M&A)",
        "Financial Strategy and Planning",
        "Investment Management",
        "Treasury Management",
        "Capital Allocation",
        "Asset Management",
        "Internal Auditor",
        "Audit Compliance",
        "Financial Operations",
        "Financial Reporting",
        "GAAP and IFRS",
        "Accurate Reporting",
        "Cash Flow Management",
        "Real Estate Development",
        "Japan Operations",
        "Environmental Compliance",
        "Corporate Record Management",
        "Employee Benefits",
        "Sensitive Material Management",
    ],
    "Results Driven": ["Process Optimization", "Problem Solving"],
    "Building Coalitions & Relationships": [
        "Collaboration",
        "Stakeholder Management",
        "Stakeholder and Shareholder Management",
        "Board Relations",
        "Active Listening",
        "Networking",
        "Community Engagement",
        "Communication Management",
        "Accurate Meeting Minutes",
        "Conflict Resolution",
    ],
    "Leading Change & Agility": ["Change Management", "Agile Methodology"],
};

const COMPETENCY_TO_CATEGORY = (() => {
    const m = new Map();
    for (const [cat, items] of Object.entries(CATEGORY_MAP)) {
        for (const name of items) m.set(name, cat);
    }
    return m;
})();

/** ---------- Seed Logic ---------- */

const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    max: 2,
});

const client = await pool.connect();

try {
    // Resolve the seed user ID
    let seedUserId = SEED_USER_ID;

    if (!seedUserId) {
        // Look up the admin by email created in seed-admin
        const { rows } = await client.query(
            `SELECT id FROM "user" WHERE email = $1 LIMIT 1`,
            [ADMIN_EMAIL],
        );
        if (rows.length === 0) {
            console.error(
                `No user found with email ${ADMIN_EMAIL}. `
                + "Run the admin seed first (e.g., npm run db:seed:admin).",
            );
            process.exit(1);
        }
        seedUserId = rows[0].id;
        console.log(`[seed] Using user id ${seedUserId} (email=${ADMIN_EMAIL})`);
    }
    else {
        console.log(`[seed] Using SEED_USER_ID=${seedUserId} from env`);
    }

    await client.query("BEGIN");

    // 1) Upsert categories (keep order via sort)
    const categoryIdByName = new Map();

    for (let i = 0; i < CATEGORY_NAMES.length; i++) {
        const name = CATEGORY_NAMES[i];
        const slug = slugify(name);
        const sort = i + 1;
        const now = nowIso();

        await client.query(
            `
            INSERT INTO competency_category (
              id,
              user_id,
              name,
              slug,
              sort,
              created_by,
              updated_by,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7)
            ON CONFLICT (slug) DO UPDATE
              SET name = EXCLUDED.name,
                  sort = EXCLUDED.sort,
                  updated_by = EXCLUDED.updated_by,
                  updated_at = EXCLUDED.updated_at
            `,
            [
                crypto.randomUUID(), // $1 id
                seedUserId, // $2 user_id
                name, // $3 name
                slug, // $4 slug
                sort, // $5 sort
                seedUserId, // $6 created_by / updated_by
                now, // $7 created_at / updated_at
            ],
        );

        const { rows } = await client.query(
            `SELECT id FROM competency_category WHERE slug = $1`,
            [slug],
        );
        categoryIdByName.set(name, rows[0].id);
    }

    // 2) Upsert competencies, mapped to category
    for (const name of CORE_COMPETENCIES) {
        const categoryName
            = COMPETENCY_TO_CATEGORY.get(name) || "Business Acumen"; // sensible default
        const categoryId = categoryIdByName.get(categoryName);
        const slug = slugify(name);
        const now = nowIso();

        await client.query(
            `
            INSERT INTO competency (
              id,
              user_id,
              category_id,
              name,
              slug,
              created_by,
              updated_by,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7)
            ON CONFLICT (slug) DO UPDATE
              SET category_id = EXCLUDED.category_id,
                  name = EXCLUDED.name,
                  updated_by = EXCLUDED.updated_by,
                  updated_at = EXCLUDED.updated_at
            `,
            [
                crypto.randomUUID(), // $1 id
                seedUserId, // $2 user_id
                categoryId, // $3 category_id
                name, // $4 name
                slug, // $5 slug
                seedUserId, // $6 created_by / updated_by
                now, // $7 created_at / updated_at
            ],
        );
    }

    await client.query("COMMIT");
    console.log("✔ Seed completed");
}
catch (err) {
    await client.query("ROLLBACK");
    console.error("✖ Seed failed:", err);
    process.exit(1);
}
finally {
    client.release();
    await pool.end();
}
