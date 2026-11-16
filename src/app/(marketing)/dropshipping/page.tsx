import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowDown, CheckCircle2, ClipboardCheck, Mail, PackageCheck, ShoppingCart, Truck, LockKeyhole } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand, ServiceBadgeHero } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { dropshippingFaqJsonLd, dropshippingPageJsonLd } from "@/lib/seo";
import { pages } from "@/lib/route-seo";
import { offerNode } from "@/lib/structured-data";
import { whatsappPresets } from "@/lib/whatsapp";
import {
  dropshipping,
  dropshippingBenefits,
  dropshippingFaqs,
  dropshippingSteps,
} from "@/lib/v2-content";

export const metadata: Metadata = pages.dropshipping;

export default function DropshippingPage() {
  return (
    <>
      <JsonLd data={dropshippingPageJsonLd()} />
      <JsonLd data={dropshippingFaqJsonLd()} />
      <JsonLd data={offerNode("dropshipping")} />
      <WhatsAppPrefill message={whatsappPresets.dropshipping} />
      <Container className="pb-16 pt-28 sm:pt-32">
        <p className="section-kicker">
          Seven Color Trading Co Ltd · own warehouses · not a broker
        </p>
        <ServiceBadgeHero badge={dropshipping.eyebrow} subtitle={dropshipping.title} />
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{dropshipping.description}</p>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Legal entity {company.legalNameFull}. DUNS {company.credentials.dunsNumber}. Dropship
          fulfillment from{" "}
          {dropshippingBenefits.map((h) => `${h.city}, ${h.country}`).join(" and ")}.
        </p>

        <p className="mt-6 text-sm text-muted">
          Have an order? Open the private link from your warehouse team for photos and videos, or{" "}
          <Link href="/track" className="font-semibold text-ink underline">track your package by shipment number</Link>.
        </p>

        <section className="mt-12 glass-card rounded-[1.5rem] p-6 sm:p-8" aria-labelledby="dropship-email">
          <div className="flex items-center gap-3">
            <Mail className="h-7 w-7 text-accent" aria-hidden="true" />
            <h2 id="dropship-email" className="font-display text-2xl font-semibold text-ink">How to submit a dropshipping order</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">When sending your order email, add <a href="mailto:info@sevencolortrading.com" className="font-semibold text-ink underline">info@sevencolortrading.com</a> in CC so our fulfillment team receives a copy. Include your Sourcing Center customer number and order number in the subject.</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-ink">Email checklist</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li><strong className="text-ink">CC:</strong> info@sevencolortrading.com</li>
                <li><strong className="text-ink">Subject:</strong> CustomerNumber + #OrderNumber</li>
                <li><strong className="text-ink">Product:</strong> description and product link (if available)</li>
                <li><strong className="text-ink">Options:</strong> color, size or variant, quantity</li>
                <li><strong className="text-ink">Delivery:</strong> customer name, phone, full address, city, country and postal code (if applicable)</li>
                <li><strong className="text-ink">Notes:</strong> special packing or inspection requests (if any)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-background/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Example email</p>
              <div className="mt-3 space-y-2 text-sm text-ink">
                <p><strong>CC:</strong> info@sevencolortrading.com</p>
                <p><strong>Subject:</strong> SC10234 + #ORD5689</p>
                <hr className="border-ink/10" />
                <p>Hello, please process this dropshipping order.</p>
                <p>Product: Cotton T-shirt<br />Product link: [link]<br />Color: Black<br />Size: L<br />Quantity: 2</p>
                <p>Ship to: John Doe<br />Phone: +971 50 123 4567<br />Address: Apartment 503, Al Zahiyah, Abu Dhabi, UAE</p>
                <p>Special instructions: Check color and size before dispatch.</p>
                <p>Thank you.</p>
              </div>
              <a className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" href={"mailto:?cc=info%40sevencolortrading.com&subject=CustomerNumber%20%2B%20%23OrderNumber&body=Hello%2C%0A%0APlease%20process%20this%20dropshipping%20order.%0A%0AProduct%20description%3A%0AProduct%20link%3A%0AColor%3A%0ASize%20%2F%20variant%3A%0AQuantity%3A%0A%0ACustomer%20name%3A%0APhone%3A%0AFull%20delivery%20address%3A%0ACity%3A%0ACountry%3A%0APostal%20code%3A%0A%0ASpecial%20instructions%3A%0A%0AThank%20you."}>Open email template</a>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {dropshippingSteps.map((step) => (
            <article key={step.title} className="glass-card rounded-[1.5rem] p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {dropshippingBenefits.map((hub) => (
            <article key={hub.city} className="glass-card rounded-[1.5rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{hub.role}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {hub.city} · {hub.country}
              </h3>
              <p className="mt-2 text-sm text-muted">{hub.text}</p>
            </article>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="dropshipping-faq">
          <h2
            id="dropshipping-faq"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Frequently asked questions about dropshipping
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {dropshippingFaqs.map((item) => (
              <div key={item.q} className="glass-card rounded-[1.5rem] p-6">
                <dt className="font-display text-lg font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted" data-seo-answer>
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 text-sm text-muted">
          Need bulk inbound or container programs?{" "}
          <Link href="/3pl" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Own 3PL warehouses
          </Link>
          . Sea, air, or express after the warehouse?{" "}
          <Link
            href="/logistics"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            Freight lanes and customs
          </Link>
          . Lot-level QC:{" "}
          <Link href="/inspection" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            inspection at USD 110 per inspector day
          </Link>
          . Private-label inbound to Amazon:{" "}
          <Link href="/amazon-fba" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Amazon FBA prep
          </Link>
          .
        </p>
        <section className="mt-12" aria-labelledby="dropship-process">
          <div className="mb-6">
            <p className="section-kicker">DROPSHIPPING GUIDE</p>
            <h2 id="dropship-process" className="font-display text-2xl font-semibold text-ink sm:text-3xl">How It Works</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">We handle purchasing, receiving and quality checks. You get shipment tracking and a private link to inspect your order updates.</p>
          </div>
          <ol className="grid gap-6 md:grid-cols-5">
            {[
              { title: "We order", detail: "We purchase your requested products from the supplier.", Icon: ShoppingCart },
              { title: "Office receives", detail: "Products arrive at our receiving office or warehouse.", Icon: PackageCheck },
              { title: "Quality check", detail: "We check product details and condition before dispatch.", Icon: ClipboardCheck },
              { title: "Tracking issued", detail: "We provide your shipment tracking number.", Icon: Truck },
              { title: "Private shipment link", detail: "View available QC photos, videos and shipment status privately.", Icon: LockKeyhole },
            ].map(({ title, detail, Icon }, index) => (
              <li key={title} className={`relative rounded-[1.5rem] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${index === 4 ? "border-green-400 bg-green-50 shadow-[0_0_0_2px_rgba(34,197,94,0.08)] dark:bg-green-950/30" : "glass-card border-ink/10"}`}>
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${index === 4 ? "bg-green-600 text-white" : "bg-accent/10 text-accent"}`}><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <span className="text-xs font-bold text-muted">0{index + 1}</span>
                </div>
                <h3 className={`mt-5 font-display text-lg font-semibold ${index === 4 ? "text-green-800 dark:text-green-300" : "text-ink"}`}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
                {index === 4 && <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300"><CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Ready to track <CheckCircle2 className="h-5 w-5" aria-hidden="true" /></div>}
                {index < 4 && <div aria-hidden="true" className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 text-accent motion-safe:animate-bounce md:-right-4 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2"><ArrowDown className="h-6 w-6 md:hidden" /><ArrowRight className="hidden h-6 w-6 md:block" /></div>}
              </li>
            ))}
          </ol>
          <div className="mt-7 rounded-2xl border border-green-300 bg-green-50 p-5 text-center dark:bg-green-950/30">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300"><CheckCircle2 className="h-6 w-6" aria-hidden="true" /><span className="font-semibold">Shipment ready to follow</span><CheckCircle2 className="h-6 w-6" aria-hidden="true" /></div>
            <p className="mt-2 text-sm text-muted">Use your tracking number to check the latest shipment status.</p>
            <Link href="/track" className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">sourcing.center/track <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>


      </Container>
      <CtaBand
        title="Talk to the dropship desk"
        description="Tell us the SKU, expected order volume, and whether stock should sit in Xiamen or Dubai. Hand off orders by CSV, spreadsheet, or store export. A relationship manager replies within 24 hours."
        whatsappMessage={whatsappPresets.dropshipping}
      />
    </>
  );
}
