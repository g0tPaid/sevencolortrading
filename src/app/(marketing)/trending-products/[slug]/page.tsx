import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductOpportunityCard } from "@/components/product-opportunities/product-card";
import { SourceProductLink } from "@/components/product-opportunities/source-product-link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/primitives";
import { absoluteUrl, routeMetadata } from "@/lib/seo";
import {
  MARGIN_DISCLAIMER,
  PRODUCT_OPPORTUNITIES_PATH,
  formatUsdRange,
  getProductOpportunity,
  listProductOpportunities,
  productImageSrc,
  productOpportunityJsonLd,
  productOpportunityPath,
  productWhatsAppMessage,
  relatedProductOpportunities,
  sourcingHelp,
} from "@/lib/product-opportunities";

export function generateStaticParams() {
  return listProductOpportunities().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductOpportunity(slug);
  if (!product) return { title: "Product opportunity" };
  const meta = routeMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: productOpportunityPath(product.slug),
    type: "article",
  });
  return {
    ...meta,
    keywords: product.seoKeywords,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: absoluteUrl(productImageSrc(product.slug)), alt: product.imageAlt }],
    },
    twitter: {
      ...meta.twitter,
      images: [absoluteUrl(productImageSrc(product.slug))],
    },
  };
}

const primaryCta =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-accent";

