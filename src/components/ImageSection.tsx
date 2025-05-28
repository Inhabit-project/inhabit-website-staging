import React from 'react';

interface ImageSectionProps {
  eyebrow: string;
  heading: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ eyebrow, heading, imageSrc, imageAlt = '' }) => {
  return (
    <section className="relative w-full background-gradient-dark flex flex-col items-center scroll-container">
      {/* Background with decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src="/assets/intro-bg.svg" 
          alt="" 
          className="absolute right-0 h-full opacity-40"
          loading="lazy" 
        />
      </div>
      {/* Content */}
      <div className="z-10 w-full h-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col justify-between min-h-screen">
        {/* Text content */}
        <div className="flex flex-col gap-3">
          {/* Eyebrow text */}
          <p className="eyebrow text-light">
            {eyebrow}
          </p>
          {/* Main heading */}
          <h2 className="heading-2 text-light max-w-[1100px]">
            {heading}
          </h2>
        </div>
        {/* Image container */}
        <div className="self-end w-full md:w-[45rem] h-[16rem] md:h-[22rem] rounded-xl overflow-hidden mt-12">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </section>
  );
};

export default ImageSection; 