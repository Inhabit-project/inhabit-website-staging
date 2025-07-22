import React, { useLayoutEffect, useRef, useContext } from 'react';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger, refreshScrollTriggers } from '../utils/gsap';
import { LoadingContext } from '../App';

const wrapWordsInHTMLString = (html: string) => {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  // Walk all text nodes and wrap words
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null);
  const textNodes: Node[] = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }
  textNodes.forEach(textNode => {
    const words = textNode.textContent?.split(/\s+/) || [];
    const spans = words.map((word, i) =>
      `<span class=\"word-wrap\"><span class=\"word\">${word}</span></span>${i < words.length - 1 ? ' ' : ''}`
    ).join('');
    const temp = document.createElement('span');
    temp.innerHTML = spans;
    textNode.parentNode?.replaceChild(temp, textNode);
  });
  return tempDiv.innerHTML;
};

const Highlight = () => {
  const { t } = useTranslation();
  const svgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);

  // Preprocess the description HTML for word wrapping
  const descriptionHTML = wrapWordsInHTMLString(t('mainPage.highlight.description'));

  useLayoutEffect(() => {
    // Use a single dependency for robustness
    if (isLoading) return;
    // Delay setup until DOM is ready
    let rafId = requestAnimationFrame(() => {
      const svg = svgRef.current;
      const title = titleRef.current;
      const description = descriptionRef.current;
      const content = contentRef.current;
      if (!svg || !title || !description || !content) return;
      let ctx = gsap.context(() => {
        gsap.set(svg, { opacity: 0, scale: 0.8 });
        gsap.set(title, { opacity: 0, y: 30 });
        gsap.set(description.querySelectorAll('.word'), { opacity: 0, y: 30 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: content,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse",
            onEnter: () => {},
            onUpdate: (self) => {
              // If already past the trigger, play immediately
              if (self.progress === 1 && !tl.isActive()) {
                tl.progress(1);
              }
            }
          }
        });
        tl.to(svg, { opacity: 0.3, scale: 1, duration: 1, ease: "power3.out" })
          .to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
          .to(description.querySelectorAll('.word'), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out"
          }, "-=0.4");
        refreshScrollTriggers(50);
      }, content);
      // Cleanup
      return () => {
        ctx.revert();
        cancelAnimationFrame(rafId);
      };
    });
    // Cleanup in case effect is re-run
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isLoading, descriptionHTML]);

  return (
    <div className="relative w-full min-h-screen background-gradient-dark flex items-center justify-center overflow-hidden">
      <div ref={svgRef} className="absolute inset-0 w-full h-full opacity-0 topographic-map" style={{ minWidth: '100vw', minHeight: '100vh' }}>
        <ReactSVG src="/assets/topographic-map.svg" />
      </div>
      <div 
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
      >
        <p 
          ref={titleRef}
          className="eyebrow text-light mb-5"
        >
          {t('mainPage.highlight.title')}
        </p>
        <h3 
          ref={descriptionRef}
          className="text-light"
          style={{ perspective: "1000px" }}
          dangerouslySetInnerHTML={{ __html: descriptionHTML }} 
        />
      </div>
    </div>
  );
};

const LocationMarker = ({ name, coordinates }: { name: string, coordinates: string }) => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 mb-1">
        <div className="relative">
          <div className="w-4 h-4 rounded-full border border-green-soft" />
          <div className="w-2 h-2 rounded-full bg-green-soft absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="eyebrow text-green-soft">
          {name}
        </div>
      </div>
      <div className="eyebrow text-green-soft">
        {coordinates}
      </div>
    </div>
  );
};

export default Highlight; 