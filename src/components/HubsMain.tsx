import React from 'react';
import ImageSection from './ImageSection';
import HubSubsections from './HubSubsections';
import BiodiversityCardsSection from './BiodiversityCardsSection';
import CriteriaCardsSection from './CriteriaCardsSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const content = {
  en: {
    eyebrow: 'Where are the hubs located?',
    heading: 'The first <span class="highlighted-text">three HUBS</span> are located in the <span class="highlighted-text">Sierra Nevada de Santa Marta,</span> considered the <span class="highlighted-text">Heart of the World.</span>',
    nuiyanzhi: {
      label: 'Knowledge Center for Restoration',
      title: 'ÑUIYANZHI',
      description: 'Since 2021, the family of Amelia, Juan, and their son León have lived and cared for Ñuiyanzhi in partnership with the Kogi elders of the Kaggaba tribe, from the Sierra Nevada de Santa Marta.',
      visionHeading: 'HUB VISION',
      visionText: 'The Ñuiyanzhi Hub is a living laboratory where ecological restoration meets ancestral knowledge. It regenerates soils degraded by overgrazing, monocultures, and agrochemicals, creating a biodiversity hotspot for endangered species. As a training center, it combines hands-on learning with indigenous and academic wisdom. NFT guardians gain exclusive access to restoration tools, immersive experiences, and direct links to Kogi ecological and spiritual knowledge.'
    },
    aguaDeLuna: {
      label: 'Peace and Reconnection',
      title: 'AGUA DE LUNA HUB',
      description: 'Since 2022, Celia and her daughter Myhla are living and stewarding Agua de Luna, weaving ancestral wisdom and rural transformation in harmony with the Sierra Nevada de Santa Marta.',
      visionHeading: 'HUB VISION',
      visionText: 'Agua de Luna is a sacred space at the foothills of the Sierra Nevada de Santa Marta—a call to live fully, reconnect with nature, and rediscover our essential being. Designed for inner transformation, it offers conscious practices, rituals, and creative movement. Here, spirituality, nature, and community unite to inspire healing, service, and joy. A journey of self-discovery, harmony, and collective regeneration begins with every step. The land is infused with highly biodiverse cacao, enriching the space with its vitality and wisdom.'
    },
    TierraKilwa: {
      label: 'Food production, Art and regenerative entrepreneurship',
      title: 'TIERRA KILWA',
      description: 'Luca, Chiara, and their daughter Gea are social entrepreneurs stewarding Kilwa, where they will establish La Fábrica del Arte blending art and ecology to spark regeneration across the region.',
      visionHeading: 'HUB VISION',
      visionText: 'Tierra Kilwa, La Fábrica del Arte is a learning center where art, nature, and community unite to reimagine the relationship between humans and the territory. Focused on social entrepreneurship, it empowers local communities through art and ecological stewardship. By fostering regenerative business models, it nurtures rural innovation, offering education in life skills to spread art and empower changemaker entrepreneurs throughout the corridor. Kilwa aims to become a reference point for resilient food systems, through agroforestry, agroecology, and diverse food sovereignty practices.'
    }
  },
  es: {
    eyebrow: '¿Dónde están ubicados los hubs?',
    heading: 'Los primeros <span class="highlighted-text">tres HUBS</span> están ubicados en la<span class="highlighted-text"> Sierra Nevada de Santa Marta, </span> considerada el <span class="highlighted-text">Corazón del Mundo.</span>',
    nuiyanzhi: {
      label: 'Centro de Conocimiento para la Restauración',
      title: 'ÑUIYANZHI',
      description: 'Desde 2021, la familia de Amelia, Juan y su hijo León viven y cuidan Ñuiyanzhi en asociación con los ancianos Kogi de la tribu Kaggaba, de la Sierra Nevada de Santa Marta.',
      visionHeading: 'VISIÓN DEL HUB',
      visionText: 'El Hub Ñuiyanzhi es un laboratorio viviente donde la restauración ecológica se encuentra con el conocimiento ancestral. Regenera suelos degradados por el sobrepastoreo, monocultivos y agroquímicos, creando un punto caliente de biodiversidad para especies en peligro de extinción. Como centro de formación, combina el aprendizaje práctico con la sabiduría indígena y académica. Los guardianes NFT obtienen acceso exclusivo a herramientas de restauración, experiencias inmersivas y vínculos directos con el conocimiento ecológico y espiritual Kogi.'
    },
    aguaDeLuna: {
      label: 'Punto Caliente de Biodiversidad',
      title: 'AguaDeLuna',
      description: 'El hub AguaDeLuna es un santuario para especies raras y un centro de investigación y educación, combinando la ciencia moderna con la sabiduría indígena.',
      visionHeading: 'VISIÓN DEL HUB',
      visionText: 'El Hub AguaDeLuna está dedicado a preservar la selva tropical más grande del mundo, apoyando a las comunidades locales y fomentando la colaboración global para la conservación.'
    },
    TierraKilwa: {
      label: 'Innovación en el Desierto',
      title: 'TierraKilwa',
      description: 'El hub TierraKilwa es pionero en vida sostenible en ambientes áridos, enfocándose en la conservación del agua y la energía renovable.',
      visionHeading: 'VISIÓN DEL HUB',
      visionText: 'El Hub TierraKilwa demuestra cómo la vida puede prosperar en condiciones extremas, inspirando nuevas soluciones para un clima cambiante.'
    }
  }
};

