import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface AguaDeLunaPageProps {
  onPageReady?: () => void;
}

const AguaDeLunaPage: React.FC<AguaDeLunaPageProps> = ({ onPageReady }) => {
  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Helmet>
        <title>Agua de Luna | INHABIT</title>
        <meta name="description" content="Details about the Agua de Luna." />
        <meta property="og:title" content="Agua de Luna | INHABIT" />
        <meta property="og:description" content="Details about the Agua de Luna." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <h1>Agua de Luna Details Page</h1>
    </div>
  );
};

export default AguaDeLunaPage; 