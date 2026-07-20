import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "../api/posts";
import { mediaUrl } from "../api/client";
import { formatDate } from "../utils/format";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import TableOfContents from "../components/blog/TableOfContents";
import MarkdownRenderer from "../components/blog/MarkdownRenderer";
import ShareButtons from "../components/blog/ShareButtons";
import RelatedArticles from "../components/blog/RelatedArticles";
import CategoryPill from "../components/blog/CategoryPill";
import CoverArt from "../components/blog/CoverArt";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

export default function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getPostBySlug(slug)
      .then((response) => {
        if (!active) return;
        setPost(response.data.result);
        getRelatedPosts(slug)
          .then((relatedRes) => active && setRelated(relatedRes.data.result))
          .catch(() => active && setRelated([]));
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <Spinner />;

  if (notFound || !post) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <ErrorState message="This article could not be found." />
        <div className="mt-6 text-center">
          <Link to="/articles" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
            Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  const publishDate = post.published_at || post.created_at;

  return (
    <article className="animate-fade-in">
      <ReadingProgressBar />

      {post.cover_image && !imageFailed ? (
        <div className="h-72 w-full overflow-hidden sm:h-96">
          <img
            src={mediaUrl(post.cover_image)}
            alt={post.title}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="h-64 w-full sm:h-80">
          <CoverArt categorySlug={post.category?.slug} />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-4">
          <CategoryPill category={post.category} />
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-ink-primary dark:text-ink-invert sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4 dark:border-slate-800">
          <Link to={`/authors/${post.author?.username}`} className="flex items-center gap-3">
            <Avatar src={post.author?.avatar} name={post.author?.name} />
            <div>
              <p className="text-sm font-semibold text-ink-primary dark:text-ink-invert">
                {post.author?.name}
              </p>
              <p className="flex items-center gap-2 text-xs text-ink-muted">
                {formatDate(publishDate)}
                <span aria-hidden>&middot;</span>
                <Clock className="h-3 w-3" /> {post.reading_time} min read
              </p>
            </div>
          </Link>
          <ShareButtons title={post.title} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_240px]">
          <MarkdownRenderer content={post.content} />
          <TableOfContents content={post.content} />
        </div>

        <RelatedArticles posts={related} />
      </div>
    </article>
  );
}
