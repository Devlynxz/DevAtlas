import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Code2, Mail } from "lucide-react";
import { listCategories } from "../../api/categories";
import NewsletterForm from "../blog/NewsletterForm";
import Logo from "./Logo";

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories()
      .then((response) => setCategories(response.data.result.slice(0, 6)))
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Logo size={44} className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm text-ink-secondary dark:text-slate-400">
              Explore. Build. Share Knowledge. A modern destination for developers to learn and
              grow.
            </p>
            <a
              href="mailto:erlynquimson93@gmail.com"
              className="mt-4 flex items-center gap-2 text-sm text-ink-secondary transition hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
              <Mail className="h-4 w-4" />
              erlynquimson93@gmail.com
            </a>
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-ink-secondary transition hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400"
                aria-label="GitHub"
              >
                <Code2 className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-ink-secondary transition hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-400"
                aria-label="LinkedIn"
              >
                <Briefcase className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-ink-primary dark:text-ink-invert">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-secondary dark:text-slate-400">
              <li><Link to="/articles" className="hover:text-primary-600 dark:hover:text-primary-400">Articles</Link></li>
              <li><Link to="/categories" className="hover:text-primary-600 dark:hover:text-primary-400">Categories</Link></li>
              <li><Link to="/authors" className="hover:text-primary-600 dark:hover:text-primary-400">Authors</Link></li>
              <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</Link></li>
            </ul>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="font-heading text-sm font-semibold text-ink-primary dark:text-ink-invert">
                Categories
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-ink-secondary dark:text-slate-400">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/categories/${category.slug}`}
                      className="hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-heading text-sm font-semibold text-ink-primary dark:text-ink-invert">
              Stay in the loop
            </h4>
            <p className="mt-4 text-sm text-ink-secondary dark:text-slate-400">
              Get the best articles delivered to your inbox.
            </p>
            <NewsletterForm className="mt-4 max-w-none flex-col sm:flex-col" />
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-ink-muted dark:border-slate-800">
          &copy; {new Date().getFullYear()} DevAtlas. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
