import { forwardRef } from "react";

const VARIANTS = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-600/20",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  outline:
    "border border-slate-300 dark:border-slate-700 text-ink-primary dark:text-ink-invert hover:bg-slate-100 dark:hover:bg-slate-800",
  ghost:
    "text-ink-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", as: As = "button", ...props },
  ref
) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  return <As ref={ref} className={classes} {...props} />;
});

export default Button;
