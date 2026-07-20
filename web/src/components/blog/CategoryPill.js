import { Link } from "react-router-dom";

export default function CategoryPill({ category, className = "" }) {
  if (!category) return null;
  return (
    <Link
      to={`/categories/${category.slug}`}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 transition duration-150 hover:scale-105 hover:bg-primary-100 active:scale-95 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20 ${className}`}
    >
      {category.name}
    </Link>
  );
}
