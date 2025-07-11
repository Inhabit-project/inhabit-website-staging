import React, { useState } from 'react';
import PhotoGallery from './PhotoGallery';

interface GalleryProps {
  images: {
    src: string;
    alt?: string;
  }[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const normalizeIndex = (index: number) => {
    const length = images.length;
    if (index < 0) return length - 1;
    if (index >= length) return 0;
    return index;
  };

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => normalizeIndex(prev + 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => normalizeIndex(prev - 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const getVisibleImages = () => {
    const result = [];
    const length = images.length;

    // Add previous and next images using normalizeIndex
    for (let i = -2; i <= 2; i++) {
      const index = normalizeIndex(currentIndex + i);
      result.push({
        index,
        position: i,
        src: images[index].src,
        alt: images[index].alt
      });
    }

    return result;
  };

  return (
    <div className="relative w-full h-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)]">
      <div className="relative w-full overflow-hidden py-16">
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-[5%] top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/20"
          aria-label="Previous image"
        >
          <div className="w-0 h-0 border-t-[0.75rem] border-t-transparent border-r-[1.25rem] border-r-secondary border-b-[0.75rem] border-b-transparent mr-1" />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-[5%] top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/20"
          aria-label="Next image"
        >
          <div className="w-0 h-0 border-t-[0.75rem] border-t-transparent border-l-[1.25rem] border-l-secondary border-b-[0.75rem] border-b-transparent ml-1" />
        </button>

        {/* Image Carousel */}
        <div className="relative flex items-center justify-center min-h-[35rem]">
          <div className="absolute w-full h-full">
            {getVisibleImages().map(({ index, position, src, alt }) => {
              const isCenter = position === 0;
              const distance = Math.abs(position);
              
              return (
                <div
                  key={`${index}-${position}`}
                  className={`
                    absolute left-1/2 top-1/2
                    transition-all duration-300 ease-in-out
                    ${isCenter ? 'w-[45rem]' : 'w-[15rem]'}
                    aspect-[16/9] rounded-xl overflow-hidden
                  `}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${position * 130}%) scale(${isCenter ? 1 : 0.85})`,
                    opacity: isCenter ? 1 : 0.3,
                    filter: isCenter ? 'none' : 'blur(4px)',
                    zIndex: 20 - Math.abs(position),
                    pointerEvents: isTransitioning ? 'none' : 'auto'
                  }}
                >
                  <img
                    src={src}
                    alt={alt || ''}
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <PhotoGallery />
    </div>
  );
};

export default Gallery; 