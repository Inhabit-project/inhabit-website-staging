import React from 'react';
import HubSubsections from './HubSubsections';
import { useTranslation } from 'react-i18next';

// Centralized static project data (images, keys)
const projects = [
  {
    key: 'project1',
    backgroundImage: '/assets/images/img1.webp',
    mapImage: '/assets/images/img2.webp',
    sliderImages: [
      '/assets/sendiwa-1.webp',
      '/assets/sendiwa-2.webp',
      '/assets/sendiwa-3.webp',
      '/assets/sendiwa-4.webp',
      '/assets/sendiwa-5.webp',
    ],
  },
  {
    key: 'project2',
    backgroundImage: '/assets/arte-selva1.webp',
    mapImage: '/assets/images/img5.webp',
    sliderImages: [
      '/assets/arte-selva1.webp',
      '/assets/arte-selva2.webp',
      '/assets/arte-selva3.webp',
      '/assets/arte-selva4.webp',
    ],
  },
];

const ProjectsMain: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main id="main-content" role="main" tabIndex={-1}>
      <section aria-labelledby="projects-section-title" className="projects-section">
        <h2 id="projects-section-title" className="sr-only">{t('projectsMain.overview')}</h2>
        {projects.map((project) => {
          const projectContent = t(`projectsMain.${project.key}`, { returnObjects: true }) as any;
          return (
            <HubSubsections
              key={project.key}
              backgroundImage={project.backgroundImage}
              mapImage={project.mapImage}
              label={projectContent.label}
              title={projectContent.title}
              description={projectContent.description}
              visionHeading={projectContent.visionHeading}
              visionText={projectContent.visionText}
              sliderImages={project.sliderImages}
              navigateTo={`#${project.key}`}
            />
          );
        })}
      </section>
    </main>
  );
};

export default ProjectsMain; 