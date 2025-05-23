import React from 'react';
import ImageSection from './ImageSection';
import HubSubsections from './HubSubsections';
import BiodiversityCardsSection from './BiodiversityCardsSection';
import CriteriaCardsSection from './CriteriaCardsSection';

const Hubs: React.FC = () => (
  <>
    <ImageSection
      eyebrow="where are the hubs located"
      heading={
        <>
          The first <span className="highlighted-text">three HUBS</span> are located in the<span className="highlighted-text"> Sierra Nevada de Santa Marta, </span> considered the <span className="highlighted-text">Heart of the World.</span>
        </>
      }
      imageSrc="/assets/sierra.jpg"
      imageAlt="Sierra Nevada"
    />
    <HubSubsections
      backgroundImage="/assets/footer-bg.webp"
      mapImage="/assets/mapa.png"
      label="Restoration Knowledge Center"
      title="ÑUIYANZHI"
      description="Since 2021, the family of Amelia, Juan, and their son León are living and stewarding Ñuiyanzhi in association with the Kogi elders of the Kaggaba tribe, from the Sierra Nevada de Santa Marta."
      visionHeading="HUB VISION"
      visionText="Ñuiyanzhi Hub Is A Living Lab Where Ecological Restoration Meets Ancestral Knowledge. It Regenerates Soils Degraded By Overgrazing, Monocultures, And Agrochemicals, Creating A Biodiversity Hotspot For Endangered Species. As A Training Center, It Blends Hands-On Learning With Indigenous And Academic Wisdom. NFT Stewards Gain Exclusive Access To Restoration Tools, Immersive Experiences, And Direct Ties To Kogi Ecological And Spiritual Knowledge."
      onDownload={() => {}}
    />
    <HubSubsections
      backgroundImage="/assets/forest.jpg"
      mapImage="/assets/mapa2.png"
      label="Biodiversity Hotspot"
      title="AMAZONIA"
      description="The Amazonia hub is a sanctuary for rare species and a center for research and education, blending modern science with indigenous wisdom."
      visionHeading="HUB VISION"
      visionText="Amazonia Hub is dedicated to preserving the world's largest rainforest, supporting local communities, and fostering global collaboration for conservation."
      onDownload={() => {}}
    />
    <HubSubsections
      backgroundImage="/assets/photo-2.webp"
      mapImage="/assets/mapa3.png"
      label="Desert Innovation"
      title="ATACAMA"
      description="Atacama hub pioneers sustainable living in arid environments, focusing on water conservation and renewable energy."
      visionHeading="HUB VISION"
      visionText="Atacama Hub demonstrates how life can thrive in extreme conditions, inspiring new solutions for a changing climate."
      onDownload={() => {}}
    />
    <CriteriaCardsSection />
  </>
);

export default Hubs; 