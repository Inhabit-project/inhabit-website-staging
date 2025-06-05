import React from 'react';
import LogosSection from './LogosSection';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  image: string;
  role: string;
  name: string;
  quote: string;
}

interface Partner {
  logo: string;
  name: string;
}

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const testimonials: Testimonial[] = [
    {
      image: "/assets/logos/testimonial-image.png",
      role: "CEO ECONETWORK",
      name: "ANNIE VASQUEZ",
      quote: "\" Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. \""
    },
    {
      image: "/assets/logos/testimonial-image.png",
      role: "CEO ECONETWORK",
      name: "ANNIE VASQUEZ",
      quote: "\" Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. \""
    },
    {
      image: "/assets/logos/testimonial-image.png",
      role: "CEO ECONETWORK",
      name: "ANNIE VASQUEZ",
      quote: "\" Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. \""
    }
  ];

  const partners: Partner[] = [
    { logo: '/assets/logos/partner-logo-1.png', name: 'Partner 1' },
    { logo: '/assets/logos/partner-logo-2.png', name: 'Partner 2' },
    { logo: '/assets/logos/partner-logo-3.svg', name: 'Partner 3' },
    { logo: '/assets/logos/partner-logo-4.png', name: 'Partner 4' },
    { logo: '/assets/logos/partner-logo-5.png', name: 'Partner 5' }
  ];

  return (
    <>
      <section className="background-gradient-dark py-8 md:py-16 lg:py-[6.5rem] px-4 md:px-8 lg:px-[6.25rem] overflow-x-hidden flex flex-col gap-8 md:gap-16 lg:gap-[3.75rem]  scroll-container">
        <div className="w-full">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between w-full gap-6 md:gap-8">
            <h2 className=" font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]">
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.testimonials.title') }} />
            </h2>
            <p className="font-nunito font-light text-xl md:text-2xl lg:text-[1.75rem] leading-[1.24em] text-[#F6FFEA] max-w-full md:max-w-[35rem]">
              {t('mainPage.testimonials.description')}
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-[#162F08] border border-white/20 rounded-[1.7rem] shadow-[inset_0px_0px_2.7px_rgba(61,27,114,1)] backdrop-blur-6xl p-6 md:p-8 lg:p-[3.4rem] w-full">
          <div className="flex flex-col md:flex-row gap-6 md:gap-[3.4rem] w-full">
            <div className="w-full md:w-[33%] h-60 md:h-auto rounded-[1.3rem] overflow-hidden">
              <img 
                src="/assets/louise.webp" 
                alt="Testimonial" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 md:gap-[2rem] flex-1">
              <h3 className="font-abel text-white text-base tracking-[0.07em] uppercase">
              Louise Borreani
              </h3>
              <p className="font-nunito text-white text-xl md:text-3xl lg:text-[2.5rem] leading-[1.1em]">
                {t('mainPage.testimonials.testimonial.quote')}
              </p>
              <span className="font-nunito text-white text-base body-M leading-[1.36em] tracking-[-0.015em]">
              Co-founder, Ecofrontiers
              </span>
            </div>
          </div>
        </div>
      </section>
      <LogosSection showAllies />
    </>
  );
};

export default Testimonials; 