import React, { useRef, useEffect } from 'react';
import Menu from '../components/Menu';
import Hero from '../components/Hero';
import Video from '../components/Video';
import Hubs from '../components/Hubs';
import StewardshipNFT from '../components/StewardshipNFT';
import Highlight from '../components/Highlight';
import Photo from '../components/Photo';
import PhotoGallery from '../components/PhotoGallery';
import NFTGrid from '../components/NFTGrid';
import Infographic from '../components/Infographic';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { scrollManager } from '../utils/scrollManager';

const MainPage: React.FC = () => {
  const videoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollManager && typeof scrollManager.update === 'function') {
      setTimeout(() => {
        scrollManager.update();
      }, 200);
    }
  }, []);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">Skip to main content</a>
      <Menu />
      <main id="main-content" tabIndex={-1}>
        <Hero scrollToRef={videoSectionRef} />
        <div ref={videoSectionRef}>
          <Video />
        </div>
        <Hubs />
        <StewardshipNFT />
        <Highlight />
        <Photo />
        <NFTGrid />
        <Infographic />
        <Testimonials />
        <CTA />
        <Blog />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default MainPage; 