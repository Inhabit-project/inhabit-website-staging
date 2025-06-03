import React from 'react';
import { useTranslation } from 'react-i18next';

const Photo: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      {/* Photo 1 */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img 
            src="/assets/photo1.webp" 
            alt="Person in natural environment" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 md:bottom-auto md:top-[clamp(1.5rem,5vw,6.25rem)] right-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-secondary/80 backdrop-blur-xl p-4 md:p-8 rounded-[20px] mx-4 md:mx-0">
            <p className="body-M text-light">
              {t('mainPage.photo.section1')}
            </p>
          </div>
        </div>
      </section>

      {/* Photo 2 */}
      <section className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img 
            src="/assets/photo-2.webp" 
            alt="Natural environment" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 md:bottom-auto md:top-[clamp(1.5rem,5vw,6.25rem)] left-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-secondary/80 backdrop-blur-xl p-4 md:p-8 rounded-[20px] mx-4 md:mx-0">
            <p className="body-M text-light">
              {t('mainPage.photo.section2')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Photo; 