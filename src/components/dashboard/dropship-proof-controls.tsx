"use client";

import { useEffect, useState } from "react";
import { MAX_PROOF_BYTES, MAX_PROOF_FILES, PHOTO_TYPES, ShipmentPhotoDropZone } from "@/components/dashboard/shipment-photo-drop-zone";

type Media = { id: string; mime: string };

export function DropshipProofControls({ shipmentId }: { shipmentId: string }) {
  const endpoint = "/api/admin/shipments/" + encodeURIComponent(shipmentId) + "/proof";
  const [media, setMedia] = useState<Media[]>([]);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        setMedia((await response.json()).media);
      })
      .catch(() => {
        if (!controller.signal.aborted) setMessage("Could not load pre-shipment files.");
      });
    return () => controller.abort();
  }, [endpoint]);

  async function update(action: string, mediaId?: string) {
    setBusy(true);
    setMessage("");
    try {
      const query = new URLSearchParams({ action });
      if (mediaId) query.set("media", mediaId);
      const response = await fetch(endpoint + "?" + query, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update shipment.");
      if (result.media) setMedia(result.media);
      if (result.path) {
        setLink(window.location.origin + result.path);
        setMessage("Share this link privately with the dropshipper. Any previous link is now disabled.");
      }
      if (action === "revoke") {
        setLink("");
        setMessage("The customer link is disabled.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update shipment.");
    } finally {
      setBusy(false);
    }
  }

  async function upload(files: File[], allowVideo = false) {
    if (busy || !files.length) return;
    if (media.length + files.length > MAX_PROOF_FILES || files.some((file) =>
      !(PHOTO_TYPES.includes(file.type) || (allowVideo && file.type === "video/mp4")) ||
      !file.size || file.size > MAX_PROOF_BYTES
    )) {
      setMessage(`Use JPEG, PNG, WebP${allowVideo ? ", or MP4" : ""}. Up to eight files per shipment, 16 MB each.`);
      return;
    }
    setBusy(true);
    setMessage("");
    let uploaded = 0;
    try {
      for (const file of files) {
        const response = await fetch(endpoint + "?action=upload", { method: "POST", body: file });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not upload file.");
        setMedia(result.media);
        uploaded += 1;
      }
      setMessage(`Uploaded ${uploaded} file(s).`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Could not upload file.";
      setMessage(uploaded ? `Uploaded ${uploaded} of ${files.length} files. ${reason}` : reason);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-ink/10 p-4">
      <h3 className="font-semibold">Dropshipper order link</h3>
      <p className="mt-1 text-sm text-muted">New uploads appear automatically for anyone with the tracking number once there are at least two photos. Keep addresses, shipping labels, and personal details out of uploads. Up to eight files, 16 MB each.</p>
      <label className="mt-3 block text-sm">
        Add pre-shipment photo or video
        <input className="mt-1 block max-w-full" type="file" accept="image/jpeg,image/png,image/webp,video/mp4" disabled={busy}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void upload([file], true);
          }} />
      </label>
      <ShipmentPhotoDropZone disabled={busy} onPhotos={(files) => void upload(files)} />
      <ul className="mt-2 space-y-2">
        {media.map((item, index) => (
          <li key={item.id} className="flex gap-3 text-sm">
            {item.mime.startsWith("video/") ? "Video" : "Photo"} {index + 1}
            <button type="button" className="underline" disabled={busy} onClick={() => void update("remove", item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <button type="button" className="font-semibold underline" disabled={busy} onClick={() => void update("issue")}>Generate new private link</button>
        <button type="button" className="underline" disabled={busy} onClick={() => void update("revoke")}>Disable link</button>
      </div>
      {link && <input className="mt-3 w-full rounded border p-2 text-sm" aria-label="Private customer link" value={link} readOnly onFocus={(event) => event.currentTarget.select()} />}
      {message && <p role="status" className="mt-2 text-sm">{message}</p>}
    </section>
  );
}
