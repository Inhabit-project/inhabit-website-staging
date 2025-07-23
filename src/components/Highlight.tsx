import React, { useEffect, useRef, useContext } from 'react';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';

const Highlight = () => {
  const { t } = useTranslation();
  const svgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);

  useEffect(() => {
    console.log('🔄 Highlight useEffect - isLoading:', isLoading);
    
    if (isLoading) {
      console.log('⏳ Still loading, skipping setup');
      return;
    }

    const svg = svgRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const content = contentRef.current;
    
    console.log('📋 Elements check:', { 
      svg: !!svg, 
      title: !!title, 
      description: !!description, 
      content: !!content 
    });
    
    if (!svg || !title || !description || !content) {
      console.log('❌ Missing elements');
      return;
    }

    console.log('📝 Description HTML:', description.innerHTML);
    console.log('📝 Description text:', description.textContent);

    // TEST: First try animating the h3 as-is without word wrapping
    console.log('🧪 Testing basic h3 animation without word wrapping');
    
    let ctx = gsap.context(() => {
      // Set initial states
      console.log('🎬 Setting initial states');
      
      gsap.set(svg, { 
        opacity: 0, 
        scale: 0.8 
      });
      
      gsap.set(title, {
        opacity: 0,
        y: 30
      });

      // Test: animate the h3 element directly first
      gsap.set(description, {
        opacity: 0,
        y: 30,
        scale: 0.9
      });

      console.log('✅ Initial states set');

      // Create the animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: content,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
          onEnter: () => console.log('🎯 ScrollTrigger ENTERED'),
          onLeave: () => console.log('🎯 ScrollTrigger LEFT'),
          onToggle: self => console.log('🎯 ScrollTrigger toggled:', self.isActive)
        }
      });

      console.log('🎬 Creating timeline');

      // Animate background SVG
      tl.to(svg, {
        opacity: 0.3,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        onStart: () => console.log('🎬 SVG animation started'),
        onComplete: () => console.log('✅ SVG animation completed')
      })
      // Animate title
      .to(title, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => console.log('🎬 Title animation started'),
        onComplete: () => console.log('✅ Title animation completed')
      }, "-=0.5")
      // Animate h3 directly (no word wrapping yet)
      .to(description, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => console.log('🎬 H3 animation started'),
        onComplete: () => console.log('✅ H3 animation completed')
      }, "-=0.4");

      console.log('🎬 Timeline created');

      // Check ScrollTrigger position immediately
      setTimeout(() => {
        const rect = content.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        console.log('📏 Content position:', {
          top: rect.top,
          center: rect.top + rect.height / 2,
          windowCenter: windowHeight / 2,
          shouldTrigger: rect.top < windowHeight / 2
        });
      }, 100);

      // Refresh ScrollTrigger after timeline is set up
      ScrollTrigger.refresh();
      console.log('🔄 ScrollTrigger refreshed');

    }, content);

    return () => {
      console.log('🧹 Cleaning up');
      ctx.revert();
    };

  }, [isLoading]);

  return (
    <div className="relative w-full min-h-screen background-gradient-dark flex items-center justify-center overflow-hidden">
      <div ref={svgRef} className="absolute opacity-0 topographic-map">
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
          dangerouslySetInnerHTML={{ __html: t('mainPage.highlight.description') }} 
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