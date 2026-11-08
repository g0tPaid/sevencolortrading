/**
 * A greeting may include one given name taken from the labeled recipient field.
 * The full recipient string is never kept.
 */

const GIVEN_NAME = /^[A-Za-z][A-Za-z'’-]{1,19}$/;
const FAMILY_NAME = /^[A-Za-z][A-Za-z'’-]{1,29}$/;
const ORG = /\b(?:inc|llc|ltd|co|company|corp|gmbh|logistics|express|group|store|shop|warehouse)\b/i;
const ORG_ZH = /公司|有限|集团/;

export type ShipmentPhase = "in_transit" | "delivered" | "preparing" | "unknown";

/** Keep a given name only when the labeled field is one person in a simple form. */
export function extractGivenName(raw: string): string | null {
  const text = raw
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text || text.length > 80) return null;
  if (/[<>@]|\d|[*•·]|收件|地址|电话|手机/.test(text)) return null;
  if (ORG.test(text) || ORG_ZH.test(text)) return null;
  if (/[&/]|\\|\band\b/i.test(text)) return null;
  if (/[\u3400-\u9fff]/.test(text) || text.includes(",")) return null;
  const parts = text.split(" ");
  if (parts.length < 1 || parts.length > 2) return null;
  const given = parts[0] ?? "";
  if (!GIVEN_NAME.test(given)) return null;
  if (parts.length === 2 && !FAMILY_NAME.test(parts[1] ?? "")) return null;
  return given;
}

export function shipmentPhase(status: string): ShipmentPhase {
  const text = status.normalize("NFKC");
  if (/未签收/.test(text)) return "unknown";
  if (/已签收|(^|[^未])签收/.test(text) || text === "Delivered") return "delivered";
  if (/转运中|运输中|派送中|正在派送|已发货|已出库|已开船|已到港|已装柜/.test(text)) return "in_transit";
  if (text === "In Transit" || text === "Out for Delivery") return "in_transit";
  if (/电子信息已经收到|信息已发送给|已揽收|^揽收|已入库/.test(text)) return "preparing";
  if (text === "Information Received" || text === "Picked Up") return "preparing";
  return "unknown";
}

/** Status-aware line. Unknown, pending, and errors produce no movement claim. */
export function trackingGreeting(status: string, givenName: string | null): string | null {
  const name = givenName && extractGivenName(givenName) === givenName ? givenName : null;
  const phase = shipmentPhase(status);
  if (phase === "in_transit") {
    return name ? `${name}, your shipment is on its way to you. Cheers!` : "Your shipment is on its way to you. Cheers!";
  }
  if (phase === "delivered") {
    return name ? `${name}, your shipment has been delivered. Cheers!` : "Your shipment has been delivered. Cheers!";
  }
  if (phase === "preparing") {
    return name ? `${name}, your shipment is being prepared. Cheers!` : "Your shipment is being prepared. Cheers!";
  }
  return null;
}
