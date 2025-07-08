import React, { useState, createContext, useEffect } from "react";

import "@/i18n";
import "@/utils/gsap";
import "@fontsource/nunito-sans/400.css";

import Loader from "@/components/Loader";
import { scrollManager } from "@/utils/scrollManager";
import PageTransition from '@/components/PageTransition';
import { useLocation } from 'react-router-dom';
import { useScrollToTopOnNavigation } from '@/utils/scrollToTopOnNavigation';

import { Routes, Route } from "react-router-dom";

import MainPage from "@/pages/MainPage";
import HubsPage from "@/pages/HubsPage";
import AboutUsPage from "@/pages/AboutUsPage";
import StewardshipNFTPage from "@/pages/StewardshipNFTPage";
import Checkout from "@/components/Checkout";
import BlogPage from "@/pages/BlogPage";
import NuiyanzhiPage from "@/pages/NuiyanzhiPage";
import AguaDeLunaPage from "@/pages/AguaDeLunaPage";
import TierraKilwaPage from "@/pages/tierrakilwaPage";
import FourOhFourPage from "@/pages/404";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ContactPage from "@/pages/ContactPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ArticlePage from "@/pages/ArticlePage";
import Cursor from './utils/cursor';

// Create a context for the loading state
export const LoadingContext = createContext<boolean>(false);

const App: React.FC = () => {
  useScrollToTopOnNavigation();
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

  // Handle page transitions
  useEffect(() => {
    if (location !== pendingLocation) {
      setShowTransition(true);
      setTransitionIn(false); // Start with cover
      setPageReady(false); // Reset page ready on navigation
      setTimeout(() => {
        setPendingLocation(location);
        setTransitionIn(true); // Reveal
      }, 1200); // match animation duration (1.2s)
    }
  }, [location]);

  // Scroll to top only after both transition and page are ready
  useEffect(() => {
    if (transitionIn && pageReady) {
      setShowTransition(false);
      setTimeout(() => {
        if (scrollManager && typeof scrollManager.scrollTo === "function") {
          scrollManager.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
        // Refresh ScrollTrigger after page transition completes
        setTimeout(() => {
          // Dynamically import to avoid SSR issues
          import('./utils/gsap').then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }, 100);
      }, 50);
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
      '/checkout',
      '/blog',
      '/hubs/agua-de-luna',
      '/hubs/tierrakilwa',
      '/terms',
      '/privacy',
      '/projects',
      '/contact',
      '/blog/article', // match base for dynamic article routes
      // Add any other routes that don't use a hero image
    ];

    // If the current route matches any no-hero route, set heroImageLoaded to true
    if (noHeroRoutes.some(route => location.pathname === route || location.pathname.startsWith(route + '/'))) {
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

  useEffect(() => {
    const cursor = new Cursor();
    return () => {
      cursor.destroy();
    };
  }, []);

  return (
    <LoadingContext.Provider value={isLoading}>
      <div
        className={`app-container ${isTransitioning ? "transitioning" : ""}`}
      >
        {isLoading && (
          <Loader onLoadingComplete={canFinishLoading ? handleLoaderComplete : undefined} />
        )}
        {showTransition && (
          <PageTransition in={transitionIn} onComplete={handleTransitionComplete} />
        )}
        <Routes location={pendingLocation}>
          <Route path="/" element={<MainPage {...pageProps} onHeroImageLoad={handleHeroImageLoad} />} />
          <Route path="/hubs" element={<HubsPage {...pageProps} onHeroImageLoad={handleHeroImageLoad} />} />
          <Route path="/about" element={<AboutUsPage {...pageProps} onHeroImageLoad={handleHeroImageLoad} />} />
          <Route path="/stewardship-nft" element={<StewardshipNFTPage {...pageProps} onHeroImageLoad={handleHeroImageLoad} />} />
          <Route path="/checkout" element={<Checkout {...pageProps} />} />
          <Route path="/blog" element={<BlogPage {...pageProps} />} />
          <Route path="/hubs/nuiyanzhi" element={<NuiyanzhiPage {...pageProps} onHeroImageLoad={handleHeroImageLoad} />} />
          <Route path="/hubs/agua-de-luna" element={<AguaDeLunaPage {...pageProps} />} />
          <Route path="/hubs/tierrakilwa" element={<TierraKilwaPage {...pageProps} />} />
          <Route path="/terms" element={<TermsAndConditionsPage {...pageProps} />} />
          <Route path="/privacy" element={<PrivacyPolicyPage {...pageProps} />} />
          <Route path="/projects" element={<ProjectsPage {...pageProps} onHeroImageLoad={handleHeroImageLoad} />} />
          <Route path="/contact" element={<ContactPage {...pageProps} />} />
          <Route path="/blog/article/:id" element={<ArticlePage {...pageProps} />} />
          <Route path="*" element={<FourOhFourPage {...pageProps} />} />
        </Routes>
      </div>
    </LoadingContext.Provider>
  );
};

export default App;
