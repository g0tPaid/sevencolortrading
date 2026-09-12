import type { FactoryApplication } from "@/lib/factory-applications";
import { company } from "@/lib/content";

/**
 * Best-effort ops alert after a factory application is saved.
 * Never throw to the request path — callers must catch / allSettled.
 *
 * Railway / production env:
 * - FACTORY_NOTIFY_WEBHOOK  POST JSON (Slack, Discord, Make, WhatsApp automation)
 * - FACTORY_NOTIFY_EMAIL    recipient
 * - RESEND_API_KEY          required to actually send the email
 * - FACTORY_NOTIFY_FROM     optional From (defaults to corporate inbox)
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function summary(app: FactoryApplication) {
  return {
    id: app.id,
    createdAt: app.createdAt,
    companyNameEn: app.companyNameEn,
    companyNameZh: app.companyNameZh ?? "",
    contactName: app.contactName,
    phone: app.phone,
    wechat: app.wechat ?? "",
    email: app.email,
    city: app.city,
    province: app.province,
    categories: app.categories,
    moq: app.moq ?? "",
    exportExperience: app.exportExperience ?? "",
    licenseNumber: app.licenseNumber ?? "",
    alibabaOrWebsite: app.alibabaOrWebsite ?? "",
    notes: app.notes ?? "",
    sourcePath: app.sourcePath,
  };
}

function textBody(app: FactoryApplication): string {
  const s = summary(app);
  return [
    `New factory application ${s.id}`,
    `Company: ${s.companyNameEn}${s.companyNameZh ? ` / ${s.companyNameZh}` : ""}`,
    `Contact: ${s.contactName}`,
    `Phone: ${s.phone}${s.wechat ? ` · WeChat ${s.wechat}` : ""}`,
    `Email: ${s.email}`,
    `Location: ${s.city}, ${s.province}`,
    `Categories: ${s.categories.join(", ")}`,
    s.moq ? `MOQ: ${s.moq}` : "",
    s.exportExperience ? `Export: ${s.exportExperience}` : "",
    s.licenseNumber ? `License: ${s.licenseNumber}` : "",
    s.alibabaOrWebsite ? `Web: ${s.alibabaOrWebsite}` : "",
    s.notes ? `Notes: ${s.notes}` : "",
    `Source: ${s.sourcePath}`,
    `When: ${s.createdAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyWebhook(app: FactoryApplication): Promise<void> {
  const url = env("FACTORY_NOTIFY_WEBHOOK");
  if (!url) return;

  const payload = {
    text: textBody(app),
    application: summary(app),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`webhook ${response.status}`);
  }
}

async function notifyEmail(app: FactoryApplication): Promise<void> {
  const to = env("FACTORY_NOTIFY_EMAIL");
  if (!to) return;

  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.warn(
      "[factory-notify] FACTORY_NOTIFY_EMAIL is set but RESEND_API_KEY is missing — skip email",
    );
    return;
  }

  const from = env("FACTORY_NOTIFY_FROM") || company.emails.corporate;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Sourcing Center <${from}>`,
      to: [to],
      subject: `Factory application: ${app.companyNameEn}`,
      text: textBody(app),
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`email ${response.status} ${detail.slice(0, 180)}`);
  }
}

export async function notifyFactoryApplication(app: FactoryApplication): Promise<void> {
  const jobs: Array<Promise<void>> = [];
  if (env("FACTORY_NOTIFY_WEBHOOK")) jobs.push(notifyWebhook(app));
  if (env("FACTORY_NOTIFY_EMAIL")) jobs.push(notifyEmail(app));
  if (jobs.length === 0) return;

  const results = await Promise.allSettled(jobs);
  for (const result of results) {
    if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error("[factory-notify] failed:", reason);
    }
  }
}
