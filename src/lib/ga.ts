/** Google Analytics 4 measurement IDs look like G-XXXXXXXXXX. */
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,}$/i;
/** Google Ads conversion/remarketing IDs look like AW-123456789. */
const GOOGLE_ADS_ID_PATTERN = /^AW-\d{6,}$/i;

/** sourcing.center GA4 web stream. Override with GA_MEASUREMENT_ID if needed. */
export const DEFAULT_GA_MEASUREMENT_ID = "G-7QEW0MNP6C";
/** sourcing.center Google Ads tag. Override with GOOGLE_ADS_ID if needed. */
export const DEFAULT_GOOGLE_ADS_ID = "AW-18461569757";

export function parseGaMeasurementId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return GA_MEASUREMENT_ID_PATTERN.test(id) ? id : null;
}

export function parseGoogleAdsId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return GOOGLE_ADS_ID_PATTERN.test(id) ? id : null;
}

/** Runtime env (Railway) overrides the default property. */
export function gaMeasurementIdFromEnv(): string | null {
  return (
    parseGaMeasurementId(process.env.GA_MEASUREMENT_ID) ??
    parseGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) ??
    parseGaMeasurementId(DEFAULT_GA_MEASUREMENT_ID)
  );
}

export function googleAdsIdFromEnv(): string | null {
  return (
    parseGoogleAdsId(process.env.GOOGLE_ADS_ID) ??
    parseGoogleAdsId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) ??
    parseGoogleAdsId(DEFAULT_GOOGLE_ADS_ID)
  );
}

/** First ID in the gtag.js URL. Ads first so Google Ads' crawler sees AW- in page source. */
export function googleTagLoaderSrc(gaId: string | null, adsId: string | null): string | null {
  const id = adsId ?? gaId;
  return id ? `https://www.googletagmanager.com/gtag/js?id=${id}` : null;
}

export function googleTagBootstrapScript(gaId: string | null, adsId: string | null): string {
  const lines = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js', new Date());",
  ];
  if (gaId) {
    lines.push(`gtag('config', '${gaId}', { send_page_view: false, anonymize_ip: true });`);
  }
  if (adsId) {
    lines.push(`gtag('config', '${adsId}');`);
  }
  return lines.join("\n");
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
