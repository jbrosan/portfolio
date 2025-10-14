import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { competency } from "./competency";

export const competencyCategory = pgTable("competency_category", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id),
  name: text().notNull().unique(),
  slug: text().notNull().unique(),
  sort: integer().default(0).notNull(),
  createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().notNull(),
});

export const competencyCategoriesRelation = relations(competencyCategory, ({ many }) => ({
  competencies: many(competency), // ✅ pass the table, not a function returning a promise
}));
