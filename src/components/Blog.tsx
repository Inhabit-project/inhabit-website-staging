import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { blogServices } from "@/services/wordpress/blog";
import { BlogPost, BlogProps as ImportedBlogProps } from "@/types/wordpress";
import { truncateHtml } from "@/utils/html";
import { Link, useLocation } from "react-router-dom";
import SubLoader from "@/load/SubLoader";
import { LoadingContext, PageAnimationContext } from '../App';

interface BlogProps extends ImportedBlogProps {
  onReady?: () => void;
}

const Blog: React.FC<BlogProps> = ({ isMainPage = false, onReady }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isBlogPage = location.pathname === "/blog";
  const isLoading = useContext(LoadingContext);
  const pageAnimationReady = useContext(PageAnimationContext);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    setError(null);

    try {
      const blogService = blogServices();
      const { posts } = await blogService.fetchPosts({
        per_page: 4,
        page: 1,
      });
      setPosts(posts);
    } catch (err) {
      setError(t("mainPage.blog.error"));
      console.error("Error loading blog posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [t]);

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

  return (
    <section className="background-gradient-light w-full min-h-screen">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 background-gradient-light">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2
              className="heading-2 text-secondary max-w-[40.9375rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              <span dangerouslySetInnerHTML={{ __html: t("mainPage.blog.title") }} />
            </h2>
            <p
              className="body-M text-secondary max-w-[36rem]"
              style={{ color: "var(--color-secondary)" }}
            >
              {t("mainPage.blog.description")}
            </p>
          </div>

          {/* Blog content with fade-in */}
          <div className={`relative${isLoadingPosts ? ' min-h-80' : ''}`}>
            <SubLoader isLoading={isLoadingPosts} />
            {!isLoadingPosts && (
              <div
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transition: "opacity 0.8s ease"
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
                    <div className="lg:w-1/2">
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
                              Read more
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
