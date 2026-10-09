import type { Metadata } from "next";
import Link from "next/link";
import { noindexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: noindexRobots,
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">This page is not on sourcing.center</h1>
      <p className="mt-4 text-muted leading-relaxed">
        The China desk, trending products, knowledge guides, and 3PL pages are still here.
      </p>
      <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Home
        </Link>
        <Link href="/trending-products" className="text-accent underline-offset-4 hover:underline">
          Trending products
        </Link>
        <Link href="/knowledge" className="text-accent underline-offset-4 hover:underline">
          Knowledge
        </Link>
        <Link href="/contact" className="text-accent underline-offset-4 hover:underline">
          Contact
        </Link>
      </p>
    </main>
  );
}
