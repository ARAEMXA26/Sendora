import { fail } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST() {
  return fail(
    "Endpoint lokal dinonaktifkan. Gunakan Firebase login dan /api/auth/firebase-session",
    410,
  );
}
