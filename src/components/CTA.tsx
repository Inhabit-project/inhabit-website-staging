import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/CTA.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 100
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-[clamp(1rem,5vw,6.25rem)]">
        <div className="w-full max-w-[120rem] rounded-[20px] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Text and Buttons Container with semi-transparent background */}
            <div className="w-full md:w-[70%] p-6 md:p-12 bg-secondary/80 backdrop-blur-[18.9px]">
              <h3 className="heading-3 text-light text-center md:text-left">
                Join us in <span className="text-primary">shaping a global corridor</span>.<br />
                <span className="text-primary">Become a guardian</span>, trace the corridor,<br />
                and be a <span className="text-primary">catalyst for impact !</span>
              </h3>

              {/* Buttons */}
              <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                {/* Primary Button (Orange) */}
                <button className="h-[3.5rem] md:h-[4.375rem] bg-primary hover:bg-primary/90 backdrop-blur-[6px] rounded-button flex items-center group transition-colors">
                  <div className="flex items-center gap-2 px-4 md:px-6">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 3v18M5 14l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="button-text text-light">
                      Discover inhabit
                    </span>
                  </div>
                  <div className="flex items-center px-3 md:px-4 border-l border-white/20">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="white">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>

                {/* Secondary Button (Green) */}
                <button className="h-[3.5rem] md:h-[4.375rem] bg-green-soft hover:bg-green-soft/90 backdrop-blur-[6px] rounded-button flex items-center group transition-colors">
                  <div className="flex items-center gap-2 px-4 md:px-6">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v18M5 14l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="button-text text-secondary">
                      Discover inhabit
                    </span>
                  </div>
                  <div className="flex items-center px-3 md:px-4 border-l border-secondary/20">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative w-full md:w-[30%]">
              <div className="absolute inset-0 bg-secondary/30"></div>
              <img 
                src="/assets/cta-img.jpg" 
                alt="People planting trees" 
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 