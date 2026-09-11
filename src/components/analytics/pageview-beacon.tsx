"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

let lastQueuedPath: string | null = null;

function sendHit(path: string) {
  const body = JSON.stringify({ path });
  const url = "/api/analytics/hit";

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    // fall through to fetch
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {
    // analytics must never break the page
  });
}

export function PageviewBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (lastQueuedPath === pathname) return;
    lastQueuedPath = pathname;
    sendHit(pathname);
  }, [pathname]);

  return null;
}
