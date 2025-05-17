import React from 'react';
import Menu from '../components/Menu';
import Hero from '../components/Hero';
import Video from '../components/Video';
import StewardshipNFT from '../components/StewardshipNFT';
import Highlight from '../components/Highlight';
import Photo from '../components/Photo';
import NFTGrid from '../components/NFTGrid';
import Infographic from '../components/Infographic';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const MainPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <Hero />
    <Video />
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

export default MainPage; 