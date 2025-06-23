import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPostWithNavigation } from "@/services/blogService";
import { BlogPost, ProcessedPost } from "@/types/wordpress";

const SingleBlog: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<ProcessedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevPost, setPrevPost] = useState<Pick<BlogPost, "id" | "title" | "content" | "date" | "image"> | null>(null);
  const [nextPost, setNextPost] = useState<Pick<BlogPost, "id" | "title" | "content" | "date" | "image"> | null>(null);

  const loadPost = async (postID: string) => {
    setLoading(true);

    try {
      const { current, next, previous } = await fetchPostWithNavigation(postID);
      setPost(current);
      setPrevPost(previous);
      setNextPost(next);
    } catch (err) {
      setError(t("mainPage.blog.error"));
      console.error("Error loading blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadPost(id);
  }, [id, t]);

  return (
    <>
      {loading && (
        <h1
          className="py-24"
          style={{
            color: "var(--color-secondary)",
            fontWeight: 500,
            fontSize: 48,
            lineHeight: 1.1,
          }}
        >
          Aquí va un loader
        </h1>
      )}

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
          Ocurrió un error
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
            className="heading-2 mb-2"
            style={{
              color: "var(--color-secondary)",
              fontWeight: 500,
              fontSize: 48,
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
          {/* Cover Image */}
          <div className="mb-10">
            <img
              src={post?.featuredImage.sourceUrl}
              alt={post?.title}
              style={{
                width: "100%",
                borderRadius: 24,
                objectFit: "cover",
                maxHeight: 340,
              }}
            />
          </div>
          {/** Post content */}
          <div
            className="body-S"
            style={{ color: "var(--color-secondary)" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          {/* Share section */}
          <section
            aria-labelledby="share-heading"
            className="mb-8"
            style={{ borderTop: "1px solid #D9E6C3", paddingTop: 24 }}
          >
            <h2
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
                aria-label="Share on Website"
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
                aria-label="Share on Twitter"
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
                aria-label="Share on Facebook"
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
            <h2 id="author-heading" className="sr-only">
              About the Author
            </h2>
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
              <div
                style={{
                  color: "var(--color-secondary)",
                  opacity: 0.7,
                  fontSize: 14,
                }}
              >
                Job title, Company name
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
                  <span style={{ fontWeight: 700 }}>Previous Article</span>
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
                  }}
                  aria-label="Next article: Meet the Stewards of Tierra Kilwa"
                >
                  <span style={{ fontWeight: 700, marginRight: 8 }}>
                    Next Article
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
