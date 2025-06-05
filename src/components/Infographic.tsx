import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import BiodiversityCard from './BiodiversityCard';
import BiodiversityCardsSection from './BiodiversityCardsSection';
import ImpactLegalInnovationCardsSection from './ImpactLegalInnovationCardsSection';

const cardVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const cards = [
  {
    number: '001',
    title: 'Biodiversity Hotspots',
    description: 'Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These "living seed hubs" hosts an "inner corridor" within the land, connecting fragmented landscapes and serving as a refuge for endangered species.'
  },
  {
    number: '002',
    title: 'Community Engagement',
    description: 'Local communities are integral to the success of each HUB. Their traditional knowledge and active participation ensure the sustainable management and protection of these vital ecosystems.'
  },
  {
    number: '003',
    title: 'Research & Education',
    description: 'HUBs serve as living laboratories for scientific research and environmental education, fostering innovation and knowledge sharing for ecosystem restoration.'
  },
  {
    number: '004',
    title: 'Sustainable Practices',
    description: 'Implementing sustainable land management practices that balance ecological health with human needs, ensuring long-term viability of the ecosystems.'
  }
];

const Infographic: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative w-full flex flex-col items-center background-gradient-light">
      {/* Slide 1: Land Tenure Framework */}
      <div className="background-gradient-light w-full flex flex-col items-start justify-center px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.infographic.landTenureTitle') }} />
          </h2>
          <p className="body-M text-secondary max-w-[36rem]">
            {t('mainPage.infographic.landTenureDescription')}
          </p>
        </div>
        <div className="self-center relative overflow-hidden">
          <img 
            src="/assets/infographic-1.webp" 
            alt="Land Tenure Framework Infographic"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Slide 2: NFT Stewards */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] mb-[5rem]">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col ">
          <h2 className="heading-2 text-secondary mb-6" dangerouslySetInnerHTML={{ __html: t('mainPage.infographic.nftStewardsTitle') }} />
          <p className="body-M text-secondary">
            {t('mainPage.infographic.nftStewardsDescription')}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem] h-[43.75rem]">
            <img 
              src="/assets/stewards-illustration.svg" 
              alt="NFT Stewards Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
      {/* Slide 3: Nature */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] mb-[5rem]">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col justify-start">
          <h2 className="heading-2 text-secondary mb-6">{t('mainPage.infographic.natureTitle')}</h2>
          <p className="body-M text-secondary">
            {t('mainPage.infographic.natureDescription')}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem] h-[43.75rem]">
            <img 
              src="/assets/nature-illustration.svg" 
              alt="Nature Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
      {/* Slide 4: Guardians */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] mb-[5rem]">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col">
          <h2 className="heading-2 text-secondary mb-6">{t('mainPage.infographic.guardiansTitle')}</h2>
          <p className="body-M text-secondary">
            {t('mainPage.infographic.guardiansDescription')}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem] h-[43.75rem]">
            <img 
              src="/assets/guardians-illustration.svg" 
              alt="Guardians Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
      {/* New Impact Cards Section */}
      <ImpactLegalInnovationCardsSection />
    </section>
  );
};

export default Infographic; 