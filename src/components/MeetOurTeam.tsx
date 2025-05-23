import React from 'react';

const teamMembers = [
  {
    name: 'Luca Urbano',
    role: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue interdum ligula a dignissim.',
    image: '/assets/team/luca-urbano.jpg',
    linkedin: '#',
  },
  // ...add more team members as needed (use the same placeholder for now)
];

// Fill with 12 placeholders for demo
while (teamMembers.length < 12) {
  teamMembers.push({
    name: 'Luka Urbano',
    role: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue interdum ligula a dignissim.',
    image: '/assets/team/luca-urbano.jpg',
    linkedin: '#',
  });
}

const MeetOurTeam: React.FC = () => (
  <section className="w-full py-20 px-4 background-gradient-light">
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
        {teamMembers.map((member, idx) => (
          <div key={idx} className="relative rounded-2xl overflow-hidden shadow-lg group">
            <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* LinkedIn icon */}
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 z-10 bg-white/20 rounded-full p-2 hover:bg-white/40 transition">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                <path d="M16 8a6 6 0 0 1 6 6v5h-4v-5a2 2 0 0 0-4 0v5h-4v-9h4v1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="9" width="4" height="12" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4" cy="4" r="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            {/* Name and role */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-10">
              <h3 className="font-montserrat text-lg font-semibold text-white mb-1">{member.name}</h3>
              <p className="font-nunito text-sm text-white/90 leading-snug">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MeetOurTeam; 