// ============================================================
// SENDORA SITE CONTENT — SINGLE SOURCE OF TRUTH
// ============================================================
// File ini adalah SATU-SATUNYA sumber data konten website.
// Digunakan oleh: Frontend (halaman) + Chatbot (AI assistant).
//
// CARA UPDATE: Ubah nilai di bawah ini → chatbot otomatis
// mencerminkan perubahan tanpa perlu edit file lain.
// ============================================================

export const SITE_CONTENT = {

  // ── BRAND & TAGLINE ──────────────────────────────────────
  brand: {
    name: "Sendora",
    tagline: "Kirim pesan ke banyak grup Telegram dengan aman dan otomatis.",
    description:
      "Sendora membantu Anda mengatur pesan, memilih grup tujuan, dan menjalankan campaign lebih mudah dari satu dashboard.",
    badge: "Platform Auto Send Telegram",
    adminWhatsapp: "6288293680886",
  },

  // ── STATISTIK BERANDA ─────────────────────────────────────
  stats: {
    pesanTerkirim: "1M+",
    grupTarget: "50K+",
    uptimeWorker: "99%",
  },

  // ── FITUR UNGGULAN (3 badge di hero) ─────────────────────
  featureBadges: [
    { label: "Auto send\nmulti group" },
    { label: "Jadwal kirim\nfleksibel" },
    { label: "Dukung teks\n& media" },
  ],

  // ── 6 FITUR UTAMA (halaman /fitur) ───────────────────────
  mainFeatures: [
    {
      number: 1,
      title: "Autentikasi & Keamanan Akun",
      items: [
        "Login aman dengan Email & Password (Firebase)",
        "Riwayat login & perangkat",
        "Logout semua perangkat",
        "Validasi License Key",
      ],
    },
    {
      number: 2,
      title: "Integrasi Telegram",
      items: [
        "Login Telegram via OTP",
        "Sesi aman (MTProto)",
        "Deteksi profil otomatis (Nama, No. HP, Username)",
      ],
    },
    {
      number: 3,
      title: "Auto Send (Pesan Otomatis)",
      items: [
        "Kirim teks & media",
        "Atur jeda (delay) antar pengiriman",
        "Kontrol Start / Stop",
        "Bekerja di background",
      ],
    },
    {
      number: 4,
      title: "Manajemen Grup & Pembersihan Akun",
      items: [
        "Tarik data grup (Fetch Groups)",
        "Pilih grup target",
        "Keluar dari semua grup",
        "Hapus semua bot",
        "Keluar dari semua channel",
      ],
    },
    {
      number: 5,
      title: "Dashboard & Monitoring",
      items: [
        "Statistik harian",
        "Ringkasan grup aktif, pesan terkirim, media",
        "Notifikasi sistem & peringatan lisensi",
      ],
    },
    {
      number: 6,
      title: "Riwayat Pengiriman (Log)",
      items: [
        "Riwayat lengkap pengiriman",
        "Detail grup, waktu & status",
        "Status: Terkirim / Gagal",
      ],
    },
  ],

  // ── CARA KERJA (4 langkah) ────────────────────────────────
  howItWorks: [
    {
      step: 1,
      title: "Buat Akun",
      description: "Daftar, login, dan hubungkan nomor Telegram Anda dengan aman.",
    },
    {
      step: 2,
      title: "Tulis Pesan",
      description: "Buat pesan menarik, tambahkan gambar atau media pendukung.",
    },
    {
      step: 3,
      title: "Pilih Grup Target",
      description: "Kumpulkan dan masukkan daftar grup Telegram target Anda.",
    },
    {
      step: 4,
      title: "Auto Send!",
      description: "Pesan akan terkirim otomatis sesuai antrean dan jadwal Anda.",
    },
  ],

  // ── SIAPA YANG COCOK ──────────────────────────────────────
  useCases: [
    {
      title: "Marketing & Promosi",
      description:
        "Broadcast promo, diskon, atau peluncuran produk baru ke puluhan grup komunitas dengan sekali klik.",
    },
    {
      title: "Admin Komunitas",
      description:
        "Kirim pengumuman penting, aturan grup, atau jadwal event secara otomatis ke semua cabang grup yang dikelola.",
    },
    {
      title: "Customer Service",
      description:
        "Informasikan maintenance sistem, gangguan layanan, atau update terbaru ke grup VIP pelanggan Anda secara serentak.",
    },
  ],

  // ── KEAMANAN ─────────────────────────────────────────────
  security: [
    {
      title: "Custom Delay",
      description:
        "Atur jeda pengiriman dalam hitungan detik agar terlihat natural layaknya dikirim oleh manusia secara manual.",
    },
    {
      title: "Isolasi Sesi Telegram",
      description:
        "Data sesi login Telegram Anda dienkripsi tingkat tinggi dan disimpan aman secara lokal di server.",
    },
    {
      title: "Jeda Otomatis Anti-Spam",
      description:
        "Sistem antrean pintar mencegah pengiriman pesan bertubi-tubi yang memicu limitasi atau pembatasan dari pihak Telegram.",
    },
  ],

  // ── PAKET HARGA ───────────────────────────────────────────
  pricing: [
    {
      id: "7day",
      label: "Paling Ringkas",
      title: "7 Day",
      price: "Rp3.000",
      duration: "7 hari",
      description:
        "Cocok untuk pengguna yang ingin mencoba campaign Telegram dalam waktu singkat.",
      features: [
        "Akses dashboard Sendora",
        "Auto send ke grup Telegram",
        "Kirim teks & media",
        "Atur delay pengiriman",
        "Monitoring aktivitas",
        "Riwayat pengiriman",
      ],
    },
    {
      id: "30day",
      label: "Paling Populer",
      title: "30 Day",
      price: "Rp6.000",
      duration: "30 hari",
      description:
        "Cocok untuk pengguna yang menjalankan campaign lebih rutin dan lebih fleksibel.",
      features: [
        "Akses dashboard Sendora",
        "Auto send ke grup Telegram",
        "Kirim teks & media",
        "Atur delay pengiriman",
        "Monitoring aktivitas",
        "Riwayat pengiriman",
      ],
    },
  ],

  // ── FAQ HARGA ─────────────────────────────────────────────
  pricingFaq: [
    {
      question: "Apakah fitur paket 7 Day dan 30 Day berbeda?",
      answer: "Fitur utama tetap sama, perbedaannya ada pada masa aktif paket.",
    },
    {
      question: "Kapan paket mulai aktif?",
      answer: "Paket aktif setelah akun dan lisensi berhasil diaktivasi.",
    },
    {
      question: "Apakah saya bisa memilih paket sesuai kebutuhan?",
      answer:
        "Ya, Anda bisa memilih paket yang paling sesuai dengan durasi campaign Anda.",
    },
  ],

  // ── ALUR DASHBOARD ───────────────────────────────────────
  dashboardFlow: {
    steps: [
      {
        id: "CONNECT_TELEGRAM",
        title: "Hubungkan Telegram",
        description:
          "Masukkan nomor telepon Telegram (dengan pilihan kode negara dari dropdown multi-negara). Telegram akan mengirimkan kode OTP ke aplikasi Telegram resmi. Setelah berhasil, username atau nama depan Telegram otomatis terbaca dan ditampilkan.",
      },
      {
        id: "INPUT_KEY",
        title: "Aktivasi Key Lisensi",
        description:
          "Setelah Telegram terhubung, pengguna non-admin harus memasukkan key lisensi. Key lisensi didapat dari admin atau dibeli di menu Shop. Contoh format key: BT-07D-AB12-CD34. Ada tombol Logout Telegram untuk kembali ke tahap sebelumnya. Jika nomor Telegram sudah pernah menggunakan key yang masih aktif, tahap ini akan dilewati otomatis.",
      },
      {
        id: "READY",
        title: "Dashboard Siap",
        description: "Semua fitur dashboard terbuka dan bisa digunakan.",
      },
    ],
  },

  // ── TAB DASHBOARD ────────────────────────────────────────
  dashboardTabs: [
    {
      id: "overview",
      title: "Dashboard",
      description:
        "Menampilkan 4 kartu statistik: Pesan Terkirim Hari Ini, Total Pesan Terkirim, Grup Aktif, dan Media Dikirim. Ada grafik Activity Velocity (volume pengiriman per hari), Aktivitas Terbaru (log pengiriman), dan Peringatan Sistem.",
    },
    {
      id: "groups",
      title: "Groups (Grup Target)",
      description:
        "Menampilkan daftar semua grup Telegram yang dijadikan target pengiriman. Setiap grup menampilkan foto grup, nama grup, jumlah member, jumlah online. Cara menambahkan: klik Tambah Grup (manual) atau Fetch Grup (otomatis ambil dari akun Telegram). Grup bisa dihapus.",
    },
    {
      id: "messages",
      title: "Messages (Pesan)",
      description:
        "Digunakan untuk membuat dan mengelola konten pesan. Bisa ketik teks, upload media (gambar, video, file). Mode pengiriman: NOW (kirim langsung), SCHEDULE (jadwalkan tanggal & jam tertentu), REPEAT (kirim berulang dengan interval X menit/jam/hari). Klik Kirim untuk memulai campaign.",
    },
    {
      id: "logs",
      title: "Logs",
      description:
        "Menampilkan 3 jenis catatan: Log Sukses, Log Error, dan Peringatan Sistem. Setiap entri memiliki detail: nama grup, preview teks, status, dan timestamp (Hari, DD Bulan YYYY, HH:MM:SS).",
    },
    {
      id: "settings",
      title: "Settings (Pengaturan)",
      description:
        "Terbagi 3 bagian: Pengaturan Profil (username, email, role, ganti password), Pengaturan Telegram (status koneksi, nomor, username Telegram, sinkronisasi terakhir, tombol putuskan/hubungkan), dan Pengaturan Aplikasi (bahasa, zona waktu, format tanggal, tema, notifikasi).",
    },
    {
      id: "shop",
      title: "Shop (Toko Lisensi)",
      description:
        "Menampilkan 4 kartu status: Paket Aktif, Sisa Hari, Status Lisensi, Total Pembelian. Ada 2 pilihan paket (7 Day dan 30 Day). Di bawahnya ada Kartu Lisensi Aktif dan Tabel Riwayat Pembelian.",
    },
    {
      id: "admin",
      title: "Admin (Hanya Super Admin)",
      description:
        "Tab hanya terlihat untuk pengguna dengan role SUPER_ADMIN. Fitur: generate key lisensi baru (tentukan durasi), melihat daftar semua key beserta statusnya (Aktif/Tidak Aktif, terpakai atau belum), dan memantau penggunaan key oleh pengguna.",
    },
  ],

  // ── SISTEM LISENSI ───────────────────────────────────────
  licenseSystem: {
    description:
      "Key lisensi terikat ke nomor Telegram, bukan ke akun email. 1 key hanya bisa digunakan oleh 1 nomor Telegram. Ketika key pertama kali digunakan, nomor Telegram tersebut akan terikat permanen pada key tersebut.",
    rules: [
      "Jika pengguna logout Telegram dan login kembali dengan nomor yang SAMA, lisensi langsung aktif kembali tanpa perlu input key lagi.",
      "Jika pengguna mencoba menghubungkan nomor Telegram yang BERBEDA, mereka harus menggunakan key baru.",
      "Jika masa aktif key habis (expired), pengguna harus membeli paket baru di menu Shop.",
      "Admin (SUPER_ADMIN) tidak perlu key lisensi, bisa langsung menggunakan semua fitur.",
    ],
  },

  // ── FAQ UMUM ─────────────────────────────────────────────
  generalFaq: [
    {
      question: "Apakah Sendora aman?",
      answer:
        "Ya. Sendora menggunakan sistem delay pintar agar pengiriman terlihat natural. Risiko banned sangat kecil jika pengaturan delay digunakan dengan baik.",
    },
    {
      question: "Berapa harga Sendora?",
      answer:
        "Ada 2 paket: 7 hari seharga Rp3.000 dan 30 hari seharga Rp6.000. Keduanya memberikan akses penuh ke semua fitur.",
    },
    {
      question: "Bagaimana cara mulai menggunakan Sendora?",
      answer:
        "Daftar akun di halaman auth, hubungkan Telegram, masukkan key lisensi, lalu dashboard siap digunakan.",
    },
    {
      question: "Apakah bisa kirim ke banyak grup sekaligus?",
      answer:
        "Ya. Sendora dirancang khusus untuk mengirim pesan ke puluhan hingga ratusan grup Telegram sekaligus secara otomatis.",
    },
    {
      question: "Bagaimana cara mendapatkan key lisensi?",
      answer:
        "Key didapat dari admin atau bisa dibeli langsung di menu Shop di dalam dashboard.",
    },
    {
      question: "Apakah bisa kirim gambar atau video?",
      answer: "Ya. Sendora mendukung pengiriman teks, gambar, video, dan file lainnya.",
    },
    {
      question: "Bagaimana jika key saya expired?",
      answer:
        "Anda perlu membeli paket baru di menu Shop. Pilih paket 7 Day atau 30 Day sesuai kebutuhan.",
    },
    {
      question: "Apakah bisa jadwalkan pengiriman?",
      answer:
        "Ya. Ada mode SCHEDULE untuk menentukan tanggal dan jam tertentu, dan mode REPEAT untuk pengiriman berulang otomatis.",
    },
    {
      question: "Bagaimana cara menghubungi admin?",
      answer:
        "Hubungi admin melalui WhatsApp di nomor 6288293680886 atau gunakan fitur Help di dalam dashboard.",
    },
  ],
} as const;

