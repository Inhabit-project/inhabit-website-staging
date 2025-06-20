import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqItems?: FAQItem[];
  title?: string;
  description?: string;
}

const FAQ: React.FC<FAQProps> = ({ faqItems, title, description }) => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const defaultFaqItems: FAQItem[] = (t('mainPage.faq.items', { returnObjects: true }) as FAQItem[]);
  const items = faqItems || defaultFaqItems;
  const headerTitle = title || t('mainPage.faq.title');
  const headerDescription = description || t('mainPage.faq.description');

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full min-h-screen  background-gradient-dark">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: headerTitle }} />
            </h2>
            <p className="body-M text-light max-w-[35rem]">
              {headerDescription}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="w-full max-w-[50rem] ml-auto">
            {items.map((item, index) => (
              <div key={index} className="border-b border-[#F6FFEA]/20 last:border-b-0">
                <div 
                  className="flex items-center justify-between py-6 group gap-4"
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button
                    className={`min-w-8 min-h-8 w-8 h-8 aspect-square rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleAccordion(index)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <img
                      src="/assets/faq-plus-icon.svg"
                      alt={openIndex === index ? "Close" : "Open"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

export const FAQWhite: React.FC<{ faqItems?: { question: string; answer: string }[]; title?: string; description?: string }> = ({ faqItems, title, description }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const defaultFaqItems = [
    {
      question: "What is a Stewardship NFT?",
      answer: "A Stewardship NFT is a digital asset that grants you rights and benefits related to a specific land or project, supporting conservation and restoration efforts.",
    },
    {
      question: "How do I become a guardian?",
      answer: "You can become a guardian by purchasing a Stewardship NFT and participating in the stewardship community.",
    },
    {
      question: "What are the benefits of being a guardian?",
      answer: "Guardians receive exclusive access to restoration tools, immersive experiences, and direct ties to ecological and spiritual knowledge.",
    },
    {
      question: "Can I transfer my NFT?",
      answer: "Yes, Stewardship NFTs are transferable and can be sold or gifted to others.",
    },
  ];
  const items = faqItems || defaultFaqItems;
  return (
    <section className="relative w-full min-h-screen background-gradient-light scroll-container">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              {title || 'Frequently Asked'}<br />
              <strong>{description || 'Questions'}</strong>
            </h2>
          </div>
          {/* FAQ Items */}
          <div className="w-full max-w-[50rem] ml-auto text-secondary ">
            {items.map((item, index) => (
              <div key={index} className="border-b border-[#1B3A2B]/20 last:border-b-0">
                <div 
                  className="flex items-center justify-between py-6 cursor-pointer group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className=" text-secondary body-M">
                    {item.question}
                  </h3>
                  <button 
                    className={`w-8 h-8 rounded-full bg-secondary/10 backdrop-blur-[7.5px] border border-[#1B3A2B]/50 flex items-center justify-center transition-all duration-300 group-hover:border-secondary group-hover:bg-secondary/20 ${openIndex === index ? 'rotate-45' : ''}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3.333v9.334M3.333 8h9.334" stroke="#1B3A2B" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-secondary/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQHubs: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = (t('hubsPage.faq.items', { returnObjects: true }) as FAQItem[]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full min-h-screen  background-gradient-dark">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: t('hubsPage.faq.title') }} />
            </h2>
            <p className="body-M text-light max-w-[35rem]">
              {t('hubsPage.faq.description')}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="w-full max-w-[50rem] ml-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-[#F6FFEA]/20 last:border-b-0">
                <div 
                  className="flex items-center justify-between py-6 group gap-4"
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button
                    className={`min-w-8 min-h-8 w-8 h-8 aspect-square rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleAccordion(index)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <img
                      src="/assets/faq-plus-icon.svg"
                      alt={openIndex === index ? "Close" : "Open"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQStewardshipNFT: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = (t('mainPage.stewardshipNFTPage.faq.items', { returnObjects: true }) as FAQItem[]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full min-h-screen  background-gradient-dark">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col">
        <div className="flex flex-col items-end gap-24">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
              <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFTPage.faq.title') }} />
            </h2>
            <p className="body-M text-light max-w-[35rem]">
              {t('mainPage.stewardshipNFTPage.faq.description')}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="w-full max-w-[50rem] ml-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-[#F6FFEA]/20 last:border-b-0">
                <div 
                  className="flex items-center justify-between py-6 group gap-4"
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button
                    className={`min-w-8 min-h-8 w-8 h-8 aspect-square rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleAccordion(index)}
                    style={{ marginLeft: '1rem' }}
                  >
                    <img
                      src="/assets/faq-plus-icon.svg"
                      alt={openIndex === index ? "Close" : "Open"}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 font-nunito text-base leading-[1.5]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 