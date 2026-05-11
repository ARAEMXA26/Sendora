import Link from "next/link";
import { 
  Lock, User, Send, ImageIcon, Users, BarChart, Bell, FileText 
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";

export default function FiturPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-white selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* --- FITUR UTAMA SECTION --- */}
        <section id="fitur" className="app-shell py-20">
           {/* Section Header */}
           <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] shadow-sm mb-6">
                 <span className="mr-2 flex h-2 w-2 rounded-full bg-[var(--accent)]"></span>
                 Fitur Sendora
              </div>
              <h2 className="title-font text-3xl md:text-4xl lg:text-[40px] font-bold text-[var(--ink)] leading-tight mb-5">
                 Semua fitur yang Anda butuhkan untuk auto send Telegram dengan <span className="text-[var(--accent)]">aman & otomatis</span>
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl mx-auto">
                 Sendora dirancang lengkap untuk membantu Anda menjalankan kampanye Telegram lebih mudah, aman, dan terkontrol.
              </p>
           </div>

           {/* Features Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Autentikasi */}
              <article className="flex flex-col justify-between rounded-[1.25rem] border border-[#F0E6D8] bg-white shadow-sm overflow-hidden">
                 <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E0]" style={{ backgroundColor: "#FFF0E0" }}>
                          <Lock className="h-5 w-5 text-[#9A5034]" style={{ color: "#9A5034" }} />
                       </div>
                       <h3 className="title-font text-base font-bold text-[var(--ink)] pt-1">1. Autentikasi &<br/>Keamanan Akun</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Login aman dengan Email & Password (Firebase)
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Riwayat login & perangkat
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Logout semua perangkat
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Validasi License Key
                       </li>
                    </ul>
                 </div>
                 {/* Mockup 1 */}
                 <div className="px-6 pb-6 mt-auto">
                    <div className="rounded-xl border border-[#F0E6D8] bg-white p-4 relative">
                       <div className="space-y-2.5 mb-5">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-12 rounded bg-white border border-[#F0E6D8] flex items-center justify-center"><User className="h-4 w-4 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="space-y-1.5 flex-1">
                                <div className="h-1.5 w-24 bg-[#F0E6D8] rounded-full"></div>
                                <div className="h-1.5 w-16 bg-[#F0E6D8] rounded-full"></div>
                             </div>
                             <div className="h-3 w-3 border border-[#F0E6D8] rounded-sm"></div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-12 rounded bg-white border border-[#F0E6D8] flex items-center justify-center"><User className="h-4 w-4 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="space-y-1.5 flex-1">
                                <div className="h-1.5 w-20 bg-[#F0E6D8] rounded-full"></div>
                                <div className="h-1.5 w-12 bg-[#F0E6D8] rounded-full"></div>
                             </div>
                             <div className="h-3 w-3 border border-[#F0E6D8] rounded-sm"></div>
                          </div>
                       </div>
                       <div className="w-full h-8 rounded-lg border border-[#F0E6D8] bg-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                          Logout Semua Perangkat
                       </div>
                    </div>
                 </div>
              </article>

              {/* Card 2: Integrasi Telegram */}
              <article className="flex flex-col justify-between rounded-[1.25rem] border border-[#F0E6D8] bg-white shadow-sm overflow-hidden">
                 <div className="p-6">
                    <div className="flex items-center gap-4 mb-5">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E0]" style={{ backgroundColor: "#FFF0E0" }}>
                          <Send className="h-5 w-5 text-[#9A5034]" style={{ color: "#9A5034" }} />
                       </div>
                       <h3 className="title-font text-base font-bold text-[var(--ink)]">2. Integrasi Telegram</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Login Telegram via OTP
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Sesi aman (MTProto)
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Deteksi profil otomatis<br/>(Nama, No. HP, Username)
                       </li>
                    </ul>
                 </div>
                 {/* Mockup 2 */}
                 <div className="px-6 pb-6 mt-auto">
                    <div className="flex gap-4 h-full">
                       <div className="flex-1 rounded-xl border border-[#F0E6D8] bg-white p-4 flex flex-col justify-between">
                          <div>
                             <div className="text-[10px] font-bold text-slate-500 mb-3 text-center">Verifikasi Telegram</div>
                             <div className="flex justify-between gap-1 mb-4">
                                <div className="h-8 w-6 bg-white border border-[#F0E6D8] rounded flex items-center justify-center text-xs font-bold text-slate-600">1</div>
                                <div className="h-8 w-6 bg-white border border-[#F0E6D8] rounded flex items-center justify-center text-xs font-bold text-slate-600">2</div>
                                <div className="h-8 w-6 bg-white border border-[#F0E6D8] rounded flex items-center justify-center text-xs font-bold text-slate-600">3</div>
                                <div className="h-8 w-6 bg-white border border-[#F0E6D8] rounded flex items-center justify-center text-xs font-bold text-slate-600">4</div>
                                <div className="h-8 w-6 bg-white border border-[#F0E6D8] rounded flex items-center justify-center text-xs font-bold text-slate-600">5</div>
                             </div>
                             <div className="w-full h-8 rounded bg-[#9A5034] flex items-center justify-center text-[10px] font-bold text-white mb-2">Verifikasi</div>
                          </div>
                          <div className="pt-3 border-t border-[#F0E6D8] mt-2 flex items-center justify-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-[#F0E6D8] flex items-center justify-center"><User className="h-4 w-4 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="space-y-1.5">
                                <div className="h-1.5 w-16 bg-[#9A5034] rounded-full"></div>
                                <div className="h-1.5 w-24 bg-[#F0E6D8] rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </article>

              {/* Card 3: Auto Send */}
              <article className="flex flex-col justify-between rounded-[1.25rem] border border-[#F0E6D8] bg-white shadow-sm overflow-hidden">
                 <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E0]" style={{ backgroundColor: "#FFF0E0" }}>
                          <Send className="h-5 w-5 text-[#9A5034]" style={{ color: "#9A5034" }} />
                       </div>
                       <h3 className="title-font text-base font-bold text-[var(--ink)] pt-1">3. Auto Send (Pesan<br/>Otomatis)</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Kirim teks & media
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Atur jeda (delay) antar<br/>pengiriman
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Kontrol Start / Stop
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Bekerja di background
                       </li>
                    </ul>
                 </div>
                 {/* Mockup 3 */}
                 <div className="px-6 pb-6 mt-auto">
                    <div className="rounded-xl border border-[#F0E6D8] bg-white p-4">
                       <div className="mb-4">
                          <div className="text-[10px] font-bold text-slate-500 mb-1.5">Pesan</div>
                          <div className="w-full h-16 rounded border border-[#F0E6D8] bg-white p-2">
                             <div className="text-[9px] text-slate-400 italic">Tulis pesan...</div>
                          </div>
                          <div className="mt-2 w-8 h-8 rounded border border-[#F0E6D8] bg-white flex items-center justify-center"><ImageIcon className="h-3.5 w-3.5 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                       </div>
                       <div className="flex items-center justify-between mb-4">
                          <div className="text-[10px] font-bold text-slate-500">Delay (detik)</div>
                          <div className="w-12 h-6 rounded border border-[#F0E6D8] bg-white flex items-center justify-center text-[10px] font-bold text-[var(--ink)]">10</div>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div className="h-8 rounded bg-[#9A5034] flex items-center justify-center text-[10px] font-bold text-white">Start</div>
                          <div className="h-8 rounded bg-[#F0E6D8] flex items-center justify-center text-[10px] font-bold text-slate-500">Stop</div>
                       </div>
                    </div>
                 </div>
              </article>

              {/* Card 4: Manajemen Grup */}
              <article className="flex flex-col justify-between rounded-[1.25rem] border border-[#F0E6D8] bg-white shadow-sm overflow-hidden">
                 <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E0]" style={{ backgroundColor: "#FFF0E0" }}>
                          <Users className="h-5 w-5 text-[#9A5034]" style={{ color: "#9A5034" }} />
                       </div>
                       <h3 className="title-font text-base font-bold text-[var(--ink)] pt-1">4. Manajemen Grup &<br/>Pembersihan Akun</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Tarik data grup (Fetch Groups)
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Pilih grup target
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Keluar dari semua grup
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Hapus semua bot
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Keluar dari semua channel
                       </li>
                    </ul>
                 </div>
                 {/* Mockup 4 */}
                 <div className="px-6 pb-6 mt-auto">
                    <div className="w-48 rounded-xl border border-[#F0E6D8] bg-white p-4">
                       <div className="text-[10px] font-bold text-slate-500 mb-3">Daftar Grup</div>
                       <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2.5">
                             <div className="h-3 w-3 border border-[#F0E6D8] rounded-sm"></div>
                             <div className="h-5 w-5 rounded-full bg-[#F0E6D8] flex items-center justify-center"><User className="h-3 w-3 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="h-1.5 w-20 bg-[#F0E6D8] rounded-full"></div>
                          </div>
                          <div className="flex items-center gap-2.5">
                             <div className="h-3 w-3 bg-[#9A5034] rounded-sm"></div>
                             <div className="h-5 w-5 rounded-full bg-[#F0E6D8] flex items-center justify-center"><User className="h-3 w-3 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="h-1.5 w-16 bg-[#F0E6D8] rounded-full"></div>
                          </div>
                          <div className="flex items-center gap-2.5">
                             <div className="h-3 w-3 border border-[#F0E6D8] rounded-sm"></div>
                             <div className="h-5 w-5 rounded-full bg-[#F0E6D8] flex items-center justify-center"><User className="h-3 w-3 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="h-1.5 w-24 bg-[#F0E6D8] rounded-full"></div>
                          </div>
                          <div className="flex items-center gap-2.5">
                             <div className="h-3 w-3 bg-[#9A5034] rounded-sm"></div>
                             <div className="h-5 w-5 rounded-full bg-[#F0E6D8] flex items-center justify-center"><User className="h-3 w-3 text-[#B89A85]" style={{ color: "#B89A85" }}/></div>
                             <div className="h-1.5 w-14 bg-[#F0E6D8] rounded-full"></div>
                          </div>
                       </div>
                       <div className="w-full h-8 rounded-lg border border-[#F0E6D8] bg-[#F0E6D8] flex items-center justify-center text-[10px] font-bold text-slate-500">
                          Bersihkan Akun
                       </div>
                    </div>
                 </div>
              </article>

              {/* Card 5: Dashboard & Monitoring */}
              <article className="flex flex-col justify-between rounded-[1.25rem] border border-[#F0E6D8] bg-white shadow-sm overflow-hidden">
                 <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E0]" style={{ backgroundColor: "#FFF0E0" }}>
                          <BarChart className="h-5 w-5 text-[#9A5034]" style={{ color: "#9A5034" }} />
                       </div>
                       <h3 className="title-font text-base font-bold text-[var(--ink)] pt-1">5. Dashboard &<br/>Monitoring</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Statistik harian
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Ringkasan grup aktif,<br/>pesan terkirim, media
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Notifikasi sistem &<br/>peringatan lisensi
                       </li>
                    </ul>
                 </div>
                 {/* Mockup 5 */}
                 <div className="px-6 pb-6 mt-auto">
                    <div className="rounded-xl border border-[#F0E6D8] bg-white p-4">
                       <div className="flex gap-2 mb-4">
                          <div className="flex-1 rounded border border-[#F0E6D8] bg-white p-2 text-center shadow-sm">
                             <div className="text-[7px] font-bold text-slate-400 mb-1">Grup Aktif</div>
                             <div className="text-sm font-bold text-[var(--ink)]">128</div>
                          </div>
                          <div className="flex-1 rounded border border-[#F0E6D8] bg-white p-2 text-center shadow-sm">
                             <div className="text-[7px] font-bold text-slate-400 mb-1">Pesan Terkirim</div>
                             <div className="text-sm font-bold text-[var(--ink)]">1.245</div>
                          </div>
                          <div className="w-10 rounded border border-[#F0E6D8] bg-white p-2 text-center shadow-sm">
                             <div className="text-[7px] font-bold text-slate-400 mb-1">Media</div>
                             <div className="text-sm font-bold text-[var(--ink)]">36</div>
                          </div>
                       </div>
                       <div className="rounded border border-[#F0E6D8] bg-white p-3 shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                             <div className="text-[10px] font-bold text-slate-500">Notifikasi</div>
                             <Bell className="h-3 w-3 text-[#B89A85]" style={{ color: "#B89A85" }} />
                          </div>
                          <div className="space-y-2">
                             <div className="h-1.5 w-full bg-[#F0E6D8] rounded-full"></div>
                             <div className="h-1.5 w-2/3 bg-[#F0E6D8] rounded-full"></div>
                             <div className="h-1.5 w-4/5 bg-[#F0E6D8] rounded-full mt-3"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </article>

              {/* Card 6: Riwayat Pengiriman */}
              <article className="flex flex-col justify-between rounded-[1.25rem] border border-[#F0E6D8] bg-white shadow-sm overflow-hidden">
                 <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E0]" style={{ backgroundColor: "#FFF0E0" }}>
                          <FileText className="h-5 w-5 text-[#9A5034]" style={{ color: "#9A5034" }} />
                       </div>
                       <h3 className="title-font text-base font-bold text-[var(--ink)] pt-1">6. Riwayat Pengiriman<br/>(Log)</h3>
                    </div>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Riwayat lengkap pengiriman
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Detail grup, waktu & status
                       </li>
                       <li className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A5034]" style={{ backgroundColor: "#9A5034" }}></div> Status: Terkirim / Gagal
                       </li>
                    </ul>
                 </div>
                 {/* Mockup 6 */}
                 <div className="px-6 pb-6 mt-auto">
                    <div className="rounded-xl border border-[#F0E6D8] bg-white p-4">
                       <div className="flex justify-between text-[8px] font-bold text-slate-400 border-b border-[#F0E6D8] pb-2 mb-2 px-1">
                          <div className="w-16">Grup</div>
                          <div className="flex-1 text-center">Waktu</div>
                          <div className="w-14 text-right">Status</div>
                       </div>
                       <div className="space-y-3 px-1">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5 w-16">
                                <div className="h-3 w-3 rounded-full border border-[#F0E6D8] bg-white"></div>
                                <div className="h-1 w-8 bg-[#F0E6D8] rounded-full"></div>
                             </div>
                             <div className="flex-1 flex justify-center"><div className="h-1 w-6 bg-[#F0E6D8] rounded-full"></div></div>
                             <div className="w-14 flex justify-end"><div className="px-2 py-0.5 rounded border border-[#F0E6D8] bg-white text-[7px] font-bold text-slate-500">Terkirim</div></div>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5 w-16">
                                <div className="h-3 w-3 rounded-full border border-[#F0E6D8] bg-white"></div>
                                <div className="h-1 w-10 bg-[#F0E6D8] rounded-full"></div>
                             </div>
                             <div className="flex-1 flex justify-center"><div className="h-1 w-6 bg-[#F0E6D8] rounded-full"></div></div>
                             <div className="w-14 flex justify-end"><div className="px-2 py-0.5 rounded border border-[#F0E6D8] bg-white text-[7px] font-bold text-slate-500">Gagal</div></div>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5 w-16">
                                <div className="h-3 w-3 rounded-full border border-[#F0E6D8] bg-white"></div>
                                <div className="h-1 w-7 bg-[#F0E6D8] rounded-full"></div>
                             </div>
                             <div className="flex-1 flex justify-center"><div className="h-1 w-6 bg-[#F0E6D8] rounded-full"></div></div>
                             <div className="w-14 flex justify-end"><div className="px-2 py-0.5 rounded border border-[#F0E6D8] bg-white text-[7px] font-bold text-slate-500">Terkirim</div></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </article>
           </div>

           {/* Fitur CTA Banner */}
           <div className="mt-10 flex flex-col md:flex-row items-center justify-between rounded-[1.25rem] bg-[#FFF0E0] border border-[#F0E6D8] p-6 md:p-8 gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0E6D8] shadow-sm border border-white">
                    <Send className="h-5 w-5 text-slate-600" />
                 </div>
                 <div>
                    <h3 className="title-font text-lg font-bold text-[var(--ink)] mb-1">Siap mulai kampanye Telegram Anda?</h3>
                    <p className="text-sm text-slate-500">Gunakan semua fitur Sendora untuk hasil yang lebih maksimal.</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                 <Link href="/auth" className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#e65a20] shadow-sm">
                    Daftar Sekarang
                 </Link>
                 <Link href="/#cara-kerja" className="rounded-lg border border-[#F0E6D8] bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-[#FFF0E0] shadow-sm">
                    Lihat Cara Kerja
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
