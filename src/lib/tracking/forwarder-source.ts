import { recipientDisplayName } from "@/lib/tracking/greeting";
import { MSG } from "@/lib/tracking/messages";
import { consumeRateLimit, writeProviderLog } from "@/lib/tracking/store";
import { normalizeTrackingNumber } from "@/lib/tracking/validate";

/**
 * Public form on the forwarder tracking page. The form action is
 * `trackIndex.htm` (method POST, field `documentCode`). HTTPS on this port
 * fails the TLS handshake; this client does not retry over a different
 * protocol or follow a redirect. The page is 华磊物流通 software and covers
 * only the shipments that installation tracks.
 */
export const FORWARDER_SOURCE_URL = "http://43.138.192.64:8082/trackIndex.htm";
export const FORWARDER_CARRIER_ID = "hualei-forwarder";
export const FORWARDER_PROVIDER_VERSION = 4;
export const FORWARDER_REQUEST_LIMIT = 20;
export const FORWARDER_WINDOW_MS = 10 * 60 * 1000;

const MAX_BYTES = 200_000;
const TIMEOUT_MS = 8_000;
const TIME = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const DROPPED_LABELS = new Set(["收件人", "电话", "手机", "地址", "收件地址", "寄件人", "发件人", "联系人", "签收人"]);

export type ForwarderEvent = {
  time: string;
  location: string | null;
  description: string;
};

export type ForwarderDocument =
  | {
      kind: "ready";
      reference: string | null;
      pieces: string | null;
      destination: string | null;
      status: string;
      displayName: string | null;
      events: ForwarderEvent[];
    }
  | { kind: "not_found" }
  | { kind: "timeout" }
  | { kind: "challenge" }
  | { kind: "parser_failure" }
  | { kind: "throttled" };

export function claimForwarderRequest(now: Date): boolean {
  return consumeRateLimit("forwarder-hualei", FORWARDER_REQUEST_LIMIT, FORWARDER_WINDOW_MS, now);
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d{1,7});/g, (_, digits: string) => {
      const code = Number(digits);
      return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : "";
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : "";
    });
}

function visibleText(fragment: string): string {
  const without = fragment
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const text = decodeEntities(without.replace(/<[^>]*>/g, " "));
  return text.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

function charsetLabel(contentType: string, bytes: Uint8Array): string {
  const header = /charset\s*=\s*"?([A-Za-z0-9._-]+)/i.exec(contentType)?.[1];
  const sniff = new TextDecoder("latin1").decode(bytes.subarray(0, 800));
  const meta = /charset\s*=\s*["']?\s*([A-Za-z0-9._-]+)/i.exec(sniff)?.[1];
  const name = (header || meta || "utf-8").toLowerCase().replaceAll("_", "-");
  if (name === "gb2312" || name === "gbk" || name === "gb18030") return "gb18030";
  return name;
}

export function readForwarderBody(bytes: Uint8Array, contentType: string, number: string): ForwarderDocument {
  if (bytes.byteLength > MAX_BYTES) return { kind: "parser_failure" };
  let html: string;
  try {
    html = new TextDecoder(charsetLabel(contentType, bytes), { fatal: true }).decode(bytes);
  } catch {
    return { kind: "parser_failure" };
  }
  return parseForwarderHtml(html, number);
}

function listItems(ulInner: string): Array<{ className: string; text: string }> {
  const items: Array<{ className: string; text: string }> = [];
  const re = /<li\b([^>]*)>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(ulInner))) {
    const className = /class\s*=\s*"([^"]*)"/i.exec(match[1] ?? "")?.[1] ?? "";
    items.push({ className, text: visibleText(match[2] ?? "") });
  }
  return items;
}

function safeCode(value: string): string | null {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{3,39}$/.test(value)) return null;
  if (/^\d{11}$/.test(value) || /^\d{13}$/.test(value)) return null;
  return value;
}

function safePlace(value: string): string | null {
  if (!value || value.length > 40) return null;
  if (value.includes("@") || /\d{6,}/.test(value)) return null;
  return value;
}

function scrub(value: string, blocked: Set<string>, tracking: string): string | null {
  if (!value || blocked.has(value)) return null;
  const text = value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(/\d{7,}/g, (run) => (run === tracking ? run : ""))
    .replace(/\s+/g, " ")
    .trim();
  if (!text || blocked.has(text)) return null;
  return text;
}

function challengePage(html: string): boolean {
  const text = visibleText(html).toLowerCase();
  return /验证码|captcha|access denied|forbidden|请登录|cloudflare/.test(text);
}

export function parseForwarderHtml(html: string, rawNumber: string): ForwarderDocument {
  let number: string;
  try {
    number = normalizeTrackingNumber(rawNumber);
  } catch {
    return { kind: "parser_failure" };
  }
  const hasShell = /运单信息|name\s*=\s*"documentCode"|trackIndex\.htm/i.test(html);
  if (!hasShell) {
    return challengePage(html) ? { kind: "challenge" } : { kind: "parser_failure" };
  }
  const chunks = html.split(/<div class="div_cont"/i).slice(1);
  const blocks = chunks.length > 0 ? chunks : [html];
  for (const block of blocks) {
    const parsed = parseBlock(block, number);
    if (parsed.kind === "ready") return parsed;
    if (parsed.kind === "parser_failure") return parsed;
  }
  if (challengePage(html) && !/【\s*[A-Za-z0-9-]{4,40}\s*】/.test(visibleText(html))) return { kind: "challenge" };
  if (/运单信息/.test(html)) return { kind: "not_found" };
  return { kind: "parser_failure" };
}

