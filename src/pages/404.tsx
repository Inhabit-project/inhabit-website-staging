import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Helmet } from 'react-helmet-async';

const desktopLeafPositions = [
  { style: { top: '3%', left: '15%', width: '8rem', transform: 'rotate(-8deg)' } }, // top left
  { style: { top: '22%', right: '12%', width: '20rem', transform: 'rotate(140deg)' } }, // top right
  { style: { top: '28%', left: '18%', width: '12rem', transform: 'rotate(4deg)' } }, // mid left
  { style: { top: '30%', right: '10%', width: '7rem', transform: 'rotate(-8deg)' } }, // mid right
  { style: { bottom: '8%', left: '10%', width: '15rem', transform: 'rotate(6deg)' } }, // bottom left
  { style: { bottom: '12%', right: '8%', width: '18rem', transform: 'rotate(-18deg)' } }, // bottom right
];

const mobileLeafPositions = [
  { style: { top: '2%', left: '2%', width: '4.5rem', transform: 'rotate(-8deg)' } }, // top left
  { style: { top: '8%', right: '2%', width: '7rem', transform: 'rotate(140deg)' } }, // top right
  { style: { top: '18%', left: '4%', width: '5rem', transform: 'rotate(4deg)' } }, // mid left
  { style: { top: '20%', right: '4%', width: '4rem', transform: 'rotate(-8deg)' } }, // mid right
  { style: { bottom: '4%', left: '2%', width: '7rem', transform: 'rotate(6deg)' } }, // bottom left
  { style: { bottom: '4%', right: '2%', width: '8rem', transform: 'rotate(-18deg)' } }, // bottom right
];

const leafIcons = [
  '/assets/icons/leaf1.svg',
  '/assets/icons/leaf2.svg',
  '/assets/icons/leaf3.svg',
  '/assets/icons/leaf4.svg',
  '/assets/icons/leaf5.svg',
  '/assets/icons/leaf6.svg',
];

interface FourOhFourPageProps {
  onPageReady?: () => void;
}

const FourOhFourPage: React.FC<FourOhFourPageProps> = ({ onPageReady }) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const leafRefs = useRef<(HTMLImageElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let rect = container.getBoundingClientRect();
    let rectNeedsUpdate = false;
    let rafId: number | null = null;
    const updateRect = () => {
      rect = container.getBoundingClientRect();
      rectNeedsUpdate = false;
      rafId = null;
    };
    const scheduleRectUpdate = () => {
      if (!rectNeedsUpdate) {
        rectNeedsUpdate = true;
        rafId = requestAnimationFrame(updateRect);
      }
    };
    window.addEventListener('resize', scheduleRectUpdate);
    container.addEventListener('mouseenter', scheduleRectUpdate);
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const relX = (x - centerX) / centerX; // -1 to 1
      const relY = (y - centerY) / centerY; // -1 to 1
      leafRefs.current.forEach((leaf, i) => {
        if (!leaf) return;
        // Each leaf moves a different amount for parallax
        const strength = 18 + i * 6; // px
        gsap.to(leaf, {
          x: relX * strength,
          y: relY * strength,
          duration: 0.7,
          ease: 'power3.out',
        });
      });
    };
    const handleMouseLeave = () => {
      leafRefs.current.forEach((leaf) => {
        if (!leaf) return;
        gsap.to(leaf, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
      });
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', scheduleRectUpdate);
      container.removeEventListener('mouseenter', scheduleRectUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  const leafPositions = isMobile ? mobileLeafPositions : desktopLeafPositions;

  return (
    <div ref={containerRef} className="background-gradient-light min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden container">
      <Helmet>
        <title>404 Not Found | INHABIT</title>
        <meta name="description" content="Page not found. This digital habitat is empty, but real-world impact awaits." />
        <meta property="og:title" content="404 Not Found | INHABIT" />
        <meta property="og:description" content="Page not found. This digital habitat is empty, but real-world impact awaits." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Top Left Title */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]" dangerouslySetInnerHTML={{ __html: t('error404.title') }}>
            </h2>
            <p className="body-M text-secondary max-w-[35rem]" dangerouslySetInnerHTML={{ __html: t('error404.description') }}>
            </p>
          </div>

      {/* Leaves */}
      {leafIcons.map((src, i) => (
        <img
          key={src}
          ref={el => (leafRefs.current[i] = el)}
          src={src}
          alt="leaf"
          style={{ position: 'absolute', pointerEvents: 'none', userSelect: 'none', zIndex: 10, ...leafPositions[i].style }}
          draggable="false"
        />
      ))}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center z-20 w-full max-w-3xl px-4 text-center">
        <div className="four-oh-four-number" style={{ color: '#1B3A2B', fontWeight: 700, letterSpacing: '-8px', lineHeight: 1 }}>404</div>
        
        <Link
          to="/"
          className="btn-primary mt-8 inline-flex items-center gap-2 px-8 py-3 button-text"
        >
          <span>{t('error404.button')}</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FourOhFourPage; 