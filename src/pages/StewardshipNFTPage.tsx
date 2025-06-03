import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ImageSection from '../components/ImageSection';
import StewardshipNFTBenefitsSection from '../components/StewardshipNFTBenefitsSection';
import Highlight from '../components/Highlight';
import NFTWorksSection from '../components/NFTWorksSection';
import CriteriaCardsSection2 from '../components/CriteriaCardsSection2';
import NFTGrid from '../components/NFTGrid';


const StewardshipNFTPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <InternalPagesHero variant="stewardship" />
      <ImageSection
        eyebrow={t('mainPage.stewardshipNFTPage.imageSection.eyebrow')}
        heading={
          <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFTPage.imageSection.heading') }} />
        }
        imageSrc="/assets/power-nft.webp"
        imageAlt={t('mainPage.stewardshipNFTPage.imageSection.imageAlt')}
      />
      <StewardshipNFTBenefitsSection />
      <Highlight />
      <NFTWorksSection />
      <CriteriaCardsSection2 />
      <NFTGrid />
      <Blog />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
};

export default StewardshipNFTPage; 