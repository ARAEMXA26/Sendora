import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (user.role !== "SUPER_ADMIN" && user.statusKey !== "ACTIVE") {
      return fail("Lisensi belum aktif", 400);
    }

    const body = await req.json();
    const { 
      messageId,
      messageInput, 
      mediaUrl, 
      msgTarget, 
      deliveryMode, 
      scheduleDate, 
      scheduleTime, 
      intervalNum, 
      intervalUnit, 
      sendCount 
    } = body;

    if (!messageInput && !mediaUrl) {
      return fail("Teks pesan atau media diperlukan", 400);
    }

    // If messageId is provided, update existing message instead of creating new
    if (messageId) {
      await db.updateMessage(user.id, messageId, {
        isiPesan: messageInput || "",
        mediaUrl: mediaUrl || null,
        deliveryMode,
        msgTarget,
        scheduleDate: scheduleDate || null,
        scheduleTime: scheduleTime || null,
        intervalNum: intervalNum ? Number(intervalNum) : null,
        intervalUnit: intervalUnit || null,
        sendCount: sendCount ? Number(sendCount) : null,
      });
    } else {
      // Create new message with full config
      await prisma.messageText.create({
        data: {
          userId: user.id,
          isiPesan: messageInput || "",
          mediaUrl: mediaUrl || null,
          deliveryMode,
          msgTarget,
          scheduleDate: scheduleDate || null,
          scheduleTime: scheduleTime || null,
          intervalNum: intervalNum ? Number(intervalNum) : null,
          intervalUnit: intervalUnit || null,
          sendCount: sendCount ? Number(sendCount) : null,
        }
      });
    }

    // 2. Update Pengaturan di AutoSendStatus
    const autosend = await prisma.autoSendStatus.upsert({
      where: { userId: user.id },
      update: {
        deliveryMode,
        msgTarget,
        scheduleDate: scheduleDate || null,
        scheduleTime: scheduleTime || null,
        intervalNum: intervalNum ? Number(intervalNum) : null,
        intervalUnit: intervalUnit || null,
        sendCount: sendCount ? Number(sendCount) : null,
      },
      create: {
        userId: user.id,
        deliveryMode,
        msgTarget,
        scheduleDate: scheduleDate || null,
        scheduleTime: scheduleTime || null,
        intervalNum: intervalNum ? Number(intervalNum) : null,
        intervalUnit: intervalUnit || null,
        sendCount: sendCount ? Number(sendCount) : null,
      },
    });

    return ok({ message: messageId ? "Pesan berhasil diupdate" : "Setup berhasil disimpan", status: autosend });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menyimpan setup",
      400,
    );
  }
}