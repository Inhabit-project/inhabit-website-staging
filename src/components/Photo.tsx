import React from 'react';

const Photo: React.FC = () => {
  return (
    <div className="w-full">
      {/* Photo 1 */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img 
            src="/assets/photo1.webp" 
            alt="Person in natural environment" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 md:bottom-auto md:top-[clamp(1.5rem,5vw,6.25rem)] right-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-secondary/80 backdrop-blur-[18.9px] p-4 md:p-8 rounded-[20px] mx-4 md:mx-0">
            <p className="body-M text-light">
              By buying an NFT you become a lifelong steward of a specific Hub, allowing you to monitor and participate in important decisions that affect these ecosystems, and gain exclusive access to bio-cultural experiences, events, workshops, visit the hubs and explore the whole Corridor.
            </p>
          </div>
        </div>
      </section>

      {/* Photo 2 */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img 
            src="/assets/photo-2.webp" 
            alt="Natural environment" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 md:bottom-auto md:top-[clamp(1.5rem,5vw,6.25rem)] left-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-secondary/80 backdrop-blur-[18.9px] p-4 md:p-8 rounded-[20px] mx-4 md:mx-0">
            <p className="body-M text-light">
              The funds raised from these NFTs are used to acquire degraded lands and transform them into Bio-Cultural Hubs.
              These areas are protected under the INHABIT land tenure framework—a pioneering model of natural reserves that grants legal rights to nature, redefining land protection and stewardship at a new level.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Photo; 