import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { SampleNote } from "@/components/trust/sample-note";
import { TrustCta } from "@/components/trust/trust-cta";
import { Container } from "@/components/ui/primitives";
import { reviewsIntro, sampleReviews } from "@/lib/reviews";
import { absoluteUrl, reviewsPageJsonLd } from "@/lib/seo";
import { whatsappPresets } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Buyer notes about Seven Color Trading / sourcing.center — China factory sourcing, own 3PL in Xiamen and Dubai, and hosted factory visits. Sample cards until approved quotes are pasted.",
  alternates: { canonical: absoluteUrl("/reviews") },
  openGraph: {
    title: "Reviews | Sourcing Center",
    description:
      "What buyers say after the factory floor — Seven Color Trading, sourcing.center.",
    url: absoluteUrl("/reviews"),
    type: "website",
  },
};

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
        <SampleNote>{reviewsIntro.sampleNote}</SampleNote>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {sampleReviews.map((review) => (
            <article key={review.id} className="glass-card flex flex-col rounded-[1.5rem] p-7">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {review.source}
                </p>
                {review.sample ? (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                    Sample
                  </span>
                ) : null}
                {review.date ? <span className="text-xs text-muted">{review.date}</span> : null}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink">
                “{review.quote}”
              </blockquote>
              <footer className="mt-6 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{review.handle}</p>
                </div>
                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  {review.source}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </footer>
            </article>
          ))}
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
