"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardCheck, LockKeyhole, PackageCheck, ShoppingCart, Truck } from "lucide-react";

const steps = [
  { title: "We buy your products", short: "You send the order. We handle purchasing.", detail: "Our team purchases your requested items from the supplier and coordinates the order.", Icon: ShoppingCart, tag: "01 · ORDER" },
  { title: "Arrives at our warehouse", short: "We receive your items at our China hub.", detail: "Products are received at our office or warehouse so we can prepare them for fulfillment.", Icon: PackageCheck, tag: "02 · RECEIVE" },
  { title: "Quality inspection", short: "We inspect the products before dispatch.", detail: "We check available product details and condition and prepare QC photos or videos where provided.", Icon: ClipboardCheck, tag: "03 · INSPECT" },
  { title: "Shipment is dispatched", short: "Your tracking number is issued.", detail: "We prepare the shipment and share its tracking information so you can follow its progress.", Icon: Truck, tag: "04 · SHIP" },
  { title: "Track everything privately", short: "See tracking, QC photos and video updates.", detail: "Open your private shipment link to view available status updates, photos and videos.", Icon: LockKeyhole, tag: "05 · TRACK" },
];

export function DropshippingRoadmap() {
  const [active, setActive] = useState(0);
  return <div className="relative mx-auto max-w-5xl py-2">
    <div aria-hidden="true" className="absolute bottom-10 left-[23px] top-10 w-1 rounded-full bg-gradient-to-b from-red-400 via-red-500 to-emerald-500 md:left-1/2 md:-translate-x-1/2" />
    <ol className="relative space-y-5 md:space-y-2">
      {steps.map(({title,short,detail,Icon,tag},index)=>{
        const selected=active===index;
        const last=index===steps.length-1;
        return <li key={title} className={`relative grid grid-cols-[48px_1fr] items-center gap-4 md:grid-cols-[1fr_64px_1fr] md:gap-5 ${index%2===1?"md:[&>.road-card]:col-start-3":""}`}>
          <button type="button" aria-label={`Show step ${index+1}: ${title}`} aria-pressed={selected} onClick={()=>setActive(index)} className={`relative z-10 col-start-1 row-start-1 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background text-sm font-black text-white shadow-lg transition-all duration-300 motion-safe:hover:scale-110 md:col-start-2 md:mx-auto ${last?"bg-emerald-600 shadow-emerald-500/30":selected?"bg-red-600 shadow-red-500/30 ring-4 ring-red-500/15":"bg-slate-800"}`}>{last?<CheckCircle2 className="h-6 w-6"/>:String(index+1).padStart(2,"0")}</button>
          <button type="button" onClick={()=>setActive(index)} aria-expanded={selected} className={`road-card group col-start-2 row-start-1 w-full rounded-[1.6rem] border-2 p-5 text-left shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl md:col-start-1 md:row-start-1 ${last?"border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/60 dark:to-emerald-900/30":selected?"border-red-400 bg-gradient-to-br from-white to-red-50 shadow-red-500/10 dark:from-slate-900 dark:to-red-950/20":"border-ink/10 bg-background/90 hover:border-red-300"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${last?"bg-emerald-600 text-white":"bg-accent text-white"}`}><Icon className="h-6 w-6"/></span>
              <span className={`text-[10px] font-black tracking-widest ${last?"text-emerald-700 dark:text-emerald-300":"text-accent"}`}>{tag}</span>
            </div>
            <h3 className={`mt-4 font-display text-xl font-extrabold leading-tight ${last?"text-emerald-900 dark:text-emerald-200":"text-ink"}`}>{title}</h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">{short}</p>
            {selected&&<p className="mt-3 border-t border-ink/10 pt-3 text-sm font-medium leading-relaxed text-muted">{detail}</p>}
            <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold ${last?"text-emerald-700 dark:text-emerald-300":"text-accent"}`}>{selected?"Step details shown":"Tap to explore"} <ArrowRight className="h-3.5 w-3.5"/></div>
          </button>
          {index<steps.length-1&&<span aria-hidden="true" className="pointer-events-none absolute -bottom-4 left-[18px] z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 ring-4 ring-background motion-safe:animate-pulse md:left-1/2 md:-translate-x-1/2"/>}
        </li>;
      })}
    </ol>
    <p className="mt-5 pl-16 text-xs font-semibold text-muted md:pl-0 md:text-center">Select any stop on the roadmap to see what happens at that stage.</p>
  </div>;
}
