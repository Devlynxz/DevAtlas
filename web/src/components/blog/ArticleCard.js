import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { mediaUrl } from "../../api/client";
import { formatDate } from "../../utils/format";
import Avatar from "../ui/Avatar";
import CategoryPill from "./CategoryPill";
import CoverArt from "./CoverArt";

export default function ArticleCard({ post, featured = false }) {
  const publishDate = post.published_at || post.created_at;
  const [imageFailed, setImageFailed] = useState(false);
  const showRealImage = post.cover_image && !imageFailed;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-surface-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-surface-dark-card ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <Link to={`/articles/${post.slug}`} className={`overflow-hidden ${featured ? "md:w-1/2" : ""}`}>
        {showRealImage ? (
          <img
            src={mediaUrl(post.cover_image)}
            alt={post.title}
            onError={() => setImageFailed(true)}
            className={`h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              featured ? "md:h-full" : ""
            }`}
          />
        ) : (
          <div
            className={`h-48 w-full transition-transform duration-500 group-hover:scale-105 ${
              featured ? "md:h-full" : ""
            }`}
          >
            <CoverArt categorySlug={post.category?.slug} />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <CategoryPill category={post.category} />
          {post.is_featured && (
            <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">Featured</span>
          )}
        </div>
        <Link to={`/articles/${post.slug}`}>
          <h3
            className={`font-heading font-bold text-ink-primary dark:text-ink-invert ${
              featured ? "text-2xl" : "text-lg"
            }`}
          >
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-secondary dark:text-slate-400">
            {post.excerpt}
          </p>
        </Link>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <Link to={`/authors/${post.author?.username}`} className="flex items-center gap-2">
            <Avatar src={post.author?.avatar} name={post.author?.name} size="sm" />
            <div className="text-xs">
              <p className="font-medium text-ink-primary dark:text-ink-invert">
                {post.author?.name}
              </p>
              <p className="text-ink-muted">{formatDate(publishDate)}</p>
            </div>
          </Link>
          <div className="flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="h-3.5 w-3.5" />
            {post.reading_time} min read
          </div>
        </div>
      </div>
    </div>
  );
}
