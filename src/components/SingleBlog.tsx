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
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);

  const loadPost = async (postID: string) => {
    setLoading(true);

    try {
      const { current, next, previous } = await fetchPostWithNavigation(postID);
      console.log(next);
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

      {!loading && post && (
        <main className="container mx-auto py-24" style={{ maxWidth: 900 }}>
          {/* Breadcrumb and Category */}
          <div
            className="mb-4"
            style={{
              color: "var(--color-secondary)",
              fontFamily: "Abel, sans-serif",
              fontSize: 16,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Blog / {post?.categories[0]}
          </div>
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
            <span>{post?.modified}</span>
            <span style={{ margin: "0 12px" }}>•</span>
            <span>{post?.date}</span>
            <span style={{ margin: "0 12px" }}>•</span>
            <span>{post?.readTime}</span>
          </div>
          {/* Cover Image */}
          <div className="mb-10">
            <img
              src={post?.featuredImage.sourceUrl}
              alt="cover"
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
          <div
            className="mb-8"
            style={{ borderTop: "1px solid #D9E6C3", paddingTop: 24 }}
          >
            <span
              style={{
                color: "var(--color-secondary)",
                fontFamily: "Abel, sans-serif",
                fontSize: 16,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Share this post.
            </span>
            <div className="flex gap-4 mt-2">
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-secondary)",
                  fontSize: 20,
                }}
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
              >
                📘
              </button>
            </div>
          </div>
          {/* Author */}
          <div
            className="flex items-center gap-4 mt-8"
            style={{ borderTop: "1px solid #D9E6C3", paddingTop: 24 }}
          >
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
          </div>
          {/* Previous/Next Article Navigation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              margin: "64px 0 48px 0",
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
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                    {prevPost?.title}
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
                >
                  <span style={{ fontWeight: 700, marginRight: 8 }}>
                    Next Article
                  </span>
                  <span style={{ opacity: 0.7 }}>{nextPost.title}</span>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
            {/* <a href="#" style={{ textDecoration: "none", flex: 1 }}>
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
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                  How to Restore Biodiversity
                </span>
              </button>
            </a>
            <a
              href="#"
              style={{ textDecoration: "none", flex: 1, textAlign: "right" }}
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
              >
                <span style={{ fontWeight: 700, marginRight: 8 }}>
                  Next Article
                </span>
                <span style={{ opacity: 0.7 }}>
                  Meet the Stewards of Tierra Kilwa
                </span>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </a> */}
          </div>
        </main>
      )}
    </>
  );
};

export default SingleBlog;
