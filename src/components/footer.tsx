import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="app-shell flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/logo-sendora.png" alt="Sendora" className="h-6 object-contain" />
          <span className="title-font text-lg font-bold text-[var(--ink)]">
            Sendora
          </span>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
           <Link href="/fitur" className="text-xs font-semibold text-slate-500 hover:text-[var(--ink)]">Fitur</Link>
           <Link href="/harga" className="text-xs font-semibold text-slate-500 hover:text-[var(--ink)]">Harga</Link>
           <Link href="/auth" className="text-xs font-semibold text-slate-500 hover:text-[var(--ink)]">Masuk</Link>
           <Link href="/auth" className="rounded bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white hover:bg-[#e65a20]">Daftar</Link>
        </nav>
      </div>
      <div className="app-shell mt-8 text-center md:text-left">
         <p className="text-[10px] text-slate-400">&copy; {new Date().getFullYear()} Sendora. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
