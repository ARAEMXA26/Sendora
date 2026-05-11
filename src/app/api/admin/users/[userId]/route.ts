import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { deleteFirebaseUser } from "@/lib/firebase-admin";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const admin = await requireSuperAdmin();

    const { userId } = await context.params;
    if (userId === admin.id) {
      return fail("Admin tidak bisa menghapus dirinya sendiri", 400);
    }

    // Ambil Firebase UID
    const targetUser = await db.getUserById(userId);

    await db.deleteUser(admin.id, userId);

    // Hapus juga dari Firebase agar harus register ulang
    if (targetUser?.firebaseUid) {
      await deleteFirebaseUser(targetUser.firebaseUid);
    }

    await db.insertAdminActivity(admin.id, `Super Admin menghapus user ${targetUser?.email || userId}`);

    return ok({ ok: true });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal hapus user",
      400,
    );
  }
}
