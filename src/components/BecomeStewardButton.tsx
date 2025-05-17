import React from 'react';

const BecomeStewardButton: React.FC<{ onClick?: () => void; className?: string }> = ({ onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`btn-primary ${className}`}
  >
    Become a Steward for this Hub
    <svg
      className="ml-2"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 9H13.5M13.5 9L10.5 6M13.5 9L10.5 12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default BecomeStewardButton; 