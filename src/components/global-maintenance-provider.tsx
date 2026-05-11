"use client";

import { useEffect, useState } from "react";
import { MaintenanceOverlay } from "./maintenance-overlay";
import { usePathname } from "next/navigation";

// Pages that should never be blocked by maintenance overlay
const EXCLUDED_PATHS = ["/auth"];

export function GlobalMaintenanceProvider() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      try {
        const sysRes = await fetch(`/api/system/status?t=${Date.now()}`);
        if (!sysRes.ok) {
          // If status API fails, assume NOT in maintenance
          if (active) setIsMaintenance(false);
          return;
        }
        const sysData = await sysRes.json();

        let meData: { user: { role?: string } | null } = { user: null };
        try {
          const meRes = await fetch(`/api/me?t=${Date.now()}`);
          if (meRes.ok) {
            meData = await meRes.json();
          }
        } catch {
          // Not logged in — that's fine
        }

        if (!active) return;

        setIsSuperAdmin(meData?.user?.role === "SUPER_ADMIN");
        setIsMaintenance(sysData?.maintenanceMode === true);
      } catch {
        // On network error, default to NOT in maintenance
        if (active) setIsMaintenance(false);
      }
    }

    checkStatus();

    // Poll every 10 seconds
    const interval = setInterval(checkStatus, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Never block excluded paths (e.g. /auth) so admin can always login
  if (EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  // Super admin can bypass maintenance mode on any route
  if (isMaintenance && !isSuperAdmin) {
    return <MaintenanceOverlay />;
  }

  return null;
}
