import React, { useState, createContext, useEffect, Suspense, memo, useCallback } from "react";

import "@/i18n";
import "@/utils/gsap";
// Removed duplicate font imports - now handled in main.tsx with optimization

import Loader from "@/load/Loader";
import { scrollManager } from "@/utils/scrollManager";
import PageTransition from "@/load/PageTransition";
import { useLocation } from "react-router-dom";
import CacheManager from "@/utils/cacheManager";

import { Routes, Route } from "react-router-dom";
import LastestCampaign from "./pages/LastestCampaing";

// Lazy load pages for code splitting
const MainPage = React.lazy(() => import("@/pages/MainPage"));
const HubsPage = React.lazy(() => import("@/pages/HubsPage"));
const AboutUsPage = React.lazy(() => import("@/pages/AboutUsPage"));
const StewardshipNFTPage = React.lazy(
  () => import("@/pages/StewardshipNFTPage")
);
const Checkout = React.lazy(() => import("@/components/Checkout"));
const BlogPage = React.lazy(() => import("@/pages/BlogPage"));
const NuiyanzhiPage = React.lazy(() => import("@/pages/NuiyanzhiPage"));
const AguaDeLunaPage = React.lazy(() => import("@/pages/AguaDeLunaPage"));
const TierraKilwaPage = React.lazy(() => import("@/pages/TierraKilwaPage"));
const FourOhFourPage = React.lazy(() => import("@/pages/404"));
const TermsAndConditionsPage = React.lazy(
  () => import("@/pages/TermsAndConditionsPage")
);
const PrivacyPolicyPage = React.lazy(() => import("@/pages/PrivacyPolicyPage"));
const ProjectsPage = React.lazy(() => import("@/pages/ProjectsPage"));
const ArticlePage = React.lazy(() => import("@/pages/ArticlePage"));
const ContactUs = React.lazy(() => import("@/pages/ContactUs"));
const Membership = React.lazy(() => import("@/pages/Membership"));

// Create a context for the loading state
export const LoadingContext = createContext<boolean>(false);

// Create a context for page animations that should work regardless of loader state
export const PageAnimationContext = createContext<boolean>(false);

// Loading fallback component for route transitions
const RouteLoadingFallback = () => {
  // Disabled: Return null to eliminate the spinning circle loader
  return null;
};

