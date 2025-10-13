import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { competencies } from "./competencies"; // ✅ direct import

export const competencyCategories = pgTable("competency_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  sort: integer("sort").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const competencyCategoriesRelations = relations(competencyCategories, ({ many }) => ({
  competencies: many(competencies), // ✅ pass the table, not a function returning a promise
}));
