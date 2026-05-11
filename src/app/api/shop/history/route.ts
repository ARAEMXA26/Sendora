import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();

    const history = await prisma.licenseKey.findMany({
      where: { usedByUserId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // Map history to include simulated prices based on duration
    const formattedHistory = history.map((key) => ({
      ...key,
      price: key.durasiHari === 30 ? 6000 : 3000,
      packageName: `${key.durasiHari} Day`,
    }));

    return ok({ history: formattedHistory });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal mengambil riwayat pembelian",
      400,
    );
  }
}
