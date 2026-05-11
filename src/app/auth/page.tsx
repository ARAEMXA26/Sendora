"use client";
import { Sparkles, Lock } from "lucide-react";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type AuthError,
} from "firebase/auth";
import { api } from "@/lib/client-api";
import {
  getFirebaseClientAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import { resolveNextRoute } from "@/lib/flow";

interface MeResponse {
  user: {
    role: "USER" | "SUPER_ADMIN";
    telegramVerified: boolean;
    statusKey: "NONE" | "ACTIVE" | "EXPIRED";
  };
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapFirebaseError(error: unknown): string {
    const code = (error as Partial<AuthError>)?.code;

    switch (code) {
      case "auth/email-already-in-use":
        return "Email sudah terdaftar di Firebase";
      case "auth/invalid-email":
        return "Format email tidak valid";
      case "auth/weak-password":
        return "Password terlalu lemah";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email atau password Firebase salah";
      case "auth/network-request-failed":
        return "Gagal terhubung ke Firebase. Cek koneksi internet";
      default:
        return error instanceof Error
          ? error.message
          : "Autentikasi Firebase gagal";
    }
  }

  async function continueFlow() {
    const me = await api<MeResponse>("/api/me");
    router.push(resolveNextRoute(me.user));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseClientConfigured()) {
        throw new Error(
          "Konfigurasi Firebase client belum lengkap di environment",
        );
      }

      const auth = getFirebaseClientAuth();

      const credential =
        mode === "register"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

      const idToken = await credential.user.getIdToken(true);

      let clientIp = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          clientIp = ipData.ip;
        }
      } catch (e) {
        console.error("Failed to fetch client IP", e);
      }

      await api<{ user: { id: string } }>("/api/auth/firebase-session", {
        method: "POST",
        body: JSON.stringify({ idToken, clientIp }),
      });

      await continueFlow();
    } catch (submitError) {
      setError(mapFirebaseError(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFBF8] px-4 py-12 selection:bg-[#9A5034] selection:text-white">
      <section className="fade-rise w-full max-w-md rounded-3xl bg-white border border-[#F0E6D8] p-8 shadow-2xl shadow-[#9A5034]/5 md:p-10 relative overflow-hidden">
        {/* Decorative corner blur */}
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#9A5034]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-[#D4B89C]/20 blur-3xl" />

        <div className="relative z-10 text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E0] shadow-sm border border-[#F0E6D8]">
            <Lock className="h-6 w-6 text-[#9A5034]" strokeWidth={2.5} />
          </div>
          <h1 className="title-font text-3xl font-bold tracking-tight text-[var(--ink)]">
            {mode === "login" ? "Selamat Datang" : "Daftar Akun"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {mode === "login"
              ? "Masuk untuk melanjutkan ke dashboard pengelolaan pesan, grup, dan lisensi Anda."
              : "Buat akun baru untuk mulai menggunakan platform otomasi kirim pesan Telegram."}
          </p>
        </div>

        <form className="relative z-10 space-y-5" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
                Alamat Email
              </label>
              <input
                required
                type="email"
                placeholder="email@perusahaan.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-3.5 text-sm transition-all placeholder:text-slate-400 focus:border-[#9A5034] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#9A5034]/10 text-[var(--ink)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
                Kata Sandi
              </label>
              <input
                required
                type="password"
                placeholder="Minimal 6 karakter"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-3.5 text-sm transition-all placeholder:text-slate-400 focus:border-[#9A5034] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#9A5034]/10 text-[var(--ink)]"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-600 shadow-inner">
              <span className="font-semibold block mb-0.5">Oops, terjadi kesalahan!</span>
              {error}
            </div>
          ) : null}

          <button
            disabled={loading}
            type="submit"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#9A5034] px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#9A5034]/20 transition-all hover:bg-[#7A3F2E] hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70 disabled:hover:bg-[#9A5034]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Memproses...
              </span>
            ) : mode === "login" ? (
              "Masuk ke Dashboard"
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Daftar & Lanjutkan
              </>
            )}
          </button>
        </form>

        <div className="relative z-10 mt-6 md:mt-8 break-words text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="text-sm font-semibold text-[#9A7B6A] transition-colors hover:text-[#9A5034]"
          >
            {mode === "login"
              ? "Belum punya akun? Daftar sekarang"
              : "Sudah punya akun? Masuk di sini"}
          </button>
        </div>
      </section>
    </main>
  );
}
