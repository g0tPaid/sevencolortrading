import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Sparkles, Store, Truck, ShieldCheck } from "lucide-react";
import { DropshippingRoadmap } from "@/components/dropshipping/roadmap";
import { DropshippingApplication } from "@/components/dropshipping/application";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
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
        <h1 className="mt-3 font-display text-[4.25rem] font-semibold leading-[0.95] tracking-tight text-accent sm:text-[7rem] lg:text-[8.5rem]">{dropshipping.eyebrow}</h1>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-ink p-6 text-white shadow-2xl sm:p-10 lg:p-12" aria-labelledby="partner-hero">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-200"><Sparkles className="h-4 w-4" /> Grow with Sourcing Center</p>
              <h2 id="partner-hero" className="mt-5 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Become a <span className="text-red-300">Dropshipping Partner</span></h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/75">Focus on growing your store. Let our team support product sourcing, order handling, warehouse coordination and shipment updates.</p>
              <a href="#dropship-application-title" className="mt-7 inline-flex w-full min-h-14 items-center justify-center gap-3 rounded-xl bg-accent px-7 py-4 text-base font-extrabold text-white shadow-lg transition hover:brightness-110 sm:w-auto">Apply to become a partner <ArrowRight className="h-5 w-5" /></a>
              <p className="mt-3 text-xs text-white/60">Go straight to the partner application below</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[{icon:Store,title:"Build your business",body:"Spend more time on your customers"},{icon:ShieldCheck,title:"Sourcing support",body:"Coordinate purchasing and quality checks"},{icon:Truck,title:"Fulfillment updates",body:"Track orders and shipment progress"}].map(item=><div key={item.title} className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15"><item.icon className="h-5 w-5 text-red-300" /></div><div><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-1 text-sm text-white/65">{item.body}</p></div></div>)}
            </div>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="dropship-process">
          <div className="mb-6">
            <p className="section-kicker">Dropshipping guide</p>
            <h2 id="dropship-process" className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">How It Works</h2>
            <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-muted">We handle purchasing, receiving and quality checks. You get shipment tracking and a private link to inspect your order updates.</p>
          </div>
          <DropshippingRoadmap />
          <div className="mt-7 rounded-2xl border border-green-300 bg-green-50 p-5 text-center dark:bg-green-950/30">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300"><CheckCircle2 className="h-6 w-6" aria-hidden="true" /><span className="font-semibold">Shipment ready to follow</span><CheckCircle2 className="h-6 w-6" aria-hidden="true" /></div>
            <p className="mt-2 text-sm text-muted">Use your tracking number to check the latest shipment status.</p>
            <Link href="/track" className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">sourcing.center/track <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

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

        <DropshippingApplication />

        <section className="mt-12" aria-labelledby="dropship-overview">
          <h2 id="dropship-overview" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{dropshipping.title}</h2>
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

        </section>

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



      </Container>
      <CtaBand
        title="Talk to the dropship desk"
        description="Tell us the SKU, expected order volume, and whether stock should sit in Xiamen or Dubai. Hand off orders by CSV, spreadsheet, or store export. A relationship manager replies within 24 hours."
        whatsappMessage={whatsappPresets.dropshipping}
      />
    </>
  );
}
