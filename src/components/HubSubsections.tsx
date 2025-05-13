import React from 'react';
import DownloadButton from './DownloadButton';

interface HubSubsectionsProps {
  backgroundImage: string;
  mapImage: string;
  label: string;
  title: string;
  description: string;
  visionHeading: string;
  visionText: string;
  onDownload?: () => void;
}

const HubSubsections: React.FC<HubSubsectionsProps> = ({
  backgroundImage,
  mapImage,
  label,
  title,
  description,
  visionHeading,
  visionText,
  onDownload,
}) => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full z-0 transition-all duration-700">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-700 opacity-100"
          style={{ transition: 'opacity 0.7s' }}
        />
      </div>
      {/* Overlay for darkening if needed */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      {/* Main content wrapper for left alignment and vertical centering */}
      <div className="container relative z-20 flex w-full max-w-5xl items-center justify-start ">
        {/* Download button */}
        <div className="absolute top-0 right-16 z-30">
          <DownloadButton onClick={onDownload} />
        </div>
        {/* Card */}
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-[30px] rounded-2xl border border-white/20 shadow-xl flex flex-col p-8 gap-2">
          {/* Map image */}
          <img src={mapImage} alt="Map" className="w-full h-40 object-cover rounded-lg mb-4" />
          <span className="text-light text-sm font-nunito opacity-80 ">{label}</span>
          <h5 className="text-xl font-montserrat text-light font-semibold">{title}</h5>
          <p className="text-light body-M font-nunito mb-4">{description}</p>
          <h6 className="text-lg font-montserrat text-light font-semibold ">{visionHeading}</h6>
          <p className="text-light text-base font-nunito opacity-90">{visionText}</p>
        </div>
      </div>
    </section>
  );
};

export default HubSubsections; 