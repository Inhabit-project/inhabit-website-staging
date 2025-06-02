import React from 'react';
import { useTranslation } from 'react-i18next';

const StewardshipNFT: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full background-gradient-dark flex flex-col items-center scroll-container">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
              {t('mainPage.stewardshipNFT.title')}
              <br />
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFT.subtitle') }} />
            </h2>
            <p className="body-M text-light max-w-[35rem]">
              {t('mainPage.stewardshipNFT.description')}
            </p>
          </div>

          {/* Image */}
          <div className="self-center relative overflow-hidden">
            <img 
              src="/assets/figma-images/stewardship-nft.webp" 
              alt="Stewardship NFT illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StewardshipNFT; 