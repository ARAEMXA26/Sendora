import { ok, fail } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ============================================================
// STATIC BASE PROMPT — pengetahuan tetap tentang Sendora
// ============================================================
const BASE_PROMPT = `Kamu adalah Sendora Assistant, asisten virtual cerdas untuk website Sendora.
Kamu harus menjawab SEMUA pertanyaan yang diajukan pengguna selama masih berhubungan dengan platform Sendora.
Jawab selalu dalam Bahasa Indonesia, ramah, ringkas, dan teks biasa (tanpa tanda bintang, tanpa tanda kutip ganda, tanpa format markdown).

======= INFORMASI PLATFORM =======

Tagline utama: Kirim pesan ke banyak grup Telegram dengan aman dan otomatis.
Deskripsi: Sendora membantu Anda mengatur pesan, memilih grup tujuan, dan menjalankan campaign lebih mudah dari satu dashboard.

3 Fitur unggulan:
1. Auto send multi group — kirim pesan ke banyak grup sekaligus secara otomatis
2. Jadwal kirim fleksibel — atur waktu pengiriman sesuai kebutuhan
3. Dukung teks dan media — kirim pesan teks maupun file gambar/video

Cara Kerja (4 langkah):
Langkah 1 - Buat akun: Daftar dan verifikasi akun Anda dengan cepat.
Langkah 2 - Tambahkan pesan: Buat pesan dan unggah media yang ingin dikirim.
Langkah 3 - Pilih grup tujuan: Pilih grup Telegram yang ingin menjadi target pengiriman.
Langkah 4 - Jalankan campaign: Jalankan campaign dan pantau hasilnya di dashboard.

======= ALUR DASHBOARD =======

Tahap 1 - Hubungkan Telegram: Masukkan nomor telepon, dapat OTP dari Telegram resmi, masukkan OTP.
Tahap 2 - Aktivasi Key Lisensi: Masukkan key lisensi (format: BT-07D-AB12-CD34) yang didapat dari admin atau dibeli di Shop.
Tahap 3 - Dashboard Siap: Semua fitur terbuka dan bisa digunakan.

======= FITUR TAB DASHBOARD =======

Tab Groups: Daftar grup Telegram target. Bisa tambah manual atau Fetch otomatis dari akun Telegram.
Tab Messages: Buat pesan teks/media. Mode: NOW (langsung), SCHEDULE (jadwalkan), REPEAT (berulang).
Tab Logs: Riwayat pengiriman (sukses/gagal) dengan timestamp lengkap.
Tab Settings: Pengaturan profil, koneksi Telegram, dan aplikasi.
Tab Shop: Beli paket lisensi.
Tab Admin: Khusus Super Admin — generate dan pantau key lisensi.

======= SISTEM LISENSI =======

Key lisensi terikat ke nomor Telegram, bukan ke akun email.
1 key hanya bisa digunakan oleh 1 nomor Telegram.
Admin (SUPER_ADMIN) tidak perlu key lisensi.
Jika key expired, beli paket baru di menu Shop.

======= KEAMANAN =======

Sendora aman dari risiko banned Telegram:
- Sistem delay antar pengiriman yang bisa dikonfigurasi
- Pengiriman terlihat natural seperti dilakukan manusia
- Monitoring real-time

======= ATURAN MENJAWAB =======
1. Jawab dalam Bahasa Indonesia, ramah dan jelas
2. Jangan gunakan tanda bintang, tanda kutip ganda, atau format markdown apapun
3. Gunakan tanda strip (-) untuk daftar
4. Gunakan emoji secukupnya untuk keramahan
5. Jangan pernah menyebutkan bahwa kamu adalah AI atau Gemini
6. Jika pertanyaan tidak ada hubungannya dengan Sendora, tolak dengan sopan`;

