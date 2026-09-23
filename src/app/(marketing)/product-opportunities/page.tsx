import type { Metadata } from "next";
import Link from "next/link";
import { ProductOpportunityCard } from "@/components/product-opportunities/product-card";
import { ProductMark } from "@/components/product-opportunities/product-mark";
import { SourceProductLink } from "@/components/product-opportunities/source-product-link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { JsonLd } from "@/components/seo/json-ld";
import { ProofChips } from "@/components/trust/proof-chips";
import { Container } from "@/components/ui/primitives";
import { pages } from "@/lib/route-seo";
import { absoluteUrl } from "@/lib/seo";
import {
  MARGIN_DISCLAIMER,
  PRODUCT_OPPORTUNITIES_PATH,
  collectionFaqs,
  collectionOpportunityJsonLd,
  expertWhatsAppMessage,
  featuredProductOpportunities,
  productsByCategory,
  sourcingHelp,
} from "@/lib/product-opportunities";

export const metadata: Metadata = {
  ...pages.productOpportunities,
  keywords: [
    "trending products",
    "products to source from China",
    "products to import from China",
    "China wholesale products",
    "China product sourcing",
    "China sourcing opportunities",
    "products to manufacture in China",
    "wholesale products from China",
  ],
  openGraph: {
    ...pages.productOpportunities.openGraph,
    images: [
      {
        url: absoluteUrl("/sourcing-center-logo.svg"),
        alt: "Sourcing Center",
      },
    ],
  },
  twitter: {
    ...pages.productOpportunities.twitter,
    images: [absoluteUrl("/sourcing-center-logo.svg")],
  },
};

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-accent";

const secondaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-ink glass-chip hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export default function ProductOpportunitiesPage() {
  const featured = featuredProductOpportunities();
  const groups = productsByCategory().filter((group) => group.products.length > 0);

  return (
    <>
      <JsonLd data={collectionOpportunityJsonLd()} />
      <WhatsAppPrefill message={expertWhatsAppMessage} />
      <article>
        <header className="relative overflow-hidden pb-10 pt-28 sm:pb-14 sm:pt-32">
          <div className="absolute inset-0 grid-fade opacity-50" aria-hidden />
          <Container className="relative">
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-ink">Product opportunities</li>
              </ol>
            </nav>
            <p className="section-kicker mt-6">China sourcing desk</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Trending Products to Source From China
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Discover products with interesting sourcing and manufacturing opportunities in China.
              Explore indicative China sourcing prices, MOQ ranges, customization options, and
              potential retail positioning. If you find something interesting, send it to our China
              sourcing team on WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SourceProductLink
                hrefMessage={expertWhatsAppMessage}
                className={primaryCta}
                buttonLocation="hero"
                sourcePage={PRODUCT_OPPORTUNITIES_PATH}
              >
                Talk to a China Sourcing Expert
              </SourceProductLink>
              <a href="#products" className={secondaryCta}>
                Explore Products
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-xs text-muted" aria-label="What this desk can support">
              <li className="glass-chip rounded-full px-3 py-1.5">China-based sourcing team</li>
              <li className="glass-chip rounded-full px-3 py-1.5">Supplier verification available</li>
              <li className="glass-chip rounded-full px-3 py-1.5">Quality inspection available</li>
              <li className="glass-chip rounded-full px-3 py-1.5">Private label and customization</li>
              <li className="glass-chip rounded-full px-3 py-1.5">Xiamen and Dubai warehouse hubs</li>
            </ul>
            <ProofChips className="mt-4 justify-start" />
          </Container>
        </header>

        <section className="pb-8" aria-labelledby="category-nav-heading">
          <Container>
            <h2 id="category-nav-heading" className="font-display text-2xl font-semibold text-ink">
              Categories
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              These are example lanes, not a promise that every category is in stock. Each link
              jumps to the notes on this page.
            </p>
            <nav aria-label="Product categories" className="mt-4">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a href="#products" className="glass-chip inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                    All
                  </a>
                </li>
                {groups.map((group) => (
                  <li key={group.category}>
                    <a
                      href={`#${group.anchor}`}
                      className="glass-chip inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      {group.category}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </section>

        <section id="products" className="scroll-mt-28 py-8" aria-labelledby="featured-heading">
          <Container>
            <h2 id="featured-heading" className="font-display text-3xl font-semibold tracking-tight text-ink">
              Featured sourcing notes
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              A short list the desk can talk through this month. Prices are indicative ex-works
              style ranges, not a checkout and not a guaranteed margin.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {featured.map((product) => (
                <ProductOpportunityCard
                  key={product.slug}
                  product={product}
                  sourcePage={PRODUCT_OPPORTUNITIES_PATH}
                  buttonLocation="featured"
                />
              ))}
            </div>
          </Container>
        </section>

        {groups.map((group) => (
          <section
            key={group.category}
            id={group.anchor}
            className="scroll-mt-28 py-6"
            aria-labelledby={`${group.anchor}-heading`}
          >
            <Container>
              <h2
                id={`${group.anchor}-heading`}
                className="font-display text-2xl font-semibold tracking-tight text-ink"
              >
                {group.category}
              </h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {group.products.map((product) => (
                  <ProductOpportunityCard
                    key={product.slug}
                    product={product}
                    sourcePage={PRODUCT_OPPORTUNITIES_PATH}
                    buttonLocation="category"
                  />
                ))}
              </div>
            </Container>
          </section>
        ))}

        <section className="py-12" aria-labelledby="why-heading">
          <Container>
            <h2 id="why-heading" className="font-display text-3xl font-semibold tracking-tight text-ink">
              Why these products?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
              The desk picks examples it can actually discuss with a factory: supplier availability,
              whether the item is manufacturable without a new invention, customization potential,
              a realistic MOQ, indicative unit economics, and signs of market interest. None of
              that guarantees sales or profit. A product can be easy to make and still be a poor
              fit for your channel.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Supplier availability for this kind of product",
                "Manufacturing feasibility on an existing platform",
                "Customization and private-label options",
                "A typical MOQ, not a promised minimum",
                "Indicative sourcing economics before freight and fees",
                "Product characteristics a buyer can specify",
              ].map((item) => (
                <li key={item} className="glass-card rounded-2xl px-4 py-3 text-sm text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="py-8" aria-labelledby="help-heading">
          <Container>
            <h2 id="help-heading" className="font-display text-3xl font-semibold tracking-tight text-ink">
              How Sourcing Center can help
            </h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-2">
              {sourcingHelp.map((step, index) => (
                <li key={step.title} className="glass-card rounded-[1.5rem] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                  <Link href={step.href} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-ink underline-offset-4 hover:underline">
                    {step.anchor}
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <SourceProductLink
                hrefMessage={expertWhatsAppMessage}
                className={primaryCta}
                buttonLocation="help"
                sourcePage={PRODUCT_OPPORTUNITIES_PATH}
              >
                Send Us Your Product
              </SourceProductLink>
            </div>
          </Container>
        </section>

        <section className="py-10" aria-labelledby="faq-heading">
          <Container>
            <h2 id="faq-heading" className="font-display text-3xl font-semibold tracking-tight text-ink">
              Questions about sourcing these products
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {collectionFaqs.map((item) => (
                <details key={item.q} className="glass-card rounded-[1.5rem] p-5">
                  <summary className="cursor-pointer font-medium text-ink">{item.q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-20 pt-6" aria-labelledby="final-cta-heading">
          <Container>
            <div className="glass-panel rounded-[2rem] px-6 py-10 sm:px-10">
              <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
                <ProductMark
                  category="Electronics"
                  name="Sourcing"
                  alt="Sourcing Center mark used beside the WhatsApp call to action"
                />
                <div>
                  <h2 id="final-cta-heading" className="font-display text-3xl font-semibold text-ink">
                    Found something interesting?
                  </h2>
                  <p className="mt-3 max-w-xl text-muted">
                    Send us the product and we will check the sourcing options for you. You can
                    also start with{" "}
                    <Link href="/contact" className="font-medium text-ink underline-offset-4 hover:underline">
                      China product sourcing
                    </Link>
                    ,{" "}
                    <Link href="/factory-verification" className="font-medium text-ink underline-offset-4 hover:underline">
                      China factory sourcing checks
                    </Link>
                    , or{" "}
                    <Link href="/logistics" className="font-medium text-ink underline-offset-4 hover:underline">
                      freight after the goods are ready
                    </Link>
                    .
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted">{MARGIN_DISCLAIMER}</p>
                  <div className="mt-5">
                    <SourceProductLink
                      hrefMessage={expertWhatsAppMessage}
                      className={primaryCta}
                      buttonLocation="final"
                      sourcePage={PRODUCT_OPPORTUNITIES_PATH}
                    >
                      WhatsApp — Talk to a China Sourcing Expert
                    </SourceProductLink>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </article>
    </>
  );
}
