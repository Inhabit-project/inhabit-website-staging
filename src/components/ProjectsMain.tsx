import React from 'react';
import HubSubsections from './HubSubsections';

const projectsContent = {
  eyebrow: 'Our Project Initiatives',
  heading: 'Explore our <span className="highlighted-text">flagship projects</span> driving <span className="highlighted-text">regeneration</span> and <span className="highlighted-text">community empowerment</span>.',
  project1: {
    label: 'Forest Restoration',
    title: 'Green Corridors',
    description: 'Connecting fragmented habitats through native tree planting and ecological restoration, this project revives biodiversity and supports local wildlife.',
    visionHeading: 'PROJECT VISION',
    visionText: 'To create continuous green corridors that allow species migration and restore ecosystem health, while engaging local communities in stewardship.',
    backgroundImage: '/assets/images/img1.webp',
    mapImage: '/assets/images/img2.webp',
    sliderImages: [
      '/assets/images/img1.webp',
      '/assets/images/img2.webp',
      '/assets/images/img3.webp',
    ],
  },
  project2: {
    label: 'Agroecology',
    title: 'Food Forests',
    description: 'Transforming degraded lands into productive food forests, this project combines traditional knowledge with modern agroecology for food security and resilience.',
    visionHeading: 'PROJECT VISION',
    visionText: 'To empower communities to grow diverse, sustainable food systems that restore soil health and foster economic independence.',
    backgroundImage: '/assets/images/img4.webp',
    mapImage: '/assets/images/img5.webp',
    sliderImages: [
      '/assets/images/img4.webp',
      '/assets/images/img5.webp',
      '/assets/images/img6.webp',
    ],
  },
  
};

const ProjectsMain: React.FC = () => {
  return (
    <main id="main-content" role="main" tabIndex={-1}>
      <section aria-labelledby="projects-section-title" className="projects-section">
        <h2 id="projects-section-title" className="sr-only">Projects Overview</h2>
        <HubSubsections
          backgroundImage={projectsContent.project1.backgroundImage}
          mapImage={projectsContent.project1.mapImage}
          label={projectsContent.project1.label}
          title={projectsContent.project1.title}
          description={projectsContent.project1.description}
          visionHeading={projectsContent.project1.visionHeading}
          visionText={projectsContent.project1.visionText}
          sliderImages={projectsContent.project1.sliderImages}
          navigateTo="#project1"
        />
        <HubSubsections
          backgroundImage={projectsContent.project2.backgroundImage}
          mapImage={projectsContent.project2.mapImage}
          label={projectsContent.project2.label}
          title={projectsContent.project2.title}
          description={projectsContent.project2.description}
          visionHeading={projectsContent.project2.visionHeading}
          visionText={projectsContent.project2.visionText}
          sliderImages={projectsContent.project2.sliderImages}
          navigateTo="#project2"
        />
      </section>
    </main>
  );
};

export default ProjectsMain; 