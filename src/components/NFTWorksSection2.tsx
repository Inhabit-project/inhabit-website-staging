import React from 'react';

const NFTWorksSection2: React.FC = () => (
  <section
    className="w-full h-full py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
    style={{ background: 'var(--background-gradient-light)' }}
    aria-labelledby="nft-works-step2-title"
  >
    <div className="max-w-[160rem] mx-auto flex flex-col lg:flex-row items-end gap-12">
      {/* Image */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src="/assets/nft-works/nft-works-step2-image.webp"
          alt="NFT Implementation Illustration"
          className="w-full max-w-[100%] h-auto"
          loading="lazy"
        />
      </div>
      {/* Text Content */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="w-full flex flex-row justify-end">
          <span
            className="font-abel text-[8rem] leading-none text-[var(--color-secondary)] opacity-90 mb-48"
            style={{ fontWeight: 400 }}
            aria-hidden="true"
          >
            02
          </span>
        </div>
        <div className="w-full max-w-xl">
          <h3 id="nft-works-step2-title" className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            Fund the implementation
          </h3>
          <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
            Funds are used for four key actions: acquiring and protecting degraded lands, restoring their ecosystems, transforming them into thriving biocultural HUBS, and improving our regenerative model to ensure long-term impact, scalability, and glocal community engagement.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default NFTWorksSection2; 