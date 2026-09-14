import type { FaqItem } from "@/lib/faq";

export function CommonQuestions({
  items,
  heading = "Common questions",
  headingId = "common-questions",
}: {
  items: readonly FaqItem[];
  heading?: string;
  headingId?: string;
}) {
  return (
    <section className="mt-16" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
      >
        {heading}
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <details key={item.q} className="glass-card rounded-[1.5rem] p-6">
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
  );
}
