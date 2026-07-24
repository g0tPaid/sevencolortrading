import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sourcing.center"),
  title: {
    default: "Sourcing Center — One Platform for Product Ideation & Sourcing",
    template: "%s · Sourcing Center",
  },
  description:
    "Sourcing.center by Seven Color Trading Co Ltd · China. Discover products, invent new ones under NDA, connect with verified manufacturers, manage production, and source from China.",
  openGraph: {
    title: "Sourcing Center by Seven Color Trading Co Ltd · China",
    description:
      "Product ideation & sourcing from China — new inventions under NDA, verified factories, QC, and logistics. By Seven Color Trading Co Ltd.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
