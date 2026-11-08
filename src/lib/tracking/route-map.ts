import { countryLabel, countryMapPoint } from "@/lib/analytics-geo";

export type RouteArc = {
  d: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  originLabel: string;
  destinationLabel: string;
};

/**
 * A curve between two country centers on the existing equirectangular map.
 * One bend, no intermediate stops, and no point that claims a live position.
 */
export function routeArc(origin: string | null | undefined, destination: string | null | undefined): RouteArc | null {
  if (!origin || !destination || origin === destination) return null;
  const from = countryMapPoint(origin);
  const to = countryMapPoint(destination);
  if (!from || !to) return null;
  const lift = Math.min(110, Math.max(36, Math.hypot(to.x - from.x, to.y - from.y) * 0.28));
  const cx = (from.x + to.x) / 2;
  const cy = Math.max(28, Math.min(from.y, to.y) - lift);
  return {
    d: `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
    from,
    to,
    originLabel: countryLabel(origin),
    destinationLabel: countryLabel(destination),
  };
}
