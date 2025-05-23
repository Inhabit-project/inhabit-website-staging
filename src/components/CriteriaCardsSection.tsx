import React from 'react';
import ImpactCard from './ImpactCard';

const impactCards = [
  {
    number: '01',
    icon: '/assets/icons/Icon-1.svg',
    title: 'Nature',
    subtitle: 'Rights',
    description: 'This framework permanently safeguards the land by recognising it as a legal entity with rights, while providing specific rights and benefits to individuals who support its protection and regeneration.',
  },
  {
    number: '02',
    icon: '/assets/icons/Icon-2.svg',
    title: 'Guardians',
    subtitle: 'Rights',
    description: 'This framework provides permanent usage rights and restoration financing to land guardians, creating the essential conditions for long-term regeneration of these lands and the expansion of the ecological corridor.',
  },
  {
    number: '03',
    icon: '/assets/icons/Icon-3.svg',
    title: 'NFT Stewards',
    subtitle: 'Rights',
    description: 'This framework gives NFT stewards stewardship rights over the land, acting as guarantors of nature\u2019s rights. It enables them to monitor and support restoration while enjoying exclusive benefits and access to biodiversity hotspots and essential knowledge.',
  },
  {
    number: '04',
    icon: '/assets/icons/Icon-4.svg',
    title: 'Enforcement',
    subtitle: 'Rights',
    description: 'Smart contracts ensure that the entire framework and stakeholders\u2019 rights are transparently enforced and verifiable, providing a trusted digital system for tracking compliance and enabling meaningful on-site participation in restoration initiatives across the Corridor.',
  },
];

const ImpactLegalInnovationCardsSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col items-center background-gradient-light py-24 px-[clamp(1.5rem,5vw,6.25rem)]">
      <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full max-w-[120rem] mx-auto mb-[2.5rem]">
        <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
        Four Criteria <br /><strong>To Be a HUB</strong>
        </h2>
        <p className="body-M text-secondary max-w-[35rem]">
        The INHABIT framework foresees that each HUB develops four key fields to become a biocultural HUB, developing each one according to its own vision and uniqueness        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {impactCards.map((card, idx) => (
          <ImpactCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
};

export default ImpactLegalInnovationCardsSection; 