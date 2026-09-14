"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Factory, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_CATEGORIES = [
  "electronics",
  "home",
  "fashion",
  "industrial",
  "construction",
  "furniture",
  "packaging",
  "textiles",
  "beauty",
  "lighting",
  "kitchen",
  "outdoor",
];

const EXPORT_OPTIONS: Array<{ value: "" | "none" | "some" | "established"; label: string; zh: string }> = [
  { value: "", label: "Select…", zh: "请选择" },
  { value: "none", label: "None", zh: "无出口经验" },
  { value: "some", label: "Some", zh: "有一定出口经验" },
  { value: "established", label: "Established", zh: "成熟出口商" },
];

type FormState = {
  companyNameEn: string;
  companyNameZh: string;
  contactName: string;
  phone: string;
  wechat: string;
  email: string;
  city: string;
  province: string;
  categoryDraft: string;
  moq: string;
  exportExperience: "" | "none" | "some" | "established";
  licenseNumber: string;
  alibabaOrWebsite: string;
  notes: string;
};

const emptyForm: FormState = {
  companyNameEn: "",
  companyNameZh: "",
  contactName: "",
  phone: "",
  wechat: "",
  email: "",
  city: "",
  province: "",
  categoryDraft: "",
  moq: "",
  exportExperience: "",
  licenseNumber: "",
  alibabaOrWebsite: "",
  notes: "",
};

function FieldLabel({
  en,
  zh,
  required,
}: {
  en: string;
  zh: string;
  required?: boolean;
}) {
  return (
    <span className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-ink">
        {en}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      <span className="text-xs text-muted">{zh}</span>
    </span>
  );
}

const inputClass =
  "glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-muted/70";

