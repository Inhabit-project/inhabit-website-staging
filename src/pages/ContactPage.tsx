import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '../components/Menu';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <section className="w-full flex flex-col items-center justify-center py-32">
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-start gap-8">
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: t('contactPage.title') }} />
            </h2>
            <p className="body-M text-secondary max-w-[36rem]">
              {t('contactPage.description')}
            </p>
          </div>
        </div>
      </section>
      {/* You can add a contact form or more info here */}
      <Footer />
    </div>
  );
};

export default ContactPage; 