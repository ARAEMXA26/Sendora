import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireUser();
    await sistemWebsite.stopWorker(user.id);
    return ok({ ok: true, message: "Auto Send dihentikan" });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal stop auto send",
      400,
    );
  }
}
