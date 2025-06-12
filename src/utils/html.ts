export const decodeHtmlEntities = (text: string): string => {
  if (!text) return "";

  try {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent ?? text;
  } catch (error) {
    console.error("Error decoding HTML entities:", error);
    return text; // Fallback seguro
  }
};

export const cleanWordPressContent = (html: string): string => {
  const withoutTags = html
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<p>/gi, "")
    .replace(/<\/p>/gi, "\n")
    .replace(/\[&hellip;\]/gi, "...")
    .replace(/<[^>]+>/g, "");

  const decoded = decodeHtmlEntities(withoutTags);
  return decoded.trim();
};
