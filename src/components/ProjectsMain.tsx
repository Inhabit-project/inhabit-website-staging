import React, { useRef, useEffect, useContext, useState } from 'react';
import HubSubsections from './HubSubsections';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

// Centralized static project data (images, keys)
const projects = [
  {
    key: 'project1',
    backgroundImage: '/assets/sevindua.webp',
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
    mapImage: '/assets/arteselva.webp',
    sliderImages: [
      '/assets/arte-selva1.webp',
      '/assets/arte-selva2.webp',
      '/assets/arte-selva3.webp',
      '/assets/Projects03.webp',
    ],
  },
];

const ProjectsMain: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs for the main container and section
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Arrays to store refs for each project
  const projectsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mapsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titlesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visionsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visionTextsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const galleryButtonsRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const buttonsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navButtonsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get projects data from translations with error handling
  const projectsData = React.useMemo(() => {
    try {
      // Use the correct translation key structure
      const data = t('projectsMain', { returnObjects: true }) as any;
      // Extract project keys from the data
      const projectKeys = Object.keys(data || {}).filter(key => key.startsWith('project'));
      return projectKeys.map(key => ({ 
        key, 
        ...data[key],
        // Get image data from static projects array
        ...projects.find(p => p.key === key)
      }));
    } catch (error) {
      console.warn('Failed to load projects data from translations:', error);
      setHasError(true);
      return [];
    }
  }, [t]);

  // Set initial states with useGSAP
  useGSAP(() => {
    if (!mainRef.current) return;

    // Set initial states for all project elements
    projectsRefs.current.forEach((project, index) => {
      if (!project) return;

      // Set initial states for map
      if (mapsRefs.current[index]) {
        gsap.set(mapsRefs.current[index], {
          opacity: 0,
          scale: 0.8,
          x: -50
        });
      }

      // Set initial states for label
      if (labelsRefs.current[index]) {
        gsap.set(labelsRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for title
      if (titlesRefs.current[index]) {
        gsap.set(titlesRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for description
      if (descriptionsRefs.current[index]) {
        gsap.set(descriptionsRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for vision heading
      if (visionsRefs.current[index]) {
        gsap.set(visionsRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for vision text
      if (visionTextsRefs.current[index]) {
        gsap.set(visionTextsRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for gallery button (mobile)
      if (galleryButtonsRefs.current[index]) {
        gsap.set(galleryButtonsRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for main button
      if (buttonsRefs.current[index]) {
        gsap.set(buttonsRefs.current[index], {
          opacity: 0,
          y: 30
        });
      }

      // Set initial states for navigation buttons (desktop)
      if (navButtonsRefs.current[index]) {
        gsap.set(navButtonsRefs.current[index], {
          opacity: 0,
          scale: 0.8,
          y: 30
        });
      }
    });
  }, { scope: mainRef });

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Handle animations with useGSAP
  useGSAP(() => {
    if (!canAnimate || !mainRef.current || !sectionRef.current) return;

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

    // Refresh ScrollTrigger to ensure it works properly - with delay to avoid conflicts
    setTimeout(() => {
      try {
        // Only refresh if there are active ScrollTriggers
        if (ScrollTrigger.getAll().length > 0) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("ScrollTrigger refresh failed in ProjectsMain:", error);
      }
    }, 100);
  }, { scope: mainRef, dependencies: [canAnimate] });

  return (
    <main id="main-content" role="main" tabIndex={-1} ref={mainRef}>
      <section aria-labelledby="projects-section-title" className="projects-section" ref={sectionRef}>
        <h2 id="projects-section-title" className="sr-only">{t('projectsMain.overview')}</h2>
        
        {hasError ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">{t('common.errorLoadingProjects')}</p>
          </div>
        ) : projectsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">{t('common.noProjectsAvailable')}</p>
          </div>
        ) : (
          projectsData.map((project, index) => {
            const projectContent = React.useMemo(() => {
              try {
                return t(`projectsMain.${project.key}`, { returnObjects: true }) as any;
              } catch (error) {
                console.warn(`Failed to load project content for ${project.key}:`, error);
                return {
                  label: '',
                  title: '',
                  description: '',
                  visionHeading: '',
                  visionText: ''
                };
              }
            }, [t, project.key]);
            
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
          })
        )}
      </section>
    </main>
  );
};

export default ProjectsMain; 