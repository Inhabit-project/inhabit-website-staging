import React from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import InfoCard, { InfoCardRightImage } from '../components/InfoCard';
import FAQ, { FAQWhite } from '../components/FAQ';
import CriteriaCardsSection from '../components/CriteriaCardsSection';
import NFTGrid from '../components/NFTGrid';
import NFTComparisonTable from '../components/NFTComparisonTable';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const NuiyanzhiPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Menu />
      {/* Internal Hero Section - custom for Nuiyanzhi */}
      <InternalPagesHero
        variant="nuiyanzhi"
        // Optionally, you can extend InternalPagesHero to accept custom props for this hub
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
        logoSrc="/assets/inhabit-logo.svg"
        logoAlt="INHABIT Logo"
      />

      {/* Section: The Guardians (InfoCardRightImage) */}
      <InfoCardRightImage
        title={t('nuiyanzhiPage.guardians.title')}
        text={t('nuiyanzhiPage.guardians.text')}
        imageSrc="/assets/1Hub/guardians.webp"
        imageAlt={t('nuiyanzhiPage.guardians.imageAlt')}
        logoSrc="/assets/inhabit-logo.svg"
        logoAlt="INHABIT Logo"
      />

      {/* Section: The Land (InfoCard) */}
      <InfoCard
        title={t('nuiyanzhiPage.land.title')}
        text={t('nuiyanzhiPage.land.text')}
        imageSrc="/assets/1Hub/land.webp"
        imageAlt={t('nuiyanzhiPage.land.imageAlt')}
        showPopupButton={true}
        logoSrc="/assets/inhabit-logo.svg"
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