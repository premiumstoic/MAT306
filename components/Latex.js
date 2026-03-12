import katex from "katex";

export default function Latex({ children, className = "" }) {
  const source =
    typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.join("")
      : String(children ?? "");

  const trimmed = source.trim();
  const isBlock = trimmed.startsWith("$$") && trimmed.endsWith("$$");
  const isInline = trimmed.startsWith("$") && trimmed.endsWith("$");
  const expression = isBlock
    ? trimmed.slice(2, -2)
    : isInline
    ? trimmed.slice(1, -1)
    : trimmed;

  const html = katex.renderToString(expression, {
    throwOnError: false,
    displayMode: isBlock,
  });

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
