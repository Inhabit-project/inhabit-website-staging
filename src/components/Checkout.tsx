import React, { useEffect, useContext } from 'react';
import BecomeStewardButton from './BecomeStewardButton';
import DownloadButton from './DownloadButton';
import Menu from './Menu';
import { LoadingContext } from '@/App';

// NFT Membership data model
export type NFTMembership = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  eyebrow: string;
  valueUSD: number;
  valueCrypto: string;
  rightsTable: Array<{
    type: string;
    detail: string;
    min: boolean;
    full: boolean;
  }>;
};

// Example memberships (move to a separate file if needed)
export const NFT_MEMBERSHIPS: NFTMembership[] = [
  {
    id: 'titi',
    name: 'Tití',
    subtitle: 'Seed dispensers of the Corridor',
    description:
      'Tití monkeys (White-headed Tamarins) are small, playful beings that support the health of the forest by controlling pests and dispersing seeds throughout the Corridor.\n\nThis evokes the first level of stewardship in the Indigenous Kogui tradition, where children care for "animals".',
    image: '/assets/nfts/titi.webp',
    eyebrow: 'NUTANZHI',
    valueUSD: 50,
    valueCrypto: '0.1 ETH',
    rightsTable: [
      {
        type: 'LAND RIGHT',
        detail:
          'Life-long Membership & Stewardship You gain lifelong stewardship and utility rights over a tokenized real-world land. Legal Protector of the land You become part of the legal system of guarantee that recognizes Nature as a subject with rights as specified and related to this membership. In line with the Declaration of the Rights of Nature and Biocultural principles. Inhabitat DAO access',
        min: true,
        full: true,
      },
      {
        type: 'GOVERNANCE RIGHT',
        detail:
          'You receive governance rights over specific matters as a land guarantor. You have a say in decisions regarding unexpected changes in land use, shifts in hub management, or any unforeseen events that could alter the relationship between stakeholders and the land or threaten the Rights of Nature.',
        min: true,
        full: true,
      },
      {
        type: 'ART RIGHT',
        detail:
          "Badge of legal protector via exclusive ArtWork by Jeisson Castillo Each ArtPiece represents a Migratory Floating Garden from the HUB's ecosystem. Holders receive a digital badge symbol that bestows a steward's circle in key ancestral routes, with a special NFT to allow for symbolic legal title deeds of connection to a specific ecosystem and the right to vote for the stewardship artwork.",
        min: true,
        full: true,
      },
      {
        type: 'MONITORING RIGHT',
        detail:
          'Impact Monitoring access The digital membership lets you help and protect through real-time data mapping and monitoring. You can track the HUB here. You receive regular real-time updates on the impact and health of your protected hub, and key performance indicators related to the corridor and its areas like tree planting, biodiversity increase, and local stewardship.',
        min: true,
        full: true,
      },
      {
        type: 'UTILITY RIGHTS',
        detail: 'Free meals, Accommodation discount, Meal discount, Discounted workshops',
        min: false,
        full: true,
      },
      {
        type: 'EDUCATION RIGHT',
        detail: 'Access to educational contents about inhabiting knowledge and ecosystems',
        min: true,
        full: true,
      },
      {
        type: 'ASSET RIGHT',
        detail:
          'Future NFT upgrades Each membership will be eligible to receive future versions of the NFT for free, which will add further legal, biocultural, and benefits as the project evolves in the NFT 2.0 (conditional on development).',
        min: false,
        full: true,
      },
    ],
  },
  // Add more NFT memberships here
];

// Utility to get membership by id
function getMembershipById(id: string | undefined): NFTMembership {
  return (
    NFT_MEMBERSHIPS.find((m) => m.id === id) || NFT_MEMBERSHIPS[0]
  );
}

