import { TFunction } from 'i18next';

// Base domain configuration
export const SITE_CONFIG = {
  domain: 'https://inhabit.one',
  siteName: 'INHABIT',
  defaultTitle: 'INHABIT - Global Corridor of Biodiversity',
  defaultDescription: 'INHABIT protects vital ecosystems and drives rural innovation through community-led biocultural hubs',
  defaultImage: '/assets/hero.webp',
  twitterHandle: '@inhabit_one',
  defaultKeywords: 'biodiversity, ecosystem, conservation, NFT, stewardship, sustainability, biocultural hubs, regenerative, rural innovation',
};

// Generate canonical URL
export const getCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.domain}${cleanPath}`;
};

// Generate structured data for different page types
export const generateStructuredData = (type: 'website' | 'article' | 'organization', data: any) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'website':
      return {
        ...baseStructuredData,
        '@type': 'WebSite',
        name: SITE_CONFIG.siteName,
        url: SITE_CONFIG.domain,
        description: data.description || SITE_CONFIG.defaultDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'organization':
      return {
        ...baseStructuredData,
        '@type': 'Organization',
        name: SITE_CONFIG.siteName,
        url: SITE_CONFIG.domain,
        logo: `${SITE_CONFIG.domain}/logo.svg`,
        description: SITE_CONFIG.defaultDescription,
        sameAs: [
          // Add social media URLs here when available
        ],
      };

    case 'article':
      return {
        ...baseStructuredData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image ? `${SITE_CONFIG.domain}${data.image}` : `${SITE_CONFIG.domain}${SITE_CONFIG.defaultImage}`,
        author: {
          '@type': 'Organization',
          name: SITE_CONFIG.siteName,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.domain}/logo.svg`,
          },
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
      };

    default:
      return baseStructuredData;
  }
};

// Generate page-specific SEO data
export const generatePageSEO = (
  pageType: string,
  t: TFunction,
  customData?: {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    keywords?: string;
    publishedDate?: string;
    modifiedDate?: string;
  }
) => {
  const path = customData?.path || '/';
  const canonicalUrl = getCanonicalUrl(path);

  // Get translations with fallbacks
  const seoTitle = customData?.title || t(`${pageType}.seoTitle`) || SITE_CONFIG.defaultTitle;
  const seoDescription = customData?.description || t(`${pageType}.seoDescription`) || SITE_CONFIG.defaultDescription;
  const seoImage = customData?.image ? `${SITE_CONFIG.domain}${customData.image}` : `${SITE_CONFIG.domain}${SITE_CONFIG.defaultImage}`;
  const seoKeywords = customData?.keywords || t(`${pageType}.seoKeywords`) || SITE_CONFIG.defaultKeywords;

  return {
    title: seoTitle,
    description: seoDescription,
    canonical: canonicalUrl,
    image: seoImage,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      image: seoImage,
      url: canonicalUrl,
      type: pageType === 'article' ? 'article' : 'website',
      siteName: SITE_CONFIG.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      image: seoImage,
      site: SITE_CONFIG.twitterHandle,
    },
    structuredData: generateStructuredData(
      pageType === 'article' ? 'article' : 'website',
      {
        title: seoTitle,
        description: seoDescription,
        image: customData?.image,
        datePublished: customData?.publishedDate,
        dateModified: customData?.modifiedDate,
      }
    ),
  };
};

// Generate hreflang links for multilingual sites
export const generateHreflangLinks = (currentPath: string, supportedLocales: string[] = ['en', 'es']) => {
  return supportedLocales.map(locale => ({
    rel: 'alternate',
    hreflang: locale,
    href: locale === 'en' ? getCanonicalUrl(currentPath) : getCanonicalUrl(`/${locale}${currentPath}`),
  }));
};

// Validate and optimize meta description length
export const optimizeMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) return description;
  
  // Find the last complete sentence or word that fits
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.8) {
    return truncated.substring(0, lastPeriod + 1);
  } else if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}; 