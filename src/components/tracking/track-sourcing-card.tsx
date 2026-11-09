import Image from "next/image";
import Link from "next/link";
import { TRACK_HOME_HREF, TRACK_HOME_LABEL, TRACK_SOURCES } from "@/lib/tracking/sourcing-card";

const BANNER_ALT =
  "sourcing.center banner. Buy Anything from China. God Bless China for Making Life Affordable for Everyday People. Verified factories, no minimum order, photo and video quality control, Xiamen and Dubai warehouses. Start sourcing today. Source, inspect, and ship worldwide.";

/** Idle ad under Search. Hidden while a lookup promo or result is on screen. */
export function TrackSourcingCard() {
  return (
    <section data-testid="track-sourcing-card" aria-label="Sourcing" className="mt-4 rounded-[1.75rem] border border-line bg-paper px-3 pb-3 pt-3 shadow-[0_18px_40px_-28px_rgba(227,28,35,0.4)] sm:px-4 sm:pb-4">
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
        className="track-home-link mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d60000]/40 bg-[#fff4f0] px-5 text-base font-semibold tracking-[-0.02em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d60000] focus-visible:ring-offset-2"
      >
        {TRACK_HOME_LABEL}
      </a>
      <div className="mt-3 grid gap-2">
        {TRACK_SOURCES.map((source) => (
          <Link
            key={source.id}
            href={source.href}
            data-testid={`track-buy-${source.id}`}
            className={`track-buy track-buy-${source.id}`}
          >
            {source.logo ? (
              <Image
                src={source.logo}
                alt=""
                width={source.logoWidth}
                height={source.logoHeight}
                unoptimized
                className={`track-buy-logo track-buy-logo-${source.id}`}
                style={{
                  height: source.id === "xianyu" ? "2.15rem" : "1.9rem",
                  width: "auto",
                  maxWidth: "4rem",
                }}
              />
            ) : (
              <FactoryMark />
            )}
            <span>{source.label}</span>
          </Link>
        ))}
      </div>
      <style>{`
        .track-ad-banner { max-width: 100%; height: auto; }
        .track-home-link,
        .track-buy { transition: transform 200ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 180ms ease; }
        .track-home-link:hover,
        .track-buy:hover { transform: translateY(-2px); }
        .track-home-link:active,
        .track-buy:active { transform: translateY(0) scale(0.98); }
        .track-buy {
          position: relative;
          display: flex;
          min-height: 3.6rem;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          padding: 0.55rem 4.4rem;
          text-align: center;
          font-family: var(--font-fraunces), var(--font-playfair), "Times New Roman", Georgia, serif;
          font-size: 1.2rem;
          font-weight: 650;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: #1d1d1f;
          text-decoration: none;
        }
        .track-buy:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--canvas), 0 0 0 4px #1d1d1f; }
        .track-buy-1688 { background: #ff4000; }
        .track-buy-xianyu { background: #ffe60f; }
        .track-buy-factories { background: #fff7f4; border: 1px solid rgba(29, 29, 31, 0.12); }
        .track-buy-logo,
        .track-buy-mark {
          position: absolute;
          left: 1.05rem;
          top: 50%;
          height: 1.9rem;
          width: auto;
          transform: translateY(-50%);
        }
        .track-buy-logo-1688,
        .track-buy-mark { width: 1.9rem; }
        .track-buy-logo-xianyu { height: 2.35rem; width: auto; }
        @media (prefers-reduced-motion: reduce) {
          .track-home-link,
          .track-buy { animation: none; transition: none; }
          .track-home-link:hover,
          .track-home-link:active,
          .track-buy:hover,
          .track-buy:active { transform: none; }
        }
      `}</style>
    </section>
  );
}

function FactoryMark() {
  return (
    <svg className="track-buy-mark" viewBox="0 0 32 32" aria-hidden>
      <path d="M4 27h24" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 27V16h9v11" fill="#fff" stroke="#1d1d1f" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M15 27V14l9 3v10" fill="#fff" stroke="#1d1d1f" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6 16l2.2-3.2L10.4 16l2.2-3.2L14.8 16" fill="none" stroke="#1d1d1f" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M23 14V8h3v8" fill="#fff" stroke="#1d1d1f" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M23.2 8c.4-2.2 3.2-2.2 3.6 0" fill="none" stroke="#d60000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.2 20.2h2.4v2.4H8.2zm5.6 0h2.4v2.4h-2.4z" fill="#d60000" />
    </svg>
  );
}
