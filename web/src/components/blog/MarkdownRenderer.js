import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { slugifyHeading } from "../../utils/slug";

function getPlainText(children) {
  if (Array.isArray(children)) return children.map(getPlainText).join("");
  if (typeof children === "string") return children;
  if (children && typeof children === "object" && children.props) {
    return getPlainText(children.props.children);
  }
  return "";
}

const headingRenderer = (Tag) =>
  function Heading({ children, ...props }) {
    const id = slugifyHeading(getPlainText(children));
    return (
      <Tag id={id} {...props}>
        {children}
      </Tag>
    );
  };

const components = {
  h2: headingRenderer("h2"),
  h3: headingRenderer("h3"),
};

export default function MarkdownRenderer({ content, className = "" }) {
  return (
    <div className={`prose-devatlas ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
