import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { RedditPixel } from "@/components/analytics/reddit-pixel";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/layout/theme-provider";
import {
  gaMeasurementIdFromEnv,
  googleAdsIdFromEnv,
  googleTagBootstrapScript,
  googleTagLoaderSrc,
} from "@/lib/ga";
import { redditPixelBootstrapScript, redditPixelIdFromEnv } from "@/lib/reddit-pixel";
import { defaultDescription, siteUrl, seoKeywords } from "@/lib/seo";
import { siteWideGraph } from "@/lib/structured-data";
import "./globals.css";

const playfair = localFont({
  src: "../fonts/playfair-display-latin.woff2",
  weight: "500 700",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const fraunces = localFont({
  src: "../fonts/fraunces-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "China Sourcing Agent: Visit China, Own 3PL Warehouses",
    template: "%s · Sourcing Center",
  },
  description: defaultDescription,
  keywords: seoKeywords,
  applicationName: "Sourcing Center",
  authors: [{ name: "Seven Color Trading Co Ltd", url: siteUrl }],
  creator: "Seven Color Trading Co Ltd",
  publisher: "Seven Color Trading Co Ltd",
  category: "business",
  openGraph: {
    title: "China Sourcing Agent: Visit China, Own 3PL Warehouses",
    description: defaultDescription,
    type: "website",
    locale: "en_US",
    siteName: "Sourcing Center",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "China Sourcing Agent: Visit China, Own 3PL Warehouses",
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: { "mobile-web-app-capable": "yes" },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0E" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = gaMeasurementIdFromEnv();
  const adsId = googleAdsIdFromEnv();
  const gtagSrc = googleTagLoaderSrc(gaId, adsId);
  const redditPixelId = redditPixelIdFromEnv();
  const redditPixelScript = redditPixelId ? redditPixelBootstrapScript(redditPixelId) : "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={siteWideGraph()} />
        {gtagSrc ? (
          <>
            {/* Google's Ads crawler looks for this exact gtag.js URL in HTML, not a Next.js script queue. */}
            <script async src={gtagSrc} />
            <script
              dangerouslySetInnerHTML={{
                __html: googleTagBootstrapScript(gaId, adsId),
              }}
            />
          </>
        ) : null}
        {redditPixelScript ? (
          <script
            dangerouslySetInnerHTML={{
              __html: redditPixelScript,
            }}
          />
        ) : null}
      </head>
      <body
        className={`${playfair.variable} ${fraunces.variable} ${inter.variable} font-sans antialiased`}
      >
        <GoogleAnalytics measurementId={gaId} adsId={adsId} />
        <RedditPixel pixelId={redditPixelId} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
