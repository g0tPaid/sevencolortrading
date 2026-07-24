"use client";

import { motion } from "framer-motion";
import { WORLD_LAND_PATH } from "@/components/home/world-land-path";

/** Equirectangular hub positions (Natural Earth 110m fit to 1000×500) */
const hubs = [
  { id: "xiamen", label: "Xiamen", sub: "China HQ", x: 828, y: 182 },
  { id: "dubai", label: "Dubai", sub: "Hub", x: 653.5, y: 180 },
  { id: "europe", label: "Europe", sub: "Lanes", x: 527.8, y: 111 },
  { id: "usa", label: "USA", sub: "Lanes", x: 236.1, y: 144 },
  { id: "australia", label: "Australia", sub: "Lanes", x: 900, y: 338 },
] as const;

const routes = [
  { from: "xiamen", to: "dubai", delay: 0 },
  { from: "dubai", to: "europe", delay: 0.7 },
  { from: "xiamen", to: "usa", delay: 1.4 },
  { from: "dubai", to: "usa", delay: 2.1 },
  { from: "xiamen", to: "australia", delay: 2.8 },
] as const;

function hubPos(id: string) {
  return hubs.find((h) => h.id === id)!;
}

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const dx = Math.abs(a.x - b.x);
  const dy = b.y - a.y;
  // Southbound lanes (e.g. China → Australia): bulge east instead of arcing north
  if (dy > dx * 0.35) {
    const bulge = 28 + dx * 0.12;
    const my = (a.y + b.y) / 2;
    return `M ${a.x} ${a.y} Q ${mx + bulge} ${my} ${b.x} ${b.y}`;
  }
  const lift = 40 + dx * 0.06;
  const my = Math.min(a.y, b.y) - lift;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function WorldShippingMap() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[#050b12] p-2 text-paper sm:p-3">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 78% 40%, rgba(227,28,35,0.14), transparent 60%), radial-gradient(ellipse 45% 40% at 28% 35%, rgba(45,212,191,0.10), transparent 55%)",
        }}
        aria-hidden
      />

      <svg
        viewBox="0 0 1000 500"
        className="relative h-auto w-full"
        role="img"
        aria-label="World shipping lanes from Xiamen and Dubai to Europe, USA, and Australia"
      >
        <defs>
          <linearGradient id="laneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#5eead4" stopOpacity="1" />
            <stop offset="100%" stopColor="#E31C23" stopOpacity="0.7" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="oceanWash" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#0f2740" />
            <stop offset="100%" stopColor="#050b12" />
          </radialGradient>
          <pattern id="oceanDots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.045)" />
          </pattern>
          <clipPath id="mapFrame">
            <rect width="1000" height="500" rx="20" />
          </clipPath>
        </defs>

        <g clipPath="url(#mapFrame)">
          <rect width="1000" height="500" fill="url(#oceanWash)" />
          <rect width="1000" height="500" fill="url(#oceanDots)" />

          {/* Latitude guides */}
          {[100, 200, 300, 400].map((y) => (
            <line
              key={y}
              x1="0"
              x2="1000"
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.035)"
              strokeWidth="1"
            />
          ))}
          {[200, 400, 600, 800].map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1="0"
              y2="500"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          ))}

          {/* Real world land silhouette */}
          <path
            d={WORLD_LAND_PATH}
            fill="rgba(186, 198, 214, 0.28)"
            stroke="rgba(226, 232, 240, 0.18)"
            strokeWidth="0.6"
          />
          <path
            d={WORLD_LAND_PATH}
            fill="none"
            stroke="rgba(45, 212, 191, 0.12)"
            strokeWidth="1.4"
          />

          {/* Animated trade lanes */}
          {routes.map((route) => {
            const a = hubPos(route.from);
            const b = hubPos(route.to);
            const d = arcPath(a, b);
            return (
              <g key={`${route.from}-${route.to}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="url(#laneGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <motion.circle
                  r="5"
                  fill="#5eead4"
                  filter="url(#softGlow)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    duration: 4.4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: route.delay,
                  }}
                  style={{ offsetPath: `path('${d}')` }}
                />
                <motion.circle
                  r="11"
                  fill="rgba(94,234,212,0.2)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    duration: 4.4,
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
                r="18"
                fill={hub.id === "xiamen" || hub.id === "dubai" ? "rgba(227,28,35,0.2)" : "rgba(45,212,191,0.15)"}
                animate={{ r: [15, 22, 15], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle
                cx={hub.x}
                cy={hub.y}
                r="6.5"
                fill={hub.id === "xiamen" || hub.id === "dubai" ? "#E31C23" : "#2dd4bf"}
              />
              <circle cx={hub.x} cy={hub.y} r="2.4" fill="#fff" />
              <text
                x={hub.x}
                y={hub.y - 24}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="16"
                fontWeight="700"
                style={{ fontFamily: "var(--font-nunito), sans-serif" }}
              >
                {hub.label}
              </text>
              <text
                x={hub.x}
                y={hub.y - 9}
                textAnchor="middle"
                fill="rgba(248,250,252,0.55)"
                fontSize="11"
                style={{ fontFamily: "var(--font-nunito), sans-serif" }}
              >
                {hub.sub}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
