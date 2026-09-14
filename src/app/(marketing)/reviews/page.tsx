import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { ProofChips } from "@/components/trust/proof-chips";
import { TrustCta } from "@/components/trust/trust-cta";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { reviews, reviewsIntro } from "@/lib/reviews";
import { reviewsPageJsonLd } from "@/lib/seo";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.reviews;

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={reviewsPageJsonLd()} />
      <WhatsAppPrefill message={whatsappPresets.reviews} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <p className="section-kicker">{reviewsIntro.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {reviewsIntro.title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{reviewsIntro.description}</p>
        <ProofChips className="mt-6 justify-start" />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="glass-card flex flex-col rounded-[1.5rem] p-7">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {review.market}
                </p>
                {review.date ? <span className="text-xs text-muted">{review.date}</span> : null}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink">
                “{review.quote}”
              </blockquote>
              <footer className="mt-6 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{review.firstName}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {review.role} · {review.market}
                  </p>
                </div>
                {review.approved && review.permalink ? (
                  <a
                    href={review.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
                  >
                    {review.sourceLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}
              </footer>
            </article>
          ))}
        </div>

        <div className="glass-card mt-8 rounded-[1.5rem] px-6 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <p className="max-w-xl text-sm leading-relaxed text-muted">{reviewsIntro.moreLine}</p>
          <ButtonLink href={whatsappHref(whatsappPresets.reviews)} className="mt-4 sm:mt-0">
            WhatsApp for references
          </ButtonLink>
        </div>
      </Container>
      <TrustCta
        title="Ready to start sourcing?"
        description="A relationship manager in Xiamen or Dubai replies within 24 hours. WhatsApp opens with this page already named in the message."
        whatsappMessage={whatsappPresets.reviews}
      />
    </>
  );
}
