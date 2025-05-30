import React from 'react';
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


const StewardshipNFTPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <InternalPagesHero variant="stewardship" />
    <ImageSection
      eyebrow="The power of our NFTs"
      heading={
        <>
          Holding an <span className="highlighted-text">NFT</span> makes you a <span className="highlighted-text">co-creator of a global corridor</span> one<br />
          you can travel, safeguard, and <span className="highlighted-text">regenerate biodiversity</span>.
        </>
      }
      imageSrc="/assets/power-nft.webp"
      imageAlt="Stewardship NFT Benefits"
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

export default StewardshipNFTPage; 