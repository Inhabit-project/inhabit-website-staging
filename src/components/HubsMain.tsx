import React from 'react';
import ImageSection from './ImageSection';
import HubSubsections from './HubSubsections';
import BiodiversityCardsSection from './BiodiversityCardsSection';
import CriteriaCardsSection from './CriteriaCardsSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Hubs: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <ImageSection
        eyebrow={t('hubsMain.eyebrow')}
        heading={<span dangerouslySetInnerHTML={{ __html: t('hubsMain.heading') }} />}
        imageSrc="/assets/sierra.jpg"
        imageAlt="Sierra Nevada"
      />
      <HubSubsections
        backgroundImage="/assets/1Hub/1hub.webp"
        mapImage="/assets/mapa.png"
        label={t('hubsMain.nuiyanzhi.label')}
        title={t('hubsMain.nuiyanzhi.title')}
        description={t('hubsMain.nuiyanzhi.description')}
        visionHeading={t('hubsMain.nuiyanzhi.visionHeading')}
        visionText={t('hubsMain.nuiyanzhi.visionText')}
        onDownload={() => {}}
        sliderImages={[
          '/assets/1Hub/hub-view-1.webp',
          '/assets/1Hub/hub-view-2.webp',
          '/assets/1Hub/hub-view-3.webp',
        ]}
        navigateTo="/hubs/nuiyanzhi"
      />
      <HubSubsections
        backgroundImage="/assets/forest.jpg"
        mapImage="/assets/mapa2.png"
        label={t('hubsMain.aguaDeLuna.label')}
        title={t('hubsMain.aguaDeLuna.title')}
        description={t('hubsMain.aguaDeLuna.description')}
        visionHeading={t('hubsMain.aguaDeLuna.visionHeading')}
        visionText={t('hubsMain.aguaDeLuna.visionText')}
        onDownload={() => {}}
        sliderImages={[
          '/assets/1Hub/hub-view-1.webp',
          '/assets/1Hub/hub-view-2.webp',
          '/assets/1Hub/hub-view-3.webp',
        ]}
        navigateTo="/hubs/agua-de-luna"
      />
      <HubSubsections
        backgroundImage="/assets/photo-2.webp"
        mapImage="/assets/mapa3.png"
        label={t('hubsMain.atacama.label')}
        title={t('hubsMain.atacama.title')}
        description={t('hubsMain.atacama.description')}
        visionHeading={t('hubsMain.atacama.visionHeading')}
        visionText={t('hubsMain.atacama.visionText')}
        onDownload={() => {}}
        sliderImages={[
          '/assets/1Hub/hub-view-1.webp',
          '/assets/1Hub/hub-view-2.webp',
          '/assets/1Hub/hub-view-3.webp',
        ]}
        navigateTo="/hubs/atacama"
      />
      <CriteriaCardsSection />
    </>
  );
};

export default Hubs; 