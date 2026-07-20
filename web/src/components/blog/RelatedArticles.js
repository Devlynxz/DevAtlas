import ArticleCard from "./ArticleCard";

export default function RelatedArticles({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
      <h2 className="mb-6 font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
