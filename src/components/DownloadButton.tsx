import React from 'react';

interface DownloadButtonProps {
  onClick?: () => void;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-[#D57300]
        backdrop-blur-sm
        rounded-[65px]
        flex
        items-center
        px-4
        py-2
        text-[#F6FFEA]
        font-ibm-sans
        text-sm
        tracking-[0.02em]
        uppercase
        hover:bg-[#C16600]
        transition-colors
        duration-200
        ${className}
      `}
    >
      <div className="flex items-center gap-2 px-4">
        <img src="/icons/mouse-icon.svg" alt="Mouse" className="w-4 h-4" />
        <span>download white paper</span>
      </div>
      <div className="flex items-center gap-2.5 px-4">
        <img src="/icons/download-icon.svg" alt="Download" className="w-4 h-4" />
      </div>
    </button>
  );
};

export default DownloadButton; 