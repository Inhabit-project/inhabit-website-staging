import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BiodiversityCard from './BiodiversityCard';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative w-full bg-[#F6FFEA] flex flex-col items-center">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full mb-[2.5rem]">
            <h2 className="heading-2 text-[#1C3625] max-w-[40.9375rem]">
              Land Tenure<br /><strong>Framework</strong>
            </h2>
            <p className="body-M text-[#1C3625] max-w-[35rem]">
              INHABIT stewardship-based restoration model, is designed to become the most robust and effective approach to ensure the long-term protection and regeneration of degraded lands, while actively engaging everyone in ecosystem stewardship.
            </p>
          </div>

          {/* Image */}
          <div className="w-full relative rounded-xl overflow-hidden">
            <img 
              src="/assets/infographic-1.webp" 
              alt="Land Tenure Framework Infographic"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Scroll-triggered cards */}
          <div ref={ref} className="w-full flex flex-col gap-8">
            {cards.map((card, index) => (
              <BiodiversityCard
                key={index}
                number={card.number}
                title={card.title}
                description={card.description}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Infographic; 