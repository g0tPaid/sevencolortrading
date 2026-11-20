import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/primitives";
import { pages } from "@/lib/route-seo";
import { siteUrl } from "@/lib/seo";
import { breadcrumbGraph } from "@/lib/structured-data";

const pdfPath = "/downloads/sourcing-center-mutual-nda-template.pdf";
const docxPath = "/downloads/sourcing-center-mutual-nda-template.docx";

export const metadata: Metadata = {
  ...pages.downloads,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function DownloadsPage() {
  const pageUrl = `${siteUrl}/downloads`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          url: pageUrl,
          name: "Download a Mutual NDA Template for Sourcing Discussions",
          description: pages.downloads.description,
          isPartOf: { "@id": `${siteUrl}/#website` },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", "#nda-caveat"],
          },
        }}
      />
      <JsonLd
        data={breadcrumbGraph([
          { name: "Home", path: "/" },
          { name: "Downloads", path: "/downloads" },
        ])}
      />
      <Container className="pb-20 pt-28 sm:pb-24 sm:pt-32">
        <p className="section-kicker">Downloads</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Mutual NDA template
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          A generic mutual non-disclosure agreement for early discussions between a customer and a
          supplier. Both parties are left blank. The file is an unsigned template.
        </p>
        <p
          id="nda-caveat"
          className="mt-6 max-w-2xl rounded-2xl border border-line bg-accent-soft px-4 py-3 text-sm font-medium text-ink"
        >
          General template—review with legal counsel before signing.
        </p>

        <article className="glass-card mt-8 max-w-2xl rounded-[1.75rem] p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sourcing Center — Mutual NDA Template
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Use this form when two parties want a mutual confidentiality starting point before they
            talk through a possible sourcing or supply relationship. Fill in the legal names,
            addresses, purpose, term, governing law, forum, and signature blocks.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Downloading does not sign the template and does not submit your information.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={pdfPath}
              download="sourcing-center-mutual-nda-template.pdf"
              aria-describedby="nda-caveat"
              aria-label="Download the Sourcing Center mutual NDA template as a PDF"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto dark:bg-accent dark:text-paper"
            >
              Download PDF
            </a>
            <a
              href={docxPath}
              download="sourcing-center-mutual-nda-template.docx"
              aria-describedby="nda-caveat"
              aria-label="Download the Sourcing Center mutual NDA template as an editable Word document"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink glass-chip transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto"
            >
              Download DOCX
            </a>
          </div>
          <ul className="mt-4 space-y-1 font-mono text-xs text-muted">
            <li>sourcing-center-mutual-nda-template.pdf</li>
            <li>sourcing-center-mutual-nda-template.docx</li>
          </ul>
        </article>
      </Container>
    </>
  );
}
