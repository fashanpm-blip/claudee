const PALETTES = [
  ["#111111", "#c8621f"], // black -> terracotta
  ["#2b2b2b", "#9a8c78"], // charcoal -> stone
  ["#0d0d0d", "#b56a4a"], // near-black -> clay
  ["#1a1a1a", "#8a7a63"], // ink -> sand
  ["#141414", "#a85c3c"], // black -> rust
  ["#232323", "#7d6f5c"], // graphite -> taupe
];

// A handful of minimal, monochrome editorial figure poses — used in place
// of photography where no real image source is available.
const POSES = [
  // relaxed coat, hands in pockets
  "M100 46c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18zM70 92c4-10 16-16 30-16s26 6 30 16l10 88H60l10-88zM70 92l-14 46M130 92l14 46",
  // long coat, one arm out
  "M100 46c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18zM72 92c3-9 15-16 28-16s25 7 28 16l12 94H60l12-94zM128 96l30 20M62 96l-8 40",
  // dress silhouette, arms crossed
  "M100 46c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18zM74 92c3-10 14-16 26-16s23 6 26 16c8 20 8 46 0 94H74c-8-48-8-74 0-94zM82 112h36",
  // structured blazer, wide stance
  "M100 46c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18zM68 92c4-10 16-16 32-16s28 6 32 16l8 40-14 54h-52l-14-54 8-40zM60 132l-10 50M140 132l10 50",
];

export default function PortraitSilhouette({
  index = 0,
  className,
}: {
  index?: number;
  className?: string;
}) {
  const [dark, accent] = PALETTES[index % PALETTES.length];
  const pose = POSES[index % POSES.length];
  const gradId = `pf-grad-${index}`;

  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      role="img"
      aria-label="Стилізований силует"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={dark} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="200" height="260" fill={`url(#${gradId})`} />
      <path
        d={pose}
        fill="none"
        stroke="#faf7f2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
