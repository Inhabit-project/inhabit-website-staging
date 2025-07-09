import React, { useRef, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

interface InternalPagesHeroProps {
  variant: 'hubs' | 'stewardship' | 'about' | 'nuiyanzhi' | 'projects';
  title?: string;
  strong?: string;
  description?: string;
  image?: string;
  alt?: string;
  onHeroImageLoad?: () => void;
}

const heroContent = {
  hubs: {
    image: '/assets/hubs-hero.webp',
    alt: 'Hubs Hero',
  },
  stewardship: {
    image: '/assets/nft-hero.jpg',
    alt: 'Stewardship NFT Hero',
  },
  about: {
    image: '/assets/about-us-hero.webp',
    alt: 'About Us Hero',
  },
  nuiyanzhi: {
    image: '/assets/Nuiyanzhi.webp',
    alt: 'Hubs Hero',
  },
  projects: {
    image: '/assets/nft-hero.jpg',
    alt: 'Projects Hero',
  },
};

const InternalPagesHero: React.FC<InternalPagesHeroProps> = ({ variant, title, strong, description, image, alt, onHeroImageLoad }) => {
  const { t } = useTranslation();
  const content = heroContent[variant];
  const tKey = `internalPagesHero.${variant}`;
  const heroTitleId = `${variant}-hero-title`;
  const heroDescriptionId = `${variant}-hero-description`;
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const strongRef = useRef<HTMLElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Set initial states immediately
  useEffect(() => {
    gsap.set([titleRef.current, strongRef.current, descriptionRef.current], {
      opacity: 0,
      y: 100
    });

    gsap.set(imageRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.95
    });
  }, []);

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      // Wait for SubLoader exit animation to complete
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500); // Increased delay to ensure SubLoader is completely gone

      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Handle animations only after loading is complete
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

        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        })
        .to(strongRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.4")
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.4")
        .to(imageRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        }, "-=0.3");
      });
    }

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section 
      ref={sectionRef}
      className="w-full flex flex-col items-center justify-center min-h-screen py-8  background-gradient-light pt-32"
      aria-labelledby={heroTitleId}
    >
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col justify-between h-full flex-1 md:items-start md:gap-8">
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full md:mb-[2.5rem]">
          <h1 
            ref={titleRef}
            id={heroTitleId}
            className="heading-2 text-secondary max-w-[40.9375rem]"
          >
            <span dangerouslySetInnerHTML={{ __html: title || t(`${tKey}.title`) }} />
            <br />
            <strong ref={strongRef}>
              <span dangerouslySetInnerHTML={{ __html: strong || t(`${tKey}.strong`) }} />
            </strong>
          </h1>
          <p 
            ref={descriptionRef}
            id={heroDescriptionId}
            className="body-M text-secondary max-w-[36rem]"
            aria-labelledby={heroTitleId}
          >
            {description || t(`${tKey}.description`)}
          </p>
        </div>
        <div className="w-full flex justify-center mb-8 md:mb-0">
          <img 
            ref={imageRef}
            src={image || content.image} 
            alt={alt || content.alt} 
            className="w-full rounded-xl object-cover"
            loading="lazy"
            aria-describedby={heroDescriptionId}
            onLoad={onHeroImageLoad}
          />
        </div>
      </div>
    </section>
  );
};

export default InternalPagesHero; 