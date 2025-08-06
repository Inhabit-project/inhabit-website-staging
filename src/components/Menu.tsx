import React, { useState, useLayoutEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { LoadingContext } from '../App';
import { useMenuScrollHide } from '../utils/scrollManager';
import { gsap } from '../utils/gsap';

interface MenuProps {
  hideMenu?: boolean;
}

const Menu: React.FC<MenuProps> = ({ hideMenu = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { t, i18n } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const location = useLocation();

  // Refs for mobile menu animation
  const mobileMenuLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileLangBtnRef = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileDownloadBtnRef = useRef<HTMLButtonElement | null>(null);

  useMenuScrollHide(setIsVisible, { getDisable: () => mobileOpen });

  useLayoutEffect(() => {
    if (mobileOpen) {
      const menuItems = [
        ...mobileMenuLinksRef.current,
        ...mobileLangBtnRef.current,
      ].filter(Boolean);
      const downloadBtn = mobileDownloadBtnRef.current;
      const ctx = gsap.context(() => {
        if (menuItems.length > 0) {
          gsap.set(menuItems, { opacity: 0, y: 40, scale: 0.92, rotateZ: -3 });
          gsap.to(menuItems, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateZ: 0,
            duration: 0.85,
            ease: 'back.out(1.7)',
            stagger: {
              each: 0.11,
              from: 'start',
            },
          });
        }
        if (downloadBtn) {
          gsap.set(downloadBtn, { opacity: 0, scale: 0.85 });
          gsap.to(downloadBtn, {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            delay: 0.11 * menuItems.length,
            ease: 'elastic.out(1, 0.6)',
          });
        }
      });
      return () => ctx.revert();
    }
  }, [mobileOpen]);

  const menuClassName = `fixed top-0 left-0 right-0 h-[5rem] bg-menu-backdrop backdrop-blur-lg z-50 transition-transform duration-300 no-snap ${
    isVisible ? 'translate-y-0' : '-translate-y-full'
  }`;

  const menuLinks = [
    { label: t('navigation.home'), path: '/' },
    { label: t('navigation.hubs'), path: '/hubs' },
    { label: t('navigation.stewardshipNFT'), path: '/stewardship-nft' },
    { label: t('navigation.aboutUs'), path: '/about' },
    { label: t('navigation.projects'), path: '/projects' },
    { label: t('navigation.blog'), path: '/blog' },
    { label: t('navigation.contact'), path: '/contact' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.language-dropdown')) {
      setLanguageDropdownOpen(false);
    }
  };

  // Add click outside listener
  React.useEffect(() => {
    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [languageDropdownOpen]);

  if (hideMenu || isLoading) {
    return null;
  }

  return (
    <header className={menuClassName}>
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] h-full">
        <div className="flex items-center justify-between h-full min-w-0">
          {/* Logo - always left aligned */}
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" aria-label="INHABIT Home" className="flex items-center min-w-0">
              <img src="/assets/logo.svg" alt="INHABIT" className="h-[1.75rem] w-auto block" width="261" height="57" style={{minWidth:0, maxWidth:'100%'}} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Main navigation" className="font-size-xs hidden xl:flex gap-8">
            {menuLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-text hover:text-primary focus:outline-none ${
                  window.location.pathname === item.path ? 'text-accent' : ''
                }`}
                aria-current={window.location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

                    {/* Desktop Right side buttons */}
          <div className="hidden xl:flex items-center gap-4">
            <div className="language-dropdown">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="language-btn flex items-center gap-2"
                aria-label="Select language"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H8M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M8 12H16M8 12C8 16.9706 9.79086 21 12 21M8 12C8 7.02944 9.79086 3 12 3M16 12H21M16 12C16 7.02944 14.2091 3 12 3M16 12C16 16.9706 14.2091 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{i18n.language.toUpperCase()}</span>
              </button>
              {languageDropdownOpen && (
                <div className="dropdown-content open">
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`language-btn w-full text-left ${i18n.language === 'en' ? 'active' : ''}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('es');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`language-btn w-full text-left ${i18n.language === 'es' ? 'active' : ''}`}
                  >
                    ES
                  </button>
                </div>
              )}
            </div>
            <a href="https://docsend.com/view/z34fcq8w3f8hgz7h" target="_blank" rel="noopener noreferrer">
              <button className="btn-secondary transition-all duration-200 group">
                <div className="flex items-center gap-2 px-4">
                  <svg className="w-6 h-6 transition-colors duration-200 group-hover:[&>path]:stroke-[var(--color-light)]" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" style={{stroke: 'var(--color-secondary)'}}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="button-text text-secondary group-hover:text-light transition-colors duration-200">{t('menu.downloadWhitePaper')}</span>
                </div>
              </button>
            </a>
          </div>

          {/* Hamburger for mobile */}
          <button className="xl:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg className="w-8 h-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Popup Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60">
          {/* Modal content */}
          <div className="relative bg-secondary w-[100vw] h-[100vh] flex flex-col items-center gap-8 animate-fadeIn p-8 overflow-y-auto pt-16">
            {/* Logo at the top left */}
            <div className="absolute top-4 left-4 flex items-center">
              <Link to="/" aria-label="INHABIT Home" onClick={() => setMobileOpen(false)}>
                <img src="/assets/logo.svg" alt="INHABIT" className="h-[1.75rem]" width="261" height="57" />
              </Link>
            </div>
            {/* Close button at the top right */}
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg className="w-6 h-6 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav role="navigation" aria-label="Mobile navigation" className="flex flex-col items-center gap-6 mt-12">
              {menuLinks.map((item, idx) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-text text-xl hover:opacity-80 ${location.pathname === item.path ? 'text-primary' : 'text-light'}`}
                  onClick={() => setMobileOpen(false)}
                  ref={el => (mobileMenuLinksRef.current[idx] = el)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  changeLanguage('en');
                  setMobileOpen(false);
                }}
                className={`language-btn flex items-center gap-2 ${i18n.language === 'en' ? 'active' : ''}`}
                ref={el => (mobileLangBtnRef.current[0] = el)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H8M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M8 12H16M8 12C8 16.9706 9.79086 21 12 21M8 12C8 7.02944 9.79086 3 12 3M16 12H21M16 12C16 7.02944 14.2091 3 12 3M16 12C16 16.9706 14.2091 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>EN</span>
              </button>
              <button
                onClick={() => {
                  changeLanguage('es');
                  setMobileOpen(false);
                }}
                className={`language-btn flex items-center gap-2 ${i18n.language === 'es' ? 'active' : ''}`}
                ref={el => (mobileLangBtnRef.current[1] = el)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H8M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M8 12H16M8 12C8 16.9706 9.79086 21 12 21M8 12C8 7.02944 9.79086 3 12 3M16 12H21M16 12C16 7.02944 14.2091 3 12 3M16 12C16 16.9706 14.2091 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>ES</span>
              </button>
            </div>
            <a href="https://docsend.com/view/z34fcq8w3f8hgz7h" target="_blank" rel="noopener noreferrer">
              <button
                className="btn-secondary transition-all duration-200 group mt-4"
                style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
                ref={mobileDownloadBtnRef}
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 transition-colors duration-200 group-hover:[&>path]:stroke-[var(--color-secondary)]" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" style={{stroke: 'var(--color-secondary)'}}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="button-text text-secondary group-hover:text-light transition-colors duration-200">{t('menu.downloadWhitePaper')}</span>
                </div>
              </button>
            </a>
          </div>
          {/* Click outside to close */}
          <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Menu; 