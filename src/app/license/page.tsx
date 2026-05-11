"use client";
import { Gem } from "lucide-react";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { api } from "@/lib/client-api";
import { resolveNextRoute } from "@/lib/flow";

interface MePayload {
  user: {
    role: "USER" | "SUPER_ADMIN";
    telegramVerified: boolean;
    statusKey: "NONE" | "ACTIVE" | "EXPIRED";
  };
}

export default function LicensePage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    api<MePayload>("/api/me")
      .then((me) => {
        if (!active) {
          return;
        }
        const destination = resolveNextRoute(me.user);
        if (destination !== "/license") {
          router.replace(destination);
        }
      })
      .catch(() => {
        router.replace("/auth");
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api<{ redirectTo: string }>(
        "/api/license/validate",
        {
          method: "POST",
          body: JSON.stringify({ key }),
        },
      );
      router.push(response.redirectTo);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Validasi key gagal",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell flex min-h-screen items-center py-10 md:py-16">
      <section className="glass-card mx-auto max-w-xl w-full rounded-3xl p-6 md:p-10 shadow-lg">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[var(--teal)] text-xs font-semibold uppercase tracking-wider mb-1">
              Aktivasi Produk
            </p>
            <h1 className="title-font mt-1 text-3xl text-[var(--ink)]">
              <Gem
                className="w-4 h-4 inline-block mr-1.5 text-slate-700"
                strokeWidth={2.5}
              />{" "}
              Masukkan Key Lisensi
            </h1>
          </div>
          <LogoutButton />
        </header>

        <p className="text-sm text-slate-600 mb-6">
          Silakan masukkan kunci lisensi aktif Anda untuk dapat mengakses fitur
          utama. Kunci dapat diperoleh dari kontak penyedia.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            required
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Contoh: BT-07D-AB12-CD34"
            className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 uppercase tracking-wide focus:border-[var(--teal)] transition-colors"
          />

          {error ? (
            <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white"
          >
            {loading ? "Memvalidasi..." : "Validasi Key"}
          </button>
        </form>
      </section>
    </main>
  );
}
