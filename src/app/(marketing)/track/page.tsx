import type { Metadata } from "next";
import { TrackLookup } from "@/components/tracking/track-lookup";
import { Container } from "@/components/ui/primitives";
import { routeMetadata } from "@/lib/seo";

export const metadata: Metadata = routeMetadata({
  title: "Free Global Package Tracker | Sourcing Center",
  description:
    "Track international packages for free. Enter a tracking number to see shipping status and delivery updates from supported carriers.",
  path: "/track",
});

export default function TrackPage() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-20 bg-canvas sm:h-[6.5rem]" />
      <Container className="pb-36 pt-20 sm:pb-28 sm:pt-[6.5rem]">
        <TrackLookup />
        <section aria-labelledby="how-to-track" className="glass-card mx-auto mt-12 max-w-3xl rounded-3xl p-6 sm:p-8">
          <h2 id="how-to-track" className="font-display text-2xl font-semibold text-ink">How to track a package</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
            <li>Copy the tracking number from your shipping confirmation or ask the sender for it.</li>
            <li>Enter the number above and select Search. If the number matches several carriers, choose the one on your shipping confirmation.</li>
            <li>Read the latest shipping status and scan history when the carrier provides updates.</li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Supported carriers include UPS, FedEx, DHL, USPS, China Post, Cainiao, Australia Post, and NZ Post.
            Tracking availability depends on the carrier and shipment.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            If the carrier asks for a delivery postcode, sign-in, or security check, use the carrier’s official tracking page.
            For a newly issued number, check again after the carrier scans the package.
          </p>
        </section>
      </Container>
    </>
  );
}
