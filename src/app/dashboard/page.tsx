"use client";
import {
  Sparkles,
  Zap,
  Globe,
  PenLine,
  Target,
  Check,
  AlertTriangle,
  Trash2, TrendingUp,
  Plus,
  RefreshCw,
  Bell,
  Hourglass,
  Pause,
  Clock,
  Gem,
  X,
  Send, HelpCircle, User,
  Network,
  CheckCircle,
  BarChart3,
  Image,
  History,
  FileText,
  MapPin,
  AlertCircle,
  ChevronDown,
  Calendar,
  ChevronUp,
  List,
  Server,
  Play,
  Database,
  Settings,
  ArrowUpCircle,
  ChevronRight,
  UserCircle,
  LayoutGrid,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  Smartphone,
  LayoutDashboard,
  Users as UsersIcon,
  MessageSquare,
  Search,
  Download,
  Grid,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, updatePassword } from "firebase/auth";
import { getFirebaseClientAuth, isFirebaseClientConfigured } from "@/lib/firebase-client";
import { ConfirmModal } from "@/components/confirm-modal";
import { toast } from "react-hot-toast";
import { LogoutButton } from "@/components/logout-button";
import { TelegramConnect } from "@/components/telegram-connect";
import { api } from "@/lib/client-api";
import { resolveNextRoute } from "@/lib/flow";
import { Sidebar, SidebarTab } from "./sidebar";
import AdminTab from "./admin-tab";
import ShopTab from "./shop-tab";
import GroupsTab from "./groups-tab";
import MessagesTab from "./messages-tab";
import HelpTab from "./help-tab";

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Group = {
  idGrup: string;
  namaGrup: string;
  source: "MANUAL" | "FETCH_ALL";
  photoUrl?: string | null;
  memberCount?: number | null;
  onlineCount?: number | null;
};

type Message = {
  idTeks: string;
  isiPesan: string;
  mediaUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deliveryMode?: string;
  msgTarget?: string | null;
  scheduleDate?: string | null;
  scheduleTime?: string | null;
  intervalNum?: number | null;
  intervalUnit?: string | null;
  sendCount?: number | null;
  status?: string;
};

type SendLog = {
  id: string;
  groupName: string;
  textPreview: string;
  status: "TERKIRIM" | "GAGAL";
  createdAt: string;
};

type AutoSendStatus = {
  delaySeconds: number;
  isRunning: boolean;
  msgTarget?: string | null;
};

type LogStats = {
  total: number;
  terkirim: number;
};

type DashboardStep = "CONNECT_TELEGRAM" | "READY";

type TodayStats = {
  sent: number;
  success: number;
  failed: number;
  successRate: number;
};

type ChartDataPoint = {
  label: string;
  dateStr: string;
  count: number;
};

type GroupDistributionData = {
  name: string;
  count: number;
  percentage: number;
};

type DashboardStatsData = {
  todayStats: TodayStats;
  chartData: ChartDataPoint[];
  groupDistribution: GroupDistributionData[];
};

type MePayload = {
  user: {
    role: "USER" | "SUPER_ADMIN";
    telegramVerified: boolean;
    telegramConnected?: boolean;
    telegramUsername?: string | null;
    statusKey: "NONE" | "ACTIVE" | "EXPIRED";
    id: string;
    email: string;
    nomorTelegram?: string | null;
  };
  license?: {
    id: string;
    kodeKey: string;
    expiresAt: string;
    durasiHari: number;
    statusTerpakai: boolean;
  } | null;
};

type ActiveSession = {
  token: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  lastActive?: string | null;
  createdAt: string;
  isCurrent?: boolean;
};

