import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import CTA from '../components/CTA';
import Blog from '../components/Blog';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ProjectsVideoSection from '../components/ProjectsVideoSection';
import ImageSection from '../components/ImageSection';
import ProjectsMain from '../components/ProjectsMain';
import { Helmet } from 'react-helmet-async';

interface ProjectsPageProps {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onPageReady, onHeroImageLoad }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <>
      <Helmet>
        <title>{t('projectsPage.seoTitle') || 'Projects | INHABIT'}</title>
        <meta name="description" content={t('projectsPage.seoDescription') || t('projectsPage.mainContent') || 'Discover our projects.'} />
        <meta property="og:title" content={t('projectsPage.seoTitle') || 'Projects | INHABIT'} />
        <meta property="og:description" content={t('projectsPage.seoDescription') || t('projectsPage.mainContent') || 'Discover our projects.'} />
        <meta property="og:image" content="/assets/arte-selva.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded focus:ring-2 focus:ring-primary"
      >
        {t('projectsPage.skipToMainContent')}
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main 
          id="main-content" 
          tabIndex={-1} 
          role="main"
          aria-label={t('projectsPage.mainContent')}
        >
          <section 
            aria-labelledby="projects-hero-title"
            className="projects-hero"
          >
            <InternalPagesHero
              variant="projects"
              onHeroImageLoad={onHeroImageLoad}
            />
          </section>
          <section 
            aria-labelledby="projects-video-title"
            className="projects-video"
          >
            <ProjectsVideoSection />
          </section>
          <section 
            aria-labelledby="projects-main-title"
            className="projects-main"
          >
            <ProjectsMain />
          </section>
          <section 
            aria-labelledby="projects-cta-title"
            className="projects-cta"
          >
            <CTA />
          </section>
          <section 
            aria-labelledby="projects-blog-title"
            className="projects-blog"
          >
            <Blog />
          </section>
          <section 
            aria-labelledby="projects-faq-title"
            className="projects-faq"
          >
            <FAQ />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectsPage; 