"use client";

import { useEffect, useMemo, useState } from "react";
import { getCmsApiBaseUrl } from "@/lib/cms";

type DbState = "connected" | "connecting" | "disconnecting" | "disconnected" | "unknown";

interface HealthPayload {
  status?: string;
  db?: {
    readyState?: number;
    state?: DbState;
  };
}

function statusTone(dbState: DbState, reachable: boolean) {
  if (!reachable) {
    return "border-destructive/30 bg-destructive/5 text-destructive";
  }

  if (dbState === "connected") {
    return "border-emerald-300 bg-emerald-50 text-emerald-800";
  }

  if (dbState === "connecting" || dbState === "disconnecting") {
    return "border-amber-300 bg-amber-50 text-amber-800";
  }

  return "border-destructive/30 bg-destructive/5 text-destructive";
}

export default function AdminApiStatusBanner() {
  const [dbState, setDbState] = useState<DbState>("unknown");
  const [reachable, setReachable] = useState(true);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const baseUrl = useMemo(() => getCmsApiBaseUrl(), []);

  useEffect(() => {
    let mounted = true;

    async function checkHealth() {
      try {
        const response = await fetch(`${baseUrl}/api/health`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });

        if (!mounted) return;

        if (!response.ok) {
          setReachable(false);
          setDbState("unknown");
          setLastChecked(new Date().toISOString());
          return;
        }

        const data = (await response.json()) as HealthPayload;
        setReachable(true);
        setDbState(data.db?.state || "unknown");
        setLastChecked(new Date().toISOString());
      } catch {
        if (!mounted) return;
        setReachable(false);
        setDbState("unknown");
        setLastChecked(new Date().toISOString());
      }
    }

    checkHealth();
    const intervalId = window.setInterval(checkHealth, 30000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [baseUrl]);

  const tone = statusTone(dbState, reachable);
  const timeLabel = lastChecked
    ? new Date(lastChecked).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })
    : "checking...";

  const message = !reachable
    ? "CMS API unreachable"
    : dbState === "connected"
      ? "CMS API connected"
      : `CMS API ${dbState}`;

  return (
    <div className="sticky top-0 z-50 px-4 md:px-6 pt-4">
      <div className={`mx-auto max-w-6xl rounded-md border px-3 py-2 text-sm font-medium ${tone}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{message}</span>
          <span className="text-xs opacity-80">Last check: {timeLabel}</span>
        </div>
      </div>
    </div>
  );
}