function parseBlock(block: string, number: string): ForwarderDocument {
  const danhaoHtml = /<div class="danhao">([\s\S]*?)<\/div>/i.exec(block)?.[1] ?? "";
  const danhao = visibleText(danhaoHtml);
  const brackets = [...danhao.matchAll(/【\s*([A-Za-z0-9-]{4,40})\s*】/g)].map((match) => match[1] ?? "");
  let shownNorm = "";
  for (const bracket of brackets) {
    try {
      if (normalizeTrackingNumber(bracket) === number) {
        shownNorm = number;
        break;
      }
    } catch {
      return { kind: "parser_failure" };
    }
  }
  if (!shownNorm && brackets.length > 0) return { kind: "parser_failure" };
  const piecesMatch = /件数:\s*【\s*(\d{1,6})\s*】/.exec(danhao);
  const pieces = piecesMatch?.[1] ?? null;

  const uls = [...block.matchAll(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi)].map((match) => listItems(match[1] ?? ""));
  const labelUl = uls.find((items) => items.some((item) => item.text === "参考号" || item.text === "最新状态"));
  const valueUl = uls.find((items) => items.length > 0 && items.every((item) => !item.className.includes("abc")));
  const labels = labelUl?.map((item) => item.text) ?? [];
  const values = valueUl?.map((item) => item.text) ?? [];
  const fields = new Map<string, string>();
  const blocked = new Set<string>();
  let displayName: string | null = null;
  for (let index = 0; index < Math.min(labels.length, values.length); index += 1) {
    const label = labels[index] ?? "";
    const value = values[index] ?? "";
    if (!label) continue;
    if (DROPPED_LABELS.has(label)) {
      if (label === "收件人") displayName = recipientDisplayName(value);
      if (value) blocked.add(value);
      continue;
    }
    fields.set(label, value);
  }

  const reference = safeCode(fields.get("参考号") ?? "");
  const tracked = fields.get("跟踪号码") ?? "";
  if (tracked) {
    try {
      if (normalizeTrackingNumber(tracked) !== number) return { kind: "parser_failure" };
    } catch {
      return { kind: "parser_failure" };
    }
  }
  const destination = safePlace(fields.get("目的地") ?? "");
  const localTime = fields.get("当地时间") ?? "";
  if (localTime && !TIME.test(localTime)) return { kind: "parser_failure" };
  const summaryStatus = scrub(fields.get("最新状态") ?? "", blocked, number);

  const table = /<table\b[^>]*>([\s\S]*?)<\/table>/i.exec(block)?.[1] ?? "";
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const events: ForwarderEvent[] = [];
  for (const row of rows) {
    const cells = [...(row[1] ?? "").matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => visibleText(cell[1] ?? ""));
    if (cells.length === 0) continue;
    if (cells[0] === "日期") continue;
    if (cells.length !== 3) return { kind: "parser_failure" };
    const time = cells[0] ?? "";
    const location = scrub(cells[1] ?? "", blocked, number);
    const description = scrub(cells[2] ?? "", blocked, number);
    if (!time && !description) continue;
    if (!TIME.test(time) || !description) return { kind: "parser_failure" };
    events.push({ time, location, description });
  }

  if (!shownNorm && events.length === 0 && !summaryStatus) return { kind: "not_found" };
  if (!shownNorm || events.length === 0) return { kind: "parser_failure" };
  const status = summaryStatus || events[0]?.description;
  if (!status) return { kind: "parser_failure" };
  return {
    kind: "ready",
    reference,
    pieces,
    destination,
    status,
    displayName,
    events,
  };
}

type FetchAttempt = ForwarderDocument;

async function readBounded(response: Response): Promise<Uint8Array | null> {
  const reader = response.body?.getReader();
  if (!reader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    return bytes.byteLength > MAX_BYTES ? null : bytes;
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const step = await reader.read();
    if (step.done) break;
    total += step.value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(step.value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function attempt(number: string): Promise<FetchAttempt> {
  const started = Date.now();
  let response: Response;
  try {
    response = await fetch(FORWARDER_SOURCE_URL, {
      method: "POST",
      redirect: "error",
      cache: "no-store",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "text/html",
        "user-agent": "sourcing-center/1.0",
      },
      body: new URLSearchParams({ documentCode: number }).toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") return { kind: "timeout" };
    return { kind: "challenge" };
  }
  writeProviderLog({
    shipmentId: null,
    carrierId: FORWARDER_CARRIER_ID,
    outcome: "forwarder",
    httpStatus: response.status,
    durationMs: Date.now() - started,
    errorKind: response.ok ? "http" : `http_${response.status}`,
    now: new Date(),
  });
  if (response.status === 429) return { kind: "throttled" };
  if (response.status === 401 || response.status === 403) return { kind: "challenge" };
  if (!response.ok) return { kind: "parser_failure" };
  const type = response.headers.get("content-type") ?? "";
  if (!/text\/html|application\/xhtml\+xml/i.test(type)) return { kind: "parser_failure" };
  const bytes = await readBounded(response);
  if (!bytes) return { kind: "parser_failure" };
  return readForwarderBody(bytes, type, number);
}

/** One public form POST, plus a single retry when the first attempt times out. */
export async function fetchForwarderDocument(number: string, now: Date): Promise<ForwarderDocument> {
  if (!claimForwarderRequest(now)) return { kind: "throttled" };
  const first = await attempt(number);
  if (first.kind !== "timeout") return first;
  if (!claimForwarderRequest(now)) return first;
  return attempt(number);
}

export function forwarderMessage(kind: Exclude<ForwarderDocument["kind"], "ready" | "not_found">): string {
  if (kind === "timeout") return MSG.forwarderTimeout;
  if (kind === "challenge") return MSG.forwarderChallenge;
  if (kind === "throttled") return MSG.forwarderThrottled;
  return MSG.forwarderUnusable;
}
