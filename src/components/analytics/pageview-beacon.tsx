"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type HitType = "pageview" | "heartbeat" | "leave";

let lastQueuedPath: string | null = null;

function sendHit(path: string, type: HitType) {
  const body = JSON.stringify({ path, type });
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
  const pathRef = useRef(pathname || "/");

  useEffect(() => {
    if (!pathname) return;
    pathRef.current = pathname;
    if (lastQueuedPath === pathname) return;
    lastQueuedPath = pathname;
    sendHit(pathname, "pageview");
  }, [pathname]);

  useEffect(() => {
    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      sendHit(pathRef.current || "/", "heartbeat");
    };

    const intervalId = window.setInterval(tick, 15_000);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        sendHit(pathRef.current || "/", "leave");
      }
    };

    const onPageHide = () => {
      sendHit(pathRef.current || "/", "leave");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
