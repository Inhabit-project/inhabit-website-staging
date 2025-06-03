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
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <InternalPagesHero variant="about" />
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
      <InfoCard
        title={t('aboutUsPage.sasTitle')}
        subtitle={t('aboutUsPage.sasSubtitle')}
        logoSrc="/assets/sas-logo.svg"
        logoAlt="INHABIT Logo"
        text={t('aboutUsPage.sasText')}
        imageSrc="/assets/inhabit-sas.webp"
        imageAlt="INHABIT About Card"
      />
      <InfoCardRightImage
        title={t('aboutUsPage.foundationTitle')}
        subtitle={t('aboutUsPage.foundationSubtitle')}
        logoSrc="/assets/foundation-logo.svg"
        logoAlt="INHABIT Logo"
        text={t('aboutUsPage.foundationText')}
        imageSrc="/assets/inhabit-foundation.webp"
        imageAlt="Vision Card"
      />
      <MeetOurTeam />
      <LogosSection showBuilders showPartners />
      {/* Main About Us content goes here, e.g. <AboutUs /> */}
      <CTA />
      <Blog />
      <FAQ />
      <Footer />
    </div>
  );
};

export default AboutUsPage; 