import React, { useState } from 'react';
import { Right } from 'src/models/right.model';

type Props = {
  rights: Right[];
};

export default function MobileRightsAccordion({ rights }: Props): JSX.Element {
  const [expandedRight, setExpandedRight] = useState<string | null>(null);

  // Helper function to render values
  const renderCellValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block"
        >
          <rect
            width="20"
            height="20"
            rx="4"
            fill="#D57300"
          />
          <path
            d="M6 10.5L9 13.5L14 8.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block"
        >
          <rect
            width="20"
            height="20"
            rx="4"
            fill="none"
            stroke="#D57300"
            strokeWidth="1"
          />
        </svg>
      );
    }

    // For strings, render as text or special badge
    if (value === "Basic level contents" || value === "Medium level contents") {
      return (
        <span className="inline-block px-2 py-1 bg-[#D57300] text-white font-bold text-xs rounded">
          {value}
        </span>
      );
    }

    return <span className="text-sm font-medium text-secondary">{value}</span>;
  };

  const toggleRight = (rightType: string) => {
    setExpandedRight(expandedRight === rightType ? null : rightType);
  };

  return (
    <div className="block md:hidden w-full space-y-4">
      {rights.map((right, rightIndex) => {
        const isExpanded = expandedRight === right.type;

        return (
          <div key={rightIndex} className="bg-[#E2EDD3] rounded-2xl border border-green-soft overflow-hidden shadow-md">
            {/* Right Type Header */}
            <button
              onClick={() => toggleRight(right.type)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#DDEAB3] transition-colors"
            >
              <h3 className="font-montserrat font-bold text-secondary text-base text-left uppercase tracking-wide">
                {right.type}
              </h3>
              <svg
                className={`w-5 h-5 text-secondary transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Right Details Content */}
            {isExpanded && (
              <div className="border-t border-green-soft">
                {right.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="p-4 border-b border-green-soft last:border-b-0">
                    {/* Detail Title and Description */}
                    <div className="mb-4">
                      <h4 className="font-bold text-secondary text-sm mb-2">
                        {detail.title}
                      </h4>
                      {detail.description && (
                        <p className="text-secondary/80 text-xs leading-relaxed">
                          {detail.description}
                        </p>
                      )}
                    </div>

                    {/* Min/Full Fundraise Values */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/50 rounded-lg p-3 border border-green-soft/30">
                        <div className="text-center">
                          <h5 className="font-montserrat font-bold text-secondary text-xs mb-2 uppercase tracking-wide">
                            Minimum Fundraise
                          </h5>
                          <div className="flex items-center justify-center">
                            {renderCellValue(detail.minimum_fundraise)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 rounded-lg p-3 border border-green-soft/30">
                        <div className="text-center">
                          <h5 className="font-montserrat font-bold text-secondary text-xs mb-2 uppercase tracking-wide">
                            Full Fundraise
                          </h5>
                          <div className="flex items-center justify-center">
                            {renderCellValue(detail.full_fundraise)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 