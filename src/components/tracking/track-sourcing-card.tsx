import Image from "next/image";
import { TRACK_AD_LINE, TRACK_HOME_HREF, TRACK_HOME_LABEL } from "@/lib/tracking/sourcing-card";

/** Idle link and ad under Search. Hidden while a lookup promo or result is on screen. */
export function TrackSourcingCard() {
  return (
    <div data-testid="track-sourcing-card" className="mt-4">
      <a
        href={TRACK_HOME_HREF}
        data-testid="track-home-link"
        className="track-home-link inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d60000]/40 bg-[#fff4f0] px-5 text-base font-semibold tracking-[-0.02em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d60000] focus-visible:ring-offset-2"
      >
        {TRACK_HOME_LABEL}
      </a>
      <section
        aria-labelledby="track-sourcing-title"
        className="mt-4 rounded-[1.75rem] border border-line bg-paper px-5 py-6 text-center shadow-[0_18px_40px_-28px_rgba(227,28,35,0.4)]"
      >
        <Image
          src="/tracking/sourcing-center-plane.png"
          alt=""
          width={280}
          height={146}
          className="track-ad-plane mx-auto h-auto w-48 sm:w-56"
          unoptimized
        />
        <h2
          id="track-sourcing-title"
          className="track-ad-line mt-3 font-display text-[1.7rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-[1.95rem]"
        >
          {TRACK_AD_LINE}
        </h2>
      </section>
      <style>{`
        .track-home-link { transition: transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 180ms ease; }
        .track-home-link:hover { transform: translateY(-2px); background-color: #fff; }
        .track-home-link:active { transform: translateY(0) scale(0.98); }
        .track-ad-line {
          font-family: var(--font-fraunces), var(--font-playfair), "Times New Roman", Georgia, serif;
          font-variation-settings: "SOFT" 40, "opsz" 96, "WONK" 1;
        }
        .track-ad-plane {
          animation: track-ad-plane 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
          filter: drop-shadow(0 10px 14px rgba(29, 29, 31, 0.12));
        }
        @keyframes track-ad-plane {
          from { transform: translateY(8px); }
          to { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-home-link,
          .track-ad-plane { animation: none; transition: none; }
          .track-home-link:hover,
          .track-home-link:active,
          .track-ad-plane { transform: none; }
        }
      `}</style>
    </div>
  );
}
