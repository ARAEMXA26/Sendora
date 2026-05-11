import { ok, fail } from "@/lib/http";
import { generateChatbotPrompt } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// =====================================================================
// SYSTEM PROMPT — Dibaca otomatis dari src/lib/site-content.ts
// Cukup ubah konten di site-content.ts → chatbot langsung update.
// =====================================================================
const SYSTEM_PROMPT = generateChatbotPrompt();

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

    // Convert chat history ke format Gemini
    const geminiContents = messages.slice(-10).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Semua model Gemini yang tersedia — dicoba berurutan jika ada yang down
    const MODELS = [
      "gemini-2.5-flash-lite",    // tercepat & paling hemat
      "gemini-2.5-flash",         // cepat, kualitas baik
      "gemini-2.0-flash",         // stabil
      "gemini-2.0-flash-001",     // versi stabil 2.0
      "gemini-flash-lite-latest", // alias lite terbaru
      "gemini-flash-latest",      // alias flash terbaru
      "gemini-2.5-pro",           // terbesar, paling pintar
      "gemini-pro-latest",        // alias pro terbaru
      "gemini-3-flash-preview",   // model generasi 3 (preview)
      "gemini-3-pro-preview",     // model generasi 3 pro (preview)
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

      // Jika 503 (overload) atau 429 (rate limit), coba model berikutnya
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
