import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import type { User } from "@/lib/models";

export const SESSION_COOKIE = "bt_session";

export async function getCurrentUser(): Promise<User | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return db.getUserBySession(token);
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

function normalizePhone(raw?: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

export async function requireSuperAdmin(): Promise<User> {
  const user = await requireUser();
  const configuredAdminPhone = normalizePhone(
    process.env.SUPER_ADMIN_PHONE ?? "6288293680886",
  );
  const userPhone = normalizePhone(user.nomorTelegram);

  const isValidAdmin =
    user.role === "SUPER_ADMIN" &&
    user.telegramVerified &&
    Boolean(user.telegramSession) &&
    userPhone === configuredAdminPhone;

  if (!isValidAdmin) {
    throw new Error("Forbidden");
  }

  return user;
}

export function withSessionCookie(
  response: NextResponse,
  token: string,
): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export async function clearSessionCookie(
  response: NextResponse,
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  await db.clearSession(token);

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
