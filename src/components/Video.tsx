import React, { useState } from 'react';

const Video: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative w-full bg-secondary flex flex-col items-center">
      {/* Background with decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src="/assets/intro-bg.svg" 
          alt="" 
          className="absolute right-0 h-full opacity-40"
        />
      </div>

      {/* Content */}
      <div className="z-10 w-full h-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col justify-between min-h-screen">
        {/* Text content */}
        <div className="flex flex-col gap-3">
          {/* Eyebrow text */}
          <p className="eyebrow text-light">
            discover inhabit
          </p>
          
          {/* Main heading */}
          <h2 className="heading-2 text-light max-w-[1000px]">
            Pioneering <span className="highlighted-text">global corridors</span> to <span className="highlighted-text">protect</span> vital ecosystems and foster <span className="highlighted-text">bio-cultural innovation</span>.
          </h2>
        </div>

        {/* Video container */}
        <div className="self-end w-[45rem] h-[22rem] rounded-[28px] overflow-hidden">
          {/* Video placeholder with background image */}
          <div 
            className="w-full h-full flex items-center justify-center relative cursor-pointer"
            style={{
              backgroundImage: 'url("/assets/video-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => setIsPopupOpen(true)}
          >
            {/* Play button */}
            <button className="relative group">
              {/* Outer circle with animation */}
              <div className="w-[66px] h-[66px] rounded-full backdrop-blur-[4.125px] border border-white flex items-center justify-center animate-videoPulse hover:bg-orange-500/20 transition-all duration-300">
                {/* Play triangle */}
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1 group-hover:border-l-orange-500 transition-colors duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={(e) => {
            // Only close if clicking the backdrop
            if (e.target === e.currentTarget) {
              setIsPopupOpen(false);
            }
          }}
        >
          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] aspect-video">
            {/* Close button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-[4.125px] flex items-center justify-center transition-all duration-300 group"
              aria-label="Close video"
            >
              <div className="relative w-3 h-3">
                <div className="absolute top-1/2 left-0 w-3 h-[1.5px] bg-white rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
                <div className="absolute top-1/2 left-0 w-3 h-[1.5px] bg-white -rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
              </div>
            </button>

            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube-nocookie.com/embed/OXZpPeRexKw?si=ZRQXfDNkMfdwzgbx&controls=0&autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Video; 