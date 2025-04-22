import React from 'react';
import Gallery from './Gallery';

const Hubs: React.FC = () => {
  const galleryImages = [
    { src: '/assets/img-gallery-1.jpg' },
    { src: '/assets/img-gallery-1.jpg' },
    { src: '/assets/img-gallery-1.jpg' },
    { src: '/assets/img-gallery-1.jpg' },
    { src: '/assets/img-gallery-1.jpg' }
  ];

  return (
    <section className="relative bg-light w-full flex flex-col items-center">
      {/* Content */}
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              Bio-cultural<br /><strong>Hubs</strong>
            </h2>
            <p className="body-M text-secondary max-w-[35rem]">
              Located across bioregions, HUBS are important biodiversity hotspots and learning centres that preserve and share ecological resources and living knowledge to shape the corridor.
            </p>
          </div>

          {/* Main terrain image */}
          <div className="relative w-full min-h-[50rem]">
            {/* 3D terrain image */}
            <div className="absolute w-full left-1/2 -translate-x-1/2">
              <img 
                src="/assets/mapa.png" 
                alt="Global biodiversity corridor map" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Location markers */}
            <div className="absolute top-4 left-[32.8125rem] flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
              <p className="text-secondary text-xs">19° 25′ 42″ N; 99° 7′ 39″ O</p>
            </div>
            <div className="absolute top-[26rem] right-[32.8125rem] flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
              <p className="text-secondary text-xs">19° 25′ 42″ N; 99° 7′ 39″ O</p>
            </div>
            <div className="absolute bottom-4 left-[32.8125rem] flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
              <p className="text-secondary text-xs">19° 25′ 42″ N; 99° 7′ 39″ O</p>
            </div>

            {/* Featured image card */}
            <div className="absolute top-100 right-[10%] w-[30rem] h-[40rem] rounded-xl overflow-hidden">
              <div className="relative h-full">
                {/* Background image */}
                <img 
                  src="/assets/hubs-1.jpg" 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content overlay */}
                <div className="relative h-full flex flex-col p-6">
                  {/* Navigation button */}
                  <div className="flex justify-end -mt-4">
                    <button className="w-16 h-16 rounded-4xl bg-white/30 backdrop-blur-[50px] border border-[#EFEFEF]/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/40">
                      <img 
                        src="/assets/figma-images/hub-card-arrow.svg" 
                        alt="Next" 
                        className="w-6 h-6"
                      />
                    </button>
                  </div>

                  {/* Spacer */}
                  <div className="flex-grow min-h-[200px]"></div>

                  {/* Text content */}
                  <div className="bg-white/10 backdrop-blur-[50px] rounded-2xl p-4 border border-white/5">
                    <p className="text-white text-sm uppercase tracking-[-0.015em] mb-4 eyebrow ">SOIL RESTORATION & BIOCLIMATIC ARCHITECTURE:</p>
                    <h3 className="text-white text-[1.6rem] font-montserrat font-regular leading-[1.2] mb-4">
                      Ñuiyanzhi Biocultural HUB Sierra Nevada de Santa Marta
                    </h3>
                    <p className="text-white text-sm tracking-[-0.015em] font-nunito">
                      Action Research Between Traditional and Academic Knowledge By Amelia Carrillo Pardo and Juan Duque
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="w-full overflow-visible">
            <Gallery images={galleryImages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hubs; 