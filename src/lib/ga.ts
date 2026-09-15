/** Google Analytics 4 measurement IDs look like G-XXXXXXXXXX. */

const GA_ID = /^G-[A-Z0-9]{6,}$/i;

export function parseGaMeasurementId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return GA_ID.test(id) ? id : null;
}

/** Runtime env (Railway). Prefer GA_MEASUREMENT_ID so it is not baked at build. */
export function gaMeasurementIdFromEnv(): string | null {
  return (
    parseGaMeasurementId(process.env.GA_MEASUREMENT_ID) ??
    parseGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGaEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
