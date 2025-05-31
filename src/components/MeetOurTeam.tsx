import React, { useState, useRef, useLayoutEffect } from 'react';

const teamMembers = [
  {
    name: 'Luca Urbano',
    role: 'Social entrepreneur and farmer with 13 years experience in regenerative business development, ecosystem restoration, agroecology, agroforestry, social and inclusive supply chains. Grew up in Congo, established the first Moringa supply chain based on food forest systems. Co-founder of several social businesses focused on food and IT.',
    image: '/assets/team/luca.webp',
    linkedin: 'https://www.linkedin.com/in/luca-urbano-36ab33a0/',
  },
  {
    name: 'Chiara Trotto',
    role: 'Bachelor of Social Sciences in cooperation and development, facilitator and trainer in project formulation, social entrepreneur, 13+ years of experience in sustainable agro-food chains, social innovation, and non-formal education with communities in Europe, Africa, and Latin America.',
    image: '/assets/team/chiara.webp',
    linkedin: 'https://www.linkedin.com/in/chiara-trotto/',
  },
  {
    name: 'Dror Noi',
    role: 'Social entrepreneur and permaculture designer passionate about decentralized and regenerative cultures/agriculture. Grew up in Israel, established the first center for Social Innovation in TLV. Co-Founder of Yumajai & Partner at Inside-hub. Manages a permaculture farm in Colombia.',
    image: '/assets/team/dror.webp',
    linkedin: 'https://www.linkedin.com/in/drornoi/',
  },
  
  {
    name: 'Talya Weinberg',
    role: 'Global impact strategist, social clown, and integral artist, expert in ecosystemic and human regeneration. Co-founder of Yumajai and Heart Spaces methodology, integrating art, ecology, ancestral wisdom, and education to inspire global change.',
    image: '/assets/team/talya.webp',
    linkedin: 'https://www.linkedin.com/in/talya-weinberg/',
  },
  {
    name: 'Amelia Maria Carrillo',
    role: 'Attorney with a Master\'s in Territorial Studies, experienced in environmental law and legal territorial protection frameworks from a biocultural perspective. Founder of the Foundation of Mother Earth operating across Colombia.',
    image: '/assets/team/amelia.webp',
    linkedin: 'https://www.linkedin.com/in/amar-madre-tierra-75a684296/',
  },
  {
    name: 'Junior Rojaas',
    role: 'Senior developer and entrepreneur with 11+ years in software development, specializing in blockchain and cryptocurrencies. CTO of Futswap and CEO of Intechchain, leading projects in decentralized finance and technological solutions.',
    image: '/assets/team/junior.webp',
    linkedin: 'https://www.linkedin.com/in/rojasjuniore/',
  },
  {
    name: 'Gaia Pagano',
    role: 'Bachelor of Social Sciences, Master in Innovation and Development, Human Rights and Culture of Peace. Coordinator at Pontificia Universidad Javeriana, 12+ years in peace and reconciliation, intercultural relations, and dialogue projects with indigenous and Afro-descendant communities.',
    image: '/assets/team/Gaia-pagano.webp',
    linkedin: 'https://www.linkedin.com/in/gaia-pagano-magnolia/',
  },
  {
    name: 'Juan Pablo Lievano',
    role: 'Economist and MA in anthropology with 13+ years of experience in sustainable rural development, climate change, project management, and financial evaluation of small farmer agribusiness models. Founder of two natural reserves in Colombia.',
    image: '/assets/team/juan.webp',
    linkedin: '#',
  },
  {
    name: 'Mohamd Ibrahim',
    role: 'Network and satellite communications engineer, ICT expert for over 20 years. He grew up in Congo (D.R.) where he founded several Internet service providers, earth stations and data centres that brought reliable, redundant, secure and affordable connectivity to Africa. Expert in Cybersecurity, hosting, System Administration, Network routing and optimization, blockchain engineering and Artificial Intelligence. ',
    image: '/assets/team/mohamd.webp',
    linkedin: 'https://www.linkedin.com/in/mohamadhibrahim/',
  },
  {
    name: 'Celia Mercado',
    role: '10 years of experience as an eco-psycho-social transformation facilitator. Industrial engineer, Master in Rural Development, and specialized in Transpersonal-Integral Psychology. She leads sustainable projects and fosters inclusive initiatives within rural communities in Colombia. With the INHABIT Foundation, she actively co-creates biocultural methodologies and supports territorial regeneration through community-based stewardship strategies.',
    image: '/assets/team/celia.webp',
    linkedin: '#',
  },
  {
    name: 'Juan Diego Agudelo',
    role: 'A developer with 4 years of experience specializing in real-world asset tokenization and blockchain interoperability. His work focuses on process traceability, capital distribution, and asset tokenization. Committed to blockchain for good, he designs systems that support the creation, collective governance, and long-term stewardship of physical commons, fostering regenerative, community-driven economies.',
    image: '/assets/team/JuanDiego.webp',
    linkedin: 'https://www.linkedin.com/in/juandiegoagudelom/',
  },
  {
    name: 'Fernanda Herrera',
    role: 'Visual designer with 12 years of experience in the field of digital project development, working as UI and UX designer for websites and applications, many of these websites have been fully developed from the conceptualization phase of the design to the code development itself, usually using Html5, css3 and basic javascript or CMS like wordpress, webflow, etc. I have basic knowledge in frameworks such as vue, react, angular, python and ruby on rails, microintreactions and advanced web animations.',
    image: '/assets/team/fernanda.webp',
    linkedin: 'https://www.linkedin.com/in/fernanda-herrera/',
  },
];

