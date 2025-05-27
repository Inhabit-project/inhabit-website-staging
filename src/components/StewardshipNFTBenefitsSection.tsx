import React from 'react';

const benefits = [
  {
    icon: '/assets/icons/6.svg',
    eyebrow: 'ASSET RIGHT',
    title: 'Life-long Membership',
    description: `You gain lifelong stewardship and utility rights over tokenized real-world lands.\n\nAs an early backer, you'll receive future NFT versions for free as it evolves over time, entitling you to increasing benefits and returns, with added rights and features offered by the Stewardship NFT 2.0—subject to development`,
  },
  {
    icon: '/assets/icons/2.svg',
    eyebrow: 'ART RIGHTS',
    title: 'Badge of legal protector',
    description: `You receive a unique Artwork created by an exclusive artist. Each piece represents a Migratory Floating Garden from the ecosystem where the HUB is located, featuring a native animal or plant vital to that habitat.\n\nThe unique Art Badge represents your legal stewardship connection to a specific piece of land, granting you access to travel and activate the corridor.`,
  },
  {
    icon: '/assets/icons/4.svg',
    eyebrow: 'STEWARDSHIP RIGHTS',
    title: 'Legal Protector of the land',
    description: `You become part of a legal system of guarantee that recognises Nature as a subject with rights on a specific piece of land.\n\nThis framework, aligned with the Declaration of the Rights of Nature and biocultural principles, helps each of us reclaim our role as guardians of the living ecosystems we depend on—and of which we are an inseparable part.`,
  },
  {
    icon: '/assets/icons/3.svg',
    eyebrow: 'IMPACT RIGHTS',
    title: 'Impact Monitoring',
    description: `Track the progress of the land you help protect through real-time data and geolocation narratives.\n\nFollow its transformation into a biocultural hub with regular updates, visual maps, and impact reports. See KPIs on tree planting, biodiversity growth, and local community impact—all showing your contribution to regeneration in action.`,
  },
  {
    icon: '/assets/icons/5.svg',
    eyebrow: 'GOVERNANCE RIGHTS',
    title: 'Inhabit DAO access',
    description: `You receive governance rights over specific matters as a land guarantor.\n\nYou have a say in decisions involving unexpected changes in land use, shifts in Hub management, or unforeseen events that could affect the relationship between stakeholders and the land—or pose a threat to the Rights of Nature and the integrity of the biocultural mission.`,
  },
  {
    icon: '/assets/icons/1.svg',
    eyebrow: 'UTILITY RIGHTS',
    title: 'Exclusive biocultural Access',
    description: `You gain access to biocultural experiences, events, and workshops within the corridor's HUBS, deepening your connection with the land and the bio-culture of a territory.\n\nBenefits include free or discounted stays and meals, exclusive access to unique experiences, and educational content on reforestation, permaculture, bio-construction, and more.`,
  },
];

const StewardshipNFTBenefitsSection: React.FC = () => (
  <section
    className="w-full py-24 px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-center"
    style={{ background: 'var(--background-gradient-light)' }}
  >
    <div className="max-w-[120rem] w-full mx-auto flex flex-col md:flex-row justify-between gap-8 mb-16">
      <div>
        <h2 className="heading-2 text-secondary max-w-[40.9375rem] mb-4">
          What you get<br />
          <strong>When purchase</strong>
        </h2>
      </div>
      <p className="font-nunito text-[1.75rem] font-light text-[var(--color-secondary)] max-w-[38rem]">
        A limited-supply digital asset that is transferable and permanent, granting its owner lifelong stewardship and utility rights through a blockchain-verified membership contract.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14 w-full max-w-[120rem] mx-auto">
      {benefits.map((b, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-6 min-h-[380px] shadow-lg text-white justify-between"
          style={{
            background: 'var(--color-primary-dark, #162F08)',
            borderRadius: 'var(--radius-2xl, 1.5rem)',
            padding: '2.5rem',
          }}
        >
          <div className="absolute top-10 right-10 w-12 h-12 opacity-80">
            <img src={b.icon} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="eyebrow" >{b.eyebrow}</span>
          <h5 className="heading-5 mb-2">{b.title}</h5>
          <p className="font-nunito text-base font-light whitespace-pre-line opacity-90 mt-auto">{b.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StewardshipNFTBenefitsSection; 