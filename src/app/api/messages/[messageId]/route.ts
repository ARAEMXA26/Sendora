import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ messageId: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const { messageId } = await context.params;
    const body = await request.json();

    const updated = await db.updateMessage(user.id, messageId, {
      isiPesan: body.isiPesan ?? body.messageInput ?? "",
      mediaUrl: body.mediaUrl ?? null,
      deliveryMode: body.deliveryMode ?? "NOW",
      msgTarget: body.msgTarget ?? null,
      scheduleDate: body.scheduleDate ?? null,
      scheduleTime: body.scheduleTime ?? null,
      intervalNum: body.intervalNum ? Number(body.intervalNum) : null,
      intervalUnit: body.intervalUnit ?? null,
      sendCount: body.sendCount ? Number(body.sendCount) : null,
      status: body.status ?? "AKTIF",
    });

    return ok({ message: updated });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal mengupdate pesan",
      400,
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    const { messageId } = await context.params;
    await db.deleteMessage(user.id, messageId);
    return ok({ ok: true });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menghapus teks",
      400,
    );
  }
}
