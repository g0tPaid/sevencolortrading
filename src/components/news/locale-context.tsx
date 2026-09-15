"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { pickNews, type NewsLang } from "@/lib/news";

const STORAGE_KEY = "sc_news_lang";

type NewsUiContextValue = {
  lang: NewsLang;
  setLang: (lang: NewsLang) => void;
  t: (copy: { en: string; zh: string }) => string;
};

const NewsUiContext = createContext<NewsUiContextValue | null>(null);

function readStoredLang(): NewsLang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en") return stored;
  } catch {
    // storage may be blocked
  }
  return "en";
}

export function NewsLocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<NewsLang>("en");

  useEffect(() => {
    const stored = readStoredLang();
    if (stored !== "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: NewsLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<NewsUiContextValue>(
    () => ({
      lang,
      setLang,
      t: (copy) => pickNews(copy, lang),
    }),
    [lang, setLang],
  );

  return <NewsUiContext.Provider value={value}>{children}</NewsUiContext.Provider>;
}

export function useNewsUi() {
  const ctx = useContext(NewsUiContext);
  if (!ctx) {
    throw new Error("useNewsUi must be used within NewsLocaleProvider");
  }
  return ctx;
}
