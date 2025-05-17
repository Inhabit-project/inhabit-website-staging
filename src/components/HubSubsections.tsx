import React, { useState } from 'react';
import DownloadButton from './DownloadButton';

interface HubSubsectionsProps {
  backgroundImage: string;
  mapImage: string;
  label: string;
  title: string;
  description: string;
  visionHeading: string;
  visionText: string;
  onDownload?: () => void;
}

const sliderImages = [
  '/assets/footer-bg.webp',
  '/assets/forest.jpg',
  '/assets/photo-2.webp',
  '/assets/sierra.jpg',
];

const HubSubsections: React.FC<HubSubsectionsProps> = ({
  backgroundImage,
  mapImage,
  label,
  title,
  description,
  visionHeading,
  visionText,
  onDownload,
}) => {
  const [current, setCurrent] = useState(0);
  const bgImage = sliderImages[current];

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background image slider */}
      <div className="absolute inset-0 w-full h-full z-0 transition-all duration-700">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-700 opacity-100"
          style={{ transition: 'opacity 0.7s' }}
        />
      </div>
      {/* Overlay for darkening if needed */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      {/* Main content wrapper for left alignment and vertical centering */}
      <div className="container relative z-20 flex w-full max-w-5xl items-center justify-start ">
        {/* Download button */}
        <div className="absolute top-0 right-16 z-30">
          <button
            className="btn-primary flex items-center gap-2 px-6"
            type="button"
          >
            Become a Steward for this Hub
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 15L15 5M15 5H7M15 5V13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* Card */}
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl flex flex-col p-8 gap-2">
          {/* Map image */}
          <img src={mapImage} alt="Map" className="w-full h-40 object-cover rounded-lg mb-4" />
          <span className="text-light text-sm font-nunito opacity-80 ">{label}</span>
          <h5 className="text-xl font-montserrat text-light font-semibold">{title}</h5>
          <p className="text-light body-M font-nunito mb-4">{description}</p>
          <h6 className="text-lg font-montserrat text-light font-semibold ">{visionHeading}</h6>
          <p className="text-light text-base font-nunito opacity-90">{visionText}</p>
          <div className="mt-4 flex justify-center">
          </div>
        </div>
        {/* Navigation arrows styled as per Figma pill design, both at bottom right */}
        <div className="absolute bottom-12 right-16 z-30 flex gap-4">
          <button
            className="w-[110px] h-[48px] rounded-full bg-[rgba(5,54,28,0.3)] border border-[#EFEFEF] flex items-center justify-center shadow-lg backdrop-blur-md hover:bg-[rgba(5,54,28,0.5)] transition-all"
            aria-label="Previous slide"
            type="button"
            onClick={handlePrev}
          >
            <img src="/icons/arrow-right.svg" alt="Previous" className="w-9 h-9" />
          </button>
          <button
            className="w-[110px] h-[48px] rounded-full bg-[rgba(5,54,28,0.3)] border border-[#EFEFEF] flex items-center justify-center shadow-lg backdrop-blur-md hover:bg-[rgba(5,54,28,0.5)] transition-all"
            aria-label="Next slide"
            type="button"
            onClick={handleNext}
          >
            <img src="/icons/arrow-left.svg" alt="Next" className="w-9 h-9" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HubSubsections; 