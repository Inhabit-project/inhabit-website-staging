import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import ImageSection from '../components/ImageSection';
import InfoCard from '../components/InfoCard';
import { InfoCardRightImage } from '../components/InfoCard';
import MeetOurTeam from '../components/MeetOurTeam';
import LogosSection from '../components/LogosSection';
import { Helmet } from 'react-helmet-async';
import SEOHead from "@/components/SEOHead";

interface AboutUsPageProps {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onPageReady, onHeroImageLoad }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <>
      <SEOHead 
        pageType="aboutUsPage"
        customData={{
          image: "/assets/about-us-hero.webp"
        }}
      />
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">
        {t('common.skipToMainContent')}
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main id="main-content" role="main" tabIndex={-1}>
          <section className="hero" aria-label={t('sections.hero')}>
            <InternalPagesHero variant="about" onHeroImageLoad={onHeroImageLoad} />
          </section>
          <section aria-label={t('sections.photo')}>
            <ImageSection
              eyebrow={t('aboutUsPage.eyebrow')}
              heading={
                <span
                  dangerouslySetInnerHTML={{ __html: t('aboutUsPage.heading') }}
                />
              }
              imageSrc="/assets/about.webp"
              imageAlt={t('aboutUsPage.teamImageAlt')}
            />
          </section>
          <section aria-label={t('sections.photo')}>
            <InfoCard
              title={t('aboutUsPage.sasTitle')}
              subtitle={t('aboutUsPage.sasSubtitle')}
              logoSrc="/assets/sas-logo.svg"
              logoAlt="INHABIT SAS Logo"
              text={t('aboutUsPage.sasText')}
              imageSrc="/assets/inhabit-sas.webp"
              imageAlt="INHABIT SAS About Card"
            />
          </section>
          <section aria-label={t('sections.photo')}>
            <InfoCardRightImage
              title={t('aboutUsPage.foundationTitle')}
              subtitle={t('aboutUsPage.foundationSubtitle')}
              logoSrc="/assets/foundation-logo.svg"
              logoAlt="INHABIT Foundation Logo"
              text={t('aboutUsPage.foundationText')}
              imageSrc="/assets/inhabit-foundation.webp"
              imageAlt="INHABIT Foundation Vision Card"
            />
          </section>
          <section aria-label={t('sections.testimonials')}>
            <MeetOurTeam />
          </section>
          <section aria-label={t('sections.infographic')}>
            <LogosSection showBuilders showPartners />
          </section>
          <section aria-label={t('sections.cta')}>
            <CTA />
          </section>
          <section aria-label={t('sections.blog')}>
            <Blog />
          </section>
          <section aria-label={t('sections.faq')}>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUsPage; 