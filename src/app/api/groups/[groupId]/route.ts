import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ groupId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const { groupId } = await context.params;
    await db.deleteGroup(user.id, groupId);
    return ok({ ok: true });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menghapus group",
      400,
    );
  }
}