export function FactoryRegisterForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const selected = useMemo(() => new Set(categories.map((c) => c.toLowerCase())), [categories]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addCategory(raw: string) {
    const parts = raw.split(/[,，;；|]+/).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setCategories((prev) => {
      const next = [...prev];
      const seen = new Set(next.map((c) => c.toLowerCase()));
      for (const part of parts) {
        const tag = part.slice(0, 80);
        const key = tag.toLowerCase();
        if (!tag || seen.has(key) || next.length >= 20) continue;
        seen.add(key);
        next.push(tag);
      }
      return next;
    });
  }

  function toggleChip(tag: string) {
    setCategories((prev) => {
      const key = tag.toLowerCase();
      if (prev.some((c) => c.toLowerCase() === key)) {
        return prev.filter((c) => c.toLowerCase() !== key);
      }
      if (prev.length >= 20) return prev;
      return [...prev, tag];
    });
  }

  function removeCategory(tag: string) {
    setCategories((prev) => prev.filter((c) => c.toLowerCase() !== tag.toLowerCase()));
  }

  function onCategoryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(form.categoryDraft);
      setField("categoryDraft", "");
    } else if (e.key === "Backspace" && !form.categoryDraft && categories.length) {
      setCategories((prev) => prev.slice(0, -1));
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const bait = String(new FormData(e.currentTarget).get("website_url") || "").trim();

    const merged = [...categories];
    if (form.categoryDraft.trim()) {
      for (const part of form.categoryDraft.split(/[,，;；|]+/)) {
        const tag = part.trim();
        if (tag && !merged.some((c) => c.toLowerCase() === tag.toLowerCase())) merged.push(tag);
      }
    }

    if (merged.length === 0) {
      setError("Please add at least one category. / 请至少选择或填写一个品类。");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/factory-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyNameEn: form.companyNameEn,
          companyNameZh: form.companyNameZh,
          contactName: form.contactName,
          phone: form.phone,
          wechat: form.wechat,
          email: form.email,
          city: form.city,
          province: form.province,
          categories: merged,
          moq: form.moq,
          exportExperience: form.exportExperience || undefined,
          licenseNumber: form.licenseNumber,
          alibabaOrWebsite: form.alibabaOrWebsite,
          notes: form.notes,
          website_url: bait,
          sourcePath: "/factories/register",
        }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; id?: string; error?: string } | null;
      if (!response.ok || !data?.ok || !data.id) {
        setError(data?.error || "Could not submit. Please try again. / 提交失败，请重试。");
        return;
      }
      setSubmittedId(data.id);
    } catch {
      setError("Network error. Please try again. / 网络错误，请重试。");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-[1.75rem] p-8 text-center"
      >
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-ink">Application received</p>
        <p className="mt-1 text-sm text-muted">申请已提交</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The China desk will review your factory and contact you if we have a buyer fit. This is not
          an automatic listing.
        </p>
        <p className="mt-2 text-sm text-muted">中国团队将审核贵厂资料；合适时再与您联系，并非自动上架。</p>
        <p className="mt-5 font-mono text-[11px] text-muted">Ref {submittedId.slice(0, 8)}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Optional and separate — vendor registration stays free:{" "}
          <Link href="/factory-growth" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            Factory international presence
          </Link>
          .
        </p>
        <p className="mt-1 text-sm text-muted" lang="zh-CN">
          可选且独立（登记仍然免费）：
          <Link href="/factory-growth" className="font-medium text-ink underline decoration-accent/40 underline-offset-4">
            工厂出海形象服务
          </Link>
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass-panel relative rounded-[1.75rem] p-5 sm:p-7"
      aria-label="Factory vendor registration"
    >
      <div className="mb-5 flex items-center gap-2">
        <Factory className="h-5 w-5 text-accent" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">工厂登记</p>
          <h3 className="font-display text-xl font-semibold text-ink">Apply to become a vendor</h3>
        </div>
      </div>

      <div
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
        aria-hidden
        style={{ position: "absolute" }}
      >
        <label>
          Website
          <input
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <FieldLabel en="Company name (English)" zh="公司名称（英文）" required />
          <input
            required
            name="companyNameEn"
            value={form.companyNameEn}
            onChange={(e) => setField("companyNameEn", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel en="Company name (Chinese)" zh="公司名称（中文）— 建议填写" />
          <input
            name="companyNameZh"
            value={form.companyNameZh}
            onChange={(e) => setField("companyNameZh", e.target.value)}
            placeholder="有助于核验营业执照"
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="Contact name" zh="联系人" required />
          <input
            required
            name="contactName"
            value={form.contactName}
            onChange={(e) => setField("contactName", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="Phone" zh="电话（中国手机号可用）" required />
          <input
            required
            name="phone"
            inputMode="tel"
            placeholder="+86 138 0000 0000"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="WeChat" zh="微信号" />
          <input
            name="wechat"
            value={form.wechat}
            onChange={(e) => setField("wechat", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="Email" zh="邮箱" required />
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="City" zh="城市" required />
          <input
            required
            name="city"
            placeholder="Xiamen / 厦门"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="Province" zh="省份" required />
          <input
            required
            name="province"
            placeholder="Fujian / 福建"
            value={form.province}
            onChange={(e) => setField("province", e.target.value)}
            className={inputClass}
          />
        </label>

        <div className="sm:col-span-2">
          <FieldLabel en="Categories" zh="品类（可多选或自行填写）" required />
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_CATEGORIES.map((tag) => {
              const on = selected.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleChip(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition",
                    on
                      ? "border-accent bg-accent text-white"
                      : "glass-chip text-muted hover:text-ink",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {categories.length > 0 ? (
            <ul className="mb-2 flex flex-wrap gap-1.5">
              {categories.map((tag) => (
                <li
                  key={tag}
                  className="glass-chip inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-ink"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeCategory(tag)}
                    className="text-muted hover:text-ink"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <input
            name="categoryDraft"
            value={form.categoryDraft}
            onChange={(e) => setField("categoryDraft", e.target.value)}
            onKeyDown={onCategoryKeyDown}
            onBlur={() => {
              if (form.categoryDraft.trim()) {
                addCategory(form.categoryDraft);
                setField("categoryDraft", "");
              }
            }}
            placeholder="Type a category and press Enter — 输入品类后回车"
            className={inputClass}
          />
        </div>

        <label className="block text-sm">
          <FieldLabel en="MOQ" zh="起订量" />
          <input
            name="moq"
            placeholder="e.g. 500 pcs / 面议"
            value={form.moq}
            onChange={(e) => setField("moq", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="Export experience" zh="出口经验" />
          <select
            name="exportExperience"
            value={form.exportExperience}
            onChange={(e) =>
              setField("exportExperience", e.target.value as FormState["exportExperience"])
            }
            className={inputClass}
          >
            {EXPORT_OPTIONS.map((opt) => (
              <option key={opt.value || "blank"} value={opt.value}>
                {opt.value ? `${opt.label} · ${opt.zh}` : opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <FieldLabel en="Business license number" zh="统一社会信用代码" />
          <input
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={(e) => setField("licenseNumber", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <FieldLabel en="Alibaba or website" zh="阿里巴巴 / 官网" />
          <input
            name="alibabaOrWebsite"
            type="text"
            inputMode="url"
            placeholder="https://"
            value={form.alibabaOrWebsite}
            onChange={(e) => setField("alibabaOrWebsite", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <FieldLabel en="Message" zh="备注" />
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Main products, capacity, certifications… 主营产品、产能、认证等"
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
        {submitting ? "Submitting…" : "Submit application · 提交申请"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Verified factories only · 仅核实工厂 · China desk replies when there is a fit
      </p>
    </form>
  );
}
