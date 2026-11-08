import type { Metadata } from "next";
import { TrackLookup } from "@/components/tracking/track-lookup";
import { PageHero } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { routeMetadata } from "@/lib/seo";

export const metadata: Metadata = routeMetadata({
  title: "Track a Sourcing Center Shipment",
  description:
    "Track a shipment registered with Sourcing Center. See status, carrier wording, origin, destination, and the timeline from the last scheduled check.",
  path: "/track",
});

export default function TrackPage() {
  return (
    <>
      <PageHero
        eyebrow="Shipments"
        title="Track a shipment"
        description="Enter a tracking number from the sourcing desk. The result is the last stored carrier update, including the original wording when the carrier sent it."
      />
      <Container className="pb-20">
        <TrackLookup />
      </Container>
    </>
  );
}
