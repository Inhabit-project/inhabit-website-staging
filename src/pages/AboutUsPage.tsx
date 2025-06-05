import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ImageSection from '../components/ImageSection';
import InfoCard from '../components/InfoCard';
import { InfoCardRightImage } from '../components/InfoCard';
import MeetOurTeam from '../components/MeetOurTeam';
import LogosSection from '../components/LogosSection';

const AboutUsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">
        Skip to main content
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main id="main-content" role="main" tabIndex={-1}>
          <section aria-label="About Us hero section">
            <InternalPagesHero variant="about" />
          </section>
          <section aria-label="About Us introduction">
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
          <section aria-label="INHABIT SAS information">
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
          <section aria-label="INHABIT Foundation information">
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
          <section aria-label="Meet our team">
            <MeetOurTeam />
          </section>
          <section aria-label="Partners and builders">
            <LogosSection showBuilders showPartners />
          </section>
          <section aria-label="Call to action">
            <CTA />
          </section>
          <section aria-label="Blog posts">
            <Blog />
          </section>
          <section aria-label="Frequently asked questions">
            <FAQ />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUsPage; 