export default async function ProductOpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductOpportunity(slug);
  if (!product) notFound();
  const related = relatedProductOpportunities(product);
  const sourcePage = productOpportunityPath(product.slug);

  return (
    <>
      <JsonLd data={productOpportunityJsonLd(product)} />
      <WhatsAppPrefill message={productWhatsAppMessage(product.name)} />
      <article className="pb-20 pt-28 sm:pt-32">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={PRODUCT_OPPORTUNITIES_PATH} className="hover:text-ink">
                  Product opportunities
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink">{product.name}</li>
            </ol>
          </nav>

          <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start">
            <figure>
              <Image
                src={productImageSrc(product.slug)}
                alt={product.imageAlt}
                width={800}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 280px"
                className="aspect-square h-auto w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-2 text-xs leading-relaxed text-muted">
                Reference photo. The factory sample can differ by color, material, and specification.
              </figcaption>
            </figure>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {product.category}
                {product.subcategory ? ` · ${product.subcategory}` : ""}
              </p>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{product.shortDescription}</p>
              <p className="mt-3 text-sm text-muted">Last updated: {product.updatedLabel}</p>
              <div className="mt-5">
                <SourceProductLink
                  hrefMessage={productWhatsAppMessage(product.name)}
                  className={primaryCta}
                  productName={product.name}
                  productSlug={product.slug}
                  category={product.category}
                  buttonLocation="detail-hero"
                  sourcePage={sourcePage}
                >
                  Source This Product
                </SourceProductLink>
              </div>
            </div>
          </header>

          <section className="mt-10" aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-display text-2xl font-semibold text-ink">
              What this product is
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{product.description}</p>
          </section>

          <section className="mt-10" aria-labelledby="numbers-heading">
            <h2 id="numbers-heading" className="font-display text-2xl font-semibold text-ink">
              Indicative sourcing numbers
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              These are desk estimates for a conversation, not a factory invoice and not a retail
              offer from this website.
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Indicative China sourcing price", formatUsdRange(product.sourcingPriceMin, product.sourcingPriceMax)],
                ["Typical MOQ", `${product.moq.toLocaleString("en-US")} pcs`],
                ["Suggested retail range", formatUsdRange(product.retailPriceMin, product.retailPriceMax)],
                [
                  "Estimated gross margin",
                  `${product.estimatedMarginMin}% to ${product.estimatedMarginMax}%`,
                ],
              ].map(([label, value]) => (
                <div key={label} className="glass-card rounded-2xl p-4">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="mt-1 font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">{product.moqNote}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{MARGIN_DISCLAIMER}</p>
          </section>

          <section className="mt-10" aria-labelledby="why-heading">
            <h2 id="why-heading" className="font-display text-2xl font-semibold text-ink">
              Why it is interesting
            </h2>
            <ul className="mt-4 space-y-3">
              {product.whyInteresting.map((item) => (
                <li key={item} className="glass-card rounded-2xl px-4 py-3 text-sm leading-relaxed text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-2xl font-semibold text-ink">
              What to specify
            </h2>
            <dl className="mt-4 divide-y divide-black/5 rounded-[1.5rem] border border-black/5 dark:divide-white/10 dark:border-white/10">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr]">
                  <dt className="text-sm font-medium text-ink">{spec.label}</dt>
                  <dd className="text-sm leading-relaxed text-muted">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10" aria-labelledby="custom-heading">
            <h2 id="custom-heading" className="font-display text-2xl font-semibold text-ink">
              Customization and private label
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{product.customizationNote}</p>
            <p className="mt-3 text-sm text-muted">
              {product.customization
                ? "Some customization is realistic on this kind of product."
                : "Customization is limited on this kind of product."}{" "}
              {product.privateLabel
                ? "Private label packaging is often possible once artwork is approved."
                : "Private label is not assumed."}{" "}
              Read how{" "}
              <Link href="/private-label" className="font-medium text-ink underline-offset-4 hover:underline">
                private label manufacturing in China
              </Link>{" "}
              is handled, and when a new product needs the{" "}
              <Link href="/oem-odm" className="font-medium text-ink underline-offset-4 hover:underline">
                OEM/ODM path
              </Link>
              .
            </p>
          </section>

          <section className="mt-10" aria-labelledby="process-heading">
            <h2 id="process-heading" className="font-display text-2xl font-semibold text-ink">
              How the desk would source it
            </h2>
            <ol className="mt-4 space-y-3">
              {product.sourcingNotes.map((note, index) => (
                <li key={note} className="glass-card rounded-2xl px-4 py-3 text-sm leading-relaxed text-ink">
                  <span className="font-medium">Note {index + 1}. </span>
                  {note}
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
              The usual path is the same as other{" "}
              <Link href="/how-it-works" className="font-medium text-ink underline-offset-4 hover:underline">
                China factory sourcing
              </Link>
              : confirm the spec, compare factories, sample, then inspect before shipment.{" "}
              <Link href="/factory-verification" className="font-medium text-ink underline-offset-4 hover:underline">
                China supplier verification
              </Link>{" "}
              and{" "}
              <Link href="/inspection" className="font-medium text-ink underline-offset-4 hover:underline">
                China quality inspection
              </Link>{" "}
              are available. Goods can be received at the Xiamen warehouse and moved through{" "}
              <Link href="/3pl" className="font-medium text-ink underline-offset-4 hover:underline">
                China warehouse consolidation
              </Link>{" "}
              or{" "}
              <Link href="/logistics" className="font-medium text-ink underline-offset-4 hover:underline">
                sea, air, and express freight
              </Link>
              .
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {sourcingHelp.slice(0, 4).map((step) => (
                <li key={step.href + step.title}>
                  <Link href={step.href} className="glass-chip inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink">
                    {step.anchor}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-2xl font-semibold text-ink">
              Questions about this product
            </h2>
            <div className="mt-4 grid gap-4">
              {product.faq.map((item) => (
                <details key={item.q} className="glass-card rounded-[1.5rem] p-5">
                  <summary className="cursor-pointer font-medium text-ink">{item.q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-2xl font-semibold text-ink">
              Related sourcing notes
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
              {related.map((item) => (
                <ProductOpportunityCard
                  key={item.slug}
                  product={item}
                  sourcePage={sourcePage}
                  buttonLocation="related"
                />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link href={PRODUCT_OPPORTUNITIES_PATH} className="font-medium text-ink underline-offset-4 hover:underline">
                All product opportunities
              </Link>
            </p>
          </section>

          <section className="mt-12 glass-panel rounded-[2rem] px-6 py-8" aria-labelledby="cta-heading">
            <h2 id="cta-heading" className="font-display text-2xl font-semibold text-ink">
              Ask the China desk about {product.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Send this product on WhatsApp. Include quantity, destination country, and whether you
              need a logo or only a sample of the existing platform.
            </p>
            <div className="mt-5">
              <SourceProductLink
                hrefMessage={productWhatsAppMessage(product.name)}
                className={primaryCta}
                productName={product.name}
                productSlug={product.slug}
                category={product.category}
                buttonLocation="detail-final"
                sourcePage={sourcePage}
              >
                Source This Product
              </SourceProductLink>
            </div>
          </section>
        </Container>
      </article>
    </>
  );
}
