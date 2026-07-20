import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import Reveal from "../motion/Reveal";
import { pluralize } from "../../utils/format";

export default function PopularAuthors({ authors }) {
  if (!authors || authors.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {authors.map((author, index) => (
        <Reveal key={author.username} delay={(index % 6) * 0.05}>
          <Link to={`/authors/${author.username}`}>
            <Card className="flex flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <Avatar src={author.avatar} name={author.name} size="lg" />
              <div>
                <p className="font-heading text-sm font-semibold text-ink-primary dark:text-ink-invert">
                  {author.name}
                </p>
                <p className="text-xs text-ink-muted">{pluralize(author.post_count, "article")}</p>
              </div>
            </Card>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
