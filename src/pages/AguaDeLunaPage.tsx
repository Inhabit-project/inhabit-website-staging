import React, { useEffect } from 'react';

interface AguaDeLunaPageProps {
  onPageReady?: () => void;
}

const AguaDeLunaPage: React.FC<AguaDeLunaPageProps> = ({ onPageReady }) => {
  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Agua de Luna Hub Details Page</h1>
    </div>
  );
};

export default AguaDeLunaPage; 