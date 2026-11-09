import sanitizeHtml from "sanitize-html";

export function sanitizeContent(html: string): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "span",
      "u",
      "code",
      "pre"
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      a: ["href", "name", "target", "rel"],
      "*": ["class", "id", "style"]
    },
    allowedSchemes: ["http", "https", "mailto", "tel"]
  });
}
