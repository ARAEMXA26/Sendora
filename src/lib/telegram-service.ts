import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { db } from "@/lib/database";

export type OtpDeliveryResult = {
  otp?: string;
  channel: "TELEGRAM" | "WEBSITE";
  message: string;
};

// You must set these in .env.local
const apiId = parseInt(process.env.TELEGRAM_API_ID || "123456", 10);
const apiHash = process.env.TELEGRAM_API_HASH || "invalid";

export class TelegramService {
  // Persistent clients for auto-send workers (keyed by userId)
  private persistentClients = new Map<string, TelegramClient>();

  private createClient(sessionString = "") {
    return new TelegramClient(
      new StringSession(sessionString),
      apiId,
      apiHash,
      {
        connectionRetries: 3,
        useWSS: true,
      },
    );
  }

  /**
   * Resolve a target string (numeric ID, username, URL) into a GramJS entity.
   * Returns the entity or null if resolution fails.
   */
  private async resolveEntity(client: TelegramClient, rawTarget: string) {
    let target = rawTarget.trim();

    // Format: "Nama Grup (1234567890)"
    const matchFetchAll = target.match(/\(([-]?[0-9]+)\)$/);
    if (matchFetchAll) {
      target = matchFetchAll[1];
    } else {
      // Format URL: "https://t.me/username"
      const matchUrl = target.match(/(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/i);
      if (matchUrl) {
        target = matchUrl[1];
      }
    }

    // Attempt to use getEntity directly
    try {
      if (/^[0-9]+$/.test(target)) {
        const candidates = [`-100${target}`, `-${target}`, target];
        for (const candidate of candidates) {
          try {
            const entity = await client.getEntity(candidate);
            if (entity) return entity;
          } catch { /* try next */ }
        }
      } else if (/^-[0-9]+$/.test(target)) {
        try {
          const entity = await client.getEntity(target);
          if (entity) return entity;
        } catch { /* ignore */ }
      } else {
        const entity = await client.getEntity(target);
        if (entity) return entity;
      }
    } catch { /* fallback to dialogs */ }

    // Fallback: Check dialogs for a matching title or ID
    try {
      const dialogs = await client.getDialogs();
      const dialog = dialogs.find(d => {
        if (!d.entity) return false;
        const idStr = d.entity.id.toString();
        // Match by exact title
        if (d.title === rawTarget.trim() || d.title?.toLowerCase() === rawTarget.trim().toLowerCase()) {
          return true;
        }
        // Match by ID (handling prefixes)
        if (idStr === target || idStr === target.replace(/^-100/, '').replace(/^-/, '')) {
          return true;
        }
        return false;
      });
      if (dialog && dialog.entity) {
        return dialog.entity;
      }
    } catch (e) {
      console.error("Error fetching dialogs in resolveEntity:", e);
    }

    return null;
  }

  /**
   * Get or create a persistent client for auto-send worker.
   * This avoids connecting/disconnecting for every single message.
   */
  async getWorkerClient(userId: string): Promise<TelegramClient | null> {
    // Check if we already have a connected client
    const existing = this.persistentClients.get(userId);
    if (existing) {
      try {
        // Check if still connected
        if (existing.connected) {
          return existing;
        }
        // Try to reconnect
        await existing.connect();
        return existing;
      } catch {
        // Stale client, remove it
        this.persistentClients.delete(userId);
      }
    }

    const user = await db.getUserById(userId);
    const telegramSession = user?.telegramSession;
    if (!telegramSession) return null;

    const client = this.createClient(telegramSession);
    try {
      await client.connect();
      this.persistentClients.set(userId, client);
      return client;
    } catch (err) {
      console.error(`Failed to connect worker client for ${userId}:`, err);
      return null;
    }
  }

  /**
   * Disconnect and remove persistent worker client.
   */
  async disconnectWorkerClient(userId: string): Promise<void> {
    const client = this.persistentClients.get(userId);
    if (client) {
      try {
        await client.disconnect();
      } catch { /* ignore */ }
      this.persistentClients.delete(userId);
    }
  }

  async requestOTP(userId: string, nomor: string): Promise<OtpDeliveryResult> {
    const target = nomor.trim();
    if (!target) throw new Error("Nomor Telegram wajib diisi");
    if (!/^\+?[0-9]+$/.test(target)) {
      throw new Error(
        "Harap masukkan format nomor telepon yang valid (contoh: +62812...)",
      );
    }

    if (apiHash === "invalid") {
      throw new Error(
        "TELEGRAM_API_ID dan TELEGRAM_API_HASH belum dikonfigurasi di .env",
      );
    }

    const client = this.createClient();
    await client.connect();

    try {
      const result = await client.sendCode(
        {
          apiId,
          apiHash,
        },
        target,
      );

      const sessionString = client.session.save() as unknown as string;
      await db.requestOtp(userId, target, result.phoneCodeHash, sessionString);

      return {
        channel: "TELEGRAM",
        message:
          "OTP telah dikirim via Telegram resmi. Silakan cek aplikasi Telegram Anda.",
      };
    } catch (e) {
      throw new Error(`Gagal meminta OTP Telegram: ${(e as Error).message}`);
    } finally {
      await client.disconnect();
    }
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    const session = await db.getOtpSession(userId);
    if (!session || !session.phoneCodeHash || !session.sessionString) {
      throw new Error(
        "Sesi Telegram belum diinisialisasi atau hilang. Harap request ulang OTP.",
      );
    }

    const client = this.createClient(session.sessionString);
    await client.connect();

    try {
      await client.invoke(
        new Api.auth.SignIn({
          phoneNumber: session.nomorTelegram,
          phoneCodeHash: session.phoneCodeHash,
          phoneCode: otp,
        }),
      );

      const sessionString = client.session.save() as unknown as string;
      await db.setTelegramSession(userId, sessionString);

      // Fetch user info to get username or fallback to first name
      const me = await client.getMe();
      const username = me?.username || me?.firstName || undefined;

      // Call original verify logic with username
      await db.verifyOtp(userId, otp, username);

      return true;
    } catch (e) {
      throw new Error(`Gagal verifikasi OTP Telegram: ${(e as Error).message}`);
    } finally {
      await client.disconnect();
    }
  }

  async fetchGroups(
    userId: string,
  ): Promise<Array<{ id: string; title: string; memberCount: number | null; photoUrl: string | null; onlineCount: number | null }>> {
    const user = await db.getUserById(userId);
    const telegramSession = user?.telegramSession;
    if (!telegramSession) throw new Error("Telegram session not found");

    const client = this.createClient(telegramSession);
    await client.connect();

    try {
      const dialogs = await client.getDialogs();
      const rawGroups = dialogs.filter((d) => d.isChannel || d.isGroup);

      const groups = [];
      const MAX_GROUPS = 50; // Just in case to avoid slow processing
      const limitedGroups = rawGroups.slice(0, MAX_GROUPS);
      for (const d of limitedGroups) {
         let photoUrl: string | null = null;
         let onlineCount: number | null = null;
         let memberCount: number | null = (d.entity as any)?.participantsCount || null;
         try {
             if (d.entity) {
                 const buffer = await client.downloadProfilePhoto(d.entity);
                 if (buffer && Buffer.isBuffer(buffer) && buffer.length > 0) {
                     // Store as base64 data URL — works on Vercel (no filesystem write needed)
                     photoUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
                 }
             }
         } catch(e) {}

         // Try fetch full channel info for online count
         try {
           if (d.entity) {
             const full = await client.invoke(new Api.channels.GetFullChannel({ channel: d.entity as any }));
             if (full.fullChat) {
                if (!memberCount) memberCount = (full.fullChat as any).participantsCount || null;
                onlineCount = (full.fullChat as any).onlineCount || null;
             }
           }
         } catch(e2) {
           try {
             const fullChat = await client.invoke(new Api.messages.GetFullChat({ chatId: d.entity as any }));
             if (fullChat.fullChat) {
                if (!memberCount) memberCount = (fullChat.fullChat as any).participantsCount || null;
                onlineCount = (fullChat.fullChat as any).onlineCount || null;
             }
           } catch(e3) {}
         }

         groups.push({
           id: d.entity?.id.toString() || "",
           title: d.title || "Unknown Group",
           memberCount,
           onlineCount,
           photoUrl
         });
      }

      return groups;
    } finally {
      await client.disconnect();
    }
  }

  async getGroupInfo(userId: string, groupName: string): Promise<{
    photoUrl: string | null;
    memberCount: number | null;
    onlineCount: number | null;
    title: string;
    id: string;
  } | null> {
    const user = await db.getUserById(userId);
    const telegramSession = user?.telegramSession;
    if (!telegramSession) return null;

    const client = this.createClient(telegramSession);
    await client.connect();

    try {
      let target = groupName.trim();
      const matchFetchAll = target.match(/\(([-]?[0-9]+)\)$/);
      if (matchFetchAll) {
        target = matchFetchAll[1];
      } else {
        const matchUrl = target.match(/(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/i);
        if (matchUrl) target = matchUrl[1];
      }

      if (/^[0-9]+$/.test(target)) target = `-100${target}`;

      let entity;
      try {
        entity = await client.getEntity(target);
      } catch (err: any) {
        if (/^-100[0-9]+$/.test(target)) {
          try {
             entity = await client.getEntity(target.replace('-100', '-'));
          } catch(e) {}
        }
      }
      
      if (!entity) return null;

      let photoUrl: string | null = null;
      let memberCount: number | null = null;
      let onlineCount: number | null = null;
      let title: string = (entity as any).title || groupName;

      try {
        const full = await client.invoke(new Api.channels.GetFullChannel({ channel: entity }));
        if (full.fullChat) {
          memberCount = (full.fullChat as any).participantsCount || null;
          onlineCount = (full.fullChat as any).onlineCount || null;
        }
      } catch (e) {
        try {
          const fullChat = await client.invoke(new Api.messages.GetFullChat({ chatId: entity as any }));
          if (fullChat.fullChat) {
             memberCount = (fullChat.fullChat as any).participantsCount || null;
             onlineCount = (fullChat.fullChat as any).onlineCount || null;
          }
        } catch (e2) {}
      }

      try {
        const buffer = await client.downloadProfilePhoto(entity);
        if (buffer && Buffer.isBuffer(buffer) && buffer.length > 0) {
          // Store as base64 data URL — works on Vercel (no filesystem write needed)
          photoUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        }
      } catch (e) {
        console.error("Failed to download profile photo:", e);
      }

      return { photoUrl, memberCount, onlineCount, title, id: (entity as any).id?.toString() || "" };
    } catch (error) {
      console.error(`Failed to fetch group info for ${groupName}:`, error);
      return null;
    } finally {
      await client.disconnect();
    }
  }

  /**
   * Send a message using a provided client (for worker reuse) or create a new one.
   * Properly resolves entities via getEntity before sending.
   * Handles FloodWaitError by throwing a typed error the worker can catch.
   */
  async sendMessage(
    rawInputTarget: string,
    teks: string,
    userId?: string,
    mediaUrl?: string | null,
    existingClient?: TelegramClient,
  ): Promise<boolean> {
    if (!rawInputTarget || (!teks && !mediaUrl) || !userId) return false;

    let client: TelegramClient;
    let shouldDisconnect = false;

    if (existingClient) {
      client = existingClient;
    } else {
      const user = await db.getUserById(userId);
      const telegramSession = user?.telegramSession;
      if (!telegramSession) return false;

      client = this.createClient(telegramSession);
      await client.connect();
      shouldDisconnect = true;
    }

    try {
      // Resolve the entity properly using getEntity
      const entity = await this.resolveEntity(client, rawInputTarget);

      if (!entity) {
        console.error(`Could not resolve entity for target: ${rawInputTarget}`);
        return false;
      }

      // Build send options
      const sendOptions: Record<string, any> = { message: teks };
      if (mediaUrl && typeof mediaUrl === "string" && !mediaUrl.startsWith("data:")) {
        // Only set file path for non-base64 media (base64 media not supported in auto-send)
        const path = await import("path");
        sendOptions.file = path.join(process.cwd(), 'public', mediaUrl);
      }

      await client.sendMessage(entity, sendOptions);
      return true;
    } catch (e: any) {
      // Handle FloodWaitError - Telegram rate limiting
      if (e.message?.includes("FloodWaitError") || e.message?.includes("FLOOD_WAIT") || e.seconds) {
        const waitSeconds = e.seconds || 30;
        console.warn(`FloodWaitError: need to wait ${waitSeconds}s for target ${rawInputTarget}`);
        const floodErr = new Error(`FLOOD_WAIT_${waitSeconds}`);
        (floodErr as any).floodWait = waitSeconds;
        throw floodErr;
      }

      console.error(`Gagal mengirim ke target ${rawInputTarget}:`, e);
      // Throw USER_KICKED only for explicit membership errors
      if (
        e.message === "USER_KICKED" ||
        e.message?.includes("CHANNEL_PRIVATE") ||
        e.message?.includes("USER_NOT_PARTICIPANT") ||
        e.message?.includes("CHAT_WRITE_FORBIDDEN")
      ) {
        throw new Error("USER_KICKED");
      }
      return false;
    } finally {
      if (shouldDisconnect) {
        await client.disconnect();
      }
    }
  }
}
