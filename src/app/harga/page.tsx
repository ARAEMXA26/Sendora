"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, Shield, ChevronDown, Send, ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";

export default function HargaPage() {
  const [hoveredCard, setHoveredCard] = useState<"7day" | "30day" | null>(null);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-20">
        
        {/* --- PRICING HEADER --- */}
        <section className="app-shell pt-16 pb-10 text-center">
          <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] shadow-sm mb-6">
             <span className="mr-2 flex h-2 w-2 rounded-full bg-[var(--accent)]"></span>
             Paket Harga Sendora
          </div>
          <h1 className="title-font text-3xl md:text-4xl lg:text-[44px] font-bold text-[var(--ink)] leading-[1.2] mb-5 max-w-3xl mx-auto">
             Pilih paket yang sesuai<br className="hidden md:block"/> dengan kebutuhan campaign Anda
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl mx-auto">
             Mulai dari paket singkat hingga paket bulanan dengan fitur utama<br className="hidden md:block"/> yang sama dan aktivasi yang mudah.
          </p>
        </section>

        {/* --- PRICING CARDS --- */}
        <section className="app-shell pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
             
             {/* Card 1: 7 Day */}
             <div 
                className={`rounded-[1.5rem] border-2 bg-white p-8 flex flex-col cursor-pointer relative overflow-hidden transition-all duration-300 ${hoveredCard === "7day" ? "border-[var(--accent)] shadow-md" : "border-slate-200 shadow-sm"}`}
                onMouseEnter={() => setHoveredCard("7day")}
                onMouseLeave={() => setHoveredCard(null)}
             >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   {/* Left Column */}
                   <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-[var(--accent)] mb-6">
                         <span>★</span> Paling Ringkas
                      </div>
                      <h3 className="title-font text-2xl font-bold text-[var(--ink)] mb-1">7 Day</h3>
                      <div className="title-font text-[40px] font-extrabold text-[var(--ink)] leading-none mb-2">Rp3.000</div>
                      <p className="text-xs text-slate-500 mb-6">Aktif selama 7 hari</p>
                      
                      <hr className="border-slate-100 mb-6" />
                      
                      <p className="text-[13px] text-slate-500 leading-relaxed">
                         Cocok untuk pengguna yang ingin mencoba campaign Telegram dalam waktu singkat.
                      </p>
                   </div>
                   
                   {/* Right Column: Features */}
                   <div className="flex flex-col justify-center pt-2 md:pt-14">
                      <ul className="space-y-3.5">
                         {[
                           "Akses dashboard Sendora",
                           "Auto send ke grup Telegram",
                           "Kirim teks & media",
                           "Atur delay pengiriman",
                           "Monitoring aktivitas",
                           "Riwayat pengiriman"
                         ].map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                              <span className="text-[13px] font-medium text-slate-600 leading-tight">{feature}</span>
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
                
                <Link href="/auth" className="mt-auto w-full rounded-xl bg-[var(--accent)] py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-[#e65a20] shadow-sm">
                   Pilih Paket
                </Link>
             </div>

             {/* Card 2: 30 Day */}
             <div 
                className={`rounded-[1.5rem] border-2 bg-white p-8 flex flex-col relative overflow-hidden transition-all duration-300 cursor-pointer ${hoveredCard === "30day" ? "border-[var(--accent)] shadow-md" : "border-slate-200 shadow-sm"}`}
                onMouseEnter={() => setHoveredCard("30day")}
                onMouseLeave={() => setHoveredCard(null)}
             >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                   {/* Left Column */}
                   <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-[var(--accent)] mb-6">
                         <span>🔥</span> Paling Populer
                      </div>
                      <h3 className="title-font text-2xl font-bold text-[var(--ink)] mb-1">30 Day</h3>
                      <div className="title-font text-[40px] font-extrabold text-[var(--ink)] leading-none mb-2">Rp6.000</div>
                      <p className="text-xs text-slate-500 mb-6">Aktif selama 30 hari</p>
                      
                      <hr className="border-slate-100 mb-6" />
                      
                      <p className="text-[13px] text-slate-500 leading-relaxed">
                         Cocok untuk pengguna yang menjalankan campaign lebih rutin dan lebih fleksibel.
                      </p>
                   </div>
                   
                   {/* Right Column: Features */}
                   <div className="flex flex-col justify-center pt-2 md:pt-14">
                      <ul className="space-y-3.5">
                         {[
                           "Akses dashboard Sendora",
                           "Auto send ke grup Telegram",
                           "Kirim teks & media",
                           "Atur delay pengiriman",
                           "Monitoring aktivitas",
                           "Riwayat pengiriman"
                         ].map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                              <span className="text-[13px] font-medium text-slate-600 leading-tight">{feature}</span>
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
                
                <Link href="/auth" className="mt-auto w-full rounded-xl bg-[var(--accent)] py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-[#e65a20] shadow-sm">
                   Pilih Paket
                </Link>
             </div>

          </div>

          {/* Notice Box */}
          <div className="max-w-[1000px] mx-auto mt-6">
             <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                   <Shield className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                   <p className="text-[13px] font-bold text-[var(--ink)]">Perbedaan utama kedua paket ada pada masa aktifnya.</p>
                   <p className="text-[13px] font-bold text-slate-500">Semua fitur utama tetap dapat digunakan pada kedua paket.</p>
                </div>
             </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="app-shell py-16">
           <h2 className="title-font text-xl font-bold text-center text-[var(--ink)] mb-10">
              Pertanyaan singkat
           </h2>
           <div className="max-w-3xl mx-auto space-y-4">
              
              {/* FAQ 1 */}
              <details className="group rounded-xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                 <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-[13px] font-bold text-[var(--ink)]">
                    <div className="flex items-center gap-3">
                       <div className="flex h-6 w-6 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-[10px] text-[var(--accent)] shrink-0">?</div>
                       Apakah fitur paket 7 Day dan 30 Day berbeda?
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:-rotate-180" />
                 </summary>
                 <div className="px-5 pb-5 pt-1 border-t border-slate-100 mt-1">
                    <p className="text-[13px] text-slate-500 pl-9 border-l-2 border-slate-100 ml-[11px] py-1">Fitur utama tetap sama, perbedaannya ada pada masa aktif paket.</p>
                 </div>
              </details>

              {/* FAQ 2 */}
              <details className="group rounded-xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                 <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-[13px] font-bold text-[var(--ink)]">
                    <div className="flex items-center gap-3">
                       <div className="flex h-6 w-6 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-[10px] text-[var(--accent)] shrink-0">?</div>
                       Kapan paket mulai aktif?
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:-rotate-180" />
                 </summary>
                 <div className="px-5 pb-5 pt-1 border-t border-slate-100 mt-1">
                    <p className="text-[13px] text-slate-500 pl-9 border-l-2 border-slate-100 ml-[11px] py-1">Paket aktif setelah akun dan lisensi berhasil diaktivasi.</p>
                 </div>
              </details>

              {/* FAQ 3 */}
              <details className="group rounded-xl border border-slate-200 bg-white [&_summary::-webkit-details-marker]:hidden">
                 <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-[13px] font-bold text-[var(--ink)]">
                    <div className="flex items-center gap-3">
                       <div className="flex h-6 w-6 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-[10px] text-[var(--accent)] shrink-0">?</div>
                       Apakah saya bisa memilih paket sesuai kebutuhan?
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:-rotate-180" />
                 </summary>
                 <div className="px-5 pb-5 pt-1 border-t border-slate-100 mt-1">
                    <p className="text-[13px] text-slate-500 pl-9 border-l-2 border-slate-100 ml-[11px] py-1">Ya, Anda bisa memilih paket yang paling sesuai dengan durasi campaign Anda.</p>
                 </div>
              </details>

           </div>
        </section>
        
        {/* --- CTA BANNER --- */}
        <section className="app-shell mt-8 mb-10">
           <div className="flex flex-col md:flex-row items-center justify-between rounded-[1.25rem] bg-[#FFF0E0] border border-[#F0E6D8] p-6 md:p-8 gap-6 shadow-sm max-w-[1000px] mx-auto">
              <div className="flex items-center gap-5">
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0E6D8] shadow-sm border border-white">
                    <Send className="h-5 w-5 text-slate-600" />
                 </div>
                 <div>
                    <h3 className="title-font text-lg font-bold text-[var(--ink)] mb-1">Mulai campaign Telegram Anda hari ini</h3>
                    <p className="text-sm text-slate-500">Pilih paket yang sesuai dan jalankan pengiriman pesan lebih mudah dari satu dashboard.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                 <Link href="/auth" className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#e65a20] shadow-sm">
                    Daftar Sekarang <ArrowRight className="h-4 w-4" />
                 </Link>
                 <Link href="/fitur" className="rounded-lg border border-[#F0E6D8] bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-[#FFF0E0] shadow-sm">
                    Lihat Fitur
                 </Link>
              </div>
           </div>
        </section>

      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
