import React from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';

const ImpactLegalInnovationCardsSection: React.FC = () => {
  const { t } = useTranslation();
  const impactCards = [
    {
      number: '01',
      icon: '/assets/icons/Icon-1.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.0.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.0.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.0.description'),
    },
    {
      number: '02',
      icon: '/assets/icons/Icon-2.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.1.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.1.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.1.description'),
    },
    {
      number: '03',
      icon: '/assets/icons/Icon-3.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.2.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.2.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.2.description'),
    },
    {
      number: '04',
      icon: '/assets/icons/Icon-4.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.3.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.3.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.3.description'),
    },
  ];
  return (
    <section className="w-full flex flex-col items-center background-gradient-light py-24 px-[clamp(1.5rem,5vw,6.25rem)] scroll-container">
      <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full max-w-[120rem] mx-auto mb-[2.5rem]">
        <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
          <span dangerouslySetInnerHTML={{ __html: t('mainPage.impactLegalInnovationCardsSection.title') }} />
        </h2>
        <p className="body-M text-secondary max-w-[35rem]">
          {t('mainPage.impactLegalInnovationCardsSection.description')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {impactCards.map((card, idx) => (
          <ImpactCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
};

export default ImpactLegalInnovationCardsSection; 