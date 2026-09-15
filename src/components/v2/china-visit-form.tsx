"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Send } from "lucide-react";
import {
  chinaVisitDurations,
  chinaVisitFocus,
} from "@/lib/v2-content";
import { trackGaEvent } from "@/lib/ga";
import { whatsappHref, whatsappPresets } from "@/lib/whatsapp";

export function ChinaVisitForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      company: String(form.get("company") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      startDate: String(form.get("startDate") || ""),
      duration: String(form.get("duration") || ""),
      travelers: String(form.get("travelers") || ""),
      focus: String(form.get("focus") || ""),
      notes: String(form.get("notes") || ""),
      website_url: String(form.get("website_url") || ""),
      sourcePath: "/visit",
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/visit-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; id?: string; error?: string }
        | null;
      if (!response.ok || !data?.ok || !data.id) {
        setError(data?.error || "Could not send the visit request. Try again or use WhatsApp.");
        return;
      }
      trackGaEvent("generate_lead", { method: "visit", source_path: "/visit" });
      setSent(true);
    } catch {
      setError("Network error. Try again or continue on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-[1.75rem] p-8 text-center"
      >
        <p className="font-display text-2xl font-semibold text-ink">Visit request received</p>
        <p className="mt-3 text-sm text-muted">
          The China desk will confirm factories, hotel, and pickup within 24 hours.
        </p>
        <a
          href={whatsappHref(whatsappPresets.factoryVisit)}
          className="mt-5 inline-flex text-sm font-medium text-ink underline decoration-accent/40 underline-offset-4"
        >
          Continue on WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative glass-panel rounded-[1.75rem] p-5 sm:p-7"
      aria-label="Schedule a China factory visit"
    >
      <div className="mb-5 flex items-center gap-2">
        <Plane className="h-5 w-5 text-accent" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Book a visit</p>
          <h3 className="font-display text-xl font-semibold text-ink">Tell us when you can be in China</h3>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Name *</span>
          <input
            required
            name="name"
            autoComplete="name"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Company</span>
          <input
            name="company"
            autoComplete="organization"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Email *</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">WhatsApp / phone *</span>
          <input
            required
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+971 … or +86 …"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Preferred start date *</span>
          <input
            required
            type="date"
            name="startDate"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Duration</span>
          <select
            name="duration"
            defaultValue="3 days"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          >
            {chinaVisitDurations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Travelers</span>
          <input
            name="travelers"
            type="number"
            min={1}
            defaultValue={1}
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Focus</span>
          <select
            name="focus"
            className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
          >
            {chinaVisitFocus.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-muted">What should we put on the itinerary?</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Category, factories you already like, whether you want the 3PL warehouse, Canton Fair overlap…"
            className="glass-input w-full resize-y rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70"
          />
        </label>
      </div>
      <input
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
        aria-hidden
      />
      {error ? (
        <p className="mt-4 text-sm text-accent" role="alert">
          {error}{" "}
          <a
            href={whatsappHref(whatsappPresets.factoryVisit)}
            className="font-medium underline decoration-accent/40 underline-offset-4"
          >
            WhatsApp the desk
          </a>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden />
        {submitting ? "Sending…" : "Request China visit"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Hosted in China · based in Xiamen · reply in 24h · not a brokered tourist tour
      </p>
    </form>
  );
}
