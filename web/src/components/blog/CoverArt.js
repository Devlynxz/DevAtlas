const ICONS = {
  frontend: (
    <g>
      <rect x="120" y="50" width="160" height="110" rx="10" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeWidth="5" />
      <line x1="120" y1="80" x2="280" y2="80" stroke="#FFFFFF" strokeWidth="5" />
      <circle cx="138" cy="65" r="4" fill="#FFFFFF" />
      <circle cx="154" cy="65" r="4" fill="#FFFFFF" />
      <circle cx="170" cy="65" r="4" fill="#FFFFFF" />
      <line x1="140" y1="100" x2="220" y2="100" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <line x1="140" y1="118" x2="260" y2="118" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <line x1="140" y1="136" x2="200" y2="136" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
    </g>
  ),
  backend: (
    <g fill="none" stroke="#FFFFFF" strokeWidth="5">
      <line x1="130" y1="70" x2="130" y2="170" opacity="0.6" />
      <line x1="270" y1="70" x2="270" y2="170" opacity="0.6" />
      <ellipse cx="200" cy="70" rx="70" ry="18" fillOpacity="0.1" fill="#FFFFFF" />
      <ellipse cx="200" cy="120" rx="70" ry="18" fillOpacity="0.1" fill="#FFFFFF" />
      <ellipse cx="200" cy="170" rx="70" ry="18" fillOpacity="0.1" fill="#FFFFFF" />
    </g>
  ),
  react: (
    <g>
      <circle cx="200" cy="120" r="10" fill="#FFFFFF" />
      <ellipse cx="200" cy="120" rx="90" ry="32" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.9" />
      <ellipse cx="200" cy="120" rx="90" ry="32" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.9" transform="rotate(60 200 120)" />
      <ellipse cx="200" cy="120" rx="90" ry="32" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.9" transform="rotate(120 200 120)" />
    </g>
  ),
  "next-js": (
    <g stroke="#FFFFFF" strokeWidth="3">
      <rect x="110" y="100" width="140" height="90" rx="10" fill="#FFFFFF" fillOpacity="0.12" />
      <rect x="130" y="80" width="140" height="90" rx="10" fill="#FFFFFF" fillOpacity="0.22" />
      <rect x="150" y="60" width="140" height="90" rx="10" fill="#FFFFFF" fillOpacity="0.95" stroke="none" />
    </g>
  ),
  "node-js": (
    <g>
      <polygon points="270,120 235,60.6 165,60.6 130,120 165,179.4 235,179.4" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeWidth="5" />
      <circle cx="200" cy="120" r="8" fill="#FFFFFF" />
      <g stroke="#FFFFFF" strokeWidth="3" opacity="0.75">
        <line x1="200" y1="120" x2="270" y2="120" />
        <line x1="200" y1="120" x2="165" y2="60.6" />
        <line x1="200" y1="120" x2="165" y2="179.4" />
      </g>
      <circle cx="270" cy="120" r="6" fill="#FFFFFF" />
      <circle cx="165" cy="60.6" r="6" fill="#FFFFFF" />
      <circle cx="165" cy="179.4" r="6" fill="#FFFFFF" />
    </g>
  ),
  laravel: (
    <g>
      <rect x="110" y="55" width="180" height="120" rx="12" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeWidth="5" />
      <line x1="110" y1="85" x2="290" y2="85" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="128" cy="70" r="4" fill="#FFFFFF" />
      <circle cx="144" cy="70" r="4" fill="#FFFFFF" />
      <circle cx="160" cy="70" r="4" fill="#FFFFFF" />
      <polyline points="180,100 150,125 180,150" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="220,100 250,125 220,150" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  ai: (
    <g>
      <g stroke="#FFFFFF" strokeWidth="3" opacity="0.55">
        <line x1="200" y1="120" x2="270" y2="120" />
        <line x1="200" y1="120" x2="221.6" y2="186.6" />
        <line x1="200" y1="120" x2="143.4" y2="161.8" />
        <line x1="200" y1="120" x2="143.4" y2="78.2" />
        <line x1="200" y1="120" x2="221.6" y2="53.4" />
      </g>
      <circle cx="200" cy="120" r="14" fill="#FFFFFF" />
      <circle cx="270" cy="120" r="9" fill="#FFFFFF" opacity="0.9" />
      <circle cx="221.6" cy="186.6" r="9" fill="#FFFFFF" opacity="0.9" />
      <circle cx="143.4" cy="161.8" r="9" fill="#FFFFFF" opacity="0.9" />
      <circle cx="143.4" cy="78.2" r="9" fill="#FFFFFF" opacity="0.9" />
      <circle cx="221.6" cy="53.4" r="9" fill="#FFFFFF" opacity="0.9" />
    </g>
  ),
  cloud: (
    <g>
      <g fill="#FFFFFF" opacity="0.92">
        <circle cx="160" cy="130" r="32" />
        <circle cx="200" cy="103" r="42" />
        <circle cx="245" cy="130" r="30" />
        <rect x="128" y="125" width="152" height="46" rx="23" />
      </g>
      <circle cx="178" cy="122" r="6" fill="#1D4ED8" />
      <circle cx="200" cy="122" r="6" fill="#1D4ED8" />
      <circle cx="222" cy="122" r="6" fill="#1D4ED8" />
    </g>
  ),
  devops: (
    <g>
      <circle cx="200" cy="120" r="55" fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.9" />
      <circle cx="200" cy="120" r="6" fill="#FFFFFF" />
      <polygon points="200,58 191,74 209,74" fill="#FFFFFF" transform="rotate(30 200 120)" />
      <polygon points="200,58 191,74 209,74" fill="#FFFFFF" transform="rotate(150 200 120)" />
      <polygon points="200,58 191,74 209,74" fill="#FFFFFF" transform="rotate(270 200 120)" />
    </g>
  ),
  career: (
    <g fill="#FFFFFF">
      <rect x="140" y="140" width="25" height="30" rx="4" opacity="0.85" />
      <rect x="175" y="120" width="25" height="50" rx="4" opacity="0.85" />
      <rect x="210" y="95" width="25" height="75" rx="4" opacity="0.85" />
      <rect x="245" y="65" width="25" height="105" rx="4" opacity="0.85" />
      <polygon points="257,45 247,60 267,60" />
    </g>
  ),
  "open-source": (
    <g>
      <g stroke="#FFFFFF" strokeWidth="5">
        <line x1="200" y1="180" x2="200" y2="130" />
        <line x1="200" y1="130" x2="160" y2="90" />
        <line x1="200" y1="130" x2="240" y2="90" />
      </g>
      <circle cx="200" cy="180" r="9" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="200" cy="130" r="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="160" cy="90" r="9" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="240" cy="90" r="9" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="4" />
    </g>
  ),
  default: (
    <g>
      <path d="M200,45 L220,100 L275,120 L220,140 L200,195 L200,120 Z" fill="#FFFFFF" />
      <path d="M200,45 L200,120 L200,195 L180,140 L125,120 L180,100 Z" fill="#FFFFFF" opacity="0.55" />
    </g>
  ),
};

export default function CoverArt({ categorySlug, className = "" }) {
  const icon = ICONS[categorySlug] || ICONS.default;

  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cover-gradient-${categorySlug || "default"}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#cover-gradient-${categorySlug || "default"})`} />
      <circle cx="40" cy="210" r="70" fill="#FFFFFF" opacity="0.06" />
      <circle cx="380" cy="20" r="90" fill="#FFFFFF" opacity="0.06" />
      {icon}
    </svg>
  );
}
