"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP = "8618059262730";
const MESSAGE = encodeURIComponent(
  "Hi Seven Color — I'd like help sourcing from China via Sourcing Center.",
);

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(37,211,102,0.45)] transition hover:scale-[1.03] hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="pr-0.5">WhatsApp</span>
    </a>
  );
}
