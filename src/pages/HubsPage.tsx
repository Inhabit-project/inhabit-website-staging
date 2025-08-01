import React, { useEffect } from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import HubsMain from '../components/HubsMain';
import FourCriteriaCardsSection from '../components/FourCriteriaCardsSection';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ, { FAQHubs } from '../components/FAQ';
import Footer from '../components/Footer';
import SEOHead from "@/components/SEOHead";
import { useTranslation } from 'react-i18next';

interface HubsPageProps {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
}

const HubsPage: React.FC<HubsPageProps> = ({ onPageReady, onHeroImageLoad }) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <>
      <SEOHead 
        pageType="hubsPage"
        customData={{
          image: "/assets/hubs-hero.webp"
        }}
      />
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">
        {t('common.skipToMainContent')}
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main id="main-content" tabIndex={-1} role="main">
          <section className="hero" aria-label={t('sections.hero')}>
            <InternalPagesHero variant="hubs" onHeroImageLoad={onHeroImageLoad} />
          </section>
          <section aria-label={t('sections.hubs')}>
            <HubsMain />
          </section>
          <section aria-label={t('sections.faq')}>
            <FourCriteriaCardsSection />
          </section>
          <section aria-label={t('sections.cta')}>
            <CTA />
          </section>
          <section aria-label={t('sections.blog')}>
            <Blog />
          </section>
          <section aria-label={t('sections.faq')}>
            <FAQHubs />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HubsPage; 