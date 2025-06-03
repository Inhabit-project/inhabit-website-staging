import React from 'react';
import { useTranslation } from 'react-i18next';

const NFTWorksSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section
      className="w-full h-full py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--background-gradient-light)' }}
    >
      <div className="max-w-[160rem] mx-auto flex flex-col gap-24">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.nftWorksSection.title') }} />
          </h2>
          <p className="body-M text-secondary max-w-[35rem]">
            {t('mainPage.nftWorksSection.description')}
          </p>
        </div>
        {/* Step 1 */}
        <div className="flex flex-col lg:flex-row items-end gap-12 ">
          {/* Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/assets/nft.png"
              alt="NFT Stewardship Illustration"
              className="w-full max-w-[100%] h-auto"
            />
          </div>
          {/* Text Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="w-full flex flex-row justify-end">
              <span
                className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
                style={{ fontWeight: 400 }}
              >
                01
              </span>
            </div>
            <div className="w-full max-w-xl">
              <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {t('mainPage.nftWorksSection.steps.0.title')}
              </h3>
              <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
                {t('mainPage.nftWorksSection.steps.0.description')}
              </p>
            </div>
          </div>
        </div>
        {/* Step 2 */}
        <div className="flex flex-col lg:flex-row items-end gap-12 ">
          {/* Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/assets/nft-works/nft-works-step2-image.webp"
              alt="NFT Implementation Illustration"
              className="w-full max-w-[100%] h-auto mix-blend-multiply"
            />
          </div>
          {/* Text Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="w-full flex flex-row justify-end">
              <span
                className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
                style={{ fontWeight: 400 }}
              >
                02
              </span>
            </div>
            <div className="w-full max-w-xl">
              <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {t('mainPage.nftWorksSection.steps.1.title')}
              </h3>
              <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
                {t('mainPage.nftWorksSection.steps.1.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTWorksSection; 