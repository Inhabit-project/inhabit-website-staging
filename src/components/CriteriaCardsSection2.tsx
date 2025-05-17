import React from 'react';
import ImpactCard from './ImpactCard';

const criteriaCards = [
  {
    number: '01',
    icon: '/assets/icons/Icon-1.svg',
    title: 'Protect',
    subtitle: 'Nature',
    description: `To purchase and permanently safeguards lands under the INHABIT's groundbreaking legal framework, recognising ecosystems as legal entities with protected rights, while providing specific rights and benefits to individuals who support its regeneration.`,
  },
  {
    number: '02',
    icon: '/assets/icons/Icon-2.svg',
    title: 'Restore',
    subtitle: 'Ecosystems',
    description: `To finance long-term, stewardship-based land regeneration through three-year programs, restoring the full diversity and functionality of the ecosystem—not just planting trees.`,
  },
  {
    number: '03',
    icon: '/assets/icons/Icon-3.svg',
    title: 'Transform',
    subtitle: 'Society',
    description: `To fund the development of hubs dedicated to unique fields of knowledge, fostering the production and dissemination of wisdom, while actively working to expand the corridor and broaden access to transformative knowledge for all.`,
  },
  {
    number: '04',
    icon: '/assets/icons/Icon-4.svg',
    title: 'Improve',
    subtitle: 'Benefits',
    description: `To develop an enhanced and more valuable version of the Stewardship NFT, offering greater benefits to NFT holders while further expanding the corridor.`,
  },
];

const CriteriaCardsSection2: React.FC = () => {
  return (
    <section className="w-full flex flex-col items-center bg-gradient-to-r from-[#E2EDD3] via-[#F2F8EA] to-[#E2EDD3] py-24 px-[clamp(1.5rem,5vw,6.25rem)]">
      <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full max-w-[120rem] mx-auto mb-[2.5rem]">
        <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
          What your NFT enables<br /><strong>4 real-world outcomes</strong>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {criteriaCards.map((card, idx) => (
          <ImpactCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
};

export default CriteriaCardsSection2; 