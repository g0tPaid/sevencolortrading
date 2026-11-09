import { dropshipShipmentId, readProof } from "@/lib/tracking/dropship-proof";

export async function GET(request: Request, { params }: { params: Promise<{ token: string; media: string }> }) {
  const { token, media } = await params;
  const shipmentId = dropshipShipmentId(token);
  const file = shipmentId && readProof(shipmentId, media);
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  });
  if (!file) return new Response(null, { status: 404, headers });

  const size = file.bytes.byteLength;
  headers.set("Content-Type", file.mime);
  headers.set("Accept-Ranges", "bytes");
  const range = request.headers.get("range");
  if (!range) {
    headers.set("Content-Length", String(size));
    return new Response(Uint8Array.from(file.bytes), { headers });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  const start = match?.[1] ? Number(match[1]) : Math.max(0, size - Number(match?.[2]));
  const end = match?.[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (!match || !Number.isSafeInteger(start) || start > end) {
    headers.set("Content-Range", "bytes */" + size);
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", "bytes " + start + "-" + end + "/" + size);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(Uint8Array.from(file.bytes.subarray(start, end + 1)), { status: 206, headers });
}
