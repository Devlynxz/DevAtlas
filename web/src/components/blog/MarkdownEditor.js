import { useRef, useState } from "react";
import { Bold, Code, Heading2, Italic, Link as LinkIcon, List } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

const SNIPPETS = [
  { icon: Bold, wrap: ["**", "**"], label: "Bold" },
  { icon: Italic, wrap: ["_", "_"], label: "Italic" },
  { icon: Heading2, wrap: ["## ", ""], label: "Heading", linePrefix: true },
  { icon: LinkIcon, wrap: ["[", "](https://)"], label: "Link" },
  { icon: Code, wrap: ["`", "`"], label: "Code" },
  { icon: List, wrap: ["- ", ""], label: "List", linePrefix: true },
];

export default function MarkdownEditor({ value, onChange, minHeight = "60vh" }) {
  const [tab, setTab] = useState("write");
  const textareaRef = useRef(null);

  const applySnippet = (wrap, linePrefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const [before, after] = wrap;

    const next = linePrefix
      ? `${value.slice(0, selectionStart)}${before}${selected}${value.slice(selectionEnd)}`
      : `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`;

    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + before.length;
      textarea.setSelectionRange(cursor, cursor + selected.length);
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1">
          {SNIPPETS.map(({ icon: Icon, wrap, label, linePrefix }) => (
            <button
              key={label}
              type="button"
              title={label}
              onClick={() => applySnippet(wrap, linePrefix)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200 p-1 text-xs font-medium dark:bg-slate-800">
          {["write", "preview"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={`rounded-full px-3 py-1 capitalize transition ${
                tab === option
                  ? "bg-white text-ink-primary shadow-sm dark:bg-slate-700 dark:text-ink-invert"
                  : "text-ink-secondary dark:text-slate-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your article in Markdown..."
          style={{ minHeight }}
          className="w-full resize-y bg-white p-5 font-mono text-sm text-ink-primary outline-none dark:bg-slate-900 dark:text-ink-invert"
        />
      ) : (
        <div style={{ minHeight }} className="bg-white p-5 dark:bg-slate-900">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-sm text-ink-muted">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
