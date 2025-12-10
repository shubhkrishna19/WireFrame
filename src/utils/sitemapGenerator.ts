/**
 * Dynamic sitemap generator
 * Generates sitemap.xml content based on current products and pages
 */

import * as dataStore from '../store/dataStore';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = 'https://srcry.in'; // Update with your actual domain

/**
 * Generate sitemap XML content
 */
/**
 * Generate sitemap XML content
 */
export async function generateSitemap(): Promise<string> {
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${BASE_URL}/`,
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  });

  urls.push({
    loc: `${BASE_URL}/products`,
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  });

  urls.push({
    loc: `${BASE_URL}/privacy-policy`,
    changefreq: 'monthly',
    priority: 0.3,
  });

  urls.push({
    loc: `${BASE_URL}/terms-of-service`,
    changefreq: 'monthly',
    priority: 0.3,
  });

  urls.push({
    loc: `${BASE_URL}/returns-policy`,
    changefreq: 'monthly',
    priority: 0.3,
  });

  urls.push({
    loc: `${BASE_URL}/shipping-policy`,
    changefreq: 'monthly',
    priority: 0.3,
  });

  urls.push({
    loc: `${BASE_URL}/contact-us`,
    changefreq: 'monthly',
    priority: 0.5,
  });

  // Product pages
  const products = await dataStore.getProducts({ priceMin: 0, priceMax: 100000 });
  products.forEach((product) => {
    if (product.isActive) {
      urls.push({
        loc: `${BASE_URL}/products/${product.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
      .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
      )
      .join('\n')}
</urlset>`;

  return xml;
}

/**
 * Get sitemap as JSON for API endpoints
 */
export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${BASE_URL}/`,
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  });

  urls.push({
    loc: `${BASE_URL}/products`,
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  });

  // Product pages
  const products = await dataStore.getProducts({ priceMin: 0, priceMax: 100000 });
  products.forEach((product) => {
    if (product.isActive) {
      urls.push({
        loc: `${BASE_URL}/products/${product.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  });

  return urls;
}

