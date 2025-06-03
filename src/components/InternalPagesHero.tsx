import React from 'react';
import { useTranslation } from 'react-i18next';

interface InternalPagesHeroProps {
  variant: 'hubs' | 'stewardship' | 'about' | 'nuiyanzhi';
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
};

const InternalPagesHero: React.FC<InternalPagesHeroProps> = ({ variant, title, strong, description, image, alt }) => {
  const { t } = useTranslation();
  const content = heroContent[variant];
  const tKey = `internalPagesHero.${variant}`;
  return (
    <section className="w-full flex flex-col items-center justify-center py-32 background-gradient-light">
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-start gap-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
            <span dangerouslySetInnerHTML={{ __html: title || t(`${tKey}.title`) }} />
            <br />
            <strong>
              <span dangerouslySetInnerHTML={{ __html: strong || t(`${tKey}.strong`) }} />
            </strong>
          </h2>
          <p className="body-M text-secondary max-w-[36rem]">
            {description || t(`${tKey}.description`)}
          </p>
        </div>
        <div className="w-full flex justify-center">
          <img src={image || content.image} alt={alt || content.alt} className="w-full rounded-xl object-cover" />
        </div>
      </div>
    </section>
  );
};

export default InternalPagesHero; 