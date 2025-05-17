import React from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import Hubs from '../components/Hubs';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HubsPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <InternalPagesHero variant="hubs" />
    <Hubs />
    <CTA />
    <Blog />
    <FAQ />
    <Footer />
  </div>
);

export default HubsPage; 