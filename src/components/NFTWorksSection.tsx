import React from 'react';

const NFTWorksSection: React.FC = () => (
  <section
    className="w-full h-full py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
    style={{ background: 'var(--background-gradient-light)' }}
  >
    <div className="max-w-[160rem] mx-auto flex flex-col gap-24">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
        <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
          How the NFT <br />
          <strong>Works in two steps</strong>
        </h2>
        <p className="body-M text-secondary max-w-[35rem]">
        The NFT’s encrypted metadata contain the legal framework, land geolocation, title registry, membership terms, artworks —ensuring permanent protection and stakeholder rights enforcement.
        </p>
      </div>
      {/* Step 1 */}
      <div className="flex flex-col lg:flex-row items-end gap-12 ">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/assets/nft.png"
            alt="NFT Stewardship Illustration"
            className="w-full max-w-[100%] h-auto"
          />
        </div>
        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="w-full flex flex-row justify-end">
            <span
              className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
              style={{ fontWeight: 400 }}
            >
              01
            </span>
          </div>
          <div className="w-full max-w-xl">
            <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Buy an NFT and become a steward
            </h3>
            <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
              You gain lifelong stewardship and utility rights over a specific plot of land, allowing you to monitor and participate in important decisions that affect these ecosystems, and receive exclusive benefits to visit the hubs and explore the whole Corridor.
            </p>
          </div>
        </div>
      </div>
      {/* Step 2 */}
      <div className="flex flex-col lg:flex-row items-end gap-12 ">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/assets/nft-works/nft-works-step2-image.webp"
            alt="NFT Implementation Illustration"
            className="w-full max-w-[100%] h-auto mix-blend-multiply"
          />
        </div>
        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="w-full flex flex-row justify-end">
            <span
              className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
              style={{ fontWeight: 400 }}
            >
              02
            </span>
          </div>
          <div className="w-full max-w-xl">
            <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Fund the implementation
            </h3>
            <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
              Funds are used for four key actions: acquiring and protecting degraded lands, restoring their ecosystems, transforming them into thriving biocultural HUBS, and improving our regenerative model to ensure long-term impact, scalability, and glocal community engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NFTWorksSection; 