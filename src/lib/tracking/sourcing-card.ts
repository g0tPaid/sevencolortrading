/**
 * Copy for the idle /track sourcing card. Wording follows the public site:
 * 1688 into the Xiamen warehouse, home goods, and OEM/ODM. No prices or promises.
 */
export const SOURCING_OFFERS = [
  {
    id: "goods",
    label: "1688 goods",
    detail: "We pay 1688 in RMB, receive into our Xiamen warehouse, then QC and export.",
  },
  {
    id: "home",
    label: "Home",
    detail: "Furniture, décor, and household goods, with photo and video checks before they ship.",
  },
  {
    id: "label",
    label: "Private label",
    detail: "OEM and ODM with sampling and production oversight from our Xiamen hub.",
  },
] as const;

export type SourcingOfferId = (typeof SOURCING_OFFERS)[number]["id"];

export function sourcingOffer(id: string) {
  return SOURCING_OFFERS.find((offer) => offer.id === id) ?? SOURCING_OFFERS[0];
}
