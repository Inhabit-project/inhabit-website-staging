import React, { useRef, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const NFTWorksSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const step1Ref = useRef<HTMLElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step1ImageRef = useRef<HTMLImageElement>(null);
  const step2ImageRef = useRef<HTMLImageElement>(null);
  const step1NumberRef = useRef<HTMLSpanElement>(null);
  const step2NumberRef = useRef<HTMLSpanElement>(null);
  const step1ContentRef = useRef<HTMLDivElement>(null);
  const step2ContentRef = useRef<HTMLDivElement>(null);

  // Timeline refs for cleanup
  const mainTlRef = useRef<gsap.core.Timeline | null>(null);
  const step1TlRef = useRef<gsap.core.Timeline | null>(null);
  const step2TlRef = useRef<gsap.core.Timeline | null>(null);

  // Set initial states
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, descriptionRef.current], {
        opacity: 0,
        y: 50
      });

      gsap.set([step1ImageRef.current, step2ImageRef.current], {
        opacity: 0,
        y: 50,
        scale: 0.95
      });

      gsap.set([step1NumberRef.current, step2NumberRef.current], {
        opacity: 0,
        y: 30
      });

      gsap.set([step1ContentRef.current, step2ContentRef.current], {
        opacity: 0,
        y: 30
      });
    }, sectionRef);

    return () => ctx.revert();
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
    if (!canAnimate || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Kill existing timelines if they exist
      if (mainTlRef.current) mainTlRef.current.kill();
      if (step1TlRef.current) step1TlRef.current.kill();
      if (step2TlRef.current) step2TlRef.current.kill();

      // Title and description animation
      mainTlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
          id: `nft-works-main-${Date.now()}` // Unique ID to avoid conflicts
        }
      });

      mainTlRef.current
        .to(titleRef.current, {
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
        }, "-=0.6");

      // Step 1 animation
      step1TlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: step1Ref.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
          id: `nft-works-step1-${Date.now()}` // Unique ID to avoid conflicts
        }
      });

      step1TlRef.current
        .to(step1ImageRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(step1NumberRef.current, {
          opacity: 0.9,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        .to(step1ContentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4");

      // Step 2 animation
      step2TlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: step2Ref.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
          id: `nft-works-step2-${Date.now()}` // Unique ID to avoid conflicts
        }
      });

      step2TlRef.current
        .to(step2ImageRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(step2NumberRef.current, {
          opacity: 0.9,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        .to(step2ContentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4");
    }, sectionRef); // Scope all animations to the section

    return () => {
      ctx.revert(); // This will clean up all animations created in this context
      // Additionally kill timelines explicitly
      if (mainTlRef.current) mainTlRef.current.kill();
      if (step1TlRef.current) step1TlRef.current.kill();
      if (step2TlRef.current) step2TlRef.current.kill();
    };
  }, [canAnimate]);

  return (
    <section
      ref={sectionRef}
      className="w-full h-full py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--background-gradient-light)' }}
      aria-labelledby="nft-works-title"
    >
      <div className="max-w-[160rem] mx-auto flex flex-col gap-24">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 ref={titleRef} id="nft-works-title" className="heading-2 text-secondary max-w-[40.9375rem]">
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.nftWorksSection.title') }} />
          </h2>
          <p ref={descriptionRef} className="body-M text-secondary max-w-[35rem]">
            {t('mainPage.nftWorksSection.description')}
          </p>
        </div>
        {/* Step 1 */}
        <article ref={step1Ref} className="flex flex-col lg:flex-row items-end gap-12">
          {/* Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              ref={step1ImageRef}
              src="/assets/stewardship-nft.webp"
              alt="NFT Stewardship Illustration"
              className="w-full max-w-[100%] h-auto"
              loading="lazy"
            />
          </div>
          {/* Text Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="w-full flex flex-row justify-end">
              <span
                ref={step1NumberRef}
                className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
                style={{ fontWeight: 400 }}
                aria-hidden="true"
              >
                01
              </span>
            </div>
            <div ref={step1ContentRef} className="w-full max-w-xl">
              <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {t('mainPage.nftWorksSection.steps.0.title')}
              </h3>
              <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
                {t('mainPage.nftWorksSection.steps.0.description')}
              </p>
            </div>
          </div>
        </article>
        {/* Step 2 */}
        <div ref={step2Ref} className="flex flex-col lg:flex-row items-end gap-12">
          {/* Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              ref={step2ImageRef}
              src="/assets/nft-works/nft-works-step2-image.webp"
              alt="NFT Implementation Illustration"
              className="w-full max-w-[100%] h-auto mix-blend-multiply"
            />
          </div>
          {/* Text Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="w-full flex flex-row justify-end">
              <span
                ref={step2NumberRef}
                className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
                style={{ fontWeight: 400 }}
              >
                02
              </span>
            </div>
            <div ref={step2ContentRef} className="w-full max-w-xl">
              <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {t('mainPage.nftWorksSection.steps.1.title')}
              </h3>
              <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
                {t('mainPage.nftWorksSection.steps.1.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTWorksSection; 