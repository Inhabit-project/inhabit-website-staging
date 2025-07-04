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

/**
 * Removes all HTML tags and truncates plain text to a specified length
 * 
 * This function is ideal when you need plain text output without any HTML markup.
 * It completely strips all HTML tags before truncating the text.
 *
 * @param {string} text - The HTML/text content to process
 * @param {number} maxLength - Maximum allowed character length
 * @returns {string} Plain text truncated to maxLength with ellipsis if truncated
 *
 * @example
 * Basic usage
 * truncatePlainText('<p>Hello <strong>World</strong></p>', 8);
 * Returns: "Hello Wo..."
 */
export const truncatePlainText = (text: string, maxLength: number): string => {
  if (!text) return "";
  const plainText = text.replace(/<[^>]*>/g, "");
  return plainText.length <= maxLength
    ? plainText
    : `${plainText.substring(0, maxLength)}...`;
};

/**
 * Safely truncates HTML content while preserving tag structure
 * 
 * This function maintains HTML integrity while truncating to the specified length.
 * It will:
 * - Keep all HTML tags properly opened/closed
 * - Count only visible text characters toward the limit
 * - Add ellipsis (...) when content is truncated
 *
 * @param {string} html - HTML content to truncate
 * @param {number} maxLength - Maximum visible text characters (excluding HTML tags)
 * @param {boolean} [keepTags=true] - When false, strips tags (similar to truncatePlainText)
 * @returns {string} Truncated HTML with preserved structure
 *
 * @example
 * Basic usage with tags
 * truncateHtml('<p>Hello <strong>World</strong></p>', 8);
 * Returns: "<p>Hello <strong>Wo</strong>...</p>"
 */
export const truncateHtml = (
  html: string,
  maxLength: number,
  keepTags = true
): string => {
  if (!html || html.length <= maxLength) return html;

  const { truncatedText, tagStack } = processHtmlContent(
    html,
    maxLength,
    keepTags
  );
  const closedTagsText = closeRemainingTags(truncatedText, tagStack);

  return html.length > maxLength ? `${closedTagsText}...` : closedTagsText;
};

/**
 * Processes HTML content to extract text up to maxLength while tracking tags
 * @private
 * @param {string} html - HTML content to process
 * @param {number} maxLength - Maximum text length
 * @param {boolean} keepTags - Whether to preserve HTML tags
 * @returns {object} Object containing truncated text and tag stack
 */
const processHtmlContent = (
  html: string,
  maxLength: number,
  keepTags: boolean
) => {
  let truncatedText = "";
  let tagStack: string[] = [];
  let length = 0;
  let i = 0;

  while (i < html.length && length < maxLength) {
    const char = html[i];

    if (char === "<") {
      i = processTag(html, i, keepTags, tagStack, (tag) => {
        if (keepTags) truncatedText += tag;
      });
    } else {
      truncatedText += char;
      length++;
      i++;
    }
  }

  return { truncatedText, tagStack };
};

/**
 * Processes an HTML tag and updates the tag stack
 * @private
 * @param {string} html - Full HTML string
 * @param {number} startIndex - Index where tag begins
 * @param {boolean} keepTags - Whether to preserve this tag
 * @param {string[]} tagStack - Current stack of open tags
 * @param {function} appendTag - Callback to handle the complete tag
 * @returns {number} New index after processing the tag
 */
const processTag = (
  html: string,
  startIndex: number,
  keepTags: boolean,
  tagStack: string[],
  appendTag: (tag: string) => void
): number => {
  const endIndex = html.indexOf(">", startIndex);
  if (endIndex === -1) return html.length;

  const fullTag = html.slice(startIndex, endIndex + 1);

  if (keepTags) {
    handleTagStack(fullTag, tagStack);
    appendTag(fullTag);
  }

  return endIndex + 1;
};

/**
 * Manages the stack of open HTML tags
 * @private
 * @param {string} tag - The complete HTML tag (<div>, </p>, <img/>, etc.)
 * @param {string[]} tagStack - Current stack of open tags
 * 
 * @example
 * For opening tags
 * handleTagStack('<div class="main">', []); // pushes 'div' to stack
 */
const handleTagStack = (tag: string, tagStack: string[]): void => {
  if (tag.startsWith("</")) {
    tagStack.pop();
  } else if (!tag.endsWith("/>")) {
    const regex = /<([^\s>]+)/;
    const execResult = regex.exec(tag);
    if (execResult?.[1]) {
      tagStack.push(execResult[1]);
    }
  }
};

/**
 * Closes any remaining open tags in the stack
 * @private
 * @param {string} text - Text with potentially unclosed tags
 * @param {string[]} tagStack - Stack of tags that need closing
 * @returns {string} Text with properly closed tags
 */
const closeRemainingTags = (text: string, tagStack: string[]) => {
  let result = text;
  while (tagStack.length > 0) {
    result += `</${tagStack.pop()}>`;
  }
  return result;
};
