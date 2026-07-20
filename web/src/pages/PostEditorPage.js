import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ImagePlus, X } from "lucide-react";
import { createPost, getPostForEdit, updatePost, uploadPostCoverImage } from "../api/posts";
import { listCategories } from "../api/categories";
import { mediaUrl } from "../api/client";
import { validateImageFile } from "../utils/validateImage";
import MarkdownEditor from "../components/blog/MarkdownEditor";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  category_id: "",
  cover_image: "",
  is_featured: false,
};

export default function PostEditorPage() {
  const { postId } = useParams();
  const isEditing = Boolean(postId);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    listCategories()
      .then((response) => setCategories(response.data.result))
      .catch(() => toast.error("Failed to load categories."));
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    getPostForEdit(postId)
      .then((response) => {
        const post = response.data.result;
        setForm({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category_id: post.category?.id || "",
          cover_image: post.cover_image || "",
          is_featured: post.is_featured,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("This post could not be loaded for editing.");
        navigate("/my-posts", { replace: true });
      });
  }, [postId, isEditing, navigate]);

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploadingCover(true);
    try {
      const response = await uploadPostCoverImage(file);
      setForm((prev) => ({ ...prev, cover_image: response.data.result.path }));
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to upload image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveCoverImage = (event) => {
    event.preventDefault();
    setForm((prev) => ({ ...prev, cover_image: "" }));
  };

  const submit = async (status) => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.category_id) {
      toast.error("Please fill in title, excerpt, content, and category.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, status };
      if (isEditing) {
        await updatePost(postId, payload);
        toast.success("Post updated!");
      } else {
        const response = await createPost(payload);
        toast.success(status === "PUBLISHED" ? "Post published!" : "Draft saved!");
        navigate(`/edit-post/${response.data.result.id}`, { replace: true });
        return;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save post.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-8 font-heading text-2xl font-extrabold text-ink-primary dark:text-ink-invert">
        {isEditing ? "Edit Post" : "Write a new post"}
      </h1>

      <div className="space-y-6">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-secondary dark:text-slate-300">
            Cover image
          </span>
          <div className="relative h-40 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-ink-muted transition hover:border-primary-400">
              {form.cover_image ? (
                <img src={mediaUrl(form.cover_image)} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <>
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">{uploadingCover ? "Uploading..." : "Click to upload a cover image"}</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleCoverUpload} />
            </label>
            {form.cover_image && (
              <button
                type="button"
                onClick={handleRemoveCoverImage}
                aria-label="Remove cover image"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Textarea
          label="Excerpt"
          rows={2}
          placeholder="A short summary shown on article cards..."
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-secondary dark:text-slate-300">
            Category
          </span>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-ink-invert"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-ink-secondary dark:text-slate-300">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Feature this article on the homepage
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-secondary dark:text-slate-300">
            Content (Markdown)
          </span>
          <MarkdownEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" disabled={submitting} onClick={() => submit("DRAFT")}>
            Save as Draft
          </Button>
          <Button disabled={submitting} onClick={() => submit("PUBLISHED")}>
            {submitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
