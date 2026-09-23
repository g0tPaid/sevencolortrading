import Link from "next/link";
import { ProductMark } from "@/components/product-opportunities/product-mark";
import { SourceProductLink } from "@/components/product-opportunities/source-product-link";
import {
  MARGIN_DISCLAIMER,
  formatUsdRange,
  productOpportunityPath,
  productWhatsAppMessage,
  type ProductOpportunity,
} from "@/lib/product-opportunities";

const ctaClass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-accent";

export function ProductOpportunityCard({
  product,
  sourcePage,
  buttonLocation,
}: {
  product: ProductOpportunity;
  sourcePage: string;
  buttonLocation: string;
}) {
  return (
    <article className="glass-card flex h-full flex-col overflow-hidden rounded-[1.5rem]">
      <Link href={productOpportunityPath(product.slug)} className="block bg-[#0f172a]">
        <ProductMark category={product.category} name={product.name} alt={product.imageAlt} />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {product.category}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
          <Link href={productOpportunityPath(product.slug)} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
        {product.whyInteresting[0] ? (
          <p className="mt-3 text-sm leading-relaxed text-ink">
            <span className="font-medium">Why it&apos;s interesting. </span>
            {product.whyInteresting[0]}
          </p>
        ) : null}
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">China sourcing</dt>
            <dd className="text-right font-medium text-ink">
              {formatUsdRange(product.sourcingPriceMin, product.sourcingPriceMax)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">MOQ</dt>
            <dd className="text-right font-medium text-ink">{product.moq.toLocaleString("en-US")} pcs</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Suggested retail</dt>
            <dd className="text-right font-medium text-ink">
              {formatUsdRange(product.retailPriceMin, product.retailPriceMax)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Estimated gross margin</dt>
            <dd className="text-right font-medium text-ink">
              {product.estimatedMarginMin}% to {product.estimatedMarginMax}%
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted">{MARGIN_DISCLAIMER}</p>
        <p className="mt-3 text-xs text-muted">
          Customization: {product.customization ? "available on many platforms" : "limited"}
          {product.privateLabel ? " · Private label possible" : ""}
        </p>
        <p className="mt-1 text-xs text-muted">Last updated: {product.updatedLabel}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <SourceProductLink
            hrefMessage={productWhatsAppMessage(product.name)}
            className={ctaClass}
            productName={product.name}
            productSlug={product.slug}
            category={product.category}
            buttonLocation={buttonLocation}
            sourcePage={sourcePage}
          >
            Source This Product
          </SourceProductLink>
          <Link
            href={productOpportunityPath(product.slug)}
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-ink underline-offset-4 hover:underline"
          >
            Sourcing notes
          </Link>
        </div>
      </div>
    </article>
  );
}
