import { useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const Highlight = () => {
  const { t } = useTranslation();
  const svgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);

  useGSAP(() => {
    if (isLoading) {
      return;
    }

    const svg = svgRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const content = contentRef.current;
    
    if (!svg || !title || !description || !content) {
      return;
    }

    // Set initial states
    gsap.set(svg, { 
      opacity: 0, 
      scale: 0.8 
    });
    
    gsap.set(title, {
      opacity: 0,
      y: 30
    });

    gsap.set(description, {
      opacity: 0,
      y: 30,
      scale: 0.9
    });

    // Create the animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: content,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse"
      }
    });

    // Animate eyebrow first
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    // Animate h3 second
    .to(description, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    // Animate background SVG last
    .to(svg, {
      opacity: 0.3,
      scale: 1,
      duration: 1.0,
      ease: "power3.out"
    }, "-=0.6");

    // Refresh ScrollTrigger after timeline is set up
    ScrollTrigger.refresh();

  }, { scope: contentRef, dependencies: [isLoading] });

  return (
    <div className="relative w-full h-screen background-gradient-dark flex items-center justify-center overflow-hidden min-h-screen">
      <div ref={svgRef} className="absolute inset-0 opacity-0 topographic-map mix-blend-overlay">
        <img src="/assets/topographic-map.webp" alt="Topographic map" className="w-full h-full object-cover" />
      </div>
      <div 
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-4 text-center"
      >
        <p 
          ref={titleRef}
          className="eyebrow text-light mb-5 opacity-0"
        >
          {t('mainPage.highlight.title')}
        </p>
        <h3 
          ref={descriptionRef}
          className="text-light opacity-0"
          style={{ perspective: "1000px" }}
          dangerouslySetInnerHTML={{ __html: t('mainPage.highlight.description') }} 
        />
        <div className="mt-8">
          <a href="https://docsend.com/view/z34fcq8w3f8hgz7h" target="_blank" rel="noopener noreferrer">
            <button className="btn-secondary transition-all duration-200 group">
              <div className="flex items-center gap-2 px-4">
                <svg className="w-6 h-6 transition-colors duration-200 group-hover:[&>path]:stroke-[var(--color-light)]" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" style={{stroke: 'var(--color-secondary)'}}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="button-text text-secondary group-hover:text-light transition-colors duration-200">{t('menu.downloadTwoPager')}</span>
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};


export default Highlight; 