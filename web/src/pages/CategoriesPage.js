import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Folder } from "lucide-react";
import { listCategories } from "../api/categories";
import Reveal from "../components/motion/Reveal";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    listCategories()
      .then((response) => {
        setCategories(response.data.result);
        setError(null);
      })
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert sm:text-4xl">
          Browse by Category
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-secondary dark:text-slate-400">
          Find articles across frontend, backend, AI, cloud, DevOps, and more.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No categories yet"
          description="Categories will appear here once they're created."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 6) * 0.05}>
              <Link to={`/categories/${category.slug}`}>
                <Card className="flex h-full flex-col gap-2 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Folder className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-ink-primary dark:text-ink-invert">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-ink-secondary dark:text-slate-400">
                      {category.description}
                    </p>
                  )}
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
