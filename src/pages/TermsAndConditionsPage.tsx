import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import Footer from '../components/Footer';

const TermsAndConditionsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <section className="w-full flex flex-col items-center justify-center py-32 background-gradient-light">
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h1 className="heading-2 text-secondary max-w-[40.9375rem]">
            <span dangerouslySetInnerHTML={{ __html: t('termsAndConditionsPage.title') }} />
            <br />
            <strong>
              <span dangerouslySetInnerHTML={{ __html: t('termsAndConditionsPage.strong') }} />
            </strong>
          </h1>
          <p className="body-M text-secondary max-w-[36rem]">
            {t('termsAndConditionsPage.subtitle')}
          </p>
        </div>
      </section>
      <div className="container mx-auto py-16 px-4 max-w-3xl">
        <div className="w-full overflow-x-auto max-w-full">
          <ol className="list-decimal pl-4 space-y-8 terms-section-number">
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.1.title')}</h5>
              <p className="body-M text-secondary">{t('termsAndConditionsPage.sections.1.text')}</p>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.2.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.2.text')}</p>
              <ul className="list-disc pl-6 space-y-1 body-S text-secondary">
                <li>{t('termsAndConditionsPage.sections.2.list.1')}</li>
                <li>{t('termsAndConditionsPage.sections.2.list.2')}</li>
                <li>{t('termsAndConditionsPage.sections.2.list.3')}</li>
                <li>{t('termsAndConditionsPage.sections.2.list.4')}</li>
                <li>{t('termsAndConditionsPage.sections.2.list.5')}</li>
              </ul>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.3.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.3.text')}</p>
              <ul className="list-disc pl-6 space-y-1 body-S text-secondary">
                <li>{t('termsAndConditionsPage.sections.3.list.1')}</li>
                <li>{t('termsAndConditionsPage.sections.3.list.2')}</li>
                <li>{t('termsAndConditionsPage.sections.3.list.3')}</li>
              </ul>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.4.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.4.text')}</p>
              <ul className="list-disc pl-6 space-y-1 body-S text-secondary">
                <li>{t('termsAndConditionsPage.sections.4.list.1')}</li>
                <li>{t('termsAndConditionsPage.sections.4.list.2')}</li>
                <li>{t('termsAndConditionsPage.sections.4.list.3')}</li>
              </ul>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.5.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.5.text')}</p>
              <ul className="list-disc pl-6 space-y-1 body-S text-secondary">
                <li>{t('termsAndConditionsPage.sections.5.list.1')}</li>
                <li>{t('termsAndConditionsPage.sections.5.list.2')}</li>
                <li>{t('termsAndConditionsPage.sections.5.list.3')}</li>
              </ul>
              <p className="body-S text-secondary mt-2">{t('termsAndConditionsPage.sections.5.note')}</p>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.6.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.6.text')}</p>
              <ul className="list-disc pl-6 space-y-1 body-S text-secondary">
                <li>{t('termsAndConditionsPage.sections.6.list.1')}</li>
                <li>{t('termsAndConditionsPage.sections.6.list.2')}</li>
              </ul>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.7.title')}</h5>
              <p className="body-M text-secondary">{t('termsAndConditionsPage.sections.7.text')}</p>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.8.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.8.text')}</p>
              <ul className="list-disc pl-6 space-y-1 body-S text-secondary">
                <li>{t('termsAndConditionsPage.sections.8.list.1')}</li>
                <li>{t('termsAndConditionsPage.sections.8.list.2')}</li>
                <li>{t('termsAndConditionsPage.sections.8.list.3')}</li>
              </ul>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.9.title')}</h5>
              <p className="body-M text-secondary">{t('termsAndConditionsPage.sections.9.text')}</p>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.10.title')}</h5>
              <p className="body-M text-secondary">{t('termsAndConditionsPage.sections.10.text')}</p>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.11.title')}</h5>
              <p className="body-M text-secondary">{t('termsAndConditionsPage.sections.11.text')}</p>
            </li>
            <li>
              <h5 className="mb-2 text-secondary">{t('termsAndConditionsPage.sections.12.title')}</h5>
              <p className="body-M text-secondary mb-2">{t('termsAndConditionsPage.sections.12.text')}</p>
            </li>
          </ol>
        </div>
        <p className="body-M text-secondary mt-8">{t('termsAndConditionsPage.footer')}</p>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage; 