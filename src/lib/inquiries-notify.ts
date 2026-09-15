import { company } from "@/lib/content";
import type { Inquiry } from "@/lib/inquiries";

/**
 * Best-effort ops alert after an RFQ or visit inquiry is saved.
 * Reuses FACTORY_NOTIFY_WEBHOOK / FACTORY_NOTIFY_EMAIL so existing Railway
 * alerts also catch buyer forms. Never throw to the request path.
 */

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function summary(inquiry: Inquiry) {
  return {
    id: inquiry.id,
    createdAt: inquiry.createdAt,
    kind: inquiry.kind,
    sourcePath: inquiry.sourcePath,
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email ?? "",
    company: inquiry.company ?? "",
    description: inquiry.description ?? "",
    quantity: inquiry.quantity ?? "",
    budget: inquiry.budget ?? "",
    startDate: inquiry.startDate ?? "",
    duration: inquiry.duration ?? "",
    travelers: inquiry.travelers ?? "",
    focus: inquiry.focus ?? "",
    notes: inquiry.notes ?? "",
    files: (inquiry.files ?? []).map((file) => file.filename),
  };
}

function label(inquiry: Inquiry): string {
  return inquiry.kind === "visit" ? "China visit inquiry" : "Buyer RFQ";
}

function textBody(inquiry: Inquiry): string {
  const s = summary(inquiry);
  return [
    `${label(inquiry)} ${s.id}`,
    `Name: ${s.name}`,
    s.company ? `Company: ${s.company}` : "",
    `Phone / WhatsApp: ${s.phone}`,
    s.email ? `Email: ${s.email}` : "",
    s.description ? `Brief: ${s.description}` : "",
    s.quantity ? `Quantity: ${s.quantity}` : "",
    s.budget ? `Budget: ${s.budget}` : "",
    s.startDate ? `Start date: ${s.startDate}` : "",
    s.duration ? `Duration: ${s.duration}` : "",
    s.travelers ? `Travelers: ${s.travelers}` : "",
    s.focus ? `Focus: ${s.focus}` : "",
    s.notes ? `Notes: ${s.notes}` : "",
    s.files.length ? `Files: ${s.files.join(", ")}` : "",
    `Source: ${s.sourcePath}`,
    `When: ${s.createdAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyWebhook(inquiry: Inquiry): Promise<void> {
  const url = env("FACTORY_NOTIFY_WEBHOOK");
  if (!url) return;

  const payload = {
    text: textBody(inquiry),
    inquiry: summary(inquiry),
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

async function notifyEmail(inquiry: Inquiry): Promise<void> {
  const to = env("FACTORY_NOTIFY_EMAIL");
  if (!to) return;

  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.warn(
      "[inquiries-notify] FACTORY_NOTIFY_EMAIL is set but RESEND_API_KEY is missing; skip email",
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
      subject: `${label(inquiry)}: ${inquiry.name}`,
      text: textBody(inquiry),
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`email ${response.status} ${detail.slice(0, 180)}`);
  }
}

export async function notifyInquiry(inquiry: Inquiry): Promise<void> {
  const jobs: Array<Promise<void>> = [];
  if (env("FACTORY_NOTIFY_WEBHOOK")) jobs.push(notifyWebhook(inquiry));
  if (env("FACTORY_NOTIFY_EMAIL")) jobs.push(notifyEmail(inquiry));
  if (jobs.length === 0) return;

  const results = await Promise.allSettled(jobs);
  for (const result of results) {
    if (result.status === "rejected") {
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error("[inquiries-notify] failed:", reason);
    }
  }
}
