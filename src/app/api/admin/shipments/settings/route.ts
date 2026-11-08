import { errorResponse, json, readJson } from "@/lib/tracking/http";
import { adminGuard, readSettingsResponse, writeSettings } from "@/lib/tracking/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await adminGuard(request, false);
  if (!auth.ok) return auth.response;
  return json(readSettingsResponse());
}

export async function PUT(request: Request) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  try {
    const body = await readJson(request, 20_000);
    const settings = writeSettings(body);
    return json({ ok: true, settings });
  } catch (error) {
    return errorResponse(error);
  }
}
