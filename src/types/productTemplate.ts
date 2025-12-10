// Product Page Template System Types

export interface ProductPageSection {
  id: string;
  type: 'hero' | 'gallery' | 'info' | 'specs' | 'reviews' | 'related' | 'custom';
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface ProductPageTemplate {
  _id: string;
  name: string;
  description: string;
  isGlobal: boolean; // true = applies to all products, false = product-specific
  sections: ProductPageSection[];
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    spacing?: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface ProductCustomization {
  productId: string;
  templateId?: string; // If null, uses global template
  sections: ProductPageSection[]; // Override sections
  customFields?: Record<string, any>; // Product-specific custom data
  enabledSections?: string[]; // Which sections to show
  hiddenSections?: string[]; // Which sections to hide
}

