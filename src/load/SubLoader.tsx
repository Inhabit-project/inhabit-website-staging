import React from 'react';
import './SubLoader.css';

interface SubLoaderProps {
  isLoading: boolean;
}

const SubLoader: React.FC<SubLoaderProps> = ({ isLoading }) => {
  // Disabled: Return null to eliminate the circular loader
  return null;
};

export default SubLoader; 