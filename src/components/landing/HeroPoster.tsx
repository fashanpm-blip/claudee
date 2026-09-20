// Static editorial composition shown behind the hero video. Two figures,
// split left/right, echo the dual-video scrub concept even when no video
// is playing — so the hero never reads as broken or empty.
export default function HeroPoster() {
  return (
    <div className="absolute inset-0" style={{ background: "#0c0c0c" }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="hero-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c1c1c" />
            <stop offset="100%" stopColor="#4a2e1a" />
          </linearGradient>
          <linearGradient id="hero-right" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141414" />
            <stop offset="100%" stopColor="#6b3d22" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="50" height="100" fill="url(#hero-left)" />
        <rect x="50" y="0" width="50" height="100" fill="url(#hero-right)" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.3" />

        {/* left figure */}
        <g opacity="0.55" stroke="#faf7f2" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="27" cy="38" r="5" />
          <path d="M17 92c1-16 4-30 10-38 3 8 3 12 0 20-4 8-6 12-8 18M27 74c3-8 3-12 0-20 3 8 8 12 13 14 3 10 2 24-2 24" />
        </g>

        {/* right figure */}
        <g opacity="0.55" stroke="#faf7f2" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="74" cy="34" r="5" />
          <path d="M62 92c0-18 4-33 12-42 4 10 4 16 0 24 5 6 10 8 13 8 2 12 1 24-2 34" />
        </g>
      </svg>
    </div>
  );
}
