import React from 'react';
import '../styles/SubLoader.css';

interface SubLoaderProps {
  isLoading: boolean;
}

const SubLoader: React.FC<SubLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 sub-loader-backdrop z-40 flex items-center justify-center">
      <div className="relative w-24 h-24">
        <img 
          src="/assets/loader-logo.svg" 
          alt="Loading..." 
          className="sub-loader-image"
        />
      </div>
    </div>
  );
};

export default SubLoader; 