type LoginHistoryItem = {
  id: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<SendLog[]>([]);
  const [status, setStatus] = useState<AutoSendStatus>({
    delaySeconds: 10,
    isRunning: false,
  });
  const [stats, setStats] = useState<LogStats>({ total: 0, terkirim: 0 });
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsData>({
    todayStats: { sent: 0, success: 0, failed: 0, successRate: 0 },
    chartData: Array.from({ length: 7 }).map(() => ({ label: "", dateStr: "", count: 0 })),
    groupDistribution: []
  });
  const [groupInput, setGroupInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"NOW" | "SCHEDULE" | "REPEAT">("REPEAT");
  const [msgTarget, setMsgTarget] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [intervalNum, setIntervalNum] = useState("2");
  const [intervalUnit, setIntervalUnit] = useState("Jam");
  const [sendCount, setSendCount] = useState("5");
  const [delayInput, setDelayInput] = useState("10");
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<DashboardStep>("CONNECT_TELEGRAM");
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<MePayload["user"] | null>(null);
  const [currentLicense, setCurrentLicense] = useState<MePayload["license"] | null>(null);
  const [currentRole, setCurrentRole] = useState<"USER" | "SUPER_ADMIN">(
    "USER",
  );
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

  const [settingsForm, setSettingsForm] = useState({
    username: "admin123",
    email: "admin@bot-tele.com",
    role: "Admin",
    phone: "08123456789",
    language: "Indonesia",
    timezone: "WIB (UTC+7)",
    dateFormat: "DD/MM/YYYY",
    theme: "Light",
    notificationsActive: true,
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const [notificationToggles, setNotificationToggles] = useState({
    error: true,
    worker: true,
    telegram: false,
    emailAlert: false,
    systemWarning: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Groups tab state
  const [groupSearch, setGroupSearch] = useState("");
  const [groupViewMode, setGroupViewMode] = useState<"grid" | "list">("grid");
  const [groupSortBy, setGroupSortBy] = useState("members");
  const [groupStatusFilter, setGroupStatusFilter] = useState("all");
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const chartData = dashboardStats.chartData;
  const rawMax = Math.max(10, ...chartData.map(d => d.count));
  const getBounds = (val: number) => {
    if (val <= 100) return 100;
    if (val <= 500) return 500;
    if (val <= 1000) return 1000;
    if (val <= 2000) return 2000;
    if (val <= 5000) return 5000;
    return Math.ceil(val / 5000) * 5000;
  };
  const maxChartValue = getBounds(rawMax);
  const formatYAxis = (n: number) => n >= 1000 ? (n/1000).toFixed(1).replace('.0', '') + 'K' : Math.round(n).toString();
  const todayStats = dashboardStats.todayStats;
  const groupDistribution = dashboardStats.groupDistribution;

  const formatDateTime = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\./g, ':');
  };

  const totalSent = useMemo(
    () => logs.filter((item) => item.status === "TERKIRIM").length,
    [logs],
  ); 

  const isLicenseActive = useMemo(() => {
    if (currentRole === "SUPER_ADMIN") return true;
    if (currentUser?.statusKey !== "ACTIVE") return false;
    if (!currentLicense) return false;
    return new Date(currentLicense.expiresAt).getTime() > Date.now();
  }, [currentRole, currentUser, currentLicense]);

  const filteredGroups = groups.filter((g) =>
    g.namaGrup.toLowerCase().includes(groupInput.toLowerCase()),
  );

  async function fetchSessions() {
    try {
      const data = await api<{ activeSessions: ActiveSession[], loginHistory: LoginHistoryItem[] }>("/api/me/sessions");
      setActiveSessions(data.activeSessions);
      setLoginHistory(data.loginHistory);
    } catch (err) {
      // ignore
    }
  }

  const handleLogoutAll = async () => {
    try {
      await api("/api/me/sessions", { method: "DELETE" });
      toast.success("Semua perangkat lain telah di-logout");
      fetchSessions();
    } catch (err) {
      toast.error("Gagal melakukan logout perangkat lain");
    }
  };

  async function loadCoreData() {
    const [groupsResponse, messagesResponse, delayResponse, logsResponse] =
      await Promise.all([
        api<{ groups: Group[] }>("/api/groups"),
        api<{ messages: Message[] }>("/api/messages"),
        api<{ delaySeconds: number }>("/api/config/delay"),
        api<{ logs: SendLog[]; status: AutoSendStatus; stats: LogStats; dashboardStats: DashboardStatsData }>("/api/autosend/logs"),
      ]);

    setGroups(groupsResponse.groups);
    setMessages(messagesResponse.messages);
    setDelayInput(String(delayResponse.delaySeconds));
    setLogs(logsResponse.logs);
    setStatus(logsResponse.status);
    setStats(logsResponse.stats || { total: logsResponse.logs.length, terkirim: logsResponse.logs.filter(item => item.status === "TERKIRIM").length });
    if (logsResponse.dashboardStats) setDashboardStats(logsResponse.dashboardStats);
  }

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      try {
        const me = await api<MePayload>("/api/me");
        if (alive) {
          setCurrentRole(me.user.role);
          setCurrentUser(me.user);
          setCurrentLicense(me.license);
          setSettingsForm(p => ({
            ...p,
            username: me.user.email.split('@')[0],
            email: me.user.email,
            role: me.user.role === "SUPER_ADMIN" ? "Admin" : "User",
            phone: me.user.nomorTelegram || "-",
          }));
        }

        const destination = resolveNextRoute(me.user);
        if (destination !== "/dashboard") {
          router.replace(destination);
          return;
        }

        if (!me.user.telegramConnected) {
          if (alive) {
            setStep("CONNECT_TELEGRAM");
            setReady(true);
          }
          return;
        }

        // Always go to READY — key activation is now done from dashboard
        // Load core data for licensed/admin users, skip gracefully for others
        const isLicenseValid = me.user.role === "SUPER_ADMIN" || (
          me.user.statusKey === "ACTIVE" &&
          me.license &&
          new Date(me.license.expiresAt).getTime() > Date.now()
        );

        if (isLicenseValid) {
          await loadCoreData();
        }

        if (alive) {
          setStep("READY");
          setActiveTab("dashboard");
          setReady(true);
        }
      } catch {
        router.replace("/auth");
      }
    }

    bootstrap();

    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => {
    if (step !== "READY") {
      return;
    }

    let active = true;
    const ticker = setInterval(() => {
      fetchSessions();
      api<{ logs: SendLog[]; status: AutoSendStatus; stats: LogStats; dashboardStats: DashboardStatsData }>("/api/autosend/logs")
        .then((response) => {
          if (!active) return;
          setLogs(response.logs);
          setStatus(response.status);
          if (response.stats) setStats(response.stats);
          if (response.dashboardStats) setDashboardStats(response.dashboardStats);
        })
        .catch(() => {
          // diam saja jika error
        });
        
      api<{ notifications: Notification[] }>("/api/notifications")
        .then((resp) => {
          if (!active) return;
          setNotifications(resp.notifications);
        })
        .catch(() => {});
    }, 4000);

    return () => {
      active = false;
      clearInterval(ticker);
    };
  }, [step]);

  // No forced redirect — users can stay on dashboard tab and activate key from there

  async function onTelegramConnected(role: "USER" | "SUPER_ADMIN") {
    setCurrentRole(role);
    setError(null);

    try {
      const me = await api<MePayload>("/api/me");
      setCurrentRole(me.user.role);
      setCurrentUser(me.user);
      setCurrentLicense(me.license);

      if (!me.user.telegramConnected) {
        setStep("CONNECT_TELEGRAM");
        return;
      }

      // Load core data if already licensed or super admin
      const isLicenseValid = me.user.role === "SUPER_ADMIN" || (
        me.user.statusKey === "ACTIVE" &&
        me.license &&
        new Date(me.license.expiresAt).getTime() > Date.now()
      );

      if (isLicenseValid) {
        await loadCoreData();
      }

      // Always go to dashboard — key input widget is there
      setStep("READY");
      setActiveTab("dashboard");
    } catch {
      setStep("READY");
      setActiveTab("dashboard");
    }
  }

  async function activateLicense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLicenseLoading(true);
    try {
      await api<{ redirectTo: string }>("/api/license/validate", {
        method: "POST",
        body: JSON.stringify({ key: licenseKey }),
      });
      setLicenseKey("");
      setShowKeyModal(false);
      // Refresh user state so isLicenseActive becomes true immediately
      const me = await api<MePayload>("/api/me");
      setCurrentUser(me.user);
      setCurrentLicense(me.license);
      await loadCoreData();
      setStep("READY");
      setActiveTab("dashboard");
      toast.success("🎉 Lisensi berhasil diaktifkan! Semua fitur telah terbuka.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Validasi key gagal",
      );
    } finally {
      setLicenseLoading(false);
    }
  }

  async function addGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await api<{ group: Group }>("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name: groupInput, source: "MANUAL" }),
      });
      setGroupInput("");
      await loadCoreData();
      toast.success("Grup berhasil ditambahkan");
    } catch (submitError) {
      const errorMsg = submitError instanceof Error
          ? submitError.message
          : "Gagal menambah group";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }

  async function markNotificationsAsRead() {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.some(n => !n.isRead)) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      try {
        await api("/api/notifications", { method: "PUT" });
      } catch (err) {
        // ignore
      }
    }
  }

  async function handleMediaUpload(file: File) {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Gagal mengunggah media");
      
      const data = await response.json();
      setMediaUrl(data.url);
      toast.success("Media berhasil diunggah");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error upload");
      toast.error("Gagal mengunggah media");
    } finally {
      setIsUploading(false);
    }
  }

  async function addMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!messageInput && !mediaUrl) {
      toast.error("Pesan tulisan atau media diperlukan!");
      return;
    }
    setError(null);
    try {
      await api<{ message: Message }>("/api/messages", {
        method: "POST",
        body: JSON.stringify({ text: messageInput, mediaUrl }),
      });
      setMessageInput("");
      setMediaUrl(null);
      await loadCoreData();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menambah teks",
      );
    }
  }

  async function saveConfigMode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!messageInput && !mediaUrl) {
      toast.error("Pesan tulisan atau media diperlukan!");
      return;
    }
    if (!msgTarget || msgTarget.length === 0) {
      toast.error("Tujuan pesan (Group) wajib dipilih!");
      return;
    }
    // Validation for SCHEDULE mode
    if (deliveryMode === "SCHEDULE") {
      if (!scheduleDate || !scheduleTime) {
        toast.error("Tanggal dan jam wajib diisi untuk mode Jadwalkan!");
        return;
      }
    }
    // Validation for REPEAT mode
    if (deliveryMode === "REPEAT") {
      if (!intervalNum || Number(intervalNum) <= 0) {
        toast.error("Interval pengiriman harus valid dan lebih dari 0!");
        return;
      }
      if (!sendCount || Number(sendCount) <= 0) {
        toast.error("Jumlah pengiriman harus lebih dari 0!");
        return;
      }
    }
    setError(null);
    try {
      const currentTarget = msgTarget.includes("ALL_GROUPS") ? "ALL_GROUPS" : msgTarget.join(",");
      const payload: Record<string, unknown> = {
        messageInput,
        mediaUrl,
        msgTarget: currentTarget,
        deliveryMode,
        scheduleDate,
        scheduleTime,
        intervalNum,
        intervalUnit,
        sendCount,
      };

      // If editing, include messageId so the API updates instead of creating
      if (isEditing && editingMessageId) {
        payload.messageId = editingMessageId;
      }

      await api<{ message: string }>("/api/autosend/config/setup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessageInput("");
      setMediaUrl(null);
      setMsgTarget([]);
      setIsEditing(false);
      setEditingMessageId(null);
      await loadCoreData();
      toast.success(isEditing ? "Pesan berhasil diupdate!" : "Setup pesan berhasil disimpan!");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan pengatura pesan",
      );
      toast.error("Terjadi kesalahan saat simpan setup.");
    }
  }

  async function fetchAllGroups() {
    setError(null);
    try {
      await api<{ groups: Group[] }>("/api/groups", {
        method: "POST",
        body: JSON.stringify({ source: "FETCH_ALL" }),
      });
      await loadCoreData();
      toast.success("Singkronisasi grup berhasil dilakukan");
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error
          ? fetchError.message
          : "Gagal fetch all groups";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }

  async function saveDelay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await api<{ settings: { delaySeconds: number } }>("/api/config/delay", {
        method: "POST",
        body: JSON.stringify({ delaySeconds: Number(delayInput) }),
      });
      await loadCoreData();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal simpan delay",
      );
    }
  }

  async function deleteGroup(groupId: string, groupName: string) {
    setConfirmDelete({
      isOpen: true,
      title: "Hapus Grup?",
      desc: `Apakah anda yakin ingin menghapus grup "${groupName}" dari list scrape?`,
      onConfirm: async () => {
        setConfirmDelete((p) => ({ ...p, isOpen: false }));
        try {
          await api<{ ok: boolean }>(`/api/groups/${groupId}`, { method: "DELETE" });
          toast.success("Grup berhasil dihapus");
          await loadCoreData();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Gagal menghapus grup");
        }
      },
    });
  }

  async function deleteAllGroups() {
    setConfirmDelete({
      isOpen: true,
      title: "Hapus Semua Grup Scrape?",
      desc: "Perhatian! Semua list grup scrape akan terhapus secara permanen.",
      onConfirm: async () => {
        setConfirmDelete((p) => ({ ...p, isOpen: false }));
        setError(null);
        try {
          await api<{ ok: boolean; deletedCount: number }>("/api/groups", {
            method: "DELETE",
          });
          toast.success("Seluruh grup berhasil dihapus");
          await loadCoreData();
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error
              ? deleteError.message
              : "Gagal menghapus semua group",
          );
        }
      },
    });
  }

  async function deleteMessage(messageId: string) {
    setConfirmDelete({
      isOpen: true,
      title: "Hapus Pesan Draf?",
      desc: "Pesan ini akan dihapus dari draf list auto send anda.",
      onConfirm: async () => {
        setConfirmDelete((p) => ({ ...p, isOpen: false }));
        try {
          await api<{ ok: boolean }>(`/api/messages/${messageId}`, {
            method: "DELETE",
          });
          toast.success("Pesan draf dihapus");
          await loadCoreData();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Gagal menghapus pesan");
        }
      },
    });
  }

  async function deleteAllMessages() { 
    setConfirmDelete({
      isOpen: true,
      title: "Hapus Semua Pesan",
      desc: "Perhatian! Seluruh draf pesan yang telah anda simpan akan hilang permanen.",
      onConfirm: async () => {
        setConfirmDelete((p) => ({ ...p, isOpen: false }));
        try {
          await api<{ ok: boolean; deletedCount: number }>("/api/messages", { method: "DELETE" });
          toast.success("Seluruh draf pesan telah dibersihkan");
          await loadCoreData();
        } catch (deleteError) {
          toast.error(deleteError instanceof Error ? deleteError.message : "Gagal hapus pesan");
        }
      },
    });
  }


  async function startAutoSend() {
    setError(null);
    try {
      await api<{ message: string }>("/api/autosend/start", { method: "POST" });
      await loadCoreData();
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Gagal memulai auto send",
      );
    }
  }

  async function stopAutoSend() {
    await api<{ ok: boolean }>("/api/autosend/stop", { method: "POST" });
    await loadCoreData();
  }

  const handleSaveAccountSettings = async () => {
    if (settingsForm.newPassword || settingsForm.confirmPassword) {
      if (settingsForm.newPassword !== settingsForm.confirmPassword) {
        toast.error("Password dan Konfirmasi Password tidak cocok!");
        return;
      }
      if (settingsForm.newPassword.length < 6) {
        toast.error("Password minimal 6 karakter!");
        return;
      }
      
      setIsSavingSettings(true);
      try {
        const auth = getFirebaseClientAuth();
        const user = auth.currentUser;
        if (user) {
          await updatePassword(user, settingsForm.newPassword);
          toast.success("Password berhasil diubah!");
          setSettingsForm(p => ({ ...p, newPassword: "", confirmPassword: "" }));
        } else {
          toast.error("Sesi tidak aktif. Silakan login ulang untuk mengubah password.");
        }
      } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
          toast.error("Demi keamanan, Anda harus login ulang untuk mengubah password.");
        } else {
          toast.error("Gagal mengubah password: " + error.message);
        }
      } finally {
        setIsSavingSettings(false);
      }
    } else {
      toast.success("Pengaturan Akun disimpan!");
    }
  };

  if (!ready) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center py-10">
        <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm px-6 py-4 text-sm text-slate-500">
          Memuat dashboard...
        </div>
      </main>
    );
  }

  if (step === "CONNECT_TELEGRAM") {
    return (
      <main className="app-shell min-h-screen py-8 md:py-10">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[#9A5034] text-xs font-semibold uppercase tracking-wider mb-1">
              Tahap 1
            </p>
            <h1 className="title-font text-3xl md:text-4xl text-[var(--ink)]">
              Connect Akun Telegram
            </h1>
          </div>
          <LogoutButton />
        </header>

        {error ? (
          <p className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <TelegramConnect onConnected={onTelegramConnected} />
      </main>
    );
  }



  return (
    <div className="flex h-screen bg-[#FCF8F3]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => {
          if (!isLicenseActive && t !== "dashboard" && t !== "shop" && t !== "settings" && t !== "help") {
            toast.error("Lisensi Anda tidak aktif. Silakan beli paket atau aktifkan key untuk mengakses fitur ini.");
            return;
          }
          setActiveTab(t);
        }} 
        isAdmin={currentRole === "SUPER_ADMIN"} 
        isLicenseActive={isLicenseActive}
      />
      <main className="flex-1 overflow-y-auto px-8 py-10 bg-white m-4 rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 pb-6 border-b border-[#F0E6D8]">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Worker Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FDFBF8] border border-[#F0E6D8]">
              <span className={`w-2 h-2 rounded-full shrink-0 ${status.isRunning ? 'bg-sky-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="text-sm font-semibold text-[var(--ink)] whitespace-nowrap">Worker: {status.isRunning ? 'Active' : 'Stopped'}</span>
            </div>

            {/* Aktivkan Key Button — shown only when license is not active and user is not admin */}
            {currentRole !== "SUPER_ADMIN" && !isLicenseActive && (
              <button
                onClick={() => { setError(null); setShowKeyModal(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B04C2E] to-[#D96B40] hover:from-[#9A5034] hover:to-[#C05A30] text-white text-xs font-bold shadow-md shadow-[#B04C2E]/20 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
              >
                <Gem className="w-4 h-4" />
                Aktivkan Key
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-5">
             {currentRole !== "SUPER_ADMIN" && (
               <div className="flex items-center gap-2">
                 {currentLicense && new Date(currentLicense.expiresAt).getTime() > Date.now() ? (
                   <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF0E0] border border-[#F0E6D8]">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[11px] font-bold text-[#9A5034]">
                       Lisensi Aktif ({Math.ceil((new Date(currentLicense.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} hari)
                     </span>
                   </div>
                 ) : (
                   <button onClick={() => setActiveTab('shop')} className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                     Lisensi Kedaluwarsa
                   </button>
                 )}
               </div>
             )}
             
             <div className={`flex items-center gap-4 ${currentRole !== "SUPER_ADMIN" ? "border-l border-[#F0E6D8] pl-5" : ""}`}>
               <div className="relative flex items-center justify-center">
                 <button
                   onClick={markNotificationsAsRead}
                   className="relative flex items-center justify-center text-slate-500 hover:text-[var(--ink)] transition-colors"
                 >
                   <Bell className="h-5 w-5" />
                   {notifications.some(n => !n.isRead) && (
                     <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
                   )}
                 </button>

                 {showNotifications && (
                   <div className="absolute right-0 top-full mt-4 z-50 w-80 rounded-2xl border border-[var(--line)] bg-white p-2 shadow-xl">
                     <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--line)] mb-2">
                       <h3 className="font-bold text-sm text-[var(--ink)]">Notifikasi</h3>
                       <button 
                         onClick={() => setShowNotifications(false)}
                         className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100"
                       >
                         <X className="h-4 w-4" />
                       </button>
                     </div>
                     <div className="max-h-[300px] overflow-y-auto">
                       {notifications.length === 0 ? (
                         <div className="py-6 text-center text-xs text-slate-400">Belum ada notifikasi</div>
                       ) : (
                         <ul className="flex flex-col gap-1">
                           {notifications.map((n) => (
                             <li key={n.id} className={`p-3 rounded-lg text-xs leading-relaxed ${!n.isRead ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                               <span className="block text-slate-700">{n.message}</span>
                               <span className="block mt-1.5 text-[10px] text-slate-400 font-medium">{new Date(n.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                             </li>
                           ))}
                         </ul>
                       )}
                     </div>
                   </div>
                 )}
               </div>
               

               <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FCF8F3] border border-[#F0E6D8] text-slate-600 cursor-pointer hover:bg-[#FFF0E0] transition-colors relative group">
                 <User className="h-4 w-4" />
                 {/* Profile Dropdown */}
                 <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl border border-[var(--line)] bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--line)]">
                      <p className="text-sm font-semibold text-[var(--ink)] truncate">{currentUser?.email || 'User'}</p>
                      <p className="text-xs text-slate-500">{currentRole === "SUPER_ADMIN" ? "Admin" : "User"}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:text-[var(--ink)] hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <button 
                        onClick={async () => {
                           try {
                             await api('/api/telegram/logout', { method: 'POST' });
                             toast.success("Telegram terputus");
                             window.location.reload();
                           } catch (e) {
                             toast.error("Gagal logout Telegram");
                           }
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:text-[var(--ink)] hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Logout Tele
                      </button>
                      <button 
                        onClick={async () => {
                           if (isFirebaseClientConfigured()) {
                             await signOut(getFirebaseClientAuth()).catch(() => {});
                           }
                           await api<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
                           router.push("/");
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout Web
                      </button>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </header>

      {activeTab === 'admin' ? (
        <div className="flex-1 w-full overflow-y-auto"><AdminTab /></div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-8">
      {error ? (
        <p className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      
        {activeTab === 'groups' && (
          <GroupsTab
            groups={groups}
            groupInput={groupInput}
            setGroupInput={setGroupInput}
            addGroup={addGroup}
            fetchAllGroups={fetchAllGroups}
            deleteAllGroups={deleteAllGroups}
            deleteGroup={deleteGroup}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesTab
            groups={groups}
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            mediaUrl={mediaUrl}
            setMediaUrl={setMediaUrl}
            isUploading={isUploading}
            handleMediaUpload={handleMediaUpload}
            deliveryMode={deliveryMode}
            setDeliveryMode={setDeliveryMode}
            msgTarget={msgTarget}
            setMsgTarget={setMsgTarget}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            scheduleDate={scheduleDate}
            setScheduleDate={setScheduleDate}
            scheduleTime={scheduleTime}
            setScheduleTime={setScheduleTime}
            intervalNum={intervalNum}
            setIntervalNum={setIntervalNum}
            intervalUnit={intervalUnit}
            setIntervalUnit={setIntervalUnit}
            sendCount={sendCount}
            setSendCount={setSendCount}
            saveConfigMode={saveConfigMode}
            deleteMessage={deleteMessage}
            deleteAllMessages={deleteAllMessages}
            isEditing={isEditing}
            editingMessageId={editingMessageId}
            setIsEditing={setIsEditing}
            setEditingMessageId={setEditingMessageId}
          />
        )}

{activeTab === 'dashboard' && (
      <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-2">
          <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#9A5034]" />
            Dashboard
          </h2>
          <p className="text-[13px] font-medium text-slate-500">Pantau status worker, performa pengiriman, aktivitas terbaru, dan ringkasan campaign Anda secara real-time.</p>
        </div>

        {/* Worker Control — Full Width */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#F0E6D8] p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FFF0E0] rounded-xl flex items-center justify-center text-[#B04C2E]">
                  <Zap className="h-5 w-5" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--ink)] text-base">Worker Control</h3>
                  <p className="text-[11px] text-slate-400">Kelola status auto send dan pengaturan jeda pengiriman.</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Status Worker</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    <span className="text-base font-extrabold text-[var(--ink)]">{status.isRunning ? 'Running' : 'Stopped'}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Queue Pesan</p>
                  <p className="text-base font-extrabold text-[var(--ink)]">{(stats.total || logs.length).toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-400">pesan</span></p>
                </div>
                <div className="rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Pesan Sukses</p>
                  <p className="text-base font-extrabold text-[var(--ink)]">{(stats.terkirim || totalSent).toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-400">pesan</span></p>
                </div>
                <div className="rounded-xl border border-[#F0E6D8] bg-[#FDFBF8] px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Custom Delay</p>
                  <p className="text-base font-extrabold text-[var(--ink)]">{status.delaySeconds ?? delayInput}s</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-[260px] shrink-0">
              <form className="flex flex-col gap-2" onSubmit={saveDelay}>
                <label className="text-[11px] font-bold text-slate-600">Jeda Pengiriman (Detik)</label>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={delayInput} onChange={(e) => setDelayInput(e.target.value)}
                    className="w-full rounded-xl border border-[#F0E6D8] bg-white px-3 py-2.5 text-sm font-semibold text-[var(--ink)] focus:border-[#9A5034] focus:outline-none" />
                  <button type="submit" className="shrink-0 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[var(--accent-soft)] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all">Set Delay</button>
                </div>
              </form>
              <div className="flex gap-2">
                <button type="button" onClick={startAutoSend} disabled={status.isRunning}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[var(--accent-soft)] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all">
                  <Play className="w-3.5 h-3.5" fill="currentColor" /> Start
                </button>
                <button type="button" onClick={stopAutoSend} disabled={!status.isRunning}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#F0E6D8] bg-white px-4 py-2.5 text-xs font-bold text-[#9A5034] hover:bg-[#FFF0E0] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none transition-all">
                  <Pause className="w-3.5 h-3.5" /> Stop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#F0E6D8]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFF0E0] rounded-xl flex items-center justify-center text-[#B04C2E]"><Send className="h-5 w-5" /></div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Total Terkirim</p>
            </div>
            <p className="text-3xl font-extrabold text-[var(--ink)]">{(stats.terkirim || totalSent).toLocaleString('id-ID')}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">pesan</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#F0E6D8]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFF0E0] rounded-xl flex items-center justify-center text-[#B04C2E]"><Network className="h-5 w-5" /></div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Groups Targeted</p>
            </div>
            <p className="text-3xl font-extrabold text-[var(--ink)]">{groups.length}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">grup</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#F0E6D8]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFF0E0] rounded-xl flex items-center justify-center text-[#B04C2E]"><CheckCircle className="h-5 w-5" /></div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Berhasil Hari Ini</p>
            </div>
            <p className="text-3xl font-extrabold text-[var(--ink)]">{todayStats.success}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">pesan</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#F0E6D8]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FFF0E0] rounded-xl flex items-center justify-center text-[#B04C2E]"><X className="h-5 w-5" /></div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Gagal Hari Ini</p>
            </div>
            <p className="text-3xl font-extrabold text-[var(--ink)]">{todayStats.failed}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">pesan</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-[var(--ink)] text-[14px]">Activity Velocity</h3>
                <p className="text-[10px] text-slate-400">Pantau jumlah aktivitas pengiriman pesan dalam 7 hari terakhir.</p>
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <span className="px-3 py-1.5 shadow-sm text-[10px] font-bold rounded-md bg-white text-[var(--ink)]">7 Days</span>
                <span className="px-3 py-1.5 text-[10px] font-bold rounded-md text-slate-400 cursor-pointer hover:text-slate-600">30 Days</span>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-2 pt-4 relative">
              <div className="absolute left-0 top-4 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 font-medium">
                <span>{formatYAxis(maxChartValue)}</span>
                <span>{formatYAxis(maxChartValue * 0.75)}</span>
                <span>{formatYAxis(maxChartValue * 0.5)}</span>
                <span>{formatYAxis(maxChartValue * 0.25)}</span>
                <span>0</span>
              </div>
              <div className="ml-8 flex-1 flex items-end gap-2 sm:gap-4 h-full justify-between pb-6">
                {chartData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 relative group h-full justify-end">
                    <div className="w-full bg-[#FFF0E0] rounded-sm transition-all duration-300 relative group-hover:bg-[#B04C2E]" style={{ height: `${Math.max((d.count / maxChartValue) * 100, 2)}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#B04C2E] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {d.count} messages
                      </div>
                    </div>
                    <span className="absolute -bottom-6 text-[10px] text-slate-500 font-semibold whitespace-nowrap">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col h-[300px]">
            <div className="mb-4">
              <h3 className="font-bold text-[var(--ink)] text-[14px]">Distribusi Pengiriman</h3>
              <p className="text-[10px] text-slate-400">Lihat jumlah pesan terkirim berdasarkan grup tujuan.</p>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              {groupDistribution.length > 0 ? groupDistribution.map((g, i) => (
                <div key={i} className="flex items-center gap-3 text-[12px]">
                  <div className="w-28 truncate font-semibold text-slate-700">{g.name}</div>
                  <div className="flex-1 bg-[#FFF0E0] h-3 rounded-full overflow-hidden">
                    <div className="bg-[#B04C2E] h-full rounded-full transition-all duration-500" style={{ width: `${g.percentage}%` }}></div>
                  </div>
                  <div className="w-16 text-right font-bold text-slate-700">{g.count.toLocaleString('id-ID')}</div>
                </div>
              )) : (
                <div className="text-center text-xs text-slate-400">Belum ada data distribusi</div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-[13px] font-bold">
              <span className="text-slate-800">Total Terkirim</span>
              <span className="text-slate-800">{(stats.terkirim || totalSent).toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-400">pesan</span></span>
            </div>
          </div>
        </div>

        {/* Bottom 3 Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col h-[320px]">
            <h3 className="font-bold text-[var(--ink)] text-[14px] mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#B04C2E]" /> Aktivitas Terbaru
            </h3>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
              {logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px]">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${log.status === "TERKIRIM" ? "bg-[#FFF0E0] text-[#B04C2E]" : "bg-rose-50 text-rose-500"}`}>
                    {log.status === "TERKIRIM" ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                  <span className="flex-1 text-slate-600 truncate">{log.status === "TERKIRIM" ? `Pesan berhasil dikirim ke ${log.groupName}` : `Gagal mengirim pesan ke ${log.groupName}`}</span>
                  <span className="text-slate-400 font-medium shrink-0 whitespace-nowrap">{formatDateTime(log.createdAt)}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-center text-xs text-slate-400 py-4">Belum ada aktivitas</div>}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button onClick={() => setActiveTab("logs")} className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center">Lihat semua aktivitas <ChevronRight className="w-3 h-3 ml-1" /></button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col h-[320px]">
            <h3 className="font-bold text-[var(--ink)] text-[14px] mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#B04C2E]" /> Peringatan Sistem
            </h3>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
              {notifications.slice(0, 5).map((n, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px]">
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 text-slate-600 truncate">{n.message}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium text-[9px] shrink-0">Info</span>
                  <span className="text-slate-400 font-medium shrink-0 whitespace-nowrap">{formatDateTime(n.createdAt)}</span>
                </div>
              ))}
              {notifications.length === 0 && <div className="text-center text-xs text-slate-400 py-4">Sistem berjalan lancar</div>}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button onClick={() => setActiveTab("logs")} className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center">Lihat semua peringatan <ChevronRight className="w-3 h-3 ml-1" /></button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col h-[320px]">
            <h3 className="font-bold text-[var(--ink)] text-[14px] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#B04C2E]" /> Quick Actions
            </h3>
            <div className="flex-1 flex flex-col gap-2">
              <button onClick={() => setActiveTab("groups")} className="w-full text-left px-4 py-2.5 rounded-xl border border-[#F0E6D8] hover:bg-[#FFF0E0] text-[12px] font-medium text-[var(--ink)] flex items-center justify-between transition-colors">
                <span className="flex items-center"><Plus className="w-4 h-4 mr-3 text-[#B04C2E]" /> Tambah Group</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => setActiveTab("messages")} className="w-full text-left px-4 py-2.5 rounded-xl border border-[#F0E6D8] hover:bg-[#FFF0E0] text-[12px] font-medium text-[var(--ink)] flex items-center justify-between transition-colors">
                <span className="flex items-center"><Plus className="w-4 h-4 mr-3 text-[#B04C2E]" /> Tambah Pesan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => setActiveTab("messages")} className="w-full text-left px-4 py-2.5 rounded-xl border border-[#F0E6D8] hover:bg-[#FFF0E0] text-[12px] font-medium text-[var(--ink)] flex items-center justify-between transition-colors">
                <span className="flex items-center"><FileText className="w-4 h-4 mr-3 text-[#B04C2E]" /> Buka Messages</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => setActiveTab("logs")} className="w-full text-left px-4 py-2.5 rounded-xl border border-[#F0E6D8] hover:bg-[#FFF0E0] text-[12px] font-medium text-[var(--ink)] flex items-center justify-between transition-colors">
                <span className="flex items-center"><List className="w-4 h-4 mr-3 text-[#B04C2E]" /> Buka Logs</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={startAutoSend} className="w-full text-left px-4 py-2.5 rounded-xl border border-[#F0E6D8] hover:bg-[#FFF0E0] text-[12px] font-medium text-[var(--ink)] flex items-center justify-between transition-colors">
                <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-3 text-[#B04C2E]" /> Restart Worker</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

      </section>
)}

{activeTab === 'settings' && (
      <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Settings */}
        <div className="mb-2">
          <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#9A5034]" />
            Settings
          </h2>
          <p className="text-[13px] font-medium text-slate-500">Kelola pengaturan akun, aplikasi, telegram, keamanan, dan preferensi sistem.</p>
        </div>


        {/* Top 4 Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F0E6D8] flex items-center gap-4 cursor-pointer hover:border-[#9A5034] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center text-[#B04C2E] shrink-0">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-sm">Akun</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Informasi akun web</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F0E6D8] flex items-center gap-4 cursor-pointer hover:border-[#9A5034] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center text-[#B04C2E] shrink-0">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-sm">Aplikasi</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Preferensi aplikasi</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F0E6D8] flex items-center gap-4 cursor-pointer hover:border-[#9A5034] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center text-[#B04C2E] shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-sm">Telegram</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Koneksi & sinkronisasi</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#F0E6D8] flex items-center gap-4 cursor-pointer hover:border-[#9A5034] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center text-[#B04C2E] shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] text-sm">Keamanan</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Akses & perlindungan</p>
              </div>
           </div>
        </div>

        {/* 4 Configuration Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pb-8">
          
          {/* Panel 1: Pengaturan Akun */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[#F0E6D8] flex items-center gap-3">
               <UserCircle className="w-5 h-5 text-[#9A5034]" />
               <h3 className="font-bold text-[#9A5034] text-sm">Pengaturan Akun</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4 text-xs font-semibold text-slate-600">
               <div className="flex items-center gap-3">
                 <User className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Nama Pengguna</span>
                 <input value={settingsForm.username} onChange={e => setSettingsForm(p => ({...p, username: e.target.value}))} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#FDFBF8] px-3 py-2 focus:border-[#9A5034] focus:bg-white focus:outline-none transition-colors" />
               </div>
               <div className="flex items-center gap-3">
                 <FileText className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Email</span>
                 <input value={settingsForm.email} onChange={e => setSettingsForm(p => ({...p, email: e.target.value}))} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#FDFBF8] px-3 py-2 focus:border-[#9A5034] focus:bg-white focus:outline-none transition-colors" />
               </div>
               <div className="flex items-center gap-3">
                 <User className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Role</span>
                 <input disabled value={currentUser?.role === 'SUPER_ADMIN' ? 'Admin' : 'User'} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 px-3 py-2 cursor-not-allowed" />
               </div>
               <div className="flex items-center gap-3">
                 <Shield className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Password Baru</span>
                 <div className="flex-1 min-w-0 w-full relative">
                   <input type={showPassword ? "text" : "password"} value={settingsForm.newPassword} onChange={e => setSettingsForm(p => ({...p, newPassword: e.target.value}))} placeholder="••••••••" className="w-full rounded-lg border border-[#F0E6D8] bg-[#FDFBF8] px-3 py-2 pr-10 focus:border-[#9A5034] focus:bg-white focus:outline-none transition-colors" />
                   <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Shield className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Konfirmasi Password</span>
                 <div className="flex-1 min-w-0 w-full relative">
                   <input type={showConfirmPassword ? "text" : "password"} value={settingsForm.confirmPassword} onChange={e => setSettingsForm(p => ({...p, confirmPassword: e.target.value}))} placeholder="••••••••" className="w-full rounded-lg border border-[#F0E6D8] bg-[#FDFBF8] px-3 py-2 pr-10 focus:border-[#9A5034] focus:bg-white focus:outline-none transition-colors" />
                   <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                     {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                 </div>
               </div>
            </div>
            <div className="p-5 border-t border-[#F0E6D8] flex gap-3">
               <button onClick={handleSaveAccountSettings} disabled={isSavingSettings} className="w-full rounded-xl bg-[var(--accent)] text-white font-bold text-[11px] md:text-[12px] py-2.5 shadow-md shadow-[var(--accent-soft)] transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:transform-none">
                 {isSavingSettings ? "Menyimpan..." : "Simpan Perubahan"}
               </button>
            </div>
          </div>

          {/* Panel 2: Pengaturan Aplikasi */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col overflow-hidden h-full">
            <div className="p-5 border-b border-[#F0E6D8] flex items-center gap-3">
               <Settings className="w-5 h-5 text-[#9A5034]" />
               <h3 className="font-bold text-[#9A5034] text-sm">Pengaturan Aplikasi</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4 text-xs font-semibold text-slate-600">
               <div className="flex items-center gap-3">
                 <List className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Bahasa</span>
                 <select disabled value={settingsForm.language} onChange={e => setSettingsForm(p => ({...p, language: e.target.value}))} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 cursor-not-allowed px-3 py-2 focus:outline-none transition-colors appearance-none">
                   <option>Indonesia</option>
                   <option>English</option>
                 </select>
               </div>
               <div className="flex items-center gap-3">
                 <Globe className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Zona Waktu</span>
                 <select disabled value={settingsForm.timezone} onChange={e => setSettingsForm(p => ({...p, timezone: e.target.value}))} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 cursor-not-allowed px-3 py-2 focus:outline-none transition-colors appearance-none">
                   <option>WIB (UTC+7)</option>
                   <option>WITA (UTC+8)</option>
                   <option>WIT (UTC+9)</option>
                 </select>
               </div>
               <div className="flex items-center gap-3">
                 <Calendar className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Format Tanggal</span>
                 <select disabled value={settingsForm.dateFormat} onChange={e => setSettingsForm(p => ({...p, dateFormat: e.target.value}))} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 cursor-not-allowed px-3 py-2 focus:outline-none transition-colors appearance-none">
                   <option>DD/MM/YYYY</option>
                   <option>MM/DD/YYYY</option>
                   <option>YYYY-MM-DD</option>
                 </select>
               </div>
               <div className="flex items-center gap-3">
                 <Image className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Tema Tampilan</span>
                 <select disabled value={settingsForm.theme} onChange={e => setSettingsForm(p => ({...p, theme: e.target.value}))} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 cursor-not-allowed px-3 py-2 focus:outline-none transition-colors appearance-none">
                   <option>Light</option>
                   <option>Dark</option>
                   <option>System Default</option>
                 </select>
               </div>
               <div className="flex items-center justify-between pt-2">
                 <div className="flex items-center gap-3">
                   <Bell className="w-4 h-4 text-[#B04C2E] shrink-0" />
                   <span>Aktifkan Notifikasi</span>
                 </div>
                 <button onClick={() => setSettingsForm(p => ({...p, notificationsActive: !p.notificationsActive}))} className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${settingsForm.notificationsActive ? 'bg-[var(--accent)]' : 'bg-slate-300'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${settingsForm.notificationsActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                 </button>
               </div>
            </div>
            <div className="p-5 border-t border-[#F0E6D8]">
               <button onClick={() => toast.success("Preferensi Aplikasi disimpan!")} className="w-full rounded-xl bg-[var(--accent)] text-white font-bold text-[12px] py-2.5 shadow-md shadow-[var(--accent-soft)] transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95">Simpan Pengaturan</button>
            </div>
          </div>

          {/* Panel 3: Pengaturan Telegram */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col overflow-hidden h-full">
            <div className="p-5 border-b border-[#F0E6D8] flex items-center gap-3">
               <Send className="w-5 h-5 text-[#9A5034]" />
               <h3 className="font-bold text-[#9A5034] text-sm">Pengaturan Telegram</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4 text-xs font-semibold text-slate-600">
               <div className="flex items-center gap-3">
                 <Settings className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Status Telegram</span>
                 {currentUser?.telegramConnected ? (
                   <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-600 text-[10px] font-bold shrink-0 truncate">Terkoneksi</span>
                 ) : (
                   <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-600 text-[10px] font-bold shrink-0 truncate">Terputus</span>
                 )}
               </div>
               <div className="flex items-center gap-3">
                 <UserCircle className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Nomor Telegram Terhubung</span>
                 <input disabled value={currentUser?.nomorTelegram || "-"} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 px-3 py-2 cursor-not-allowed" />
               </div>
               <div className="flex items-center gap-3">
                 <User className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Username Telegram</span>
                 <input disabled value={currentUser?.telegramConnected ? (currentUser?.telegramUsername ? (currentUser.telegramUsername.startsWith('@') ? currentUser.telegramUsername : `@${currentUser.telegramUsername}`) : "Tidak diatur") : "-"} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 px-3 py-2 cursor-not-allowed" />
               </div>
               <div className="flex items-center gap-3">
                 <RefreshCw className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Sinkronisasi Terakhir</span>
                 <input disabled value={currentUser?.telegramConnected ? new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit'}) : "-"} className="flex-1 min-w-0 w-full rounded-lg border border-[#F0E6D8] bg-[#F5F0EB] text-slate-500 px-3 py-2 cursor-not-allowed" />
               </div>
               <div className="flex items-center gap-3">
                 <Settings className="w-4 h-4 text-[#B04C2E] shrink-0" />
                 <span className="w-36 md:w-40 shrink-0">Status Sesi Telegram</span>
                 {currentUser?.telegramConnected ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-600 text-[10px] font-bold shrink-0">Aktif</span>
                 ) : (
                    <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-600 text-[10px] font-bold shrink-0">Tidak Aktif</span>
                 )}
               </div>
               
            </div>
          </div>


           <div className="bg-white rounded-3xl shadow-sm border border-[#F0E6D8] flex flex-col overflow-hidden h-full">
             <div className="p-5 border-b border-[#F0E6D8] flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#9A5034]" />
                <h3 className="font-bold text-[#9A5034] text-sm">Keamanan</h3>
             </div>
             <div className="p-5 flex-1 flex flex-col gap-5 text-xs font-semibold text-slate-600">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <UserCircle className="w-4 h-4 text-[#B04C2E] shrink-0" />
                   <span>Sesi Login Aktif</span>
                 </div>
                 <span className="px-3 py-1 rounded bg-[#FFF0E0] text-[#9A5034] text-[10px] font-bold">{activeSessions.length} Sesi Aktif</span>
               </div>
               <div onClick={() => setShowSessionsModal(true)} className="flex items-center justify-between cursor-pointer hover:text-[#9A5034] transition-colors">
                 <div className="flex items-center gap-3">
                   <Smartphone className="w-4 h-4 text-[#B04C2E] shrink-0" />
                   <span>Perangkat Terhubung</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-[#B04C2E]" />
               </div>
               <div onClick={() => setShowHistoryModal(true)} className="flex items-center justify-between cursor-pointer hover:text-[#9A5034] transition-colors">
                 <div className="flex items-center gap-3">
                   <History className="w-4 h-4 text-[#B04C2E] shrink-0" />
                   <span>Riwayat Login</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-[#B04C2E]" />
               </div>
               <div onClick={handleLogoutAll} className="flex items-center justify-between cursor-pointer hover:text-red-600 transition-colors">
                 <div className="flex items-center gap-3">
                   <LogOut className="w-4 h-4 text-[#B04C2E] shrink-0" />
                   <span>Logout Semua Perangkat</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-[#B04C2E]" />
               </div>
             </div>
           </div>


        </div>

      </section>
)}

      {activeTab === 'logs' && (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-2">
          <h2 className="title-font text-3xl font-bold text-[#9A5034] mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#9A5034]" />
            Logs
          </h2>
          <p className="text-[13px] font-medium text-slate-500">Pantau aktivitas sistem, error, dan perubahan terbaru.</p>
        </div>

        {/* Top 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#F0E6D8] flex items-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0 mr-4">
              <FileText className="w-6 h-6 text-[#B04C2E]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">Total Aktivitas</p>
              <h3 className="text-2xl font-bold text-[var(--ink)] leading-none mb-1">{stats.total}</h3>
              <p className="text-[11px] text-slate-500">Semua aktivitas tercatat</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-[#F0E6D8] flex items-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0 mr-4">
              <AlertTriangle className="w-6 h-6 text-[#B04C2E]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">Error Hari Ini</p>
              <h3 className="text-2xl font-bold text-[var(--ink)] leading-none mb-1">{todayStats.failed}</h3>
              <p className="text-[11px] text-slate-500">Perlu segera ditangani</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-[#F0E6D8] flex items-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0 mr-4">
              <Database className="w-6 h-6 text-[#B04C2E]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">Worker Status</p>
              <h3 className="text-2xl font-bold text-[var(--ink)] leading-none mb-1">{status.isRunning ? 'Running' : 'Stopped'}</h3>
              <p className="text-[11px] text-slate-500">{status.isRunning ? 'Otomatisasi sedang berjalan' : 'Tidak ada worker aktif'}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-[#F0E6D8] flex items-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E0] flex items-center justify-center shrink-0 mr-4">
              <Clock className="w-6 h-6 text-[#B04C2E]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">Update Terakhir</p>
              <h3 className="text-2xl font-bold text-[var(--ink)] leading-none mb-1">
                {logs.length > 0 ? new Date(logs[0].createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {logs.length > 0 ? `Hari ini, ${new Date(logs[0].createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Belum ada'}
              </p>
            </div>
          </div>
        </div>

        {/* Grid 2x2 Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Panel 1: Aktivitas Sistem */}
          <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-[#9A5034]" />
                <h3 className="font-bold text-[#9A5034] text-sm">Aktivitas Sistem</h3>
              </div>
            </div>
            <div className="flex flex-col max-h-[350px] overflow-y-auto">
              {logs.filter(l => l.status === "TERKIRIM").length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">Belum ada aktivitas.</div>
              ) : (
                logs.filter(l => l.status === "TERKIRIM").map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#F0E6D8] last:border-0 hover:bg-[#FDFBF8] transition-colors">
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap">{formatDateTime(item.createdAt)}</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-bold text-[var(--ink)] truncate">Berhasil mengirim pesan ke {item.groupName}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">Teks: {item.textPreview}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel 2: Log Error */}
          <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#9A5034]" />
                <h3 className="font-bold text-[#9A5034] text-sm">Log Error</h3>
              </div>
            </div>
            <div className="flex flex-col max-h-[350px] overflow-y-auto">
              {logs.filter(l => l.status === "GAGAL").length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">Tidak ada log error.</div>
              ) : (
                logs.filter(l => l.status === "GAGAL").map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#F0E6D8] last:border-0 hover:bg-[#FDFBF8] transition-colors">
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap">{formatDateTime(item.createdAt)}</span>
                    <div className="shrink-0 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-bold text-[var(--ink)] truncate">Gagal mengirim ke grup {item.groupName}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">Mungkin akun dibatasi (Rate limit) atau format tidak sesuai</p>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-bold rounded shrink-0 border border-transparent bg-rose-100 text-rose-600">Error</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel 3: Riwayat Perubahan */}
          <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#9A5034]" />
                <h3 className="font-bold text-[#9A5034] text-sm">Riwayat Perubahan</h3>
              </div>
            </div>
            <div className="flex flex-col max-h-[350px] overflow-y-auto">
              <div className="p-6 text-center text-sm text-slate-400">Belum ada riwayat perubahan.</div>
            </div>
          </div>

          {/* Panel 4: Peringatan Sistem */}
          <div className="bg-white rounded-2xl border border-[#F0E6D8] shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#9A5034]" />
                <h3 className="font-bold text-[#9A5034] text-sm">Peringatan Sistem</h3>
              </div>
            </div>
            <div className="flex flex-col max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">Peringatan sistem kosong.</div>
              ) : (
                notifications.map((item) => (
                  <div key={item.id} className={`flex items-center gap-4 px-5 py-4 border-b border-[#F0E6D8] last:border-0 transition-colors ${!item.isRead ? 'bg-[#FFF0E0]/30' : 'hover:bg-[#FDFBF8]'}`}>
                    <div className="shrink-0 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-[#B04C2E]" />
                    </div>
                    <div className="min-w-0 flex-1 pl-1">
                      <h4 className="text-[13px] font-bold text-[var(--ink)] truncate">{item.message}</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0 whitespace-nowrap">{formatDateTime(item.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
      )}

      {activeTab === 'shop' && <ShopTab user={currentUser} isLicenseActive={isLicenseActive} />}

      {activeTab === 'help' && (
        <HelpTab setActiveTab={(t) => setActiveTab(t as SidebarTab)} />
      )}

      </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={confirmDelete.title}
        description={confirmDelete.desc}
        onConfirm={confirmDelete.onConfirm}
        onCancel={() => setConfirmDelete((p) => ({ ...p, isOpen: false }))}
      />
      
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Perangkat Terhubung</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daftar perangkat yang sedang aktif</p>
              </div>
              <button onClick={() => setShowSessionsModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
              {activeSessions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">Belum ada perangkat terhubung.</div>
              ) : (
                activeSessions.map(session => (
                  <div key={session.token} className="p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-800 truncate">{session.deviceInfo}</p>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded">Saat ini</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">IP: {session.ipAddress}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Aktif: {session.lastActive ? new Date(session.lastActive).toLocaleString('id-ID') : '-'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Riwayat Login</h3>
                <p className="text-xs text-slate-500 mt-0.5">Aktivitas login pada akun Anda</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {loginHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">Belum ada riwayat login.</div>
              ) : (
                <div className="relative border-l-2 border-slate-100 ml-3 pl-5 space-y-6">
                  {loginHistory.map((item, i) => (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white"></div>
                      <p className="text-[11px] font-bold text-slate-400 mb-1">{new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-700">{item.deviceInfo}</p>
                        <p className="text-xs text-slate-500 mt-0.5">IP Address: {item.ipAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Key Activation Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowKeyModal(false); setError(null); } }}
        >
          <div className={`bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300 scale-100`}>
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-[#F0E6D8] bg-gradient-to-r from-[#FFF8F0] to-[#FFF0E0]">
              <button
                onClick={() => { setShowKeyModal(false); setError(null); }}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/80 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B04C2E] to-[#D96B40] flex items-center justify-center shadow-lg shadow-[#B04C2E]/20">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="title-font text-xl font-bold text-[var(--ink)]">Aktivasi Key Lisensi</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Buka semua fitur premium Sendora</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Masukkan key lisensi yang sudah Anda beli dari <strong className="text-[#B04C2E]">Shop</strong> atau yang diberikan oleh Admin untuk membuka akses seluruh fitur otomasi Sendora.
              </p>

              <form onSubmit={activateLicense} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 ml-1">Kode Key Lisensi</label>
                  <div className="relative">
                    <Gem className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B04C2E] pointer-events-none" />
                    <input
                      required
                      autoFocus
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      placeholder="Contoh: BT-07D-AB12-CD34"
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-mono font-semibold uppercase tracking-wider rounded-2xl border-2 border-[#F0E6D8] bg-[#FDFBF8] focus:outline-none focus:border-[#B04C2E] focus:ring-2 focus:ring-[#B04C2E]/10 transition-all placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700 font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={licenseLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#B04C2E] to-[#D96B40] hover:from-[#9A5034] hover:to-[#C05A30] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B04C2E]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                >
                  {licenseLoading ? (
                    <><Hourglass className="w-4 h-4 animate-spin" /> Memvalidasi Key...</>
                  ) : (
                    <><Zap className="w-4 h-4" fill="currentColor" /> Aktivkan Sekarang</>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-[#F0E6D8] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-[11px] text-slate-400 font-medium">Key hanya dapat digunakan satu kali. Aktivasi berlaku segera.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}
