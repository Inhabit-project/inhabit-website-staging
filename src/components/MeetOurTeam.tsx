import React, { useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

const teamMembers = [
  {
    key: 0,
    image: '/assets/team/luca.webp',
    linkedin: 'https://www.linkedin.com/in/luca-urbano-36ab33a0/',
  },
  {
    key: 1,
    image: '/assets/team/chiara.webp',
    linkedin: 'https://www.linkedin.com/in/chiara-trotto/',
  },
  {
    key: 2,
    image: '/assets/team/dror.webp',
    linkedin: 'https://www.linkedin.com/in/drornoi/',
  },
  {
    key: 3,
    image: '/assets/team/talya.webp',
    linkedin: 'https://www.linkedin.com/in/talya-weinberg/',
  },
  {
    key: 4,
    image: '/assets/team/amelia.webp',
    linkedin: 'https://www.linkedin.com/in/amar-madre-tierra-75a684296/',
  },
  {
    key: 5,
    image: '/assets/team/junior.webp',
    linkedin: 'https://www.linkedin.com/in/rojasjuniore/',
  },
  {
    key: 6,
    image: '/assets/team/Gaia-pagano.webp',
    linkedin: 'https://www.linkedin.com/in/gaia-pagano-magnolia/',
  },
  {
    key: 7,
    image: '/assets/team/juan.webp',
    linkedin: '#',
  },
  {
    key: 8,
    image: '/assets/team/mohamd.webp',
    linkedin: 'https://www.linkedin.com/in/mohamadhibrahim/',
  },
  {
    key: 9,
    image: '/assets/team/celia.webp',
    linkedin: '#',
  },
  {
    key: 10,
    image: '/assets/team/JuanDiego.webp',
    linkedin: 'https://www.linkedin.com/in/juandiegoagudelom/',
  },
  {
    key: 11,
    image: '/assets/team/fernanda.webp',
    linkedin: 'https://www.linkedin.com/in/fernanda-herrera/',
  },
];

const fallbackNameKeys = [
  'aboutUsPage.team.0.name',
  'aboutUsPage.team.1.name',
  'aboutUsPage.team.2.name',
  'aboutUsPage.team.3.name',
  'aboutUsPage.team.4.name',
  'aboutUsPage.team.5.name',
  'aboutUsPage.team.6.name',
  'aboutUsPage.team.7.name',
  'aboutUsPage.team.8.name',
  'aboutUsPage.team.9.name',
  'aboutUsPage.team.10.name',
  'aboutUsPage.team.11.name',
];
const fallbackRoleKeys = [
  'aboutUsPage.team.0.role',
  'aboutUsPage.team.1.role',
  'aboutUsPage.team.2.role',
  'aboutUsPage.team.3.role',
  'aboutUsPage.team.4.role',
  'aboutUsPage.team.5.role',
  'aboutUsPage.team.6.role',
  'aboutUsPage.team.7.role',
  'aboutUsPage.team.8.role',
  'aboutUsPage.team.9.role',
  'aboutUsPage.team.10.role',
  'aboutUsPage.team.11.role',
];

const MeetOurTeam: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);

  // Fetch the team array with returnObjects: true for i18next array support
  const teamArray = t('aboutUsPage.team', { returnObjects: true }) as { name: string; role: string }[];

  // Fallbacks use translation keys for name/role
  const fallbackName = fallbackNameKeys.map((key) => t(key));
  const fallbackRole = fallbackRoleKeys.map((key) => t(key));

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
            <h2 className="heading-2 text-secondary mb-2">
              <span dangerouslySetInnerHTML={{ __html: t('aboutUsPage.teamTitle') }} />
            </h2>
          </div>
          <p className="body-M text-secondary max-w-xl">
            {t('aboutUsPage.teamSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => {
            const name = teamArray?.[idx]?.name || fallbackName[idx];
            const role = teamArray?.[idx]?.role || fallbackRole[idx];
            const excerpt = role.length > 60 ? role.slice(0, 60).trim() + '…' : role;
            const isExpanded = expanded === idx;
            return (
              <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg group flex flex-col h-full bg-[#1B3A2B]">
                <div className="w-full" style={{height: '30rem', overflow: 'hidden'}}>
                  <img src={member.image} alt={name} className="w-full h-full object-cover" style={{objectFit: 'cover', width: '100%', height: '100%'}} />
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
                  <h3 className="font-montserrat text-lg font-semibold text-white mb-1">{name}</h3>
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
                      {role}
                    </span>
                  </div>
                  {role.length > 60 && (
                    <button
                      className="mt-2 underline hover:opacity-80 focus:outline-none block self-start"
                      style={{ color: 'var(--color-green-soft)' }}
                      onClick={() => setExpanded(isExpanded ? null : idx)}
                    >
                      {isExpanded ? t('aboutUsPage.teamShowLess') : t('aboutUsPage.teamReadMore')}
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