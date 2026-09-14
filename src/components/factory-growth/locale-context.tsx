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
import {
  isPackageId,
  pick,
  type Bilingual,
  type GrowthLang,
  type PackageId,
} from "@/lib/factory-growth";

const STORAGE_KEY = "sc_factory_growth_lang";

type GrowthUiContextValue = {
  lang: GrowthLang;
  setLang: (lang: GrowthLang) => void;
  packageId: PackageId;
  setPackageId: (id: PackageId) => void;
  t: (copy: Bilingual) => string;
};

const GrowthUiContext = createContext<GrowthUiContextValue | null>(null);

function readStoredLang(): GrowthLang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en") return stored;
  } catch {
    // storage may be blocked
  }
  return "en";
}

export function FactoryGrowthProvider({
  children,
  initialPackage,
}: {
  children: ReactNode;
  initialPackage?: PackageId;
}) {
  const [lang, setLangState] = useState<GrowthLang>("en");
  const [packageId, setPackageId] = useState<PackageId>(
    initialPackage && isPackageId(initialPackage) ? initialPackage : "unsure",
  );

  useEffect(() => {
    const stored = readStoredLang();
    if (stored !== "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: GrowthLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<GrowthUiContextValue>(
    () => ({
      lang,
      setLang,
      packageId,
      setPackageId,
      t: (copy: Bilingual) => pick(copy, lang),
    }),
    [lang, packageId, setLang],
  );

  return <GrowthUiContext.Provider value={value}>{children}</GrowthUiContext.Provider>;
}

export function useFactoryGrowthUi() {
  const ctx = useContext(GrowthUiContext);
  if (!ctx) {
    throw new Error("useFactoryGrowthUi must be used within FactoryGrowthProvider");
  }
  return ctx;
}
