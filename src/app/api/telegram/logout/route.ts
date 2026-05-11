import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return fail("Unauthorized", 401);
  }

  // Hentikan worker terlebih dahulu jika sedang berjalan
  await sistemWebsite.stopWorker(user.id);
  
  // Hapus session Telegram & reset status Telegram dari database
  await db.disconnectTelegram(user.id);

  return ok({ message: "Telegram account disconnected successfully" });
}
