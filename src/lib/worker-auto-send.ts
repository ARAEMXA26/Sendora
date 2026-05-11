import { db } from "@/lib/database";
import { sistemWebsite } from "@/lib/sistem-website";

export class WorkerAutoSend {
  private timers = new Map<string, NodeJS.Timeout>();

  async processQueue(userId: string, overrideDelay?: number): Promise<void> {
    if (this.timers.has(userId)) {
      return;
    }

    const config = await db.getAutoSendStatus(userId);
    const mode = config?.deliveryMode || "NOW";
    let safeDelay = Math.max(1, overrideDelay || config?.delaySeconds || 10);

    let groupIndex = 0;
    let textIndex = 0;
    let isTicking = false;
    let totalSentCount = 0;
    let floodPauseUntil = 0; // Timestamp until which we should wait (flood control)
    
    let targetCount = -1; // -1 means infinite/all
    if (mode === "NOW") {
       targetCount = config?.sendCount || -1;
    } else if (mode === "REPEAT") {
       targetCount = config?.sendCount || -1;
    }

    // Get a persistent client for reuse (avoid connect/disconnect per message)
    const telegramService = sistemWebsite.telegramService;
    const workerClient = await telegramService.getWorkerClient(userId);
    if (!workerClient) {
      console.error(`[Worker] Could not connect Telegram client for user ${userId}`);
      await db.setAutoSendRunning(userId, false);
      return;
    }

    const timer = setInterval(async () => {
      if (isTicking) {
        return;
      }

      // Respect flood wait
      if (Date.now() < floodPauseUntil) {
        return;
      }

      isTicking = true;

      try {
        const configNow = await db.getAutoSendStatus(userId);
        if (!configNow) {
           await this.stopProcess(userId);
           return;
        }
        
        const groups = await db.listGroups(userId);
        const texts = await db.listMessages(userId);

        if (groups.length === 0 || texts.length === 0) {
          console.log(`[Worker] No groups or texts found for user ${userId}, stopping.`);
          await db.setAutoSendRunning(userId, false);
          await this.stopProcess(userId);
          return;
        }

        const specificText = texts[textIndex % texts.length];

        let targetGroups = groups;
        if (specificText.msgTarget && specificText.msgTarget !== "ALL_GROUPS") {
           const selectedTargets = specificText.msgTarget.split(',');
           targetGroups = groups.filter(g => selectedTargets.includes(g.idGrup));
        }

        if (targetGroups.length === 0) {
           textIndex += 1;
           return; // skip to next text
        }

        const currentMode = specificText.deliveryMode || "NOW";

        // Schedule Check for this specific text
        if (currentMode === "SCHEDULE" && specificText.scheduleDate && specificText.scheduleTime) {
           const scheduleDt = new Date(`${specificText.scheduleDate}T${specificText.scheduleTime}`);
           if (new Date() < scheduleDt) {
              textIndex += 1;
              return; // skip this tick, try another text next tick
           }
        }

        const currentGroup = targetGroups[groupIndex % targetGroups.length];
        const sendTarget = currentGroup.providerGroupId || currentGroup.namaGrup;

        let sent = false;
        try {
          sent = await telegramService.sendMessage(
            sendTarget,
            specificText.isiPesan,
            userId,
            specificText.mediaUrl,
            workerClient,  // Reuse persistent client
          );
        } catch (err: any) {
          if (err.floodWait || err.message?.startsWith("FLOOD_WAIT_")) {
            const waitSec = err.floodWait || parseInt(err.message.split("_").pop() || "30", 10);
            console.warn(`[Worker] FloodWait: pausing ${waitSec}s for user ${userId}`);
            floodPauseUntil = Date.now() + (waitSec * 1000);
            isTicking = false;
            return;
          }

          if (err.message === "USER_KICKED") {
            await db.insertNotification(
              userId,
              `Gagal mengirim pesan ke "${currentGroup.namaGrup}". Anda tidak berada di group tersebut atau sudah di kick.`
            );
          }
          sent = false;
        }

        await db.insertLog({
          userId,
          groupId: currentGroup.idGrup,
          groupName: currentGroup.namaGrup,
          textId: specificText.idTeks,
          textPreview: specificText.isiPesan.slice(0, 80),
          status: sent ? "TERKIRIM" : "GAGAL",
        });

        groupIndex += 1;
        textIndex += 1;
        totalSentCount += 1;
        
        let targetCount = specificText.sendCount || -1;
        if (targetCount !== -1 && totalSentCount >= targetCount) {
          console.log(`[Worker] Target count ${targetCount} reached for user ${userId}`);
          await db.setAutoSendRunning(userId, false);
          await this.stopProcess(userId);
          return;
        }

        if (currentMode === "REPEAT" && specificText.intervalNum && specificText.intervalUnit) {
          if (groupIndex > 0 && groupIndex % targetGroups.length === 0) {
            let intervalMs = specificText.intervalNum * 60 * 1000;
            if (specificText.intervalUnit === "Jam") {
              intervalMs = specificText.intervalNum * 60 * 60 * 1000;
            } else if (specificText.intervalUnit === "Hari") {
              intervalMs = specificText.intervalNum * 24 * 60 * 60 * 1000;
            }
            floodPauseUntil = Date.now() + intervalMs;
          }
        }

      } catch (fatalError) {
        console.error("[Worker] tick error:", fatalError);
      } finally {
        isTicking = false;
      }
    }, safeDelay * 1000);

    this.timers.set(userId, timer);
    void db.setAutoSendRunning(userId, true);
  }

  async stopProcess(userId: string): Promise<void> {
    const timer = this.timers.get(userId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(userId);
    }
    await db.setAutoSendRunning(userId, false);

    // Disconnect the persistent Telegram client
    try {
      await sistemWebsite.telegramService.disconnectWorkerClient(userId);
    } catch { /* ignore */ }
  }

  isRunning(userId: string): boolean {
    return this.timers.has(userId);
  }
}
