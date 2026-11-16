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
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <Container className="relative grid gap-12 pb-16 pt-28 sm:pb-24 sm:pt-36 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85"><Sparkles className="h-4 w-4 text-red-300" /> OEM / ODM Manufacturing in China</p>
            <h1 className="mt-7 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Your product idea. <span className="text-red-300">Made real.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">From your first concept to production-ready products. Work with our China sourcing team on supplier matching, prototypes, tooling, quality checks and manufacturing coordination—with confidentiality built in from day one.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#nda" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-black/20 transition hover:brightness-110">Get your NDA <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">Discuss your project <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-red-300" /> NDA-first process</span><span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-red-300" /> China-based coordination</span><span className="inline-flex items-center gap-2"><PackageCheck className="h-4 w-4 text-red-300" /> Production to shipping</span></div>
          </div>
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-7 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">Your manufacturing roadmap</span><Factory className="h-6 w-6 text-red-300" /></div>
            {[
              {icon:ClipboardList,title:"Share your brief",detail:"Specifications, target price and requirements"},
              {icon:FileCheck2,title:"Protect your idea",detail:"Start with a mutual NDA"},
              {icon:Layers3,title:"Develop and sample",detail:"Supplier selection, prototypes and tooling"},
              {icon:PackageCheck,title:"Produce and deliver",detail:"Quality coordination and logistics"}
            ].map((step,i)=><div key={step.title} className="flex gap-4 border-t border-white/15 py-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"><step.icon className="h-5 w-5 text-red-300" /></div><div><p className="text-xs font-semibold text-red-300">STEP {String(i+1).padStart(2,"0")}</p><h2 className="mt-1 font-semibold text-white">{step.title}</h2><p className="mt-1 text-sm leading-6 text-white/65">{step.detail}</p></div></div>)}
          </div>
        </Container>
      </section>
      <Container className="py-14 sm:py-20">
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
