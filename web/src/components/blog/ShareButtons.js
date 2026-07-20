import { useState } from "react";
import { Briefcase, Link2, Share2, X as XIcon } from "lucide-react";

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled — no action needed
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iconClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-ink-secondary transition hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-primary-400";

  return (
    <div className="flex items-center gap-3">
      {typeof navigator !== "undefined" && navigator.share && (
        <button type="button" onClick={handleNativeShare} className={iconClass} aria-label="Share">
          <Share2 className="h-4 w-4" />
        </button>
      )}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        aria-label="Share on X"
      >
        <XIcon className="h-4 w-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        aria-label="Share on LinkedIn"
      >
        <Briefcase className="h-4 w-4" />
      </a>
      <button type="button" onClick={handleCopy} className={iconClass} aria-label="Copy link">
        <Link2 className="h-4 w-4" />
      </button>
      {copied && <span className="text-xs text-primary-600 dark:text-primary-400">Link copied!</span>}
    </div>
  );
}
