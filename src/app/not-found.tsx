import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-24">
      <p className="section-kicker mb-3">404</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        This page is not on sourcing.center
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
        That address does not match a sourcing page. Visit China, 3PL, inspection, and the rest of the site are still available.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to Sourcing Center</ButtonLink>
      </div>
    </Container>
  );
}
