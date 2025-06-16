import React from 'react';
import HubSubsections from './HubSubsections';
import { useTranslation } from 'react-i18next';

const ProjectsMain: React.FC = () => {
  const { t } = useTranslation();
  const projectsContent = t('projectsMain', { returnObjects: true }) as any;
  return (
    <main id="main-content" role="main" tabIndex={-1}>
      <section aria-labelledby="projects-section-title" className="projects-section">
        <h2 id="projects-section-title" className="sr-only">{t('projectsMain.overview')}</h2>
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