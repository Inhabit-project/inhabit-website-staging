import React, { useState, useEffect } from 'react';
import DownloadButton from './DownloadButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HubSubsectionsProps {
  backgroundImage: string;
  mapImage: string;
  label: string;
  title: string;
  description: string;
  visionHeading: string;
  visionText: string;
  onDownload?: () => void;
  sliderImages: string[];
  navigateTo: string;
  inactive?: boolean;
  buttonText?: string;
  isHub?: boolean;
  // Animation refs
  labelRef?: (el: HTMLDivElement | null) => void;
  titleRef?: (el: HTMLDivElement | null) => void;
  descriptionRef?: (el: HTMLDivElement | null) => void;
  visionRef?: (el: HTMLDivElement | null) => void;
  mapRef?: (el: HTMLDivElement | null) => void;
  buttonRef?: (el: HTMLDivElement | null) => void;
  galleryButtonRef?: (el: HTMLButtonElement | null) => void;
  navButtonsRef?: (el: HTMLDivElement | null) => void;
  visionTextRef?: (el: HTMLParagraphElement | null) => void;
}

const HubSubsections: React.FC<HubSubsectionsProps> = ({
  backgroundImage,
  mapImage,
  label,
  title,
  description,
  visionHeading,
  visionText,
  onDownload,
  sliderImages,
  navigateTo,
  inactive = false,
  buttonText,
  isHub = false,
  labelRef,
  titleRef,
  descriptionRef,
  visionRef,
  mapRef,
  buttonRef,
  galleryButtonRef,
  navButtonsRef,
  visionTextRef,
}) => {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const bgImage = sliderImages[current];
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isModalOpen || showGallery) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen, showGallery]);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHub) {
      navigate(navigateTo);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGalleryOpen = () => {
    setShowGallery(true);
  };

  const handleGalleryClose = () => {
    setShowGallery(false);
  };

  return (
    <section 
      className="relative w-full min-h-screen flex flex-col md:flex-row items-center overflow-hidden scroll-container"
      aria-labelledby={`hub-${title.toLowerCase().replace(/\s+/g, '-')}-title`}
    >
      {/* Background image slider - hidden on mobile */}
      <div 
        className="absolute inset-0 w-full h-full z-0 transition-all duration-700 hidden md:block"
        role="img"
        aria-label={`Background image ${current + 1} of ${sliderImages.length}`}
      >
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-700 opacity-100"
          style={{ transition: 'opacity 0.7s' }}
          loading="lazy"
        />
      </div>

      {/* Mobile gradient background */}
      <div className="absolute inset-0 background-gradient-dark md:hidden" aria-hidden="true" />
      
      {/* Overlay for darkening if needed - only on desktop */}
      <div className="absolute inset-0 bg-black/20 z-10 hidden md:block" aria-hidden="true" />
      
      {/* Main content wrapper */}
      <div className="relative z-20 flex flex-col w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] min-h-screen">
        {/* Content Card */}
        <div className="w-full md:w-auto flex flex-col items-start gap-6 my-auto">
          <article className="min-h-[40rem] w-full md:max-w-xl bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl flex flex-col p-6 md:p-8 gap-2">
            {/* Map image */}
            <div ref={mapRef}>
              <img 
                src={mapImage} 
                alt={`Map of ${title} hub location`} 
                className="w-full h-40 object-cover rounded-lg mb-4" 
                loading="lazy"
              />
            </div>
            <span ref={labelRef} className="text-light eyebrow opacity-80">{label}</span>
            <h2 
              ref={titleRef}
              id={`hub-${title.toLowerCase().replace(/\s+/g, '-')}-title`}
              className="font-montserrat text-light font-semibold heading-4"
            >
              {title}
            </h2>
            <p ref={descriptionRef} className="text-light text-base font-nunito mb-4">{description}</p>
            <h4 ref={visionRef} className="text-sm font-montserrat text-light font-semibold">{visionHeading}</h4>
            <p ref={visionTextRef} className="text-light text-sm font-nunito opacity-90 mb-6">{visionText}</p>
            
            {/* View Gallery Button - Mobile Only */}
            <button
              ref={galleryButtonRef}
              onClick={handleGalleryOpen}
              className="w-full mb-4 btn-secondary flex items-center justify-center gap-2 px-6 md:hidden"
              type="button"
              aria-label="View gallery"
            >
              View Gallery
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6.66669 1.66666H13.3334L18.3334 6.66666V13.3333L13.3334 18.3333H6.66669L1.66669 13.3333V6.66666L6.66669 1.66666Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 6.66666V13.3333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66669 10H13.3334"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Main Action Button */}
            <div ref={buttonRef} className="mt-auto">
              <button
                className={`w-full md:w-auto btn-primary flex items-center justify-center gap-2 px-6${inactive ? ' inactive' : ''}`}
                type="button"
                onClick={handleButtonClick}
                disabled={inactive}
                aria-label={buttonText || t('mainPage.visitThisProject')}
              >
                {buttonText || t('mainPage.visitThisProject')}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
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
          </article>
        </div>

        {/* Gallery Navigation - Desktop Only */}
        <div 
          ref={navButtonsRef}
          className="hidden md:flex absolute bottom-12 right-16 left-auto z-20 justify-end gap-4"
          role="group"
          aria-label="Image navigation"
        >
          <button
            className="w-[110px] h-[48px] rounded-full bg-[rgba(5,54,28,0.3)] border border-[#EFEFEF] flex items-center justify-center shadow-lg backdrop-blur-md hover:bg-[rgba(5,54,28,0.5)] transition-all"
            aria-label="Previous slide"
            type="button"
            onClick={handlePrev}
          >
            <img 
              src="/icons/arrow-right.svg" 
              alt="" 
              className="w-9 h-9"
              aria-hidden="true"
            />
          </button>
          <button
            className="w-[110px] h-[48px] rounded-full bg-[rgba(5,54,28,0.3)] border border-[#EFEFEF] flex items-center justify-center shadow-lg backdrop-blur-md hover:bg-[rgba(5,54,28,0.5)] transition-all"
            aria-label="Next slide"
            type="button"
            onClick={handleNext}
          >
            <img 
              src="/icons/arrow-left.svg" 
              alt="" 
              className="w-9 h-9"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Mobile Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[99999] bg-[#05361C] md:hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Gallery Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h4 className="text-white font-montserrat text-lg">{title} Gallery</h4>
              <button
                onClick={handleGalleryClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                aria-label="Close gallery"
              >
                <span className="text-white text-xl">&times;</span>
              </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 relative">
              <img
                src={bgImage}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Gallery Navigation */}
            <div className="flex justify-center gap-4 p-4 border-t border-white/10">
              <button
                className="w-[110px] h-[48px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                aria-label="Previous image"
                onClick={handlePrev}
              >
                <img 
                  src="/icons/arrow-right.svg" 
                  alt="" 
                  className="w-9 h-9"
                  aria-hidden="true"
                />
              </button>
              <button
                className="w-[110px] h-[48px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                aria-label="Next image"
                onClick={handleNext}
              >
                <img 
                  src="/icons/arrow-left.svg" 
                  alt="" 
                  className="w-9 h-9"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
              <span className="text-white text-sm">
                {current + 1} / {sliderImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* News Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 w-10 h-10 z-50 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-[4.125px] flex items-center justify-center transition-all duration-300 group z-[100000] shadow-lg"
            aria-label={t('mainPage.projectsVideo.closeVideo')}
            autoFocus
          >
            <span className="text-lg text-white">&times;</span>
          </button>
          <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
            <iframe
              src="https://explorer.land/embed/project/bioculturalcorridor/site/n85ReZ/news"
              title="Project News"
              className="w-full h-full rounded-xl"
              style={{ border: 'none' }}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default HubSubsections;