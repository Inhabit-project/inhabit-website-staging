import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface TierraKilwaPageProps {
  onPageReady?: () => void;
}

const TierraKilwaPage: React.FC<TierraKilwaPageProps> = ({ onPageReady }) => {
  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Helmet>
        <title>TierraKilwa Hub | INHABIT</title>
        <meta name="description" content="Details about the TierraKilwa Hub." />
        <meta property="og:title" content="TierraKilwa Hub | INHABIT" />
        <meta property="og:description" content="Details about the TierraKilwa Hub." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <h1>TierraKilwa Hub Details Page</h1>
    </div>
  );
};

export default TierraKilwaPage; 