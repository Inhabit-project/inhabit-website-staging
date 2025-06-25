import React, { useEffect, useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchPosts } from "@/services/blogService";
import { BlogPost, BlogProps } from "@/types/wordpress";
import { truncateHtml } from "@/utils/html";
import { Link, useLocation } from "react-router-dom";

import SubLoader from "./SubLoader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoadingContext } from "@/App";

const Blog: React.FC<BlogProps> = ({ isMainPage = false }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const globalLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const location = useLocation();
  const isBlogPage = location.pathname === "/blog";

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const mainPostRef = useRef<HTMLDivElement>(null);
  const smallPostsRef = useRef<HTMLDivElement>(null);

  const loadPosts = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [t]);

  const [mainPost, ...smallPosts] = posts;

  // Set initial states
  useEffect(() => {
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50,
    });

    gsap.set(mainPostRef.current, {
      opacity: 0,
      x: -50,
    });

    gsap.set(smallPostsRef.current, {
      opacity: 0,
      x: 50,
    });
  }, []);

  // Handle loading state change
  useEffect(() => {
    if (!isBlogPage || (!isLoading && !globalLoading)) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading, globalLoading, isBlogPage]);

  // Simulate loading for testing purposes (only on blog page)
  useEffect(() => {
    if (isBlogPage) {
      const loadData = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
      };

      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isBlogPage]);

  // Handle animations
  useEffect(() => {
    let ctx = gsap.context(() => {});

    if (canAnimate) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        });

        // Title and description animations
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
          // Main post animation
          .to(
            mainPostRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.4"
          )
          // Small posts animation
          .to(
            smallPostsRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.6"
          );
      });
    }

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section ref={sectionRef} className="background-gradient-light w-full">
      {isBlogPage && <SubLoader isLoading={isLoading} />}
      <div className="relative z-10 w-full container py-24 background-gradient-light">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full mb-[2.5rem]">
            <h2
              className="heading-2 text-secondary max-w-[40.9375rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              <span
                dangerouslySetInnerHTML={{ __html: t("mainPage.blog.title") }}
              />
            </h2>
            <p
              className="body-M text-secondary max-w-[35rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              {t("mainPage.blog.description")}
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              {t("mainPage.blog.loading")}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              {t("mainPage.blog.noPosts")}
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Blog Post */}
              <div ref={mainPostRef} className="lg:w-1/2">
                <div className="flex flex-col gap-5">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={mainPost.image}
                      alt={mainPost.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className="eyebrow"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {mainPost.date}
                    </span>
                    <h3
                      className="heading-3"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {mainPost.title}
                    </h3>
                    <p
                      className="body-S"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      {truncateHtml(mainPost.content, 200)}
                    </p>
                    <Link
                      to={{
                        pathname: `/blog/article/${mainPost.id}`,
                      }}
                    >
                      <button
                        className="mt-2 underline hover:opacity-80 focus:outline-none block self-start"
                        style={{ color: "var(--color-primary)" }}
                        onClick={() => {}}
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
                          className="heading-6"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {post.title}
                        </h3>
                        <p
                          className="body-S"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {truncateHtml(post.content, 120)}
                        </p>
                        <Link
                          to={{
                            pathname: `/blog/article/${post.id}`,
                          }}
                        >
                          <button
                            className="mt-2 underline hover:opacity-80 focus:outline-none block self-start"
                            style={{ color: "var(--color-primary)" }}
                            onClick={() => {}}
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
      </div>
    </section>
  );
};

export default Blog;
