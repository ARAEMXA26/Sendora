import { requireSuperAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import * as os from "os";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireSuperAdmin();

    const [overview, users, keys, adminActivities, warnings, systemSettings] = await Promise.all([
      db.getOverview(),
      db.listUsers(),
      db.listKeys(),
      db.getAdminActivities(),
      db.getAdminWarnings(),
      db.getSystemSettings(),
    ]);

    // Calculate system stats
    const cpuUsage = Math.round((os.loadavg()[0] * 100) / os.cpus().length) || 0;
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsage = Math.round(((totalMem - freeMem) / totalMem) * 100) || 0;
    
    const systemStats = {
      cpuUsage: Math.min(cpuUsage, 100),
      memUsage,
      storageUsage: 61, // Mock
      activeRequests: 123 // Mock
    };

    return ok({
      overview,
      adminActivities,
      warnings,
      systemStats,
      systemSettings,
      users: users.map((item) => ({
        id: item.id,
        email: item.email,
        role: item.role,
        telegramVerified: item.telegramVerified,
        nomorTelegram: item.nomorTelegram,
        statusKey: item.statusKey,
      })),
      keys,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Forbidden", 403);
  }
}
