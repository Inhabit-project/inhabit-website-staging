import React, { useRef } from 'react';
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

const MainPage: React.FC = () => {
  const videoSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <Hero scrollToRef={videoSectionRef} />
      <div ref={videoSectionRef}>
        <Video />
      </div>
      <Hubs />
      <PhotoGallery />
      <StewardshipNFT />
      <Highlight />
      <Photo />
      <NFTGrid />
      <Infographic />
      <Testimonials />
      <CTA />
      <Blog />
      <FAQ />
      <Footer />
    </div>
  );
};

export default MainPage; 