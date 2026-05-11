import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    return ok({ messages: await db.listMessages(user.id) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { text?: string; mediaUrl?: string };
    const text = body.text?.trim();

    if (!text && !body.mediaUrl) {
      return fail("Teks pesan atau media wajib diisi", 400);
    }

    const message = await db.insertMessage(user.id, text || "", body.mediaUrl);
    return ok({ message }, 201);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menambah teks",
      400,
    );
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();
    const deletedCount = await db.deleteAllMessages(user.id);
    return ok({ ok: true, deletedCount });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menghapus semua teks",
      400,
    );
  }
}
