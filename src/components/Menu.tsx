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
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const menuLinks = [
    { label: t('navigation.home'), path: '/' },
    { label: t('navigation.hubs'), path: '/hubs' },
    { label: t('navigation.stewardshipNFT'), path: '/stewardship-nft' },
    { label: t('navigation.aboutUs'), path: '/about' },
    { label: t('navigation.projects'), path: '/projects' },
    { label: t('navigation.blog'), path: '/blog' },
    { label: t('navigation.contacts'), path: '/contacts' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 h-[5.5rem] bg-menu-backdrop backdrop-blur-[18.9px] z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img src="/assets/logo.svg" alt="INHABIT" className="h-[1.75rem]" />
          </div>

          {/* Navigation */}
          <div className="font-ibm-mono font-size-xs hidden lg:flex gap-8">
            {menuLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-text hover:opacity-80"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <LanguageDropdown>
              <LanguageButton
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={isLanguageOpen ? 'active' : ''}
              >
                {i18n.language.toUpperCase()}
              </LanguageButton>
              <DropdownContent isOpen={isLanguageOpen}>
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
              </DropdownContent>
            </LanguageDropdown>

            {/* Download Button */}
            <button className="flex items-center h-[3.375rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-accent)] px-2 rounded-button backdrop-blur-[6px] transition-all duration-200 group">
              <div className="flex items-center gap-2 px-4">
                <svg className="w-6 h-6 transition-colors duration-200 group-hover:[&>path]:stroke-[var(--color-light)]" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" style={{stroke: 'var(--color-secondary)'}}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="button-text text-secondary group-hover:text-light transition-colors duration-200">{t('menu.downloadWhitePaper')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu; 