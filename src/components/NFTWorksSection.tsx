import React, { useRef, useLayoutEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';

const NFTWorksSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);

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

  // Initialize animations - using the exact working pattern from Video/Hubs/StewardshipNFT
  useLayoutEffect(() => {
    if (isLoading) return;
    const section = sectionRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const step1 = step1Ref.current;
    const step2 = step2Ref.current;
    if (!section || !title || !description) return;
    
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([title, description], {
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

      // Title and description animation
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      });

      mainTl
        .to(title, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(description, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6");

      // Step 1 animation
      if (step1) {
        const step1Tl = gsap.timeline({
          scrollTrigger: {
            trigger: step1,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });

        step1Tl
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
      }

      // Step 2 animation
      if (step2) {
        const step2Tl = gsap.timeline({
          scrollTrigger: {
            trigger: step2,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });

        step2Tl
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
      }

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

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
              src="/assets/nft.png"
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