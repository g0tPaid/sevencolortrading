import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
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
    "Discover winning product ideas, validate demand, connect with verified manufacturers, manage production, and source directly from China—all from one intelligent platform. By Seven Color Trading Co Ltd.",
  openGraph: {
    title: "Sourcing Center — Product Ideation & Sourcing from China",
    description:
      "Sourcing.center by Seven Color Trading — product ideation, verified factories, QC, and logistics from China.",
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
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
