import { BlogPost } from "@/types/wordpress";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";
import { truncateHtml } from "@/utils/html";
import SubLoader from "@/load/SubLoader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/utils/gsap";
import { blogServices } from "@/services/wordpress/blog";
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const POSTS_PER_PAGE = 3;

const RelatedPost: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canAnimate, setCanAnimate] = useState(false);

  // external hooks
  const { fetchPosts } = blogServices();

  // Ensure cardRefs.current is always the right length and reset on posts change
  useEffect(() => {
    cardRefs.current = Array(posts.length).fill(null);
  }, [posts.length]);

  const loadPosts = async (newPage: number) => {
    if (newPage < 1 || (totalPages && newPage > totalPages)) return;

    setIsLoading(true);
    setError(null);

    try {
      const { posts, totalPages } = await fetchPosts({
        per_page: POSTS_PER_PAGE,
        page: newPage,
        skipFeatured: true,
      });
      setPosts(posts);
      setTotalPages(totalPages);
      setCurrentPage(newPage);
    } catch (err) {
      setError(t("mainPage.blog.error"));
      console.error("Error isLoading blog posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = () => {
    loadPosts(currentPage + 1);
    setCurrentPage(currentPage + 1);
  };

  const loadPreviousPage = () => {
    loadPosts(currentPage - 1);
    setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (page: number) => {
    loadPosts(page);
    setCurrentPage(page);
  };

  // Set initial states for animation with useGSAP
  useGSAP(() => {
    gsap.set(titleRef.current, { opacity: 0, y: 50 });
  }, { scope: sectionRef });

  // Set initial state for cards with useGSAP
  useGSAP(() => {
    if (!isLoading && posts.length > 0) {
      const validCardRefs = cardRefs.current.filter(Boolean);
      if (validCardRefs.length === posts.length) {
        gsap.set(validCardRefs, { opacity: 0, y: 50, scale: 0.97 });
      }
    }
  }, { scope: sectionRef, dependencies: [isLoading, posts.length] });

  // Wait for posts to load, then allow animation
  useEffect(() => {
    if (!isLoading && posts.length > 0) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading, posts.length]);

  // Animate title and cards with useGSAP
  useGSAP(() => {
    if (!canAnimate) return;
    
    // Filter out null refs to avoid GSAP errors
    const validCardRefs = cardRefs.current.filter(Boolean);
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "center center",
        toggleActions: "play none none reverse",
      },
    });
    
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    }).to(
      validCardRefs,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.6"
    );
  }, { scope: sectionRef, dependencies: [canAnimate, posts.length] });

  useEffect(() => {
    loadPosts(1);
  }, [t]);

  return (
    <section
      ref={sectionRef}
      style={{ background: "var(--color-background-light)" }}
    >
      <div className="relative z-10 w-full container py-24 background-gradient-light">
        <h2
          ref={titleRef}
          className="heading-2 mb-2"
          style={{ color: "var(--color-secondary)" }}
        >
          Related <span className="font-bold block">Articles</span>
        </h2>
        <div
          className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3${
            isLoading ? " min-h-80" : ""
          }`}
          style={{ gap: "30px", marginTop: 44 }}
        >
          <SubLoader isLoading={isLoading} />

          {!isLoading && error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

          {!isLoading &&
            posts.map((post, idx) => (
              <div
                key={post.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="relative"
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  minHeight: 600,
                  background: "transparent",
                  boxShadow: "0 8px 32px 0 rgba(16, 32, 16, 0.15)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <img
                  src={post.image}
                  alt="Leaf background"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                    borderRadius: "inherit",
                  }}
                  loading="lazy"
                />
                <button
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    zIndex: 3,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(26.28px)",
                    WebkitBackdropFilter: "blur(26.28px)",
                    padding: 0,
                  }}
                  aria-label="Next post"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 11l3-3-3-3"
                      stroke="#F6FFEA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {/* Overlay at the bottom */}
                <div
                  style={{
                    position: "absolute",
                    zIndex: 2,
                    margin: 0,
                    marginBottom: 0,
                    borderRadius: "20px",
                    background: "rgba(27, 54, 37, 0.7)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    boxShadow: "0 4px 24px 0 rgba(16, 32, 16, 0.10)",
                    padding: "32px 32px 24px 32px",
                    maxWidth: "95%",
                    left: "2.5%",
                    bottom: 24,
                    right: 0,
                  }}
                >
                  <div
                    className="eyebrow mb-2 flex items-center"
                    style={{
                      color: "#F6FFEA",
                      gap: 12,
                      fontSize: 12,
                      letterSpacing: "7%",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Abel, sans-serif",
                        fontWeight: 400,
                        textTransform: "uppercase",
                      }}
                    >
                      {post.categories[0]}
                    </span>
                    <span style={{ margin: "0 8px" }}>•</span>
                    <span
                      style={{
                        fontFamily: "Abel, sans-serif",
                        fontWeight: 400,
                        textTransform: "uppercase",
                      }}
                    >
                      {post.date}
                    </span>
                    <span style={{ margin: "0 8px" }}>•</span>
                    <span
                      style={{
                        fontFamily: "Abel, sans-serif",
                        fontWeight: 400,
                        textTransform: "uppercase",
                      }}
                    >
                      {post.readTime}
                    </span>
                  </div>
                  <h6
                    className="heading-6 mb-2"
                    style={{
                      color: "#F6FFEA",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 500,
                      fontSize: 28,
                      lineHeight: 1.22,
                      textTransform: "lowercase",
                    }}
                  >
                    {post.title}
                  </h6>
                  <p
                    className="body-S mb-4"
                    style={{
                      color: "#F6FFEA",
                      fontFamily: "Nunito Sans, sans-serif",
                      fontWeight: 400,
                      fontSize: 18,
                      lineHeight: 1.5,
                    }}
                  >
                    {truncateHtml(post.content, 120)}
                  </p>
                  <Link
                    to={{
                      pathname: `/blog/article/${post.id}`,
                    }}
                  >
                    <button
                      className="btn-primary button-text"
                      style={{
                        background: "#D57300",
                        color: "#F6FFEA",
                        borderRadius: "69.5px",
                        padding: "12px 28px",
                        fontFamily: "Abel, sans-serif",
                        fontWeight: 400,
                        fontSize: 16,
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 10.7,
                        minWidth: 0,
                        border: "none",
                        boxShadow: "none",
                        marginTop: 16,
                      }}
                    >
                      Read this article
                      <svg
                        width="25.66"
                        height="25.66"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 18L18 8"
                          stroke="#F6FFEA"
                          strokeWidth="1.07"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 8H18V18"
                          stroke="#F6FFEA"
                          strokeWidth="1.07"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
        {/* Pagination */}
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevious={loadPreviousPage}
            onNext={loadNextPage}
          />
        )}
      </div>
    </section>
  );
};

export default RelatedPost;
