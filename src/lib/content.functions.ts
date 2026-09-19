import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "./auth.server";
import {
  createContentPageForAdmin,
  createContentRevisionForAdmin,
  getContentPageHistoryForAdmin,
  listContentPagesForAdmin,
  publishContentRevisionForAdmin,
  restoreContentRevisionForAdmin,
} from "./content.service";

async function requireSessionUserId() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }

  return session.user.id;
}

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const changeNoteSchema = z.string().trim().min(1).max(500).optional();

const pageIdInput = z.object({
  pageId: z.uuid(),
});

const createPageInput = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(200),
  visibility: z.enum(["public", "protected"]),
  contentJson: z.json(),
  changeNote: changeNoteSchema,
});

const createRevisionInput = z.object({
  pageId: z.uuid(),
  contentJson: z.json(),
  changeNote: changeNoteSchema,
});

const revisionActionInput = z.object({
  pageId: z.uuid(),
  revisionId: z.uuid(),
});

const restoreRevisionInput = revisionActionInput.extend({
  changeNote: changeNoteSchema,
});

export const listContentPages = createServerFn({ method: "GET" }).handler(async () => {
  const actorUserId = await requireSessionUserId();
  return listContentPagesForAdmin(actorUserId);
});

export const getContentPageHistory = createServerFn({ method: "GET" })
  .validator(pageIdInput)
  .handler(async ({ data }) => {
    const actorUserId = await requireSessionUserId();

    return getContentPageHistoryForAdmin({
      actorUserId,
      pageId: data.pageId,
    });
  });

export const createContentPage = createServerFn({ method: "POST" })
  .validator(createPageInput)
  .handler(async ({ data }) => {
    const actorUserId = await requireSessionUserId();

    return createContentPageForAdmin({
      actorUserId,
      slug: data.slug,
      title: data.title,
      visibility: data.visibility,
      contentJson: data.contentJson,
      changeNote: data.changeNote,
    });
  });

export const createContentRevision = createServerFn({ method: "POST" })
  .validator(createRevisionInput)
  .handler(async ({ data }) => {
    const actorUserId = await requireSessionUserId();

    return createContentRevisionForAdmin({
      actorUserId,
      pageId: data.pageId,
      contentJson: data.contentJson,
      changeNote: data.changeNote,
    });
  });

export const publishContentRevision = createServerFn({ method: "POST" })
  .validator(revisionActionInput)
  .handler(async ({ data }) => {
    const actorUserId = await requireSessionUserId();

    return publishContentRevisionForAdmin({
      actorUserId,
      pageId: data.pageId,
      revisionId: data.revisionId,
    });
  });

export const restoreContentRevision = createServerFn({ method: "POST" })
  .validator(restoreRevisionInput)
  .handler(async ({ data }) => {
    const actorUserId = await requireSessionUserId();

    return restoreContentRevisionForAdmin({
      actorUserId,
      pageId: data.pageId,
      revisionId: data.revisionId,
      changeNote: data.changeNote,
    });
  });
