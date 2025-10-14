// server/db/schema/career_extras.ts
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { career } from "./career";

export const careerAchievement = pgTable("career_achievement", {
  id: uuid().primaryKey().defaultRandom(),
  careerId: uuid().notNull().references(() => career.id),
  body: text().notNull(),
});

export const careerAttachment = pgTable("career_attachment", {
  id: uuid().primaryKey().defaultRandom(),
  careerId: uuid().notNull().references(() => career.id),
  url: text().notNull(),
  title: text(),
});

export const careerSubRole = pgTable("career_sub_role", {
  id: uuid().primaryKey().defaultRandom(),
  careerId: uuid().notNull().references(() => career.id),
  name: text().notNull(),
});
