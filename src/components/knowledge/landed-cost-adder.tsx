"use client";

import { useMemo, useState } from "react";

function money(value: string): number {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function LandedCostAdder() {
  const [exw, setExw] = useState("");
  const [qty, setQty] = useState("500");
  const [inland, setInland] = useState("");
  const [days, setDays] = useState("1");
  const [freight, setFreight] = useState("");
  const [destination, setDestination] = useState("");

  const total = useMemo(() => {
    const units = Math.max(0, money(qty));
    const goods = money(exw) * units;
    const inspection = Math.max(0, money(days)) * 110;
    return goods + money(inland) + inspection + money(freight) + money(destination);
  }, [destination, days, exw, freight, inland, qty]);

  return (
    <div className="glass-card mt-6 rounded-[1.5rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Illustrative adder
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Add the numbers you already have. This is not a duty, VAT, or HS-code table. Inspection uses
        the published rate of USD 110 per inspector day. Everything else is your input.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          ["EXW / FOB unit (USD)", exw, setExw],
          ["Quantity", qty, setQty],
          ["Inland to warehouse (USD)", inland, setInland],
          ["Inspector days", days, setDays],
          ["International freight (USD)", freight, setFreight],
          ["Your destination fees (USD)", destination, setDestination],
        ].map(([label, value, setter]) => (
          <label key={String(label)} className="block text-sm">
            <span className="mb-1.5 block text-muted">{label}</span>
            <input
              value={String(value)}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              inputMode="decimal"
              className="glass-input w-full rounded-2xl px-4 py-3 text-ink outline-none"
            />
          </label>
        ))}
      </div>
      <p className="mt-5 font-display text-2xl font-semibold text-ink">
        Working total: USD {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      <p className="mt-2 text-xs text-muted">
        Confirm the real quote on the RFQ. We do not publish a sourcing commission percentage or a
        general freight tariff on this site.
      </p>
    </div>
  );
}
