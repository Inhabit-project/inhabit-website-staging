import React from 'react';
import { motion } from 'framer-motion';

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
  const testimonials: Testimonial[] = [
    {
      image: "/assets/testimonials/testimonial-1.jpg",
      role: "ceo lorem ipsum",
      name: "Pepita Perez",
      quote: "Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These \"living seed hubs\" hosts an \"inner corridor\" within the land, connecting fragmented landscapes and serving as a refuge for endangered species."
    },
    {
      image: "/assets/testimonials/testimonial-1.jpg",
      role: "ceo lorem ipsum",
      name: "Pepita Perez",
      quote: "Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These \"living seed hubs\" hosts an \"inner corridor\" within the land, connecting fragmented landscapes and serving as a refuge for endangered species."
    },
    {
      image: "/assets/testimonials/testimonial-1.jpg",
      role: "ceo lorem ipsum",
      name: "Pepita Perez",
      quote: "Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These \"living seed hubs\" hosts an \"inner corridor\" within the land, connecting fragmented landscapes and serving as a refuge for endangered species."
    }
  ];

  const partners: Partner[] = [
    { logo: "/assets/testimonials/logo-1.jpg", name: "Partner 1" },
    { logo: "/assets/testimonials/logo-1.jpg", name: "Partner 2" },
    { logo: "/assets/testimonials/logo-1.jpg", name: "Partner 3" },
    { logo: "/assets/testimonials/logo-1.jpg", name: "Partner 4" },
    { logo: "/assets/testimonials/logo-1.jpg", name: "Partner 5" }
  ];

  return (
    <section className="bg-secondary py-[6.4375rem] overflow-x-hidden ">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)]">
        <div className="flex flex-col items-start ">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full mb-[2.5rem]">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
              Meet our<br /><strong>Allies</strong>
            </h2>
            <p className="body-M text-light max-w-[35rem]">
              Stewardship NFTs are blockchain-verified contracts that give fractional rights to protect ecosystems on tokenized plots of land.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="flex flex-col w-full">
            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-[6rem]">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-[#0F2717] rounded-[20px] overflow-hidden"
                >
                  <div className="flex flex-col h-full">
                    <div className="p-8 flex flex-col gap-6">
                      <div className="w-[120px] h-[120px] rounded-[20px] overflow-hidden self-end">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <span className="text-white/80 font-ibm-mono-plex-mono text-sm uppercase">
                          {testimonial.role}
                        </span>
                        <h3 className="text-white font-montserrat text-[2.5rem] leading-[1.2]">
                          {testimonial.name}
                        </h3>
                        <p className="text-white/80 font-nunito text-base leading-[1.5]">
                          {testimonial.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Logos Slider */}
            <div className="relative w-full overflow-hidden">
              <motion.div
                className="flex gap-8"
                animate={{
                  x: [0, -1000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of logos */}
                {partners.map((partner, index) => (
                  <div 
                    key={`first-${index}`}
                    className="bg-white/57 backdrop-blur-[15.48px] rounded-[8.7px] p-[20.87px] shadow-[0px_0px_47.83px_rgba(0,0,0,0.1)] flex-shrink-0"
                  >
                    <div className="w-[276.52px] h-[104.35px] rounded-[12.17px] overflow-hidden">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {partners.map((partner, index) => (
                  <div 
                    key={`second-${index}`}
                    className="bg-white/57 backdrop-blur-[15.48px] rounded-[8.7px] p-[20.87px] shadow-[0px_0px_47.83px_rgba(0,0,0,0.1)] flex-shrink-0"
                  >
                    <div className="w-[276.52px] h-[104.35px] rounded-[12.17px] overflow-hidden">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 