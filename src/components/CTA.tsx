import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden scroll-container">
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
            <div className="w-full md:w-[70%] p-6 md:p-12 bg-secondary/80 backdrop-blur-lg">
              <h3 className="heading-3 text-light text-center md:text-left">
                Join us in <span className="text-primary">shaping a global corridor</span>.<br />
                <span className="text-primary">Become a guardian</span>, trace the corridor,<br />
                and be a <span className="text-primary">catalyst for impact !</span>
              </h3>

              {/* Buttons */}
              <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                
                {/* Primary Button (Orange) */}
                
                <a
                  href="mailto:hello@inhabit.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0 flex items-center h-[4.2rem] bg-[var(--color-accent)] hover:bg-[var(--color-green-soft)] text-light hover:text-secondary rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                > 
                  <div className="flex items-center gap-2 px-6">
                    <img src="assets/icons/Chield_check_light.svg" alt="shield" className="w-5 h-5" />
                    <span className="button-text text-sm tracking-[0.02em] uppercase">Become a Guardian</span>
                  </div>
                  <div className="flex items-center px-4">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </a>

                {/* Secondary Button (Green) */}
                <a
                  href="mailto:hello@inhabit.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center h-[4.2rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-accent)] text-secondary hover:text-light rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                >
                  <div className="flex items-center gap-2 px-4 md:px-6">
                  <img src="assets/icons/User_add_alt_fill.svg" alt="shield" className="w-5 h-5" />
                    <span className="button-text text-sm tracking-[0.02em] uppercase">
                      Support Inhabit
                    </span>
                  </div>
                  <div className="flex items-center px-3 md:px-4 ">
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative w-full md:w-[30%]">
              <div className="absolute inset-0 bg-secondary/30"></div>
              <img 
                src="/assets/cta-img.webp" 
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