import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlogPost, BlogProps as ImportedBlogProps } from "@/types/wordpress";
import { truncateHtml } from "@/utils/html";
import { Link, useLocation } from "react-router-dom";
import { gsap, ScrollTrigger } from "../utils/gsap";
import SubLoader from "@/load/SubLoader";
import { blogServices } from "@/services/wordpress/blog";

interface BlogProps extends ImportedBlogProps {
  onReady?: () => void;
}

const Blog: React.FC<BlogProps> = ({ isMainPage = false, onReady }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const isBlogPage = location.pathname === "/blog";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [readyToAnimate, setReadyToAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const mainPostRef = useRef<HTMLDivElement>(null);
  const smallPostsRef = useRef<HTMLDivElement>(null);

  // external hooks
  const { fetchPosts } = blogServices();

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { posts } = await fetchPosts({
        per_page: 4,
        page: 1,
      });
      setPosts(posts);
    } catch (err) {
      setError(t("mainPage.blog.error"));
      console.error("Error loading blog posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [t]);

  useEffect(() => {
    // console.log('Blog component rendered, posts:', posts); // Debug: log posts state on update
  }, [posts]);

  const [mainPost, ...smallPosts] = posts;

  // Set initial states
  useEffect(() => {
    if (
      !titleRef.current ||
      !descriptionRef.current ||
      !mainPostRef.current ||
      !smallPostsRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, descriptionRef.current], {
        opacity: 0,
        y: 50,
      });

      gsap.set(mainPostRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95,
      });

      gsap.set(smallPostsRef.current, {
        opacity: 0,
        y: 50,
      });
    });

    return () => ctx.revert();
  }, []);

  // Wait for posts to load and refs to be set, then allow animation
  useEffect(() => {
    if (
      !isLoading &&
      posts.length > 0 &&
      titleRef.current &&
      descriptionRef.current
    ) {
      // Optional: add a small delay for effect
      const timer = setTimeout(() => setReadyToAnimate(true), 400);
      return () => clearTimeout(timer);
    } else {
      setReadyToAnimate(false);
    }
  }, [isLoading, posts.length]);

  // Animate title and description only when readyToAnimate
  useEffect(() => {
    if (!titleRef.current || !descriptionRef.current || !readyToAnimate) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let ctx: gsap.Context | null = null;

    function triggerBlogAnimation() {
      ctx = gsap.context(() => {
        if (isBlogPage) {
          // Animate immediately (no scroll trigger)
          tl = gsap.timeline();
        } else {
          // Animate on scroll (homepage)
          tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "center center",
              toggleActions: "play none none reverse",
            },
          });
        }
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        })
          .to(
            descriptionRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          )
          .add(() => setContentVisible(true)); // Show content after animation
        // Refresh ScrollTrigger after timeline is set up
        ScrollTrigger.refresh();
      });
    }

    triggerBlogAnimation();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [readyToAnimate]);

  useEffect(() => {
    if (!isLoading && posts.length > 0 && contentVisible && onReady) {
      onReady();
    }
  }, [isLoading, posts.length, contentVisible, onReady]);

  return (
    <section
      ref={sectionRef}
      className="background-gradient-light w-full min-h-screen"
    >
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 background-gradient-light">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2
              ref={titleRef}
              className="heading-2 text-secondary max-w-[40.9375rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              <span
                dangerouslySetInnerHTML={{ __html: t("mainPage.blog.title") }}
              />
            </h2>
            <p
              ref={descriptionRef}
              className="body-M text-secondary max-w-[36rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              {t("mainPage.blog.description")}
            </p>
          </div>

          {/* Blog content with fade-in */}
          <div className={`relative${isLoading ? " min-h-80" : ""}`}>
            {isBlogPage && <SubLoader isLoading={isLoading} />}
            <SubLoader isLoading={isLoading} />
            {!isLoading && (
              <div
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transition: "opacity 0.8s ease",
                }}
              >
                {error && (
                  <div className="text-center py-12 text-red-500">{error}</div>
                )}

                {posts.length === 0 && (
                  <div className="text-center py-12">
                    {t("mainPage.blog.noPosts")}
                  </div>
                )}

                {posts.length > 0 && mainPost && (
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Blog Post */}
                    <div ref={mainPostRef} className="lg:w-1/2">
                      <div className="flex flex-col gap-5">
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          <img
                            src={mainPost.image}
                            alt={mainPost.title}
                            className="absolute inset-0 w-full h-full object-cover rounded-xl"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span
                            className="eyebrow"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {mainPost.date}
                          </span>
                          <h2
                            className="heading-4"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {mainPost.title}
                          </h2>
                          <p
                            className="body-S"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {truncateHtml(mainPost.content, 200)}
                            {mainPost.content && (
                              <span className="sr-only" aria-hidden="true" dangerouslySetInnerHTML={{ __html: mainPost.content }} />
                            )}
                          </p>
                          <Link
                            to={{ pathname: `/blog/article/${mainPost.id}` }}
                          >
                            <button
                              className="mt-2 underline hover:opacity-80 focus:outline-none block self-start"
                              style={{ color: "var(--color-primary)" }}
                              onClick={() => {}}
                              aria-label={`Read more about ${mainPost.title}`}
                            >
                              Read more
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Small Blog Posts */}
                    <div ref={smallPostsRef} className="lg:w-1/2">
                      <div className="flex flex-col gap-[1.125rem]">
                        {smallPosts.map((post) => (
                          <div key={post.id} className="flex gap-5">
                            <div className="relative aspect-[4/3] w-1/3">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <span
                                className="eyebrow"
                                style={{ color: "var(--color-secondary)" }}
                              >
                                {post.date}
                              </span>
                              <h3
                                className="heading-5"
                                style={{ color: "var(--color-secondary)" }}
                              >
                                {post.title}
                              </h3>
                              <p
                                className="body-S"
                                style={{ color: "var(--color-secondary)" }}
                              >
                                {truncateHtml(post.content, 120)}
                                {post.content && (
                                  <span className="sr-only" aria-hidden="true" dangerouslySetInnerHTML={{ __html: post.content }} />
                                )}
                              </p>
                              <Link
                                to={{ pathname: `/blog/article/${post.id}` }}
                              >
                                <button
                                  className="mt-2 underline hover:opacity-80 focus:outline-none block self-start"
                                  style={{ color: "var(--color-primary)" }}
                                  onClick={() => {}}
                                  aria-label={`Read more about ${post.title}`}
                                >
                                  Read more
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
