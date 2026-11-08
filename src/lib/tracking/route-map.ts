import { countryLabel, countryMapPoint } from "@/lib/analytics-geo";

export type RouteArc = {
  d: string;
  from: { x: number; y: number };
  control: { x: number; y: number };
  to: { x: number; y: number };
  /** Nose points left when the destination sits west of the origin on this map. */
  facesLeft: boolean;
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
  const control = {
    x: (from.x + to.x) / 2,
    y: Math.max(28, Math.min(from.y, to.y) - lift),
  };
  return {
    d: `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
    from,
    control,
    to,
    facesLeft: to.x < from.x,
    originLabel: countryLabel(origin),
    destinationLabel: countryLabel(destination),
  };
}

export function pointOnRoute(arc: RouteArc, t: number): { x: number; y: number } {
  const clamped = Math.min(1, Math.max(0, t));
  const u = 1 - clamped;
  const { from, control, to } = arc;
  return {
    x: u * u * from.x + 2 * u * clamped * control.x + clamped * clamped * to.x,
    y: u * u * from.y + 2 * u * clamped * control.y + clamped * clamped * to.y,
  };
}

/** Horizontal travel of the curve. Negative means the nose should point left, still upright. */
export function routeTangentX(arc: RouteArc, t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  const { from, control, to } = arc;
  return 2 * (1 - clamped) * (control.x - from.x) + 2 * clamped * (to.x - control.x);
}
