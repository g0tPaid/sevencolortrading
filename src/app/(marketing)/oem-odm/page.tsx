import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardList, Factory, FileCheck2, Layers3, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { NdaDownloadForm } from "@/components/nda/nda-download-form";
import { CommonQuestions } from "@/components/seo/common-questions";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/shared/page-shell";
import { Container } from "@/components/ui/primitives";
import { company } from "@/lib/content";
import { serviceCommonQuestions } from "@/lib/faq";
import { pages } from "@/lib/route-seo";
import { offerNode, serviceCopy } from "@/lib/structured-data";

export const metadata: Metadata = pages.oemOdm;

export default function OemOdmPage() {
  return (
    <>
      <JsonLd data={offerNode("oem-odm")} />
      <section className="relative isolate overflow-hidden bg-[#f5f6fa] text-slate-900">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_26%,#f9dce3,transparent_55%),radial-gradient(ellipse_at_16%_87%,#dce8fa,transparent_55%),linear-gradient(145deg,#ffffff,#f4f6fb)]" />
          <div className="absolute -right-40 -top-52 h-[38rem] w-[32rem] rotate-[-28deg] rounded-[46%] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,255,255,0.12)_45%,rgba(238,176,193,0.28))] shadow-[inset_0_0_42px_rgba(255,255,255,0.82),0_24px_50px_rgba(124,83,108,0.12)] sm:-right-28 lg:h-[50rem] lg:w-[46rem]" />
          <div className="absolute -bottom-48 -right-36 h-[32rem] w-[29rem] rotate-[32deg] rounded-[44%] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.68),rgba(230,238,253,0.26)_55%,rgba(160,183,231,0.30))] shadow-[inset_0_0_38px_rgba(255,255,255,0.9),0_20px_50px_rgba(87,111,159,0.15)] lg:right-[12%] lg:w-[38rem]" />
        </div>
        <Container className="grid gap-8 pb-12 pt-28 sm:gap-10 sm:pb-20 sm:pt-36 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white bg-white/75 px-3 py-2 text-xs font-bold uppercase tracking-[0.11em] text-red-800 shadow-sm backdrop-blur-md sm:px-4">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              OEM / ODM Manufacturing in China
            </p>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Your product idea. <span className="text-red-800">Made real.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">From your first concept to production-ready products. Work with our China sourcing team on supplier matching, prototypes, tooling, quality checks and manufacturing coordination—with confidentiality built in from day one.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#nda" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 text-center font-bold text-white shadow-sm shadow-red-900/20 transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800">
                Get your NDA <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white bg-white/75 px-6 py-3 text-center font-semibold text-slate-900 shadow-sm backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800">
                Discuss your project <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-red-800" aria-hidden="true" /> NDA-first process</span>
              <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-red-800" aria-hidden="true" /> China-based coordination</span>
              <span className="inline-flex items-center gap-2"><PackageCheck className="h-4 w-4 text-red-800" aria-hidden="true" /> Production to shipping</span>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/95 bg-white/65 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),transparent_55%,rgba(255,255,255,0.32))] px-5 py-6 shadow-[inset_0_0_22px_rgba(255,255,255,0.8),0_20px_52px_-24px_rgba(41,49,83,0.35)] backdrop-blur-xl sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-700">Your manufacturing roadmap</span>
              <Factory className="h-6 w-6 shrink-0 text-red-800" aria-hidden="true" />
            </div>
            {[
              { icon: ClipboardList, title: "Share your brief", detail: "Specifications, target price and requirements" },
              { icon: FileCheck2, title: "Protect your idea", detail: "Start with a mutual NDA" },
              { icon: Layers3, title: "Develop and sample", detail: "Supplier selection, prototypes and tooling" },
              { icon: PackageCheck, title: "Produce and deliver", detail: "Quality coordination and logistics" },
            ].map((step, index) => (
              <div key={step.title} className="flex gap-3 border-t border-slate-900/10 py-4 last:pb-0 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-white bg-white/75 shadow-sm">
                  <step.icon className="h-5 w-5 text-red-800" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-800">STEP {String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-1 font-semibold text-slate-900">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <Container className="py-14 sm:py-20 [&_#nda]:scroll-mt-28 sm:[&_#nda]:scroll-mt-32">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div><p className="section-kicker">A clearer path to production</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">From concept to finished product</h2><p className="mt-5 text-base leading-8 text-muted" data-seo-answer>{serviceCopy["oem-odm"].description}</p><p className="mt-4 text-sm leading-7 text-muted">Operated by {company.legalNameFull}. DUNS {company.credentials.dunsNumber}. Warehouse operations in Xiamen and Dubai / Al Ain.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{[
            {number:"01",title:"Product brief",body:"Tell us what you want to build, your specifications and expected quantities."},
            {number:"02",title:"Prototype & sampling",body:"Refine materials, construction and product details before committing."},
            {number:"03",title:"Tooling & manufacturing",body:"Coordinate production requirements with suitable factories."},
            {number:"04",title:"Quality & delivery",body:"Plan inspections, packaging and shipment of your finished goods."}
          ].map(item=><article key={item.number} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="font-mono text-sm font-bold text-accent">{item.number}</span><h3 className="mt-5 font-display text-xl font-bold text-ink">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{item.body}</p></article>)}</div>
        </div>
        <div className="mt-12 rounded-3xl border border-ink/10 bg-background/60 p-6 sm:p-8"><h2 className="font-display text-xl font-bold text-ink">Support beyond manufacturing</h2><p className="mt-3 text-sm leading-7 text-muted">Coordinate <Link href="/inspection" className="font-semibold text-accent underline underline-offset-4">on-the-ground inspection</Link>, <Link href="/amazon-fba" className="font-semibold text-accent underline underline-offset-4">Amazon FBA preparation</Link>, or a <Link href="/visit" className="font-semibold text-accent underline underline-offset-4">hosted factory visit</Link>. Ready to start? <Link href="/contact" className="font-semibold text-accent underline underline-offset-4">Send your project brief</Link>.</p></div>
        <NdaDownloadForm />
        <CommonQuestions items={serviceCommonQuestions["oem-odm"]} />
      </Container>
      <CtaBand />
    </>
  );
}
