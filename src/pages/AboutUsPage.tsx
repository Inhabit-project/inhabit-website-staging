import React from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ImageSection from '../components/ImageSection';
import InfoCard from '../components/InfoCard';

const AboutUsPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <InternalPagesHero variant="about" />
    <ImageSection
      eyebrow="Builders, Visionaries, Regenerators."
      heading={<>Together, <span className="highlighted-text">we're building</span> the foundations of a<span className="highlighted-text"> regenerative future</span>, one hub, one corridor, one community, one story at a time.</>}
      imageSrc="/assets/about.webp"
      imageAlt="INHABIT Team"
    />
    <InfoCard
      title="INHABIT "
      subtitle="S.A.S"
      logoSrc="/assets/logo.svg"
      logoAlt="INHABIT Logo"
      text={`Founded in 2020, INHABIT develops innovative legal, economic, and educational tools focused on protecting vital ecosystems and driving rural social innovation. INHABIT creates social business solutions that effectively engage diverse stakeholders in land-use change, biodiversity conservation and bio-cultural activation.\n\nOn the ground, INHABIT implements small and large scale ecological corridors, ecosystem restoration, urban and Artscape projects, alongside initiatives focused on land security, rural transition, and rural social innovation.\n\nINHABIT is pioneering the development of tools to expand the corridor worldwide, such as the land tenure framework for Bio-Cultural Hubs. This approach facilitates the creation of a regenerative, functional, and equitable model of land tenure and introduces an innovative ReFi model for decentralised finance that aims to engage everyone in this mission.`}
      imageSrc="/assets/about.webp"
      imageAlt="INHABIT About Card"
    />
    {/* Main About Us content goes here, e.g. <AboutUs /> */}
    <CTA />
    <Blog />
    <FAQ />
    <Footer />
  </div>
);

export default AboutUsPage; 