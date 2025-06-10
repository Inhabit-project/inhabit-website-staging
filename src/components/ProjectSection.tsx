import React from 'react';

const ProjectSection: React.FC = () => {
  return (
    <section
      className="w-full h-full py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--background-gradient-light)' }}
      aria-labelledby="project-section-title"
    >
      <div className="max-w-[160rem] mx-auto flex flex-col gap-24">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 id="project-section-title" className="heading-2 text-secondary max-w-[40.9375rem]">
            <span>How Our Projects Create Impact</span>
          </h2>
          <p className="body-M text-secondary max-w-[35rem]">
            Our projects focus on ecosystem restoration, biocultural innovation, and empowering communities to build a regenerative future. Each step is designed to maximize real-world impact and foster collaboration.
          </p>
        </div>
        {/* Step 1 */}
        <article className="flex flex-col lg:flex-row items-end gap-12">
          {/* Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/assets/images/img2.webp"
              alt="Project Restoration Illustration"
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
                01
              </span>
            </div>
            <div className="w-full max-w-xl">
              <h3 className="heading-5 text-[var(--color-secondary)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                Community-Led Restoration
              </h3>
              <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
                We engage local communities in hands-on restoration activities, combining traditional knowledge with innovative ecological practices to heal degraded landscapes.
              </p>
            </div>
          </div>
        </article>
        {/* Step 2 */}
        <div className="flex flex-col lg:flex-row items-end gap-12 ">
          {/* Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/assets/images/img3.webp"
              alt="Project Collaboration Illustration"
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
                Biocultural Innovation
              </h3>
              <p className="body-M font-light text-[var(--color-secondary)]" style={{ fontWeight: 300 }}>
                Our projects foster biocultural innovation by supporting knowledge exchange, creative problem-solving, and the development of new models for sustainable living.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection; 