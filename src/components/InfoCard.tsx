import React from 'react';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  logoSrc: string;
  logoAlt?: string;
  text: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle = '', logoSrc, logoAlt = '', text, imageSrc, imageAlt = '', className }) => (
  <section className={`relative w-full flex items-center justify-center py-24 background-gradient-dark ${className || ''}`}>
    {/* Optional overlay or pattern can be added here if needed */}
    <div className="container z-10 flex flex-col lg:flex-row w-full items-center justify-between px-0 rounded-[1.25rem] overflow-hidden shadow-lg border border-white/20 backdrop-blur-[200px] bg-white/5">
      {/* Image */}
      <div className="flex-shrink-0 w-full lg:w-1/2 aspect-square flex items-center justify-center bg-secondary">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover rounded-t-[1.25rem] lg:rounded-t-none lg:rounded-l-[1.25rem]" />
      </div>
      {/* Text + Logo + Title */}
      <div className="flex-1 flex flex-col items-start justify-center p-8 lg:p-16 bg-transparent lg:w-1/2">
        <div className="flex mb-8 w-full items-center">
          <span className="flex flex-col flex-1">
            <span className="heading-2 leading-tight text-light">{title}</span>
            {subtitle && (
              <span className="heading-2 text-light leading-tight mt-1">{subtitle}</span>
            )}
          </span>
          <img src={logoSrc} alt={logoAlt} className="h-[9rem] w-auto ml-4" />
        </div>
        <div className="body-S opacity-90 max-w-prose">
          {text.split('\n').map((line, idx) => (
            <p key={idx} className="mb-4 last:mb-0">{line}</p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default InfoCard;

// InfoCard with image on the right side
export const InfoCardRightImage: React.FC<InfoCardProps> = ({ title, subtitle = '', logoSrc, logoAlt = '', text, imageSrc, imageAlt = '', className }) => (
  <section className={`relative w-full flex items-center justify-center py-24 background-gradient-dark ${className || ''}`}>
    {/* Optional overlay or pattern can be added here if needed */}
    <div className="container z-10 flex flex-col lg:flex-row-reverse w-full items-center justify-between px-0 rounded-[1.25rem] overflow-hidden shadow-lg border border-white/20 backdrop-blur-[200px] bg-white/5">
      {/* Image on the right for large screens */}
      <div className="flex-shrink-0 w-full lg:w-1/2 aspect-square flex items-center justify-center bg-secondary">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover rounded-t-[1.25rem] lg:rounded-t-none lg:rounded-r-[1.25rem]" />
      </div>
      {/* Text + Logo + Title */}
      <div className="flex-1 flex flex-col items-start justify-center p-8 lg:p-16 bg-transparent lg:w-1/2">
        <div className="flex mb-8 w-full items-center">
          <span className="flex flex-col flex-1">
            <span className="heading-2 leading-tight text-light">{title}</span>
            {subtitle && (
              <span className="heading-2 text-light leading-tight mt-1">{subtitle}</span>
            )}
          </span>
          <img src={logoSrc} alt={logoAlt} className="h-[9rem] w-auto ml-4" />
        </div>
        <div className="body-S opacity-90 max-w-prose">
          {text.split('\n').map((line, idx) => (
            <p key={idx} className="mb-4 last:mb-0">{line}</p>
          ))}
        </div>
      </div>
    </div>
  </section>
); 