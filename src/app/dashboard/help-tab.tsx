"use client";
import { useState } from "react";
import {
  HelpCircle,
  Search,
  LayoutDashboard,
  Users,
  MessageSquare,
  Clock,
  Settings,
  Shield,
  Send,
  BookOpen,
  Compass,
  MessageCircle,
  ChevronRight,
  ExternalLink,
  Info,
  ShoppingBag,
} from "lucide-react";

type HelpTabProps = {
  setActiveTab: (tab: string) => void;
};

const featureDescriptions = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Melihat ringkasan aktivitas sistem, status worker, jumlah grup, pesan, dan campaign.",
  },
  {
    icon: Users,
    title: "Groups",
    description:
      "Mengelola daftar grup Telegram yang akan menjadi target pengiriman pesan.",
  },
  {
    icon: MessageSquare,
    title: "Messages",
    description:
      "Membuat, mengatur, dan menyimpan pesan teks atau media untuk pengiriman otomatis.",
  },
  {
    icon: Clock,
    title: "Logs",
    description:
      "Melihat riwayat aktivitas sistem, status pengiriman, dan error.",
  },
  {
    icon: HelpCircle,
    title: "Help",
    description:
      "Pusat bantuan untuk mempelajari fungsi fitur dan panduan penggunaan Sendora.",
  },
  {
    icon: ShoppingBag,
    title: "Shop",
    description:
      "Membeli paket lisensi untuk membuka akses penuh ke seluruh fitur otomasi Sendora.",
  },
  {
    icon: Settings,
    title: "Settings",
    description:
      "Mengatur akun, aplikasi, telegram, keamanan, dan preferensi sistem.",
  },
];

const usageGuides = [
  {
    number: 1,
    title: "Cara Menghubungkan Telegram",
    steps: [
      "Buka Settings",
      "Pilih Telegram",
      "Klik Hubungkan Telegram",
      "Masukkan nomor & OTP",
      "Selesai tersambung",
    ],
  },
  {
    number: 2,
    title: "Cara Menambahkan Grup",
    steps: [
      "Buka Groups",
      "Klik Add New Group",
      "Masukkan username/link/ID",
      "Klik Add Group",
    ],
  },
  {
    number: 3,
    title: "Cara Membuat Pesan",
    steps: [
      "Buka Messages",
      "Upload media jika perlu",
      "Tulis isi pesan",
      "Pilih grup tujuan",
      "Klik Simpan Pesan",
    ],
  },
  {
    number: 4,
    title: "Cara Mengatur Kirim Berulang",
    steps: [
      "Pilih mode Kirim Berulang",
      "Atur interval waktu",
      "Tentukan jumlah pengiriman",
      "Simpan pesan",
    ],
  },
  {
    number: 5,
    title: "Cara Melihat Logs",
    steps: [
      "Buka Logs",
      "Lihat aktivitas pengiriman",
      "Periksa status & error",
    ],
  },
];

const quickNavCards = [
  {
    icon: Compass,
    title: "Panduan Memulai",
    description: "Langkah awal menggunakan Sendora",
    color: "from-[#B04C2E] to-[#D96B40]",
  },
  {
    icon: Users,
    title: "Kelola Grup",
    description: "Panduan target grup Telegram",
    color: "from-[#B04C2E] to-[#D96B40]",
  },
  {
    icon: Send,
    title: "Buat Pesan",
    description: "Kelola pesan teks & media",
    color: "from-[#B04C2E] to-[#D96B40]",
  },
  {
    icon: Clock,
    title: "Riwayat Logs",
    description: "Pantau aktivitas & error sistem",
    color: "from-[#B04C2E] to-[#D96B40]",
  },
];

export default function HelpTab({ setActiveTab }: HelpTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeatures = featureDescriptions.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = usageGuides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="mb-2">
        <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-2 flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-[#9A5034]" />
          Help Center
        </h2>
        <p className="text-[13px] font-medium text-slate-500 max-w-2xl">
          Pelajari fungsi setiap fitur Sendora dan ikuti panduan penggunaannya
          untuk menjalankan campaign Telegram dengan lebih mudah.
        </p>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickNavCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="group bg-white p-5 rounded-2xl border border-[#F0E6D8] shadow-sm hover:shadow-md hover:border-[#D96B40] transition-all duration-300 cursor-pointer flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0 shadow-md shadow-[#B04C2E]/15 group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[var(--ink)] text-sm group-hover:text-[#B04C2E] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Search className="w-5 h-5 text-[#9A5034]" />
          <span className="font-bold text-sm text-[var(--ink)]">
            Cari Bantuan
          </span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari fitur atau panduan penggunaan..."
          className="flex-1 min-w-0 rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-2.5 text-sm focus:border-[#9A5034] focus:bg-white focus:outline-none transition-colors placeholder:text-slate-400"
        />
        <button className="p-2 rounded-xl hover:bg-[#FFF0E0] transition-colors text-slate-400 hover:text-[#9A5034]">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content: Feature Descriptions + Usage Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Penjelasan Fitur */}
        <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center gap-2 shrink-0">
            <Info className="w-5 h-5 text-[#9A5034]" />
            <h3 className="font-bold text-[#9A5034] text-sm">
              Penjelasan Fitur
            </h3>
          </div>
          <div className="flex flex-col divide-y divide-[#F0E6D8]">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-[#FDFBF8] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-[#B04C2E]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-bold text-[var(--ink)] mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-[12px] text-slate-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                Tidak ditemukan fitur yang cocok.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Cara Penggunaan */}
        <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center gap-2 shrink-0">
            <BookOpen className="w-5 h-5 text-[#9A5034]" />
            <h3 className="font-bold text-[#9A5034] text-sm">
              Cara Penggunaan
            </h3>
          </div>
          <div className="flex flex-col divide-y divide-[#F0E6D8]">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide, i) => (
                <div
                  key={i}
                  className="px-5 py-4 hover:bg-[#FDFBF8] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B04C2E] to-[#D96B40] flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-xs font-bold">
                        {guide.number}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-bold text-[var(--ink)]">
                      {guide.title}
                    </h4>
                  </div>
                  <div className="ml-11 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {guide.steps.map((step, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2 text-[12px] text-slate-600"
                      >
                        <span className="font-bold text-[#B04C2E] shrink-0 mt-px">
                          {j + 1}.
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                Tidak ditemukan panduan yang cocok.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA: Butuh Bantuan Lain? */}
      <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF0E0] flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-[#B04C2E]" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--ink)] text-base">
              Butuh Bantuan Lain?
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Gunakan panduan di atas untuk memahami fitur Sendora dan alur
              penggunaannya.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/6288293680886"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#B04C2E] text-[#B04C2E] font-bold text-sm hover:bg-[#B04C2E] hover:text-white transition-all duration-300 shrink-0 shadow-sm hover:shadow-md"
        >
          Hubungi Admin
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
