import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const [logs, status, stats, dashboardStats] = await Promise.all([
      db.listLogs(user.id),
      db.getAutoSendStatus(user.id),
      db.getLogStats(user.id),
      db.getDashboardStats(user.id),
    ]);

    return ok({
      logs,
      status,
      stats,
      dashboardStats,
      isRunning: sistemWebsite.monitorSesi(user.id),
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unauthorized", 401);
  }
}
