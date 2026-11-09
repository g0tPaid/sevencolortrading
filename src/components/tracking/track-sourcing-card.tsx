import Image from "next/image";
import { TrackFlagBanner } from "@/components/tracking/track-flag-banner";
import { TRACK_HOME_HREF, TRACK_HOME_LABEL } from "@/lib/tracking/sourcing-card";

const BANNER_ALT =
  "sourcing.center banner. Buy Anything from China. God Bless China for Making Life Affordable for Everyday People. Verified factories, no minimum order, photo and video quality control, Xiamen and Dubai warehouses. Start sourcing today. Source, inspect, and ship worldwide.";

/** Idle ad under Search. Hidden while a lookup promo or result is on screen. */
export function TrackSourcingCard() {
  return (
    <>
    <section data-testid="track-sourcing-card" aria-label="Sourcing" className="mt-3 rounded-[1.75rem] border border-line bg-paper px-3 pb-3 pt-3 shadow-[0_18px_40px_-28px_rgba(227,28,35,0.4)] sm:px-4 sm:pb-4">
      <Image
        src="/tracking/sourcing-center-ad-banner.webp"
        alt={BANNER_ALT}
        width={1774}
        height={887}
        data-testid="track-ad-banner"
        unoptimized
        sizes="(min-width: 640px) 36rem, 100vw"
        className="track-ad-banner block h-auto w-full"
        style={{ width: "100%", height: "auto" }}
      />
      <a
        href={TRACK_HOME_HREF}
        data-testid="track-home-link"
        className="track-home-link mt-3 inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-2xl px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d60000] focus-visible:ring-offset-2"
      >
        {TRACK_HOME_LABEL}
      </a>
      <style>{`
        .track-ad-banner { max-width: 100%; height: auto; }
        .track-home-link {
          background: #d60000;
          color: #fff;
          font-family: var(--font-fraunces), var(--font-playfair), "Times New Roman", Georgia, serif;
          font-size: 1.2rem;
          font-weight: 650;
          letter-spacing: -0.03em;
          box-shadow: inset 0 -3px 0 #8d0000;
          transition: transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 180ms ease;
        }
        .track-home-link:hover { transform: translateY(-2px); }
        .track-home-link:active { transform: translateY(0) scale(0.98); }
        @media (prefers-reduced-motion: reduce) {
          .track-home-link { animation: none; transition: none; }
          .track-home-link:hover,
          .track-home-link:active { transform: none; }
        }
      `}</style>
    </section>
    <TrackFlagBanner />
    </>
  );
}
