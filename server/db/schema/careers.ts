// server/db/schema/careers.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { companies } from "./companies";

export const careers = pgTable("careers", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Keep user_id as a plain column (Better-Auth will create its own users table).
  // You can add an FK later once Better-Auth is in.
  userId: uuid("user_id"),

  companyId: uuid("company_id").notNull().references(() => companies.id),
  position: text("position").notNull(), // e.g., "PROFESSIONAL DEVELOPMENT"
  startDate: text("start_date"), // "2024" (string in sample)
  endDate: text("end_date"), // "Present" (string in sample)
  cardColor: text("card_color"),
  description: text("description"),
  companyOverview: text("company_overview"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
