import React from 'react';
import '@fontsource/ibm-plex-sans-condensed/400.css';
import '@fontsource/nunito-sans/400.css';
import './i18n';
import { useTranslation } from 'react-i18next';
import Hero from './components/Hero';
import Video from './components/Video';
import Hubs from './components/Hubs';
import HubSubsections from './components/HubSubsections';
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
import Menu from './components/Menu';
import InternalPagesHero from './components/InternalPagesHero';
import ImageSection from './components/ImageSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HubsPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <InternalPagesHero title="Bio-cultural Hubs" strong="Hubs" />
    <Hubs />
    <CTA />
    <Blog />
    <FAQ />
    <Footer />
  </div>
);

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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/hubs" element={<HubsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
