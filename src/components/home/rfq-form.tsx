"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, FileSpreadsheet, ImageIcon, Paperclip, Send, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

const fileTypes = [
  { icon: ImageIcon, label: "Images" },
  { icon: Paperclip, label: "PDF" },
  { icon: FileSpreadsheet, label: "Excel" },
];

const nextSteps = [
  {
    step: "01",
    title: "Desk reads your brief",
    text: "A relationship manager in China or Dubai opens the RFQ the same business day.",
  },
  {
    step: "02",
    title: "We reply within 24 hours",
    text: "WhatsApp or email: clarifying questions, then factory options or a 3PL / visit path.",
  },
  {
    step: "03",
    title: "You choose the next move",
    text: "Sample, Visit China factory trip, or stock into our Xiamen / Dubai warehouse.",
  },
];

export function RfqForm({ compact = false }: { compact?: boolean }) {
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [more, setMore] = useState(false);

  function onFiles(list: FileList | null) {
    if (!list) return;
    setFiles(Array.from(list).map((f) => f.name));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-[1.75rem] p-8"
      >
        <p className="text-center font-display text-2xl font-semibold text-ink">
          Got it. We&apos;re on it
        </p>
        <p className="mt-2 text-center text-sm text-muted">What happens next</p>
        <ol className="mt-6 space-y-3">
          {nextSteps.map((item) => (
            <li key={item.step} className="glass-card rounded-2xl px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                {item.step}
              </p>
              <p className="mt-1 text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-sm text-muted">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex justify-center">
          <ButtonLink href={whatsappHref(whatsappPresets.rfq)}>Continue on WhatsApp</ButtonLink>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("glass-panel rounded-[1.75rem]", compact ? "p-5" : "p-6 sm:p-8")}
      aria-label="Sourcing request form"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Idea or RFQ
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            Tell us what to build or source
          </h3>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {fileTypes.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
            >
              <Icon className="h-3 w-3" /> {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Product description *</span>
          <textarea
            required
            name="description"
            rows={compact ? 3 : 4}
            placeholder="Product idea, specs, quantity if you know it, target market…"
            className="glass-input w-full resize-y rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">Name *</span>
            <input
              required
              name="name"
              className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">WhatsApp *</span>
            <input
              required
              name="whatsapp"
              inputMode="tel"
              placeholder="+86 / +971 / +1…"
              className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70"
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMore((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
        aria-expanded={more}
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition", more && "rotate-180")} />
        {more ? "Hide extra fields" : "Add email, quantity, budget, or files"}
      </button>

      {more ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block text-muted">Work email</span>
            <input
              type="email"
              name="email"
              className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">Quantity</span>
            <input
              name="quantity"
              placeholder="e.g. 500 pcs"
              className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">Target budget</span>
            <input
              name="budget"
              placeholder="e.g. AED 35 / unit"
              className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70"
            />
          </label>
          <label className="glass-chip flex cursor-pointer flex-col items-center justify-center rounded-2xl border-dashed px-4 py-6 text-center transition hover:border-accent/50 sm:col-span-2">
            <Upload className="mb-2 h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-ink">Upload RFQ files</span>
            <span className="mt-1 text-xs text-muted">Images, PDF, or Excel (optional)</span>
            <input
              type="file"
              className="sr-only"
              multiple
              accept="image/*,.pdf,.xls,.xlsx,.csv"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
          {files.length > 0 ? (
            <ul className="space-y-1 text-xs text-muted sm:col-span-2">
              {files.map((name) => (
                <li key={name}>Attached: {name}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:opacity-90 dark:bg-accent dark:text-paper"
      >
        <Send className="h-4 w-4" />
        Get my quote
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Three fields to start · Reply in 24h · China HQ & Dubai branch
      </p>
    </form>
  );
}
