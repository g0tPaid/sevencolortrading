"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import {
  PACKAGE_IDS,
  formFields,
  growthCopy,
  packageLabels,
  type PackageId,
} from "@/lib/factory-growth";
import { useFactoryGrowthUi } from "./locale-context";
import { LanguageSwitcher } from "./language-switcher";

const inputClass =
  "glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70";

type FormState = {
  companyName: string;
  contactName: string;
  phone: string;
  wechat: string;
  whatsapp: string;
  email: string;
  factoryLocation: string;
  mainProducts: string;
  existingWebsite: string;
  message: string;
};

const emptyForm: FormState = {
  companyName: "",
  contactName: "",
  phone: "",
  wechat: "",
  whatsapp: "",
  email: "",
  factoryLocation: "",
  mainProducts: "",
  existingWebsite: "",
  message: "",
};

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.trim().length <= 160;
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 6 && digits.length <= 20 && value.trim().length <= 40;
}

export function GrowthInquiryForm() {
  const { t, lang, packageId, setPackageId } = useFactoryGrowthUi();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function FieldLabel({ copy, required }: { copy: { en: string; zh: string }; required?: boolean }) {
    return (
      <span className="mb-1.5 block text-ink">
        {t(copy)}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const bait = String(new FormData(e.currentTarget).get("website_url") || "").trim();

    if (
      form.companyName.trim().length < 2 ||
      form.contactName.trim().length < 2 ||
      !form.factoryLocation.trim() ||
      !form.mainProducts.trim()
    ) {
      setError(t(formFields.required));
      return;
    }
    if (!looksLikePhone(form.phone)) {
      setError(t(formFields.invalidPhone));
      return;
    }
    if (!looksLikeEmail(form.email)) {
      setError(t(formFields.invalidEmail));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/factory-growth-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          contactName: form.contactName,
          phone: form.phone,
          wechat: form.wechat,
          whatsapp: form.whatsapp,
          email: form.email,
          factoryLocation: form.factoryLocation,
          mainProducts: form.mainProducts,
          existingWebsite: form.existingWebsite,
          packageId,
          message: form.message,
          website_url: bait,
          lang,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; id?: string; error?: string }
        | null;
      if (!response.ok || !data?.ok || !data.id) {
        setError(data?.error || t(formFields.fail));
        return;
      }
      setSubmittedId(data.id);
    } catch {
      setError(t(formFields.network));
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel scroll-mt-32 rounded-[1.75rem] p-8 text-center"
        id="inquiry"
      >
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-ink">
          {t(growthCopy.formSuccessTitle)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t(growthCopy.formSuccessBody)}</p>
        <p className="mt-5 font-mono text-[11px] text-muted">Ref {submittedId.slice(0, 8)}</p>
      </motion.div>
    );
  }

  return (
    <form
      id="inquiry"
      onSubmit={onSubmit}
      className="glass-panel relative scroll-mt-32 rounded-[1.75rem] p-5 sm:p-7"
      aria-label={t(growthCopy.formTitle)}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t(growthCopy.formKicker)}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            {t(growthCopy.formTitle)}
          </h2>
          <p className="mt-2 text-sm text-muted">{t(growthCopy.formLead)}</p>
        </div>
        <LanguageSwitcher />
      </div>

      <div
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
        aria-hidden
      >
        <label>
          Website
          <input name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.company} required />
          <input
            required
            name="companyName"
            value={form.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel copy={formFields.contact} required />
          <input
            required
            name="contactName"
            value={form.contactName}
            onChange={(e) => setField("contactName", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel copy={formFields.phone} required />
          <input
            required
            name="phone"
            inputMode="tel"
            placeholder="+86 …"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel copy={formFields.wechat} />
          <input
            name="wechat"
            value={form.wechat}
            onChange={(e) => setField("wechat", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel copy={formFields.whatsapp} />
          <input
            name="whatsapp"
            inputMode="tel"
            value={form.whatsapp}
            onChange={(e) => setField("whatsapp", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.email} required />
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.location} required />
          <input
            required
            name="factoryLocation"
            placeholder={t(formFields.locationPh)}
            value={form.factoryLocation}
            onChange={(e) => setField("factoryLocation", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.products} required />
          <input
            required
            name="mainProducts"
            placeholder={t(formFields.productsPh)}
            value={form.mainProducts}
            onChange={(e) => setField("mainProducts", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.website} />
          <input
            name="existingWebsite"
            type="text"
            inputMode="url"
            placeholder={t(formFields.websitePh)}
            value={form.existingWebsite}
            onChange={(e) => setField("existingWebsite", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.package} required />
          <select
            required
            name="packageId"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value as PackageId)}
            className={inputClass}
          >
            {PACKAGE_IDS.map((id) => (
              <option key={id} value={id}>
                {t(packageLabels[id])}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel copy={formFields.message} />
          <textarea
            name="message"
            rows={4}
            placeholder={t(formFields.messagePh)}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden />
        {submitting ? t(growthCopy.formSubmitting) : t(growthCopy.formSubmit)}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">{t(growthCopy.support)}</p>
    </form>
  );
}
