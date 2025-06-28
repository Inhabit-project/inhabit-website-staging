import React, { useRef, useEffect, useContext, useState } from 'react';
import LogosSection from './LogosSection';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

interface Testimonial {
  image: string;
  role: string;
  name: string;
  quote: string;
}

interface Partner {
  logo: string;
  name: string;
}

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

  const testimonials: Testimonial[] = [
    {
      image: "/assets/logos/testimonial-image.png",
      role: "CEO ECONETWORK",
      name: "ANNIE VASQUEZ",
      quote: "\" Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. \""
    },
    {
      image: "/assets/logos/testimonial-image.png",
      role: "CEO ECONETWORK",
      name: "ANNIE VASQUEZ",
      quote: "\" Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. \""
    },
    {
      image: "/assets/logos/testimonial-image.png",
      role: "CEO ECONETWORK",
      name: "ANNIE VASQUEZ",
      quote: "\" Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. \""
    }
  ];

  const partners: Partner[] = [
    { logo: '/assets/logos/partner-logo-1.png', name: 'Partner 1' },
    { logo: '/assets/logos/partner-logo-2.png', name: 'Partner 2' },
    { logo: '/assets/logos/partner-logo-3.svg', name: 'Partner 3' },
    { logo: '/assets/logos/partner-logo-4.png', name: 'Partner 4' },
    { logo: '/assets/logos/partner-logo-5.png', name: 'Partner 5' }
  ];

  // Set initial states
  useEffect(() => {
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
    let ctx = gsap.context(() => {});

    if (canAnimate) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });

        // Title and description animations
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        // Testimonial card animation
        .to(testimonialCardRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4")
        // Testimonial image animation
        .to(testimonialImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        // Testimonial content animation
        .to(testimonialContentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6");
      });
    }

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <>
      <section 
        ref={sectionRef}
        className="background-gradient-dark py-8 md:py-16 lg:py-[6.5rem] px-4 md:px-8 lg:px-[6.25rem] overflow-x-hidden flex flex-col gap-8 md:gap-16 lg:gap-[3.75rem] scroll-container"
        aria-labelledby="testimonials-title"
      >
        <div className="w-full">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between w-full gap-6 md:gap-8">
            <h2 
              ref={titleRef}
              id="testimonials-title"
              className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]"
            >
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.testimonials.title') }} />
            </h2>
            <p 
              ref={descriptionRef}
              className="font-nunito font-light text-xl md:text-2xl lg:text-[1.75rem] leading-[1.24em] text-[#F6FFEA] max-w-full md:max-w-[35rem]"
            >
              {t('mainPage.testimonials.description')}
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div 
          ref={testimonialCardRef}
          className="bg-[#162F08] border border-white/20 rounded-[1.7rem] shadow-[inset_0px_0px_2.7px_rgba(61,27,114,1)] backdrop-blur-6xl p-6 md:p-8 lg:p-[3.4rem] w-full"
          role="article"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-[3.4rem] w-full">
            <div 
              ref={testimonialImageRef}
              className="w-full md:w-[33%] h-60 md:h-auto rounded-[1.3rem] overflow-hidden"
            >
              <img 
                src="/assets/louise.webp" 
                alt={t('mainPage.testimonials.testimonial.imageAlt', 'Portrait of Louise Borreani')}
                className="w-full h-full object-cover"
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