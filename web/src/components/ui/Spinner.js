export default function Spinner({ className = "h-8 w-8" }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className={`animate-spin rounded-full border-2 border-slate-300 border-t-primary-600 dark:border-slate-700 dark:border-t-primary-400 ${className}`}
      />
    </div>
  );
}
