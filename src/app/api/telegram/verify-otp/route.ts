import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { otp?: string };
    const otp = body.otp?.trim();

    if (!otp) {
      return fail("OTP wajib diisi", 400);
    }

    await sistemWebsite.verifyOtp(user.id, otp);
    const updated = await db.getUserById(user.id);

    return ok({
      role: updated?.role,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Verifikasi OTP gagal",
      400,
    );
  }
}
