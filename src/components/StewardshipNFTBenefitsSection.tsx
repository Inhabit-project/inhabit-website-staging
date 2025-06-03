import React from 'react';
import { useTranslation } from 'react-i18next';

const StewardshipNFTBenefitsSection: React.FC = () => {
  const { t } = useTranslation();
  const benefits = [
    {
      icon: '/assets/icons/6.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.0.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.0.title'),
      description: t('mainPage.stewardshipNFTBenefits.0.description'),
    },
    {
      icon: '/assets/icons/2.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.1.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.1.title'),
      description: t('mainPage.stewardshipNFTBenefits.1.description'),
    },
    {
      icon: '/assets/icons/4.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.2.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.2.title'),
      description: t('mainPage.stewardshipNFTBenefits.2.description'),
    },
    {
      icon: '/assets/icons/3.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.3.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.3.title'),
      description: t('mainPage.stewardshipNFTBenefits.3.description'),
    },
    {
      icon: '/assets/icons/5.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.4.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.4.title'),
      description: t('mainPage.stewardshipNFTBenefits.4.description'),
    },
    {
      icon: '/assets/icons/1.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.5.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.5.title'),
      description: t('mainPage.stewardshipNFTBenefits.5.description'),
    },
  ];
  return (
    <section
      className="w-full py-24 px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-center  scroll-container background-gradient-light"
      style={{ background: 'var(--background-gradient-light)' }}
    >
      <div className="max-w-[120rem] w-full mx-auto flex flex-col md:flex-row justify-between gap-8 mb-16">
        <div>
          <h2 className="heading-2 text-secondary max-w-[40.9375rem] mb-4">
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFTBenefits.title') }} />
          </h2>
        </div>
        <p className="font-nunito text-[1.75rem] font-light text-[var(--color-secondary)] max-w-[38rem]">
          {t('mainPage.stewardshipNFTBenefits.description')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14 w-full max-w-[120rem] mx-auto">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="relative flex flex-col gap-6 min-h-[380px] shadow-lg text-white justify-between"
            style={{
              background: 'var(--color-primary-dark, #162F08)',
              borderRadius: 'var(--radius-2xl, 1.5rem)',
              padding: '2.5rem',
            }}
          >
            <div className="absolute top-10 right-10 w-12 h-12 opacity-80">
              <img src={b.icon} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="eyebrow" >{b.eyebrow}</span>
            <h5 className="heading-5 mb-2">
              <span dangerouslySetInnerHTML={{ __html: b.title }} />
            </h5>
            <p className="font-nunito text-base font-light whitespace-pre-line opacity-90 mt-auto">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StewardshipNFTBenefitsSection; 