// Shopify owns the fulfillment state. Never infer fulfillment from a retail payment.
export type FulfillmentCandidate = {
  id: string;
  status: string;
  requestStatus: string;
  assignedLocation: { location: { id: string } | null };
  supportedActions: { action: string }[];
  order: { displayFinancialStatus: string; cancelledAt: string | null };
};

// Provisioned by Sourcing Center staff, not by the merchant or browser.
// A separate location ID is required for every shop.
export function configuredLocation(shop: string, config = process.env.SC_FULFILLMENT_LOCATIONS): string | null {
  if (!config) return null;
  try {
    const locations = JSON.parse(config) as Record<string, unknown>;
    if (!locations || !Object.hasOwn(locations, shop)) return null;
    const location = locations[shop];
    return typeof location === 'string' && /^gid:\/\/shopify\/Location\/\d+$/.test(location) ? location : null;
  } catch { return null; }
}

export function requestBlockReason(candidate: FulfillmentCandidate | null, location: string | null): string | null {
  if (!location) return 'Sourcing Center has not configured a fulfillment location for this store.';
  if (!candidate || candidate.assignedLocation.location?.id !== location) return 'This order is not assigned to the Sourcing Center fulfillment location.';
  if (candidate.order.cancelledAt || candidate.order.displayFinancialStatus !== 'PAID') return 'Only paid, non-cancelled orders can be requested.';
  if (candidate.status !== 'OPEN' || !['UNSUBMITTED', 'REJECTED'].includes(candidate.requestStatus) || !candidate.supportedActions.some(({ action }) => action === 'REQUEST_FULFILLMENT')) return 'Shopify does not currently allow a fulfillment request for this order.';
  return null;
}

export const CANDIDATE_FIELDS = `
  id status requestStatus
  assignedLocation { location { id } }
  supportedActions { action }
  order { displayFinancialStatus cancelledAt }
`;

export const SUBMIT_REQUEST = `#graphql
  mutation SourcingCenterRequestFulfillment($id: ID!) {
    fulfillmentOrderSubmitFulfillmentRequest(id: $id) {
      submittedFulfillmentOrder { id status requestStatus }
      userErrors { field message }
    }
  }
`;
