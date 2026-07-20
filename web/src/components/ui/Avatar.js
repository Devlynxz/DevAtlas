import { useState } from "react";
import { mediaUrl } from "../../api/client";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

const DEFAULT_AVATAR_SUFFIX = "/media/avatars/default.png";

export default function Avatar({ src, name, size = "md", className = "" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = (name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hasCustomAvatar = src && !src.endsWith(DEFAULT_AVATAR_SUFFIX) && !imageFailed;

  if (hasCustomAvatar) {
    return (
      <img
        src={mediaUrl(src)}
        alt={name}
        onError={() => setImageFailed(true)}
        className={`${SIZES[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-800 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${SIZES[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 font-semibold text-white ring-2 ring-white dark:ring-slate-800 ${className}`}
    >
      {initials}
    </div>
  );
}
