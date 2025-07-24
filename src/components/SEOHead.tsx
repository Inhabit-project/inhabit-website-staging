import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generatePageSEO, generateHreflangLinks, optimizeMetaDescription } from '@/utils/seoHelpers';

interface SEOHeadProps {
  pageType: string;
  customData?: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string;
    publishedDate?: string;
    modifiedDate?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({ pageType, customData }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const currentPath = location.pathname;
  const currentLanguage = i18n.language || 'en';
  
  // Generate comprehensive SEO data
  const seoData = generatePageSEO(pageType, t, {
    ...customData,
    path: currentPath,
  });

  // Generate hreflang links
  const hreflangLinks = generateHreflangLinks(currentPath);

  // Optimize meta description
  const optimizedDescription = optimizeMetaDescription(seoData.description);

  // Handle robots meta tag
  const robotsContent = customData?.noIndex || customData?.noFollow 
    ? `${customData?.noIndex ? 'noindex' : 'index'}, ${customData?.noFollow ? 'nofollow' : 'follow'}`
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content="INHABIT" />
      <meta name="language" content={currentLanguage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoData.canonical} />
      
      {/* Hreflang Links */}
      {hreflangLinks.map((link, index) => (
        <link key={index} rel={link.rel} hrefLang={link.hreflang} href={link.href} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoData.openGraph.title} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={seoData.openGraph.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoData.title} />
      <meta property="og:url" content={seoData.openGraph.url} />
      <meta property="og:type" content={seoData.openGraph.type} />
      <meta property="og:site_name" content={seoData.openGraph.siteName} />
      <meta property="og:locale" content={currentLanguage === 'es' ? 'es_ES' : 'en_US'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seoData.twitter.card} />
      <meta name="twitter:title" content={seoData.twitter.title} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={seoData.twitter.image} />
      <meta name="twitter:image:alt" content={seoData.title} />
      {seoData.twitter.site && <meta name="twitter:site" content={seoData.twitter.site} />}
      
      {/* Article-specific meta tags */}
      {customData?.publishedDate && (
        <meta property="article:published_time" content={customData.publishedDate} />
      )}
      {customData?.modifiedDate && (
        <meta property="article:modified_time" content={customData.modifiedDate} />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(seoData.structuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead; 