const Hubs: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <main id="main-content" role="main" tabIndex={-1}>
      <ImageSection
        eyebrow={content[lang].eyebrow}
        heading={<span dangerouslySetInnerHTML={{ __html: content[lang].heading }} />}
        imageSrc="/assets/sierra.jpg"
        imageAlt="Sierra Nevada de Santa Marta mountain range"
      />
      <section aria-labelledby="hubs-section-title" className="hubs-section">
        <h2 id="hubs-section-title" className="sr-only">Hubs Overview</h2>
        <HubSubsections
          backgroundImage="/assets/1Hub/1hub.webp"
          mapImage="/assets/1Hub/mapa.webp"
          label={content[lang].nuiyanzhi.label}
          title={content[lang].nuiyanzhi.title}
          description={content[lang].nuiyanzhi.description}
          visionHeading={content[lang].nuiyanzhi.visionHeading}
          visionText={content[lang].nuiyanzhi.visionText}
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
          mapImage="/assets/2Hub/mapa.png"
          label={content[lang].aguaDeLuna.label}
          title={content[lang].aguaDeLuna.title}
          description={content[lang].aguaDeLuna.description}
          visionHeading={content[lang].aguaDeLuna.visionHeading}
          visionText={content[lang].aguaDeLuna.visionText}
          onDownload={() => {}}
          sliderImages={[
            '/assets/2Hub/hub-view-1.webp',
            '/assets/2Hub/hub-view-2.webp',
            '/assets/2Hub/hub-view-3.webp',
          ]}
          navigateTo="/hubs/aguaDeLuna"
          inactive={true}
          buttonText="Hub coming soon"
        />
        <HubSubsections
          backgroundImage="/assets/photo-2.webp"
          mapImage="/assets/3Hub/mapa.png"
          label={content[lang].TierraKilwa.label}
          title={content[lang].TierraKilwa.title}
          description={content[lang].TierraKilwa.description}
          visionHeading={content[lang].TierraKilwa.visionHeading}
          visionText={content[lang].TierraKilwa.visionText}
          onDownload={() => {}}
          sliderImages={[
            '/assets/3Hub/hub-view-1.webp',
            '/assets/3Hub/hub-view-2.webp',
            '/assets/3Hub/hub-view-3.webp',
          ]}
          navigateTo="/hubs/TierraKilwa"
          inactive={true}
          buttonText="Hub coming soon"
        />
      </section>
      <section aria-labelledby="criteria-section-title" className="criteria-section">
        <h2 id="criteria-section-title" className="sr-only">Hub Criteria</h2>
        <CriteriaCardsSection />
      </section>
    </main>
  );
};

export default Hubs; 