"use client";

import { motion } from "framer-motion";

const hubs = [
  { id: "xiamen", label: "Xiamen HQ", x: 72, y: 48 },
  { id: "dubai", label: "Dubai Hub", x: 58, y: 46 },
  { id: "europe", label: "EU lanes", x: 48, y: 34 },
  { id: "usa", label: "US lanes", x: 22, y: 40 },
];

const routes = [
  { from: "xiamen", to: "dubai" },
  { from: "dubai", to: "europe" },
  { from: "xiamen", to: "usa" },
  { from: "dubai", to: "usa" },
];

function hubPos(id: string) {
  return hubs.find((h) => h.id === id)!;
}

export function WorldShippingMap() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink-soft p-4 text-paper dark:bg-paper-elevated sm:p-8">
      <div className="absolute inset-0 opacity-30 grid-fade" aria-hidden />
      <svg viewBox="0 0 100 60" className="relative h-auto w-full" role="img" aria-label="Global shipping routes from Xiamen and Dubai">
        <defs>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* simplified continents silhouettes */}
        <path
          d="M8 28 C14 20, 20 22, 26 28 C30 34, 28 42, 22 44 C14 46, 8 38, 8 28Z"
          fill="currentColor"
          className="text-white/10"
        />
        <path
          d="M40 18 C48 14, 56 16, 58 24 C60 34, 54 42, 46 40 C38 38, 36 26, 40 18Z"
          fill="currentColor"
          className="text-white/10"
        />
        <path
          d="M64 24 C74 18, 84 22, 88 32 C90 40, 84 48, 74 46 C66 44, 60 34, 64 24Z"
          fill="currentColor"
          className="text-white/10"
        />

        {routes.map((route) => {
          const a = hubPos(route.from);
          const b = hubPos(route.to);
          const mx = (a.x + b.x) / 2;
          const my = Math.min(a.y, b.y) - 8;
          return (
            <g key={`${route.from}-${route.to}`}>
              <path
                d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                fill="none"
                stroke="url(#route)"
                strokeWidth="0.4"
              />
              <motion.circle
                r="0.55"
                fill="#2dd4bf"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                style={{ offsetPath: `path('M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}')` }}
              />
            </g>
          );
        })}

        {hubs.map((hub) => (
          <g key={hub.id}>
            <circle cx={hub.x} cy={hub.y} r="1.1" className="fill-teal-300" />
            <circle cx={hub.x} cy={hub.y} r="2.2" className="fill-teal-300/20" />
            <text
              x={hub.x}
              y={hub.y - 3}
              textAnchor="middle"
              className="fill-white text-[2.2px]"
            >
              {hub.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="relative mt-4 flex flex-wrap gap-3 text-xs text-paper/70">
        <span className="rounded-full border border-white/15 px-3 py-1">Sea freight</span>
        <span className="rounded-full border border-white/15 px-3 py-1">Air freight</span>
        <span className="rounded-full border border-white/15 px-3 py-1">Express courier</span>
        <span className="rounded-full border border-white/15 px-3 py-1">Customs guidance</span>
      </div>
    </div>
  );
}
