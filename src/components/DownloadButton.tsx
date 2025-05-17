import React from 'react';

interface DownloadButtonProps {
  onClick?: () => void;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`btn-secondary ${className}`}
    >
      <div className="flex items-center gap-2 px-4">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2C5.23858 2 3 4.23858 3 7V9C3 11.7614 5.23858 14 8 14C10.7614 14 13 11.7614 13 9V7C13 4.23858 10.7614 2 8 2Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>download white paper</span>
      </div>
      <div className="flex items-center gap-2.5 px-4">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </button>
  );
};

export default DownloadButton; 