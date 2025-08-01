import { useRef, useEffect, useState } from "react";
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
import Blog from "../components/Blog";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { useStore } from "../store";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "react-i18next";
import Cursor from "../utils/cursor";
import { scrollManager } from "../utils/scrollManager";

interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
  scrollToSection?: string | null;
}

function MainPage(props: Props) {
  const { onHeroImageLoad, onPageReady, scrollToSection } = props;
  const { t } = useTranslation();

  const { campaigns, campaignsLoading, lastCampaign, getCampaigns } =
    useStore();
  const nftGridRef = useRef<HTMLElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null as unknown as HTMLElement);

  // Track when loader is finished
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    getCampaigns();
    if (onPageReady) {
      // Wrap onPageReady to also set loaderDone
      onPageReady();
      setLoaderDone(true);
    } else {
      setLoaderDone(true);
    }
  }, [onPageReady]);

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
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (scrollManager && typeof scrollManager.scrollToHero === "function") {
          scrollManager.scrollToHero({ immediate: true });
        } else {
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
        <section className="no-scroll-snap hero" aria-label={t('sections.hero')}>
          <Hero
            scrollToRef={videoSectionRef}
            onHeroImageLoad={onHeroImageLoad}
          />
        </section>
        <section
          aria-label={t('sections.video')}
          className="scroll-container"
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
        <section aria-label={t('sections.photo')}>
          <Photo />
        </section>
        <section aria-label={t('sections.infographic')}>
          <Infographic />
        </section>
        <section aria-label={t('sections.impactCards')}>
          <ImpactCardsSection />
        </section>
        <section aria-label={t('sections.testimonials')}>
          <Testimonials />
        </section>
        <section aria-label={t('sections.cta')}>
          <CTA />
        </section>
        <section aria-label={t('sections.blog')}>
          <Blog />
        </section>
        <section aria-label={t('sections.faq')}>
          <FAQ />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MainPage;
