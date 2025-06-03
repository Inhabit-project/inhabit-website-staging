import React from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';

const CriteriaCardsSection2: React.FC = () => {
  const { t } = useTranslation();
  const criteriaCards = [
    {
      number: '01',
      icon: '/assets/icons/Icon-1.svg',
      title: t('mainPage.criteriaCardsSection2.cards.0.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.0.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.0.description'),
    },
    {
      number: '02',
      icon: '/assets/icons/Icon-2.svg',
      title: t('mainPage.criteriaCardsSection2.cards.1.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.1.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.1.description'),
    },
    {
      number: '03',
      icon: '/assets/icons/Icon-3.svg',
      title: t('mainPage.criteriaCardsSection2.cards.2.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.2.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.2.description'),
    },
    {
      number: '04',
      icon: '/assets/icons/Icon-4.svg',
      title: t('mainPage.criteriaCardsSection2.cards.3.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.3.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.3.description'),
    },
  ];

  return (
    <section
      className="w-full flex flex-col items-center py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--light-gradient, linear-gradient(90deg, #DEEDCB 2.26%, #F6FFEA 50.64%, #DEEDCB 99.01%))' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {criteriaCards.map((card, idx) => (
          <ImpactCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
};

export default CriteriaCardsSection2; 