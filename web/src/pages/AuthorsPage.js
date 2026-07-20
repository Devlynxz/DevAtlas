import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { listPopularAuthors } from "../api/authors";
import PopularAuthors from "../components/blog/PopularAuthors";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    listPopularAuthors(24)
      .then((response) => {
        setAuthors(response.data.result);
        setError(null);
      })
      .catch(() => setError("Failed to load authors."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert sm:text-4xl">
          Authors
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-secondary dark:text-slate-400">
          Meet the developers, engineers, and writers sharing their knowledge on DevAtlas.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : authors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No authors yet"
          description="Authors will appear here once they've published an article."
        />
      ) : (
        <PopularAuthors authors={authors} />
      )}
    </div>
  );
}
