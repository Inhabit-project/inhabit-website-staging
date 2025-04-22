import React from 'react';

const Highlight = () => {
  return (
    <div className="relative w-full min-h-screen bg-secondary flex items-center justify-center overflow-hidden">
      <div className="absolute mt-[12rem] opacity-30">
        <img
          src="/assets/topographic-map.svg"
          alt="Topographic Map"
          className="w-full h-full object-cover align-center"
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <p className="eyebrow text-light mb-5">
          WHAT ARE NFTS
        </p>
        <h2 className="text-light">
          Stewardship NFTs are blockchain-verified contracts that give fractional rights to protect ecosystems on tokenized plots of land.
        </h2>
      </div>
      
      {/* Location Markers */}
      <div className="absolute top-10 right-10 text-green-soft">
        <LocationMarker coordinates="19° 25′ 42″ N; 99° 7′ 39″ O" />
      </div>
      <div className="absolute bottom-48 right-48 text-green-soft">
        <LocationMarker coordinates="19° 25′ 42″ N; 99° 7′ 39″ O" />
      </div>
      <div className="absolute bottom-40 left-32 text-green-soft">
        <LocationMarker coordinates="19° 25′ 42″ N; 99° 7′ 39″ O" />
      </div>
      <div className="absolute top-56 left-[25%] text-green-soft">
        <LocationMarker coordinates="19° 25′ 42″ N; 99° 7′ 39″ O" />
      </div>
    </div>
  );
};

const LocationMarker = ({ coordinates }: { coordinates: string }) => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2 mb-1">
        <div className="relative">
          <div className="w-4 h-4 rounded-full border border-green-soft" />
          <div className="w-2 h-2 rounded-full bg-green-soft absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="eyebrow text-green-soft">
          NOMBRE DEL LUGAR
        </div>
      </div>
      <div className="eyebrow text-green-soft">
        {coordinates}
      </div>
    </div>
  );
};

export default Highlight; 