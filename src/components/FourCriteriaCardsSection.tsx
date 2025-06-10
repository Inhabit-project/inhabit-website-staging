import React from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';

const ICONS = [
  '/assets/icons/Icon-1.svg',
  '/assets/icons/Icon-2.svg',
  '/assets/icons/Icon-3.svg',
  '/assets/icons/Icon-4.svg',
];

const FourCriteriaCardsSection: React.FC = () => {
  const { t } = useTranslation();
  // Get cards array from translations
  const criteriaCards = t('mainPage.criteriaCardsSection2.cards', { returnObjects: true }) as Array<{
    number: string;
    title: string;
    subtitle: string;
    description: string;
  }>;

  return (
    <section
      className="w-full flex flex-col items-center py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--light-gradient, linear-gradient(90deg, #DEEDCB 2.26%, #F6FFEA 50.64%, #DEEDCB 99.01%))' }}
    >
      <div className="w-full max-w-[120rem] mx-auto mb-12 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <h2 className="heading-2 text-secondary mb-4" >
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.criteriaCardsSection.title') }} />
          </h2>
        </div>
        <div className="max-w-xl text-secondary body-M" style={{fontWeight: 400}}>
          {t('mainPage.criteriaCardsSection.description')}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {criteriaCards.map((card, idx) => (
          <ImpactCard key={idx} {...card} icon={ICONS[idx]} />
        ))}
      </div>
    </section>
  );
};

export default FourCriteriaCardsSection; 