import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { blogServices } from "@/services/wordpress/blog";
import { BlogPost, BlogProps as ImportedBlogProps } from "@/types/wordpress";
import { truncateHtml } from "@/utils/html";
import { Link, useLocation } from "react-router-dom";
import SubLoader from "@/load/SubLoader";
import { LoadingContext } from '../App';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface BlogProps extends ImportedBlogProps {
  onReady?: () => void;
}

// Skeleton component for loading state
const BlogSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
      {/* Main post skeleton */}
      <div className="lg:w-1/2">
        <div className="flex flex-col gap-5">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-xl"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Small posts skeleton */}
      <div className="lg:w-1/2">
        <div className="flex flex-col gap-[1.125rem]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-5">
              <div className="relative aspect-[4/3] w-1/3">
                <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Optimized image component with lazy loading and fallback
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className: string;
  fallbackSrc?: string;
}> = ({ src, alt, className, fallbackSrc = "/assets/placeholder-blog.svg" }) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      loading="lazy"
      onLoad={handleLoad}
      onError={handleError}
      style={{ transition: 'opacity 0.3s ease' }}
    />
  );
};

const Blog: React.FC<BlogProps> = ({ isMainPage = false, onReady }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isBlogPage = location.pathname === "/blog";
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Store ScrollTrigger and timeline references for cleanup
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Cache key for localStorage
  const getCacheKey = () => `blog_posts_${i18n.language}_${isMainPage ? 'main' : 'all'}`;

  // Load posts with timeout and retry logic
  const loadPosts = async (useCache = true) => {
    setIsLoadingPosts(true);
    setError(null);
    setShowSkeleton(true);

    // Try to load from cache first
    if (useCache) {
      try {
        const cached = localStorage.getItem(getCacheKey());
        if (cached) {
          const { posts: cachedPosts, timestamp } = JSON.parse(cached);
          const cacheAge = Date.now() - timestamp;
          // Cache valid for 5 minutes
          if (cacheAge < 5 * 60 * 1000) {
            setPosts(cachedPosts);
            setIsLoadingPosts(false);
            setShowSkeleton(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load from cache:', err);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
      // Show skeleton for a minimum time to avoid flickering
      setTimeout(() => setShowSkeleton(false), 500);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [t, i18n.language]);

  const [mainPost, ...smallPosts] = posts;

  // Handle loading state change for animations
  useEffect(() => {
    // Reset content visibility when loading starts
    if (isLoadingPosts) {
      setContentVisible(false);
      return;
    }

    // Show content when posts are loaded
    if (!isLoadingPosts && posts.length > 0) {
      setContentVisible(true);
    }
  }, [isLoadingPosts, posts.length]);

  useEffect(() => {
    if (!isLoadingPosts && posts.length > 0 && contentVisible && onReady) {
      onReady();
    }
  }, [isLoadingPosts, posts.length, contentVisible, onReady]);

  // Handle loading state change for GSAP animations
  React.useEffect(() => {
    // Allow animations when page is ready for animations OR when loader is not active
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 800); // Reduced from 1500ms for better responsiveness
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });

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
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    timelineRef.current
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "-=0.6");

    // Create scroll trigger with improved configuration for page refresh
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // Back to original position
      end: "bottom 20%", // Back to original position
      toggleActions: "play none none reverse", // Changed from "restart" to "play" for better refresh handling
      animation: timelineRef.current,
      id: `blog-${Date.now()}`, // Unique ID to avoid conflicts
      onEnter: () => {
        // Ensure animation plays when entering the trigger area
        if (timelineRef.current) {
          timelineRef.current.play();
        }
      },
      onLeaveBack: () => {
        // Reverse animation when scrolling back up
        if (timelineRef.current) {
          timelineRef.current.reverse();
        }
      },
      onRefresh: () => {
        // Handle refresh by checking if element is in view and playing animation accordingly
        if (scrollTriggerRef.current && timelineRef.current) {
          const progress = scrollTriggerRef.current.progress;
          if (progress > 0) {
            timelineRef.current.progress(progress);
          }
        }
      }
    });

    // Refresh ScrollTrigger to ensure it works properly - with delay to avoid conflicts
    setTimeout(() => {
      try {
        // Only refresh if there are active ScrollTriggers
        if (ScrollTrigger.getAll().length > 0) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("ScrollTrigger refresh failed in Blog:", error);
      }
    }, 100);
  }, { scope: sectionRef, dependencies: [canAnimate] });

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
          <div className={`relative${isLoadingPosts || showSkeleton ? ' min-h-80' : ''}`}>
            {isLoadingPosts && <SubLoader isLoading={isLoadingPosts} />}
            
            {/* Show skeleton while loading */}
            {showSkeleton && <BlogSkeleton />}
            
            {!isLoadingPosts && !showSkeleton && (
              <div
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transition: "opacity 0.8s ease"
                }}
              >
                {error && (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                      onClick={() => loadPosts(false)}
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
                          <OptimizedImage
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
                              <OptimizedImage
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
