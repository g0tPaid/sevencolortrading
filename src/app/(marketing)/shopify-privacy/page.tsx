import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sourcing Center Shopify App Privacy Policy",
  description: "How the Sourcing Center Shopify app handles store and order information.",
  alternates: { canonical: "https://sourcing.center/shopify-privacy" },
};

export default function ShopifyPrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20 pt-28 sm:pt-36">
      <p className="text-sm font-semibold text-rose-700">Sourcing Center · Shopify app</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Privacy policy</h1>
      <div className="mt-8 space-y-7 text-base leading-relaxed text-slate-700">
        <p>This policy describes how {company.legalNameFull} (Sourcing Center) handles information in its Shopify app, which connects merchants with our sourcing and fulfillment team.</p>
        <div><h2 className="text-xl font-semibold text-slate-900">Information we access</h2><p>With merchant authorization, the app reads recent Shopify order identifiers, order numbers, dates, totals, currencies, and payment and fulfillment statuses. Shopify supplies store identifiers and session credentials to authenticate the installation. Merchants provide their existing Sourcing Center or SoloFlow dropshipper ID and a one-time connection code to link their store. The app does not request buyer names, email addresses, phone numbers or shipping addresses through its current order viewer.</p></div>
        <div><h2 className="text-xl font-semibold text-slate-900">How information is used</h2><p>We use information to authenticate the merchant, associate the store with an authorized customer account, display order status, provide support, and handle privacy requests. The current app is read-only and does not initiate purchases, payments, or shipment fulfillment. It does not place storefront tracking pixels or use order information for advertising.</p></div>
        <div><h2 className="text-xl font-semibold text-slate-900">Storage and retention</h2><p>Store sessions and account associations are retained to operate the connection. Connection codes expire after 15 minutes; the service stores a digest rather than the plaintext code. The current order viewer retrieves recent order information from Shopify instead of retaining the raw order responses. Privacy request references may be retained while requests are processed. The Shopify app's shop-erasure process removes the store session and associated integration records. Records held independently for existing sourcing or invoicing services are handled separately according to operational and applicable legal obligations.</p></div>
        <div><h2 className="text-xl font-semibold text-slate-900">Service providers and international processing</h2><p>Shopify provides the store platform and authentication; Railway hosts the app and Sourcing Center backend. Our sourcing team operates in China and may access integration information as needed for support. Information can be processed outside the merchant's country. Access is intended for authorized staff and systems providing the service.</p></div>
        <div><h2 className="text-xl font-semibold text-slate-900">Access and privacy requests</h2><p>Merchants may uninstall the app from Shopify. We handle Shopify's mandatory customer data requests, customer erasure and shop erasure notifications. Merchants and their buyers may contact us about access, correction or deletion requests; please identify the relevant store or coordinate with the merchant so we can verify and respond to the request without exposing another person's information.</p></div>
        <div><h2 className="text-xl font-semibold text-slate-900">Contact</h2><p>For privacy questions or requests, email <a className="font-medium text-rose-700 underline" href="mailto:info@sevencolortrading.com">info@sevencolortrading.com</a>. Our business contact information is available on the <Link className="font-medium text-rose-700 underline" href="/contact">contact page</Link>.</p></div>
      </div>
    </section>
  );
}
