import React from 'react';

const Allies: React.FC = () => {
  return (
    <>
      {/* Cards Section */}
      <section className="relative w-full bg-secondary flex flex-col items-center">
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-40">
          <div className="flex flex-col items-center gap-20">
            {/* Text content */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full">
              <h2 className="heading-2 text-light max-w-[40.9375rem]">
                Meet our<br /><strong>Allies</strong>
              </h2>
              <p className="body-M text-light max-w-[53.4375rem]">
                Stewardship NFTs are blockchain-verified contracts that give fractional rights to protect ecosystems on tokenized plots of land.
              </p>
            </div>

            {/* Allies grid */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Ally card */}
                <div className="bg-white/10 backdrop-blur-[50px] rounded-[20px] border border-white/20 p-8">
                  <div className="flex flex-col gap-6">
                    <div className="w-[100px] h-[100px] rounded-[10px] overflow-hidden">
                      <img 
                        src="/assets/placeholder-ally.jpg" 
                        alt="Pepita Perez" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">CEO LOREM IPSUM</p>
                      <h3 className="text-white text-2xl font-medium mb-4">Pepita Perez</h3>
                      <p className="text-white/80 text-base">Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.</p>
                      <p className="text-white/80 text-base mt-4">These "living seed hubs" hosts an "inner corridor" within the land, connecting fragmented landscapes and serving as a refuge for endangered species.</p>
                    </div>
                  </div>
                </div>
                
                {/* Duplicate cards with same structure */}
                <div className="bg-white/10 backdrop-blur-[50px] rounded-[20px] border border-white/20 p-8">
                  <div className="flex flex-col gap-6">
                    <div className="w-[100px] h-[100px] rounded-[10px] overflow-hidden">
                      <img 
                        src="/assets/placeholder-ally.jpg" 
                        alt="Pepita Perez" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">CEO LOREM IPSUM</p>
                      <h3 className="text-white text-2xl font-medium mb-4">Pepita Perez</h3>
                      <p className="text-white/80 text-base">Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.</p>
                      <p className="text-white/80 text-base mt-4">These "living seed hubs" hosts an "inner corridor" within the land, connecting fragmented landscapes and serving as a refuge for endangered species.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-[50px] rounded-[20px] border border-white/20 p-8">
                  <div className="flex flex-col gap-6">
                    <div className="w-[100px] h-[100px] rounded-[10px] overflow-hidden">
                      <img 
                        src="/assets/placeholder-ally.jpg" 
                        alt="Pepita Perez" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">CEO LOREM IPSUM</p>
                      <h3 className="text-white text-2xl font-medium mb-4">Pepita Perez</h3>
                      <p className="text-white/80 text-base">Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times.</p>
                      <p className="text-white/80 text-base mt-4">These "living seed hubs" hosts an "inner corridor" within the land, connecting fragmented landscapes and serving as a refuge for endangered species.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Slider Section */}
      <section className="relative w-full bg-secondary flex flex-col items-center">
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-20">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="aspect-[3/1]">
                  <img 
                    src="/assets/placeholder-logo.jpg" 
                    alt={`Partner logo ${index}`} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Allies; 