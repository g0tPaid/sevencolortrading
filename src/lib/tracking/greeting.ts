/**
 * The greeting uses the labeled recipient display name as printed.
 * Phones, email addresses, street addresses, and markup are dropped.
 * The name is not split into a given name.
 */

export type ShipmentPhase = "in_transit" | "delivered" | "preparing" | "unknown";

const MAX_NAME = 80;

/** Plain-text display name from the labeled recipient field, or null when it is not a name. */
export function recipientDisplayName(raw: string): string | null {
  const text = raw
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text || text.length > MAX_NAME) return null;
  if (/[<>]/.test(text) || text.includes("@")) return null;
  if (/\d{3,}/.test(text)) return null;
  if (/[*•]/.test(text)) return null;
  if (/\b(?:road|street|avenue|lane|blvd|drive|court|路|街|室|栋|单元)\b/i.test(text) || /号楼|号室/.test(text)) return null;
  if (!/\p{L}/u.test(text)) return null;
  return text;
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
export function trackingGreeting(status: string, displayName: string | null): string | null {
  const name = displayName && recipientDisplayName(displayName) === displayName ? displayName : null;
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
