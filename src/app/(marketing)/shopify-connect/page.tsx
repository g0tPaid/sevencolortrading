import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageCheck, ShieldCheck, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "Connect your Shopify store",
  description: "Connect your Shopify store with your China sourcing and fulfillment partner at Sourcing Center.",
  alternates: { canonical: "https://sourcing.center/shopify-connect" },
};

const steps = [
  { icon: Store, title: "Connect your store", text: "Install and open Sourcing Center from Shopify. Your store is identified automatically." },
  { icon: ShieldCheck, title: "Link your account", text: "Use your Sourcing Center customer number and the verification steps provided by our team." },
  { icon: PackageCheck, title: "Coordinate order fulfillment", text: "View recent orders and work with our team on warehousing, quality checks and international delivery." },
];

export default function ShopifyConnectPage() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f5f7fa] px-5 pb-20 pt-28 text-slate-900 sm:px-8 sm:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,1),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(226,232,240,0.95),transparent_75%)]" />
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-[1.6rem] border border-white bg-gradient-to-br from-white to-slate-200/70 shadow-[0_12px_35px_rgba(51,65,85,0.18)]">
            <Image src="/seven-color-mark-clear.png" alt="Seven Color" width={66} height={66} priority className="object-contain" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-rose-700">Seven Color · Sourcing Center</p>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Your Shopify store.<br />Our China team.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Connect your store with your sourcing and fulfillment partner in China. Keep order activity visible while our team supports your product sourcing, warehouse and shipping workflow.
          </p>
          <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-white bg-white/80 p-5 shadow-xl shadow-slate-300/30 backdrop-blur-xl sm:p-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <span className="size-2 rounded-full bg-amber-500" /> App preview · Shopify review pending
            </p>
            <a href="https://admin.shopify.com/" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e60043] px-5 py-3 text-base font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-700">
              Open Shopify admin <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">The official customer installation link will be available after Shopify approval. Existing test installations can be opened from Apps in Shopify admin. No customer data is collected on this page.</p>
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="rounded-2xl border border-white bg-white/75 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="grid size-12 place-items-center rounded-xl bg-rose-50 text-rose-700"><Icon className="size-6" aria-hidden="true" /></div>
                <span className="text-xs font-bold tracking-wider text-slate-500">STEP {index + 1}</span>
              </div>
              <h2 className="mt-5 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> China warehouse</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> Dedicated sourcing team</span>
          <Link href="/dropshipping" className="font-semibold text-rose-700 underline underline-offset-4">Learn about dropshipping services</Link>
        </div>
      </div>
    </section>
  );
}
