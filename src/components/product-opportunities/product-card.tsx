import Image from "next/image";
import Link from "next/link";
import { SourceProductLink } from "@/components/product-opportunities/source-product-link";
import {
  formatUsdRange,
  productImageSrc,
  productOpportunityPath,
  productWhatsAppMessage,
  type ProductOpportunity,
} from "@/lib/product-opportunities";

const ctaClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-2 text-center text-xs font-medium leading-tight text-paper transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-accent";

export function ProductOpportunityCard({
  product,
  sourcePage,
  buttonLocation,
  priority = false,
}: {
  product: ProductOpportunity;
  sourcePage: string;
  buttonLocation: string;
  priority?: boolean;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-paper shadow-[0_10px_28px_rgba(15,23,42,0.08)] dark:border-white/10">
      <Link href={productOpportunityPath(product.slug)} className="block bg-[#f3f1ec]">
        <Image
          src={productImageSrc(product.slug)}
          alt={product.imageAlt}
          width={800}
          height={800}
          sizes="(max-width: 1024px) 46vw, 280px"
          priority={priority}
          className="aspect-[5/3] h-auto w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-2 sm:p-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          {product.category}
        </p>
        <h3 className="mt-0.5 line-clamp-2 font-display text-[13px] font-semibold leading-tight tracking-tight text-ink">
          <Link href={productOpportunityPath(product.slug)} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <dl className="mt-1.5 space-y-0.5 text-[11px] leading-tight">
          <div className="flex justify-between gap-1">
            <dt className="text-muted">Sourcing</dt>
            <dd className="text-right font-medium text-ink">
              {formatUsdRange(product.sourcingPriceMin, product.sourcingPriceMax)}
            </dd>
          </div>
          <div className="flex justify-between gap-1">
            <dt className="text-muted">Retail</dt>
            <dd className="text-right font-medium text-ink">
              {formatUsdRange(product.retailPriceMin, product.retailPriceMax)}
            </dd>
          </div>
          <div className="flex justify-between gap-1">
            <dt className="text-muted">Est. margin</dt>
            <dd className="text-right font-medium text-ink">
              {product.estimatedMarginMin}%–{product.estimatedMarginMax}%
            </dd>
          </div>
        </dl>
        <div className="mt-2">
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
        </div>
      </div>
    </article>
  );
}
