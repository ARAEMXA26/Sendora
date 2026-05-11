import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, BarChart, Send, 
  ImageIcon, User, Edit3, Users, Clock,
  Menu, Info, ChevronDown, CheckCircle2, Megaphone, Target, Lock, Zap, MessageSquare
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-white selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="flex-1 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="app-shell grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 pt-10 md:pt-16 pb-20 items-center">
          
          {/* Left Text */}
          <div className="flex flex-col items-start text-left">
            <div className="fade-rise mb-6 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] shadow-sm">
              <span className="mr-2 flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
              Platform Auto Send Telegram
            </div>
            <h1 className="title-font fade-rise text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.15] tracking-tight text-[var(--ink)]">
              Kirim pesan ke banyak grup Telegram dengan <span className="text-[var(--accent)]">aman</span> dan <span className="text-[var(--accent)]">otomatis</span>.
            </h1>
            <p className="fade-rise mt-6 text-lg text-[#9A7B6A] leading-relaxed max-w-[480px]" style={{ animationDelay: "150ms" }}>
              Sendora membantu Anda mengatur pesan, memilih grup tujuan, dan menjalankan campaign lebih mudah dari satu dashboard.
            </p>
            
            <div className="fade-rise mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "300ms" }}>
              <Link
                href="/auth"
                className="group flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#e65a20]"
              >
                Join Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/fitur"
                className="flex items-center justify-center rounded-lg border-2 border-[#F0E6D8] bg-white px-7 py-3.5 text-sm font-bold text-[#7A5A45] transition-all hover:border-[#D4B89C] hover:bg-[#FFF8F0]"
              >
                Lihat Fitur
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="fade-rise mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full" style={{ animationDelay: "450ms" }}>
              <div className="flex items-center gap-3 rounded-xl border border-[#F0E6D8] bg-white p-3 shadow-sm">
                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FFF8F0] text-[#9A5034]">
                    <Send className="h-4 w-4" />
                 </div>
                 <span className="text-[11px] font-semibold text-[#7A5A45] leading-tight">Auto send<br/>multi group</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#F0E6D8] bg-white p-3 shadow-sm">
                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FFF8F0] text-[#9A5034]">
                    <Clock className="h-4 w-4" />
                 </div>
                 <span className="text-[11px] font-semibold text-[#7A5A45] leading-tight">Jadwal kirim<br/>fleksibel</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#F0E6D8] bg-white p-3 shadow-sm">
                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FFF8F0] text-[#9A5034]">
                    <ImageIcon className="h-4 w-4" />
                 </div>
                 <span className="text-[11px] font-semibold text-[#7A5A45] leading-tight">Dukung teks<br/>& media</span>
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="fade-rise relative mx-auto w-full max-w-[500px] lg:ml-auto" style={{ animationDelay: "300ms" }}>
             <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-white opacity-50 blur-3xl -z-10 rounded-[3rem]"></div>
             <div className="rounded-2xl border border-[#F0E6D8] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-[#F0E6D8] px-5 py-4">
                   <div className="flex items-center gap-3">
                      <Menu className="h-4 w-4 text-[#C4A88E]" />
                      <span className="text-sm font-bold text-[var(--ink)]">Dashboard</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-[#F0E6D8] flex items-center justify-center">
                         <User className="h-3.5 w-3.5 text-[#9A7B6A]" />
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 text-[#C4A88E]" />
                   </div>
                </div>
                
                <div className="p-5">
                   {/* Mockup Stats */}
                   <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="rounded-xl border border-[#F0E6D8] p-3">
                         <div className="flex items-start gap-2 mb-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FFF8F0]">
                               <Users className="h-3 w-3 text-[#9A5034]" />
                            </div>
                            <div className="text-[10px] text-[#9A7B6A] font-medium">Grup Aktif</div>
                         </div>
                         <div className="text-lg font-bold text-[var(--ink)] leading-none">24</div>
                         <div className="text-[9px] text-[#B89A85] mt-1">Grup</div>
                      </div>
                      <div className="rounded-xl border border-[#F0E6D8] p-3">
                         <div className="flex items-start gap-2 mb-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FFF8F0]">
                               <Send className="h-3 w-3 text-[#9A5034]" />
                            </div>
                            <div className="text-[10px] text-[#9A7B6A] font-medium">Pesan Hari Ini</div>
                         </div>
                         <div className="text-lg font-bold text-[var(--ink)] leading-none">1.248</div>
                         <div className="text-[9px] text-[#B89A85] mt-1">Terkirim</div>
                      </div>
                      <div className="rounded-xl border border-[#F0E6D8] p-3">
                         <div className="flex items-start gap-2 mb-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FFF8F0]">
                               <ImageIcon className="h-3 w-3 text-[#9A5034]" />
                            </div>
                            <div className="text-[10px] text-[#9A7B6A] font-medium">Media</div>
                         </div>
                         <div className="text-lg font-bold text-[var(--ink)] leading-none">86</div>
                         <div className="text-[9px] text-[#B89A85] mt-1">File</div>
                      </div>
                   </div>

                   {/* Mockup Chart Area */}
                   <div className="mb-6">
                      <h3 className="text-[10px] font-bold text-[#9A7B6A] mb-3">Ringkasan Pengiriman</h3>
                      <div className="h-32 w-full relative">
                         {/* Simple CSS Chart lines */}
                         <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-[#F0E6D8] pb-5 pl-1">
                            <div className="border-b border-[#F0E6D8]/50 w-full flex justify-end"><span className="text-[8px] text-[#C4A88E] relative top-[-6px] right-[-16px]">2.000</span></div>
                            <div className="border-b border-[#F0E6D8]/50 w-full flex justify-end"><span className="text-[8px] text-[#C4A88E] relative top-[-6px] right-[-16px]">1.500</span></div>
                            <div className="border-b border-[#F0E6D8]/50 w-full flex justify-end"><span className="text-[8px] text-[#C4A88E] relative top-[-6px] right-[-16px]">1.000</span></div>
                            <div className="border-b border-[#F0E6D8]/50 w-full flex justify-end"><span className="text-[8px] text-[#C4A88E] relative top-[-6px] right-[-16px]">500</span></div>
                            <div className="w-full flex justify-end"><span className="text-[8px] text-[#C4A88E] relative top-[-2px] right-[-8px]">0</span></div>
                         </div>
                         {/* Labels */}
                         <div className="absolute bottom-0 left-0 w-full flex justify-between text-[8px] text-[#B89A85] px-2 pl-4">
                            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                         </div>
                         {/* Fake Line Vector */}
                         <svg className="absolute inset-0 h-full w-full pl-2 pb-5" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <polyline points="0,70 15,40 30,55 45,30 60,20 75,45 100,15" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                           <circle cx="0" cy="70" r="2" fill="var(--accent)" />
                           <circle cx="15" cy="40" r="2" fill="var(--accent)" />
                           <circle cx="30" cy="55" r="2" fill="var(--accent)" />
                           <circle cx="45" cy="30" r="2" fill="var(--accent)" />
                           <circle cx="60" cy="20" r="2" fill="var(--accent)" />
                           <circle cx="75" cy="45" r="2" fill="var(--accent)" />
                           <circle cx="100" cy="15" r="2" fill="var(--accent)" />
                         </svg>
                      </div>
                   </div>

                   {/* Mockup Campaign List */}
                   <div>
                      <div className="flex items-center justify-between mb-3">
                         <h3 className="text-[10px] font-bold text-[#9A7B6A]">Campaign Terbaru</h3>
                         <span className="text-[9px] font-semibold text-[var(--accent)]">Lihat semua</span>
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center gap-3 rounded-lg border border-[#F0E6D8] p-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FFF8F0]">
                               <Send className="h-3.5 w-3.5 text-[#9A5034]" />
                            </div>
                            <div className="flex-1">
                               <div className="text-[11px] font-bold text-[var(--ink)]">Promo member baru</div>
                               <div className="text-[9px] text-[#B89A85] mt-0.5">Kirim ke 24 grup</div>
                            </div>
                            <div className="text-right">
                               <div className="text-[9px] font-semibold text-[#9A7B6A]">Terkirim</div>
                               <div className="text-[8px] text-[#B89A85] mt-0.5">1 jam lalu</div>
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#9A5034] text-[8px] font-bold border border-[#F0E6D8] ml-2">Aktif</div>
                         </div>
                         <div className="flex items-center gap-3 rounded-lg border border-[#F0E6D8] p-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FFF8F0]">
                               <Info className="h-3.5 w-3.5 text-[#9A5034]" />
                            </div>
                            <div className="flex-1">
                               <div className="text-[11px] font-bold text-[var(--ink)]">Info event</div>
                               <div className="text-[9px] text-[#B89A85] mt-0.5">Kirim ke 18 grup</div>
                            </div>
                            <div className="text-right">
                               <div className="text-[9px] font-semibold text-[#9A7B6A]">Terkirim</div>
                               <div className="text-[8px] text-[#B89A85] mt-0.5">3 jam lalu</div>
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#9A5034] text-[8px] font-bold border border-[#F0E6D8] ml-2">Aktif</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* --- SOCIAL PROOF / STATISTIK --- */}
        <section className="app-shell pb-16 pt-4">
          <div className="border-y border-[#F0E6D8] py-8 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center md:text-left flex-1">
                <p className="text-sm font-bold text-[#9A7B6A] uppercase tracking-wider mb-2">Dipercaya oleh pengguna aktif</p>
                <h3 className="text-2xl font-extrabold text-[var(--ink)]">Otomatisasi ribuan pesan setiap hari</h3>
             </div>
             <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-16">
                <div className="text-center">
                   <div className="text-3xl font-black text-[#9A5034]">1M+</div>
                   <div className="text-xs font-semibold text-[#9A7B6A] mt-1 uppercase tracking-wide">Pesan Terkirim</div>
                </div>
                <div className="text-center">
                   <div className="text-3xl font-black text-[#9A5034]">50K+</div>
                   <div className="text-xs font-semibold text-[#9A7B6A] mt-1 uppercase tracking-wide">Grup Target</div>
                </div>
                <div className="text-center">
                   <div className="text-3xl font-black text-[#9A5034]">99%</div>
                   <div className="text-xs font-semibold text-[#9A7B6A] mt-1 uppercase tracking-wide">Uptime Worker</div>
                </div>
             </div>
          </div>
        </section>

        {/* --- CARA KERJA SECTION --- */}
        <section id="cara-kerja" className="app-shell py-20 bg-[#FDFBF8] rounded-[3rem] border border-[#F0E6D8] my-10 mx-4 md:mx-auto">
          <div className="text-center mb-16 px-4">
            <h2 className="title-font text-3xl md:text-4xl font-extrabold text-[var(--ink)] mb-4">
              Cara kerjanya <span className="text-[#9A5034]">sederhana</span>
            </h2>
            <p className="text-[#9A7B6A] max-w-2xl mx-auto">Mulai jalankan campaign Telegram pertama Anda hanya dalam 4 langkah mudah tanpa perlu coding atau setup server yang rumit.</p>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-10">
            {/* Dashed Line Background (only visible on md+) */}
            <div className="hidden md:block absolute top-10 left-24 right-24 h-[2px] border-t-2 border-dashed border-[#E5D5C5] z-0"></div>

            <article className="relative z-10 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-white border-2 border-[#E5D5C5] rounded-2xl flex items-center justify-center mb-6 shadow-sm group hover:border-[#9A5034] transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#9A5034] text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
                  <User className="h-8 w-8 text-[#9A5034]" />
               </div>
               <h3 className="title-font text-lg font-bold text-[var(--ink)] mb-2">Buat Akun</h3>
               <p className="text-sm text-[#9A7B6A] leading-relaxed">
                 Daftar, login, dan hubungkan nomor Telegram Anda dengan aman.
               </p>
            </article>

            <article className="relative z-10 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-white border-2 border-[#E5D5C5] rounded-2xl flex items-center justify-center mb-6 shadow-sm group hover:border-[#9A5034] transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#9A5034] text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
                  <Edit3 className="h-8 w-8 text-[#9A5034]" />
               </div>
               <h3 className="title-font text-lg font-bold text-[var(--ink)] mb-2">Tulis Pesan</h3>
               <p className="text-sm text-[#9A7B6A] leading-relaxed">
                 Buat pesan menarik, tambahkan gambar atau media pendukung.
               </p>
            </article>

            <article className="relative z-10 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-white border-2 border-[#E5D5C5] rounded-2xl flex items-center justify-center mb-6 shadow-sm group hover:border-[#9A5034] transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#9A5034] text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
                  <Users className="h-8 w-8 text-[#9A5034]" />
               </div>
               <h3 className="title-font text-lg font-bold text-[var(--ink)] mb-2">Pilih Grup Target</h3>
               <p className="text-sm text-[#9A7B6A] leading-relaxed">
                 Kumpulkan dan masukkan daftar grup Telegram target Anda.
               </p>
            </article>

            <article className="relative z-10 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-[#9A5034] border-2 border-[#9A5034] rounded-2xl flex items-center justify-center mb-6 shadow-md group hover:bg-[#8A452C] transition-colors relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#FFF0E0] text-[#9A5034] flex items-center justify-center font-bold text-sm shadow-sm border border-[#E5D5C5]">4</div>
                  <Send className="h-8 w-8 text-white" />
               </div>
               <h3 className="title-font text-lg font-bold text-[var(--ink)] mb-2">Auto Send!</h3>
               <p className="text-sm text-[#9A7B6A] leading-relaxed">
                 Pesan akan terkirim otomatis sesuai antrean dan jadwal Anda.
               </p>
            </article>
          </div>
        </section>

        {/* --- USE CASES SECTION --- */}
        <section className="app-shell py-16">
           <div className="text-center mb-12">
              <h2 className="title-font text-2xl md:text-3xl font-bold text-[var(--ink)] mb-3">Siapa yang cocok menggunakan Sendora?</h2>
              <p className="text-sm text-[#9A7B6A] max-w-2xl mx-auto">Platform auto-send Telegram yang fleksibel untuk berbagai kebutuhan operasional Anda.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-[#F0E6D8] p-8 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-[#FFF0E0] rounded-xl flex items-center justify-center mb-6">
                    <Megaphone className="w-6 h-6 text-[#9A5034]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Marketing & Promosi</h3>
                 <p className="text-sm text-[#9A7B6A] leading-relaxed">Broadcast promo, diskon, atau peluncuran produk baru ke puluhan grup komunitas dengan sekali klik.</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#F0E6D8] p-8 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-[#FFF0E0] rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-[#9A5034]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Admin Komunitas</h3>
                 <p className="text-sm text-[#9A7B6A] leading-relaxed">Kirim pengumuman penting, aturan grup, atau jadwal event secara otomatis ke semua cabang grup yang dikelola.</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#F0E6D8] p-8 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-[#FFF0E0] rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-6 h-6 text-[#9A5034]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Customer Service</h3>
                 <p className="text-sm text-[#9A7B6A] leading-relaxed">Informasikan maintenance sistem, gangguan layanan, atau update terbaru ke grup VIP pelanggan Anda secara serentak.</p>
              </div>
           </div>
        </section>

        {/* --- SECURITY / KEUNGGULAN SECTION --- */}
        <section className="app-shell py-16">
           <div className="text-center mb-12">
              <h2 className="title-font text-2xl md:text-3xl font-bold text-[var(--ink)] mb-3">Prioritas pada Keamanan & Kontrol</h2>
              <p className="text-sm text-[#9A7B6A] max-w-2xl mx-auto">Kami memahami risiko spamming. Sendora dirancang dengan sistem antrean pintar untuk menjaga akun Anda tetap aman tanpa mengorbankan performa.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-[#F0E6D8] p-8 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-[#FFF0E0] rounded-xl flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-[#9A5034]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Custom Delay</h3>
                 <p className="text-sm text-[#9A7B6A] leading-relaxed">Atur jeda pengiriman dalam hitungan detik agar terlihat natural layaknya dikirim oleh manusia secara manual.</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#F0E6D8] p-8 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-[#FFF0E0] rounded-xl flex items-center justify-center mb-6">
                    <Lock className="w-6 h-6 text-[#9A5034]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Isolasi Sesi Telegram</h3>
                 <p className="text-sm text-[#9A7B6A] leading-relaxed">Data sesi login Telegram Anda dienkripsi tingkat tinggi dan disimpan aman secara lokal di server.</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#F0E6D8] p-8 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-[#FFF0E0] rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-[#9A5034]" />
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)] mb-3">Jeda Otomatis Anti-Spam</h3>
                 <p className="text-sm text-[#9A7B6A] leading-relaxed">Sistem antrean pintar mencegah pengiriman pesan bertubi-tubi yang memicu limitasi atau pembatasan dari pihak Telegram.</p>
              </div>
           </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="app-shell py-16 mb-8">
           <div className="rounded-[3rem] bg-gradient-to-br from-[#F4F9FF] to-white py-24 px-6 text-center border-2 border-[#E5F0FA] shadow-sm relative overflow-hidden">
              {/* Telegram Background Motifs */}
              <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#E5F0FA]/50 blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#FFE5D9]/50 blur-xl"></div>
              
              <div className="absolute top-8 left-8 md:left-16 opacity-20 transform -rotate-12 hidden sm:block">
                 <div className="bg-[#3390EC] text-white p-3 rounded-2xl rounded-tl-sm shadow-sm inline-block">
                    <MessageSquare className="w-6 h-6" />
                 </div>
              </div>
              <div className="absolute bottom-16 right-8 md:right-20 opacity-20 transform rotate-12 hidden sm:block">
                 <div className="bg-[#9A5034] text-white p-3 rounded-2xl rounded-tr-sm shadow-sm inline-block">
                    <Send className="w-6 h-6" />
                 </div>
              </div>

              <div className="relative z-10">
                 <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-[#0088CC] to-[#3390EC] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#3390EC]/30">
                    <Send className="w-7 h-7 text-white -ml-1 mt-1" />
                 </div>
                 <h2 className="title-font text-3xl md:text-5xl font-extrabold text-[var(--ink)] mb-6">
                   Siap mengotomasi campaign Anda?
                 </h2>
                 <p className="text-base text-slate-500 mb-10 max-w-2xl mx-auto">
                   Hemat waktu, jangkau lebih banyak audiens, dan biarkan Sendora yang bekerja menyebarkan pesan Anda ke ratusan grup Telegram.
                 </p>
                 <Link
                   href="/auth"
                   className="inline-flex items-center justify-center gap-3 rounded-xl bg-[var(--accent)] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#9A5034]/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:bg-[#8A452C]"
                 >
                   Join Now
                   <ArrowRight className="h-5 w-5" />
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
