import { db } from "@/lib/database";
import { KeyGenerator } from "@/lib/key-generator";
import type { OtpDeliveryResult } from "@/lib/telegram-service";
import { TelegramService } from "@/lib/telegram-service";
import { WorkerAutoSend } from "@/lib/worker-auto-send";

class SistemWebsite {
  private keyGenerator = new KeyGenerator();

  public telegramService = new TelegramService();

  private workerAutoSend = new WorkerAutoSend();

  displayDashboard(role: string): string {
    return role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
  }

  redirectPage(url: string): string {
    return url;
  }

  async requestOtp(userId: string, nomor: string): Promise<OtpDeliveryResult> {
    return this.telegramService.requestOTP(userId, nomor);
  }

  async verifyOtp(userId: string, otp: string): Promise<void> {
    await this.telegramService.verifyOTP(userId, otp);
  }

  async generateKeyLisensi(adminUserId: string, durasi: number) {
    const kode = this.keyGenerator.generateKey(durasi);
    return db.insertKey(adminUserId, kode, durasi);
  }

  async validateKey(userId: string, kode: string) {
    if (!this.keyGenerator.validateKey(kode)) {
      throw new Error("Format key tidak valid");
    }
    return db.validateAndUseKey(userId, kode);
  }

  async startWorker(userId: string): Promise<void> {
    const delay = await db.getDelay(userId);
    this.workerAutoSend.processQueue(userId, delay);
  }

  async stopWorker(userId: string): Promise<void> {
    await this.workerAutoSend.stopProcess(userId);
  }

  monitorSesi(userId: string): boolean {
    return this.workerAutoSend.isRunning(userId);
  }
}

declare global {
  var __sistemWebsite: SistemWebsite | undefined;
}

export const sistemWebsite = globalThis.__sistemWebsite ?? new SistemWebsite();

if (!globalThis.__sistemWebsite) {
  globalThis.__sistemWebsite = sistemWebsite;
}
