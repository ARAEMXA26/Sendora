import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireUser();

    if (!user.telegramVerified) {
      return fail("Akun Telegram belum diverifikasi", 400);
    }
    if (user.role !== "SUPER_ADMIN" && user.statusKey !== "ACTIVE") {
      return fail("Lisensi belum aktif", 400);
    }

    const groups = await db.listGroups(user.id);
    const texts = await db.listMessages(user.id);

    if (groups.length === 0 || texts.length === 0) {
      return fail("Konfigurasi belum lengkap: group dan teks wajib diisi", 400);
    }

    if (sistemWebsite.monitorSesi(user.id)) {
      return fail("Auto Send sudah berjalan", 409);
    }

    await sistemWebsite.startWorker(user.id);
    return ok({
      status: await db.getAutoSendStatus(user.id),
      message: "Auto Send berjalan di background",
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal start auto send",
      400,
    );
  }
}
