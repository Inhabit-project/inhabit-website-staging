import React, { useRef, useEffect, useContext, useState } from 'react';
import HubSubsections from './HubSubsections';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

// Centralized static project data (images, keys)
const projects = [
  {
    key: 'project1',
    backgroundImage: '/assets/images/img1.webp',
    mapImage: '/assets/sewindua.webp',
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
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const mainRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const projectsRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  
  // Store references for cleanup
  const timelineRefs = useRef<gsap.core.Timeline[]>([]);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);

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
      // Clear previous references
      timelineRefs.current = [];
      scrollTriggerRefs.current = [];
      
      // Create a ScrollTrigger for each project section
      projectsRefs.current.forEach((project, index) => {
        if (!project) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });
        
        // Store references for cleanup
        timelineRefs.current.push(tl);
        if (tl.scrollTrigger) {
          scrollTriggerRefs.current.push(tl.scrollTrigger);
        }

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
      
      // Kill all specific ScrollTriggers
      scrollTriggerRefs.current.forEach(trigger => {
        if (trigger) {
          trigger.kill();
        }
      });
      scrollTriggerRefs.current = [];

      // Kill all timelines
      timelineRefs.current.forEach(timeline => {
        if (timeline) {
          timeline.kill();
        }
      });
      timelineRefs.current = [];
    };
  }, [canAnimate]);

  return (
    <main id="main-content" role="main" tabIndex={-1} ref={mainRef}>
      <section aria-labelledby="projects-section-title" className="projects-section" ref={sectionRef}>
        <h2 id="projects-section-title" className="sr-only">{t('projectsMain.overview')}</h2>
        {projects.map((project, index) => {
          const projectContent = t(`projectsMain.${project.key}`, { returnObjects: true }) as any;
          return (
            <div key={project.key} ref={el => projectsRefs.current[index] = el}>
              <HubSubsections
                backgroundImage={project.backgroundImage}
                mapImage={project.mapImage}
                label={projectContent.label}
                title={projectContent.title}
                description={projectContent.description}
                visionHeading={projectContent.visionHeading}
                visionText={projectContent.visionText}
                sliderImages={project.sliderImages}
                navigateTo={`#${project.key}`}
                labelRef={el => labelsRefs.current[index] = el}
                titleRef={el => titlesRefs.current[index] = el}
                descriptionRef={el => descriptionsRefs.current[index] = el}
                visionRef={el => visionsRefs.current[index] = el}
                visionTextRef={el => visionTextsRefs.current[index] = el}
                mapRef={el => mapsRefs.current[index] = el}
                buttonRef={el => buttonsRefs.current[index] = el}
                galleryButtonRef={el => galleryButtonsRefs.current[index] = el}
                navButtonsRef={el => navButtonsRefs.current[index] = el}
              />
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default ProjectsMain; 