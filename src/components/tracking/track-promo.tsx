import type { CSSProperties } from "react";
import Image from "next/image";
import { SevenColorMark } from "@/components/brand/seven-color-mark";
import {
  PROMO_BRIDGE,
  PROMO_COPY,
  PROMO_HEADLINE,
  PROMO_HOST,
  PROMO_HREF,
  PROMO_MOTION,
} from "@/lib/tracking/track-present";

const motion = PROMO_MOTION;

/**
 * House promotion shown while a valid search is held. The drawing is an
 * advertisement, not a parcel-progress meter. The airplane artwork is not
 * flipped or turned, so the wordmark stays readable.
 */
export function TrackPromo() {
  return (
    <>
      <aside
        data-testid="track-promo"
        data-promo={PROMO_COPY}
        role="status"
        aria-label={PROMO_COPY}
        className="track-promo-card relative mt-4 overflow-hidden rounded-[1.9rem] border border-line bg-paper shadow-[0_24px_50px_-28px_rgba(227,28,35,0.45)]"
      >
        <div className="track-promo-stage relative mx-3 mt-3 h-[188px] overflow-hidden rounded-[1.4rem] sm:mx-4 sm:mt-4 sm:h-[210px]" aria-hidden>
          <svg viewBox="0 0 640 230" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="track-promo-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff1ee" />
                <stop offset="55%" stopColor="#fff8f6" />
                <stop offset="100%" stopColor="#fff" />
              </linearGradient>
            </defs>
            <rect width="640" height="230" fill="url(#track-promo-sky)" />
            <Cloud className="track-promo-cloud" d="M48 62c0-16 14-26 30-22 6-14 26-18 36-6 14-8 32 2 30 16 16 2 22 20 8 28-18 10-86 12-104-16z" />
            <Cloud className="track-promo-cloud" d="M500 48c0-12 12-20 24-16 4-12 22-14 28-4 12-6 26 2 22 14 12 2 16 16 6 22-14 8-68 8-80-16z" />
            <ellipse cx="320" cy="198" rx="210" ry="26" fill="#ffe8e4" />
            <ellipse cx="320" cy="196" rx="150" ry="14" fill="#fff" opacity="0.7" />

            <g className="track-promo-streak" stroke="#E31C23" strokeLinecap="round" opacity="0.45">
              <path d="M150 58h34" strokeWidth="4" />
              <path d="M168 72h22" strokeWidth="3" />
              <path d="M184 44h18" strokeWidth="3" />
            </g>

            <g transform="translate(108 108)">
              <g className="track-promo-pop" style={pop(0)}>
                <Headphones />
              </g>
            </g>
            <g transform="translate(248 86)">
              <g className="track-promo-pop" style={pop(motion.assembleStaggerMs)}>
                <Parcel />
              </g>
            </g>
            <g transform="translate(470 102)">
              <g className="track-promo-pop" style={pop(motion.assembleStaggerMs * 2)}>
                <Lamp />
              </g>
            </g>

            <g className="track-promo-spark" style={{ animationDelay: `${motion.sheenDelayMs}ms` }} fill="#E31C23">
              <path d="M250 36l1.6 5.2 5.2 1.6-5.2 1.6-1.6 5.2-1.6-5.2-5.2-1.6 5.2-1.6z" />
              <path d="M430 78l1.2 4 4 1.2-4 1.2-1.2 4-1.2-4-4-1.2 4-1.2z" />
            </g>
          </svg>
          <span className="track-promo-plane">
            <Image
              src="/tracking/sourcing-center-plane.png"
              alt=""
              width={150}
              height={78}
              className="track-promo-plane-art"
              unoptimized
            />
          </span>
        </div>

        <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <p aria-hidden className="inline-flex items-center gap-2.5">
            <SevenColorMark size={32} title="" />
            <span className="font-logo text-[1.15rem] font-bold leading-none tracking-[-0.03em]">
              <span className="text-ink">sourc</span>
              <span className="relative inline-block text-ink">
                ı
                <span className="absolute left-1/2 top-[0.08em] h-[0.18em] w-[0.18em] -translate-x-1/2 rounded-full bg-[#E31C23]" />
              </span>
              <span className="text-ink">ng</span>
              <span className="text-[#E31C23]">.center</span>
            </span>
          </p>
          <p className="track-promo-headline mt-3 max-w-[16ch] font-display text-[2rem] font-semibold leading-[0.98] tracking-tight text-ink sm:max-w-none sm:text-[2.45rem]">
            {PROMO_HEADLINE}
            <span className="track-promo-rule" aria-hidden />
          </p>
          <p className="mt-2 text-[15px] text-ink-soft">
            {PROMO_BRIDGE}
            <a href={PROMO_HREF} className="font-semibold text-accent underline decoration-accent/35 underline-offset-[3px]">
              {PROMO_HOST}
            </a>
          </p>
        </div>
      </aside>
      <style>{promoCss()}</style>
    </>
  );
}

function pop(delay: number): CSSProperties {
  return { animationDelay: `${delay}ms` };
}

function Cloud({ d, className }: { d: string; className?: string }) {
  return <path className={className} d={d} fill="#fff" stroke="#1d1d1f" strokeWidth="2.5" strokeLinejoin="round" />;
}

