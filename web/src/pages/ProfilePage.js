import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Camera, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { deleteMyAvatar, updateMyProfile, uploadMyAvatar } from "../api/auth";
import { validateImageFile } from "../utils/validateImage";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";

export default function ProfilePage() {
  const { user, loading, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    social_github: "",
    social_linkedin: "",
    social_twitter: "",
    social_website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        social_github: user.social_github || "",
        social_linkedin: user.social_linkedin || "",
        social_twitter: user.social_twitter || "",
        social_website: user.social_website || "",
      });
    }
  }, [user]);

  if (loading) return <Spinner />;
  if (!user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await updateMyProfile(form);
      await refreshProfile();
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploadingAvatar(true);
    try {
      await uploadMyAvatar(file);
      await refreshProfile();
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      await deleteMyAvatar();
      await refreshProfile();
      toast.success("Avatar removed.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to remove avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="mb-8 font-heading text-2xl font-extrabold text-ink-primary dark:text-ink-invert">
        Your Profile
      </h1>

      <Card className="p-8">
        <div className="mb-8 flex items-center gap-5">
          <div className="relative">
            <Avatar src={user.profile} name={user.name} size="xl" />
            <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-600 text-white shadow-md transition hover:bg-primary-700">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="font-heading text-lg font-semibold text-ink-primary dark:text-ink-invert">
              {user.name}
            </p>
            <p className="text-sm text-ink-muted">@{user.username}</p>
            {uploadingAvatar ? (
              <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">Updating avatar...</p>
            ) : (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="mt-1 flex items-center gap-1 text-xs text-ink-muted transition hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" /> Remove photo
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            label="Bio"
            rows={4}
            placeholder="Tell readers a bit about yourself..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="GitHub URL"
              placeholder="https://github.com/username"
              value={form.social_github}
              onChange={(e) => setForm({ ...form, social_github: e.target.value })}
            />
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/username"
              value={form.social_linkedin}
              onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })}
            />
            <Input
              label="Twitter / X URL"
              placeholder="https://x.com/username"
              value={form.social_twitter}
              onChange={(e) => setForm({ ...form, social_twitter: e.target.value })}
            />
            <Input
              label="Website"
              placeholder="https://yourwebsite.com"
              value={form.social_website}
              onChange={(e) => setForm({ ...form, social_website: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