const App: React.FC = memo(() => {
  const location = useLocation();

  // Only show loader on main page reload - NEVER for internal pages or navigation
  const isMainPageReload = useCallback(() => {
    // STRICT: Only main page path allowed
    if (location.pathname !== "/") return false;

    // STRICT: Prevent loader on any navigation (even to main page)
    // Only show on actual page reload/refresh
    const navigationEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const navType = navigationEntries[0].type;
      // Only show loader for 'reload' or 'navigate' (first visit)
      // but NOT for 'back_forward' (browser navigation)
      return (
        navType === "reload" || (navType === "navigate" && !document.referrer)
      );
    }

    // Fallback: only if we're on main page with no same-origin referrer
    // This ensures it's a direct visit or reload, not internal navigation
    return (
      !document.referrer || !document.referrer.includes(window.location.origin)
    );
  }, [location.pathname]);

  // CRITICAL: This should ONLY be true for main page hero loading
  // Never for InternalPagesHero or page navigation
  const shouldShowLoader = isMainPageReload();
  const [isLoading, setIsLoading] = useState(shouldShowLoader);
  const [isTransitioning, setIsTransitioning] = useState(shouldShowLoader);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionIn, setTransitionIn] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [minLoaderTimeElapsed, setMinLoaderTimeElapsed] = useState(false);
  const [canFinishLoading, setCanFinishLoading] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(location);
  const [newPageReady, setNewPageReady] = useState(false);

  // Initialize IndexedDB cache on app startup
  useEffect(() => {
    let isInitialized = false;

    const initializeCache = async () => {
      if (isInitialized) return;

      try {
        await CacheManager.initializeCache();
        isInitialized = true;
      } catch (error) {
        console.error("Failed to initialize blog cache:", error);
      }
    };

    initializeCache();
    
    // Add class to disable scroll-snap during initial page load
    document.body.classList.add('page-load');
    
    return () => {
      // Cleanup: remove page-load class
      document.body.classList.remove('page-load');
    };
  }, []);

  // Only allow loader to finish when both hero image and timer are done (and if loader should be shown)
  useEffect(() => {
    if (!shouldShowLoader) {
      setCanFinishLoading(true);
      setHeroImageLoaded(true);
      setMinLoaderTimeElapsed(true);
      return;
    }

    if (heroImageLoaded && minLoaderTimeElapsed) {
      setCanFinishLoading(true);
    }
  }, [heroImageLoaded, minLoaderTimeElapsed, shouldShowLoader]);

  // Start minimum loader timer on mount (only if loader should be shown)
  useEffect(() => {
    if (!shouldShowLoader) {
      setMinLoaderTimeElapsed(true);
      return;
    }

    const timer = setTimeout(() => setMinLoaderTimeElapsed(true), 1200);
    return () => clearTimeout(timer);
  }, [shouldShowLoader]);

  useEffect(() => {
    const html = document.documentElement;
    if (isLoading && shouldShowLoader) {
      html.classList.add("loading");
      document.body.classList.add("loading");
    } else {
      setTimeout(() => {
        html.classList.remove("loading");
        document.body.classList.remove("loading");
        setIsTransitioning(false);
      }, 500);
    }
  }, [isLoading, shouldShowLoader]);

  // Handle page transitions
  useEffect(() => {
    if (location !== pendingLocation) {
      console.log("Location changed to:", location.pathname);
      console.log("Location state:", location.state);

      // Check if skipTransition is set in the location state
      const shouldSkipTransition =
        (location.state as any)?.skipTransition === true;

      if (shouldSkipTransition) {
        console.log("Skipping transition for:", location.pathname);
        // Skip transition entirely
        setPendingLocation(location);
        setPageReady(false);
        // Mark page as ready after a short delay to allow data to load
        setTimeout(() => {
          setPageReady(true);
        }, 100);
        return;
      }

      // Start transition
      setShowTransition(true);
      setTransitionIn(false); // Start with cover
      setPageReady(false); // Reset page ready on navigation

      // After cover animation, update location and start reveal
      setTimeout(() => {
        setPendingLocation(location);
        setTransitionIn(true); // Reveal
      }, 1200); // match animation duration (1.2s)
    }
  }, [location, pendingLocation]);

  // Cleanup effect to reset transition state
  useEffect(() => {
    return () => {
      // Reset transition state on unmount
      setShowTransition(false);
      setTransitionIn(false);
      setPageReady(false);
    };
  }, []);

  // Scroll to top or hero section only after both transition and page are ready
  useEffect(() => {
    if (transitionIn && pageReady) {
      // Hide transition after reveal is complete
      setTimeout(() => {
        setShowTransition(false);
      }, 1200); // Wait for reveal animation to complete

      requestAnimationFrame(async () => {
        // Wait for any current scroll operations to complete
        await scrollManager.waitForScrollComplete();
        
        // List of routes that do NOT use a hero image
        const noHeroRoutes = [
          "/membership",
          "/checkout",
          "/blog",
          "/hubs/agua-de-luna",
          "/hubs/tierrakilwa",
          "/lastest-campaign",
          "/terms",
          "/privacy",
          "/projects",
          "/contact",
          "/blog/article", // match base for dynamic article routes
        ];

        // Check if current route is a no-hero route
        const isNoHeroRoute = noHeroRoutes.some(
          (route) =>
            location.pathname === route ||
            location.pathname.startsWith(route + "/")
        );

        try {
          if (isNoHeroRoute) {
            // For pages without hero, scroll to top
            await scrollManager.scrollTo(0, { immediate: true });
          } else {
            // For pages with hero, scroll to hero section
            await scrollManager.scrollToHero({ immediate: true });
          }
        } catch (error) {
          console.warn('Scroll operation failed, using fallback:', error);
          // Fallback to immediate scroll to top
          window.scrollTo({ top: 0, behavior: "auto" });
        }

        // Delay ScrollTrigger refresh to avoid conflicts with animations
        setTimeout(() => {
          import("./utils/gsap").then(({ ScrollTrigger }) => {
            try {
              // Only refresh if there are active ScrollTriggers
              if (ScrollTrigger.getAll().length > 0) {
                ScrollTrigger.refresh();
              }
            } catch (error) {
              console.warn("ScrollTrigger refresh failed:", error);
            }
          });
        }, 200); // Increased delay to avoid conflicts
      });
    }
  }, [transitionIn, pageReady, location.pathname]);

  const handleTransitionComplete = useCallback(() => {
    // No-op: scroll now handled in useEffect above
  }, []);

  // Called when the hero image is loaded
  const handleHeroImageLoad = useCallback(() => {
    setHeroImageLoaded(true);
  }, []);

  // Called when Loader finishes its progress animation
  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
    // Refresh ScrollTrigger after loader disappears with longer delay
    setTimeout(() => {
      import("./utils/gsap").then(({ ScrollTrigger }) => {
        try {
          // Only refresh if there are active ScrollTriggers
          if (ScrollTrigger.getAll().length > 0) {
            ScrollTrigger.refresh();
          }
        } catch (error) {
          console.warn("ScrollTrigger refresh failed:", error);
        }
      });
    }, 300); // Increased delay to avoid conflicts
  }, []);

  // Helper to pass onPageReady to all pages
  const pageProps = {
    onPageReady: useCallback(() => {
      setPageReady(true);
    }, []),
    onPageStart: useCallback(() => {
      setPageReady(false);
    }, []),
  };

  // Add this useEffect after your other useEffects
  useEffect(() => {
    // List of routes that do NOT use a hero image
    const noHeroRoutes = [
      "/membership",
      "/lastest-campaign",
      "/checkout",
      "/blog",
      "/hubs/agua-de-luna",
      "/hubs/tierrakilwa",
      "/terms",
      "/privacy",
      "/projects",
      "/contact",
      "/blog/article", // match base for dynamic article routes
      // Add any other routes that don't use a hero image
    ];

    // If the current route matches any no-hero route, set heroImageLoaded to true
    if (
      noHeroRoutes.some(
        (route) =>
          location.pathname === route ||
          location.pathname.startsWith(route + "/")
      )
    ) {
      setHeroImageLoaded(true);
    }

    // Handle page transitions for route changes
    if (location !== pendingLocation) {
      // Set transitioning state to true
      setIsTransitioning(true);
      
      // Reset page ready state for new page
      setPageReady(false);
      
      // Update pending location immediately so new page loads
      setPendingLocation(location);
      
      // Reset new page ready state
      setNewPageReady(false);
      
      // Start transition overlay on top of the new page
      setShowTransition(true);
      setTransitionIn(false);
      
      // Wait for new page to be ready, then start transition in
      const checkPageReady = () => {
        if (pageReady) {
          setNewPageReady(true);
          // Start transition in after page is ready
          setTransitionIn(true);
          
          // After transition in completes, hide the transition and reset state
          const revealTimer = setTimeout(() => {
            setShowTransition(false);
            setIsTransitioning(false);
          }, 1500); // Match the CSS animation duration
          
          return () => clearTimeout(revealTimer);
        } else {
          // Check again in 50ms
          setTimeout(checkPageReady, 50);
        }
      };
      
      // Start checking for page readiness
      checkPageReady();
    }
  }, [location, pendingLocation, pageReady]);

  // Fallback: Always finish loading after 5 seconds (in case hero image never loads)
  useEffect(() => {
    if (!shouldShowLoader) return;

    if (!canFinishLoading) {
      const fallback = setTimeout(() => {
        setHeroImageLoaded(true);
        setMinLoaderTimeElapsed(true);
      }, 5000);
      return () => clearTimeout(fallback);
    }
  }, [canFinishLoading, shouldShowLoader]);

  // Ensure scroll position is reset before page unload (for browser scroll restoration)
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Ensure page always starts at hero section on initial load and navigation
  useEffect(() => {
    // Only run scroll management for pages that actually need it
    // Skip for pages that should maintain their scroll position
    const shouldManageScroll = !location.pathname.includes('/contact') && 
                              !location.pathname.includes('/blog') &&
                              !location.pathname.includes('/terms') &&
                              !location.pathname.includes('/privacy');
    
    if (shouldManageScroll) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (
          scrollManager &&
          typeof scrollManager.ensurePageStartsAtTop === "function"
        ) {
          scrollManager.ensurePageStartsAtTop({ immediate: true, force: true });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <LoadingContext.Provider value={isLoading}>
      <PageAnimationContext.Provider value={transitionIn}>
        <div
          className={`app-container ${isTransitioning ? "transitioning" : ""}`}
        >
          {/* 
            MAIN HERO LOADER ONLY:
            This loader should ONLY appear for the main page hero component.
            It should NEVER appear for:
            - InternalPagesHero components
            - Page navigation between routes
            - Any other page loading states
          */}
          {isLoading && shouldShowLoader && location.pathname === "/" && (
            <Loader
              onLoadingComplete={
                canFinishLoading ? handleLoaderComplete : undefined
              }
            />
          )}
          {showTransition && (
            <PageTransition
              onComplete={handleTransitionComplete}
            />
          )}
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <MainPage
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route
                path="/hubs"
                element={
                  <HubsPage
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route
                path="/about"
                element={
                  <AboutUsPage
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route
                path="/stewardship-nft"
                element={
                  <StewardshipNFTPage
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route
                path="/latest-campaign/:campaignId?/:referral?"
                element={
                  <LastestCampaign
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route path="/checkout" element={<Checkout {...pageProps} />} />
              <Route path="/blog" element={<BlogPage {...pageProps} />} />
              <Route
                path="/hubs/nuiyanzhi"
                element={
                  <NuiyanzhiPage
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route
                path="/hubs/agua-de-luna"
                element={<AguaDeLunaPage {...pageProps} />}
              />
              <Route
                path="/hubs/tierrakilwa"
                element={<TierraKilwaPage {...pageProps} />}
              />
              <Route
                path="/terms"
                element={<TermsAndConditionsPage {...pageProps} />}
              />
              <Route
                path="/privacy"
                element={<PrivacyPolicyPage {...pageProps} />}
              />
              <Route
                path="/projects"
                element={
                  <ProjectsPage
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route
                path="/membership/:campaignId/:collectionId/:referral?"
                element={
                  <Membership
                    {...pageProps}
                    onHeroImageLoad={handleHeroImageLoad}
                  />
                }
              />
              <Route path="/contact" element={<ContactUs {...pageProps} />} />
              <Route
                path="/blog/article/:id"
                element={<ArticlePage {...pageProps} />}
              />
              <Route path="*" element={<FourOhFourPage {...pageProps} />} />
            </Routes>
          </Suspense>
        </div>
      </PageAnimationContext.Provider>
    </LoadingContext.Provider>
  );
});

App.displayName = 'App';

export default App;
