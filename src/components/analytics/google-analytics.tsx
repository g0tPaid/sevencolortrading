"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { parseGaMeasurementId } from "@/lib/ga";

function loadGtag(id: string) {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga4-src")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false, anonymize_ip: true });

  const script = document.createElement("script");
  script.id = "ga4-src";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

function GaPageviews({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname || "/";
    window.gtag("event", "page_view", {
      send_to: measurementId,
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string | null }) {
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

  useEffect(() => {
    if (id) loadGtag(id);
  }, [id]);

  if (!id) return null;

  return (
    <Suspense fallback={null}>
      <GaPageviews measurementId={id} />
    </Suspense>
  );
}
