"use client";

import { motion } from "framer-motion";

/**
 * Hub positions on a 1000×500 equirectangular-ish canvas
 * (rough lon/lat mapped for readability, not perfect cartography)
 */
const hubs = [
  { id: "xiamen", label: "Xiamen", sub: "HQ", x: 780, y: 268 },
  { id: "dubai", label: "Dubai", sub: "Hub", x: 620, y: 255 },
  { id: "europe", label: "Europe", sub: "Lanes", x: 520, y: 175 },
  { id: "usa", label: "USA", sub: "Lanes", x: 220, y: 220 },
] as const;

const routes = [
  { from: "xiamen", to: "dubai", delay: 0 },
  { from: "dubai", to: "europe", delay: 0.6 },
  { from: "xiamen", to: "usa", delay: 1.2 },
  { from: "dubai", to: "usa", delay: 1.8 },
] as const;

function hubPos(id: string) {
  return hubs.find((h) => h.id === id)!;
}

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = Math.min(a.y, b.y) - 55 - Math.abs(a.x - b.x) * 0.04;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function WorldShippingMap() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[#071018] p-3 text-paper sm:p-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 45%, rgba(227,28,35,0.12), transparent 55%), radial-gradient(ellipse 50% 45% at 25% 40%, rgba(45,212,191,0.10), transparent 50%)",
        }}
        aria-hidden
      />

      <svg
        viewBox="0 0 1000 500"
        className="relative h-auto w-full"
        role="img"
        aria-label="Shipping lanes from Xiamen and Dubai across the world"
      >
        <defs>
          <linearGradient id="laneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#2dd4bf" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E31C23" stopOpacity="0.55" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="oceanDots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.9" fill="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>

        {/* Ocean */}
        <rect width="1000" height="500" fill="#0a1520" rx="24" />
        <rect width="1000" height="500" fill="url(#oceanDots)" rx="24" />

        {/* Latitude lines */}
        {[125, 250, 375].map((y) => (
          <line
            key={y}
            x1="40"
            x2="960"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Simplified world landmasses — recognizable silhouettes */}
        <g fill="rgba(148,163,184,0.22)" stroke="rgba(226,232,240,0.12)" strokeWidth="1">
          {/* North America */}
          <path d="M95 95 L155 78 L210 95 L245 140 L255 195 L230 250 L195 275 L155 255 L120 220 L95 175 L80 130 Z" />
          {/* South America */}
          <path d="M230 290 L265 285 L285 330 L275 390 L250 430 L225 400 L215 340 Z" />
          {/* Europe */}
          <path d="M480 120 L530 115 L560 140 L555 175 L520 185 L485 165 Z" />
          {/* Africa */}
          <path d="M500 200 L560 195 L590 245 L580 320 L545 360 L505 330 L490 260 Z" />
          {/* Middle East / Arabia */}
          <path d="M575 210 L620 205 L640 240 L615 255 L580 245 Z" />
          {/* Asia */}
          <path d="M580 110 L680 95 L780 115 L850 155 L870 210 L830 255 L760 270 L690 250 L630 220 L595 170 Z" />
          {/* SE Asia / China coast emphasis */}
          <path d="M760 245 L810 240 L835 275 L810 295 L770 285 Z" />
          {/* Australia */}
          <path d="M800 340 L870 335 L900 365 L875 395 L815 390 L790 365 Z" />
        </g>

        {/* Soft coast highlight */}
        <g fill="none" stroke="rgba(45,212,191,0.12)" strokeWidth="2">
          <path d="M95 95 L155 78 L210 95 L245 140 L255 195 L230 250 L195 275" />
          <path d="M580 110 L680 95 L780 115 L850 155 L870 210 L830 255 L760 270" />
        </g>

        {/* Routes + animated packets */}
        {routes.map((route) => {
          const a = hubPos(route.from);
          const b = hubPos(route.to);
          const d = arcPath(a, b);
          return (
            <g key={`${route.from}-${route.to}`}>
              <path
                d={d}
                fill="none"
                stroke="url(#laneGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <motion.circle
                r="4.5"
                fill="#2dd4bf"
                filter="url(#softGlow)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: route.delay,
                }}
                style={{ offsetPath: `path('${d}')` }}
              />
              <motion.circle
                r="10"
                fill="rgba(45,212,191,0.18)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: route.delay,
                }}
                style={{ offsetPath: `path('${d}')` }}
              />
            </g>
          );
        })}

        {/* Hubs */}
        {hubs.map((hub) => (
          <g key={hub.id}>
            <motion.circle
              cx={hub.x}
              cy={hub.y}
              r="16"
              fill="rgba(227,28,35,0.15)"
              animate={{ r: [14, 20, 14], opacity: [0.45, 0.15, 0.45] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx={hub.x} cy={hub.y} r="6" fill="#E31C23" />
            <circle cx={hub.x} cy={hub.y} r="2.5" fill="#fff" />
            <text
              x={hub.x}
              y={hub.y - 22}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="15"
              fontWeight="600"
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              {hub.label}
            </text>
            <text
              x={hub.x}
              y={hub.y - 8}
              textAnchor="middle"
              fill="rgba(248,250,252,0.55)"
              fontSize="11"
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              {hub.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
