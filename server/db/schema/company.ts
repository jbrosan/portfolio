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
  createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "date" }).defaultNow().notNull(),
});

export const companyRelation = relations(company, ({ one }) => ({
  parent: one(company, {
    fields: [company.parentCompanyId],
    references: [company.id],
  }),
}));
