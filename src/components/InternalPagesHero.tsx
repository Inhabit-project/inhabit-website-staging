import React from 'react';
import { useTranslation } from 'react-i18next';

interface InternalPagesHeroProps {
  variant: 'hubs' | 'stewardship' | 'about' | 'nuiyanzhi' | 'projects';
  title?: string;
  strong?: string;
  description?: string;
  image?: string;
  alt?: string;
}

const heroContent = {
  hubs: {
    image: '/assets/hubs-hero.webp',
    alt: 'Hubs Hero',
  },
  stewardship: {
    image: '/assets/nft-hero.jpg',
    alt: 'Stewardship NFT Hero',
  },
  about: {
    image: '/assets/about-us-hero.webp',
    alt: 'About Us Hero',
  },
  nuiyanzhi: {
    image: '/assets/Nuiyanzhi.webp',
    alt: 'Hubs Hero',
  },
  projects: {
    image: '/assets/nft-hero.jpg',
    alt: 'Projects Hero',
  },
};

const InternalPagesHero: React.FC<InternalPagesHeroProps> = ({ variant, title, strong, description, image, alt }) => {
  const { t } = useTranslation();
  const content = heroContent[variant];
  const tKey = `internalPagesHero.${variant}`;
  const heroTitleId = `${variant}-hero-title`;
  const heroDescriptionId = `${variant}-hero-description`;

  return (
    <section 
      className="w-full flex flex-col items-center justify-center min-h-screen py-8 md:py-32 background-gradient-light pt-32"
      aria-labelledby={heroTitleId}
    >
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col justify-between h-full flex-1 md:items-start md:gap-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full md:mb-[2.5rem]">
          <h1 
            id={heroTitleId}
            className="heading-2 text-secondary max-w-[40.9375rem]"
          >
            <span dangerouslySetInnerHTML={{ __html: title || t(`${tKey}.title`) }} />
            <br />
            <strong>
              <span dangerouslySetInnerHTML={{ __html: strong || t(`${tKey}.strong`) }} />
            </strong>
          </h1>
          <p 
            id={heroDescriptionId}
            className="body-M text-secondary max-w-[36rem]"
            aria-labelledby={heroTitleId}
          >
            {description || t(`${tKey}.description`)}
          </p>
        </div>
        <div className="w-full flex justify-center">
          <img 
            src={image || content.image} 
            alt={alt || content.alt} 
            className="w-full rounded-xl object-cover"
            loading="lazy"
            aria-describedby={heroDescriptionId}
          />
        </div>
      </div>
    </section>
  );
};

export default InternalPagesHero; 