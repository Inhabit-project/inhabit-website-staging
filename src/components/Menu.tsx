import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LanguageButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: var(--color-light);
  font-size: 0.875rem;
  text-transform: uppercase;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
  }
`;

const LanguageDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  right: 0;
  background-color: var(--color-secondary);
  min-width: 100px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18.9px);
`;

const Menu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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

  return (
    <header className={`fixed top-0 left-0 right-0 h-[5rem] bg-menu-backdrop backdrop-blur-lg z-50 transition-transform duration-300 no-snap ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="INHABIT Home">
              <img src="/assets/logo.svg" alt="INHABIT" className="h-[1.75rem]" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Main navigation" className="font-size-xs hidden lg:flex gap-8">
            {menuLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-text hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-current={window.location.pathname === item.path ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right side buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex gap-2">
              <LanguageButton
                onClick={() => changeLanguage('en')}
                className={i18n.language === 'en' ? 'active' : ''}
              >
                EN
              </LanguageButton>
              <LanguageButton
                onClick={() => changeLanguage('es')}
                className={i18n.language === 'es' ? 'active' : ''}
              >
                ES
              </LanguageButton>
            </div>
            <a href="https://docsend.com/view/z34fcq8w3f8hgz7h" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center h-[3.375rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-accent)] px-2 rounded-button backdrop-blur-[6px] transition-all duration-200 group">
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
          <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg className="w-8 h-8 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg className="w-6 h-6 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav role="navigation" aria-label="Mobile navigation" className="flex flex-col items-center gap-6 mt-12">
              {menuLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-text text-xl text-light hover:opacity-80"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-4 mt-4">
              <LanguageButton
                onClick={() => changeLanguage('en')}
                className={i18n.language === 'en' ? 'active' : ''}
              >
                EN
              </LanguageButton>
              <LanguageButton
                onClick={() => changeLanguage('es')}
                className={i18n.language === 'es' ? 'active' : ''}
              >
                ES
              </LanguageButton>
            </div>
            <a href="https://docsend.com/view/z34fcq8w3f8hgz7h" target="_blank" rel="noopener noreferrer">
              <button className="flex items-center h-[3.375rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-accent)] px-4 rounded-button backdrop-blur-[6px] transition-all duration-200 group mt-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 transition-colors duration-200 group-hover:[&>path]:stroke-[var(--color-light)]" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" style={{stroke: 'var(--color-secondary)'}}>
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