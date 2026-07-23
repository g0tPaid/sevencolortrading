"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, ImageIcon, Paperclip, Send, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const fileTypes = [
  { icon: ImageIcon, label: "Images" },
  { icon: Paperclip, label: "PDF" },
  { icon: FileSpreadsheet, label: "Excel" },
];

export function RfqForm({ compact = false }: { compact?: boolean }) {
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

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
        className="rounded-3xl border border-line bg-paper-elevated p-8 text-center"
      >
        <p className="font-display text-2xl font-semibold text-ink">Got it — we&apos;re on it</p>
        <p className="mt-3 text-sm text-muted">
          Expect sourcing options within 24 hours from our China or Dubai desk.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-3xl border border-line bg-paper-elevated shadow-[0_24px_80px_rgba(0,0,0,0.08)]",
        compact ? "p-5" : "p-6 sm:p-8",
      )}
      aria-label="AI sourcing request form"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Free quote
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            Tell us what to source
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-muted">Product description *</span>
          <textarea
            required
            name="description"
            rows={compact ? 3 : 4}
            placeholder="What do you need? Specs, materials, quantity, target budget…"
            className="w-full resize-y rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent placeholder:text-muted/70 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Quantity</span>
          <input
            name="quantity"
            placeholder="e.g. 500 pcs"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent placeholder:text-muted/70 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Target budget</span>
          <input
            name="budget"
            placeholder="e.g. AED 35 / unit"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent placeholder:text-muted/70 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Name *</span>
          <input
            required
            name="name"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Work email *</span>
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-ink outline-none ring-accent focus:ring-2"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper px-4 py-6 text-center transition hover:border-accent/50">
        <Upload className="mb-2 h-5 w-5 text-accent" />
        <span className="text-sm font-medium text-ink">Upload RFQ files</span>
        <span className="mt-1 text-xs text-muted">Images, PDF, or Excel — optional</span>
        <input
          type="file"
          className="sr-only"
          multiple
          accept="image/*,.pdf,.xls,.xlsx,.csv"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>
      {files.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-muted">
          {files.map((name) => (
            <li key={name}>Attached: {name}</li>
          ))}
        </ul>
      ) : null}

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:opacity-90 dark:bg-accent dark:text-paper"
      >
        <Send className="h-4 w-4" />
        Get my quote
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        No MOQ · Reply in 24h · China HQ & Dubai branch
      </p>
    </form>
  );
}
