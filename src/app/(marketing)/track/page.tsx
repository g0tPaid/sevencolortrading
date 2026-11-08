import type { Metadata } from "next";
import { TrackLookup } from "@/components/tracking/track-lookup";
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
    <Container className="pb-20 pt-28 sm:pt-32">
      <TrackLookup />
    </Container>
  );
}
