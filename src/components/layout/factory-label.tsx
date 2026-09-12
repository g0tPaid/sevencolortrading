"use client";

import { useEffect, useState } from "react";
import { FACTORIES_NAV_LABEL, FACTORIES_ZH_LABEL } from "@/lib/factory-label";
import {
  FACTORY_ZH_COOKIE,
  GEO_COUNTRY_COOKIE,
  prefersChinese,
  shouldShowFactoryZh,
} from "@/lib/geo-detect";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  for (const part of document.cookie.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) {
      try {
        return decodeURIComponent(rest.join("="));
      } catch {
        return rest.join("=");
      }
    }
  }
  return undefined;
}

function clientLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

function hintFromClient(): boolean {
  if (readCookie(FACTORY_ZH_COOKIE) === "1") return true;
  const country = readCookie(GEO_COUNTRY_COOKIE);
  const languages = clientLanguages();
  return shouldShowFactoryZh({ country, acceptLanguage: languages });
}

function countryCookieKnownNotChina(): boolean {
  const country = readCookie(GEO_COUNTRY_COOKIE);
  return Boolean(country && country !== "CN");
}

const CACHE_KEY = "sc_factory_zh";

let resolved: boolean | null = null;
let inflight: Promise<boolean> | null = null;

async function resolveShowFactoryZh(): Promise<boolean> {
  if (resolved !== null) return resolved;
  if (inflight) return inflight;

  inflight = (async () => {
    if (hintFromClient()) {
      resolved = true;
      return true;
    }
    if (countryCookieKnownNotChina() && !prefersChinese(clientLanguages())) {
      resolved = false;
      return false;
    }

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached === "1") {
        resolved = true;
        return true;
      }
      if (cached === "0") {
        resolved = false;
        return false;
      }
    } catch {
      // sessionStorage may be blocked
    }

    try {
      const res = await fetch("/api/geo", { credentials: "same-origin", cache: "no-store" });
      if (!res.ok) {
        resolved = false;
        return false;
      }
      const data = (await res.json()) as { showFactoryZh?: boolean };
      resolved = Boolean(data.showFactoryZh);
      try {
        sessionStorage.setItem(CACHE_KEY, resolved ? "1" : "0");
      } catch {
        // ignore
      }
      return resolved;
    } catch {
      resolved = false;
      return false;
    }
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/**
 * China (geo cookie / /api/geo) or Chinese Accept-Language / navigator.languages.
 * Starts English to avoid hydration mismatch on static marketing pages.
 */
export function useShowFactoryZh(): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void resolveShowFactoryZh().then((value) => {
      if (!cancelled && value) setShow(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return show;
}

export function FactoryLabel() {
  const showZh = useShowFactoryZh();
  return (
    <>
      {FACTORIES_NAV_LABEL}
      {showZh ? (
        <>
          <span aria-hidden="true"> · </span>
          <span lang="zh-CN">{FACTORIES_ZH_LABEL}</span>
        </>
      ) : null}
    </>
  );
}
