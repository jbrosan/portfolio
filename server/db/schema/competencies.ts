import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { careers } from "./careers";
import { competencyCategories } from "./competency-categories";

export const competencies = pgTable("competencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => competencyCategories.id, { onDelete: "restrict", onUpdate: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const careerCompetencies = pgTable("career_competencies", {
  careerId: uuid("career_id").notNull().references(() => careers.id, { onDelete: "cascade" }),
  competencyId: uuid("competency_id").notNull().references(() => competencies.id, { onDelete: "cascade" }),
});

// Define relations AFTER the tables are declared
export const competenciesRelations = relations(competencies, ({ one, many }) => ({
  category: one(competencyCategories, {
    fields: [competencies.categoryId],
    references: [competencyCategories.id],
  }),
  careerLinks: many(careerCompetencies),
}));
