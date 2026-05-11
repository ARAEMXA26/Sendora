"use client";
import { Smartphone } from "lucide-react";

import { FormEvent, useState } from "react";
import { api } from "@/lib/client-api";
import { COUNTRIES } from "./countries";

interface TelegramConnectProps {
  onConnected: (role: "USER" | "SUPER_ADMIN") => void;
}

export function TelegramConnect({ onConnected }: TelegramConnectProps) {
  const [countryCode, setCountryCode] = useState("+62");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [websiteOtp, setWebsiteOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setRequestMessage(null);
    setWebsiteOtp(null);
    setLoading(true);
    try {
      const fullNumber = countryCode + phoneNumber.replace(/^0+/, "");
      const response = await api<{
        message: string;
        channel: "TELEGRAM" | "WEBSITE";
        websiteOtp?: string;
      }>("/api/telegram/request-otp", {
        method: "POST",
        body: JSON.stringify({ nomorTelegram: fullNumber }),
      });
      setRequestMessage(response.message);
      if (response.channel === "WEBSITE" && response.websiteOtp) {
        setWebsiteOtp(response.websiteOtp);
        setOtp(response.websiteOtp);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal request OTP",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api<{
        role: "USER" | "SUPER_ADMIN";
        redirectTo?: string;
      }>("/api/telegram/verify-otp", {
        method: "POST",
        body: JSON.stringify({ otp }),
      });
      setOtp("");
      if (response.redirectTo) {
        window.location.href = response.redirectTo;
      } else {
        onConnected(response.role);
      }
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Gagal verifikasi OTP",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto items-center mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#FFF0E0] text-[#9A5034] p-5 rounded-2xl shadow-sm border border-[#F0E6D8] ring-4 ring-white">
        <svg
          className="w-12 h-12"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-7.054 4.436-2.956-.918c-.642-.203-.658-.64.135-.954l11.536-4.443c.538-.196 1.006.128.844.809z" />
        </svg>
      </div>

      <div className="w-full glass-card bg-white shadow-lg border border-[#F0E6D8] rounded-[2rem] p-8 md:p-10 relative">
        {/* Dekorasi BG */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FFF0E0] to-transparent opacity-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <h2 className="title-font text-[22px] font-extrabold text-center mb-8 text-[#9A5034] flex items-center justify-center gap-3">
          <Smartphone
            className="w-6 h-6 text-[#C4A88E]"
            strokeWidth={2.5}
          />
          Koneksikan Akun
        </h2>

        {!requestMessage ? (
          <form className="space-y-6" onSubmit={requestOtp}>
            <p className="text-[13px] text-center text-slate-600 font-medium leading-relaxed">
              Masukkan Nomor Telepon Telegram Anda untuk memvalidasi akses.
              Sistem akan membedakan akses Admin Panel dan User biasa.
            </p>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#9A5034] ml-1">Nomor Telepon</label>
              <div className="flex gap-2 relative">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-[110px] h-full flex items-center justify-center gap-2 rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-3 py-3.5 text-[14px] font-bold text-[#9A5034] hover:bg-[#FFF0E0] focus:outline-none focus:border-[#9A5034] focus:ring-4 focus:ring-[#9A5034]/10 transition-all cursor-pointer"
                  >
                    <span className="text-lg">{COUNTRIES.find(c => c.code === countryCode)?.flag || "🌍"}</span>
                    <span>{countryCode}</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-[240px] max-h-[250px] overflow-y-auto rounded-xl border border-[#F0E6D8] bg-white shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                        {COUNTRIES.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] hover:bg-[#FFF0E0] hover:text-[#9A5034] transition-colors ${
                              countryCode === c.code ? 'bg-[#FFF0E0] text-[#9A5034] font-bold' : 'text-slate-700 font-medium'
                            }`}
                          >
                            <span className="text-lg leading-none">{c.flag}</span>
                            <span className="w-10 text-slate-500 font-mono text-xs">{c.code}</span>
                            <span className="truncate flex-1">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <input
                  required
                  type="tel"
                  placeholder="81234567890"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="flex-1 w-full min-w-0 rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-5 py-3.5 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#9A5034] focus:ring-4 focus:ring-[#9A5034]/10 transition-all placeholder-slate-400"
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full rounded-xl bg-[var(--accent)] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-[var(--accent-soft)]"
              type="submit"
            >
              {loading ? "Memproses..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={verifyOtp}>
            <div className="rounded-xl border border-[#D4B89C] bg-[#FFF8F0] px-4 py-3 text-[13px] font-medium text-[#9A5034] text-center shadow-sm">
              {requestMessage}
            </div>
            {websiteOtp ? (
              <div className="rounded-xl border border-[#D4B89C] bg-[#FFF8F0] px-4 py-3 text-[13px] text-[#9A5034] text-center shadow-sm">
                Kode Verifikasi:{" "}
                <span className="font-extrabold tracking-widest text-lg ml-2">
                  {websiteOtp}
                </span>
              </div>
            ) : null}
            <div className="space-y-2 mt-4">
               <label className="text-[12px] font-bold text-[#9A5034] ml-1 text-center block">Masukkan Kode OTP</label>
               <input
                 required
                 value={otp}
                 onChange={(event) => setOtp(event.target.value)}
                 placeholder="000000"
                 className="w-full rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-4 focus:outline-none focus:border-[#9A5034] focus:ring-4 focus:ring-[#9A5034]/10 text-center tracking-[0.5em] text-2xl font-mono font-bold text-[#9A5034] transition-all placeholder-slate-300"
               />
            </div>
            <button
              disabled={loading}
              className="w-full rounded-xl bg-[var(--accent)] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all px-4 py-3.5 text-[14px] font-bold text-white shadow-md shadow-[var(--accent-soft)] mt-2"
              type="submit"
            >
              {loading ? "Memverifikasi..." : "Verifikasi Kode"}
            </button>
            <button
              type="button"
              className="w-full text-[13px] text-slate-500 font-bold hover:text-[#9A5034] transition-colors pt-2"
              onClick={() => {
                setRequestMessage(null);
                setOtp("");
              }}
            >
              Kembali
            </button>
          </form>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700 text-center shadow-sm animate-in fade-in duration-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
