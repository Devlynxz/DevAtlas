import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { listCategories } from "../api/categories";
import { usePosts } from "../hooks/usePosts";
import ArticleGrid from "../components/blog/ArticleGrid";
import Pagination from "../components/blog/Pagination";

const PAGE_SIZE = 9;

export default function ArticlesPage({ fixedCategory, fixedAuthor, title, description, headerContent }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const category = fixedCategory || searchParams.get("category") || "";
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    if (fixedCategory) return;
    listCategories()
      .then((response) => setCategories(response.data.result))
      .catch(() => setCategories([]));
  }, [fixedCategory]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const params = { page, page_size: PAGE_SIZE };
  if (category) params.category = category;
  if (fixedAuthor) params.author = fixedAuthor;
  if (search) params.search = search;

  const { items, total, loading, error, refetch } = usePosts(params);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in updates)) next.delete("page");
    setSearchParams(next);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateParams({ search: searchInput });
  };

  const handleCategoryClick = (slug) => {
    updateParams({ category: slug === category ? "" : slug });
  };

  const handlePageChange = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", nextPage);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      {headerContent || (
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert sm:text-4xl">
            {title || "All Articles"}
          </h1>
          {description && (
            <p className="mx-auto mt-3 max-w-xl text-ink-secondary dark:text-slate-400">{description}</p>
          )}
        </div>
      )}

      {!fixedAuthor && (
        <form onSubmit={handleSearchSubmit} className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles by title..."
              className="w-full rounded-full border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-ink-invert"
            />
          </div>
        </form>
      )}

      {!fixedCategory && categories.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryClick(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === cat.slug
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-ink-secondary hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <ArticleGrid
        posts={items}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle={search ? `No results for "${search}"` : "No articles yet"}
        emptyDescription={
          search
            ? "Try a different search term or browse all articles."
            : "Check back soon — new articles are on the way."
        }
      />

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={handlePageChange} />
    </div>
  );
}
