// server/db/schema/career_extras.ts
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { careers } from "./careers";

export const careerAchievements = pgTable("career_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  careerId: uuid("career_id").notNull().references(() => careers.id),
  body: text("body").notNull(),
});

export const careerAttachments = pgTable("career_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  careerId: uuid("career_id").notNull().references(() => careers.id),
  url: text("url").notNull(),
  title: text("title"),
});

export const careerSubRoles = pgTable("career_sub_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  careerId: uuid("career_id").notNull().references(() => careers.id),
  name: text("name").notNull(),
});

export const careerCustomFields = pgTable("career_custom_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  careerId: uuid("career_id").notNull().references(() => careers.id),
  key: text("key").notNull(),
  value: text("value"),
});
