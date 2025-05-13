import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "What exactly is a Stewardship NFT?",
      answer: "A Stewardship NFT represents your commitment to supporting biodiversity conservation. It's a unique digital asset that directly connects you to specific conservation initiatives within our global biodiversity corridor."
    },
    {
      question: "How does my NFT purchase help conservation?",
      answer: "Your NFT purchase directly funds on-the-ground conservation efforts. The proceeds go towards protecting and restoring critical habitats, supporting local communities, and maintaining the biodiversity corridor infrastructure."
    },
    {
      question: "What benefits do I receive as an NFT holder?",
      answer: "As an NFT holder, you gain exclusive access to conservation impact reports, virtual and physical visits to conservation sites, community events, and voting rights on certain conservation decisions. You're also part of a growing community of conservation stewards."
    },
    {
      question: "Can I transfer or sell my Stewardship NFT?",
      answer: "Yes, Stewardship NFTs are transferable. You can sell or gift your NFT to others who share your commitment to conservation, though we encourage long-term stewardship for maximum impact."
    },
    {
      question: "What makes this different from other NFT projects?",
      answer: "Our NFTs have real-world impact, directly supporting biodiversity conservation. They're backed by scientific research, community engagement, and tangible conservation outcomes, not just digital art or speculation."
    }
  ];

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
              Frequently Asked<br />
              <strong>Questions</strong>
            </h2>
            <p className="body-M text-light max-w-[36rem]">
              Find answers to common questions about our ecosystem protection and stewardship programs.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="w-full max-w-[50rem] ml-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-[#F6FFEA]/20 last:border-b-0">
                <div 
                  className="flex items-center justify-between py-6 cursor-pointer group"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-white body-M">
                    {item.question}
                  </h3>
                  <button 
                    className={`w-8 h-8 rounded-full bg-white/30 backdrop-blur-[7.5px] border border-[#EFEFEF]/50 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/40 ${openIndex === index ? 'rotate-45' : ''}`}
                  >
                    <img 
                      src="/assets/faq-plus-icon.svg" 
                      alt={openIndex === index ? "Close" : "Open"} 
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-white/80 font-nunito text-base leading-[1.5]">
                    {item.answer}
                  </p>
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