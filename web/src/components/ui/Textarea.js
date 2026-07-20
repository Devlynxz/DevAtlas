import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea({ label, error, className = "", ...props }, ref) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink-secondary dark:text-slate-300">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-slate-900 dark:text-ink-invert dark:border-slate-700 ${
          error ? "border-red-400" : "border-slate-300"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
});

export default Textarea;
