"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { parseRedditPixelId } from "@/lib/reddit-pixel";

function redditScriptAlreadyInDom() {
  return Boolean(document.querySelector('script[src*="redditstatic.com/ads/pixel.js"]'));
}

function loadRedditPixel(pixelId: string) {
  if (typeof window === "undefined") return;

  if (typeof window.rdt !== "function") {
    const p = function redditPixel() {
      // eslint-disable-next-line prefer-rest-params
      if (p.sendEvent) p.sendEvent.apply(p, arguments as unknown as []);
      else p.callQueue?.push(arguments);
    };
    p.callQueue = [] as unknown[];
    window.rdt = p;
    window.rdt("init", pixelId);
    window.rdt("track", "PageVisit");
  }

  if (redditScriptAlreadyInDom()) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.redditstatic.com/ads/pixel.js?pixel_id=${pixelId}`;
  document.head.appendChild(script);
}

function RedditPagevisits({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      // Head snippet already inited + PageVisit. Client-only fallback loads both.
      if (typeof window.rdt !== "function") loadRedditPixel(pixelId);
      return;
    }
    if (typeof window.rdt !== "function") return;
    window.rdt("track", "PageVisit");
  }, [pathname, pixelId, searchParams]);

  return null;
}

export function RedditPixel({ pixelId }: { pixelId?: string | null }) {
  const [id, setId] = useState<string | null>(() => parseRedditPixelId(pixelId));

  useEffect(() => {
    const fromProp = parseRedditPixelId(pixelId);
    if (fromProp) {
      setId(fromProp);
      return;
    }
    let cancelled = false;
    void fetch("/api/ga")
      .then((response) => response.json())
      .then((payload: { redditId?: unknown }) => {
        if (cancelled) return;
        setId(parseRedditPixelId(payload.redditId));
      })
      .catch(() => {
        // Pixel must never break the page
      });
    return () => {
      cancelled = true;
    };
  }, [pixelId]);

  if (!id) return null;

  return (
    <Suspense fallback={null}>
      <RedditPagevisits pixelId={id} />
    </Suspense>
  );
}
