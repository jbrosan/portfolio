import { relations } from "drizzle-orm";
// server/db/schema/companies.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const company = pgTable("company", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id),
  name: text().notNull(),
  slug: text().notNull().unique(), // set by DB trigger on INSERT
  logoUrl: text(),
  employees: text(),
  revenue: text(),
  funding: text(),
  industry: text(),
  location: text(),
  overview: text(),
  parentCompanyId: uuid(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
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

export const companyRelation = relations(company, ({ one }) => ({
  parent: one(company, {
    fields: [company.parentCompanyId],
    references: [company.id],
  }),
}));
