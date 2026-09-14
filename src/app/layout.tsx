import type { Metadata } from "next";
import { Fraunces, Inter, Playfair_Display } from "next/font/google";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { defaultDescription, siteUrl, seoKeywords } from "@/lib/seo";
import { siteWideGraph } from "@/lib/structured-data";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "China Sourcing Agent — Visit China, Own 3PL Warehouses",
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
    title: "China Sourcing Agent — Visit China, Own 3PL Warehouses",
    description: defaultDescription,
    type: "website",
    locale: "en_US",
    siteName: "Sourcing Center",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "China Sourcing Agent — Visit China, Own 3PL Warehouses",
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
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={siteWideGraph()} />
      </head>
      <body
        className={`${playfair.variable} ${fraunces.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
