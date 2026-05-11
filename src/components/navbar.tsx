"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? "text-[var(--accent)] border-b-2 border-[var(--accent)] pb-1" 
      : "text-slate-600 hover:text-[var(--ink)]";
  };

  return (
    <header className="app-shell flex items-center justify-between py-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-sendora.png" alt="Sendora" className="h-8 object-contain" />
          <span className="title-font text-xl font-bold tracking-tight text-[var(--ink)]">
            Sendora
          </span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className={`text-sm font-semibold transition-colors ${isActive('/')}`}>Beranda</Link>
        <Link href="/fitur" className={`text-sm font-semibold transition-colors ${isActive('/fitur')}`}>Fitur</Link>
        <Link href="/harga" className={`text-sm font-semibold transition-colors ${isActive('/harga')}`}>Harga</Link>
        <Link href="/auth" className="text-sm font-semibold text-slate-600 hover:text-[var(--ink)] transition-colors">Masuk</Link>
        <Link href="/auth" className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#e65a20] shadow-sm">
          Daftar
        </Link>
      </nav>
    </header>
  );
}
