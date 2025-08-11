import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { blogServices } from "@/services/wordpress/blog";
import { BlogPost, BlogProps as ImportedBlogProps } from "@/types/wordpress";
import { truncateHtml } from "@/utils/html";
import { Link, useLocation } from "react-router-dom";
import SubLoader from "@/load/SubLoader";
import { LoadingContext } from '../../App';
import { gsap, ScrollTrigger } from '../../utils/gsap';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface BlogProps extends ImportedBlogProps {
  onReady?: () => void;
}

const Blog: React.FC<BlogProps> = ({ isMainPage = false, onReady }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isBlogPage = location.pathname === "/blog";
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Store ScrollTrigger and timeline references for cleanup
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Cache key for localStorage - use base language to match WordPress service
  const getCacheKey = () => `blog_posts_${i18n.language.split('-')[0]}_${isMainPage ? 'main' : 'all'}`;

  // Load posts with timeout and retry logic
  const loadPosts = async (useCache = true) => {
    const currentLanguage = i18n.language;
    const baseLanguage = i18n.language.split('-')[0];
    const cacheKey = getCacheKey();
    
    console.log("📚 Loading blog posts:", {
      fullLanguage: currentLanguage,
      baseLanguage,
      cacheKey,
      isMainPage,
      useCache
    });
    
    setIsLoadingPosts(true);
    setError(null);

    // Try to load from cache first
    if (useCache) {
      try {
        const cached = localStorage.getItem(getCacheKey());
        if (cached) {
          const { posts: cachedPosts, timestamp } = JSON.parse(cached);
          const cacheAge = Date.now() - timestamp;
          // Cache valid for 5 minutes
          if (cacheAge < 5 * 60 * 1000) {
            console.log("✅ Using cached posts:", {
              cacheKey,
              postsCount: cachedPosts.length,
              cacheAge: Math.round(cacheAge / 1000) + "s"
            });
            setPosts(cachedPosts);
            setIsLoadingPosts(false);
            return;
          } else {
            console.log("⏰ Cache expired:", {
              cacheKey,
              cacheAge: Math.round(cacheAge / 1000) + "s"
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load from cache:', err);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for bad connections

      const blogService = blogServices();
      const { posts } = await blogService.fetchPosts({
        per_page: 4,
        page: 1,
      });

      clearTimeout(timeoutId);

      // Cache the results
      try {
        localStorage.setItem(getCacheKey(), JSON.stringify({
          posts,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.warn('Failed to cache posts:', err);
      }

      console.log("🔄 Fetched fresh posts from WordPress:", {
        postsCount: posts.length,
        posts: posts.map(p => ({ id: p.id, title: p.title, date: p.date }))
      });
      
      setPosts(posts);
      setRetryCount(0);
    } catch (err) {
      console.error("Error loading blog posts:", err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError(t("mainPage.blog.timeout"));
      } else if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        // Retry after 2 seconds
        setTimeout(() => loadPosts(false), 2000);
        return;
      } else {
        setError(t("mainPage.blog.error"));
      }
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [t, i18n.language, isMainPage]);

  const [mainPost, ...smallPosts] = posts;

  useEffect(() => {
    if (!isLoadingPosts && posts.length > 0 && onReady) {
      onReady();
    }
  }, [isLoadingPosts, posts.length, onReady]);

  // Handle loading state change for GSAP animations
  React.useEffect(() => {
    if (!isLoading) {
      // Wait for SubLoader exit animation to complete
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500); // Increased delay to ensure SubLoader is completely gone
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states immediately
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 100
    });

    // Set initial state for content (only when posts are loaded)
    if (contentRef.current && posts.length > 0) {
      gsap.set(contentRef.current, {
        opacity: 0,
        y: 50
      });
    }

    // Only create animations if we can animate
    if (!canAnimate) return;

    // Clean up previous ScrollTrigger and timeline if they exist
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse"
      }
    });

    timelineRef.current
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      })
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      }, "-=0.4");

    // Animate content only when posts are loaded and not loading
    if (contentRef.current && posts.length > 0 && !isLoadingPosts) {
      timelineRef.current.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2");
    }
  }, { scope: sectionRef, dependencies: [canAnimate, posts.length, isLoadingPosts] });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle page refresh by checking scroll position
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current scroll position
      sessionStorage.setItem('blogScrollPosition', window.scrollY.toString());
    };

    const handleLoad = () => {
      // Check if we're returning from a refresh and scroll to position if needed
      const savedPosition = sessionStorage.getItem('blogScrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Only scroll if the position is significant
        if (position > 100) {
          setTimeout(() => {
            window.scrollTo(0, position);
            // Clear the stored position
            sessionStorage.removeItem('blogScrollPosition');
          }, 100);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <section ref={sectionRef} className="background-gradient-light w-full min-h-screen">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 background-gradient-light">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2
              ref={titleRef}
              className="heading-2 text-secondary max-w-[40.9375rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              <span dangerouslySetInnerHTML={{ __html: t("mainPage.blog.title") }} />
            </h2>
            <p
              ref={descriptionRef}
              className="body-M text-secondary max-w-[36rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              {t("mainPage.blog.description")}
            </p>
          </div>

          {/* Blog content with improved loading */}
          <div className={`relative${isLoadingPosts ? ' min-h-80' : ''}`}>
            {isLoadingPosts && <SubLoader isLoading={isLoadingPosts} />}
            
            {!isLoadingPosts && (
              <div ref={contentRef}>
                {error && (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                      onClick={() => {
                        setRetryCount(0);
                        loadPosts(false);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded hover:opacity-80 transition-opacity"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {t("common.retry")}
                    </button>
                  </div>
                )}

                {posts.length === 0 && !error && (
                  <div className="text-center py-12">
                    {t("mainPage.blog.noPosts")}
                  </div>
                )}

                {posts.length > 0 && mainPost && (
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Blog Post */}
                    <div className="lg:w-1/2">
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
                            className="heading-4 font-semibold"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {mainPost.title}
                          </h2>
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
                              {t('common.readMore')}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Small Blog Posts */}
                    <div className="lg:w-1/2">
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
                                className="heading-5 font-semibold"
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
                                  {t('common.readMore')}
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
