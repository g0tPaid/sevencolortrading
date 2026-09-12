"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type WhatsAppContextValue = {
  message?: string;
  setMessage: (message?: string) => void;
};

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | undefined>();
  const value = useMemo(() => ({ message, setMessage }), [message]);
  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>;
}

export function useWhatsAppPrefill() {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) {
    return { message: undefined, setMessage: () => undefined };
  }
  return ctx;
}
