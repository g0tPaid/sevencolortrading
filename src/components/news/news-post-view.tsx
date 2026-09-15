"use client";

import Link from "next/link";
import { WhatsAppPrefill } from "@/components/layout/whatsapp-prefill";
import { CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import {
  formatNewsDate,
  newsCopy,
  newsKind,
  newsPostPath,
  postBody,
  postFaqs,
  postSummary,
  postTakeaway,
  postTitle,
  type NewsPost,
} from "@/lib/news";
import { whatsappPresets } from "@/lib/whatsapp";
import { NewsLanguageSwitcher } from "./language-switcher";
import { NewsLocaleProvider, useNewsUi } from "./locale-context";

export function NewsPostView({
  post,
  related,
}: {
  post: NewsPost;
  related: NewsPost[];
}) {
  return (
    <NewsLocaleProvider>
      <NewsPostInner post={post} related={related} />
    </NewsLocaleProvider>
  );
}

function NewsPostInner({ post, related }: { post: NewsPost; related: NewsPost[] }) {
  const { lang, t } = useNewsUi();
  const kind = newsKind(post);
  const faqs = postFaqs(post);
  const paragraphs = postBody(post, lang);

  return (
    <div lang={lang === "zh" ? "zh-CN" : "en"}>
      <WhatsAppPrefill message={whatsappPresets.news} />
      <Container className="pb-10 pt-28 sm:pt-32">
        <div className="mb-5 flex justify-end">
          <NewsLanguageSwitcher />
        </div>
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/news" className="hover:text-ink">
            {t(newsCopy.allNews)}
          </Link>
          <span className="px-2" aria-hidden>
            /
          </span>
          <span className="text-ink">{postTitle(post, lang)}</span>
        </nav>
        <p className="section-kicker mt-6">{t(newsCopy.kicker)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <time dateTime={post.date} className="font-mono text-xs text-muted">
            {formatNewsDate(post.date, lang)}
          </time>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            {t(kind === "meta" ? newsCopy.metaBadge : newsCopy.briefBadge)}
          </span>
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {postTitle(post, lang)}
        </h1>
        <p className="mt-4 max-w-2xl text-muted sm:text-lg">{postSummary(post, lang)}</p>

        <article className="mt-10 max-w-3xl space-y-4">
          {paragraphs.map((para, index) => (
            <p key={index} className="text-base leading-relaxed text-ink/90">
              {para}
            </p>
          ))}
        </article>

        <aside className="mt-8 max-w-3xl glass-card rounded-[1.5rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {t(newsCopy.takeawayLabel)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink">{postTakeaway(post, lang)}</p>
        </aside>

        <p className="mt-6 max-w-3xl text-sm text-muted">
          {t(newsCopy.sourceLabel)}:{" "}
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            {post.sourceName}
          </a>
        </p>

        {post.tags.length > 0 ? (
          <div className="mt-4">
            <p className="sr-only">{t(newsCopy.tagsLabel)}</p>
            <ul className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {faqs.length > 0 ? (
          <section className="mt-16 max-w-3xl" aria-labelledby="news-post-faqs">
            <h2
              id="news-post-faqs"
              className="font-display text-2xl font-semibold tracking-tight text-ink"
            >
              {t(newsCopy.faqsHeading)}
            </h2>
            <div className="mt-6 space-y-3">
              {faqs.map((item) => (
                <details key={item.qEn} className="glass-card rounded-[1.35rem] p-5">
                  <summary className="cursor-pointer font-medium text-ink">
                    {lang === "zh" ? item.qZh : item.qEn}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted" data-seo-answer>
                    {lang === "zh" ? item.aZh : item.aEn}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-16" aria-labelledby="related-news">
            <h2
              id="related-news"
              className="font-display text-2xl font-semibold tracking-tight text-ink"
            >
              {t(newsCopy.allNews)}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={newsPostPath(item.slug)}
                  className="glass-card glass-card-hover rounded-[1.5rem] p-6"
                >
                  <time dateTime={item.date} className="font-mono text-[11px] text-muted">
                    {formatNewsDate(item.date, lang)}
                  </time>
                  <p className="mt-2 font-display text-lg font-semibold text-ink">
                    {postTitle(item, lang)}
                  </p>
                  <p className="mt-2 text-sm text-muted">{postSummary(item, lang)}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-10 text-sm text-muted">
          {t(newsCopy.relatedUpdates)}{" "}
          <Link
            href="/updates"
            className="font-medium text-ink underline decoration-accent/40 underline-offset-4"
          >
            {t(newsCopy.relatedUpdatesCta)}
          </Link>
          .
        </p>
      </Container>
      <CtaBand
        title={t(newsCopy.ctaTitle)}
        description={t(newsCopy.ctaBody)}
        whatsappMessage={whatsappPresets.news}
      />
    </div>
  );
}
