import React from "react";

import "@/i18n";
import "@/utils/gsap";
import "@fontsource/nunito-sans/400.css";
import { useScrollToTopOnNavigation } from "@/utils/scrollToTopOnNavigation";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "@/pages/MainPage";
import HubsPage from "@/pages/HubsPage";
import AboutUsPage from "@/pages/AboutUsPage";
import StewardshipNFTPage from "@/pages/StewardshipNFTPage";
import Checkout from "@/components/Checkout";
import BlogPage from "@/pages/BlogPage";
import NuiyanzhiPage from "@/pages/NuiyanzhiPage";
import AguaDeLunaPage from "@/pages/AguaDeLunaPage";
import TierraKilwaPage from "@/pages/TierraKilwaPage";
import FourOhFourPage from "@/pages/404";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ContactPage from "@/pages/ContactPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ArticlePage from "@/pages/ArticlePage";

function ScrollToTopOnNavigation() {
  useScrollToTopOnNavigation();
  return null;
}

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTopOnNavigation />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/hubs" element={<HubsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/stewardship-nft" element={<StewardshipNFTPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/article/:id" element={<ArticlePage />} />
        <Route path="/hubs/nuiyanzhi" element={<NuiyanzhiPage />} />
        <Route path="/hubs/agua-de-luna" element={<AguaDeLunaPage />} />
        <Route path="/hubs/TierraKilwa" element={<TierraKilwaPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="*" element={<FourOhFourPage />} />
      </Routes>
    </Router>
  );
};

export default App;
