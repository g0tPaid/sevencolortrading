"use client";

import { useState } from "react";

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PROOF_FILES = 8;
export const MAX_PROOF_BYTES = 16 * 1024 * 1024;

export function ShipmentPhotoDropZone({ disabled, onPhotos }: {
  disabled: boolean;
  onPhotos: (files: File[]) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      role="group"
      aria-label="Drop or paste shipment photos"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`mt-3 rounded-xl border border-dashed px-4 py-5 text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent ${dragging ? "border-accent bg-accent/10" : "border-line"} ${disabled ? "opacity-50" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const files = Array.from(event.dataTransfer.files);
        if (!disabled && files.length) onPhotos(files);
      }}
      onPaste={(event) => {
        const files = Array.from(event.clipboardData.files);
        if (!files.length) return;
        event.preventDefault();
        if (!disabled) onPhotos(files);
      }}
    >
      <p className="font-semibold text-ink">Drag and drop photos here</p>
      <p className="mt-1 text-muted">Or click this box and press Ctrl+V (⌘+V on Mac) to paste a copied image.</p>
    </div>
  );
}
