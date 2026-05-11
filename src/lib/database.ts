import { randomUUID } from "crypto";
import {
  AuthProvider as PrismaAuthProvider,
  GroupSource as PrismaGroupSource,
  KeyStatus as PrismaKeyStatus,
  Role as PrismaRole,
  SendStatus as PrismaSendStatus,
  type AutoSendStatus as PrismaAutoSendStatus,
  type LicenseKey as PrismaLicenseKey,
  type MessageText as PrismaMessageText,
  type SendLog as PrismaSendLog,
  type Session as PrismaSession,
  type LoginHistory as PrismaLoginHistory,
  type TargetGroup as PrismaTargetGroup,
  type User as PrismaUser,
  type UserSetting as PrismaUserSetting,
} from "@prisma/client";
import type {
  AutoSendStatus,
  KeyLisensi,
  PengaturanUser,
  PesanTeks,
  SendLog,
  Session,
  LoginHistory,
  TargetGrup,
  User,
  SystemSetting,
} from "@/lib/models";
import { prisma } from "@/lib/prisma";

const superAdminPhone = process.env.SUPER_ADMIN_PHONE ?? "6288293680886";

function normalizePhone(raw?: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

class Database {
  private mapUser(user: PrismaUser): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password ?? undefined,
      firebaseUid: user.firebaseUid ?? undefined,
      authProvider: user.authProvider,
      role: user.role,
      nomorTelegram: user.nomorTelegram ?? undefined,
      telegramSession: user.telegramSession ?? undefined,
      telegramUsername: user.telegramUsername ?? undefined,
      telegramVerified: user.telegramVerified,
      keyLisensiAktif: user.keyLisensiAktif ?? undefined,
      statusKey: user.statusKey,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private mapSession(session: PrismaSession): Session {
    return {
      token: session.token,
      userId: session.userId,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      lastActive: session.lastActive.toISOString(),
      createdAt: session.createdAt.toISOString(),
    };
  }

  private mapLoginHistory(history: PrismaLoginHistory): LoginHistory {
    return {
      id: history.id,
      userId: history.userId,
      deviceInfo: history.deviceInfo,
      ipAddress: history.ipAddress,
      createdAt: history.createdAt.toISOString(),
    };
  }

  private mapTargetGroup(group: PrismaTargetGroup): TargetGrup {
    return {
      idGrup: group.id,
      userId: group.userId,
      namaGrup: group.namaGrup,
      source: group.source,
      photoUrl: group.photoUrl,
      memberCount: group.memberCount,
      onlineCount: group.onlineCount,
      providerGroupId: group.providerGroupId,
    };
  }

  private mapMessage(message: PrismaMessageText): PesanTeks {
    return {
      idTeks: message.id,
      userId: message.userId,
      isiPesan: message.isiPesan,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt.toISOString(),
      updatedAt: (message as any).updatedAt ? new Date((message as any).updatedAt).toISOString() : message.createdAt.toISOString(),
      deliveryMode: (message as any).deliveryMode || "NOW",
      msgTarget: (message as any).msgTarget || null,
      scheduleDate: (message as any).scheduleDate || null,
      scheduleTime: (message as any).scheduleTime || null,
      intervalNum: (message as any).intervalNum ?? null,
      intervalUnit: (message as any).intervalUnit || null,
      sendCount: (message as any).sendCount ?? null,
      status: (message as any).status || "AKTIF",
    };
  }

  private mapKey(key: PrismaLicenseKey): KeyLisensi {
    return {
      id: key.id,
      kodeKey: key.kodeKey,
      durasiHari: key.durasiHari,
      createdAt: key.createdAt.toISOString(),
      expiresAt: key.expiresAt.toISOString(),
      statusTerpakai: key.statusTerpakai,
      createdByUserId: key.createdByUserId,
      usedByUserId: key.usedByUserId ?? undefined,
    };
  }

  private mapLog(log: PrismaSendLog): SendLog {
    return {
      id: log.id,
      userId: log.userId,
      groupId: log.groupId,
      groupName: log.groupName,
      textId: log.textId,
      textPreview: log.textPreview,
      status: log.status,
      createdAt: log.createdAt.toISOString(),
    };
  }

  private mapStatus(status: PrismaAutoSendStatus): AutoSendStatus {
    return {
      userId: status.userId,
      delaySeconds: status.delaySeconds,
      deliveryMode: status.deliveryMode,
      msgTarget: status.msgTarget,
      scheduleDate: status.scheduleDate,
      scheduleTime: status.scheduleTime,
      intervalNum: status.intervalNum,
      intervalUnit: status.intervalUnit,
      sendCount: status.sendCount,
      isRunning: status.isRunning,
      startedAt: status.startedAt?.toISOString(),
      stoppedAt: status.stoppedAt?.toISOString(),
    };
  }

  private mapSetting(setting: PrismaUserSetting): PengaturanUser {
    return {
      userId: setting.userId,
      delaySeconds: setting.delaySeconds,
    };
  }

  async getSystemSettings(): Promise<SystemSetting> {
    const settings = await prisma.systemSetting.upsert({
      where: { id: "GLOBAL" },
      update: {},
      create: {
        id: "GLOBAL",
        maintenanceMode: false,
      },
    });
    return {
      id: settings.id,
      maintenanceMode: settings.maintenanceMode,
      updatedAt: settings.updatedAt.toISOString(),
    };
  }

  async updateMaintenanceMode(maintenanceMode: boolean): Promise<SystemSetting> {
    const settings = await prisma.systemSetting.upsert({
      where: { id: "GLOBAL" },
      update: { maintenanceMode },
      create: {
        id: "GLOBAL",
        maintenanceMode,
      },
    });
    return {
      id: settings.id,
      maintenanceMode: settings.maintenanceMode,
      updatedAt: settings.updatedAt.toISOString(),
    };
  }

  async insertUser(email: string, password: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (exists) {
      throw new Error("Email sudah terdaftar");
    }

    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password,
        authProvider: PrismaAuthProvider.LOCAL,
        role: PrismaRole.USER,
        statusKey: PrismaKeyStatus.NONE,
      },
    });

    await prisma.$transaction([
      prisma.autoSendStatus.upsert({
        where: { userId: created.id },
        update: {},
        create: { userId: created.id, delaySeconds: 10, isRunning: false },
      }),
      prisma.userSetting.upsert({
        where: { userId: created.id },
        update: {},
        create: { userId: created.id, delaySeconds: 10 },
      }),
    ]);

    return this.mapUser(created);
  }

  async upsertFirebaseUser(firebaseUid: string, email: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();

    const byUid = await prisma.user.findUnique({ where: { firebaseUid } });
    if (byUid) {
      const updated = await prisma.user.update({
        where: { id: byUid.id },
        data: {
          email: normalizedEmail,
          authProvider: PrismaAuthProvider.FIREBASE,
        },
      });
      return this.mapUser(updated);
    }

    const byEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (byEmail) {
      const updated = await prisma.user.update({
        where: { id: byEmail.id },
        data: {
          firebaseUid,
          authProvider: PrismaAuthProvider.FIREBASE,
        },
      });

      await prisma.$transaction([
        prisma.autoSendStatus.upsert({
          where: { userId: updated.id },
          update: {},
          create: { userId: updated.id, delaySeconds: 10, isRunning: false },
        }),
        prisma.userSetting.upsert({
          where: { userId: updated.id },
          update: {},
          create: { userId: updated.id, delaySeconds: 10 },
        }),
      ]);

      return this.mapUser(updated);
    }

    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        firebaseUid,
        authProvider: PrismaAuthProvider.FIREBASE,
        role: PrismaRole.USER,
        statusKey: PrismaKeyStatus.NONE,
      },
    });

    await prisma.$transaction([
      prisma.autoSendStatus.create({
        data: { userId: created.id, delaySeconds: 10, isRunning: false },
      }),
      prisma.userSetting.create({
        data: { userId: created.id, delaySeconds: 10 },
      }),
    ]);

    return this.mapUser(created);
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.password !== password) {
      throw new Error("Email atau password salah");
    }

    return this.mapUser(user);
  }

  async createSession(userId: string, deviceInfo?: string, ipAddress?: string): Promise<Session> {
    const token = randomUUID();
    
    await prisma.loginHistory.create({
      data: {
        userId,
        deviceInfo: deviceInfo || "Unknown Device",
        ipAddress: ipAddress || "Unknown IP",
      }
    });

    const session = await prisma.session.create({
      data: {
        token,
        userId,
        deviceInfo: deviceInfo || "Unknown Device",
        ipAddress: ipAddress || "Unknown IP",
      },
    });

    return this.mapSession(session);
  }

  async getActiveSessions(userId: string): Promise<Session[]> {
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' },
    });
    return sessions.map((s) => this.mapSession(s));
  }

  async getLoginHistory(userId: string): Promise<LoginHistory[]> {
    const history = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return history.map((h) => this.mapLoginHistory(h));
  }

  async deleteAllSessionsExceptCurrent(userId: string, currentToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        userId,
        token: { not: currentToken },
      },
    });
  }

  async getUserBySession(token?: string): Promise<User | undefined> {
    if (!token) {
      return undefined;
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return undefined;
    }

    return this.mapUser(session.user);
  }

  async clearSession(token?: string): Promise<void> {
    if (!token) {
      return;
    }
    await prisma.session.deleteMany({ where: { token } });
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? this.mapUser(user) : undefined;
  }

  async requestOtp(
    userId: string,
    nomorTelegram: string,
    phoneCodeHash: string = "",
    sessionString: string = "",
  ): Promise<string> {
    const otp = "EXTERNAL_OTP"; // OTP now handled by official TG MTProto
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await prisma.$transaction(async (tx) => {
      await tx.otpSession.deleteMany({ where: { userId } });
      await tx.otpSession.create({
        data: {
          userId,
          nomorTelegram,
          phoneCodeHash,
          sessionString,
          otp,
          expiresAt,
        },
      });
    });

    return phoneCodeHash;
  }

  async getOtpSession(userId: string) {
    return prisma.otpSession.findUnique({ where: { userId } });
  }

  async setTelegramSession(userId: string, sessionString: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { telegramSession: sessionString },
    });
  }

  async disconnectTelegram(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        telegramSession: null,
        telegramVerified: false,
        telegramUsername: null,
        nomorTelegram: null,
        statusKey: "NONE",
        keyLisensiAktif: null,
      },
    });
  }

  async verifyOtp(userId: string, otp: string, telegramUsername?: string): Promise<User> {
    const session = await prisma.otpSession.findUnique({ where: { userId } });
    if (!session) {
      throw new Error("Silakan request OTP terlebih dahulu");
    }

    if (session.expiresAt.getTime() < Date.now()) {
      throw new Error("OTP sudah kedaluwarsa");
    }

    if (session.otp !== "EXTERNAL_OTP" && session.otp !== otp) {
      throw new Error("OTP tidak valid");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const role =
        normalizePhone(session.nomorTelegram) ===
        normalizePhone(superAdminPhone)
          ? PrismaRole.SUPER_ADMIN
          : PrismaRole.USER;

      const existingActiveKey = await tx.licenseKey.findFirst({
        where: {
          usedByNomorTelegram: session.nomorTelegram,
          expiresAt: { gt: new Date() },
          statusTerpakai: true
        },
        orderBy: { expiresAt: 'desc' }
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          nomorTelegram: session.nomorTelegram,
          telegramUsername: telegramUsername || null,
          telegramVerified: true,
          role,
          statusKey: existingActiveKey ? "ACTIVE" : "NONE",
          keyLisensiAktif: existingActiveKey ? existingActiveKey.kodeKey : null,
        },
      });

      await tx.otpSession.deleteMany({ where: { userId } });
      return user;
    });

    return this.mapUser(updated);
  }

  async insertKey(
    createdByUserId: string,
    kodeKey: string,
    durasiHari: number,
  ): Promise<KeyLisensi> {
    const expiresAt = new Date(Date.now() + durasiHari * 24 * 60 * 60 * 1000);

    const key = await prisma.licenseKey.create({
      data: {
        kodeKey,
        durasiHari,
        expiresAt,
        statusTerpakai: false,
        createdByUserId,
      },
    });

    return this.mapKey(key);
  }

  async validateAndUseKey(
    userId: string,
    kodeKey: string,
  ): Promise<KeyLisensi> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const key = await prisma.licenseKey.findUnique({ where: { kodeKey } });
    if (!key) {
      throw new Error("Key tidak ditemukan");
    }
    if (key.statusTerpakai) {
      throw new Error("Key sudah terpakai");
    }
    // Removed the check for key.expiresAt here so keys don't expire before being used.
    // The actual expiration date will be set from the moment of validation.

    const updated = await prisma.$transaction(async (tx) => {
      const updateCount = await tx.licenseKey.updateMany({
        where: {
          id: key.id,
          statusTerpakai: false,
        },
        data: {
          statusTerpakai: true,
          usedByUserId: userId,
          // Only record Telegram number if available
          usedByNomorTelegram: user.nomorTelegram ?? null,
          expiresAt: new Date(Date.now() + key.durasiHari * 24 * 60 * 60 * 1000),
        },
      });

      if (updateCount.count === 0) {
        throw new Error("Key sudah terpakai");
      }

      const updatedKey = await tx.licenseKey.findUnique({
        where: { id: key.id },
      });
      if (!updatedKey) {
        throw new Error("Key tidak ditemukan");
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          keyLisensiAktif: updatedKey.kodeKey,
          statusKey: PrismaKeyStatus.ACTIVE,
        },
      });

      return updatedKey;
    });

    return this.mapKey(updated);
  }

  async listKeys(): Promise<KeyLisensi[]> {
    const keys = await prisma.licenseKey.findMany({
      orderBy: { createdAt: "desc" },
    });
    return keys.map((item) => this.mapKey(item));
  }

  async getActiveLicense(userId: string): Promise<KeyLisensi | undefined> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { keyLisensiAktif: true, role: true },
    });

    let key = null;

    if (user?.keyLisensiAktif) {
      key = await prisma.licenseKey.findUnique({
        where: { kodeKey: user.keyLisensiAktif },
      });
    }

    if (!key) {
      const fallbackKeys = await prisma.licenseKey.findMany({
        where: { usedByUserId: userId },
        orderBy: { expiresAt: 'desc' },
      });
      key = fallbackKeys.find(k => k.expiresAt.getTime() > Date.now()) || null;
      if (key) {
        await prisma.user.update({
          where: { id: userId },
          data: { keyLisensiAktif: key.kodeKey, statusKey: "ACTIVE" }
        });
      }
    }

    if (key) {
      // Check for expiration
      const now = new Date();
      if (key.expiresAt.getTime() < now.getTime() && user?.role !== "SUPER_ADMIN") {
        // Mark as EXPIRED automatically
        await prisma.user.update({
          where: { id: userId },
          data: { statusKey: "EXPIRED" }
        });
        
        // Return key with expired status simulated
        return this.mapKey({ ...key, statusTerpakai: true });
      }
    }

    return key ? this.mapKey(key) : undefined;
  }

  async insertGroup(
    userId: string,
    namaGrup: string,
    source: "MANUAL" | "FETCH_ALL",
    photoUrl?: string | null,
    memberCount?: number | null,
    onlineCount?: number | null,
    providerGroupId?: string | null,
  ): Promise<TargetGrup> {
    const group = await prisma.targetGroup.create({
      data: {
        userId,
        namaGrup,
        source:
          source === "FETCH_ALL"
            ? PrismaGroupSource.FETCH_ALL
            : PrismaGroupSource.MANUAL,
        photoUrl,
        memberCount,
        onlineCount,
        providerGroupId,
      },
    });

    return this.mapTargetGroup(group);
  }

  async deleteGroup(userId: string, groupId: string): Promise<void> {
    await prisma.targetGroup.deleteMany({
      where: {
        userId,
        id: groupId,
      },
    });
  }

  async deleteAllGroups(userId: string): Promise<number> {
    const result = await prisma.targetGroup.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  async listGroups(userId: string): Promise<TargetGrup[]> {
    const groups = await prisma.targetGroup.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return groups.map((item) => this.mapTargetGroup(item));
  }

  async insertMessage(userId: string, isiPesan: string, mediaUrl?: string): Promise<PesanTeks> {
    const message = await prisma.messageText.create({
      data: {
        userId,
        isiPesan,
        mediaUrl,
      },
    });

    return this.mapMessage(message);
  }

  async updateMessage(
    userId: string,
    messageId: string,
    data: {
      isiPesan?: string;
      mediaUrl?: string | null;
      deliveryMode?: string;
      msgTarget?: string | null;
      scheduleDate?: string | null;
      scheduleTime?: string | null;
      intervalNum?: number | null;
      intervalUnit?: string | null;
      sendCount?: number | null;
      status?: string;
    },
  ): Promise<PesanTeks> {
    const message = await prisma.messageText.updateMany({
      where: { id: messageId, userId },
      data: {
        isiPesan: data.isiPesan,
        mediaUrl: data.mediaUrl,
        deliveryMode: data.deliveryMode,
        msgTarget: data.msgTarget,
        scheduleDate: data.scheduleDate,
        scheduleTime: data.scheduleTime,
        intervalNum: data.intervalNum,
        intervalUnit: data.intervalUnit,
        sendCount: data.sendCount,
        status: data.status,
      },
    });

    if (message.count === 0) {
      throw new Error("Pesan tidak ditemukan");
    }

    const updated = await prisma.messageText.findFirst({
      where: { id: messageId, userId },
    });

    if (!updated) {
      throw new Error("Pesan tidak ditemukan setelah update");
    }

    return this.mapMessage(updated);
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    await prisma.messageText.deleteMany({
      where: {
        userId,
        id: messageId,
      },
    });
  }

  async deleteAllMessages(userId: string): Promise<number> {
    const result = await prisma.messageText.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  async listMessages(userId: string): Promise<PesanTeks[]> {
    const messages = await prisma.messageText.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return messages.map((item) => this.mapMessage(item));
  }

  async setDelay(
    userId: string,
    delaySeconds: number,
  ): Promise<PengaturanUser> {
    const normalizedDelay = Math.max(1, Math.floor(delaySeconds));

    const [settings] = await prisma.$transaction([
      prisma.userSetting.upsert({
        where: { userId },
        update: { delaySeconds: normalizedDelay },
        create: { userId, delaySeconds: normalizedDelay },
      }),
      prisma.autoSendStatus.upsert({
        where: { userId },
        update: { delaySeconds: normalizedDelay },
        create: {
          userId,
          delaySeconds: normalizedDelay,
          isRunning: false,
        },
      }),
    ]);

    return this.mapSetting(settings);
  }

  async getDelay(userId: string): Promise<number> {
    const setting = await prisma.userSetting.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        delaySeconds: 10,
      },
    });

    return setting.delaySeconds;
  }

  async setAutoSendRunning(
    userId: string,
    isRunning: boolean,
  ): Promise<AutoSendStatus> {
    const now = new Date();

    const status = await prisma.$transaction(async (tx) => {
      const setting = await tx.userSetting.upsert({
        where: { userId },
        update: {},
        create: { userId, delaySeconds: 10 },
      });

      return tx.autoSendStatus.upsert({
        where: { userId },
        update: {
          delaySeconds: setting.delaySeconds,
          isRunning,
          startedAt: isRunning ? now : null,
          stoppedAt: isRunning ? null : now,
        },
        create: {
          userId,
          delaySeconds: setting.delaySeconds,
          isRunning,
          startedAt: isRunning ? now : null,
          stoppedAt: isRunning ? null : now,
        },
      });
    });

    return this.mapStatus(status);
  }

  async getAutoSendStatus(userId: string): Promise<AutoSendStatus> {
    const status = await prisma.$transaction(async (tx) => {
      const setting = await tx.userSetting.upsert({
        where: { userId },
        update: {},
        create: { userId, delaySeconds: 10 },
      });

      return tx.autoSendStatus.upsert({
        where: { userId },
        update: { delaySeconds: setting.delaySeconds },
        create: {
          userId,
          delaySeconds: setting.delaySeconds,
          isRunning: false,
        },
      });
    });

    return this.mapStatus(status);
  }

  async insertLog(log: Omit<SendLog, "id" | "createdAt">): Promise<SendLog> {
    const created = await prisma.sendLog.create({
      data: {
        userId: log.userId,
        groupId: log.groupId,
        groupName: log.groupName,
        textId: log.textId,
        textPreview: log.textPreview,
        status: log.status as PrismaSendStatus,
      },
    });

    return this.mapLog(created);
  }

  async insertNotification(userId: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  }

  async listNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async markNotificationsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  async listLogs(userId: string): Promise<SendLog[]> {
    const logs = await prisma.sendLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 80,
    });

    return logs.map((item) => this.mapLog(item));
  }

  async getLogStats(userId: string): Promise<{ total: number; terkirim: number }> {
    const total = await prisma.sendLog.count({ where: { userId } });
    const terkirim = await prisma.sendLog.count({
      where: { userId, status: "TERKIRIM" },
    });
    return { total, terkirim };
  }

  async getDashboardStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [sent, success, failed] = await prisma.$transaction([
      prisma.sendLog.count({ where: { userId, createdAt: { gte: today } } }),
      prisma.sendLog.count({ where: { userId, status: "TERKIRIM", createdAt: { gte: today } } }),
      prisma.sendLog.count({ where: { userId, status: "GAGAL", createdAt: { gte: today } } }),
    ]);

    const successRate = sent > 0 ? Math.round((success / sent) * 100) : 0;

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    
    const last7DaysLogs = await prisma.sendLog.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
        status: "TERKIRIM"
      },
      select: { createdAt: true }
    });

    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString("id-ID", { year: "numeric", month: "numeric", day: "numeric" });
      return {
        label: d.toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
        dateStr,
        count: 0
      };
    });

    last7DaysLogs.forEach(log => {
      const logDateStr = new Date(log.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "numeric", day: "numeric" });
      const match = chartData.find(d => d.dateStr === logDateStr);
      if (match) match.count++;
    });

    const groupDistributionRaw = await prisma.sendLog.groupBy({
      by: ['groupName'],
      where: { userId, status: "TERKIRIM" },
      _count: { _all: true },
      orderBy: { _count: { groupName: 'desc' } },
      take: 4
    });
    
    const totalSuccess = await prisma.sendLog.count({
      where: { userId, status: "TERKIRIM" }
    });

    const groupDistribution = groupDistributionRaw.map(g => ({
      name: g.groupName,
      count: g._count._all,
      percentage: totalSuccess > 0 ? Math.round((g._count._all / totalSuccess) * 100) : 0
    }));

    return {
      todayStats: { sent, success, failed, successRate },
      chartData,
      groupDistribution
    };
  }

  async listUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map((item) => this.mapUser(item));
  }

  async deleteUser(adminUserId: string, userId: string): Promise<void> {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: { role: true },
    });

    if (!admin || admin.role !== PrismaRole.SUPER_ADMIN) {
      throw new Error("Forbidden");
    }

    await prisma.user.deleteMany({ where: { id: userId } });
  }

  async deleteKey(adminUserId: string, keyId: string): Promise<void> {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: { role: true },
    });

    if (!admin || admin.role !== PrismaRole.SUPER_ADMIN) {
      throw new Error("Forbidden");
    }

    await prisma.licenseKey.deleteMany({ where: { id: keyId } });
  }

  async getOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [users, keys, keysUsed, runningJobs, totalLogs, activeUsers, errorsToday] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.licenseKey.count(),
        prisma.licenseKey.count({ where: { statusTerpakai: true } }),
        prisma.autoSendStatus.count({ where: { isRunning: true } }),
        prisma.sendLog.count(),
        prisma.user.count({ where: { statusKey: "ACTIVE" } }),
        prisma.sendLog.count({ where: { status: "GAGAL", createdAt: { gte: today } } }),
      ]);

    return {
      users,
      keys,
      keysUsed,
      runningJobs,
      totalLogs,
      activeUsers,
      errorsToday,
      superAdminPhone,
    };
  }

  async insertAdminActivity(userId: string, action: string) {
    return prisma.adminActivity.create({
      data: {
        userId,
        action,
      }
    });
  }

  async getAdminActivities() {
    const activities = await prisma.adminActivity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { email: true, role: true } }
      }
    });
    return activities;
  }

  async getAdminWarnings() {
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const [expiringKeys, unverifiedUsers, heavyDatabase] = await prisma.$transaction([
      prisma.licenseKey.count({
        where: {
          statusTerpakai: true,
          expiresAt: { gt: now, lte: in3Days }
        }
      }),
      prisma.user.count({
        where: { telegramVerified: false }
      }),
      prisma.sendLog.count()
    ]);

    const warnings = [];
    if (expiringKeys > 0) {
      warnings.push({ type: 'key', message: `${expiringKeys} key lisensi akan expired dalam 3 hari.`, sub: "Segera perpanjang atau regenerate." });
    }
    if (unverifiedUsers > 0) {
      warnings.push({ type: 'user', message: `${unverifiedUsers} user belum verifikasi Telegram.`, sub: "Periksa dan verifikasi akun tersebut." });
    }
    if (heavyDatabase > 100000) {
      warnings.push({ type: 'database', message: "Database hampir penuh (85%).", sub: "Segera lakukan pembersihan data." });
    }

    return warnings;
  }
}

declare global {
  var __botTeleDb: Database | undefined;
}

const existingDb = globalThis.__botTeleDb;
const needsDbUpgrade =
  !existingDb ||
  typeof (existingDb as Partial<Database>).deleteAllGroups !== "function" ||
  typeof (existingDb as Partial<Database>).deleteAllMessages !== "function" ||
  typeof (existingDb as Partial<Database>).getDashboardStats !== "function" ||
  typeof (existingDb as Partial<Database>).getAdminActivities !== "function" ||
  typeof (existingDb as Partial<Database>).getActiveSessions !== "function" ||
  typeof (existingDb as Partial<Database>).updateMessage !== "function";

// In dev HMR, keep singleton but recreate it if the old instance misses new methods.
if (needsDbUpgrade) {
  globalThis.__botTeleDb = new Database();
}

export const db = globalThis.__botTeleDb as Database;
