import type { Metadata } from "next";
import { TrackLookup } from "@/components/tracking/track-lookup";
import { Container } from "@/components/ui/primitives";
import { routeMetadata } from "@/lib/seo";

export const metadata: Metadata = routeMetadata({
  title: "Track a Sourcing Center Shipment",
  description:
    "Search a tracking number. Supported carriers can return status and events. Not every carrier worldwide is covered, and unsupported numbers are reported as such.",
  path: "/track",
});

export default function TrackPage() {
  return (
    <Container className="pb-20 pt-28 sm:pt-32">
      <TrackLookup />
    </Container>
  );
}
