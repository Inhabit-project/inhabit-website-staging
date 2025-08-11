import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BlogPost, ProcessedPost } from "@/types/wordpress";
import SubLoader from "@/load/SubLoader";
import { blogServices } from "@/services/wordpress/blog";

interface SingleBlogProps {
  onPageReady?: () => void;
}

const SingleBlog: React.FC<SingleBlogProps> = ({ onPageReady }) => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { fetchPostWithNavigation } = blogServices();
  const [post, setPost] = useState<ProcessedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [prevPost, setPrevPost] = useState<Pick<
    BlogPost,
    "id" | "title" | "content" | "date" | "image"
  > | null>(null);
  const [nextPost, setNextPost] = useState<Pick<
    BlogPost,
    "id" | "title" | "content" | "date" | "image"
  > | null>(null);

  const loadingRef = useRef(false);
  const attemptedPostsRef = useRef<Set<string>>(new Set());
  const currentPostIdRef = useRef<string | null>(null);
  const executionLockRef = useRef<Map<string, boolean>>(new Map());

  const clearPostStates = () => {
    setPost(null);
    setPrevPost(null);
    setNextPost(null);
    setError(null);
    setLoading(true);
    loadingRef.current = false;
    // Don't clear attemptedPostsRef here - we want to keep track of attempted posts
  };

  const loadPost = async (postID: string, useCache = true) => {
    console.log("loadPost called for:", postID);
    
    // Triple-check execution lock
    if (!executionLockRef.current.has(postID)) {
      console.log("🚫 No execution lock, skipping:", postID);
      return;
    }
    
    // Check if we've already attempted this post
    if (attemptedPostsRef.current.has(postID)) {
      console.log("🚫 Post already attempted, skipping:", postID);
      return;
    }
    
    if (loadingRef.current) {
      console.log("Already loading, skipping:", postID);
      return;
    }
    
    // Check if this post has already failed permanently
    const hasFailed = localStorage.getItem(`blog_post_failed_${postID}`);
    if (hasFailed === 'true') {
      console.log("Post already failed, skipping:", postID);
      setError(t("mainPage.blog.notFound") || "Post not found");
      setLoading(false);
      // Mark as attempted even for failed posts
      attemptedPostsRef.current.add(postID);
      return;
    }
    
    // Mark this post as attempted
    attemptedPostsRef.current.add(postID);
    loadingRef.current = true;
    clearPostStates();

    // Try to load from cache first
    if (useCache) verifyPostCache(postID);

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for slower connections

      const { current, next, previous } = await fetchPostWithNavigation(postID);

      clearTimeout(timeoutId);

      // Cache the results with current language
      try {
        const currentLanguage = i18n.language.split('-')[0]; // Use base language
        localStorage.setItem(
          `blog_post_${postID}_${currentLanguage}`,
          JSON.stringify({
            post: current,
            next,
            previous,
            timestamp: Date.now(),
          })
        );
        console.log("💾 Cached post with language:", currentLanguage);
      } catch (err) {
        console.warn("Failed to cache post:", err);
      }

      setPost(current);
      setPrevPost(previous);
      setNextPost(next);
      setRetryCount(0);
    } catch (err) {
      console.error("Error loading blog post:", err);
      console.error("Post ID:", postID, "Language:", i18n.language);

      if (err instanceof Error && err.name === "AbortError") {
        setError(t("mainPage.blog.timeout"));
      } else if (err instanceof Error && err.message.includes("not found")) {
        // Post doesn't exist - don't retry and set a permanent error
        setError(t("mainPage.blog.notFound") || "Post not found");
        setRetryCount(0);
        // Mark this post as permanently failed to prevent retries
        localStorage.setItem(`blog_post_failed_${postID}`, 'true');
      } else if (retryCount < 2 && err instanceof Error) {
        setRetryCount((prev) => prev + 1);
        // Retry after 2 seconds
        setTimeout(() => loadPost(postID, false), 2000);
        return;
      } else {
        setError(err instanceof Error ? err.message : t("mainPage.blog.error"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const verifyPostCache = (postID: string) => {
    try {
      const currentLanguage = i18n.language.split('-')[0]; // Use base language
      const cached = localStorage.getItem(
        `blog_post_${postID}_${currentLanguage}`
      );
      if (cached) {
        const {
          post: cachedPost,
          next: cachedNext,
          previous: cachedPrev,
          timestamp,
        } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;
        // Cache valid for 10 minutes for individual posts
        if (cacheAge < 10 * 60 * 1000) {
          setPost(cachedPost);
          setPrevPost(cachedPrev);
          setNextPost(cachedNext);
          setLoading(false);
          loadingRef.current = false;
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to load from cache:", err);
    }
  };

  useEffect(() => {
    // Early return if no valid ID
    if (!id || isNaN(Number(id))) {
      if (id) {
        setError("Invalid post ID");
        setLoading(false);
      }
      return;
    }

    // Check if we already have an execution lock for this post ID
    if (executionLockRef.current.has(id)) {
      console.log("Execution already locked for post:", id);
      return;
    }

    // Check if this post has already been processed (success or failure)
    if (attemptedPostsRef.current.has(id)) {
      console.log("Post already processed, skipping:", id);
      return;
    }

    // Check if execution lock is already set for this post
    if (executionLockRef.current.has(id)) {
      console.log("🚫 Execution lock already set for post:", id, "- skipping duplicate execution");
      return;
    }



    // Set execution lock immediately
    executionLockRef.current.set(id, true);
    console.log("🔒 Setting execution lock for post:", id);
    console.log("📊 Current refs state:", {
      executionLocks: Array.from(executionLockRef.current.keys()),
      attemptedPosts: Array.from(attemptedPostsRef.current),
      loading: loadingRef.current
    });

    // Load the post
    loadPost(id);

    // Cleanup function
    return () => {
      if (id) {
        localStorage.removeItem(`blog_post_failed_${id}`);
        // Don't clear attemptedPostsRef or executionLockRef - they should persist across Strict Mode cycles
        // This prevents the second Strict Mode invocation from re-executing
      }
    };
  }, [id]); // Only depend on id

  useEffect(() => {
    if (!loading && post && onPageReady) {
      onPageReady();
    }
  }, [loading, post, onPageReady]);

  // Handle language changes - clear cache and reload post
  useEffect(() => {
    if (id && i18n.language) {
      console.log("🌐 Language changed, clearing cache and reloading post:", {
        postId: id,
        newLanguage: i18n.language,
        baseLanguage: i18n.language.split('-')[0]
      });
      
      // Clear cache for this post in the old language
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`blog_post_${id}_`)) {
          localStorage.removeItem(key);
          console.log("🗑️ Cleared cache:", key);
        }
      });
      
      // Clear the attempted posts and execution lock for this post
      attemptedPostsRef.current.delete(id);
      executionLockRef.current.delete(id);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Directly call loadPost with a fresh execution lock
      executionLockRef.current.set(id, true);
      console.log("🔒 Set fresh execution lock for language change:", id);
      loadPost(id);
    }
  }, [i18n.language, id]); // Keep id dependency for proper cleanup

  // Cleanup failed post flags on unmount
  useEffect(() => {
    return () => {
      // Clear all failed post flags when component unmounts
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('blog_post_failed_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear attempted posts set and execution locks
      attemptedPostsRef.current.clear();
      executionLockRef.current.clear();
    };
  }, []);

  return (
    <>
      <SubLoader isLoading={loading} />

      {!loading && error && (
        <main className="container mx-auto py-24" style={{ maxWidth: 900 }}>
          <h1 className="py-24 text-secondary font-medium text-5xl leading-tight">
            {t("mainPage.blog.error")}
          </h1>
        </main>
      )}

      {!loading && post && (
        <main className="container mx-auto py-24" style={{ maxWidth: 900 }}>
          {/* Breadcrumb and Category */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center text-secondary font-abel text-base tracking-wide uppercase">
              <li>
                <a href="/blog" className="hover:underline">
                  Blog
                </a>
              </li>
              <li aria-hidden="true" className="mx-2">
                /
              </li>
              <li>{post?.categories[0]}</li>
            </ol>
          </nav>
          
          {/* Title */}
          <h1 className="mb-2 heading-2 text-secondary font-semibold">
            {post?.title}
          </h1>
          
          {/* Meta */}
          <div className="flex items-center mb-6 text-secondary font-abel text-base tracking-wide opacity-80">
            <time dateTime={post?.modified}>{post?.modified}</time>
            <span className="mx-3" aria-hidden="true">
              •
            </span>
            <time dateTime={post?.date}>{post?.date}</time>
            <span className="mx-3" aria-hidden="true">
              •
            </span>
            <span>{post?.readTime}</span>
          </div>
          
          {/** Post content */}
          <div 
            className="body-S blog-content text-secondary mt-4 mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          
          {/* Share section */}
          <section
            aria-labelledby="share-heading"
            className="mb-8 border-t border-green-soft pt-6"
          >
            <h2
              className="heading-5 mb-2 text-secondary font-abel text-base tracking-wide uppercase"
              id="share-heading"
            >
              Share this post
            </h2>
            <fieldset
              className="flex gap-4 mt-2"
              role="group"
              aria-label="Social media sharing options"
            >
              <button
                className="bg-transparent border-none text-secondary text-xl hover:opacity-80 transition-opacity"
                aria-label={t("common.shareOnWebsite")}
              >
                🌐
              </button>
              <button
                className="bg-transparent border-none text-secondary text-xl hover:opacity-80 transition-opacity"
                aria-label={t("common.shareOnTwitter")}
              >
                🐦
              </button>
              <button
                className="bg-transparent border-none text-secondary text-xl hover:opacity-80 transition-opacity"
                aria-label={t("common.shareOnFacebook")}
              >
                📘
              </button>
            </fieldset>
          </section>
          
          {/* Author */}
          <section
            aria-labelledby="author-heading"
            className="flex items-center gap-4 mt-8 border-t border-green-soft pt-6"
          >
            <h6 id="author-heading" className="sr-only">
              About the Author
            </h6>
            <div
              className="w-12 h-12 rounded-full bg-green-soft flex items-center justify-center text-2xl text-secondary"
              aria-hidden="true"
            >
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-secondary font-semibold">
                {post.author.name}
              </div>
            </div>
          </section>
          
          {/* Previous/Next Article Navigation */}
          <nav
            aria-label="Article navigation"
            className="article-navigation"
          >
            {prevPost && (
              <Link
                to={{
                  pathname: `/blog/article/${prevPost.id}`,
                }}
                className="article-nav-link prev"
              >
                <button
                  className="article-nav-button"
                  aria-label={`Previous article: ${prevPost.title}`}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="article-nav-icon"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="article-nav-content">
                    <span className="font-bold">
                      {t("common.previousArticle")}
                    </span>
                    <span className="opacity-70 ml-2">
                      {prevPost.title}
                    </span>
                  </div>
                </button>
              </Link>
            )}
            {nextPost && (
              <Link
                to={{
                  pathname: `/blog/article/${nextPost.id}`,
                }}
                className="article-nav-link next"
              >
                <button
                  className="article-nav-button"
                  aria-label={`${t("common.nextArticle")}: ${nextPost.title}`}
                >
                  <div className="article-nav-content">
                    <span className="font-bold mr-2">
                      {t("common.nextArticle")}
                    </span>
                    <span className="opacity-70">
                      {nextPost.title}
                    </span>
                  </div>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="article-nav-icon"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
            )}
          </nav>
        </main>
      )}
    </>
  );
};

export default SingleBlog;
