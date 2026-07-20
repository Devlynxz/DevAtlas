import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Briefcase, Code2, Globe, X as XIcon } from "lucide-react";
import { getAuthorByUsername } from "../api/authors";
import { formatDate, pluralize } from "../utils/format";
import ArticlesPage from "./ArticlesPage";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

const SOCIAL_LINKS = [
  { key: "social_github", icon: Code2, label: "GitHub" },
  { key: "social_linkedin", icon: Briefcase, label: "LinkedIn" },
  { key: "social_twitter", icon: XIcon, label: "Twitter" },
  { key: "social_website", icon: Globe, label: "Website" },
];

export default function AuthorPage() {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getAuthorByUsername(username)
      .then((response) => active && setAuthor(response.data.result))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [username]);

  if (loading) return <Spinner />;

  if (notFound || !author) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <ErrorState message="This author could not be found." />
      </div>
    );
  }

  const headerContent = (
    <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
      <Avatar src={author.avatar} name={author.name} size="xl" />
      <h1 className="mt-4 font-heading text-2xl font-bold text-ink-primary dark:text-ink-invert">
        {author.name}
      </h1>
      <p className="text-sm text-ink-muted">@{author.username}</p>
      {author.bio && (
        <p className="mt-3 max-w-md text-ink-secondary dark:text-slate-400">{author.bio}</p>
      )}
      <div className="mt-4 flex items-center gap-4 text-sm text-ink-muted">
        <span>{pluralize(author.post_count, "article")}</span>
        <span aria-hidden>&middot;</span>
        <span>Joined {formatDate(author.joined_at)}</span>
      </div>
      <div className="mt-4 flex gap-3">
        {SOCIAL_LINKS.filter((link) => author[link.key]).map(({ key, icon: Icon, label }) => (
          <a
            key={key}
            href={author[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-ink-secondary transition hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );

  return <ArticlesPage fixedAuthor={username} headerContent={headerContent} />;
}
