/** Reddit Ads pixel IDs look like a2_ followed by letters/numbers. */
const REDDIT_PIXEL_ID_PATTERN = /^a2_[A-Za-z0-9]+$/;

export function parseRedditPixelId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return REDDIT_PIXEL_ID_PATTERN.test(id) ? id : null;
}

/** Runtime env (Railway). No default — do not invent a pixel ID. */
export function redditPixelIdFromEnv(): string | null {
  return (
    parseRedditPixelId(process.env.REDDIT_PIXEL_ID) ??
    parseRedditPixelId(process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID)
  );
}

/**
 * Official Reddit Pixel base code for <head>.
 * Pixel Helper / Ads checker look for rdt('init', …) in HTML, not a Next.js script queue.
 * https://business.reddithelp.com/s/article/Install-the-Reddit-Pixel-on-your-website
 */
export function redditPixelBootstrapScript(pixelId: string): string {
  const id = parseRedditPixelId(pixelId);
  if (!id) return "";
  // id is /^a2_[A-Za-z0-9]+$/ so it is safe inside these quoted strings.
  return [
    `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=${id}";t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s);}}(window,document);`,
    `rdt('init','${id}');`,
    "rdt('track','PageVisit');",
  ].join("\n");
}

declare global {
  interface Window {
    rdt?: {
      (...args: unknown[]): void;
      sendEvent?: (...args: unknown[]) => void;
      callQueue?: unknown[];
    };
  }
}
