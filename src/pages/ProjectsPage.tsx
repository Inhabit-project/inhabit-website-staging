import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ProjectsVideoSection from '../components/ProjectsVideoSection';
import ProjectSection from '../components/ProjectSection';

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded">
        Skip to main content
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main id="main-content" tabIndex={-1} role="main">
          <section aria-label="Projects hero section">
            <InternalPagesHero
              variant="projects"
            />
          </section>
          <section aria-label="Projects image section">
            <ProjectsVideoSection />
          </section>
          <section aria-label="Projects main content">
            <ProjectSection />
          </section>
          <section aria-label="Call to action">
            <CTA />
          </section>
          <section aria-label="Blog section">
            <Blog />
          </section>
          <section aria-label="Frequently asked questions">
            <FAQ />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectsPage; 