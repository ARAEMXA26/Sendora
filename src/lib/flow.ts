type FlowUser = {
  role: "USER" | "SUPER_ADMIN";
  telegramVerified: boolean;
  statusKey: "NONE" | "ACTIVE" | "EXPIRED";
};

export function resolveNextRoute(user: FlowUser): string {
  void user;

  // Semua role masuk ke dashboard agar super admin juga bisa menggunakan
  // fitur user (group, teks, auto send).
  // Akses panel admin tetap tersedia di route /admin.
  return "/dashboard";
}
