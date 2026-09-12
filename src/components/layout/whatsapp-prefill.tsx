"use client";

import { useEffect } from "react";
import { useWhatsAppPrefill } from "@/components/layout/whatsapp-context";

/** Sets the marketing float's default WhatsApp text while this page is mounted. */
export function WhatsAppPrefill({ message }: { message: string }) {
  const { setMessage } = useWhatsAppPrefill();

  useEffect(() => {
    setMessage(message);
    return () => setMessage(undefined);
  }, [message, setMessage]);

  return null;
}
