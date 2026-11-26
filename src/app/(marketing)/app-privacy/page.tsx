import type { Metadata } from "next";
import PrivacyPage, { metadata as policyMetadata } from "../shopify-privacy/page";

export const metadata: Metadata = {
  ...policyMetadata,
  alternates: { canonical: "https://sourcing.center/app-privacy" },
};

export default PrivacyPage;
