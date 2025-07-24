import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Site configuration
const SITE_CONFIG = {
  domain: 'https://inhabit.one',
  siteName: 'INHABIT',
};

// Define all website URLs with their SEO properties
const SITE_URLS = [
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
const generateSitemap = (urls = SITE_URLS) => {
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

// Generate and save sitemap
const outputPath = path.join(__dirname, '../public/sitemap.xml');
const sitemapContent = generateSitemap();

try {
  fs.writeFileSync(outputPath, sitemapContent, 'utf8');
  console.log(`✅ Sitemap generated successfully at ${outputPath}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
} 