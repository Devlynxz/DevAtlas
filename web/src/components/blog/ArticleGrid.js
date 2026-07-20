import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import ArticleCard from "./ArticleCard";
import { ArticleCardSkeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";

export default function ArticleGrid({
  posts,
  loading,
  error,
  onRetry,
  emptyTitle = "No articles yet",
  emptyDescription = "Check back soon for new content.",
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!posts || posts.length === 0) {
    return <EmptyState icon={FileQuestion} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
        >
          <ArticleCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}