// ── HELPER: Generate System Prompt untuk chatbot ──────────
// Fungsi ini membaca SITE_CONTENT dan menghasilkan prompt
// yang selalu up-to-date setiap kali ada perubahan konten.
export function generateChatbotPrompt(): string {
  const c = SITE_CONTENT;

  const fiturList = c.mainFeatures
    .map((f) => `  ${f.number}. ${f.title}\n${f.items.map((i) => `     - ${i}`).join("\n")}`)
    .join("\n");

  const pricingList = c.pricing
    .map(
      (p) =>
        `  Paket ${p.title} (${p.label}):\n  - Harga: ${p.price}\n  - Aktif selama: ${p.duration}\n  - ${p.description}\n  - Fitur: ${p.features.join(", ")}`
    )
    .join("\n\n");

  const tabList = c.dashboardTabs
    .map((t) => `  Tab ${t.title}:\n  ${t.description}`)
    .join("\n\n");

  const faqList = c.generalFaq
    .map((f) => `  T: ${f.question}\n  J: ${f.answer}`)
    .join("\n\n");

  const licenseRules = c.licenseSystem.rules.map((r) => `  - ${r}`).join("\n");

  const howItWorksList = c.howItWorks
    .map((h) => `  Langkah ${h.step} - ${h.title}: ${h.description}`)
    .join("\n");

  const securityList = c.security
    .map((s) => `  - ${s.title}: ${s.description}`)
    .join("\n");

  const useCaseList = c.useCases
    .map((u) => `  - ${u.title}: ${u.description}`)
    .join("\n");

  const pricingFaqList = c.pricingFaq
    .map((f) => `  T: ${f.question}\n  J: ${f.answer}`)
    .join("\n\n");

  return `Kamu adalah ${c.brand.name} Assistant, asisten virtual cerdas untuk website ${c.brand.name}.
Kamu harus menjawab SEMUA pertanyaan yang diajukan pengguna selama masih berhubungan dengan platform ${c.brand.name}.
Jawab selalu dalam Bahasa Indonesia, ramah, ringkas, dan teks biasa (tanpa tanda bintang, tanpa tanda kutip ganda, tanpa format markdown).

======= BRAND & TAGLINE =======

Nama platform: ${c.brand.name}
Tagline: ${c.brand.tagline}
Deskripsi: ${c.brand.description}
Kontak Admin (WhatsApp): ${c.brand.adminWhatsapp}

======= STATISTIK PLATFORM =======

- Pesan terkirim: ${c.stats.pesanTerkirim}
- Grup target: ${c.stats.grupTarget}
- Uptime worker: ${c.stats.uptimeWorker}

======= HALAMAN BERANDA =======

3 Fitur unggulan yang ditampilkan di beranda:
${c.featureBadges.map((b, i) => `  ${i + 1}. ${b.label.replace("\n", " ")}`).join("\n")}

Cara Kerja (${c.howItWorks.length} langkah):
${howItWorksList}

Target pengguna yang cocok menggunakan ${c.brand.name}:
${useCaseList}

======= KEAMANAN =======

${securityList}

======= FITUR UTAMA (Halaman /fitur) =======

${fiturList}

======= PAKET HARGA (Halaman /harga) =======

${pricingList}

FAQ Harga:
${pricingFaqList}

======= ALUR DASHBOARD =======

${c.dashboardFlow.steps.map((s) => `Tahap: ${s.title}\n  ${s.description}`).join("\n\n")}

======= TAB DASHBOARD =======

${tabList}

======= SISTEM LISENSI =======

${c.licenseSystem.description}
${licenseRules}

======= PERTANYAAN UMUM (FAQ) =======

${faqList}

======= ATURAN MENJAWAB =======
1. Jawab dalam Bahasa Indonesia, ramah dan jelas
2. Jawab semua pertanyaan yang berkaitan dengan ${c.brand.name} berdasarkan informasi di atas
3. Jika tidak ada jawaban spesifik, jawab dengan informasi yang paling relevan
4. Jangan gunakan tanda bintang, tanda kutip ganda, atau format markdown apapun
5. Gunakan tanda strip (-) untuk daftar, tanda kutip tunggal jika perlu mengutip
6. Gunakan emoji secukupnya untuk keramahan
7. Jika ditanya tentang harga, sebutkan dengan jelas paket dan harganya
8. Jangan pernah menyebutkan bahwa kamu adalah AI atau Gemini — kamu adalah ${c.brand.name} Assistant
9. Jika pertanyaan benar-benar tidak ada hubungannya dengan ${c.brand.name}, tolak dengan sopan`;
}
