import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as { key?: string };
    const key = body.key?.trim();

    if (!key) {
      return fail("Key lisensi wajib diisi", 400);
    }

    const result = await sistemWebsite.validateKey(user.id, key);
    return ok({
      key: result,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Validasi key gagal",
      400,
    );
  }
}
