import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { ok, fail } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const notifications = await db.listNotifications(user.id);
    return ok({ notifications });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unauthorized", 401);
  }
}

export async function PUT() {
  try {
    const user = await requireUser();
    await db.markNotificationsRead(user.id);
    return ok({ success: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed Action", 400);
  }
}
