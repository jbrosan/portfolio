import { relations } from "drizzle-orm";
// server/db/schema/companies.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // set by DB trigger on INSERT
  logoUrl: text("logo_url"),
  employees: text("employees"),
  revenue: text("revenue"),
  funding: text("funding"),
  industry: text("industry"),
  location: text("location"),
  overview: text("overview"),
  parentCompanyId: uuid("parent_company_id"), // nullable; for subsidiaries
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const companiesRelations = relations(companies, ({ one }) => ({
  parent: one(companies, {
    fields: [companies.parentCompanyId],
    references: [companies.id],
  }),
}));
