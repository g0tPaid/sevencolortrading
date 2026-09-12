/** WhatsApp desk used by the marketing float and trust CTAs. */

export const WHATSAPP_NUMBER = "8618059262730";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Seven Color — I'd like help sourcing from China via Sourcing Center.";

export const whatsappPresets = {
  reviews:
    "Hi Seven Color — I saw the reviews on sourcing.center and would like to start a sourcing conversation.",
  caseStudies:
    "Hi Seven Color — I read a sourcing.center case study and would like to discuss a similar program.",
  factorySourcing:
    "Hi Seven Color — I'm looking at the new-product factory sourcing case study and want a similar program.",
  threePl:
    "Hi Seven Color — I'm looking at Xiamen/Dubai 3PL fulfillment and want to talk through stock and lanes.",
  factoryVisit:
    "Hi Seven Color — I'm looking at a hosted factory visit / QC trip from the Xiamen desk.",
} as const;

export type WhatsAppPreset = keyof typeof whatsappPresets;

export function whatsappHref(message?: string | null) {
  const text = (message ?? "").trim() || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
