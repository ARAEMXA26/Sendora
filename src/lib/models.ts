export type Role = "USER" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  password?: string;
  firebaseUid?: string;
  authProvider: "LOCAL" | "FIREBASE";
  role: Role;
  nomorTelegram?: string;
  telegramUsername?: string;
  telegramSession?: string;
  sessionToken?: string;
  telegramVerified: boolean;
  keyLisensiAktif?: string;
  statusKey: "NONE" | "ACTIVE" | "EXPIRED";
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  lastActive?: string | null;
  createdAt: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface OtpSession {
  userId: string;
  nomorTelegram: string;
  phoneCodeHash?: string | null;
  sessionString?: string | null;
  otp: string;
  expiresAt: string;
}

export interface TargetGrup {
  idGrup: string;
  userId: string;
  namaGrup: string;
  source: "MANUAL" | "FETCH_ALL";
  photoUrl?: string | null;
  memberCount?: number | null;
  onlineCount?: number | null;
  providerGroupId?: string | null;
}

export interface PesanTeks {
  idTeks: string;
  userId: string;
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
}

export interface KeyLisensi {
  id: string;
  kodeKey: string;
  durasiHari: number;
  createdAt: string;
  expiresAt: string;
  statusTerpakai: boolean;
  createdByUserId: string;
  usedByUserId?: string;
}

export interface SendLog {
  id: string;
  userId: string;
  groupId: string;
  groupName: string;
  textId: string;
  textPreview: string;
  status: "TERKIRIM" | "GAGAL";
  createdAt: string;
}

export interface AutoSendStatus {
  userId: string;
  delaySeconds: number;
  deliveryMode?: string;
  msgTarget?: string | null;
  scheduleDate?: string | null;
  scheduleTime?: string | null;
  intervalNum?: number | null;
  intervalUnit?: string | null;
  sendCount?: number | null;
  isRunning: boolean;
  startedAt?: string;
  stoppedAt?: string;
}

export interface PengaturanUser {
  userId: string;
  delaySeconds: number;
}

export interface DashboardState {
  user: User;
  groups: TargetGrup[];
  messages: PesanTeks[];
  delaySeconds: number;
  autoSend: AutoSendStatus;
  logs: SendLog[];
}

export interface TodayStats {
  sent: number;
  success: number;
  failed: number;
  successRate: number;
}

export interface ChartDataPoint {
  label: string;
  dateStr: string;
  count: number;
}

export interface GroupDistributionData {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardStatsData {
  todayStats: TodayStats;
  chartData: ChartDataPoint[];
  groupDistribution: GroupDistributionData[];
}

export interface SystemSetting {
  id: string;
  maintenanceMode: boolean;
  updatedAt: string;
}
