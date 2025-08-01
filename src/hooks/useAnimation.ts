import { useRef, useEffect, useState, useContext } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import { animationDebugger, createDebugScrollTrigger } from '../utils/animationDebugger';

interface AnimationConfig {
  componentName: string;
  trigger: string;
  start?: string;
  end?: string;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: any) => void;
}

interface UseAnimationOptions {
  enabled?: boolean;
  delay?: number;
  dependencies?: any[];
  debug?: boolean;
}

export function useAnimation(
  config: AnimationConfig,
  options: UseAnimationOptions = {}
) {
  const {
    enabled = true,
    delay = 1500,
    dependencies = [],
    debug = false
  } = options;

  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Handle loading state with consistent timing
  useEffect(() => {
    if (!isLoading && enabled) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
        if (debug) {
          console.log(`🎬 ${config.componentName}: Animation enabled`);
        }
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading, enabled, delay, debug]);

  // Cleanup function
  const cleanup = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
  };

  // Create animation timeline
  const createTimeline = (elements: any[], animations: any[]) => {
    if (!canAnimate || !sectionRef.current) return;

    cleanup();

    // Set initial states
    elements.forEach(element => {
      if (element.current) {
        gsap.set(element.current, {
          opacity: 0,
          y: 50,
          scale: 0.95
        });
      }
    });

    // Create timeline
    timelineRef.current = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    // Add animations to timeline
    animations.forEach(animation => {
      timelineRef.current?.add(animation);
    });

    // Create scroll trigger with debugging
    scrollTriggerRef.current = createDebugScrollTrigger({
      trigger: sectionRef.current,
      start: config.start || "top 80%",
      end: config.end || "bottom 20%",
      toggleActions: config.toggleActions || "play none none reverse",
      animation: timelineRef.current,
      onEnter: config.onEnter,
      onLeave: config.onLeave,
      onEnterBack: config.onEnterBack,
      onLeaveBack: config.onLeaveBack,
      onUpdate: config.onUpdate
    }, config.componentName);

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    if (debug) {
      console.log(`🎬 ${config.componentName}: Timeline created`);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  // Recreate animations when dependencies change
  useEffect(() => {
    if (canAnimate && dependencies.every(dep => dep !== undefined)) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // This will be called by components with their specific elements and animations
      }, 100);
    }
  }, [canAnimate, ...dependencies]);

  return {
    sectionRef,
    canAnimate,
    createTimeline,
    cleanup,
    isLoading
  };
}

// Specialized hooks for common patterns
export function useFadeInAnimation(componentName: string, options: UseAnimationOptions = {}) {
  const { sectionRef, canAnimate, createTimeline, cleanup } = useAnimation({
    componentName,
    trigger: 'fade-in',
    start: 'top 80%',
    end: 'bottom 20%'
  }, options);

  const createFadeInTimeline = (elements: any[]) => {
    if (!canAnimate) return;

    const animations = elements.map((element, index) => 
      gsap.to(element.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
      })
    );

    createTimeline(elements, animations);
  };

  return {
    sectionRef,
    canAnimate,
    createFadeInTimeline,
    cleanup
  };
}

export function useStaggerAnimation(componentName: string, options: UseAnimationOptions = {}) {
  const { sectionRef, canAnimate, createTimeline, cleanup } = useAnimation({
    componentName,
    trigger: 'stagger',
    start: 'top 75%',
    end: 'bottom 25%'
  }, options);

  const createStaggerTimeline = (elements: any[], staggerDelay: number = 0.1) => {
    if (!canAnimate) return;

    const animations = [
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          each: staggerDelay,
          from: "start"
        },
        ease: 'power3.out'
      })
    ];

    createTimeline(elements, animations);
  };

  return {
    sectionRef,
    canAnimate,
    createStaggerTimeline,
    cleanup
  };
} 