// ============================================================
// FETCH DATA LIVE DARI DATABASE
// ============================================================
async function fetchLiveContext(): Promise<string> {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalUsers,
      totalKeys,
      totalKeysUsed,
      totalLogs,
      todayLogs,
      totalGroups,
      systemSetting,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.licenseKey.count(),
      prisma.licenseKey.count({ where: { statusTerpakai: true } }),
      prisma.sendLog.count({ where: { status: "TERKIRIM" } }),
      prisma.sendLog.count({
        where: { status: "TERKIRIM", createdAt: { gte: todayStart } },
      }),
      prisma.targetGroup.count(),
      prisma.systemSetting.findUnique({ where: { id: "GLOBAL" } }),
    ]);

    const maintenanceMode = systemSetting?.maintenanceMode ?? false;
    const updatedAt = systemSetting?.updatedAt
      ? new Date(systemSetting.updatedAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
      : "-";

    return `
======= DATA LIVE SENDORA (diperbarui otomatis) =======
Waktu sekarang: ${now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
Status sistem: ${maintenanceMode ? "MAINTENANCE (sedang dalam pemeliharaan)" : "ONLINE (berjalan normal)"}
Terakhir diperbarui: ${updatedAt}

Statistik platform:
- Total pengguna terdaftar: ${totalUsers} orang
- Total key lisensi dibuat: ${totalKeys} key
- Key lisensi yang sudah digunakan: ${totalKeysUsed} key
- Key lisensi belum digunakan: ${totalKeys - totalKeysUsed} key
- Total grup Telegram terdaftar di platform: ${totalGroups} grup
- Total pesan berhasil terkirim (sepanjang waktu): ${totalLogs} pesan
- Pesan terkirim hari ini: ${todayLogs} pesan

Paket yang tersedia:
- Paket 7 hari: Rp3.000 (cocok untuk mencoba)
- Paket 30 hari: Rp6.000 (paling populer)

Untuk bertanya tentang status atau statistik platform, gunakan data di atas sebagai referensi terkini.
=======================================================`;
  } catch (err) {
    console.error("[Chatbot] Gagal fetch live context:", err);
    return `
======= DATA LIVE =======
Status: Data live tidak tersedia saat ini. Gunakan informasi statis sebagai referensi.
=========================`;
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fail("Chatbot belum dikonfigurasi", 500);
    }

    const body = await request.json();
    const { messages } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return fail("Pesan tidak boleh kosong", 400);
    }

    // Fetch data live dari database (paralel dengan proses lainnya)
    const liveContext = await fetchLiveContext();

    // Gabungkan prompt statis + data live
    const SYSTEM_PROMPT = BASE_PROMPT + "\n\n" + liveContext;

    // Convert chat history ke format Gemini
    const geminiContents = messages.slice(-10).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Semua model Gemini yang tersedia — dicoba berurutan jika ada yang down
    const MODELS = [
      "gemini-2.5-flash-lite",   // tercepat & paling hemat
      "gemini-2.5-flash",        // cepat, kualitas baik
      "gemini-2.0-flash",        // stabil
      "gemini-2.0-flash-001",    // versi stabil 2.0
      "gemini-flash-lite-latest",// alias lite terbaru
      "gemini-flash-latest",     // alias flash terbaru
      "gemini-2.5-pro",          // terbesar, paling pintar
      "gemini-pro-latest",       // alias pro terbaru
      "gemini-3-flash-preview",  // model generasi 3 (preview)
      "gemini-3-pro-preview",    // model generasi 3 pro (preview)
    ];

    let data: any = null;
    let success = false;

    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const reqBody = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: geminiContents,
        generationConfig: { maxOutputTokens: 600, temperature: 0.5 },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      data = await response.json();

      if (response.ok) {
        success = true;
        break;
      }

      // Jika 503 (overload), coba model berikutnya
      if (data?.error?.code === 503 || data?.error?.code === 429) {
        console.warn(`[Chatbot] Model ${model} unavailable, trying next...`);
        continue;
      }

      // Error lain — langsung gagal
      console.error("[Chatbot] Gemini error:", JSON.stringify(data));
      return fail("Gagal menghubungi AI", 502);
    }

    if (!success) {
      return fail("Semua model AI sedang sibuk, coba lagi sebentar lagi", 503);
    }

    let reply =
      data.candidates?.[0]?.content?.parts
        ?.filter((p: any) => p.text)
        ?.map((p: any) => p.text)
        ?.join("") || "Maaf, saya tidak bisa menjawab saat ini.";

    // Bersihkan semua tanda markdown
    reply = reply
      .replace(/\*{1,3}/g, "")
      .replace(/"/g, "")
      .replace(/#{1,6}\s?/g, "")
      .replace(/`{1,3}/g, "")
      .replace(/_{1,2}/g, " ")
      .replace(/~~/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return ok({ reply });
  } catch (error) {
    console.error("[Chatbot] Error:", error);
    return fail("Terjadi kesalahan pada chatbot", 500);
  }
}
