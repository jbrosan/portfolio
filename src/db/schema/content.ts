import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { auditColumns, immutableAuditColumns } from "./audit";
import { user } from "./auth";

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
    uniqueIndex("content_page_revision_page_id_id_uq").on(t.pageId, t.id),
    index("content_page_revision_page_id_idx").on(t.pageId),
    index("content_page_revision_created_at_idx").on(t.createdAt),
  ],
);

export const contentPagePublication = pgTable(
  "content_page_publication",
  {
    pageId: uuid("page_id").notNull(),
    revisionId: uuid("revision_id").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow().notNull(),
    publishedBy: uuid("published_by")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (t) => [
    primaryKey({
      name: "content_page_publication_pkey",
      columns: [t.pageId],
    }),
    foreignKey({
      name: "content_page_publication_page_id_content_page_id_fk",
      columns: [t.pageId],
      foreignColumns: [contentPage.id],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
    foreignKey({
      name: "content_page_publication_page_revision_fk",
      columns: [t.pageId, t.revisionId],
      foreignColumns: [contentPageRevision.pageId, contentPageRevision.id],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
);
