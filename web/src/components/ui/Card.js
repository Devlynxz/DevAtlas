export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-surface-card shadow-sm dark:border-slate-800 dark:bg-surface-dark-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
