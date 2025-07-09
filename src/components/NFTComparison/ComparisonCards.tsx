import React, { useState, useRef, useEffect } from 'react';
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
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  let lastCategory = '';
  // For sticky header/first column, you may want to add overflow-x-auto to the parent
  return (
    <div className="overflow-x-auto pb-4">
      {/* Header row */}
      <div className="flex bg-[#1a2b14] text-white font-bold text-base border-b border-white/10 min-w-fit">
        <div className="px-4 py-3 border-r border-white/10 bg-[#1c3625] sticky left-0 z-10" style={{ width: 'clamp(140px, 45vw, 220px)', minWidth: '140px', maxWidth: '220px' }}>
          <span className="md:hidden">&nbsp;</span>
          <span className="hidden md:inline" style={{ width: 320, minWidth: 320 }}> &nbsp; </span>
        </div>
        {packages.map(pkg => (
          <div key={pkg} className="flex flex-col flex-1 min-w-[220px] border-r border-white/10 last:border-r-0">
            <div className="text-center py-2 border-b border-white/10">{pkg}</div>
            <div className="flex">
              <div className="w-1/2 text-xs text-white/80 py-1 text-center border-r border-white/10">MINIMUM <br/> FUNDRAISE</div>
              <div className="w-1/2 text-xs text-white/80 py-1 text-center">FULL <br/> FUNDRAISE</div>
            </div>
          </div>
        ))}
      </div>
      {/* Feature rows */}
      <div className="flex">
        {/* Description/label column is already styled */}
        <div className="flex-1">
          {nftComparisonFeatures.map((feature, idx) => {
            const showCategory = feature.category !== lastCategory;
            lastCategory = feature.category;
            const hasDescription = !!feature.description;
            const isOpen = openIdx === idx;
            return (
              <React.Fragment key={feature.label}>
                {showCategory && (
                  <div className="flex bg-white/5 font-bold text-white uppercase tracking-wide border-b border-white/10">
                    <div className="w-full px-4 py-2">{feature.category}</div>
                  </div>
                )}
                <div className="flex border-b border-white/10">
                  {/* Description/label cell */}
                  <div className="px-4 py-3 border-r border-white/10 bg-[#1a2b14] flex flex-col justify-center sticky left-0 z-10" style={{ width: 'clamp(140px, 45vw, 220px)', minWidth: '140px', maxWidth: '220px' }}>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-white text-sm">
                        {feature.label.includes('MAP HERE') ? (
                          <span dangerouslySetInnerHTML={{
                            __html: feature.label.replace(
                              'MAP HERE',
                              '<a href=\"#\" class=\"text-blue-400 underline\">MAP HERE</a>'
                            )
                          }} />
                        ) : feature.label}
                      </span>
                      {hasDescription && (
                        <button
                          className="ml-1 mt-0.5 text-white/70 hover:text-white focus:outline-none"
                          aria-label={isOpen ? 'Hide description' : 'Show description'}
                          onClick={() => setOpenIdx(isOpen ? null : idx)}
                        >
                          <span className={`inline-block transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                        </button>
                      )}
                    </div>
                    {hasDescription && isOpen && feature.description && (
                      <div className="mt-1 text-white/80 text-xs bg-[#232323] rounded p-2 border border-white/10">
                        {feature.description && feature.description.includes('MAP HERE') ? (
                          <span dangerouslySetInnerHTML={{
                            __html: feature.description.replace(
                              'MAP HERE',
                              '<a href=\"#\" class=\"text-blue-400 underline\">MAP HERE</a>'
                            )
                          }} />
                        ) : feature.description}
                      </div>
                    )}
                  </div>
                  {/* Card value cells */}
                  <div className="flex flex-1">
                    {packages.map(pkg => (
                      <div key={pkg} className="flex flex-1 min-w-[220px] border-r border-white/10 last:border-r-0">
                        {(['min','full'] as const).map(fund => {
                          const val = feature.values[pkg]?.[fund];
                          return (
                            <div key={fund} className="w-1/2 flex items-center justify-center py-3">
                              {val === true ? <CheckIcon/> : val === false ? <EmptyCheckIcon/> :
                                <span className="font-semibold text-white text-sm">{val}</span>}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCards; 