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
import ImageSection from '../components/ImageSection';
import Gallery from '../components/Gallery';

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
            <ImageSection
              eyebrow="Regenerative Landscapes"
              heading={<span>Our projects restore ecosystems and empower communities through innovative, hands-on action.</span>}
              imageSrc="/assets/images/img4.webp"
              imageAlt="Regenerative landscape project"
            />
          </section>
          <section aria-label="Projects gallery section">
            <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
              <h2 className="heading-2 text-secondary mb-8">Project Highlights Gallery</h2>
              <Gallery images={[
                { src: '/assets/images/img1.webp', alt: 'Project photo 1' },
                { src: '/assets/images/img2.webp', alt: 'Project photo 2' },
                { src: '/assets/images/img3.webp', alt: 'Project photo 3' },
                { src: '/assets/images/img4.webp', alt: 'Project photo 4' },
                { src: '/assets/images/img5.webp', alt: 'Project photo 5' },
                { src: '/assets/images/img6.webp', alt: 'Project photo 6' },
              ]} />
            </div>
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