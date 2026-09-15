/** WhatsApp desk used by the marketing float and trust CTAs. */

export const WHATSAPP_NUMBER = "8618059262730";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Seven Color, I'd like help sourcing from China via Sourcing Center.";

export const whatsappPresets = {
  home: "Hi Seven Color, I came from sourcing.center and want help sourcing from China.",
  rfq: "Hi Seven Color, I want to send an RFQ / product brief via Sourcing Center.",
  reviews:
    "Hi Seven Color, I saw the reviews on sourcing.center and would like references or to start sourcing.",
  caseStudies:
    "Hi Seven Color, I read a sourcing.center case study and would like to discuss a similar program.",
  factorySourcing:
    "Hi Seven Color, I'm looking at the new-product factory sourcing case study and want a similar program.",
  threePl:
    "Hi Seven Color, I'm looking at China/Dubai 3PL fulfillment and want to talk through stock and lanes.",
  factoryVisit:
    "Hi Seven Color, I'm looking at a hosted Visit China factory trip based out of Xiamen.",
  inspection:
    "Hi Seven Color, I need on-the-ground inspection in China (factory audit / PSI / DUPRO / loading) via Sourcing Center.",
  amazonFba:
    "Hi Seven Color, I want to private-label a product in China and prepare it for Amazon FBA (OEM, packaging, QC, carton marks, freight).",
  factories:
    "Hi Seven Color, I'm a factory applying via sourcing.center/factories/register (工厂入驻).",
  factoryGrowth:
    "Hi Seven Color, I'm a factory inquiring about international presence services on sourcing.center/factory-growth.",
  dropshipping:
    "Hi Seven Color, I want to dropship from your China (Xiamen) or Dubai warehouse stock.",
  compareAgent:
    "Hi Seven Color, I read sourcing agent vs Alibaba on sourcing.center and want a sourcing desk, not a marketplace.",
  compareFreight:
    "Hi Seven Color, I read China 3PL vs DIY freight on sourcing.center and want own-warehouse fulfillment.",
  compareVisit:
    "Hi Seven Color, I read factory visit vs remote QC on sourcing.center and want to talk through a Visit China trip.",
  updates:
    "Hi Seven Color, I saw an update on sourcing.center and want to start a sourcing conversation.",
  news:
    "Hi Seven Color, I read China sourcing news on sourcing.center/news and want the factory-floor read for my SKU.",
} as const;

export type WhatsAppPreset = keyof typeof whatsappPresets;

export function whatsappHref(message?: string | null) {
  const text = (message ?? "").trim() || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
