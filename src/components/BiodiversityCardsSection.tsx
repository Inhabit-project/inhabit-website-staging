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

interface BiodiversityCardsSectionProps {
  cards?: Card[];
}

const BiodiversityCardsSection: React.FC<BiodiversityCardsSectionProps> = ({ cards = defaultCards }) => {
  const ref = useRef(null);
  // Optionally, you can add inView logic here if needed
  return (
    <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 transition-opacity duration-500">
      <h2 style={{color: 'red'}}>Biodiversity Cards Section</h2>
      <div ref={ref} className="w-full flex flex-col gap-8">
        {cards.map((card, index) => (
          <BiodiversityCard
            key={index}
            number={card.number}
            title={card.title}
            description={card.description}
            index={index}
            isInView={true} // Always true for now, can be improved
          />
        ))}
      </div>
    </div>
  );
};

export default BiodiversityCardsSection; 