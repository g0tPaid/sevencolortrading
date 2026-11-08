import type { CSSProperties, ReactNode } from "react";
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
 * House promotion shown while a valid search is in flight. The motion is the
 * advertisement, not a parcel-progress meter.
 */
function promoCard() {
  return (
    <aside
      data-testid="track-promo"
      data-promo={PROMO_COPY}
      role="status"
      aria-label={PROMO_COPY}
      className="track-promo-card relative mt-4 overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_22px_50px_-28px_rgba(227,28,35,0.55)]"
    >
      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_228px] sm:items-center">
        <div className="order-2 px-4 pb-4 pt-1 sm:order-1 sm:py-5 sm:pl-5 sm:pr-2">
          <p aria-hidden className="inline-flex items-center gap-2">
            <SevenColorMark size={30} title="" />
            <span className="font-logo text-[1.05rem] font-bold leading-none tracking-[-0.03em]">
              <span className="text-ink">sourc</span>
              <span className="relative inline-block text-ink">
                ı
                <span className="absolute left-1/2 top-[0.08em] h-[0.18em] w-[0.18em] -translate-x-1/2 rounded-full bg-[#E31C23]" />
              </span>
              <span className="text-ink">ng</span>
              <span className="text-[#E31C23]">.center</span>
            </span>
          </p>
          <p className="mt-2 font-display text-[1.7rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-[2.05rem]">
            {PROMO_HEADLINE}
          </p>
          <p className="mt-1.5 text-sm text-ink-soft">
            {PROMO_BRIDGE}
            <a href={PROMO_HREF} className="font-semibold text-accent underline decoration-accent/30 underline-offset-[3px]">
              {PROMO_HOST}
            </a>
          </p>
        </div>
        <div className="track-promo-stage order-1 mx-3 mt-3 h-[132px] overflow-hidden rounded-[1.25rem] border border-black/5 sm:mx-0 sm:my-3 sm:mr-3 sm:h-[148px]" aria-hidden>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 228 148" fill="none">
            <path d="M18 96C62 38 154 28 210 78" stroke="#E31C23" strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round" />
            <circle cx="18" cy="96" r="3.2" fill="#1d1d1f" />
            <circle cx="210" cy="78" r="3.2" fill="#E31C23" />
          </svg>
          <span className="track-promo-plane">
            <Image src="/tracking/sourcing-center-plane.png" alt="" width={118} height={62} className="track-promo-plane-art" unoptimized />
          </span>
          <Good className="left-[8%] top-[58%]" delay={motion.assembleStaggerMs * 2} dx="-12px" dy="10px">
            <Chair />
          </Good>
          <Good className="left-[16%] top-[16%]" delay={0} dx="-8px" dy="-12px">
            <Headphones />
          </Good>
          <Good className="left-[calc(50%-29px)] top-[calc(46%-26px)]" delay={motion.assembleStaggerMs} dx="0px" dy="14px">
            <Parcel />
          </Good>
          <Good className="right-[12%] top-[12%]" delay={motion.assembleStaggerMs * 2} dx="12px" dy="-10px">
            <Lamp />
          </Good>
          <Good className="right-[8%] top-[58%]" delay={motion.assembleStaggerMs * 3} dx="12px" dy="12px">
            <Carton />
          </Good>
        </div>
      </div>
    </aside>
  );
}

