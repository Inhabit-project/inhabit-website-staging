import React, { useRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqItems?: FAQItem[];
  title?: string;
  description?: string;
}

const FAQ: React.FC<FAQProps> = ({ faqItems, title, description }) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const faqItemsRef = useRef<HTMLDivElement>(null);
  const faqItemsArray = useRef<HTMLDivElement[]>([]);

  // Store ScrollTrigger and timeline references for cleanup
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const defaultFaqItems: FAQItem[] = (t('mainPage.faq.items', { returnObjects: true }) as FAQItem[]);
  const items = faqItems || defaultFaqItems;
  const headerTitle = title || t('mainPage.faq.title');
  const headerDescription = description || t('mainPage.faq.description');

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(faqItemsArray.current, {
      opacity: 0,
      y: 30
    });

    // Only create animations if we can animate
    if (!canAnimate) return;

    // Clean up previous ScrollTrigger and timeline if they exist
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Create scroll-triggered animation
    timelineRef.current = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    timelineRef.current
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
      .to(faqItemsArray.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
      }, "-=0.4");

    // Create scroll trigger with improved configuration for page refresh
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // Back to original position
      end: "bottom 20%", // Back to original position
      toggleActions: "play none none reverse", // Changed from "restart" to "play" for better refresh handling
      animation: timelineRef.current,
      id: `faq-${Date.now()}`, // Unique ID to avoid conflicts
      onEnter: () => {
        // Ensure animation plays when entering the trigger area
        if (timelineRef.current) {
          timelineRef.current.play();
        }
      },
      onLeaveBack: () => {
        // Reverse animation when scrolling back up
        if (timelineRef.current) {
          timelineRef.current.reverse();
        }
      },
      onRefresh: () => {
        // Handle refresh by checking if element is in view and playing animation accordingly
        if (scrollTriggerRef.current && timelineRef.current) {
          const progress = scrollTriggerRef.current.progress;
          if (progress > 0) {
            timelineRef.current.progress(progress);
          }
        }
      }
    });

    // Refresh ScrollTrigger to ensure it works properly - with delay to avoid conflicts
    setTimeout(() => {
      try {
        // Only refresh if there are active ScrollTriggers
        if (ScrollTrigger.getAll().length > 0) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("ScrollTrigger refresh failed in FAQ:", error);
      }
    }, 100);
  }, { scope: sectionRef, dependencies: [canAnimate] });

  // Handle loading state change
  React.useEffect(() => {
    // Allow animations immediately when loader is not active
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle page refresh by checking scroll position
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current scroll position
      sessionStorage.setItem('faqScrollPosition', window.scrollY.toString());
    };

    const handleLoad = () => {
      // Check if we're returning from a refresh and scroll to position if needed
      const savedPosition = sessionStorage.getItem('faqScrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Only scroll if the position is significant
        if (position > 100) {
          setTimeout(() => {
            window.scrollTo(0, position);
            // Clear the stored position
            sessionStorage.removeItem('faqScrollPosition');
          }, 100);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen background-gradient-dark">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 ref={titleRef} className="heading-2 text-light max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: headerTitle }} />
            </h2>
            <p ref={descriptionRef} className="body-M text-light max-w-[35rem]">
              {headerDescription}
            </p>
          </div>

          {/* FAQ Items */}
          <div ref={faqItemsRef} className="w-full max-w-[50rem] ml-auto">
            {items.map((item, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) faqItemsArray.current[index] = el;
                }}
                className="border-b border-[#F6FFEA]/20 last:border-b-0"
              >
                <div 
                  className="flex items-center justify-between py-6 group gap-4"
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button
                    className={`min-w-8 min-h-8 w-8 h-8 aspect-square rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleAccordion(index)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <img
                      src="/assets/faq-plus-icon.svg"
                      alt={openIndex === index ? "Close" : "Open"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[auto] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQWhite: React.FC<{ faqItems?: { question: string; answer: string }[]; title?: string; description?: string }> = ({ faqItems, title, description }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const faqItemsRef = useRef<HTMLDivElement>(null);
  const faqItemsArray = useRef<HTMLDivElement[]>([]);

  // Store ScrollTrigger and timeline references for cleanup
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const defaultFaqItems = [
    {
      question: "What is a Stewardship NFT?",
      answer: "A Stewardship NFT is a digital asset that grants you rights and benefits related to a specific land or project, supporting conservation and restoration efforts.",
    },
    {
      question: "How do I become a guardian?",
      answer: "You can become a guardian by purchasing a Stewardship NFT and participating in the stewardship community.",
    },
    {
      question: "What are the benefits of being a guardian?",
      answer: "Guardians receive exclusive access to restoration tools, immersive experiences, and direct ties to ecological and spiritual knowledge.",
    },
    {
      question: "Can I transfer my NFT?",
      answer: "Yes, Stewardship NFTs are transferable and can be sold or gifted to others.",
    },
  ];
  const items = faqItems || defaultFaqItems;

  // Handle loading state change
  React.useEffect(() => {
    // Allow animations immediately when loader is not active
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 50
    });
    gsap.set(faqItemsArray.current, {
      opacity: 0,
      y: 30
    });

    // Only create animations if we can animate
    if (!canAnimate) return;

    // Clean up previous ScrollTrigger and timeline if they exist
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Create scroll-triggered animation
    timelineRef.current = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    timelineRef.current
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(faqItemsArray.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4");

    // Create scroll trigger with improved configuration for page refresh
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // Back to original position
      end: "bottom 20%", // Back to original position
      toggleActions: "play none none reverse", // Changed from "restart" to "play" for better refresh handling
      animation: timelineRef.current,
      id: `faq-white-${Date.now()}`, // Unique ID to avoid conflicts
      onEnter: () => {
        // Ensure animation plays when entering the trigger area
        if (timelineRef.current) {
          timelineRef.current.play();
        }
      },
      onLeaveBack: () => {
        // Reverse animation when scrolling back up
        if (timelineRef.current) {
          timelineRef.current.reverse();
        }
      },
      onRefresh: () => {
        // Handle refresh by checking if element is in view and playing animation accordingly
        if (scrollTriggerRef.current && timelineRef.current) {
          const progress = scrollTriggerRef.current.progress;
          if (progress > 0) {
            timelineRef.current.progress(progress);
          }
        }
      }
    });

    // Refresh ScrollTrigger to ensure it works properly - with delay to avoid conflicts
    setTimeout(() => {
      try {
        // Only refresh if there are active ScrollTriggers
        if (ScrollTrigger.getAll().length > 0) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("ScrollTrigger refresh failed in FAQWhite:", error);
      }
    }, 100);
  }, { scope: sectionRef, dependencies: [canAnimate] });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle page refresh by checking scroll position
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current scroll position
      sessionStorage.setItem('faqWhiteScrollPosition', window.scrollY.toString());
    };

    const handleLoad = () => {
      // Check if we're returning from a refresh and scroll to position if needed
      const savedPosition = sessionStorage.getItem('faqWhiteScrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Only scroll if the position is significant
        if (position > 100) {
          setTimeout(() => {
            window.scrollTo(0, position);
            // Clear the stored position
            sessionStorage.removeItem('faqWhiteScrollPosition');
          }, 100);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen background-gradient-light ">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 ref={titleRef} className="heading-2 text-secondary max-w-[40.9375rem]">
              {title || 'Frequently Asked'}<br />
              <strong>{description || 'Questions'}</strong>
            </h2>
          </div>
          {/* FAQ Items */}
          <div ref={faqItemsRef} className="w-full max-w-[50rem] ml-auto text-secondary">
            {items.map((item, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) faqItemsArray.current[index] = el;
                }}
                className="border-b border-[#1B3A2B]/20 last:border-b-0"
              >
                <div 
                  className="flex items-center justify-between py-6 cursor-pointer group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-secondary body-M">
                    {item.question}
                  </h3>
                  <button 
                    className={`w-8 h-8 rounded-full bg-secondary/10 backdrop-blur-[7.5px] border border-[#1B3A2B]/50 flex items-center justify-center transition-all duration-300 group-hover:border-secondary group-hover:bg-secondary/20 ${openIndex === index ? 'rotate-45' : ''}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3.333v9.334M3.333 8h9.334" stroke="#1B3A2B" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-secondary/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQHubs: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const faqItemsRef = useRef<HTMLDivElement>(null);
  const faqItemsArray = useRef<HTMLDivElement[]>([]);

  const faqItems: FAQItem[] = (t('hubsPage.faq.items', { returnObjects: true }) as FAQItem[]);

  // Set initial states with useGSAP
  useGSAP(() => {
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(faqItemsArray.current, {
      opacity: 0,
      y: 30
    });
  }, { scope: sectionRef });

  // Handle loading state change
  React.useEffect(() => {
    // Allow animations when page is ready for animations OR when loader is not active
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(faqItemsArray.current, {
      opacity: 0,
      y: 30
    });

    // Only create animations if we can animate
    if (!canAnimate) return;

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "center center",
        toggleActions: "restart none none none"
      }
    });

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
    .to(faqItemsArray.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4");

    // Refresh ScrollTrigger to ensure it works on page refresh
    ScrollTrigger.refresh();
  }, { scope: sectionRef, dependencies: [canAnimate] });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen background-gradient-dark">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 ref={titleRef} className="heading-2 text-light max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: t('hubsPage.faq.title') }} />
            </h2>
            <p ref={descriptionRef} className="body-M text-light max-w-[35rem]">
              {t('hubsPage.faq.description')}
            </p>
          </div>

          {/* FAQ Items */}
          <div ref={faqItemsRef} className="w-full max-w-[50rem] ml-auto">
            {faqItems.map((item, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) faqItemsArray.current[index] = el;
                }}
                className="border-b border-[#F6FFEA]/20 last:border-b-0"
              >
                <div 
                  className="flex items-center justify-between py-6 group gap-4"
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button
                    className={`min-w-8 min-h-8 w-8 h-8 aspect-square rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleAccordion(index)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <img
                      src="/assets/faq-plus-icon.svg"
                      alt={openIndex === index ? "Close" : "Open"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQStewardshipNFT: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const faqItemsRef = useRef<HTMLDivElement>(null);
  const faqItemsArray = useRef<(HTMLDivElement | null)[]>([]);

  // Store ScrollTrigger and timeline references for cleanup
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const faqItems: FAQItem[] = (t('mainPage.stewardshipNFTPage.faq.items', { returnObjects: true }) as FAQItem[]);

  // Handle loading state change
  React.useEffect(() => {
    // Allow animations immediately when loader is not active
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(faqItemsArray.current, {
      opacity: 0,
      y: 30
    });

    // Only create animations if we can animate
    if (!canAnimate || !sectionRef.current) return;

    // Clean up previous ScrollTrigger and timeline if they exist
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Create new timeline
    timelineRef.current = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    timelineRef.current
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      })
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.6')
      .to(faqItemsArray.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1
      }, '-=0.4');

    // Create scroll trigger with improved configuration for page refresh
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%', // Back to original position
      end: 'bottom 20%', // Back to original position
      toggleActions: 'play none none reverse', // Changed from "restart" to "play" for better refresh handling
      animation: timelineRef.current,
      id: `faq-stewardship-${Date.now()}`, // Unique ID to avoid conflicts
      onEnter: () => {
        // Ensure animation plays when entering the trigger area
        if (timelineRef.current) {
          timelineRef.current.play();
        }
      },
      onLeaveBack: () => {
        // Reverse animation when scrolling back up
        if (timelineRef.current) {
          timelineRef.current.reverse();
        }
      },
      onRefresh: () => {
        // Handle refresh by checking if element is in view and playing animation accordingly
        if (scrollTriggerRef.current && timelineRef.current) {
          const progress = scrollTriggerRef.current.progress;
          if (progress > 0) {
            timelineRef.current.progress(progress);
          }
        }
      }
    });

    // Refresh ScrollTrigger to ensure it works properly - with delay to avoid conflicts
    setTimeout(() => {
      try {
        // Only refresh if there are active ScrollTriggers
        if (ScrollTrigger.getAll().length > 0) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("ScrollTrigger refresh failed in FAQStewardshipNFT:", error);
      }
    }, 100);
  }, { scope: sectionRef, dependencies: [canAnimate] });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle page refresh by checking scroll position
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Store current scroll position
      sessionStorage.setItem('faqStewardshipScrollPosition', window.scrollY.toString());
    };

    const handleLoad = () => {
      // Check if we're returning from a refresh and scroll to position if needed
      const savedPosition = sessionStorage.getItem('faqStewardshipScrollPosition');
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Only scroll if the position is significant
        if (position > 100) {
          setTimeout(() => {
            window.scrollTo(0, position);
            // Clear the stored position
            sessionStorage.removeItem('faqStewardshipScrollPosition');
          }, 100);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen background-gradient-dark">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 ref={titleRef} className="heading-2 text-light max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFTPage.faq.title') }} />
            </h2>
            <p ref={descriptionRef} className="body-M text-light max-w-[35rem]">
              {t('mainPage.stewardshipNFTPage.faq.description')}
            </p>
          </div>

          {/* FAQ Items */}
          <div ref={faqItemsRef} className="w-full max-w-[50rem] ml-auto">
            {faqItems.map((item, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) faqItemsArray.current[index] = el;
                }}
                className="border-b border-[#F6FFEA]/20 last:border-b-0"
              >
                <div 
                  className="flex items-center justify-between py-6 group gap-4"
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button
                    className={`min-w-8 min-h-8 w-8 h-8 aspect-square rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleAccordion(index)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <img
                      src="/assets/faq-plus-icon.svg"
                      alt={openIndex === index ? "Close" : "Open"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 

export default FAQ; 