import React from 'react';

interface InternalPagesHeroProps {
  title: string;
  strong: string;
}

const InternalPagesHero: React.FC<InternalPagesHeroProps> = ({
  title,
  strong,
}) => {
  return (
    <section className="w-full flex flex-col items-center justify-center py-24 background-gradient-light mt-24">
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-start gap-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              Bio-cultural<br /><strong>Hubs</strong>
            </h2>
            <p className="body-M text-secondary max-w-[36rem]">
            "HUBS are like “Migratory Gardens”—they exist in the real world but behave differently; they are "spaces of transition", new ways of relating to ourselves and nature. Places to learn the deepest practices and skills for inhabiting and stewarding lands"
            </p>
          </div>
        <div className="w-full flex justify-center">
          <img src="/assets/hubs-hero.jpg" alt="Hubs Hero" className="w-full  object-cover" />
        </div>
      </div>
    </section>
  );
};

export default InternalPagesHero; 