"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { parseGaMeasurementId } from "@/lib/ga";

function gtagScriptAlreadyInDom() {
  return Boolean(
    document.getElementById("ga4-src") ||
      document.getElementById("google-tag-src") ||
      document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
  );
}

function loadGtag(gaId: string, adsId?: string | null) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { send_page_view: false, anonymize_ip: true });
    if (adsId) window.gtag("config", adsId);
  }

  if (gtagScriptAlreadyInDom()) return;

  const script = document.createElement("script");
  script.id = "google-tag-src";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId || gaId}`;
  document.head.appendChild(script);
}

function GaPageviews({
  measurementId,
  adsId,
}: {
  measurementId: string;
  adsId?: string | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadGtag(measurementId, adsId);
    if (typeof window.gtag !== "function") return;
    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname || "/";
    window.gtag("event", "page_view", {
      send_to: measurementId,
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [adsId, measurementId, pathname, searchParams]);

  return null;
}

export function GoogleAnalytics({
  measurementId,
  adsId,
}: {
  measurementId?: string | null;
  adsId?: string | null;
}) {
  const [id, setId] = useState<string | null>(() => parseGaMeasurementId(measurementId));

  useEffect(() => {
    const fromProp = parseGaMeasurementId(measurementId);
    if (fromProp) {
      setId(fromProp);
      return;
    }
    let cancelled = false;
    void fetch("/api/ga")
      .then((response) => response.json())
      .then((payload: { id?: unknown }) => {
        if (cancelled) return;
        setId(parseGaMeasurementId(payload.id));
      })
      .catch(() => {
        // GA must never break the page
      });
    return () => {
      cancelled = true;
    };
  }, [measurementId]);

  if (!id) return null;

  return (
    <Suspense fallback={null}>
      <GaPageviews measurementId={id} adsId={adsId} />
    </Suspense>
  );
}
