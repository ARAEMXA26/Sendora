"use client";
import {
  Sparkles,
  Shield,
  Crown,
  Key,
  Settings,
  Zap,
  TrendingUp,
  Users,
  Target,
  Check,
  Trash2,
  Hourglass,
  Smartphone,
  Mail,
  AlarmClock,
  Eye,
  Edit,
  Globe,
  HardDrive,
  Cpu,
  Monitor,
  AlertTriangle,
  RotateCw,
  Unplug,
  Send,
  FileText,
  Clock,
  Server,
  UserCheck,
  XCircle,
  ChevronRight
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "@/components/confirm-modal";
import { LogoutButton } from "@/components/logout-button";
import { TelegramConnect } from "@/components/telegram-connect";
import { api } from "@/lib/client-api";

type AdminOverview = {
  overview: {
    users: number;
    keys: number;
    keysUsed: number;
    runningJobs: number;
    totalLogs: number;
    activeUsers: number;
    errorsToday: number;
    superAdminPhone: string;
  };
  adminActivities: Array<{
    id: string;
    userId: string;
    action: string;
    createdAt: string;
    user?: { email: string; role: string };
  }>;
  warnings: Array<{
    type: string;
    message: string;
    sub: string;
  }>;
  systemStats: {
    cpuUsage: number;
    memUsage: number;
    storageUsage: number;
    activeRequests: number;
  };
  systemSettings: {
    maintenanceMode: boolean;
  };
  users: Array<{
    id: string;
    email: string;
    role: "USER" | "SUPER_ADMIN";
    telegramVerified: boolean;
    nomorTelegram?: string;
    statusKey: "NONE" | "ACTIVE" | "EXPIRED";
  }>;
  keys: Array<{
    id: string;
    kodeKey: string;
    durasiHari: number;
    expiresAt: string;
    statusTerpakai: boolean;
  }>;
};

export default function AdminTab() {
  const router = useRouter();
  const [duration, setDuration] = useState<7 | 30>(7);
  const [state, setState] = useState<AdminOverview>({
    overview: { users: 0, keys: 0, keysUsed: 0, runningJobs: 0, totalLogs: 0, activeUsers: 0, errorsToday: 0, superAdminPhone: "" },
    adminActivities: [],
    warnings: [],
    systemStats: { cpuUsage: 0, memUsage: 0, storageUsage: 0, activeRequests: 0 },
    systemSettings: { maintenanceMode: false },
    users: [],
    keys: []
  });
  const [error, setError] = useState<string | null>(null);
  const [needsTelegram, setNeedsTelegram] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllKeys, setShowAllKeys] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    desc: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    desc: "",
    onConfirm: () => {},
  });

  async function reload() {
    const data = await api<AdminOverview>("/api/admin/overview");
    setState(data);
  }
  
  useEffect(() => {
    api<{ user: { id: string; role: "USER" | "SUPER_ADMIN"; telegramVerified: boolean } }>(
      "/api/me",
    )
      .then((me) => {
        if (me.user.role !== "SUPER_ADMIN" && me.user.telegramVerified) {
          router.replace("/dashboard");
          return;
        }
        if (!me.user.telegramVerified) {
          setNeedsTelegram(true);
          return;
        }
        setCurrentUserId(me.user.id);
        reload().catch((err) => {
          console.error(err);
          toast.error("Gagal memuat data. Mohon restart server Anda (npm run dev) jika ada pembaruan database.", { duration: 5000 });
        });
      })
      .catch(() => {
        router.replace("/auth");
      });
  }, [router]);

  async function generateKey() {
    setError(null);
    try {
      await api<{ key: { id: string } }>("/api/admin/keys", {
        method: "POST",
        body: JSON.stringify({ durationDays: duration }),
      });
      toast.success("Key lisensi baru berhasil dibuat.");
      await reload();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Gagal generate key",
      );
    }
  }

  async function deleteKey(keyId: string) {
    setConfirmDelete({
      isOpen: true,
      title: "Hapus Key Lisensi",
      desc: "Apakah anda yakin ingin menghapus key ini? Key yang sudah dihapus tidak dapat dipulihkan.",
      onConfirm: async () => {
        setConfirmDelete((p) => ({ ...p, isOpen: false }));
        try {
          await api<{ ok: boolean }>(`/api/admin/keys/${keyId}`, { method: "DELETE" });
          toast.success("Key berhasil dihapus");
          await reload();
        } catch (e) {
          toast.error("Gagal menghapus key");
        }
      },
    });
  }

  async function deleteUser(userId: string) {
    setConfirmDelete({
      isOpen: true,
      title: "Hapus Pengguna",
      desc: "Apakah anda yakin ingin menghapus user ini? Seluruh data user akan dihilangkan dari database dan session Firebase mereka akan hancur permanen.",
      onConfirm: async () => {
        setConfirmDelete((p) => ({ ...p, isOpen: false }));
        try {
          await api<{ ok: boolean }>(`/api/admin/users/${userId}`, { method: "DELETE" });
          toast.success("User berhasil dihapus");
          await reload();
        } catch (e) {
          toast.error("Gagal menghapus user");
        }
      },
    });
  }

  useEffect(() => {
    if (!state || needsTelegram) return;

    let active = true;
    const ticker = setInterval(() => {
      api<AdminOverview>("/api/admin/overview")
        .then((data) => {
          if (active) setState(data);
        })
        .catch(() => {
          // ignore error
        });
    }, 4000);

    return () => {
      active = false;
      clearInterval(ticker);
    };
  }, [state, needsTelegram]);

  if (needsTelegram) {
    return (
      <div className="w-full min-h-screen py-10">
        <header className="mb-6 flex justify-end">
          <LogoutButton />
        </header>
        <TelegramConnect
          onConnected={(role) => {
            if (role === "SUPER_ADMIN") {
              window.location.reload();
            } else {
              router.replace("/dashboard");
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-10">
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.title}
        description={confirmDelete.desc}
        onConfirm={confirmDelete.onConfirm}
        onCancel={() => setConfirmDelete((p) => ({ ...p, isOpen: false }))}
      />
      
      {/* HEADER */}
      <div className="mb-2">
        <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#9A5034]" />
          Admin Panel
        </h2>
        <p className="text-[13px] font-medium text-slate-500">Kelola user, lisensi, akses sistem, dan kontrol website dari satu halaman.</p>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {/* ROW 1: METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <Users className="w-4 h-4" />
            <p className="text-xs font-semibold">Total User</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.users}</h2>
        </article>
         
        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <Key className="w-4 h-4" />
            <p className="text-xs font-semibold">Total Key</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.keys}</h2>
        </article>

        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <Zap className="w-4 h-4" />
            <p className="text-xs font-semibold">Key Terpakai</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.keysUsed}</h2>
        </article>

        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <Settings className="w-4 h-4" />
            <p className="text-xs font-semibold">Running Job</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.runningJobs}</h2>
        </article>

        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <FileText className="w-4 h-4" />
            <p className="text-xs font-semibold">Total Log</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.totalLogs.toLocaleString('id-ID')}</h2>
        </article>

        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <UserCheck className="w-4 h-4" />
            <p className="text-xs font-semibold">User Aktif</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.activeUsers}</h2>
        </article>

        <article className="rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-[#9A5034]">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-xs font-semibold">Error Hari Ini</p>
          </div>
          <h2 className="title-font text-2xl font-bold text-[#7A3F2E]">{state.overview.errorsToday}</h2>
        </article>
      </section>

      {/* ROW 2: CONTROLS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Generate Key */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-[#9A5034]" />
              <h2 className="font-bold text-[#9A5034] text-sm">Generate Key Lisensi</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">Buat key lisensi baru dengan cepat sesuai durasi yang dipilih.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">Durasi Lisensi</label>
            <div className="flex items-center gap-3">
              <select
                value={duration}
                onChange={(event) =>
                  setDuration(Number(event.target.value) as 7 | 30)
                }
                className="flex-1 rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]"
              >
                <option value={7}>7 Hari</option>
                <option value={30}>30 Hari</option>
              </select>
              <button
                type="button"
                onClick={generateKey}
                className="rounded-xl bg-[#B04C2E] hover:bg-[#7A3F2E] px-5 py-2.5 text-sm font-bold text-white transition-colors shadow-md shadow-[#B04C2E]/20"
              >
                Generate Key
              </button>
            </div>
          </div>
        </div>

        {/* Kontrol Web */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#9A5034]" />
            <h2 className="font-bold text-[#9A5034] text-sm">Kontrol Web</h2>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-semibold">Status Website</span>
                <span className="flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-semibold">Status Server</span>
                <span className="flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-semibold">Mode Maintenance</span>
                {state.systemSettings.maintenanceMode ? (
                   <span className="flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Aktif</span>
                ) : (
                   <span className="flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Nonaktif</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-semibold">Status Database</span>
                <span className="flex items-center gap-1.5 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={async () => {
                  const toastId = toast.loading("Memproses...");
                  try {
                     const res = await fetch("/api/admin/settings", {
                       method: "POST",
                       headers: { "Content-Type": "application/json" },
                       body: JSON.stringify({ maintenanceMode: !state.systemSettings.maintenanceMode })
                     });
                     if (!res.ok) throw new Error("Gagal mengubah setting");
                     toast.success(state.systemSettings.maintenanceMode ? "Maintenance dinonaktifkan" : "Maintenance diaktifkan", { id: toastId });
                     setState(prev => ({
                        ...prev,
                        systemSettings: { maintenanceMode: !prev.systemSettings.maintenanceMode }
                     }));
                  } catch (e) {
                     toast.error("Gagal", { id: toastId });
                  }
                }}
                className={`px-3 py-1.5 border rounded-lg text-[11px] font-semibold transition-colors ${state.systemSettings.maintenanceMode ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-[#F0E6D8] text-slate-500 hover:bg-[#FFF0E0] hover:text-[#9A5034]'}`}
              >
                {state.systemSettings.maintenanceMode ? "Nonaktifkan Maintenance" : "Aktifkan Maintenance"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROW 3: TABLES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Manajemen User */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#9A5034]" />
            <h2 className="font-bold text-[#9A5034] text-sm">Manajemen User</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#F0E6D8] text-slate-500 font-semibold whitespace-nowrap">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Telegram</th>
                  <th className="pb-3">Status Key</th>
                  <th className="pb-3">Status Akun</th>
                  <th className="pb-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-slate-500 font-medium">
                {(showAllUsers ? state.users : state.users.slice(0, 5)).map((user) => (
                  <tr key={user.id} className="border-b border-[#F0E6D8] last:border-0 hover:bg-[#FDFBF8] whitespace-nowrap">
                    <td className="py-3 pr-2">{user.email}</td>
                    <td className="py-3 pr-2">{user.role.replace('_', ' ')}</td>
                    <td className="py-3 pr-2">{user.nomorTelegram || "-"}</td>
                    <td className="py-3 pr-2">
                       {user.statusKey === 'ACTIVE' ? (
                          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                       ) : (
                          <span className="px-2 py-1 rounded bg-[#FDFBF8] text-slate-500 border border-[#F0E6D8]">Tidak Ada</span>
                       )}
                    </td>
                    <td className="py-3 pr-2">
                        <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-slate-500 hover:text-[#9A5034]"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="text-slate-500 hover:text-[#9A5034]"><Edit className="w-3.5 h-3.5" /></button>
                        {user.id !== currentUserId && (
                           <button onClick={() => deleteUser(user.id)} className="text-slate-500 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {state.users.length > 5 && (
            <div className="pt-4 border-t border-[#F0E6D8] mt-auto">
              <button 
                onClick={() => setShowAllUsers(!showAllUsers)}
                className="px-3 py-1.5 border border-[#F0E6D8] rounded-lg text-xs font-semibold text-slate-500 hover:bg-[#FFF0E0] hover:text-[#9A5034] transition-colors"
              >
                {showAllUsers ? "Sembunyikan" : "Lihat Semua User"}
              </button>
            </div>
          )}
        </div>

        {/* Manajemen Key */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-[#9A5034]" />
            <h2 className="font-bold text-[#9A5034] text-sm">Manajemen Key</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#F0E6D8] text-slate-500 font-semibold whitespace-nowrap">
                  <th className="pb-3">Kode</th>
                  <th className="pb-3">Durasi</th>
                  <th className="pb-3">Expired</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Digunakan Oleh</th>
                  <th className="pb-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-slate-500 font-medium">
                {(showAllKeys ? state.keys : state.keys.slice(0, 5)).map((key) => {
                   const usedBy = state.users.find(u => u.statusKey === 'ACTIVE' && key.statusTerpakai)?.email || "-";
                   return (
                  <tr key={key.id} className="border-b border-[#F0E6D8] last:border-0 hover:bg-[#FDFBF8] whitespace-nowrap">
                    <td className="py-3 pr-2 font-mono text-[11px] text-slate-700">{key.kodeKey}</td>
                    <td className="py-3 pr-2">{key.durasiHari} Hari</td>
                    <td className="py-3 pr-2">{new Date(key.expiresAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="py-3 pr-2">
                       {key.statusTerpakai ? (
                          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                       ) : (
                          <span className="px-2 py-1 rounded bg-[#FDFBF8] text-slate-500 border border-[#F0E6D8]">Tidak Aktif</span>
                       )}
                    </td>
                    <td className="py-3 pr-2 truncate max-w-[120px]">{key.statusTerpakai ? usedBy : "-"}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-slate-500 hover:text-[#9A5034]" onClick={() => {
                            navigator.clipboard.writeText(key.kodeKey);
                            toast.success("Key tersalin!");
                        }}><FileText className="w-3.5 h-3.5" /></button>
                        <button className="text-slate-500 hover:text-[#9A5034]"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteKey(key.id)} className="text-slate-500 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          {state.keys.length > 5 && (
            <div className="pt-4 border-t border-[#F0E6D8] mt-auto">
              <button 
                onClick={() => setShowAllKeys(!showAllKeys)}
                className="px-3 py-1.5 border border-[#F0E6D8] rounded-lg text-xs font-semibold text-slate-500 hover:bg-[#FFF0E0] hover:text-[#9A5034] transition-colors"
              >
                {showAllKeys ? "Sembunyikan" : "Lihat Semua Key"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ROW 4: MONITORING & INFO */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Aktivitas Admin */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col shadow-sm">
           <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#9A5034]" />
            <h2 className="font-bold text-[#9A5034] text-sm">Aktivitas Admin</h2>
          </div>
          <div className="flex-1">
            {state.adminActivities.length > 0 ? (
              <ul className="space-y-4 text-[11px] font-medium text-slate-500">
                {state.adminActivities.map((activity) => (
                  <li key={activity.id} className="flex justify-between items-start">
                    <span className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1 shrink-0"></div> 
                      {activity.action}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(activity.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 mt-4 text-center">Belum ada aktivitas admin</p>
            )}
          </div>
          <div className="pt-4 border-t border-[#F0E6D8] mt-4">
            <button className="px-3 py-1.5 border border-[#F0E6D8] rounded-lg text-xs font-semibold text-slate-500 hover:bg-[#FFF0E0] hover:text-[#9A5034] transition-colors">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>

        {/* Monitoring Sistem */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col shadow-sm">
           <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-[#9A5034]" />
            <h2 className="font-bold text-[#9A5034] text-sm">Monitoring Sistem</h2>
          </div>
          <div className="space-y-4 text-xs font-semibold text-slate-500 flex-1">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 w-28"><Cpu className="w-4 h-4 text-[#9A5034]" /> CPU Usage</span>
              <div className="flex-1 bg-[#FFF0E0] h-1.5 rounded-full mx-3 overflow-hidden">
                 <div className="bg-[#9A5034] h-full rounded-full transition-all duration-500" style={{ width: `${state.systemStats.cpuUsage}%` }}></div>
              </div>
              <span className="w-8 text-right">{state.systemStats.cpuUsage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 w-28"><Server className="w-4 h-4 text-[#9A5034]" /> Memory Usage</span>
              <div className="flex-1 bg-[#FFF0E0] h-1.5 rounded-full mx-3 overflow-hidden">
                 <div className="bg-[#9A5034] h-full rounded-full transition-all duration-500" style={{ width: `${state.systemStats.memUsage}%` }}></div>
              </div>
              <span className="w-8 text-right">{state.systemStats.memUsage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 w-28"><HardDrive className="w-4 h-4 text-[#9A5034]" /> Storage Usage</span>
              <div className="flex-1 bg-[#FFF0E0] h-1.5 rounded-full mx-3 overflow-hidden">
                 <div className="bg-[#9A5034] h-full rounded-full transition-all duration-500" style={{ width: `${state.systemStats.storageUsage}%` }}></div>
              </div>
              <span className="w-8 text-right">{state.systemStats.storageUsage}%</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="flex items-center gap-2"><Send className="w-4 h-4 text-[#9A5034]" /> Request Aktif</span>
              <span className="font-bold">{state.systemStats.activeRequests} req/min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#9A5034]" /> Error Hari Ini</span>
              <span className="font-bold">{state.overview.errorsToday} error</span>
            </div>
          </div>
        </div>

        {/* Peringatan Admin */}
        <div className="rounded-2xl border border-[#F0E6D8] bg-white p-5 flex flex-col shadow-sm">
           <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#9A5034]" />
            <h2 className="font-bold text-[#9A5034] text-sm">Peringatan Admin</h2>
          </div>
          <div className="flex-1 space-y-4">
            {state.warnings.length > 0 ? (
              state.warnings.map((warn, i) => (
                <div key={i} className="flex gap-2">
                   {warn.type === 'key' ? <Key className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" /> : 
                    warn.type === 'user' ? <Users className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" /> :
                    warn.type === 'database' ? <HardDrive className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" /> :
                    <Globe className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />}
                   <div className="text-[11px] text-slate-500 font-medium">
                     <p className="font-bold text-slate-700">{warn.message}</p>
                     <p>{warn.sub}</p>
                   </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 mt-4 text-center">Tidak ada peringatan. Sistem berjalan normal.</p>
            )}
          </div>
          <div className="pt-4 border-t border-[#F0E6D8] mt-4">
            <button className="px-3 py-1.5 border border-[#F0E6D8] rounded-lg text-xs font-semibold text-slate-500 hover:bg-[#FFF0E0] hover:text-[#9A5034] transition-colors">
              Lihat Semua Peringatan
            </button>
          </div>
        </div>


      </section>
    </div>
  );
}
