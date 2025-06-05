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
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">
        Skip to main content
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main id="main-content" role="main" tabIndex={-1}>
          <section aria-label="Stewardship NFT hero section">
            <InternalPagesHero variant="stewardship" />
          </section>
          <section aria-label="Stewardship NFT introduction">
            <ImageSection
              eyebrow={t('mainPage.stewardshipNFTPage.imageSection.eyebrow')}
              heading={
                <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFTPage.imageSection.heading') }} />
              }
              imageSrc="/assets/power-nft.webp"
              imageAlt={t('mainPage.stewardshipNFTPage.imageSection.imageAlt')}
            />
          </section>
          <section aria-label="Stewardship NFT benefits">
            <StewardshipNFTBenefitsSection />
          </section>
          <section aria-label="Stewardship NFT highlight">
            <Highlight />
          </section>
          <section aria-label="How Stewardship NFT works">
            <NFTWorksSection />
          </section>
          <section aria-label="Stewardship NFT criteria">
            <CriteriaCardsSection2 />
          </section>
          <section aria-label="Available Stewardship NFTs">
            <NFTGrid />
          </section>
          <section aria-label="Blog posts">
            <Blog />
          </section>
          <section aria-label="Call to action">
            <CTA />
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

export default StewardshipNFTPage; 