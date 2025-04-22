import React from 'react';

const StewardshipNFT: React.FC = () => {
  return (
    <section className="relative w-full bg-secondary flex flex-col items-center">
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full ">
            <h2 className="heading-2 text-light max-w-[40.9375rem]">
              Stewardship<br /><strong>NFTs</strong>
            </h2>
            <p className="body-M text-light max-w-[35rem]">
              Your digital key to lifelong stewardship of unique ecosystems.
              Each NFT represents a direct connection to a specific conservation area,
              granting you rights and exclusive access to bio-cultural experiences.
            </p>
          </div>

          {/* Image */}
          <div className="self-center relative overflow-hidden">
            <img 
              src="/assets/figma-images/stewardship-nft.webp" 
              alt="Stewardship NFT illustration" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StewardshipNFT; 