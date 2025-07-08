import React from 'react';
import { nftComparisonFeatures } from './nftComparisonData';

const ComparisonFeatureList: React.FC = () => {
  let lastCategory = '';
  return (
    <div className="mb-8">
      {nftComparisonFeatures.map((feature, idx) => {
        const showCategory = feature.category !== lastCategory;
        lastCategory = feature.category;
        return (
          <div key={feature.label} className="mb-2">
            {showCategory && (
              <div className="bg-white/10 py-2 px-2 rounded font-bold text-base text-white uppercase tracking-wide mb-1">
                {feature.category}
              </div>
            )}
            <div className="bg-[#232323]/80 rounded p-3 border border-white/10 mb-2">
              <div className="font-bold text-white text-sm mb-1">
                {feature.label.includes('MAP HERE') ? (
                  <span dangerouslySetInnerHTML={{
                    __html: feature.label.replace(
                      'MAP HERE',
                      '<a href="#" class="text-blue-400 underline">MAP HERE</a>'
                    )
                  }} />
                ) : feature.label}
              </div>
              {feature.description && (
                <div className="text-white/80 text-xs">
                  {feature.description.includes('MAP HERE') ? (
                    <span dangerouslySetInnerHTML={{
                      __html: feature.description.replace(
                        'MAP HERE',
                        '<a href="#" class="text-blue-400 underline">MAP HERE</a>'
                      )
                    }} />
                  ) : feature.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComparisonFeatureList; 