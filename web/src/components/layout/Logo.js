import { Link } from "react-router-dom";
import logoMark from "../../assets/logo-mark.png";

export function LogoMark({ size = 32, className = "" }) {
  return (
    <img
      src={logoMark}
      alt=""
      height={size}
      style={{ height: size, width: "auto" }}
      className={className}
      aria-hidden="true"
    />
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
