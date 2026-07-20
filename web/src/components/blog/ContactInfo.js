import { Mail, User } from "lucide-react";

export default function ContactInfo({ className = "" }) {
  return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          <User className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Contact Person</p>
          <p className="font-heading font-semibold text-ink-primary dark:text-ink-invert">Erlyn Quimson</p>
        </div>
      </div>
      <a href="mailto:erlynquimson93@gmail.com" className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Email</p>
          <p className="font-heading font-semibold text-ink-primary transition hover:text-primary-600 dark:text-ink-invert dark:hover:text-primary-400">
            erlynquimson93@gmail.com
          </p>
        </div>
      </a>
    </div>
  );
}
