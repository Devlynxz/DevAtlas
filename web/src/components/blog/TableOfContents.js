import { useEffect, useMemo, useState } from "react";
import { extractHeadings } from "../../utils/slug";

export default function TableOfContents({ content }) {
  const headings = useMemo(() => extractHeadings(content || ""), [content]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden max-h-[70vh] overflow-y-auto lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        On this page
      </p>
      <ul className="space-y-2 border-l border-slate-200 dark:border-slate-800">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: heading.depth === 3 ? "1.5rem" : "1rem" }}>
            <a
              href={`#${heading.id}`}
              className={`-ml-px block border-l-2 pl-3 text-sm transition ${
                activeId === heading.id
                  ? "border-primary-600 font-medium text-primary-600 dark:text-primary-400"
                  : "border-transparent text-ink-secondary hover:text-ink-primary dark:text-slate-400 dark:hover:text-ink-invert"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
