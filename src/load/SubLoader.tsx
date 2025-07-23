import React from 'react';
import './SubLoader.css';

interface SubLoaderProps {
  isLoading: boolean;
}

const SubLoader: React.FC<SubLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 w-full h-full sub-loader-backdrop z-40 flex items-center justify-center">
      <div className="relative w-24 h-24">
        <img 
          src="/assets/loader-logo.svg" 
          alt="Loading..." 
          className="sub-loader-image"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default SubLoader; 