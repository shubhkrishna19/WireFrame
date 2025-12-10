/**
 * SEO Meta Tags Configuration
 * Centralized meta descriptions and SEO settings for all pages
 */

export interface PageMeta {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
}

export const siteMetadata = {
    siteName: 'Bluewud',
    siteUrl: 'https://bluewud.com',
    defaultOgImage: '/og-image.jpg',
    twitterHandle: '@bluewud',
    companyName: 'Bluewud Furniture Pvt. Ltd.',
};

/**
 * Page-specific meta configurations
 */
export const pageMetadata: Record<string, PageMeta> = {
    home: {
        title: 'Bluewud - Premium Furniture for Modern Living',
        description: 'Discover India\'s finest engineered wood furniture. From space-saving wardrobes to elegant TV units, we craft premium pieces designed for modern homes with timeless style and quality.',
        keywords: ['furniture', 'engineered wood', 'wardrobes', 'TV units', 'home furniture', 'modern furniture', 'India'],
    },

    products: {
        title: 'Shop Furniture | Bluewud',
        description: 'Browse our complete furniture collection. High-quality engineered wood furniture including wardrobes, beds, TV units, study tables, and more. Free shipping across India.',
        keywords: ['buy furniture', 'furniture catalog', 'home furniture', 'bedroom furniture', 'living room furniture'],
    },

    cart: {
        title: 'Shopping Cart | Bluewud',
        description: 'Review your furniture selections and proceed to checkout. Secure payment, free shipping, and easy returns on all orders.',
        keywords: ['shopping cart', 'furniture cart', 'checkout'],
    },

    checkout: {
        title: 'Checkout | Bluewud',
        description: 'Complete your furniture purchase securely. Multiple payment options, free shipping across India, and flexible delivery schedules available.',
        keywords: ['checkout', 'buy furniture', 'secure payment'],
    },

    wishlist: {
        title: 'My Wishlist | Bluewud',
        description: 'Save your favorite furniture pieces for later. Create and manage your wishlist to plan your perfect home setup.',
        keywords: ['wishlist', 'saved items', 'favorites'],
    },

    profile: {
        title: 'My Account | Bluewud',
        description: 'Manage your Bluewud account, track orders, update addresses, and view your order history.',
        keywords: ['account', 'profile', 'my orders'],
    },

    login: {
        title: 'Login | Bluewud',
        description: 'Sign in to your Bluewud account to track orders, save favorites, and enjoy a personalized shopping experience.',
        keywords: ['login', 'sign in', 'account access'],
    },

    register: {
        title: 'Create Account | Bluewud',
        description: 'Join Bluewud to unlock exclusive deals, faster checkout, order tracking, and personalized furniture recommendations.',
        keywords: ['register', 'sign up', 'create account', 'new account'],
    },

    about: {
        title: 'About Us | Bluewud',
        description: 'Learn about Bluewud\'s journey in crafting premium engineered wood furniture. Founded in 2015, we\'re committed to quality, innovation, and sustainable design.',
        keywords: ['about bluewud', 'our story', 'furniture company', 'Indian furniture', 'engineered wood'],
    },

    contact: {
        title: 'Contact Us | Bluewud',
        description: 'Get in touch with Bluewud. Customer support available Mon-Sat 9AM-6PM. Email support@bluewud.com or call our toll-free number.',
        keywords: ['contact', 'customer support', 'help', 'inquiry'],
    },

    faq: {
        title: 'Frequently Asked Questions | Bluewud',
        description: 'Find answers to common questions about our furniture, shipping, assembly, returns, and more. Quick help for Bluewud customers.',
        keywords: ['FAQ', 'help', 'questions', 'customer service', 'furniture questions'],
    },

    shipping: {
        title: 'Shipping Policy | Bluewud',
        description: 'Free shipping across India. Learn about our delivery process, shipping timelines, tracking, and what to expect when your furniture arrives.',
        keywords: ['shipping', 'delivery', 'free shipping', 'furniture delivery'],
    },

    returns: {
        title: 'Returns & Refunds Policy | Bluewud',
        description: '30-day return policy on all furniture. Hassle-free returns and refunds. Learn about our return process, conditions, and how to initiate a return.',
        keywords: ['returns', 'refunds', 'return policy', 'money back'],
    },

    privacy: {
        title: 'Privacy Policy | Bluewud',
        description: 'How we collect, use, and protect your personal information. Read our comprehensive privacy policy and data protection practices.',
        keywords: ['privacy', 'data protection', 'privacy policy', 'personal information'],
    },

    terms: {
        title: 'Terms of Service | Bluewud',
        description: 'Terms and conditions for using Bluewud services. User agreements, warranties, limitations, and legal information.',
        keywords: ['terms', 'conditions', 'terms of service', 'user agreement'],
    },

    sizeGuide: {
        title: 'Furniture Size Guide | Bluewud',
        description: 'Comprehensive furniture sizing guide. Find the perfect fit for your space with detailed dimensions for beds, wardrobes, tables, and more.',
        keywords: ['size guide', 'furniture dimensions', 'measurements', 'sizing'],
    },

    lookbook: {
        title: 'Furniture Lookbook | Bluewud',
        description: 'Get inspired by our curated furniture collections. See how Bluewud pieces transform real homes with style and functionality.',
        keywords: ['lookbook', 'inspiration', 'furniture ideas', 'home decor'],
    },

    productComparison: {
        title: 'Compare Products | Bluewud',
        description: 'Compare furniture specifications, prices, and features side-by-side. Make informed decisions for your perfect home setup.',
        keywords: ['compare', 'comparison', 'furniture comparison', 'product comparison'],
    },

    orderConfirmation: {
        title: 'Order Confirmation | Bluewud',
        description: 'Your furniture order has been confirmed. Check your email for order details and tracking information.',
        keywords: ['order confirmation', 'order success', 'purchase confirmation'],
    },

    notFound: {
        title: 'Page Not Found | Bluewud',
        description: 'The page you\'re looking for doesn\'t exist. Browse our furniture collection or return to the homepage.',
        keywords: ['404', 'not found', 'page not found'],
    },

    admin: {
        title: 'Admin Dashboard | Bluewud',
        description: 'Bluewud admin panel for managing products, orders, customers, and site content.',
        keywords: ['admin', 'dashboard', 'management'],
    },

    adminDashboard: {
        title: 'Admin Dashboard | Bluewud',
        description: 'Bluewud admin panel for managing products, orders, customers, and site content.',
        keywords: ['admin', 'dashboard', 'management'],
    },
};

/**
 * Generate category-specific meta tags
 */
export const getCategoryMeta = (categoryName: string, productCount?: number): PageMeta => {
    const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    const count = productCount ? ` - ${productCount} Products` : '';

    return {
        title: `${capitalized} Furniture${count} | Bluewud`,
        description: `Shop premium ${categoryName.toLowerCase()} furniture from Bluewud. Quality engineered wood pieces designed for modern living. Free shipping across India.`,
        keywords: [`${categoryName.toLowerCase()} furniture`, categoryName.toLowerCase(), 'buy furniture', 'engineered wood'],
    };
};

/**
 * Generate product-specific meta tags
 */
export const getProductMeta = (productName: string, description?: string, price?: number): PageMeta => {
    const priceText = price ? ` - ₹${price.toLocaleString('en-IN')}` : '';

    return {
        title: `${productName}${priceText} | Bluewud`,
        description: description || `Buy ${productName} from Bluewud. Premium engineered wood furniture with free shipping across India. Easy assembly and 1-year warranty.`,
        keywords: [productName.toLowerCase(), 'buy furniture', 'furniture online', 'Bluewud'],
    };
};

/**
 * Get default meta tags
 */
export const getDefaultMeta = (): PageMeta => {
    return pageMetadata.home;
};
