/**
 * Category labels for the idle /track sourcing card.
 * The card shows the headline and these choices only — no description paragraph.
 */
export const SOURCING_OFFERS = [
  { id: "goods", label: "1688 goods" },
  { id: "home", label: "Home" },
  { id: "label", label: "Private label" },
] as const;

export type SourcingOfferId = (typeof SOURCING_OFFERS)[number]["id"];

export function sourcingOffer(id: string) {
  return SOURCING_OFFERS.find((offer) => offer.id === id) ?? SOURCING_OFFERS[0];
}