function promoStyle(): string {
  return `
        .track-promo-card { animation: track-promo-enter ${motion.enterMs}ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        .track-promo-stage::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(102deg, transparent 32%, rgba(255,255,255,0.7) 48%, transparent 64%);
          z-index: 3;
          transform: translateX(-130%);
          animation: track-promo-sheen ${motion.sheenMs}ms ease ${motion.sheenDelayMs}ms both;
          pointer-events: none;
        }
        .track-promo-stage {
          position: relative;
          background:
            radial-gradient(120px 80px at 50% 58%, rgba(227,28,35,0.14), transparent 70%),
            linear-gradient(180deg, #fbfaf7 0%, #f3efe8 100%);
        }
        .track-promo-good {
          position: absolute;
          animation: track-promo-assemble ${motion.assembleMs}ms cubic-bezier(0.16, 1, 0.3, 1) both;
          filter: drop-shadow(0 6px 8px rgba(29, 29, 31, 0.12));
        }
        .track-promo-float { display: block; animation: track-promo-float 2.6s ease-in-out infinite; }
        .track-promo-plane {
          position: absolute;
          left: 0;
          top: 2px;
          z-index: 2;
          animation: track-promo-fly ${motion.flyMs}ms cubic-bezier(0.45, 0.05, 0.2, 1) both;
          filter: drop-shadow(0 8px 10px rgba(29, 29, 31, 0.18));
        }
        .track-promo-plane-art {
          display: block;
          width: 108px;
          height: auto;
        }
        @keyframes track-promo-enter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes track-promo-assemble {
          from { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.84); }
          to { opacity: 1; transform: none; }
        }
        @keyframes track-promo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes track-promo-fly {
          from { transform: translate(-16px, 16px); }
          to { transform: translate(72px, 0); }
        }
        @keyframes track-promo-sheen {
          from { transform: translateX(-130%); }
          to { transform: translateX(130%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .track-promo-card,
          .track-promo-good,
          .track-promo-float,
          .track-promo-plane { animation: none; }
          .track-promo-stage::after { content: none; }
          .track-promo-plane { left: 22%; top: 4px; transform: none; }
          .track-promo-good { opacity: 1; }
        }
      `;
}

export function TrackPromo() {
  return (
    <>
      {promoCard()}
      <style>{promoStyle()}</style>
    </>
  );
}

function Good({
  className,
  delay,
  dx,
  dy,
  children,
}: {
  className: string;
  delay: number;
  dx: string;
  dy: string;
  children: ReactNode;
}) {
  const style = { animationDelay: `${delay}ms`, "--dx": dx, "--dy": dy } as CSSProperties;
  return (
    <span className={`track-promo-good ${className}`} style={style}>
      <span className="track-promo-float" style={{ animationDelay: `${delay + motion.assembleMs}ms` }}>
        {children}
      </span>
    </span>
  );
}

function Headphones() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <path d="M7 18a11 11 0 0 1 22 0" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" />
      <rect x="4" y="16" width="6" height="11" rx="2.2" fill="#fff" stroke="#1d1d1f" strokeWidth="1.6" />
      <rect x="26" y="16" width="6" height="11" rx="2.2" fill="#E31C23" stroke="#1d1d1f" strokeWidth="1.6" />
    </svg>
  );
}

function Chair() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" aria-hidden>
      <path d="M11 8h3.2v10H11z" fill="#E31C23" />
      <path d="M10 17h16v4.2H10z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.6" />
      <path d="M12 21.2v8M24 21.2v8M14 29h8" fill="none" stroke="#1d1d1f" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Lamp() {
  return (
    <svg width="32" height="36" viewBox="0 0 36 40" aria-hidden>
      <path d="M8 14h20L24 6H12z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 14v12" stroke="#1d1d1f" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M11 28h14" stroke="#E31C23" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="18" cy="11" r="1.3" fill="#E31C23" />
    </svg>
  );
}

function Parcel() {
  return (
    <svg width="58" height="52" viewBox="0 0 58 52" aria-hidden>
      <ellipse cx="29" cy="46" rx="16" ry="3.2" fill="rgba(29,29,31,0.14)" />
      <path d="M10 18.5 29 9l19 9.5v16L29 44 10 34.5z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 18.5 29 28l19-9.5" fill="none" stroke="#1d1d1f" strokeWidth="1.6" />
      <path d="M29 28v16" stroke="#1d1d1f" strokeWidth="1.6" />
      <path d="M29 9v19" stroke="#E31C23" strokeWidth="2.3" />
    </svg>
  );
}

function Carton() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" aria-hidden>
      <path d="M7 12.5 18 7l11 5.5v13L18 31 7 25.5z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 12.5 18 18l11-5.5M18 18v13" fill="none" stroke="#1d1d1f" strokeWidth="1.5" />
      <path d="M18 7v11" stroke="#E31C23" strokeWidth="2" />
    </svg>
  );
}
