import React, { useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const Photo: React.FC = () => {
  const { t } = useTranslation();
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLImageElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);

  // Initialize section animations
  useEffect(() => {
    if (isLoading) return;

    gsap.registerPlugin(ScrollTrigger);

    // Set initial states
    gsap.set([image1Ref.current, image2Ref.current], {
      scale: 1.1
    });
    gsap.set([text1Ref.current, text2Ref.current], {
      opacity: 0,
      y: 50
    });

    // Responsive scroll triggers
    ScrollTrigger.matchMedia({
      // Desktop
      "(min-width: 768px)": function() {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: section1Ref.current,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });
        tl1.to(image1Ref.current, {
          scale: 1,
          duration: 1.2,
          ease: "power3.out"
        })
        .to(text1Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.8");

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: section2Ref.current,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });
        tl2.to(image2Ref.current, {
          scale: 1,
          duration: 1.2,
          ease: "power3.out"
        })
        .to(text2Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.8");
      },
      // Mobile
      "(max-width: 767px)": function() {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: section1Ref.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
            // markers: true,
          }
        });
        tl1.to(image1Ref.current, {
          scale: 1.03,
          duration: 1,
          ease: "power2.out"
        })
        .to(text1Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.6");

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: section2Ref.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
            // markers: true,
          }
        });
        tl2.to(image2Ref.current, {
          scale: 1.03,
          duration: 1,
          ease: "power2.out"
        })
        .to(text2Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.6");
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]);

  return (
    <div className="w-full">
      {/* Photo 1 */}
      <section 
        ref={section1Ref}
        className="relative w-full h-[80vh] md:h-screen"
      >
        <div className="relative w-full h-full">
          <img 
            ref={image1Ref}
            src="/assets/photo1.webp" 
            alt="Person in natural environment" 
            className="w-full h-full object-cover"
          />
          
          <div 
            ref={text1Ref}
            className="absolute bottom-[clamp(1.5rem,5vw,6.25rem)] right-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-secondary/80 backdrop-blur-xl p-4 md:p-8 rounded-[20px] mx-4 md:mx-0"
          >
            <p className="body-M text-light">
              {t('mainPage.photo.section1')}
            </p>
          </div>
        </div>
      </section>

      {/* Photo 2 */}
      <section 
        ref={section2Ref}
        className="relative w-full h-[80vh] md:h-screen"
      >
        <div className="relative w-full h-full">
          <img 
            ref={image2Ref}
            src="/assets/photo-2.webp" 
            alt="Natural environment" 
            className="w-full h-full object-cover"
          />
          
          <div 
            ref={text2Ref}
            className="absolute bottom-[clamp(1.5rem,5vw,6.25rem)] left-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-secondary/80 backdrop-blur-xl p-4 md:p-8 rounded-[20px] mx-4 md:mx-0"
          >
            <p className="body-M text-light">
              {t('mainPage.photo.section2')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Photo; 