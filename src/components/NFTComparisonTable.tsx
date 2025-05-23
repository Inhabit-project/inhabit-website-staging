import React from 'react';

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
      <rect width="20" height="20" rx="4" fill="#D57300"/>
      <path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EmptyCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
      <rect width="20" height="20" rx="4" fill="#1c3625" stroke="#D57300" strokeWidth="2"/>
    </svg>
  );
}

const NFTComparisonTable: React.FC = () => {
  return (
    <div className="overflow-x-auto mt-16">
      <table className="min-w-full border-separate border-spacing-0 text-left text-light bg-[#1c3625]/80 rounded-2xl">
        <thead>
          <tr>
            <th className="px-6 py-3 font-bold text-lg align-bottom bg-transparent border border-white" rowSpan={2}></th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>TITÍ</th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>PAUJIL</th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>CARACOLÍ</th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>JAGUAR</th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">MINIMUM<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">FULL<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">MINIMUM<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">FULL<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">MINIMUM<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">FULL<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">MINIMUM<br/>FUNDRAISE</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">FULL<br/>FUNDRAISE</th>
          </tr>
        </thead>
        <tbody>
          {/* LAND RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>LAND RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Life-long Membership & Stewardship<br/><span className="text-xs font-normal">You gain lifelong stewardship and utility rights over a tokenized real-world land.</span></td>
            {Array(8).fill(0).map((_,i) => <td key={i} className="px-4 py-4 text-center border border-white">{CheckIcon()}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Legal Protector of the land<br/><span className="text-xs font-normal">You become part of the legal system of guarantee that recognizes Nature as a subject with rights on a specific land related to this membership, in line with the Declaration of the Rights of Nature and Biocultural principles.</span></td>
            {Array(8).fill(0).map((_,i) => <td key={i} className="px-4 py-4 text-center border border-white">{CheckIcon()}</td>)}
          </tr>
          {/* GOVERNANCE RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>GOVERNANCE RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Inhabit DAO access<br/><span className="text-xs font-normal">You receive governance rights over specific matters as a land guarantor. You have a say in decisions regarding unexpected changes in land use, shifts in Hub management, or any unforeseen events that could alter the relationship between stakeholders and the land or threaten the Rights of Nature.</span></td>
            {[CheckIcon(), EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          {/* ART RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>ART RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Badge of legal protector via exclusive ArtWork by <span className="text-orange-400 font-bold">Jeisson Castillo</span><br/><span className="text-xs font-normal">Each ArtPiece represents a Migratory Floating Garden from the HUB's ecosystem, featuring a native species vital to that habitat and tied to levels of care in Kogui ancestral thinking. The unique Art Badge symbolizes your legal stewardship connection to a specific piece of land, which you can use to travel and activate the corridor.</span></td>
            {Array(8).fill(0).map((_,i) => <td key={i} className="px-4 py-4 text-center border border-white">{CheckIcon()}</td>)}
          </tr>
          {/* MONITORING RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>MONITORING RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Impact Monitoring access via <span className="text-orange-400 font-bold">MAP HERE</span><br/><span className="text-xs font-normal">Track the progress of the land you help protect through real-time data mapping and geolocation narratives. Follow the transformation of the land into a bio-cultural hub. You receive regular real-time data and impact reports, geolocation, visual mapping, and key performance indicators (KPIs) detailing progress in areas like tree planting, biodiversity increase, and local community impact.</span></td>
            {[CheckIcon(), EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          {/* UTILITY RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>UTILITY RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Free accommodation</td>
            {[EmptyCheckIcon(), EmptyCheckIcon(), '1 day', '1 day', '2 days', '3 days', '3 days', '4 days'].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Free meals</td>
            {[EmptyCheckIcon(), EmptyCheckIcon(), '3 days', '4 days', '4 days', '4 days', '4 days', '4 days'].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Accommodation discount</td>
            {[EmptyCheckIcon(), '10%', EmptyCheckIcon(), '20%', '20%', '30%', '20%', '30%'].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Meal discount</td>
            {[EmptyCheckIcon(), '10%', EmptyCheckIcon(), '20%', '20%', '30%', '20%', '30%'].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Discounted workshops</td>
            {[EmptyCheckIcon(), '1 workshop', EmptyCheckIcon(), '1 workshop', '2 workshops', '2 workshops', '2 workshops + 1 personalized workshop', '2 workshops + 2 personalized workshops'].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          {/* EDUCATION RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>EDUCATION RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Access to educational contents<br/><span className="text-xs font-normal">About inhabiting knowledge and techniques</span></td>
            {[EmptyCheckIcon(), 'Basic level contents', EmptyCheckIcon(), 'Basic level contents', 'Basic level contents', 'Medium level contents', 'Medium level contents', 'Full level contents'].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          {/* ASSET RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>ASSET RIGHTS</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">Future NFT upgrades<br/><span className="text-xs font-normal">As an early backer, you are entitled to receive future versions of the NFT for free, which will include additional rights and benefits as the project evolves in the NFT 2.0 (conditional on development).</span></td>
            {[CheckIcon(), EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NFTComparisonTable; 