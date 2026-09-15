"use client";

import Link from "next/link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import {
  formatNewsDate,
  newsCopy,
  newsIndexFaqs,
  newsKind,
  newsPostPath,
  postSummary,
  postTitle,
  type NewsPost,
} from "@/lib/news";
import { whatsappPresets } from "@/lib/whatsapp";
import { NewsLanguageSwitcher } from "./language-switcher";
import { NewsLocaleProvider, useNewsUi } from "./locale-context";

export function NewsIndexView({ posts }: { posts: NewsPost[] }) {
  return (
    <NewsLocaleProvider>
      <NewsIndexInner posts={posts} />
    </NewsLocaleProvider>
  );
}

function NewsIndexInner({ posts }: { posts: NewsPost[] }) {
  const { lang, t } = useNewsUi();

  return (
    <div lang={lang === "zh" ? "zh-CN" : "en"}>
      <WhatsAppPrefill message={whatsappPresets.news} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <div className="mb-5 flex justify-end">
          <NewsLanguageSwitcher />
        </div>
        <p className="section-kicker">{t(newsCopy.kicker)}</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t(newsCopy.indexH1)}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{t(newsCopy.indexLead)}</p>
        <p className="mt-4 text-sm text-muted">
          {t(newsCopy.relatedUpdates)}{" "}
          <Link
            href="/updates"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            {t(newsCopy.relatedUpdatesCta)}
          </Link>
          .
        </p>

        {posts.length === 0 ? (
          <div className="mt-10 glass-card rounded-[1.5rem] p-7">
            <p className="text-sm leading-relaxed text-muted">
              {lang === "zh" ? newsCopy.emptyZh : newsCopy.emptyEn}
            </p>
          </div>
        ) : (
          <ol className="mt-10 space-y-3">
            {posts.map((post) => {
              const kind = newsKind(post);
              return (
                <li key={post.slug}>
                  <Link
                    href={newsPostPath(post.slug)}
                    className="glass-card glass-card-hover flex flex-col gap-3 rounded-[1.35rem] px-5 py-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <time
                        dateTime={post.date}
                        className="font-mono text-xs text-muted"
                      >
                        {formatNewsDate(post.date, lang)}
                      </time>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        {t(kind === "meta" ? newsCopy.metaBadge : newsCopy.briefBadge)}
                      </span>
                    </div>
                    <span className="font-display text-lg font-semibold text-ink sm:text-xl">
                      {postTitle(post, lang)}
                    </span>
                    <span className="text-sm leading-relaxed text-muted">
                      {postSummary(post, lang)}
                    </span>
                    {post.tags.length > 0 ? (
                      <span className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        <section className="mt-16" aria-labelledby="news-index-faqs">
          <h2
            id="news-index-faqs"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            {t(newsCopy.faqsHeading)}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {newsIndexFaqs.map((item) => (
              <details key={item.qEn} className="glass-card rounded-[1.5rem] p-6">
                <summary className="cursor-pointer font-display text-lg font-semibold text-ink">
                  {lang === "zh" ? item.qZh : item.qEn}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted" data-seo-answer>
                  {lang === "zh" ? item.aZh : item.aEn}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Container>
      <CtaBand
        title={t(newsCopy.ctaTitle)}
        description={t(newsCopy.ctaBody)}
        whatsappMessage={whatsappPresets.news}
      />
    </div>
  );
}
