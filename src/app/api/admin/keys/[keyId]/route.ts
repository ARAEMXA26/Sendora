import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ keyId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const admin = await requireSuperAdmin();

    const { keyId } = await context.params;
    await db.deleteKey(admin.id, keyId);
    await db.insertAdminActivity(admin.id, `Super Admin menghapus key lisensi`);
    return ok({ ok: true });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal hapus key",
      400,
    );
  }
}
