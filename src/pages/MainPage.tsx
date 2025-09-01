import React, { useRef, useEffect, useState, memo, useCallback, Suspense, lazy } from "react";
import Menu from "../components/Menu";
import Hero from "../components/Hero";
import Video from "../components/Video";
import Hubs from "../components/Hubs";
import StewardshipNFT from "../components/StewardshipNFT";
import Highlight from "../components/Highlight";
import NFTGrid from "../components/NFTGrid";
import Photo from "../components/Photo";
import Infographic from "../components/Infographic";
import ImpactCardsSection from "../components/ImpactCardsSection";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Blog from "../components/blog/Blog";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { useStore } from "../store";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";
import Cursor from "../utils/cursor";
import { scrollManager } from "../utils/scrollManager";

// Lazy load non-critical components for better initial page load
const LazyPhoto = lazy(() => import("../components/Photo"));
const LazyInfographic = lazy(() => import("../components/Infographic"));
const LazyImpactCardsSection = lazy(() => import("../components/ImpactCardsSection"));
const LazyTestimonials = lazy(() => import("../components/Testimonials"));
const LazyCTA = lazy(() => import("../components/CTA"));
const LazyBlog = lazy(() => import("../components/blog/Blog"));
const LazyFAQ = lazy(() => import("../components/FAQ"));

interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
  scrollToSection?: string | null;
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-48"></div>
  </div>
);

function MainPage(props: Props) {
  const { onHeroImageLoad, onPageReady, scrollToSection } = props;
  const { t } = useTranslation();

  const { campaigns, campaignsLoading, lastCampaign, getCampaigns } =
    useStore();
  const nftGridRef = useRef<HTMLElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null as unknown as HTMLElement);

  // Track when loader is finished
  const [loaderDone, setLoaderDone] = useState(false);

  const handleGetCampaigns = useCallback(() => {
    getCampaigns();
  }, [getCampaigns]);

  const handlePageReady = useCallback(() => {
    if (onPageReady) {
      onPageReady();
    }
    setLoaderDone(true);
  }, [onPageReady]);

  useEffect(() => {
    handleGetCampaigns();
    handlePageReady();
  }, [handleGetCampaigns, handlePageReady]);

  useEffect(() => {
    // Only scroll to NFT grid if explicitly requested and not on initial page load
    if (
      scrollToSection === "nftGrid" &&
      nftGridRef.current &&
      !campaignsLoading &&
      campaigns.length > 0 &&
      // Add a small delay to ensure hero section loads first
      loaderDone
    ) {
      // Add a delay to ensure hero section is properly loaded first
      setTimeout(() => {
        const offset = -100;
        const y =
          nftGridRef.current!.getBoundingClientRect().top +
          window.scrollY +
          offset;

        window.scrollTo({ top: y, behavior: "auto" });
      }, 500); // Delay to ensure hero section loads first
    }
  }, [scrollToSection, campaignsLoading, campaigns, loaderDone]);

  useEffect(() => {
    if (!loaderDone) return;
    const cursor = new Cursor();
    return () => {
      cursor.destroy();
    };
  }, [loaderDone]);

  // Ensure page always starts at hero section
  useEffect(() => {
    if (loaderDone && !scrollToSection) {
      // Force scroll to top first
      window.scrollTo({ top: 0, behavior: "auto" });
      
      // Also reset body and document scroll positions
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(async () => {
        try {
          await scrollManager.scrollToHero({ immediate: true });
        } catch (error) {
          console.warn('Scroll to hero failed, using fallback:', error);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loaderDone, scrollToSection]);

  return (
    <>
      <SEOHead 
        pageType="hero"
        customData={{
          image: "/assets/hero.webp"
        }}
      />
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded"
      >
        {t('common.skipToMainContent')}
      </a>
      <Menu />
      <main id="main-content" tabIndex={-1} role="main">
        {/* Critical above-the-fold content - load immediately */}
        <section className="no-scroll-snap hero" aria-label={t('sections.hero')}>
          <Hero
            scrollToRef={videoSectionRef}
            onHeroImageLoad={onHeroImageLoad}
          />
        </section>
        
        {/* High priority content - load after hero */}
        <section
          aria-label={t('sections.video')}
          className=""
          ref={videoSectionRef}
        >
          <Video />
        </section>
        
        <section aria-label={t('sections.hubs')}>
          <Hubs />
        </section>
        
        <section aria-label={t('sections.stewardshipNFT')}>
          <StewardshipNFT />
        </section>
        
        <section aria-label={t('sections.highlight')}>
          <Highlight />
        </section>
        
        <section ref={nftGridRef} aria-label={t('sections.nftGrid')}>
          {!campaignsLoading &&
                          (!lastCampaign ? (
                <p className="text-lg text-gray-500">{t('common.noCampaignsAvailable')}</p>
            ) : (
              <NFTGrid key={lastCampaign.id} campaign={lastCampaign} />
            ))}
        </section>
        
        {/* Lazy load below-the-fold content for better performance */}
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.photo')}>
            <LazyPhoto />
          </section>
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.infographic')}>
            <LazyInfographic />
          </section>
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.impactCards')}>
            <LazyImpactCardsSection />
          </section>
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.testimonials')}>
            <LazyTestimonials />
          </section>
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.cta')}>
            <LazyCTA />
          </section>
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.blog')}>
            <LazyBlog />
          </section>
        </Suspense>
        
        <Suspense fallback={<LoadingFallback />}>
          <section aria-label={t('sections.faq')}>
            <LazyFAQ />
          </section>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default memo(MainPage);
