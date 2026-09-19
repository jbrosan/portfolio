import { and, desc, eq, max, sql } from "drizzle-orm";

import { db } from "../db/client";
import {
  type ContentJson,
  contentPage,
  contentPagePublication,
  contentPageRevision,
} from "../db/schema/content";
import { requireActiveAdminByUserId } from "./admin-access.service";

type ContentVisibility = "public" | "protected";

type CreateContentPageInput = {
  actorUserId: string;
  slug: string;
  title: string;
  visibility: ContentVisibility;
  contentJson: ContentJson;
  changeNote?: string;
};

type CreateContentRevisionInput = {
  actorUserId: string;
  pageId: string;
  contentJson: ContentJson;
  changeNote?: string;
};

function isUniqueViolation(error: unknown, constraint: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505" &&
    "constraint" in error &&
    error.constraint === constraint
  );
}

async function lockContentPage(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  pageId: string,
) {
  const rows = await tx.execute(sql`
    select ${contentPage.id}
    from ${contentPage}
    where ${contentPage.id} = ${pageId}
    for update
  `);

  if (rows.rows.length === 0) {
    throw new Error("CONTENT_PAGE_NOT_FOUND");
  }
}

async function insertNextRevision(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  input: {
    pageId: string;
    actorUserId: string;
    contentJson: ContentJson;
    changeNote?: string;
  },
) {
  await lockContentPage(tx, input.pageId);

  const [versionRow] = await tx
    .select({
      maxVersion: max(contentPageRevision.versionNumber),
    })
    .from(contentPageRevision)
    .where(eq(contentPageRevision.pageId, input.pageId));

  const nextVersion = (versionRow?.maxVersion ?? 0) + 1;

  const [revision] = await tx
    .insert(contentPageRevision)
    .values({
      pageId: input.pageId,
      versionNumber: nextVersion,
      contentJson: input.contentJson,
      changeNote: input.changeNote,
      createdBy: input.actorUserId,
    })
    .returning();

  if (!revision) {
    throw new Error("CONTENT_REVISION_CREATE_FAILED");
  }

  await tx
    .update(contentPage)
    .set({
      updatedAt: new Date(),
      updatedBy: input.actorUserId,
    })
    .where(eq(contentPage.id, input.pageId));

  return revision;
}

export async function listContentPagesForAdmin(actorUserId: string) {
  await requireActiveAdminByUserId(actorUserId);

  return db
    .select({
      id: contentPage.id,
      slug: contentPage.slug,
      title: contentPage.title,
      visibility: contentPage.visibility,
      createdAt: contentPage.createdAt,
      updatedAt: contentPage.updatedAt,
      publishedRevisionId: contentPagePublication.revisionId,
      publishedAt: contentPagePublication.publishedAt,
    })
    .from(contentPage)
    .leftJoin(contentPagePublication, eq(contentPagePublication.pageId, contentPage.id))
    .orderBy(contentPage.slug);
}

export async function getContentPageHistoryForAdmin(input: {
  actorUserId: string;
  pageId: string;
}) {
  await requireActiveAdminByUserId(input.actorUserId);

  const [page] = await db
    .select({
      id: contentPage.id,
      slug: contentPage.slug,
      title: contentPage.title,
      visibility: contentPage.visibility,
      publishedRevisionId: contentPagePublication.revisionId,
      publishedAt: contentPagePublication.publishedAt,
    })
    .from(contentPage)
    .leftJoin(contentPagePublication, eq(contentPagePublication.pageId, contentPage.id))
    .where(eq(contentPage.id, input.pageId))
    .limit(1);

  if (!page) {
    throw new Error("CONTENT_PAGE_NOT_FOUND");
  }

  const revisions = await db
    .select({
      id: contentPageRevision.id,
      versionNumber: contentPageRevision.versionNumber,
      contentJson: contentPageRevision.contentJson,
      changeNote: contentPageRevision.changeNote,
      createdAt: contentPageRevision.createdAt,
      createdBy: contentPageRevision.createdBy,
    })
    .from(contentPageRevision)
    .where(eq(contentPageRevision.pageId, input.pageId))
    .orderBy(desc(contentPageRevision.versionNumber));

  return { page, revisions };
}

