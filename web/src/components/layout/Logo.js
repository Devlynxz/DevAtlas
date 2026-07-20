import { Link } from "react-router-dom";

export function LogoMark({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="devatlas-mark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#devatlas-mark-gradient)" />
      {/* Two bracket-arcs cradling a core node: code syntax + a shared, orbited center of knowledge */}
      <path d="M64,26 Q90,50 64,74" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M36,26 Q10,50 36,74" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.55" />
      <circle cx="50" cy="50" r="11" fill="#FFFFFF" />
      <circle cx="78" cy="28" r="4.5" fill="#FFFFFF" opacity="0.7" />
    </svg>
  );
}

export default function Logo({ size = 32, showWordmark = true, to = "/", className = "" }) {
  return (
    <Link to={to} className={`flex items-center gap-2 font-heading font-extrabold ${className}`}>
      <LogoMark size={size} />
      {showWordmark && <span className="text-ink-primary dark:text-ink-invert">DevAtlas</span>}
    </Link>
  );
}
