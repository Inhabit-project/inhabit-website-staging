import React, { useEffect } from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import InfoCard, { InfoCardRightImage } from '../components/InfoCard';
import FAQ, { FAQWhite } from '../components/FAQ';
import CriteriaCardsSection from '../components/CriteriaCardsSection';
import NFTGrid from '../components/NFTGrid';
import NFTComparisonTable from '../components/NFTComparisonTable';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import ImageSection from '../components/ImageSection';
import { Helmet } from 'react-helmet-async';

interface NuiyanzhiPageProps {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
}

const NuiyanzhiPage: React.FC<NuiyanzhiPageProps> = ({ onPageReady, onHeroImageLoad }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <>
      <Helmet>
        <title>{t('nuiyanzhiPage.seoTitle') || 'Ñuiyanzhi Hub | INHABIT'}</title>
        <meta name="description" content={t('nuiyanzhiPage.seoDescription') || t('nuiyanzhiPage.imageSection.eyebrow')} />
        <meta property="og:title" content={t('nuiyanzhiPage.seoTitle') || 'Ñuiyanzhi Hub | INHABIT'} />
        <meta property="og:description" content={t('nuiyanzhiPage.seoDescription') || t('nuiyanzhiPage.imageSection.eyebrow')} />
        <meta property="og:image" content="/assets/1Hub/vision.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Menu />
      {/* Internal Hero Section - custom for Nuiyanzhi */}
      <InternalPagesHero
        variant="nuiyanzhi"
        onHeroImageLoad={onHeroImageLoad}
        // Optionally, you can extend InternalPagesHero to accept custom props for this hub
      />

      {/* Image Section: Nuiyanzhi Vision */}
      <ImageSection
        eyebrow={t('nuiyanzhiPage.imageSection.eyebrow')}
        heading={
          <span dangerouslySetInnerHTML={{ __html: t('nuiyanzhiPage.imageSection.heading') }} />
        }
        imageSrc="/assets/1Hub/vision.webp"
        imageAlt="Nuiyanzhi Vision"
      />

      {/* Section: Four goals to be a HUB */}
      <FAQWhite
        title={t('nuiyanzhiPage.fourCriteria.title')}
        description={t('nuiyanzhiPage.fourCriteria.description')}
        faqItems={t('nuiyanzhiPage.fourCriteria.items', { returnObjects: true }) as any[]}
      />

      {/* Section: The Vision (InfoCard) */}
      <InfoCard
        title={t('nuiyanzhiPage.vision.title')}
        text={t('nuiyanzhiPage.vision.text')}
        imageSrc="/assets/1Hub/vision.webp"
        imageAlt={t('nuiyanzhiPage.vision.imageAlt')}
        logoSrc="/assets/logo.svg"
        logoAlt="INHABIT Logo"
      />

      {/* Section: The Guardians (InfoCardRightImage) */}
      <InfoCardRightImage
        title={t('nuiyanzhiPage.guardians.title')}
        text={t('nuiyanzhiPage.guardians.text')}
        imageSrc="/assets/1Hub/guardians.webp"
        imageAlt={t('nuiyanzhiPage.guardians.imageAlt')}
        logoSrc="/assets/logo.svg"
        logoAlt="INHABIT Logo"
      />

      {/* Section: The Land (InfoCard) */}
      <InfoCard
        title={t('nuiyanzhiPage.land.title')}
        text={t('nuiyanzhiPage.land.text')}
        imageSrc="/assets/1Hub/land.webp"
        showPopupButton={true}
        logoSrc="/assets/logo.svg"
        logoAlt="INHABIT Logo"
      />

      <NFTGrid />
      {/* Section: FAQ */}
      <FAQ
        faqItems={t('nuiyanzhiPage.faq.items', { returnObjects: true }) as any[]}
      />
      <Footer />
    </>
  );
};

export default NuiyanzhiPage; 