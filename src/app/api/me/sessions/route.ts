import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const [activeSessions, loginHistory] = await Promise.all([
      db.getActiveSessions(user.id),
      db.getLoginHistory(user.id),
    ]);

    const currentToken = (await cookies()).get("session")?.value;

    return ok({
      activeSessions: activeSessions.map(s => ({
        ...s,
        isCurrent: s.token === currentToken
      })),
      loginHistory,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Internal Server Error", 500);
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return fail("Unauthorized", 401);
    }

    const currentToken = (await cookies()).get("session")?.value;
    if (!currentToken) {
      return fail("No active session found", 400);
    }

    await db.deleteAllSessionsExceptCurrent(user.id, currentToken);

    return ok({ message: "Semua perangkat lain telah di-logout." });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Internal Server Error", 500);
  }
}
