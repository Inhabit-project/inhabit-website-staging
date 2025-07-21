import React, { useState, createContext, useEffect, Suspense } from "react";

import "@/i18n";
import "@/utils/gsap";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/abel/400.css";
import "@fontsource/montserrat/400.css";

import Loader from "@/components/Loader";
import PageTransition from "@/components/PageTransition";
import { useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";

import { Routes, Route } from "react-router-dom";

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
const Membership = React.lazy(() => import("@/pages/Membership"));
const ContactUs = React.lazy(() => import("@/pages/ContactUs"));

import Cursor from "./utils/cursor";

// Create a context for the loading state
export const LoadingContext = createContext<boolean>(false);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionIn, setTransitionIn] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [minLoaderTimeElapsed, setMinLoaderTimeElapsed] = useState(false);
  const [canFinishLoading, setCanFinishLoading] = useState(false);
  const location = useLocation();
  const [pendingLocation, setPendingLocation] = useState(location);

  // Only allow loader to finish when both hero image and timer are done
  useEffect(() => {
    if (heroImageLoaded && minLoaderTimeElapsed) {
      setCanFinishLoading(true);
    }
  }, [heroImageLoaded, minLoaderTimeElapsed]);

  // Start minimum loader timer on mount
  useEffect(() => {
    const timer = setTimeout(() => setMinLoaderTimeElapsed(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isLoading) {
      html.classList.add("loading");
      document.body.classList.add("loading");
    } else {
      setTimeout(() => {
        html.classList.remove("loading");
        document.body.classList.remove("loading");
        setIsTransitioning(false);
      }, 500);
    }
  }, [isLoading]);

  useEffect(() => {
    if (location !== pendingLocation) {
      if ((location.state as any)?.skipTransition) {
        setPendingLocation(location); // actualiza ruta sin overlay
        return;
      }
      setShowTransition(true);
      setTransitionIn(false);
      setPageReady(false);
      setTimeout(() => {
        setPendingLocation(location);
        setTransitionIn(true);
      }, 1200);
    }
  }, [location]);

  // Scroll to top only after both transition and page are ready
  useEffect(() => {
    if (transitionIn && pageReady) {
      setShowTransition(false);

      requestAnimationFrame(() => {
        // refresca ScrollTrigger igual
        setTimeout(() => {
          import("./utils/gsap").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }, 100);
      });
    }
  }, [transitionIn, pageReady]);

  const handleTransitionComplete = () => {
    // No-op: scroll now handled in useEffect above
  };

  // Called when the hero image is loaded
  const handleHeroImageLoad = () => {
    setHeroImageLoaded(true);
  };

  // Called when Loader finishes its progress animation
  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  // Helper to pass onPageReady to all pages
  const pageProps = { onPageReady: () => setPageReady(true) };

  // Add this useEffect after your other useEffects
  useEffect(() => {
    // List of routes that do NOT use a hero image
    const noHeroRoutes = [
      "/checkout",
      "/blog",
      "/hubs/agua-de-luna",
      "/hubs/tierrakilwa",
      "/membership",
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
  }, [location]);

  // Fallback: Always finish loading after 5 seconds (in case hero image never loads)
  useEffect(() => {
    if (!canFinishLoading) {
      const fallback = setTimeout(() => {
        setHeroImageLoaded(true);
        setMinLoaderTimeElapsed(true);
      }, 5000);
      return () => clearTimeout(fallback);
    }
  }, [canFinishLoading]);

  // Scroll to top on initial mount (page refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    const cursor = new Cursor();
    return () => {
      cursor.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Ensure scroll is at the very top after loader disappears
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 10);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={isLoading}>
      <ScrollToTop />

      <div
        className={`cursor-default app-container ${
          isTransitioning ? "transitioning" : ""
        }`}
      >
        {isLoading && (
          <Loader
            onLoadingComplete={
              canFinishLoading ? handleLoaderComplete : undefined
            }
          />
        )}
        {showTransition && (
          <PageTransition
            in={transitionIn}
            onComplete={handleTransitionComplete}
          />
        )}
        <Suspense fallback={<Loader />}>
          <Routes location={pendingLocation}>
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
              path="/membership/:campaignId/:collectionId/:referral?"
              element={
                <Membership
                  {...pageProps}
                  onHeroImageLoad={handleHeroImageLoad}
                />
              }
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
            <Route path="/contact" element={<ContactUs {...pageProps} />} />
            <Route
              path="/blog/article/:id"
              element={<ArticlePage {...pageProps} />}
            />
            <Route path="*" element={<FourOhFourPage {...pageProps} />} />
          </Routes>
        </Suspense>
      </div>
    </LoadingContext.Provider>
  );
};

export default App;
