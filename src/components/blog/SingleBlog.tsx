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
  const { t } = useTranslation();
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

  const clearPostStates = () => {
    setPost(null);
    setPrevPost(null);
    setNextPost(null);
    setError(null);
    setLoading(true);
    loadingRef.current = false;
  };

  const loadPost = async (postID: string, useCache = true) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    
    clearPostStates();

    // Try to load from cache first
    if (useCache) {
      try {
        const cached = localStorage.getItem(`blog_post_${postID}`);
        if (cached) {
          const { post: cachedPost, next: cachedNext, previous: cachedPrev, timestamp } = JSON.parse(cached);
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
        console.warn('Failed to load from cache:', err);
      }
    }

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const { current, next, previous } = await fetchPostWithNavigation(postID);
      
      clearTimeout(timeoutId);
      
      // Cache the results
      try {
        localStorage.setItem(`blog_post_${postID}`, JSON.stringify({
          post: current,
          next,
          previous,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.warn('Failed to cache post:', err);
      }
      
      setPost(current);
      setPrevPost(previous);
      setNextPost(next);
      setRetryCount(0);
    } catch (err) {
      console.error("Error loading blog post:", err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError(t("mainPage.blog.timeout"));
      } else if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
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

  useEffect(() => {
    if (id) loadPost(id);
  }, [id]);

  useEffect(() => {
    if (!loading && post && onPageReady) {
      onPageReady();
    }
  }, [loading, post, onPageReady]);

  return (
    <>
      <SubLoader isLoading={loading} />

      {!loading && error && (
        <h1
          className="py-24"
          style={{
            color: "var(--color-secondary)",
            fontWeight: 500,
            fontSize: 48,
            lineHeight: 1.1,
          }}
        >
          {t("mainPage.blog.error")}
        </h1>
      )}

      {!loading && post && (
        <main className="container mx-auto py-24" style={{ maxWidth: 900 }}>
          {/* Breadcrumb and Category */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol
              className="flex items-center"
              style={{
                color: "var(--color-secondary)",
                fontFamily: "Abel, sans-serif",
                fontSize: 16,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
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
          <h1
            className="mb-2"
            style={{
              color: "var(--color-secondary)",
              fontWeight: 600,
              fontSize: 56,
              lineHeight: 1.1,
            }}
          >
            {post?.title}
          </h1>
          {/* Meta */}
          <div
            className="flex items-center mb-6"
            style={{
              color: "var(--color-secondary)",
              fontFamily: "Abel, sans-serif",
              fontSize: 16,
              letterSpacing: "0.08em",
              opacity: 0.8,
            }}
          >
            <time dateTime={post?.modified}>{post?.modified}</time>
            <span style={{ margin: "0 12px" }} aria-hidden="true">
              •
            </span>
            <time dateTime={post?.date}>{post?.date}</time>
            <span style={{ margin: "0 12px" }} aria-hidden="true">
              •
            </span>
            <span>{post?.readTime}</span>
          </div>
          {/** Post content */}
          <div
            className="body-S blog-content"
            style={{ 
              color: "var(--color-secondary)",
              marginTop: "1rem",
              marginBottom: "1rem"
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          {/* Share section */}
          <section
            aria-labelledby="share-heading"
            className="mb-8"
            style={{ borderTop: "1px solid #D9E6C3", paddingTop: 24 }}
          >
            <h2
              className="heading-5 mb-2"
              id="share-heading"
              style={{
                color: "var(--color-secondary)",
                fontFamily: "Abel, sans-serif",
                fontSize: 16,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Share this post
            </h2>
            <fieldset
              className="flex gap-4 mt-2"
              role="group"
              aria-label="Social media sharing options"
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-secondary)",
                  fontSize: 20,
                }}
                aria-label={t('common.shareOnWebsite')}
              >
                🌐
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-secondary)",
                  fontSize: 20,
                }}
                aria-label={t('common.shareOnTwitter')}
              >
                🐦
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-secondary)",
                  fontSize: 20,
                }}
                aria-label={t('common.shareOnFacebook')}
              >
                📘
              </button>
            </fieldset>
          </section>
          {/* Author */}
          <section
            aria-labelledby="author-heading"
            className="flex items-center gap-4 mt-8"
            style={{ borderTop: "1px solid #D9E6C3", paddingTop: 24 }}
          >
            <h6 id="author-heading" className="sr-only">
              About the Author
            </h6>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#D9E6C3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "var(--color-secondary)",
              }}
              aria-hidden="true"
            >
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: "var(--color-secondary)", fontWeight: 600 }}>
                {post.author.name}
              </div>
            </div>
          </section>
          {/* Previous/Next Article Navigation */}
          <nav
            aria-label="Article navigation"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              margin: "64px 0 48px 0",
              gap: 24,
            }}
          >
            {prevPost && (
              <Link
                to={{
                  pathname: `/blog/article/${prevPost.id}`,
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--color-light)",
                    color: "var(--color-secondary)",
                    border: "none",
                    borderRadius: 32,
                    padding: "18px 32px",
                    fontFamily: "Abel, sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px 0 rgba(16, 32, 16, 0.10)",
                    transition: "background 0.2s",
                    width: "100%",
                    justifyContent: "flex-start",
                    height: "9rem",
                  }}
                  aria-label={`Previous article: ${prevPost.title}`}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontWeight: 700 }}>{t('common.previousArticle')}</span>
                  <span style={{ opacity: 0.7, marginLeft: 8 }}>
                    {prevPost.title}
                  </span>
                </button>
              </Link>
            )}
            {nextPost && (
              <Link
                to={{
                  pathname: `/blog/article/${nextPost.id}`,
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--color-light)",
                    color: "var(--color-secondary)",
                    border: "none",
                    borderRadius: 32,
                    padding: "18px 32px",
                    fontFamily: "Abel, sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px 0 rgba(16, 32, 16, 0.10)",
                    transition: "background 0.2s",
                    width: "100%",
                    justifyContent: "flex-end",
                    height: "9rem",
                  }}
                  aria-label={`${t('common.nextArticle')}: ${nextPost.title}`}
                >
                  <span style={{ fontWeight: 700, marginRight: 8 }}>
                    {t('common.nextArticle')}
                  </span>
                  <span style={{ opacity: 0.7 }}>
                    Meet the Stewards of Tierra Kilwa
                  </span>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
