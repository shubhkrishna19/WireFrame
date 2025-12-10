// Mock data for the e-commerce application  
// BLUEWUD FURNITURE CATALOG - Real product data from SKU database

// Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: string[];
  thumbnail: string;
  sizes: string[];
  colors: string[];
  color?: string;
  stock: number;
  sku: string;
  parentSku?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  fitType?: string; // For legacy compatibility
  colorImages?: Record<string, string[]>; // color -> array of image URLs
  customBottomText?: string;
  customStockText?: string;
  displayTags?: string[];
  showDiscount?: boolean;
  discountDisplayText?: string;
  material?: string;
  finish?: string;
  dimensions?: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
  };
  weight?: number | null;
  specifications?: {
    fabric?: string;
    fabricComposition?: string;
    gsm?: number;
    weight?: string | null;
    fit?: string;
    pattern?: string;
    sleeveLength?: string;
    neckType?: string;
    collarType?: string;
    closure?: string;
    pockets?: string;
    lining?: string;
    innerMaterial?: string;
    careInstructions?: string[];
    care?: string[];
    countryOfOrigin?: string;
    season?: string;
    occasion?: string;
    material?: string;
    finish?: string;
    style?: string;
    room?: string;
    assembly?: string;
    warranty?: string;
    breathable?: boolean;
    stretchable?: boolean;
    wrinkleFree?: boolean;
    waterResistant?: boolean;
    dimensions?: {
      length?: string | number | null;
      width?: string | number | null;
      height?: string | number | null;
    } | null;
    color?: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  displayOrder?: number;
  isActive: boolean;
  subcategories?: { name: string; slug: string }[];
}

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'editor';
  avatar?: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UserAddress {
  _id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase?: boolean;
  helpfulCount: number;
  createdAt: number;
  updatedAt: number;
}

export type UserRole = 'customer' | 'admin' | 'editor';

export interface RolePermissions {
  canViewProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canViewOrders: boolean;
  canEditOrders: boolean;
  canViewUsers: boolean;
  canEditUsers: boolean;
}

// Mock Categories - Bluewud Furniture
export const mockCategories: Category[] = [
  {
    _id: 'living-room',
    name: 'Living Room',
    slug: 'living-room',
    description: 'TV Units, Coffee Tables, and Living Room Essentials',
    icon: '🛋️',
    image: '/images/products/Coffee Tables/Leo/CT-LE-L pic1.jpg',
    isActive: true,
    subcategories: [
      { name: 'TV Units', slug: 'tv-units' },
      { name: 'Coffee Tables', slug: 'coffee-tables' },
      { name: 'Shoe Racks', slug: 'shoe-racks' },
    ]
  },
  {
    _id: 'bedroom',
    name: 'Bedroom',
    slug: 'bedroom',
    description: 'Beds, Wardrobes, Dressing Tables, and Bedside Tables',
    icon: '🛏️',
    image: '/images/products/Beds/Pollo/B-POL-KT Pic1.jpg',
    isActive: true,
    subcategories: [
      { name: 'Beds', slug: 'beds' },
      { name: 'Wardrobes', slug: 'wardrobes' },
      { name: 'Bedside Tables', slug: 'bedside-tables' },
      { name: 'Dressing Tables', slug: 'dressing-tables' },
    ]
  },
  {
    _id: 'study-office',
    name: 'Study & Office',
    slug: 'study-office',
    description: 'Study Tables, Book Shelves, and Office Furniture',
    icon: '📚',
    image: '/images/products/Book Shelves/alex/1.jpg',
    isActive: true,
    subcategories: [
      { name: 'Study Tables', slug: 'study-tables' },
      { name: 'Book Shelves', slug: 'book-shelves' },
      { name: 'Laptop Tables', slug: 'laptop-tables' },
    ]
  },
  {
    _id: 'dining-kitchen',
    name: 'Dining & Kitchen',
    slug: 'dining-kitchen',
    description: 'Dining Tables, Kitchen Racks, and Storage',
    icon: '🍽️',
    image: '/images/products/Dining Tables/Hemming/DT-HE-4L Pic1.jpg',
    isActive: true,
    subcategories: [
      { name: 'Dining Tables', slug: 'dining-tables' },
      { name: 'Kitchen Racks', slug: 'kitchen-racks' },
    ]
  },
  {
    _id: 'decor',
    name: 'Decor & Storage',
    slug: 'decor',
    description: 'Wall Shelves, Key Holders, Coasters, and Home Decor',
    icon: '🏠',
    image: '/images/products/Keyholders/Amadour/KH-AM-W Pic1.jpg',
    isActive: true,
    subcategories: [
      { name: 'Key Holders', slug: 'key-holders' },
      { name: 'Coasters', slug: 'coasters' },
      { name: 'Wall Shelves', slug: 'wall-shelves' },
    ]
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    _id: 'user-customer',
    email: 'customer@bluewud.com',
    password: 'password123',
    name: 'Rahul Sharma',
    phone: '+919876543210',
    role: 'customer',
    emailVerified: true,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    _id: 'user-admin',
    email: 'admin@bluewud.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+919876543211',
    role: 'admin',
    emailVerified: true,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

// Import real Bluewud furniture products (387 products with real data)
import bluewudProductsData from './bluewudProducts.json';

// Merge Bluewud products with required Product interface fields
export const mockProducts: Product[] = (bluewudProductsData as any[]).map(p => ({
  ...p,
  sizes: p.sizes || ['Standard'],
  colors: p.colors || [p.color || 'Natural Wood'],
  createdAt: Date.now() - 86400000 * 30,
  updatedAt: Date.now(),
}));

// Mock Reviews for products
export const mockReviews: Review[] = [
  {
    _id: 'review-1',
    productId: 'prod-1',
    userId: 'user-customer',
    userName: 'Rahul S.',
    rating: 5,
    title: 'Excellent quality!',
    comment: 'The furniture is exactly as shown in the pictures. Assembly was easy and the finish is premium. Very happy with my purchase!',
    verifiedPurchase: true,
    helpfulCount: 24,
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 10,
  },
  {
    _id: 'review-2',
    productId: 'prod-1',
    userId: 'user-2',
    userName: 'Priya M.',
    rating: 4,
    title: 'Good value for money',
    comment: 'Solid construction and nice design. Took a bit longer to assemble but the end result is great.',
    verifiedPurchase: true,
    helpfulCount: 15,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 15,
  },
  {
    _id: 'review-3',
    productId: 'prod-2',
    userId: 'user-3',
    userName: 'Amit K.',
    rating: 5,
    title: 'Perfect for my room',
    comment: 'Matches perfectly with my room decor. The quality of engineered wood is excellent. Delivery was on time.',
    verifiedPurchase: true,
    helpfulCount: 32,
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 8,
  },
];

// Role permissions
export const rolePermissions: Record<UserRole, RolePermissions> = {
  customer: {
    canViewProducts: true,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewOrders: true,
    canEditOrders: false,
    canViewUsers: false,
    canEditUsers: false,
  },
  editor: {
    canViewProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canViewOrders: true,
    canEditOrders: true,
    canViewUsers: false,
    canEditUsers: false,
  },
  admin: {
    canViewProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewOrders: true,
    canEditOrders: true,
    canViewUsers: true,
    canEditUsers: true,
  },
};
