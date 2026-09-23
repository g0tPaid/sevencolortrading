const tones: Record<string, { a: string; b: string; c: string }> = {
  "Home & Kitchen": { a: "#9a3412", b: "#fdba74", c: "#431407" },
  Electronics: { a: "#1e3a8a", b: "#93c5fd", c: "#172554" },
  Furniture: { a: "#3f6212", b: "#d9f99d", c: "#1a2e05" },
  Machinery: { a: "#334155", b: "#cbd5e1", c: "#0f172a" },
  Beauty: { a: "#9d174d", b: "#fbcfe8", c: "#500724" },
  Automotive: { a: "#1e293b", b: "#94a3b8", c: "#020617" },
  Tools: { a: "#b45309", b: "#fde68a", c: "#451a03" },
  Packaging: { a: "#0f766e", b: "#99f6e4", c: "#042f2e" },
  Dental: { a: "#0369a1", b: "#bae6fd", c: "#082f49" },
  "Smart Products": { a: "#6d28d9", b: "#ddd6fe", c: "#2e1065" },
  Outdoor: { a: "#047857", b: "#a7f3d0", c: "#022c22" },
  "Pet Products": { a: "#c2410c", b: "#ffedd5", c: "#431407" },
};

export function ProductMark({
  category,
  name,
  alt,
}: {
  category: string;
  name: string;
  alt: string;
}) {
  const tone = tones[category] ?? tones.Electronics;
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <svg
      viewBox="0 0 640 480"
      width={640}
      height={480}
      role="img"
      aria-label={alt}
      className="h-auto w-full"
    >
      <rect width="640" height="480" fill={tone.c} />
      <circle cx="470" cy="120" r="90" fill={tone.a} opacity="0.9" />
      <rect x="78" y="150" width="300" height="190" rx="28" fill={tone.b} />
      <rect x="118" y="190" width="150" height="16" rx="8" fill={tone.c} opacity="0.35" />
      <rect x="118" y="222" width="96" height="10" rx="5" fill={tone.c} opacity="0.25" />
      <text
        x="118"
        y="300"
        fill={tone.c}
        fontFamily="Georgia, serif"
        fontSize="54"
        fontWeight="600"
      >
        {initial}
      </text>
    </svg>
  );
}
