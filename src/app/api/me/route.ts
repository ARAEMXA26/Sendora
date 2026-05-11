import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return fail("Unauthorized", 401);
  }

  const license = await db.getActiveLicense(user.id);
  const autoSend = await db.getAutoSendStatus(user.id);
  const telegramConnected = Boolean(
    user.telegramVerified && user.telegramSession,
  );

  return ok({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      telegramVerified: user.telegramVerified,
      telegramConnected,
      nomorTelegram: user.nomorTelegram,
      telegramUsername: user.telegramUsername,
      statusKey: user.statusKey,
      keyLisensiAktif: user.keyLisensiAktif,
    },
    license,
    autoSend,
  });
}
