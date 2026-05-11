import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    return ok({ delaySeconds: await db.getDelay(user.id) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { delaySeconds?: number };
    const delaySeconds = Number(body.delaySeconds);

    if (!Number.isFinite(delaySeconds) || delaySeconds < 1) {
      return fail("Delay minimal 1 detik", 400);
    }

    const settings = await db.setDelay(user.id, Math.floor(delaySeconds));
    return ok({ settings });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal set delay",
      400,
    );
  }
}
