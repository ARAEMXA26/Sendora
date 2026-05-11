import { useState, useEffect } from "react";
import { 
  Gift, Calendar, ShieldCheck, Wallet, 
  CheckCircle2, CreditCard, ShoppingCart, Star, Zap, ShoppingBag,
  ShieldAlert, ShieldX, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface LicenseKey {
  id: string;
  kodeKey: string;
  durasiHari: number;
  createdAt: string;
  expiresAt: string;
  statusTerpakai: boolean;
  price?: number;
  packageName?: string;
}

interface ShopTabProps {
  user: any;
  isLicenseActive: boolean;
}

export default function ShopTab({ user, isLicenseActive }: ShopTabProps) {
  const [history, setHistory] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [activeLicense, setActiveLicense] = useState<LicenseKey | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/shop/history");
      const data = await res.json();
      if (res.ok) {
        setHistory(data.history || []);
        // Find the active license: the most recently used one that hasn't expired yet
        let active = data.history.find((k: LicenseKey) => new Date(k.expiresAt).getTime() > Date.now());
        // If no active license found, take the most recent one to show what was used last
        if (!active && data.history.length > 0) {
          active = data.history[0];
        }
        setActiveLicense(active || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handlePurchase = async (durationDays: number) => {
    setPurchasing(true);
    const toastId = toast.loading(`Sedang memproses pembelian ${durationDays} Day...`);
    
    try {
      const res = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationDays }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || "Pembelian berhasil!", { id: toastId });
        // Auto reload page to reflect user's new key status, or just refetch history
        // Reloading is safer to ensure all tabs get the new user state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(data.message || "Pembelian gagal", { id: toastId });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem", { id: toastId });
    } finally {
      setPurchasing(false);
    }
  };

  const calculateRemainingDays = (expiresAt: string) => {
    const remaining = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-2">
          <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#9A5034]" />
            Shop
          </h2>
          <p className="text-[13px] font-medium text-slate-500">
            Kelola pembelian paket dan lihat status lisensi Anda di satu tempat.
          </p>
        </div>

        {/* 4 Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="flex items-center gap-4 rounded-3xl p-5 border border-[#F0E6D8] bg-white shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0E0] flex items-center justify-center shrink-0">
              <Gift className="w-7 h-7 text-[#B04C2E]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-500">Paket Aktif</p>
              <h3 className="title-font text-[20px] font-bold text-[var(--ink)] leading-tight mt-0.5">
                {activeLicense ? `${activeLicense.durasiHari} Day` : "-"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeLicense ? "Paket Premium" : "Belum ada paket"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl p-5 border border-[#F0E6D8] bg-white shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0E0] flex items-center justify-center shrink-0">
              <Calendar className="w-7 h-7 text-[#B04C2E]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-500">Sisa Hari</p>
              <h3 className="title-font text-[20px] font-bold text-[var(--ink)] leading-tight mt-0.5">
                {activeLicense ? `${calculateRemainingDays(activeLicense.expiresAt)} Hari` : "-"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeLicense ? `Berakhir ${new Date(activeLicense.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl p-5 border border-[#F0E6D8] bg-white shadow-sm">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isLicenseActive ? "bg-emerald-50" : "bg-rose-50"}`}>
              {isLicenseActive ? (
                <ShieldCheck className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
              ) : (
                <ShieldAlert className="w-7 h-7 text-rose-500" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Lisensi</p>
              <h3 className={`title-font text-[18px] font-extrabold leading-tight whitespace-nowrap ${isLicenseActive ? "text-emerald-500" : "text-rose-500"}`}>
                {isLicenseActive ? "Aktif" : "Non-aktif"}
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">
                {isLicenseActive ? "Lisensi valid" : "Masa aktif habis"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl p-5 border border-[#F0E6D8] bg-white shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0E0] flex items-center justify-center shrink-0">
              <Wallet className="w-7 h-7 text-[#B04C2E]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-slate-500">Total Pembelian</p>
              <h3 className="title-font text-[20px] font-bold text-[var(--ink)] leading-tight mt-0.5">
                {history.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Total transaksi</p>
            </div>
          </div>

        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* 7 Day Plan */}
          <div className="bg-white rounded-[32px] p-8 border border-[#F0E6D8] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[var(--accent)] hover:ring-1 hover:ring-[var(--accent)]">
            <div className="absolute top-0 right-0 bg-[#FFF0E0] text-[var(--accent)] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
              <Star className="w-3 h-3" /> Paling Ringkas
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-[var(--ink)]">7 Day</h3>
              <div className="flex items-baseline gap-1 mt-2 mb-1">
                <span className="text-[36px] font-bold text-[var(--ink)] tracking-tight">Rp3.000</span>
              </div>
              <p className="text-[13px] font-medium text-slate-500 pb-5 border-b border-[#F0E6D8]">Aktif selama 7 hari</p>
              <p className="text-[13px] text-slate-500 mt-5 leading-relaxed">
                Cocok untuk pengguna yang ingin mencoba campaign Telegram dalam waktu singkat.
              </p>
            </div>
            
            <div className="mt-8 flex-1">
              <ul className="space-y-3.5 mb-8">
                {["Akses dashboard Sendora", "Auto send ke grup Telegram", "Kirim teks & media", "Atur delay pengiriman", "Monitoring aktivitas", "Riwayat pengiriman"].map((ft, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-600 font-medium">{ft}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePurchase(7)}
                disabled={purchasing}
                className="w-full bg-[var(--accent)] hover:bg-[#9A5034] text-white font-bold py-3.5 rounded-xl text-[14px] transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                Pilih Paket
              </button>
            </div>
          </div>

          {/* 30 Day Plan */}
          <div className="bg-white rounded-[32px] p-8 border border-[#F0E6D8] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[var(--accent)] hover:ring-1 hover:ring-[var(--accent)]">
            <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3" fill="currentColor" /> Paling Populer
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-[var(--ink)]">30 Day</h3>
              <div className="flex items-baseline gap-1 mt-2 mb-1">
                <span className="text-[36px] font-bold text-[var(--ink)] tracking-tight">Rp6.000</span>
              </div>
              <p className="text-[13px] font-medium text-slate-500 pb-5 border-b border-[#F0E6D8]">Aktif selama 30 hari</p>
              <p className="text-[13px] text-slate-500 mt-5 leading-relaxed">
                Cocok untuk pengguna yang menjalankan campaign lebih rutin dan lebih fleksibel.
              </p>
            </div>
            
            <div className="mt-8 flex-1">
              <ul className="space-y-3.5 mb-8">
                {["Akses dashboard Sendora", "Auto send ke grup Telegram", "Kirim teks & media", "Atur delay pengiriman", "Monitoring aktivitas", "Riwayat pengiriman"].map((ft, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-600 font-medium">{ft}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePurchase(30)}
                disabled={purchasing}
                className="w-full bg-[var(--accent)] hover:bg-[#9A5034] text-white font-bold py-3.5 rounded-xl text-[14px] transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                Pilih Paket
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section: Active License Details & Purchase History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active License Info */}
          <div className="bg-white rounded-[32px] border border-[#F0E6D8] shadow-sm flex flex-col overflow-hidden col-span-1">
            <div className="p-5 border-b border-[#F0E6D8] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-bold text-[15px] text-[var(--ink)]">Lisensi Aktif Saya</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-[13px] font-semibold text-slate-500">Paket Aktif</span>
                  <span className="text-[13px] font-bold text-[var(--ink)]">{activeLicense ? `${activeLicense.durasiHari} Day` : "-"}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-[13px] font-semibold text-slate-500">Status</span>
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${isLicenseActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {isLicenseActive ? "Aktif" : "Non-aktif"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-[13px] font-semibold text-slate-500">Tanggal Aktivasi</span>
                  <span className="text-[13px] font-bold text-[var(--ink)] text-right">
                    {activeLicense ? formatDate(activeLicense.createdAt) : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-[13px] font-semibold text-slate-500">Tanggal Berakhir</span>
                  <span className="text-[13px] font-bold text-[var(--ink)] text-right">
                    {activeLicense ? formatDate(activeLicense.expiresAt) : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-slate-500">Sisa Hari</span>
                  <span className="text-[13px] font-bold text-[#3B82F6]">
                    {activeLicense ? `${calculateRemainingDays(activeLicense.expiresAt)} Hari` : "-"}
                  </span>
                </div>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full mt-8 py-3 rounded-xl border-2 border-[var(--accent)] text-[var(--accent)] font-bold text-[13px] hover:bg-[#FFF0E0] transition-colors">
                Upgrade License
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-[32px] border border-[#F0E6D8] shadow-sm flex flex-col overflow-hidden col-span-1 lg:col-span-2">
            <div className="p-5 border-b border-[#F0E6D8] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-bold text-[15px] text-[var(--ink)]">Riwayat Pembelian</h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-3 px-6 text-[12px] font-bold text-slate-500 border-b border-slate-200">Paket</th>
                    <th className="py-3 px-6 text-[12px] font-bold text-slate-500 border-b border-slate-200">Harga</th>
                    <th className="py-3 px-6 text-[12px] font-bold text-slate-500 border-b border-slate-200">Tanggal</th>
                    <th className="py-3 px-6 text-[12px] font-bold text-slate-500 border-b border-slate-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[13px] font-medium text-slate-400">
                        Memuat riwayat...
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[13px] font-medium text-slate-400">
                        Belum ada riwayat pembelian.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                        <td className="py-3.5 px-6 text-[13px] font-bold text-[var(--ink)]">{item.packageName}</td>
                        <td className="py-3.5 px-6 text-[13px] font-medium text-slate-600">
                          Rp{item.price?.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3.5 px-6 text-[13px] font-medium text-slate-600">{formatDate(item.createdAt)}</td>
                        <td className="py-3.5 px-6">
                          <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-1 rounded">Selesai</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {history.length > 0 && (
              <div className="p-4 border-t border-slate-100 text-center">
                <button className="text-[12px] font-bold text-slate-500 hover:text-[var(--accent)] transition-colors">
                  Lihat semua riwayat
                </button>
              </div>
            )}
          </div>

        </div>

    </section>
  );
}
