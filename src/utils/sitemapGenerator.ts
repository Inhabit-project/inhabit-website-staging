import { SITE_CONFIG } from './seoHelpers';

interface SitemapURL {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

// Define all website URLs with their SEO properties
export const SITE_URLS: SitemapURL[] = [
  // Main pages - highest priority
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.9, changefreq: 'monthly' },
  { path: '/hubs', priority: 0.9, changefreq: 'weekly' },
  { path: '/stewardship-nft', priority: 0.9, changefreq: 'weekly' },
  { path: '/projects', priority: 0.8, changefreq: 'weekly' },
  
  // Hub pages
  { path: '/hubs/nuiyanzhi', priority: 0.8, changefreq: 'weekly' },
  { path: '/hubs/agua-de-luna', priority: 0.8, changefreq: 'weekly' },
  { path: '/hubs/tierrakilwa', priority: 0.8, changefreq: 'weekly' },
  
  // Secondary pages
  { path: '/blog', priority: 0.7, changefreq: 'daily' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  
  // Legal pages - lower priority but still indexed
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
];

// Generate sitemap XML
export const generateSitemap = (urls: SitemapURL[] = SITE_URLS): string => {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const urlElements = urls.map(url => {
    const lastmod = url.lastmod || currentDate;
    return `  <url>
    <loc>${SITE_CONFIG.domain}${url.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Block staging/development URLs if needed
# Disallow: /dev/
# Disallow: /staging/

# Important pages
Allow: /
Allow: /about
Allow: /hubs
Allow: /projects
Allow: /stewardship-nft
Allow: /blog
Allow: /contact

# Sitemap location
Sitemap: ${SITE_CONFIG.domain}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
};

// Function to save sitemap (for build-time generation)
export const saveSitemap = (outputPath: string = 'public/sitemap.xml'): void => {
  const sitemapContent = generateSitemap();
  
  // This would typically be used in a build script
  if (typeof window === 'undefined') {
    // Node.js environment
    const fs = require('fs');
    const path = require('path');
    
    try {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, sitemapContent, 'utf8');
      console.log(`✅ Sitemap generated at ${outputPath}`);
    } catch (error) {
      console.error('❌ Error generating sitemap:', error);
    }
  }
}; 