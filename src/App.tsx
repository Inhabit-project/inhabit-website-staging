import React, { useState, createContext, useEffect } from "react";

import "@/i18n";
import "@/utils/gsap";
import "@fontsource/nunito-sans/400.css";

import Loader from "@/components/Loader";
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

// Create a context for the loading state
export const LoadingContext = createContext<boolean>(false);

function ScrollToTopOnNavigation() {
  useScrollToTopOnNavigation();
  return null;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (isLoading) {
      html.classList.add("loading");
      document.body.classList.add("loading");
    } else {
      // Add a small delay before removing loading classes to ensure smooth transition
      setTimeout(() => {
        html.classList.remove("loading");
        document.body.classList.remove("loading");
        setIsTransitioning(false);
      }, 500);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={isLoading}>
      <Router>
        <div
          className={`app-container ${isTransitioning ? "transitioning" : ""}`}
        >
          {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />}
          <ScrollToTopOnNavigation />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/hubs" element={<HubsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/stewardship-nft" element={<StewardshipNFTPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/hubs/nuiyanzhi" element={<NuiyanzhiPage />} />
            <Route path="/hubs/agua-de-luna" element={<AguaDeLunaPage />} />
            <Route path="/hubs/TierraKilwa" element={<TierraKilwaPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog/article/:id" element={<ArticlePage />} />
            <Route path="*" element={<FourOhFourPage />} />
          </Routes>
        </div>
      </Router>
    </LoadingContext.Provider>
  );
};

export default App;