export async function createContentPageForAdmin(input: CreateContentPageInput) {
  await requireActiveAdminByUserId(input.actorUserId);

  try {
    return await db.transaction(async (tx) => {
      const [page] = await tx
        .insert(contentPage)
        .values({
          slug: input.slug,
          title: input.title,
          visibility: input.visibility,
          createdBy: input.actorUserId,
          updatedBy: input.actorUserId,
        })
        .returning();

      if (!page) {
        throw new Error("CONTENT_PAGE_CREATE_FAILED");
      }

      const [revision] = await tx
        .insert(contentPageRevision)
        .values({
          pageId: page.id,
          versionNumber: 1,
          contentJson: input.contentJson,
          changeNote: input.changeNote,
          createdBy: input.actorUserId,
        })
        .returning();

      if (!revision) {
        throw new Error("CONTENT_REVISION_CREATE_FAILED");
      }

      return { page, revision };
    });
  } catch (error) {
    if (isUniqueViolation(error, "content_page_slug_uq")) {
      throw new Error("CONTENT_PAGE_SLUG_EXISTS");
    }

    throw error;
  }
}

export async function createContentRevisionForAdmin(input: CreateContentRevisionInput) {
  await requireActiveAdminByUserId(input.actorUserId);

  return db.transaction((tx) => insertNextRevision(tx, input));
}

export async function publishContentRevisionForAdmin(input: {
  actorUserId: string;
  pageId: string;
  revisionId: string;
}) {
  await requireActiveAdminByUserId(input.actorUserId);

  return db.transaction(async (tx) => {
    await lockContentPage(tx, input.pageId);

    const [revision] = await tx
      .select({
        id: contentPageRevision.id,
      })
      .from(contentPageRevision)
      .where(
        and(
          eq(contentPageRevision.id, input.revisionId),
          eq(contentPageRevision.pageId, input.pageId),
        ),
      )
      .limit(1);

    if (!revision) {
      throw new Error("CONTENT_REVISION_NOT_FOUND");
    }

    const [publication] = await tx
      .insert(contentPagePublication)
      .values({
        pageId: input.pageId,
        revisionId: input.revisionId,
        publishedBy: input.actorUserId,
      })
      .onConflictDoUpdate({
        target: contentPagePublication.pageId,
        set: {
          revisionId: input.revisionId,
          publishedAt: new Date(),
          publishedBy: input.actorUserId,
        },
      })
      .returning();

    if (!publication) {
      throw new Error("CONTENT_PUBLICATION_FAILED");
    }

    return publication;
  });
}

export async function restoreContentRevisionForAdmin(input: {
  actorUserId: string;
  pageId: string;
  revisionId: string;
  changeNote?: string;
}) {
  await requireActiveAdminByUserId(input.actorUserId);

  return db.transaction(async (tx) => {
    await lockContentPage(tx, input.pageId);

    const [sourceRevision] = await tx
      .select({
        contentJson: contentPageRevision.contentJson,
        versionNumber: contentPageRevision.versionNumber,
      })
      .from(contentPageRevision)
      .where(
        and(
          eq(contentPageRevision.id, input.revisionId),
          eq(contentPageRevision.pageId, input.pageId),
        ),
      )
      .limit(1);

    if (!sourceRevision) {
      throw new Error("CONTENT_REVISION_NOT_FOUND");
    }

    const [versionRow] = await tx
      .select({
        maxVersion: max(contentPageRevision.versionNumber),
      })
      .from(contentPageRevision)
      .where(eq(contentPageRevision.pageId, input.pageId));

    const nextVersion = (versionRow?.maxVersion ?? 0) + 1;
    const restoreNote =
      input.changeNote ?? `Restored from revision ${sourceRevision.versionNumber}`;

    const [restoredRevision] = await tx
      .insert(contentPageRevision)
      .values({
        pageId: input.pageId,
        versionNumber: nextVersion,
        contentJson: sourceRevision.contentJson,
        changeNote: restoreNote,
        createdBy: input.actorUserId,
      })
      .returning();

    if (!restoredRevision) {
      throw new Error("CONTENT_REVISION_CREATE_FAILED");
    }

    await tx
      .update(contentPage)
      .set({
        updatedAt: new Date(),
        updatedBy: input.actorUserId,
      })
      .where(eq(contentPage.id, input.pageId));

    return restoredRevision;
  });
}
