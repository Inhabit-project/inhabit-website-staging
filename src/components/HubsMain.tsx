import React, { useRef, useEffect, useContext, useState } from 'react';
import ImageSection from './ImageSection';
import HubSubsections from './HubSubsections';
import BiodiversityCardsSection from './BiodiversityCardsSection';
import FourCriteriaHubGlobal from './FourCriteriaHubGlobal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

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
      description: 'Luca, Chiara, and their daughter Gea are social entrepreneurs stewarding Kilwa, they want to establish La Fábrica del Arte blending art and ecology to spark regeneration across the region.',
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
      label: 'Paz y Reconexión',
      title: 'AGUA DE LUNA HUB',
      description: 'Desde 2022, Celia y su hija Myhla viven y cuidan Agua de Luna, entrelazando la sabiduría ancestral y la transformación rural en armonía con la Sierra Nevada de Santa Marta.',
      visionHeading: 'VISIÓN DEL HUB',
      visionText: 'Agua de Luna es un espacio sagrado al pie de la Sierra Nevada de Santa Marta—una invitación a vivir plenamente, reconectarse con la naturaleza y redescubrir nuestro ser esencial. Diseñado para la transformación interior, ofrece prácticas conscientes, rituales y movimiento creativo. Aquí, la espiritualidad, la naturaleza y la comunidad se unen para inspirar sanación, servicio y alegría. Un viaje de autodescubrimiento, armonía y regeneración colectiva comienza con cada paso. La tierra está impregnada de cacao altamente biodiverso, enriqueciendo el espacio con su vitalidad y sabiduría.'
    },
    TierraKilwa: {
      label: 'Producción de alimentos, Arte y emprendimiento regenerativo',
      title: 'TIERRA KILWA',
      description: 'Luca, Chiara y su hija Gea son emprendedores sociales que cuidan Kilwa, donde establecerán La Fábrica del Arte combinando arte y ecología para impulsar la regeneración en toda la región.',
      visionHeading: 'VISIÓN DEL HUB',
      visionText: 'Tierra Kilwa, La Fábrica del Arte es un centro de aprendizaje donde el arte, la naturaleza y la comunidad se unen para reimaginar la relación entre los humanos y el territorio. Enfocado en el emprendimiento social, empodera a las comunidades locales a través del arte y la gestión ecológica. Al fomentar modelos de negocio regenerativos, nutre la innovación rural, ofreciendo educación en habilidades para la vida para difundir el arte y empoderar a emprendedores agentes de cambio en todo el corredor. Kilwa aspira a convertirse en un punto de referencia para sistemas alimentarios resilientes, a través de la agroforestería, la agroecología y diversas prácticas de soberanía alimentaria.'
    }
  }
};

const Hubs: React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const mainRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hubsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Refs for internal elements
  const labelsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titlesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visionTextsRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const mapsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const galleryButtonsRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navButtonsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set initial states
  useEffect(() => {
    if (!mainRef.current || !sectionRef.current) return;

    // Set initial states for internal elements
    [
      labelsRefs,
      titlesRefs,
      descriptionsRefs,
      visionsRefs,
      visionTextsRefs,
      buttonsRefs,
      galleryButtonsRefs,
      navButtonsRefs
    ].forEach(refArray => {
      refArray.current.forEach(element => {
        if (element) {
          gsap.set(element, {
            opacity: 0,
            y: 30
          });
        }
      });
    });

    // Set initial states for maps with a different transform
    mapsRefs.current.forEach(element => {
      if (element) {
        gsap.set(element, {
          opacity: 0,
          scale: 0.9,
          x: 30
        });
      }
    });

    // Set initial states for navigation buttons
    navButtonsRefs.current.forEach(element => {
      if (element) {
        gsap.set(element, {
          opacity: 0,
          scale: 0.8,
          y: 20
        });
      }
    });
  }, []);

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Handle animations
  useEffect(() => {
    if (!canAnimate || !mainRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Create a ScrollTrigger for each hub section
      hubsRefs.current.forEach((hub, index) => {
        if (!hub) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hub,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });

        // Animate map first
        tl.to(mapsRefs.current[index], {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        // Animate label
        .to(labelsRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        // Animate title
        .to(titlesRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        // Animate description
        .to(descriptionsRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        // Animate vision heading
        .to(visionsRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        // Animate vision text
        .to(visionTextsRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        // Animate gallery button (mobile)
        .to(galleryButtonsRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, "-=0.3")
        // Animate main button
        .to(buttonsRefs.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, "-=0.4")
        // Animate navigation buttons (desktop)
        .to(navButtonsRefs.current[index], {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)"
        }, "-=0.4");
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [canAnimate]);

  return (
    <main id="main-content" role="main" tabIndex={-1} ref={mainRef}>
      <ImageSection
        eyebrow={content[lang].eyebrow}
        heading={<span dangerouslySetInnerHTML={{ __html: content[lang].heading }} />}
        imageSrc="/assets/sierra.jpg"
        imageAlt="Sierra Nevada de Santa Marta mountain range"
      />
      <section aria-labelledby="hubs-section-title" className="hubs-sectio" ref={sectionRef}>
        <h2 id="hubs-section-title" className="sr-only">Hubs Overview</h2>
        <div ref={el => hubsRefs.current[0] = el}>
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
            buttonText={t('mainPage.visitThisHub')}
            isHub={true}
            labelRef={el => labelsRefs.current[0] = el}
            titleRef={el => titlesRefs.current[0] = el}
            descriptionRef={el => descriptionsRefs.current[0] = el}
            visionRef={el => visionsRefs.current[0] = el}
            visionTextRef={el => visionTextsRefs.current[0] = el}
            mapRef={el => mapsRefs.current[0] = el}
            buttonRef={el => buttonsRefs.current[0] = el}
            galleryButtonRef={el => galleryButtonsRefs.current[0] = el}
            navButtonsRef={el => navButtonsRefs.current[0] = el}
          />
        </div>
        <div ref={el => hubsRefs.current[1] = el}>
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
            labelRef={el => labelsRefs.current[1] = el}
            titleRef={el => titlesRefs.current[1] = el}
            descriptionRef={el => descriptionsRefs.current[1] = el}
            visionRef={el => visionsRefs.current[1] = el}
            visionTextRef={el => visionTextsRefs.current[1] = el}
            mapRef={el => mapsRefs.current[1] = el}
            buttonRef={el => buttonsRefs.current[1] = el}
            galleryButtonRef={el => galleryButtonsRefs.current[1] = el}
            navButtonsRef={el => navButtonsRefs.current[1] = el}
          />
        </div>
        <div ref={el => hubsRefs.current[2] = el}>
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
            labelRef={el => labelsRefs.current[2] = el}
            titleRef={el => titlesRefs.current[2] = el}
            descriptionRef={el => descriptionsRefs.current[2] = el}
            visionRef={el => visionsRefs.current[2] = el}
            visionTextRef={el => visionTextsRefs.current[2] = el}
            mapRef={el => mapsRefs.current[2] = el}
            buttonRef={el => buttonsRefs.current[2] = el}
            galleryButtonRef={el => galleryButtonsRefs.current[2] = el}
            navButtonsRef={el => navButtonsRefs.current[2] = el}
          />
        </div>
      </section>
    </main>
  );
};

export default Hubs; 