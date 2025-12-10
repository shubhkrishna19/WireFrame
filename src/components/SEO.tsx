import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  product?: {
    name: string;
    price: string;
    currency: string;
    availability: 'in stock' | 'out of stock';
    brand?: string;
  };
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Bluewud - Premium Furniture for Modern Living',
  description = 'Discover premium quality engineered wood furniture. Space-saving wardrobes, elegant TV units, and modern furniture designed for Indian homes with timeless style.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  noindex = false,
  product,
}) => {
  const siteName = 'Bluewud';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');

    // Handle noindex
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      // Remove noindex if it exists
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content')?.includes('noindex')) {
        robotsMeta.remove();
      }
    }

    // Open Graph tags
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', siteName, true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', currentUrl);
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Structured data
    const structuredData: any[] = [];

    // Organization data
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: typeof window !== 'undefined' ? window.location.origin : '',
      logo: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '',
    });

    // Product data
    if (product && type === 'product') {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: image,
        description: description,
        brand: {
          '@type': 'Brand',
          name: product.brand || siteName,
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency,
          availability: `https://schema.org/${product.availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
        },
      });
    }

    // Add structured data scripts
    structuredData.forEach((data, index) => {
      let script = document.getElementById(`structured-data-${index}`) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = `structured-data-${index}`;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    });
  }, [fullTitle, description, image, currentUrl, type, product, siteName]);

  return null; // This component doesn't render anything
};
