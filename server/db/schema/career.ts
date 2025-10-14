// server/db/schema/careers.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { company } from "./company";

export const career = pgTable("career", {
  id: uuid().primaryKey().defaultRandom(),
  // Keep user_id as a plain column (Better-Auth will create its own users table).
  // I'll add an FK later once Better-Auth is in.
  userId: uuid("user_id"),
  slug: text("slug").notNull().unique(),
  companyId: uuid("company_id").notNull().references(() => company.id),
  position: text("position").notNull(), // e.g., "PROFESSIONAL DEVELOPMENT"
  startDate: text("start_date"), // "2024" (string in sample)
  endDate: text("end_date"), // "Present" (string in sample)
  cardColor: text("card_color"),
  description: text("description"),
  companyOverview: text("company_overview"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_At", { mode: "date" }).defaultNow().notNull(),
});
