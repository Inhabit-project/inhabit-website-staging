import React, { useState, useMemo } from 'react';
import { Campaign } from '@/models/campaign.model';
import { Collection } from '@/models/collection.model';
import { RightType } from '@/models/right.model';

type FundLevel = "min" | "full";

interface Props {
  campaign: Campaign;
}

interface FeatureRow {
  category: RightType;
  label: string;
  description?: string;
  values: Record<string, Record<FundLevel, boolean | string>>;
}

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
      <rect width="20" height="20" rx="4" fill="none" stroke="#666" strokeWidth="1"/>
    </svg>
  );
}

export function MobileComparisonAccordion({ campaign }: Props): JSX.Element {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [openMapIdx, setOpenMapIdx] = useState<number | null>(null);

  const categoryOrder: RightType[] = [
    "LAND RIGHT",
    "GOVERNANCE RIGHT", 
    "ART RIGHT",
    "MONITORING RIGHT",
    "UTILITY RIGHTS",
    "EDUCATION RIGHT",
    "ASSET RIGHT",
  ];

  const packages = useMemo(
    () => campaign.collections.map((c) => c.symbol.toUpperCase()),
    [campaign]
  );

  const features: FeatureRow[] = useMemo(() => {
    const map = new Map<string, FeatureRow>();

    campaign.collections.forEach((col: Collection) => {
      const pkg = col.symbol.toUpperCase();

      col.rights.forEach((right: any) => {
        right.details.forEach((detail: any) => {
          const key = `${right.type}|${detail.title}`;

          if (!map.has(key)) {
            map.set(key, {
              category: right.type,
              label: detail.title,
              description: detail.description,
              values: {},
            });
          }

          map.get(key)!.values[pkg] = {
            min: detail.minimum_fundraise,
            full: detail.full_fundraise,
          };
        });
      });
    });

    const result = Array.from(map.values());
    result.sort(
      (a, b) =>
        categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );

    return result;
  }, [campaign]);

  // Group features by category
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, FeatureRow[]> = {};
    features.forEach((feature) => {
      if (!groups[feature.category]) {
        groups[feature.category] = [];
      }
      groups[feature.category].push(feature);
    });
    return groups;
  }, [features]);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const toggleMap = (idx: number) => {
    setOpenMapIdx(openMapIdx === idx ? null : idx);
  };

  return (
    <div className="w-full space-y-4">
      {categoryOrder.map((category) => {
        const categoryFeatures = groupedFeatures[category] || [];
        if (categoryFeatures.length === 0) return null;

        const isExpanded = expandedCategory === category;

        return (
          <div key={category} className="bg-[#1c3625]/80 rounded-2xl border border-white/10 overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold text-white text-sm uppercase tracking-wide text-left">
                {category}
              </h3>
              <svg
                className={`w-5 h-5 text-white transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Category Content */}
            {isExpanded && (
              <div className="divide-y divide-white/10">
                {categoryFeatures.map((feature, featureIdx) => (
                  <div key={feature.label} className="p-4">
                    {/* Feature Title and Description */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-white text-sm mb-2">
                        {feature.category === "MONITORING RIGHT" && feature.label.includes("MAP HERE") ? (
                          <>
                            Impact Monitoring access via{" "}
                            <button
                              onClick={() => toggleMap(featureIdx)}
                              className="text-blue-400 underline"
                            >
                              {openMapIdx === featureIdx ? "HIDE MAP" : "MAP HERE"}
                            </button>
                          </>
                        ) : (
                          feature.label
                        )}
                      </h4>
                      {feature.description && (
                        <p className="text-white/70 text-xs leading-relaxed">
                          {feature.description}
                        </p>
                      )}
                    </div>

                    {/* Membership Packages Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {packages.map((pkg) => (
                        <div key={pkg} className="bg-black/20 rounded-lg p-3 border border-white/10">
                          <div className="text-center mb-3">
                            <h5 className="font-bold text-white text-xs mb-1">{pkg}</h5>
                          </div>
                          
                          {/* Min/Full fundraise values */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-xs">Min:</span>
                              <div className="flex items-center">
                                {(() => {
                                  const val = feature.values[pkg]?.min;
                                  if (val === true) return <CheckIcon />;
                                  if (val === false || val === undefined) return <EmptyCheckIcon />;
                                  return <span className="text-white text-xs font-medium">{val}</span>;
                                })()}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-xs">Full:</span>
                              <div className="flex items-center">
                                {(() => {
                                  const val = feature.values[pkg]?.full;
                                  if (val === true) return <CheckIcon />;
                                  if (val === false || val === undefined) return <EmptyCheckIcon />;
                                  return <span className="text-white text-xs font-medium">{val}</span>;
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Map iframe for monitoring rights */}
                    {feature.category === "MONITORING RIGHT" && openMapIdx === featureIdx && (
                      <div className="mt-4">
                        <iframe
                          src="https://explorer.land/embed/project/bioculturalcorridor/site/Z6UXzL"
                          title="Ñuiyanzhi Monitoring Map"
                          className="w-full h-64 rounded-lg border-none"
                          style={{ background: 'white' }}
                        />
                      </div>
                    )}
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