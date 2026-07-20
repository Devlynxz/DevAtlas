import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Pencil, PenSquare, Trash2 } from "lucide-react";
import { deletePost, listMyPosts } from "../api/posts";
import { formatDate } from "../utils/format";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    listMyPosts({ page: 1, page_size: 50 })
      .then((response) => {
        setPosts(response.data.result.items);
        setError(null);
      })
      .catch(() => setError("Failed to load your posts."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingId(post.id);
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold text-ink-primary dark:text-ink-invert">
          My Posts
        </h1>
        <Button as={Link} to="/new-post" size="sm">
          <PenSquare className="h-3.5 w-3.5" /> New Post
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="You haven't written anything yet"
          description="Share your knowledge with the DevAtlas community."
          action={
            <Button as={Link} to="/new-post">
              Write your first post
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge className={post.status === "PUBLISHED" ? "" : "bg-slate-100 text-ink-secondary dark:bg-slate-800 dark:text-slate-300"}>
                    {post.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                  {post.category && <span className="text-xs text-ink-muted">{post.category.name}</span>}
                </div>
                <h3 className="font-heading font-semibold text-ink-primary dark:text-ink-invert">
                  {post.title}
                </h3>
                <p className="mt-1 text-xs text-ink-muted">{formatDate(post.created_at)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button as={Link} to={`/edit-post/${post.id}`} variant="outline" size="sm">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={deletingId === post.id}
                  onClick={() => handleDelete(post)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