const MeetOurTeam: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);

  useLayoutEffect(() => {
    setHeights(
      teamMembers.map((_, idx) =>
        descRefs.current[idx]?.scrollHeight || 0
      )
    );
  }, [expanded]);

  return (
    <section className="w-full py-20 px-4 background-gradient-light scroll-container">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div>
            <h2 className="heading-2 text-secondary mb-2">Meet our <strong><br />Team</strong></h2>
          </div>
          <p className="body-M text-secondary max-w-xl">
            We are purpose-driven entrepreneurs, farmers, artists, facilitators — Experts in law, restoration, technology and rural development—united to reinvest ways of inhabiting Earth
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => {
            const excerpt = member.role.length > 60 ? member.role.slice(0, 60).trim() + '…' : member.role;
            const isExpanded = expanded === idx;
            return (
              <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg group flex flex-col h-full bg-[#1B3A2B]">
                <div className="w-full" style={{height: '30rem', overflow: 'hidden'}}>
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 blur-sm pointer-events-none" />
                {/* LinkedIn icon */}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 z-10 bg-menu-backdrop backdrop-blur-lg rounded-full p-2 hover:bg-green-800/90 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" className="text-white">
                    <path className="st0" fill="#fff" d="M80.111 25.6c-29.028 0-48.023 20.547-48.023 47.545 0 26.424 18.459 47.584 46.893 47.584h.573c29.601 0 47.999-21.16 47.999-47.584-.543-26.998-18.398-47.545-47.442-47.545zm-48.111 128h96v320.99h-96v-320.99zm323.631-7.822c-58.274 0-84.318 32.947-98.883 55.996v1.094h-.726c.211-.357.485-.713.726-1.094v-48.031h-96.748c1.477 31.819 0 320.847 0 320.847h96.748v-171.241c0-10.129.742-20.207 3.633-27.468 7.928-20.224 25.965-41.185 56.305-41.185 39.705 0 67.576 31.057 67.576 76.611v163.283h97.717v-176.313c0-104.053-54.123-152.499-126.347-152.499z"/>
                  </svg>
                </a>
                {/* Name and role */}
                <div className="flex-1 flex flex-col justify-end absolute bottom-0 left-0 p-4 z-10 rounded-lg backdrop-blur-lg m-4 w-[calc(100%-2rem)]">
                  <h3 className="font-montserrat text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <div
                    ref={el => descRefs.current[idx] = el}
                    className="font-nunito text-sm text-white/90 leading-snug overflow-hidden relative"
                    style={{
                      maxHeight: isExpanded ? (heights[idx] ? heights[idx] + 20 : 200) : 40,
                      opacity: 1,
                      minHeight: 24,
                      transition: 'max-height 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {/* Excerpt (always rendered, fades out when expanded) */}
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        opacity: isExpanded ? 0 : 1,
                        pointerEvents: isExpanded ? 'none' : 'auto',
                        transition: 'opacity 0.3s',
                        zIndex: 2,
                        background: 'transparent',
                      }}
                    >
                      {excerpt}
                    </span>
                    {/* Full text (always rendered, fades in when expanded) */}
                    <span
                      style={{
                        display: 'block',
                        opacity: isExpanded ? 1 : 0,
                        transition: 'opacity 0.3s',
                        zIndex: 1,
                        position: 'relative',
                      }}
                    >
                      {member.role}
                    </span>
                  </div>
                  {member.role.length > 60 && (
                    <button
                      className="mt-2 underline hover:opacity-80 focus:outline-none block self-start"
                      style={{ color: 'var(--color-green-soft)' }}
                      onClick={() => setExpanded(isExpanded ? null : idx)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeam; 