import { adminGuard } from "@/lib/tracking/service";
import { getShipment } from "@/lib/tracking/store";
import { addProof, issueDropshipLink, listProof, MAX_PROOF_BYTES, readProof, removeProof, revokeDropshipLink } from "@/lib/tracking/dropship-proof";
import { proofMediaResponse } from "@/lib/tracking/media-response";
import { json } from "@/lib/tracking/http";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const auth = await adminGuard(request, false);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!getShipment(id)) return json({ error: "Shipment not found" }, 404);
  const media = new URL(request.url).searchParams.get("media");
  if (media) return proofMediaResponse(request, readProof(id, media));
  return json({ media: listProof(id) });
}

export async function POST(request: Request, { params }: Context) {
  const auth = await adminGuard(request, true);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!getShipment(id)) return json({ error: "Shipment not found" }, 404);
  const query = new URL(request.url).searchParams;
  switch (query.get("action")) {
    case "issue":
      return json({ path: issueDropshipLink(id) });
    case "revoke":
      revokeDropshipLink(id);
      return json({ ok: true });
    case "remove":
      removeProof(id, query.get("media") ?? "");
      return json({ media: listProof(id) });
    case "upload": {
      const reader = request.body?.getReader();
      if (!reader) return json({ error: "Select a file to upload" }, 400);
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_PROOF_BYTES) {
          await reader.cancel();
          return json({ error: "The file exceeds 16 MB" }, 413);
        }
        chunks.push(value);
      }
      if (!addProof(id, Buffer.concat(chunks, size))) {
        return json({ error: "Use JPEG, PNG, WebP, or MP4. Each shipment can hold up to eight files." }, 400);
      }
      return json({ media: listProof(id) });
    }
    default:
      return json({ error: "Unknown action" }, 400);
  }
}