// Accept membershipId as prop (or from route param in parent)
interface CheckoutProps {
  membershipId?: string;
  onPageReady?: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ membershipId, onPageReady }) => {
  const isLoading = useContext(LoadingContext);
  const membership = getMembershipById(membershipId);

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  if (isLoading) {
    // Optionally, you could return null or a minimal loader here
    return null;
  }

  return (
    <>
      <Menu />
      <div className="mt-8 w-full background-gradient-light flex flex-col lg:flex-row gap-8 px-4 py-12 lg:py-20 max-w-[1600px] mx-auto pb-24">
        {/* Left: Membership Info */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Image and Title */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src={membership.image} alt={`${membership.name} Membership`} className="w-[320px] h-[320px] rounded-3xl object-cover border border-green-soft shadow-lg" />
            <div className="flex flex-col gap-2">
              <span className="eyebrow text-secondary">{membership.eyebrow}</span>
              <h1 className="heading-2 text-secondary font-semibold">{membership.name} <br /><span className="heading-2 text-secondary ">Membership</span></h1>
              <p className="body-S text-secondary max-w-xl whitespace-pre-line">{membership.description}</p>
              <div className="mt-4">
                <span className="body-M text-secondary font-bold">VALUE</span>
                <div className="heading-2 font-abel text-secondary">$ {membership.valueUSD} USD</div>
              </div>
            </div>
          </div>
          {/* Rights Table - Figma Style */}
          <div className="overflow-x-auto border border-green-soft bg-[#E2EDD3] shadow-md">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-[#E2EDD3] border-b border-green-soft">
                  <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide">RIGHT TYPE</th>
                  <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide">RIGHT DETAIL</th>
                  <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide text-center">MINIMUM FUNDRAISE</th>
                  <th className="py-4 px-6 font-montserrat font-bold text-secondary text-base tracking-wide text-center">FULL FUNDRAISE</th>
                </tr>
              </thead>
              <tbody className="font-nunito text-secondary text-[1rem]">
                {/* LAND RIGHT */}
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 font-bold align-top" rowSpan={2}>LAND RIGHT</td>
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Life-long Membership & Stewardship</span><br />
                    You gain lifelong stewardship and utility rights over a tokenized real-world land.
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    {/* Orange checked box SVG */}
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                      <path d="M8 14.5L12 18L20 10" stroke="#D57300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                      <path d="M8 14.5L12 18L20 10" stroke="#D57300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Legal Protector of the land</span><br />
                    You become part of the legal system of guarantee that recognizes Nature as a subject with rights on a specific land related to this membership, in line with the Declaration of the Rights of Nature and Biocultural principles.
                  </td>
                </tr>
                {/* GOVERNANCE RIGHT */}
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 font-bold align-top" rowSpan={2}>GOVERNANCE RIGHT</td>
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Inhabit DAO access</span><br />
                    You receive governance rights over specific matters as a land guarantor. You have a say in decisions regarding unexpected changes in land use, shifts in Hub management, or any unforeseen events that could alter the relationship between stakeholders and the land or threaten the Rights of Nature.
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                      <path d="M8 14.5L12 18L20 10" stroke="#D57300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                      <path d="M8 14.5L12 18L20 10" stroke="#D57300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Badge of legal protector via exclusive ArtWork by <span className="text-[#D57300] underline">Jeisson Castillo</span></span><br />
                    Each ArtPiece represents a Migratory Floating Garden from the HUB's ecosystem, featuring a native species vital to that habitat and tied to levels of care in Kogui ancestral thinking. The unique Art Badge symbolizes your legal stewardship connection to a specific piece of land, which you can use to travel and activate the corridor.
                  </td>
                </tr>
                {/* MONITORING RIGHT */}
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 font-bold align-top" rowSpan={2}>MONITORING RIGHT</td>
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Impact Monitoring access</span><br />
                    Track the progress of the land you help protect through real-time data mapping and geolocation narratives <span className="text-[#D57300] underline cursor-pointer">MAP HERE</span>.<br />
                    Follow the transformation of the land into a Biocultural hub. You receive regular real-time data and impact reports, geolocation, visual mapping, and key performance indicators (KPIs) detailing progress in areas like tree planting, biodiversity increase, and local community impact.
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                      <path d="M8 14.5L12 18L20 10" stroke="#D57300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                      <path d="M8 14.5L12 18L20 10" stroke="#D57300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top"></td>
                </tr>
                {/* UTILITY RIGHTS */}
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 font-bold align-top" rowSpan={5}>UTILITY RIGHTS</td>
                  <td className="py-3 px-6 align-top">Free accommodation</td>
                  <td className="py-3 px-6 text-center align-top">
                    {/* Empty box SVG */}
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top">Free meals</td>
                  <td className="py-3 px-6 text-center align-top">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top">Accommodation discount</td>
                  <td className="py-3 px-6 text-center align-top">10%</td>
                  <td className="py-3 px-6 text-center align-top">20%</td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top">Meal discount</td>
                  <td className="py-3 px-6 text-center align-top">10%</td>
                  <td className="py-3 px-6 text-center align-top">20%</td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top">Discounted workshops</td>
                  <td className="py-3 px-6 text-center align-top">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                </tr>
                {/* EDUCATION RIGHT */}
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 font-bold align-top" rowSpan={2}>EDUCATION RIGHT</td>
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Access to educational contents</span><br />
                    About inhabiting knowledge and techniques
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}></td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <span className="inline-block px-3 py-1 bg-[#E2EDD3] border border-green-soft text-[#1C3625] font-bold text-xs rounded-none">Basic level contents</span>
                  </td>
                </tr>
                <tr className="border-b border-green-soft align-top">
                  <td className="py-3 px-6 align-top"></td>
                </tr>
                {/* ASSET RIGHT */}
                <tr className="align-top">
                  <td className="py-3 px-6 font-bold align-top" rowSpan={2}>ASSET RIGHT</td>
                  <td className="py-3 px-6 align-top">
                    <span className="font-bold">Future NFT upgrades</span><br />
                    As early backer, you are entitled to receive future versions of the NFT for free, which will include additional rights and benefits as the project evolves in the NFT 2.0 (conditional on development).
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                  <td className="py-3 px-6 text-center align-top" rowSpan={2}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                      <rect x="2" y="2" width="24" height="24" rx="2" fill="#E2EDD3" stroke="#D57300" strokeWidth="2.5"/>
                    </svg>
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="py-3 px-6 align-top"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Right: Checkout Form */}
        <div className="w-full max-w-lg background-gradient-dark backdrop-blur-lg rounded-3xl shadow-xl border border-green-soft p-8 flex flex-col gap-6 self-start sticky top-8">
          <button className="btn-primary w-full mb-2">Connect Wallet</button>
          <form className="flex flex-col gap-4">
            <div>
              <label className="body-S block text-light font-semibold mb-1">Name*</label>
              <input type="text" className="input-main" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="body-S block text-light font-semibold mb-1">E-Mail*</label>
              <input type="email" className="input-main" placeholder="your@email.com" />
            </div>
            <div>
              <label className="body-S block text-light font-semibold mb-1">Telephone</label>
              <input type="tel" className="input-main" placeholder="1234567890" />
            </div>
            <div>
              <label className="body-S block text-light font-semibold mb-1">Telegram user</label>
              <input type="text" className="input-main" placeholder="@pepio-perez" />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-start gap-2 text-xs text-light">
                <input type="checkbox" className="mt-1" />
                I understand that I'll need to complete a KYC Verification to eventually fully access the rights and benefits associated with my membership.
              </label>
              <label className="flex items-start gap-2 text-xs text-light">
                <input type="checkbox" className="mt-1" />
                I accept the terms and conditions of the Membership Agreement granting me rights and benefits related to this Land and Project.
              </label>
            </div>
          </form>
          {/* Summary */}
          <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span className="body-S text-light">subtotal</span>
              <span className="body-S text-light">$ {(membership.valueUSD * 0.95).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-light font-bold text-lg">
              <span className="body-M text-light">Total taxes included</span>
              <span className="body-M text-light">$ {membership.valueUSD} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="body-S text-light">Value in crypto</span>
              <span className="body-S text-light">{membership.valueCrypto}</span>
            </div>
          </div>
          <button className="btn-secondary w-full mt-2">Get here your NFT</button>
        </div>
      </div>
    </>
  );
};

export default Checkout; 