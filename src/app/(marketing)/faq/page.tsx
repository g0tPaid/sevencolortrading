import { JsonLd } from "@/components/seo/json-ld";
import { PageHero, CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { faqGroups, faqItems } from "@/lib/faq";
import { pages } from "@/lib/route-seo";
import { faqGraph } from "@/lib/structured-data";

export const metadata = pages.faq;

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqGraph()} />
      <PageHero
        eyebrow={`${faqItems.length} answers`}
        title="Common questions about sourcing from China"
        description="Buyer questions on no-MOQ sourcing, OEM/ODM, USD 110 per inspector day, own 3PL in Xiamen and Dubai / Al Ain, dropshipping, freight, and hosted factory visits. Legal entity Xiamen Ajmal Seven Color Trading Co Ltd, since 2014, DUNS 509419282."
      />
      <Container className="max-w-3xl pb-16">
        {faqGroups.map((group) => (
          <section key={group.id} className="mb-12" aria-labelledby={`faq-${group.id}`}>
            <h2
              id={`faq-${group.id}`}
              className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              {group.title}
            </h2>
            <div className="mt-6 space-y-3">
              {group.items.map((item) => (
                <details key={item.q} className="glass-card rounded-[1.5rem] p-5 sm:p-6">
                  <summary className="cursor-pointer font-display text-lg font-semibold text-ink">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted" data-seo-answer>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </Container>
      <CtaBand
        title="Still deciding?"
        description="Send the SKU, quantity, and destination — a relationship manager in Xiamen or Dubai replies within 24 hours."
      />
    </>
  );
}
