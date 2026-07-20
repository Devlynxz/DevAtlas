export function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripInlineMarkdown(text) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/_([^_]*)_/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}

export function extractHeadings(markdown) {
  const lines = markdown.split("\n");
  const headings = [];
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.*)/.exec(line.trim());
    if (match) {
      const depth = match[1].length;
      const text = stripInlineMarkdown(match[2].trim());
      headings.push({ depth, text, id: slugifyHeading(text) });
    }
  }
  return headings;
}
