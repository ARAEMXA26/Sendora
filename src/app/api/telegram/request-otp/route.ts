import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { nomorTelegram?: string };
    const nomorTelegram = body.nomorTelegram?.trim();

    if (!nomorTelegram) {
      return fail("Nomor Telegram wajib diisi", 400);
    }

    const result = await sistemWebsite.requestOtp(user.id, nomorTelegram);
    return ok({
      message: result.message,
      channel: result.channel,
      websiteOtp: result.channel === "WEBSITE" ? result.otp : undefined,
      expiresInSeconds: 120,
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal request OTP",
      401,
    );
  }
}