function Headphones() {
  return (
    <g>
      <ellipse cx="46" cy="78" rx="34" ry="6" fill="rgba(29,29,31,0.12)" />
      <path d="M16 46c0-20 14-34 32-34s32 14 32 34" fill="none" stroke="#1d1d1f" strokeWidth="6" strokeLinecap="round" />
      <rect x="4" y="38" width="20" height="34" rx="10" fill="#fff" stroke="#1d1d1f" strokeWidth="3.2" />
      <rect x="70" y="38" width="20" height="34" rx="10" fill="#E31C23" stroke="#1d1d1f" strokeWidth="3.2" />
      <rect x="9" y="46" width="8" height="8" rx="4" fill="#fff" opacity="0.8" />
    </g>
  );
}

function Parcel() {
  return (
    <g>
      <ellipse cx="78" cy="118" rx="52" ry="8" fill="rgba(227,28,35,0.16)" />
      <rect x="28" y="46" width="100" height="66" rx="16" fill="#fff" stroke="#1d1d1f" strokeWidth="3.4" />
      <rect x="18" y="30" width="120" height="26" rx="12" fill="#fff" stroke="#1d1d1f" strokeWidth="3.4" />
      <rect x="70" y="30" width="16" height="82" rx="4" fill="#E31C23" />
      <rect x="18" y="68" width="120" height="14" fill="#E31C23" />
      <circle cx="78" cy="36" r="9" fill="#E31C23" stroke="#1d1d1f" strokeWidth="2.6" />
      <path d="M40 40h22" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
    </g>
  );
}

function Lamp() {
  return (
    <g>
      <ellipse cx="42" cy="96" rx="26" ry="5.5" fill="rgba(29,29,31,0.12)" />
      <path d="M10 40h64L62 12H22z" fill="#fff" stroke="#1d1d1f" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M42 40v32" stroke="#1d1d1f" strokeWidth="4" strokeLinecap="round" />
      <rect x="16" y="70" width="52" height="14" rx="7" fill="#E31C23" stroke="#1d1d1f" strokeWidth="3" />
      <circle cx="42" cy="28" r="4" fill="#E31C23" />
    </g>
  );
}

function promoCss(): string {
  return `
    .track-promo-card { animation: track-promo-enter ${motion.enterMs}ms cubic-bezier(0.16, 1, 0.3, 1) both; }
    .track-promo-stage { background: #fff6f3; }
    .track-promo-pop {
      transform-box: fill-box;
      transform-origin: center;
      animation: track-promo-pop ${motion.assembleMs}ms cubic-bezier(0.34, 1.35, 0.64, 1) both;
    }
    .track-promo-spark {
      transform-box: fill-box;
      transform-origin: center;
      animation: track-promo-spark ${motion.sheenMs}ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .track-promo-streak {
      transform-box: fill-box;
      transform-origin: right center;
      animation: track-promo-streak 720ms ease 280ms both;
    }
    .track-promo-plane {
      position: absolute;
      top: 6px;
      left: 4%;
      z-index: 2;
      animation: track-promo-fly ${motion.flyMs}ms cubic-bezier(0.22, 0.8, 0.24, 1) both;
      filter: drop-shadow(0 10px 12px rgba(29, 29, 31, 0.16));
    }
    .track-promo-plane-art { display: block; width: 132px; height: auto; }
    .track-promo-rule {
      display: block;
      width: 4.75rem;
      height: 3px;
      margin-top: 0.7rem;
      border-radius: 999px;
      background: var(--accent);
      transform-origin: left center;
      animation: track-promo-rule 680ms cubic-bezier(0.16, 1, 0.3, 1) 180ms both;
    }
    @keyframes track-promo-rule {
      from { transform: scaleX(0); }
      to { transform: none; }
    }
    @keyframes track-promo-enter {
      from { opacity: 0; transform: translateY(12px) scale(0.985); }
      to { opacity: 1; transform: none; }
    }
    @keyframes track-promo-pop {
      0% { opacity: 0; transform: translateY(16px) scale(0.72, 0.55); }
      62% { opacity: 1; transform: translateY(-2px) scale(1.06, 0.96); }
      100% { opacity: 1; transform: none; }
    }
    @keyframes track-promo-spark {
      from { opacity: 0; transform: scale(0.3); }
      to { opacity: 1; transform: none; }
    }
    @keyframes track-promo-streak {
      from { opacity: 0; transform: scaleX(0.2); }
      to { opacity: 0.7; transform: none; }
    }
    @keyframes track-promo-fly {
      0% { left: -18%; top: 22px; }
      100% { left: 34%; top: 4px; }
    }
    @media (max-width: 639px) {
      .track-promo-plane-art { width: 118px; }
      @keyframes track-promo-fly {
        0% { left: -28%; top: 18px; }
        100% { left: 22%; top: 4px; }
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .track-promo-card,
      .track-promo-pop,
      .track-promo-spark,
      .track-promo-streak,
      .track-promo-plane,
      .track-promo-rule { animation: none; }
      .track-promo-rule { transform: none; }
      .track-promo-pop,
      .track-promo-spark,
      .track-promo-streak { opacity: 1; }
      .track-promo-plane { left: 30%; top: 8px; }
    }
  `;
}
