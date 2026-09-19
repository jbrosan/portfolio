import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { auditColumns, immutableAuditColumns } from "./audit";

export const contentVisibility = pgEnum("content_visibility", ["public", "protected"]);

export const contentPage = pgTable(
  "content_page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    visibility: contentVisibility("visibility").default("protected").notNull(),
    ...auditColumns,
  },
  (t) => [
    uniqueIndex("content_page_slug_uq").on(t.slug),
    index("content_page_visibility_idx").on(t.visibility),
  ],
);

export const contentPageRevision = pgTable(
  "content_page_revision",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => contentPage.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    versionNumber: integer("version_number").notNull(),
    contentJson: jsonb("content_json").notNull(),
    changeNote: text("change_note"),
    ...immutableAuditColumns,
  },
  (t) => [
    uniqueIndex("content_page_revision_page_version_uq").on(t.pageId, t.versionNumber),
    index("content_page_revision_page_id_idx").on(t.pageId),
    index("content_page_revision_created_at_idx").on(t.createdAt),
  ],
);
