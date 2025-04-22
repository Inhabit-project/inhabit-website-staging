import React from 'react';
import '@fontsource/ibm-plex-sans-condensed/400.css';
import '@fontsource/nunito-sans/400.css';
import Hero from './components/Hero';
import Video from './components/Video';
import Hubs from './components/Hubs';
import StewardshipNFT from './components/StewardshipNFT';
import Photo from './components/Photo';
import NFTGrid from './components/NFTGrid';
import Highlight from './components/Highlight';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Infographic from './components/Infographic';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-light">
      <Hero />
      <Video />
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
      <Footer />
    </div>
  );
};

export default App;
