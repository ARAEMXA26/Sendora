import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { durationDays?: number };
    const durationDays = Number(body.durationDays);

    if (![7, 30].includes(durationDays)) {
      return fail("Durasi paket harus 7 atau 30 hari", 400);
    }

    // Find the first Super Admin to act as the creator of the key
    // The LicenseKey table requires a createdByUserId
    const admin = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" }
    });

    if (!admin) {
      return fail("Sistem belum siap menerima pembelian (Admin belum ada)", 500);
    }

    // Generate the key
    const key = await sistemWebsite.generateKeyLisensi(admin.id, durationDays);

    // Automatically use the key for the current user
    const activatedKey = await sistemWebsite.validateKey(user.id, key.kodeKey);

    return ok({ 
      message: "Pembelian berhasil dan paket telah diaktifkan!", 
      key: activatedKey 
    }, 201);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal memproses pembelian",
      400,
    );
  }
}
