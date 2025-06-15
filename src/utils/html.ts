/**
 * Decodes HTML entities in a text string (e.g., "&amp;" becomes "&").
 * 
 * @param {string} text - The string containing HTML entities to decode
 * @returns {string} The decoded string, or original string if decoding fails
 * 
 * @example
 * decodeHtmlEntities("Ben &amp; Jerry&apos;s"); // "Ben & Jerry's"
 * decodeHtmlEntities(null); // ""
 */
export const decodeHtmlEntities = (text: string): string => {
  if (!text) return "";

  try {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent ?? text;
  } catch (error) {
    console.error("Error decoding HTML entities:", error);
    return text;
  }
};

/**
 * Cleans WordPress HTML content by removing tags, converting paragraph breaks,
 * and decoding HTML entities.
 * 
 * @param {string} html - The WordPress HTML content to clean
 * @returns {string} Plain text with proper line breaks and decoded entities
 * 
 * @example
 * cleanWordPressContent("<p>Hello</p><p>World</p>");
 * Returns: "Hello\n\nWorld"
 * 
 * cleanWordPressContent("Tom &amp; Jerry");
 * Returns: "Tom & Jerry"
 */
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
