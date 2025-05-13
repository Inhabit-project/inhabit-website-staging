import React, { useState, useEffect, useRef, useCallback } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: number;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  startTime = 2, 
  autoplay = true 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Construct the video URL with parameters
  const getVideoUrl = useCallback(() => {
    // Parse the base URL
    const url = new URL(videoUrl);
    
    // Add or update parameters
    const params = new URLSearchParams(url.search);
    params.set('autoplay', autoplay ? '1' : '0');
    
    // Add start time parameter (#t=2s format for Vimeo)
    if (startTime > 0) {
      params.set('t', `${startTime}s`);
    }
    
    // Add other necessary parameters
    params.set('h', 'f023472b60');
    params.set('badge', '0');
    params.set('autopause', '0');
    params.set('player_id', '0');
    params.set('app_id', '58479');
    
    // Reconstruct the URL
    return `${url.origin}${url.pathname}?${params.toString()}`;
  }, [videoUrl, startTime, autoplay]);

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="100%"
      src={getVideoUrl()}
      title="Shaping a Global Corridor: We are all Guardians"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className="w-full h-full"
      loading="lazy"
    />
  );
};

const Video: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isVideoPreloaded, setIsVideoPreloaded] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Function to preload the video when user hovers over the thumbnail
  const preloadVideo = useCallback(() => {
    if (!isVideoPreloaded) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = 'https://player.vimeo.com/video/1079195883';
      preloadLink.as = 'document';
      document.head.appendChild(preloadLink);
      setIsVideoPreloaded(true);
    }
  }, [isVideoPreloaded]);

  // Use Intersection Observer to preload the video when thumbnail comes into view
  useEffect(() => {
    if (!videoContainerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          preloadVideo();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(videoContainerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [preloadVideo]);

  return (
    <section className="relative w-full background-gradient-dark flex flex-col items-center">
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
            discover inhabit
          </p>
          
          {/* Main heading */}
          <h2 className="heading-2 text-light max-w-[1000px]">
            Pioneering <span className="highlighted-text">global corridors</span> to <span className="highlighted-text">protect</span> vital ecosystems and foster <span className="highlighted-text">bio-cultural innovation.</span>
          </h2>
        </div>

        {/* Video container */}
        <div 
          ref={videoContainerRef}
          className="self-end w-full md:w-[45rem] h-[16rem] md:h-[22rem] rounded-[28px] overflow-hidden"
          onMouseEnter={preloadVideo}
        >
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
              <div className="w-[50px] md:w-[66px] h-[50px] md:h-[66px] rounded-full backdrop-blur-[4.125px] border border-white flex items-center justify-center animate-videoPulse hover:bg-orange-500/20 transition-all duration-300">
                {/* Play triangle */}
                <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[20px] border-l-white border-b-[10px] md:border-b-[12px] border-b-transparent ml-1 group-hover:border-l-orange-500 transition-colors duration-300" />
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

            <VideoPlayer 
              videoUrl="https://player.vimeo.com/video/1079195883" 
              startTime={2}
              autoplay={true}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Video; 