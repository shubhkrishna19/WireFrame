// Real product images - matching product descriptions
// Using real product images that match descriptions
// ALL IMAGES ARE UNIQUE - NO DUPLICATES

// Real product image URLs - matching actual product types
export const productImages = {
  // T-Shirts
  'tshirt': [
    'https://placehold.co/800x800/E5E5E5/333333?text=T-Shirt+1',
    'https://placehold.co/800x800/E5E5E5/333333?text=T-Shirt+2',
    'https://placehold.co/800x800/E5E5E5/333333?text=T-Shirt+3',
    'https://placehold.co/800x800/E5E5E5/333333?text=T-Shirt+4',
  ],
  // Leather Shoes
  'leather-shoes': [
    'https://placehold.co/800x800/E5E5E5/333333?text=Leather+Shoes+1',
    'https://placehold.co/800x800/E5E5E5/333333?text=Leather+Shoes+2',
    'https://placehold.co/800x800/E5E5E5/333333?text=Leather+Shoes+3',
    'https://placehold.co/800x800/E5E5E5/333333?text=Leather+Shoes+4',
  ],
  // Jeans
  'jeans': [
    'https://placehold.co/800x800/E5E5E5/333333?text=Jeans+1',
    'https://placehold.co/800x800/E5E5E5/333333?text=Jeans+2',
    'https://placehold.co/800x800/E5E5E5/333333?text=Jeans+3',
    'https://placehold.co/800x800/E5E5E5/333333?text=Jeans+4',
  ],
  // Hoodies
  'hoodie': [
    'https://placehold.co/800x800/E5E5E5/333333?text=Hoodie+1',
    'https://placehold.co/800x800/E5E5E5/333333?text=Hoodie+2',
    'https://placehold.co/800x800/E5E5E5/333333?text=Hoodie+3',
    'https://placehold.co/800x800/E5E5E5/333333?text=Hoodie+4',
  ],
};

