import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { isValidNewsSlug, normalizeNewsPost, listNews, upsertNewsPost } from "@/lib/news-store";
import type { NewsPost } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() ?? "";
}

function safeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

async function authorizePublish(
  request: Request,
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const secret = process.env.NEWS_PUBLISH_SECRET?.trim() ?? "";
  if (secret) {
    const presented =
      request.headers.get("x-news-publish-secret")?.trim() || bearerToken(request);
    if (presented && safeEqualString(presented, secret)) {
      return { ok: true };
    }
  }

  const admin = await requireAdminSession(request);
  if (admin.ok) return { ok: true };
  return { ok: false, response: admin.response };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug")?.trim() ?? "";
  const posts = await listNews();

  if (slug) {
    if (!isValidNewsSlug(slug)) {
      return NextResponse.json({ ok: false, error: "Invalid slug" }, { status: 400 });
    }
    const post = posts.find((item) => item.slug === slug);
    if (!post) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { post },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { posts },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function asPostList(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.posts)) return record.posts;
    if (record.post && typeof record.post === "object") return [record.post];
    if (typeof record.slug === "string") return [record];
  }
  return [];
}

export async function POST(request: Request) {
  const auth = await authorizePublish(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const candidates = asPostList(body);
  if (candidates.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Expected a news post object or { posts: [...] }" },
      { status: 400 },
    );
  }
  if (candidates.length > 20) {
    return NextResponse.json({ ok: false, error: "Too many posts in one request" }, { status: 400 });
  }

  const saved: NewsPost[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  for (let i = 0; i < candidates.length; i += 1) {
    const normalized = normalizeNewsPost(candidates[i]);
    if (!normalized) {
      errors.push({
        index: i,
        error:
          "Invalid post: need slug, date, bilingual title/summary/takeaway, sourceName, sourceUrl",
      });
      continue;
    }
    try {
      saved.push(await upsertNewsPost(normalized));
    } catch (error) {
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : "Could not save post",
      });
    }
  }

  if (saved.length === 0) {
    return NextResponse.json(
      { ok: false, error: errors[0]?.error ?? "No posts saved", errors },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      posts: saved,
      errors: errors.length > 0 ? errors : undefined,
    },
    { status: errors.length > 0 ? 207 : 200, headers: { "Cache-Control": "no-store" } },
  );
}
