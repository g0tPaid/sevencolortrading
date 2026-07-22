import Link from 'next/link';
import { BRAND, waUrl } from '@/lib/brand';

export function WhatsAppFloat() {
  return (
    <a
      href={waUrl(`Hi Seven Color — I'd like help sourcing from China via ${BRAND.domain}`)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 bg-[#25D366] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
      aria-label="WhatsApp Seven Color"
    >
      WhatsApp
    </a>
  );
}

export function PrimaryCta({
  href = '/quote',
  children = 'Request a quote',
  className = '',
}: {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center bg-signal px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-ink ${className}`}
    >
      {children}
    </Link>
  );
}

export function SecondaryCta({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center border border-current px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] transition hover:bg-ink hover:text-paper ${className}`}
    >
      {children}
    </Link>
  );
}
