import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Fraunces,
  JetBrains_Mono,
  Nunito,
} from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sourcing.center"),
  title: {
    default: "Sourcing Center by Seven Color Trading Co Ltd · China",
    template: "%s · Sourcing Center",
  },
  description:
    "Welcome to the Sourcing Center — your central command for sourcing from China. Turn product ideas into real goods with design, verified factories, QC, and logistics.",
  openGraph: {
    title: "Sourcing Center by Seven Color Trading Co Ltd · China",
    description:
      "Central command for China sourcing. Have a product idea? Let's bring it to life.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#07090d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${cormorant.variable} ${nunito.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
