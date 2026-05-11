import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  return requireSuperAdmin();
}

export async function GET() {
  try {
    await requireAdmin();
    return ok({ keys: await db.listKeys() });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = (await request.json()) as { durationDays?: number };
    const durationDays = Number(body.durationDays);

    if (![7, 30].includes(durationDays)) {
      return fail("Durasi key harus 7 atau 30 hari", 400);
    }

    const key = await sistemWebsite.generateKeyLisensi(admin.id, durationDays);
    await db.insertAdminActivity(admin.id, `Super Admin membuat key baru (${durationDays} Hari)`);
    return ok({ key }, 201);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal generate key",
      400,
    );
  }
}
