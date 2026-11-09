"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { SevenColorMark } from "@/components/brand/seven-color-mark";
import { SOURCING_OFFERS, type SourcingOfferId } from "@/lib/tracking/sourcing-card";

/** Idle card under Search. Hidden while a lookup promo or result is on screen. */
export function TrackSourcingCard() {
  const [selected, setSelected] = useState<SourcingOfferId>("goods");
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function choose(index: number) {
    const next = SOURCING_OFFERS[(index + SOURCING_OFFERS.length) % SOURCING_OFFERS.length];
    setSelected(next.id);
    buttons.current[SOURCING_OFFERS.indexOf(next)]?.focus();
  }

  return (
    <section
      data-testid="track-sourcing-card"
      aria-labelledby="track-sourcing-title"
      className="mt-4 overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_18px_40px_-28px_rgba(227,28,35,0.4)]"
    >
      <div className="flex items-center justify-between gap-3 bg-[#fff4f0] px-4 py-3">
        <p aria-hidden className="inline-flex min-w-0 items-center gap-2">
          <SevenColorMark size={28} title="" />
          <span className="font-logo truncate text-[1.02rem] font-bold tracking-[-0.03em]">
            <span className="text-ink">sourc</span>
            <span className="relative inline-block text-ink">
              ı
              <span className="absolute left-1/2 top-[0.08em] h-[0.18em] w-[0.18em] -translate-x-1/2 rounded-full bg-[#E31C23]" />
            </span>
            <span className="text-ink">ng</span>
            <span className="text-[#E31C23]">.center</span>
          </span>
        </p>
        <Image
          src="/tracking/sourcing-center-plane.png"
          alt=""
          width={92}
          height={48}
          className="track-source-plane h-auto w-[4.6rem] shrink-0"
          unoptimized
        />
      </div>
      <div className="px-4 pb-4 pt-3 sm:px-5">
        <h2 id="track-sourcing-title" className="font-display text-[1.65rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-[1.85rem]">
          Buy anything from China
          <span className="mt-2 block h-[3px] w-16 rounded-full bg-[#d60000]" aria-hidden />
        </h2>
        <div role="radiogroup" aria-label="What to source" className="mt-4 grid grid-cols-3 gap-2">
          {SOURCING_OFFERS.map((item, index) => {
            const active = item.id === selected;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                data-testid={`track-sourcing-${item.id}`}
                onClick={() => setSelected(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault();
                    choose(index + 1);
                  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault();
                    choose(index - 1);
                  }
                }}
                className={`track-source-pick flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 text-center text-[11px] font-semibold leading-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d60000] focus-visible:ring-offset-2 sm:min-h-[4.5rem] sm:text-xs ${
                  active ? "border-[#d60000] bg-[#fff4f0]" : "border-line bg-paper"
                }`}
              >
                <OfferIcon id={item.id} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .track-source-pick { transition: transform 180ms cubic-bezier(0.34, 1.4, 0.64, 1), border-color 180ms ease, background-color 180ms ease; }
        .track-source-pick:hover { transform: translateY(-2px); }
        .track-source-pick:active { transform: translateY(0) scale(0.98); }
        .track-source-plane { animation: track-source-plane 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes track-source-plane {
          from { transform: translateX(8px); }
          to { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-source-pick,
          .track-source-plane { animation: none; transition: none; }
          .track-source-pick:hover,
          .track-source-pick:active { transform: none; }
        }
      `}</style>
    </section>
  );
}

function OfferIcon({ id }: { id: SourcingOfferId }) {
  if (id === "home") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <path d="M6 12h16L18 6H10z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 12v7" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="8" y="19" width="12" height="3.5" rx="1.7" fill="#d60000" stroke="#1d1d1f" strokeWidth="1.4" />
      </svg>
    );
  }
  if (id === "label") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <path d="M6 8h10l6 6-8 8-8-8V8z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="11" cy="13" r="1.6" fill="#d60000" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <rect x="5" y="10" width="16" height="11" rx="3" fill="#fff" stroke="#1d1d1f" strokeWidth="1.8" />
      <rect x="4" y="7" width="18" height="5" rx="2" fill="#fff" stroke="#1d1d1f" strokeWidth="1.8" />
      <rect x="11.5" y="7" width="3" height="14" fill="#d60000" />
    </svg>
  );
}
