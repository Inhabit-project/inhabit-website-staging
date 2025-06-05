import React, { useRef } from 'react';
import BiodiversityCard from './BiodiversityCard';

const defaultCards = [
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

interface Card {
  number: string;
  title: string;
  description: string;
}

const BiodiversityCardsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 background-gradient-light"
      aria-labelledby="biodiversity-cards-title"
    >
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)]">
        <h2 
          id="biodiversity-cards-title"
          className="heading-2 text-secondary mb-16"
        >
          Hub Criteria
        </h2>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
          aria-label="Hub criteria cards"
        >
          {defaultCards.map((card, index) => (
            <div 
              key={card.number}
              role="listitem"
              aria-labelledby={`card-${card.number}-title`}
            >
              <BiodiversityCard
                number={card.number}
                title={card.title}
                description={card.description}
                id={`card-${card.number}-title`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BiodiversityCardsSection; 