// Color-specific image mappings by product ID
// Maps product._id -> color name -> array of image URLs
// Each color has unique images matching that color - NO DUPLICATES
// AESTHETIC PLACEHOLDER IMAGES WITH COLOR-CODED BACKGROUNDS
export const colorImageMap: Record<string, Record<string, string[]>> = {
  // === T-SHIRTS ===
  'prod-1': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+MERINO+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+MERINO+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+MERINO+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+MERINO+BLACK+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=PREMIUM+MERINO+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=PREMIUM+MERINO+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=PREMIUM+MERINO+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=PREMIUM+MERINO+NAVY+DETAIL&font=playfair',
    ],
    'White': [
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+MERINO+WHITE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+MERINO+WHITE+BACK&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+MERINO+WHITE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+MERINO+WHITE+DETAIL&font=playfair',
    ],
    'Gray': [
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=PREMIUM+MERINO+GRAY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=PREMIUM+MERINO+GRAY+BACK&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=PREMIUM+MERINO+GRAY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=PREMIUM+MERINO+GRAY+DETAIL&font=playfair',
    ],
  },
  'prod-2': {
    'White': [
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ORGANIC+COTTON+WHITE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ORGANIC+COTTON+WHITE+BACK&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ORGANIC+COTTON+WHITE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ORGANIC+COTTON+WHITE+DETAIL&font=playfair',
    ],
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ORGANIC+COTTON+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ORGANIC+COTTON+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ORGANIC+COTTON+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ORGANIC+COTTON+BLACK+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ORGANIC+COTTON+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ORGANIC+COTTON+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ORGANIC+COTTON+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ORGANIC+COTTON+NAVY+DETAIL&font=playfair',
    ],
    'Olive': [
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=ORGANIC+COTTON+OLIVE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=ORGANIC+COTTON+OLIVE+BACK&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=ORGANIC+COTTON+OLIVE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=ORGANIC+COTTON+OLIVE+DETAIL&font=playfair',
    ],
  },
  'prod-3': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ATHLETIC+PERFORMANCE+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ATHLETIC+PERFORMANCE+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ATHLETIC+PERFORMANCE+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=ATHLETIC+PERFORMANCE+BLACK+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ATHLETIC+PERFORMANCE+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ATHLETIC+PERFORMANCE+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ATHLETIC+PERFORMANCE+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=ATHLETIC+PERFORMANCE+NAVY+DETAIL&font=playfair',
    ],
    'Red': [
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=ATHLETIC+PERFORMANCE+RED+FRONT&font=playfair',
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=ATHLETIC+PERFORMANCE+RED+BACK&font=playfair',
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=ATHLETIC+PERFORMANCE+RED+SIDE&font=playfair',
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=ATHLETIC+PERFORMANCE+RED+DETAIL&font=playfair',
    ],
    'White': [
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ATHLETIC+PERFORMANCE+WHITE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ATHLETIC+PERFORMANCE+WHITE+BACK&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ATHLETIC+PERFORMANCE+WHITE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=ATHLETIC+PERFORMANCE+WHITE+DETAIL&font=playfair',
    ],
  },
  'prod-4': {
    'White': [
      'https://placehold.co/1200x1200/FFFFFF/000000?text=BAMBOO+POLO+WHITE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=BAMBOO+POLO+WHITE+BACK&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=BAMBOO+POLO+WHITE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=BAMBOO+POLO+WHITE+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=BAMBOO+POLO+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=BAMBOO+POLO+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=BAMBOO+POLO+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=BAMBOO+POLO+NAVY+DETAIL&font=playfair',
    ],
    'Sage': [
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=BAMBOO+POLO+SAGE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=BAMBOO+POLO+SAGE+BACK&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=BAMBOO+POLO+SAGE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=BAMBOO+POLO+SAGE+DETAIL&font=playfair',
    ],
    'Beige': [
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=BAMBOO+POLO+BEIGE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=BAMBOO+POLO+BEIGE+BACK&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=BAMBOO+POLO+BEIGE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=BAMBOO+POLO+BEIGE+DETAIL&font=playfair',
    ],
  },

  // === JEANS & PANTS ===
  'prod-11': {
    'Blue': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=SLIM+JEANS+BLUE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=SLIM+JEANS+BLUE+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=SLIM+JEANS+BLUE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=SLIM+JEANS+BLUE+DETAIL&font=playfair',
    ],
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=SLIM+JEANS+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=SLIM+JEANS+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=SLIM+JEANS+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=SLIM+JEANS+BLACK+DETAIL&font=playfair',
    ],
    'Light Blue': [
      'https://placehold.co/1200x1200/60A5FA/FFFFFF?text=SLIM+JEANS+LIGHT+BLUE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/60A5FA/FFFFFF?text=SLIM+JEANS+LIGHT+BLUE+BACK&font=playfair',
      'https://placehold.co/1200x1200/60A5FA/FFFFFF?text=SLIM+JEANS+LIGHT+BLUE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/60A5FA/FFFFFF?text=SLIM+JEANS+LIGHT+BLUE+DETAIL&font=playfair',
    ],
  },
  'prod-12': {
    'Khaki': [
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=CARGO+PANTS+KHAKI+FRONT&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=CARGO+PANTS+KHAKI+BACK&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=CARGO+PANTS+KHAKI+SIDE&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=CARGO+PANTS+KHAKI+DETAIL&font=playfair',
    ],
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=CARGO+PANTS+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=CARGO+PANTS+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=CARGO+PANTS+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=CARGO+PANTS+BLACK+DETAIL&font=playfair',
    ],
    'Olive': [
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=CARGO+PANTS+OLIVE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=CARGO+PANTS+OLIVE+BACK&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=CARGO+PANTS+OLIVE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/4D7C0F/FFFFFF?text=CARGO+PANTS+OLIVE+DETAIL&font=playfair',
    ],
  },
  'prod-13': {
    'Beige': [
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=STRAIGHT+CHINOS+BEIGE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=STRAIGHT+CHINOS+BEIGE+BACK&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=STRAIGHT+CHINOS+BEIGE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=STRAIGHT+CHINOS+BEIGE+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STRAIGHT+CHINOS+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STRAIGHT+CHINOS+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STRAIGHT+CHINOS+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STRAIGHT+CHINOS+NAVY+DETAIL&font=playfair',
    ],
    'Gray': [
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STRAIGHT+CHINOS+GRAY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STRAIGHT+CHINOS+GRAY+BACK&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STRAIGHT+CHINOS+GRAY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STRAIGHT+CHINOS+GRAY+DETAIL&font=playfair',
    ],
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STRAIGHT+CHINOS+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STRAIGHT+CHINOS+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STRAIGHT+CHINOS+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STRAIGHT+CHINOS+BLACK+DETAIL&font=playfair',
    ],
  },

  // === HOODIES & SWEATERS ===
  'prod-16': {
    'Gray': [
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=COZY+FLEECE+HOODIE+GRAY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=COZY+FLEECE+HOODIE+GRAY+BACK&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=COZY+FLEECE+HOODIE+GRAY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=COZY+FLEECE+HOODIE+GRAY+DETAIL&font=playfair',
    ],
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=COZY+FLEECE+HOODIE+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=COZY+FLEECE+HOODIE+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=COZY+FLEECE+HOODIE+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=COZY+FLEECE+HOODIE+BLACK+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=COZY+FLEECE+HOODIE+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=COZY+FLEECE+HOODIE+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=COZY+FLEECE+HOODIE+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=COZY+FLEECE+HOODIE+NAVY+DETAIL&font=playfair',
    ],
  },
  'prod-17': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+BLACK+DETAIL&font=playfair',
    ],
    'Gray': [
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+GRAY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+GRAY+BACK&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+GRAY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+GRAY+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=OVERSIZED+COMFORT+HOODIE+NAVY+DETAIL&font=playfair',
    ],
  },
  'prod-18': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+BLACK+DETAIL&font=playfair',
    ],
    'Gray': [
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+GRAY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+GRAY+BACK&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+GRAY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/6B7280/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+GRAY+DETAIL&font=playfair',
    ],
    'Navy': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+NAVY+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+NAVY+BACK&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+NAVY+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=STREET+STYLE+GRAPHIC+HOODIE+NAVY+DETAIL&font=playfair',
    ],
  },

  // === SHOES ===
  'prod-19': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BLACK+TOP&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BLACK+SOLE&font=playfair',
    ],
    'Brown': [
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BROWN+FRONT&font=playfair',
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BROWN+SIDE&font=playfair',
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BROWN+TOP&font=playfair',
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=PREMIUM+LEATHER+SNEAKERS+BROWN+SOLE&font=playfair',
    ],
    'White': [
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+LEATHER+SNEAKERS+WHITE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+LEATHER+SNEAKERS+WHITE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+LEATHER+SNEAKERS+WHITE+TOP&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=PREMIUM+LEATHER+SNEAKERS+WHITE+SOLE&font=playfair',
    ],
  },
  'prod-20': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=RUNNING+SHOES+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=RUNNING+SHOES+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=RUNNING+SHOES+BLACK+TOP&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=RUNNING+SHOES+BLACK+SOLE&font=playfair',
    ],
    'Blue': [
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=RUNNING+SHOES+BLUE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=RUNNING+SHOES+BLUE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=RUNNING+SHOES+BLUE+TOP&font=playfair',
      'https://placehold.co/1200x1200/1E40AF/FFFFFF?text=RUNNING+SHOES+BLUE+SOLE&font=playfair',
    ],
    'Red': [
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=RUNNING+SHOES+RED+FRONT&font=playfair',
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=RUNNING+SHOES+RED+SIDE&font=playfair',
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=RUNNING+SHOES+RED+TOP&font=playfair',
      'https://placehold.co/1200x1200/DC2626/FFFFFF?text=RUNNING+SHOES+RED+SOLE&font=playfair',
    ],
  },

  // === ACCESSORIES ===
  'prod-23': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=LEATHER+BELT+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=LEATHER+BELT+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=LEATHER+BELT+BLACK+BACK&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=LEATHER+BELT+BLACK+DETAIL&font=playfair',
    ],
    'Brown': [
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=LEATHER+BELT+BROWN+FRONT&font=playfair',
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=LEATHER+BELT+BROWN+SIDE&font=playfair',
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=LEATHER+BELT+BROWN+BACK&font=playfair',
      'https://placehold.co/1200x1200/92400E/FFFFFF?text=LEATHER+BELT+BROWN+DETAIL&font=playfair',
    ],
    'Tan': [
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=LEATHER+BELT+TAN+FRONT&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=LEATHER+BELT+TAN+SIDE&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=LEATHER+BELT+TAN+BACK&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=LEATHER+BELT+TAN+DETAIL&font=playfair',
    ],
  },
  'prod-24': {
    'Black': [
      'https://placehold.co/1200x1200/000000/FFFFFF?text=DESIGNER+SUNGLASSES+BLACK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=DESIGNER+SUNGLASSES+BLACK+SIDE&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=DESIGNER+SUNGLASSES+BLACK+TOP&font=playfair',
      'https://placehold.co/1200x1200/000000/FFFFFF?text=DESIGNER+SUNGLASSES+BLACK+CASE&font=playfair',
    ],
    'Tortoise': [
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=DESIGNER+SUNGLASSES+TORTOISE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=DESIGNER+SUNGLASSES+TORTOISE+SIDE&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=DESIGNER+SUNGLASSES+TORTOISE+TOP&font=playfair',
      'https://placehold.co/1200x1200/D97706/FFFFFF?text=DESIGNER+SUNGLASSES+TORTOISE+CASE&font=playfair',
    ],
    'Clear': [
      'https://placehold.co/1200x1200/FFFFFF/000000?text=DESIGNER+SUNGLASSES+CLEAR+FRONT&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=DESIGNER+SUNGLASSES+CLEAR+SIDE&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=DESIGNER+SUNGLASSES+CLEAR+TOP&font=playfair',
      'https://placehold.co/1200x1200/FFFFFF/000000?text=DESIGNER+SUNGLASSES+CLEAR+CASE&font=playfair',
    ],
  },
  'prod-25': {
    'Silver': [
      'https://placehold.co/1200x1200/C0C0C0/FFFFFF?text=PREMIUM+WATCH+SILVER+FRONT&font=playfair',
      'https://placehold.co/1200x1200/C0C0C0/FFFFFF?text=PREMIUM+WATCH+SILVER+SIDE&font=playfair',
      'https://placehold.co/1200x1200/C0C0C0/FFFFFF?text=PREMIUM+WATCH+SILVER+BACK&font=playfair',
      'https://placehold.co/1200x1200/C0C0C0/FFFFFF?text=PREMIUM+WATCH+SILVER+DETAIL&font=playfair',
    ],
    'Gold': [
      'https://placehold.co/1200x1200/D4AF37/FFFFFF?text=PREMIUM+WATCH+GOLD+FRONT&font=playfair',
      'https://placehold.co/1200x1200/D4AF37/FFFFFF?text=PREMIUM+WATCH+GOLD+SIDE&font=playfair',
      'https://placehold.co/1200x1200/D4AF37/FFFFFF?text=PREMIUM+WATCH+GOLD+BACK&font=playfair',
      'https://placehold.co/1200x1200/D4AF37/FFFFFF?text=PREMIUM+WATCH+GOLD+DETAIL&font=playfair',
    ],
    'Rose Gold': [
      'https://placehold.co/1200x1200/E0BFB8/FFFFFF?text=PREMIUM+WATCH+ROSE+GOLD+FRONT&font=playfair',
      'https://placehold.co/1200x1200/E0BFB8/FFFFFF?text=PREMIUM+WATCH+ROSE+GOLD+SIDE&font=playfair',
      'https://placehold.co/1200x1200/E0BFB8/FFFFFF?text=PREMIUM+WATCH+ROSE+GOLD+BACK&font=playfair',
      'https://placehold.co/1200x1200/E0BFB8/FFFFFF?text=PREMIUM+WATCH+ROSE+GOLD+DETAIL&font=playfair',
    ],
  },
};
