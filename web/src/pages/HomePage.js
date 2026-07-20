import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { listPosts } from "../api/posts";
import { listCategories } from "../api/categories";
import { listPopularAuthors } from "../api/authors";
import HeroSection from "../components/blog/HeroSection";
import ArticleCard from "../components/blog/ArticleCard";
import ArticleGrid from "../components/blog/ArticleGrid";
import PopularAuthors from "../components/blog/PopularAuthors";
import NewsletterForm from "../components/blog/NewsletterForm";
import StatsStrip from "../components/blog/StatsStrip";
import Reveal from "../components/motion/Reveal";
import { ArticleCardSkeleton } from "../components/ui/Skeleton";
import Button from "../components/ui/Button";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      listPosts({ page: 1, page_size: 7 }),
      listPosts({ page: 1, page_size: 1, featured: true }),
      listCategories(),
      listPopularAuthors(50),
    ])
      .then(([postsRes, featuredRes, categoriesRes, authorsRes]) => {
        if (!active) return;
        setPosts(postsRes.data.result.items);
        setPostsTotal(postsRes.data.result.total);
        setFeatured(featuredRes.data.result.items[0] || postsRes.data.result.items[0] || null);
        setCategories(categoriesRes.data.result);
        setAuthors(authorsRes.data.result);
        setError(null);
      })
      .catch(() => active && setError("Failed to load homepage content."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const latest = posts.filter((p) => p.id !== featured?.id).slice(0, 6);

  return (
    <div>
      <HeroSection />

      {!loading && !error && postsTotal > 0 && (
        <Reveal className="mx-auto max-w-4xl px-6 pt-16">
          <StatsStrip articles={postsTotal} authors={authors.length} categories={categories.length} />
        </Reveal>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert sm:text-3xl">
            Featured Article
          </h2>
        </Reveal>
        {loading ? (
          <ArticleCardSkeleton />
        ) : error ? (
          <p className="text-ink-secondary dark:text-slate-400">{error}</p>
        ) : featured ? (
          <Reveal>
            <ArticleCard post={featured} featured />
          </Reveal>
        ) : (
          <p className="text-ink-secondary dark:text-slate-400">No articles published yet.</p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mb-8 flex items-center justify-between" as="div">
          <h2 className="font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert sm:text-3xl">
            Latest Articles
          </h2>
          <Link
            to="/articles"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
        <ArticleGrid posts={latest} loading={loading} error={error} />
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <h2 className="mb-8 font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert sm:text-3xl">
              Explore Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/categories/${category.slug}`}
                  className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-ink-secondary transition hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {authors.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <Reveal>
            <h2 className="mb-8 font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert sm:text-3xl">
              Popular Authors
            </h2>
            <PopularAuthors authors={authors.slice(0, 6)} />
          </Reveal>
        </section>
      )}

      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert sm:text-3xl">
            Never miss an article
          </h2>
          <p className="mt-3 text-ink-secondary dark:text-slate-400">
            Join our newsletter for the latest in software engineering, delivered weekly.
          </p>
          <NewsletterForm className="mt-6 justify-center" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 text-center">
        <Button as={Link} to="/register" size="lg">
          Join DevAtlas & start writing
        </Button>
      </section>
    </div>
  );
}
