import React from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import HubsMain from '../components/HubsMain';
import FourCriteriaCardsSection from '../components/FourCriteriaCardsSection';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ, { FAQHubs } from '../components/FAQ';
import Footer from '../components/Footer';

const HubsPage: React.FC = () => (
  <>
    {/* Skip to main content link for accessibility */}
    <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">
      Skip to main content
    </a>
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <main id="main-content" tabIndex={-1} role="main">
        <section aria-label="Hubs hero section">
          <InternalPagesHero variant="hubs" />
        </section>
        <section aria-label="Hubs main content">
          <HubsMain />
        </section>
        <section aria-label="Four Criteria To Be a HUB">
          <FourCriteriaCardsSection />
        </section>
        <section aria-label="Call to action">
          <CTA />
        </section>
        <section aria-label="Blog section">
          <Blog />
        </section>
        <section aria-label="Frequently asked questions">
          <FAQHubs />
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default HubsPage; 