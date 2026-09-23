import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductOpportunityCard } from "@/components/product-opportunities/product-card";
import { SourceProductLink } from "@/components/product-opportunities/source-product-link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/primitives";
import { pages } from "@/lib/route-seo";
import { absoluteUrl } from "@/lib/seo";
import {
  MARGIN_DISCLAIMER,
  PRODUCT_OPPORTUNITIES_PATH,
  collectionFaqs,
  collectionOpportunityJsonLd,
  expertWhatsAppMessage,
  mixedProductOpportunities,
  productImageSrc,
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
        url: absoluteUrl(productImageSrc("rechargeable-heated-lunch-box")),
        alt: "Reference photo of a rechargeable heated lunch box",
      },
    ],
  },
  twitter: {
    ...pages.productOpportunities.twitter,
    images: [absoluteUrl(productImageSrc("rechargeable-heated-lunch-box"))],
  },
};

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-accent";

export default function ProductOpportunitiesPage() {
  const products = mixedProductOpportunities();

  return (
    <>
      <JsonLd data={collectionOpportunityJsonLd()} />
      <WhatsAppPrefill message={expertWhatsAppMessage} />
      <article>
        <section id="products" className="pb-6 pt-24 sm:pt-28" aria-labelledby="featured-heading">
          <Container>
            <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-ink">Trending products</li>
              </ol>
            </nav>
            <h1 id="featured-heading" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Trending Products to Source From China
            </h1>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductOpportunityCard
                  key={product.slug}
                  product={product}
                  sourcePage={PRODUCT_OPPORTUNITIES_PATH}
                  buttonLocation={product.featured ? "featured" : "mixed"}
                  priority={index < 2}
                />
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">{MARGIN_DISCLAIMER}</p>
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
                <Image
                  src={productImageSrc("rechargeable-heated-lunch-box")}
                  alt="Reference photo of a rechargeable heated lunch box"
                  width={800}
                  height={800}
                  sizes="180px"
                  className="hidden aspect-square w-full rounded-2xl object-cover md:block"
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
