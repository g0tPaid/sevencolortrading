import type { Metadata } from 'next';
import { Manrope, Syne } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WhatsAppFloat } from '@/components/cta';
import { BRAND } from '@/lib/brand';
import './globals.css';

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const display = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — Source from China`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  metadataBase: new URL(`https://${BRAND.domain}`),
  openGraph: {
    title: BRAND.name,
    description: BRAND.description,
    siteName: BRAND.name,
    type: 'website',
    url: `https://${BRAND.domain}`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
