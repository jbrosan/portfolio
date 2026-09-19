import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { changeUserAccessStatusForAdmin, listManagedUsersForAdmin } from "./admin-access.service";
import { auth } from "./auth.server";

async function requireSessionUserId() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }

  return session.user.id;
}

export const listManagedUsers = createServerFn({ method: "GET" }).handler(async () => {
  const actorUserId = await requireSessionUserId();
  return listManagedUsersForAdmin(actorUserId);
});

const changeStatusInput = z.object({
  userId: z.uuid(),
  status: z.enum(["active", "disabled"]),
});

export const changeUserAccessStatus = createServerFn({ method: "POST" })
  .validator(changeStatusInput)
  .handler(async ({ data }) => {
    const actorUserId = await requireSessionUserId();

    return changeUserAccessStatusForAdmin({
      actorUserId,
      userId: data.userId,
      status: data.status,
    });
  });
