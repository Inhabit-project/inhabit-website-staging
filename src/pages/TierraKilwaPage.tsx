import React, { useEffect } from 'react';

interface TierraKilwaPageProps {
  onPageReady?: () => void;
}

const TierraKilwaPage: React.FC<TierraKilwaPageProps> = ({ onPageReady }) => {
  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>TierraKilwa Hub Details Page</h1>
    </div>
  );
};

export default TierraKilwaPage; 