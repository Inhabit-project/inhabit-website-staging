import React from 'react';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

const Highlight = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full min-h-screen background-gradient-dark flex items-center justify-center overflow-hidden">
      <div className="absolute opacity-20 invert">
        <ReactSVG src="/assets/topographic-map.svg" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <p className="eyebrow text-light mb-5">
          {t('mainPage.highlight.title')}
        </p>
        <h3 className="text-light" dangerouslySetInnerHTML={{ __html: t('mainPage.highlight.description') }} />
      </div>
      
      {/* Location Markers */}
      <div className="absolute bottom-48 right-48 text-green-soft">
        <LocationMarker name="Ñuiyanzhi" coordinates="11° 15′ 49″ N; 73° 53′ 28″ W" />
      </div>
      <div className="absolute bottom-40 left-32 text-green-soft">
        <LocationMarker name="Agua de Luna" coordinates="11° 11′ 15″ N; 73° 28′ 58″ W" />
      </div>
      <div className="absolute top-56 left-[25%] text-green-soft">
        <LocationMarker name="Tierra Kilwa" coordinates="11° 14′ 48″ N; 73° 32′ 51″ W" />
      </div>
    </div>
  );
};

const LocationMarker = ({ name, coordinates }: { name: string, coordinates: string }) => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 mb-1">
        <div className="relative">
          <div className="w-4 h-4 rounded-full border border-green-soft" />
          <div className="w-2 h-2 rounded-full bg-green-soft absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="eyebrow text-green-soft">
          {name}
        </div>
      </div>
      <div className="eyebrow text-green-soft">
        {coordinates}
      </div>
    </div>
  );
};

export default Highlight; 