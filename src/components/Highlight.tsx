import React from 'react';

const Highlight = () => {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-start px-[clamp(1.5rem,5vw,6.25rem)] py-24" style={{ background: 'linear-gradient(120deg, #1C3625 0%, #2E4F22 100%)' }}>
      {/* Topographic pattern overlay */}
      <img src="/assets/topographic-map.svg" alt="topographic pattern" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
      <div className="relative z-10 flex flex-col lg:flex-row w-full items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-4xl">
          <span className="eyebrow text-light mb-6">BUILDERS, VISIONARIES, REGENERATORS.</span>
          <h2 className="text-light font-montserrat text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-tight font-normal mb-8" style={{lineHeight: 1.1}}>
            Together, <span className="text-[var(--color-orange)] font-semibold">we're building</span> the foundations of a <span className="text-[var(--color-orange)] font-semibold">regenerative future</span>, one hub, one corridor, one community, one story at a time.
          </h2>
        </div>
        {/* Image */}
        <div className="flex-1 flex justify-end items-end">
          <img src="/assets/community-garden.jpg" alt="Community Garden" className="rounded-2xl shadow-lg max-w-xl w-full h-auto" />
        </div>
      </div>
    </section>
  );
};

export default Highlight; 