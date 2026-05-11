import { NextResponse } from "next/server";
import { withSessionCookie } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail } from "@/lib/http";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idToken?: string; clientIp?: string };
    const idToken = body.idToken?.trim();
    const clientIpPayload = body.clientIp?.trim();

    if (!idToken) {
      return fail("ID token Firebase wajib diisi", 400);
    }

    const decoded = await verifyFirebaseIdToken(idToken);
    const email = decoded.email?.trim();

    if (!decoded.uid || !email) {
      return fail("Token Firebase tidak memiliki email/uid yang valid", 400);
    }

    const userAgent = request.headers.get("user-agent") || "";
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Edg")) browser = "Edge";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";
    
    if (userAgent.includes("Windows NT")) os = "Windows";
    else if (userAgent.includes("Mac OS X")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

    const deviceInfo = `${browser} on ${os}`;
    const forwardedFor = request.headers.get("x-forwarded-for");
    let ipAddress = "Unknown IP";
    
    if (clientIpPayload) {
      ipAddress = clientIpPayload;
    } else if (forwardedFor) {
      ipAddress = forwardedFor.split(",")[0].trim();
    }
    
    if (!ipAddress || ipAddress === "Unknown IP") {
      ipAddress = request.headers.get("cf-connecting-ip") || 
                  request.headers.get("x-real-ip") || 
                  request.headers.get("true-client-ip") || 
                  request.headers.get("x-client-ip") || 
                  "127.0.0.1";
    }

    const user = await db.upsertFirebaseUser(decoded.uid, email);
    const session = await db.createSession(user.id, deviceInfo, ipAddress);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
      },
    });

    return withSessionCookie(response, session.token);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Firebase session login gagal";
    return fail(message, 401);
  }
}
