import React from 'react';
import { nftComparisonFeatures, NFTPackage } from './nftComparisonData';

const packages: NFTPackage[] = ['TITÍ', 'PAUJIL', 'CARACOLÍ', 'JAGUAR'];
const fundTypes: ('min' | 'full')[] = ['min', 'full'];

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

const ComparisonCards: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-4 overflow-x-auto pb-4">
      {packages.map(pkg => (
        <div key={pkg} className="flex-shrink-0 w-full  bg-[#1c3625]/80 rounded-2xl border border-white/10 p-4 min-w-[320px]">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-xs text-white/80">MINIMUM FUNDRAISE</span>
            <span className="font-semibold text-xs text-white/80">FULL FUNDRAISE</span>
          </div>
          <div className="divide-y divide-white/10">
            {nftComparisonFeatures.map((feature, idx) => (
              <div
                key={feature.label}
                className="grid grid-cols-2 items-center justify-items-center py-3 border-b border-white/10 last:border-b-0 text-center"
              >
                {(['min', 'full'] as const).map(fund => {
                  const val = feature.values[pkg]?.[fund];
                  return (
                    <span
                      key={fund}
                      className="flex flex-col items-center justify-center text-center w-full h-full"
                    >
                      {val === true ? <CheckIcon /> : val === false ? <EmptyCheckIcon /> :
                        <span className="text-center w-full">{val}</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComparisonCards; 