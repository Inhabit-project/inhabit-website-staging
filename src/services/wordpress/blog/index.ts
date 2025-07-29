import i18n from "i18next";
import type {
  BlogPost,
  PaginationParams,
  PostNavigation,
  ProcessedPost,
  WordPressPost,
  WordPressPosts,
} from "@/types/wordpress";
import { cleanWordPressContent, decodeHtmlEntities } from "@/utils/html";
import { isValidDate } from "@/utils/date";
import { calculateReadTime } from "@/utils/calculateReadTime";
import { formatDate } from "@/utils/dateFormatter";
import { getHost } from "..";

export function blogServices() {
  const { host } = getHost();

  /**
   * Transforms a raw WordPress post object into a standardized blog post format.
   *
   * @param {WordPressPost} post - Raw WordPress post data from the API
   * @param {number} post.id - Original post ID
   * @param {string} post.date - Original publish date string
   * @param {object} post.title - Post title data
   * @param {string} post.title.rendered - HTML-encoded title text
   * @param {object} post.content - Post content data
   * @param {string} post.content.rendered - Raw HTML content
   * @param {object} [post._embedded] - Optional embedded resources
   * @param {Array} [post._embedded.wp:featuredmedia] - Featured media items
   * @returns {BlogPost} Formatted post data
   * @returns {string} BlogPost.id - Stringified post ID
   * @returns {string} BlogPost.date - Formatted localized date
   * @returns {string} BlogPost.title - Decoded HTML title text
   * @returns {string} BlogPost.content - Raw HTML content
   * @returns {string} BlogPost.image - Featured image URL or empty string
   */
  const formatPost = (
    post: WordPressPost
  ): Pick<BlogPost, "id" | "date" | "title" | "content" | "image"> => {
    return {
      id: post.id.toString(),
      date: new Date(post.date).toLocaleDateString(),
      title: decodeHtmlEntities(post.title.rendered),
      content: post.content.rendered,
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
    };
  };

  /**
   * Fetches paginated WordPress posts and transforms them into standardized blog posts.
   *
   * @param {PaginationParams} [params] - Optional pagination parameters
   * @param {number} [params.per_page=3] - Number of posts per page
   * @param {number} [params.page=1] - Current page number
   * @returns {Promise<{posts: BlogPost[], totalPages: number}>} Paginated response object
   * @returns {BlogPost[]} posts - Array of formatted blog posts
   * @returns {number} totalPages - Total available pages
   *
   * @throws {Error} When the WordPress API request fails
   *
   * @example
   * const { posts, totalPages } = await fetchPosts({ per_page: 5, page: 2 });
   */
  const fetchPosts = async (
    params?: PaginationParams
  ): Promise<{ posts: BlogPost[]; totalPages: number }> => {
    // Use only the base language (e.g., 'en' from 'en-AU')
    const currentLanguage = i18n.language.split("-")[0];
    const { per_page = 3, page = 1, skipFeatured = false } = params ?? {};
    const featuredPostsToSkip = 4;

    try {
      const url = new URL(`${host}/wp-json/wp/v2/posts`);
      url.searchParams.append("_embed", "");
      url.searchParams.append("per_page", per_page.toString());
      url.searchParams.append("lang", currentLanguage);
      url.searchParams.append("fields", "id,date,title,excerpt,_embedded");

      if (skipFeatured) {
        const offset = featuredPostsToSkip + (page - 1) * per_page;
        url.searchParams.append("offset", offset.toString());
      } else {
        url.searchParams.append("page", page.toString());
      }

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        credentials: "include", // Test if cookies are needed
      });

      if (!response.ok) {
        throw new Error("Failed to fetch WordPress posts");
      }

      const totalPosts = parseInt(
        response.headers.get("X-WP-Total") ?? "0",
        10
      );
      let totalPages;

      if (skipFeatured) {
        const remainingPosts = Math.max(0, totalPosts - featuredPostsToSkip);
        totalPages = Math.ceil(remainingPosts / per_page);
      } else {
        totalPages = parseInt(
          response.headers.get("X-WP-TotalPages") ?? "1",
          10
        );
      }

      const posts: WordPressPosts[] = await response.json();

      return {
        posts: posts.map((post) => {
          const categories =
            post._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) ?? [];

          const contentToUse =
            post.content?.rendered || post.excerpt?.rendered || "";
          const readTime = calculateReadTime(
            cleanWordPressContent(contentToUse)
          );
          return {
            id: post.id.toString(),
            date: formatDate(post.date, currentLanguage, true),
            title: decodeHtmlEntities(post.title.rendered),
            content: cleanWordPressContent(
              post.excerpt.rendered || post.content.rendered
            ),
            image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
            categories,
            readTime,
          };
        }),
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching WordPress posts:", error);
      return { posts: [], totalPages: 0 };
    }
  };

  /**
   * Fetches and processes a single WordPress post by ID, including related media and taxonomy terms.
   *
   * @param {string} postId - The ID of the post to retrieve
   * @returns {Promise<ProcessedPost | null>} The processed post data or null if not found
   *
   * @property {string} id - Stringified post ID
   * @property {string} date - Formatted localized date string
   * @property {string} dateWithoutFormat - Original date string from WordPress
   * @property {string} modified - Formatted localized last modification date
   * @property {string} title - Decoded HTML title text
   * @property {string} excerpt - Decoded HTML excerpt text
   * @property {string} content - Raw HTML content
   * @property {object} featuredImage - Processed image data
   * @property {string} featuredImage.sourceUrl - Original image URL
   * @property {string} featuredImage.altText - Image alt text
   * @property {string} [featuredImage.thumbnail] - Thumbnail size URL
   * @property {string} [featuredImage.medium] - Medium size URL
   * @property {string} [featuredImage.large] - Large size URL
   * @property {string[]} categories - Array of category names
   * @property {string[]} tags - Array of tag names
   * @property {string} readTime - Estimated reading time (e.g. "5 min read")
   *
   * @throws {Error} When the WordPress API request fails
   *
   * @example
   * const post = await fetchPost("123");
   * if (post) {
   *   console.log(post.title);
   * }
   */
  const fetchPost = async (postId: string): Promise<ProcessedPost | null> => {
    const currentLanguage = i18n.language;

    try {
      const url = `${host}/wp-json/wp/v2/posts?_embed&include[]=${postId}&lang=${currentLanguage}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const posts: WordPressPost[] = await response.json();

      if (!posts.length) {
        return null;
      }

      const post = posts[0];
      const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
      const terms = post._embedded?.["wp:term"] ?? [];
      const authorData = post._embedded?.author?.[0];

      const categories: string[] = [];
      const tags: string[] = [];

      terms.forEach((termGroup) => {
        termGroup.forEach((term) => {
          if (term.taxonomy === "category") {
            categories.push(term.name);
          } else if (term.taxonomy === "post_tag") {
            tags.push(term.name);
          }
        });
      });

      const contentToUse =
        post.content?.rendered || post.excerpt?.rendered || "";
      const readTime = calculateReadTime(cleanWordPressContent(contentToUse));

      return {
        id: post.id.toString(),
        date: formatDate(post.date, currentLanguage, true),
        dateWithoutFormat: post.date,
        title: decodeHtmlEntities(post.title.rendered),
        excerpt: decodeHtmlEntities(post.excerpt.rendered),
        content: post.content.rendered,
        featuredImage: {
          sourceUrl: featuredMedia?.source_url ?? "",
          altText: featuredMedia?.alt_text ?? "",
          thumbnail: featuredMedia?.media_details?.sizes?.thumbnail?.source_url,
          medium: featuredMedia?.media_details?.sizes?.medium?.source_url,
          large: featuredMedia?.media_details?.sizes?.large?.source_url,
        },
        categories,
        tags,
        readTime,
        modified: formatDate(post.modified, currentLanguage, false),
        author: {
          id: authorData?.id ?? 0,
          name: authorData?.name ?? "",
          avatar: authorData?.avatar_urls?.["96"],
          description: authorData?.description,
          url: authorData?.link,
        },
      };
    } catch (error) {
      console.error("Error fetching single WordPress post:", error);
      return null;
    }
  };

  /**
   * Fetches a WordPress post along with its adjacent (next/previous) posts for navigation.
   *
   * @param {string} postId - The ID of the target post to fetch
   * @returns {Promise<PostNavigation>} Object containing current post and navigation posts
   * @returns {ProcessedPost | null} current - The requested post or null if not found
   * @returns {Pick<BlogPost, "id" | "title" | "content" | "date" | "image"> | null} next - The next post in chronological order
   * @returns {Pick<BlogPost, "id" | "title" | "content" | "date" | "image"> | null} previous - The previous post in chronological order
   *
   * @throws {Error} Propagates any errors from fetchPost or fetchAdjacentPost
   *
   * @example
   * const { current, next, previous } = await fetchPostWithNavigation("123");
   * console.log('Current:', current?.title);
   * console.log('Next:', next?.title);
   * console.log('Previous:', previous?.title);
   */
  const fetchPostWithNavigation = async (
    postId: string
  ): Promise<PostNavigation> => {
    try {
      const current = await fetchPost(postId);

      if (current == null) {
        throw new Error(`Post with ID ${postId} not found`);
      }

      const [next, previous] = await Promise.all([
        fetchAdjacentPost(current.dateWithoutFormat, "after", "asc"),
        fetchAdjacentPost(current.dateWithoutFormat, "before", "desc"),
      ]);

      return { current, next, previous };
    } catch (error) {
      console.error("Error in fetchPostWithNavigation:", error);
      throw error;
    }
  };

  /**
   * Fetches the adjacent (next/previous) post relative to a reference date.
   *
   * @param {string} date - The reference date in ISO format (YYYY-MM-DDTHH:MM:SS)
   * @param {'after' | 'before'} direction - Whether to fetch posts after or before the reference date
   * @param {'asc' | 'desc'} order - Sorting order for the results
   * @returns {Promise<Pick<BlogPost, "id" | "title" | "content" | "date" | "image"> | null>} The adjacent post or null if none exists
   *
   * @throws {Error} When the WordPress API request fails
   *
   * @example
   * Get the next post after a specific date
   * const nextPost = await fetchAdjacentPost('2023-01-15T00:00:00', 'after', 'asc');
   *
   * @example
   * Get the previous post before a specific date
   * const prevPost = await fetchAdjacentPost('2023-01-15T00:00:00', 'before', 'desc');
   */
  const fetchAdjacentPost = async (
    date: string,
    direction: "after" | "before",
    order: "asc" | "desc"
  ): Promise<Pick<
    BlogPost,
    "id" | "title" | "content" | "date" | "image"
  > | null> => {
    const currentLanguage = i18n.language;

    if (!date || !isValidDate(date)) {
      return null;
    }

    const response = await fetch(
      `${host}/wp-json/wp/v2/posts?${direction}=${date}&per_page=1&order=${order}&_embed&lang=${currentLanguage}`
    );
    const data = await response.json();
    return data.length > 0 ? formatPost(data[0]) : null;
  };

  return {
    fetchPosts,
    fetchPost,
    fetchPostWithNavigation,
    formatPost,
    fetchAdjacentPost,
  };
}
