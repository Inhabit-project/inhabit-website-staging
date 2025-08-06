import React, { useRef, useContext, useState, useEffect } from 'react';
import LogosSection from './LogosSection';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const testimonialCardRef = useRef<HTMLDivElement>(null);
  const testimonialImageRef = useRef<HTMLDivElement>(null);
  const testimonialContentRef = useRef<HTMLDivElement>(null);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    try {
      // Set initial states
      gsap.set([titleRef.current, descriptionRef.current], {
        opacity: 0,
        y: 50
      });
      gsap.set(testimonialCardRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });
      gsap.set(testimonialImageRef.current, {
        opacity: 0,
        scale: 0.95
      });
      gsap.set(testimonialContentRef.current, {
        opacity: 0,
        y: 30
      });

      // Only create animations if we can animate
      if (!canAnimate) return;

      // Create timeline
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      timeline
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        })
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, "-=0.6")
        .to(testimonialCardRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
        }, "-=0.4")
        .to(testimonialImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
        }, "-=0.6")
        .to(testimonialContentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, "-=0.6");

      // Create scroll trigger
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        animation: timeline,
      });

      // Refresh ScrollTrigger to ensure it works on page refresh
      ScrollTrigger.refresh();
    } catch (error) {
      // Animation failed silently
    }
  }, { scope: sectionRef, dependencies: [canAnimate] });

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  
  return (
    <>
      <section 
        ref={sectionRef}
        className="background-gradient-dark py-24 md:py-16 lg:py-[6.5rem] px-4 md:px-8 lg:px-[6.25rem] overflow-x-hidden flex flex-col gap-8 md:gap-16 lg:gap-[3.75rem] scroll-container"
        aria-labelledby="testimonials-title"
      >
        <div className="w-full">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between w-full gap-6 md:gap-8">
            <h2 
              ref={titleRef}
              id="testimonials-title"
              className="heading-2 text-light max-w-[40.9375rem]"
            >
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.testimonials.title') }} />
            </h2>
            <p 
              ref={descriptionRef}
              className="font-nunito font-light body-M text-white max-w-full md:max-w-[35rem]"
            >
              {t('mainPage.testimonials.description')}
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div 
          ref={testimonialCardRef}
          className="bg-[#162F08] rounded-2xl shadow-lg backdrop-blur-6xl p-6 md:p-8 lg:p-[3.4rem] w-full"
          role="article"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-[3.4rem] w-full">
            <div 
              ref={testimonialImageRef}
              className="w-full md:w-[30%] h-50 md:h-auto rounded-xl overflow-hidden"
            >
              <img 
                src="/assets/louise.webp" 
                alt={t('mainPage.testimonials.testimonial.imageAlt', 'Portrait of Louise Borreani')}
                className="w-full h-full object-cover object-left"
                loading="lazy"
              />
            </div>
            <div 
              ref={testimonialContentRef}
              className="flex flex-col gap-4 md:gap-[2rem] flex-1"
            >
              <h3 className="font-abel text-white text-base tracking-[0.07em] uppercase">
                Louise Borreani
              </h3>
              <blockquote className="font-nunito text-white text-xl md:text-3xl lg:text-[2.5rem] leading-[1.1em]">
                {t('mainPage.testimonials.testimonial.quote')}
              </blockquote>
              <cite className="font-nunito text-white text-base body-M leading-[1.36em] tracking-[-0.015em] not-italic">
                Co-founder, Ecofrontiers
              </cite>
            </div>
          </div>
        </div>
      </section>
      <LogosSection showAllies />
    </>
  );
};

export default Testimonials; 