import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { career } from "./career";
import { competencyCategory } from "./competency-category";

export const competency = pgTable("competency", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id),
  categoryId: uuid()
    .notNull()
    .references(() => competencyCategory.id, { onDelete: "restrict", onUpdate: "cascade" }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => user.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => user.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

});

export const careerCompetencyLink = pgTable("career_competency", {
  careerId: uuid().notNull().references(() => career.id, { onDelete: "cascade" }),
  competencyId: uuid("competency_id").notNull().references(() => competency.id, { onDelete: "cascade" }),
}, t => ({
  pk: primaryKey({ columns: [t.careerId, t.competencyId] }),
}));

// Define relations AFTER the tables are declared
export const competenciesRelation = relations(competency, ({ one, many }) => ({
  category: one(competencyCategory, {
    fields: [competency.categoryId],
    references: [competencyCategory.id],
  }),
  careerLinks: many(careerCompetencyLink),
}));
