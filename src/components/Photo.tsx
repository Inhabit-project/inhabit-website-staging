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
  const image1ContainerRef = useRef<HTMLDivElement>(null);
  const image2ContainerRef = useRef<HTMLDivElement>(null);
  const textBox1Ref = useRef<HTMLDivElement>(null);
  const textBox2Ref = useRef<HTMLDivElement>(null);
  const animation1Ref = useRef<gsap.core.Timeline | null>(null);
  const animation2Ref = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (isLoading) return;
    gsap.registerPlugin(ScrollTrigger);

    // Section 1 animation (scroll-triggered)
    if (image1ContainerRef.current && textBox1Ref.current && section1Ref.current) {
      animation1Ref.current = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section1Ref.current,
          start: 'top center',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
      });
      animation1Ref.current
        .fromTo(image1ContainerRef.current, { opacity: 0.8, }, { opacity: 1,  duration: 1.2, ease: 'power2.out' })
        .fromTo(textBox1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8');
    }
    // Section 2 animation (scroll-triggered)
    if (image2ContainerRef.current && textBox2Ref.current && section2Ref.current) {
      animation2Ref.current = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section2Ref.current,
          start: 'top center',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
      });
      animation2Ref.current
        .fromTo(image2ContainerRef.current, { opacity: 0.8, }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
        .fromTo(textBox2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8');
    }
    return () => {
      if (animation1Ref.current) { animation1Ref.current.kill(); animation1Ref.current = null; }
      if (animation2Ref.current) { animation2Ref.current.kill(); animation2Ref.current = null; }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]);

  return (
    <div className="relative w-full">
      {/* Photo 1 */}
      <section 
        ref={section1Ref}
        className="relative w-full h-screen min-h-screen"
      >
        <div ref={image1ContainerRef} className="relative w-full h-full min-h-screen">
          <img 
            ref={image1Ref}
            src="/assets/photo1.webp" 
            alt="Person in natural environment" 
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div 
            ref={textBox1Ref}
            className="absolute bottom-[clamp(1.5rem,5vw,6.25rem)] right-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-white/10 backdrop-blur-2xl p-4 md:p-8 rounded-[20px] mx-4 md:mx-0 shadow-lg"
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
        className="relative w-full h-screen min-h-screen"
      >
        <div ref={image2ContainerRef} className="relative w-full h-full min-h-screen">
          <img 
            ref={image2Ref}
            src="/assets/photo-2.webp" 
            alt="Natural environment" 
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div 
            ref={textBox2Ref}
            className="absolute bottom-[clamp(1.5rem,5vw,6.25rem)] left-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-white/10 backdrop-blur-2xl p-4 md:p-8 rounded-[20px] mx-4 md:mx-0 shadow-lg"
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