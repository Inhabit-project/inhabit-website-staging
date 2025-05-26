import React from 'react';
import '@fontsource/nunito-sans/400.css';
import './i18n';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HubsPage from './pages/HubsPage';
import AboutUsPage from './pages/AboutUsPage';
import StewardshipNFTPage from './pages/StewardshipNFTPage';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './components/Checkout';
import BlogPage from './pages/BlogPage';
import NuiyanzhiPage from './pages/NuiyanzhiPage';
import AguaDeLunaPage from './pages/AguaDeLunaPage';
import AtacamaPage from './pages/AtacamaPage';
import './utils/gsap';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/hubs" element={<HubsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/stewardship-nft" element={<StewardshipNFTPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/hubs/nuiyanzhi" element={<NuiyanzhiPage />} />
        <Route path="/hubs/agua-de-luna" element={<AguaDeLunaPage />} />
        <Route path="/hubs/atacama" element={<AtacamaPage />} />
      </Routes>
    </Router>
  );
};

export default App;
