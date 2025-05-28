import React from 'react';

interface InternalPagesHeroProps {
  variant: 'hubs' | 'stewardship' | 'about';
}

const heroContent = {
  hubs: {
    title: 'biocultural',
    strong: 'Hubs',
    description: 'HUBS are like “Migratory Gardens”—they exist in the real world but behave differently; they are "spaces of transition", to experiment ways of relating to ourselves and nature. Places to learn the deepest practices for inhabiting and stewarding lands',
    image: '/assets/hubs-hero.webp',
    alt: 'Hubs Hero',
  },
  stewardship: {
    title: 'Stewardship',
    strong: 'NFT',
    description: 'The Stewardship NFT aims to revolutionise restoration by pioneering a new conservation model that actively involves everyone—offering real benefits and opportunities to reconnect with nature through hands-on ecological stewardship',
    image: '/assets/nft-hero.jpg',
    alt: 'Stewardship NFT Hero',
  },
  about: {
    title: 'About',
    strong: 'Us',
    description: "Our vision is to contribute to the conservation and regeneration of biocultural diversity by facilitating the creation of a global physical corridor that protects vital ecosystems and drives rural social innovation",
    image: '/assets/about-us-hero.webp',
    alt: 'About Us Hero',
  },
  nuiyanzhi: {
    title: 'Ñuiyanzhi',
    strong: 'Hub',
    description: 'By healing degraded soils and reforesting key areas, it restores ecosystem functionality and creates a refuge for endangered species, enabling wildlife movement through an inner ecological corridor that reconnects fragmented landscapes. ',
    image: '/assets/Nuiyanzhi.webp',
    alt: 'Hubs Hero',
  },
};

const InternalPagesHero: React.FC<InternalPagesHeroProps> = ({ variant }) => {
  const { title, strong, description, image, alt } = heroContent[variant];
  return (
    <section className="w-full flex flex-col items-center justify-center py-32 background-gradient-light">
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-start gap-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              {title}<br /><strong>{strong}</strong>
            </h2>
            <p className="body-M text-secondary max-w-[36rem]">
            {description}
            </p>
          </div>
        <div className="w-full flex justify-center">
          <img src={image} alt={alt} className="w-full rounded-xl object-cover" />
        </div>
      </div>
    </section>
  );
};

export default InternalPagesHero; 