-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('LOCAL', 'FIREBASE');

-- CreateEnum
CREATE TYPE "public"."KeyStatus" AS ENUM ('NONE', 'ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."GroupSource" AS ENUM ('MANUAL', 'FETCH_ALL');

-- CreateEnum
CREATE TYPE "public"."SendStatus" AS ENUM ('TERKIRIM', 'GAGAL');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firebaseUid" TEXT,
    "authProvider" "public"."AuthProvider" NOT NULL DEFAULT 'FIREBASE',
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "nomorTelegram" TEXT,
    "telegramVerified" BOOLEAN NOT NULL DEFAULT false,
    "keyLisensiAktif" TEXT,
    "statusKey" "public"."KeyStatus" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "token" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "public"."OtpSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "nomorTelegram" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TargetGroup" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "namaGrup" TEXT NOT NULL,
    "source" "public"."GroupSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TargetGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageText" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isiPesan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LicenseKey" (
    "id" UUID NOT NULL,
    "kodeKey" TEXT NOT NULL,
    "durasiHari" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "statusTerpakai" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" UUID NOT NULL,
    "usedByUserId" UUID,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SendLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "groupId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    "textPreview" TEXT NOT NULL,
    "status" "public"."SendStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SendLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AutoSendStatus" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "delaySeconds" INTEGER NOT NULL DEFAULT 10,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "stoppedAt" TIMESTAMP(3),

    CONSTRAINT "AutoSendStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSetting" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "delaySeconds" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "public"."User"("firebaseUid");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OtpSession_userId_key" ON "public"."OtpSession"("userId");

-- CreateIndex
CREATE INDEX "TargetGroup_userId_idx" ON "public"."TargetGroup"("userId");

-- CreateIndex
CREATE INDEX "MessageText_userId_idx" ON "public"."MessageText"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_kodeKey_key" ON "public"."LicenseKey"("kodeKey");

-- CreateIndex
CREATE INDEX "LicenseKey_createdByUserId_idx" ON "public"."LicenseKey"("createdByUserId");

-- CreateIndex
CREATE INDEX "LicenseKey_usedByUserId_idx" ON "public"."LicenseKey"("usedByUserId");

-- CreateIndex
CREATE INDEX "SendLog_userId_idx" ON "public"."SendLog"("userId");

-- CreateIndex
CREATE INDEX "SendLog_createdAt_idx" ON "public"."SendLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AutoSendStatus_userId_key" ON "public"."AutoSendStatus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_userId_key" ON "public"."UserSetting"("userId");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OtpSession" ADD CONSTRAINT "OtpSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TargetGroup" ADD CONSTRAINT "TargetGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageText" ADD CONSTRAINT "MessageText_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LicenseKey" ADD CONSTRAINT "LicenseKey_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LicenseKey" ADD CONSTRAINT "LicenseKey_usedByUserId_fkey" FOREIGN KEY ("usedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SendLog" ADD CONSTRAINT "SendLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AutoSendStatus" ADD CONSTRAINT "AutoSendStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

