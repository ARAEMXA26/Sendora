"use client";
import { LogOut } from "lucide-react";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { api } from "@/lib/client-api";
import {
  getFirebaseClientAuth,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold hover:bg-white"
      onClick={async () => {
        if (isFirebaseClientConfigured()) {
          await signOut(getFirebaseClientAuth()).catch(() => {
            // Ignore client logout error; server session still cleared below.
          });
        }
        await api<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
        router.push("/auth");
      }}
    >
      <LogOut
        className="w-4 h-4 inline-block mr-1.5 text-slate-700"
        strokeWidth={2.5}
      />{" "}
      Logout
    </button>
  );
}
