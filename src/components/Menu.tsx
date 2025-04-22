import React, { useState, useEffect } from 'react';

const Menu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`fixed top-0 left-0 right-0 h-[5.5rem] bg-menu-backdrop backdrop-blur-[18.9px] z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img src="/assets/logo.svg" alt="INHABIT" className="h-[1.75rem]" />
          </div>

          {/* Navigation */}
          <div className="font-ibm-mono font-size-xs hidden lg:flex gap-8">
            {[
              'HOME',
              'HUBS',
              'STEWARDSHIP NFT',
              'ABOUT US',
              'PROJECTS',
              'BLOG',
              'CONTACTS'
            ].map((item) => (
              <a 
                key={item}
                href="#" 
                className="nav-text hover:opacity-80"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Download Button */}
          <button className="flex items-center h-[3.375rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-green-soft)]/90 px-2 rounded-button backdrop-blur-[6px]">
            <div className="flex items-center gap-2 px-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="button-text text-secondary">download white paper</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu; 