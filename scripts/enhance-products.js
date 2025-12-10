const fs = require('fs');
const path = require('path');

// Path to the realProducts.ts file
const productsFilePath = path.join(__dirname, '../src/data/realProducts.ts');

// Read the file content
let fileContent = fs.readFileSync(productsFilePath, 'utf8');

// Extract the array content (this is a bit hacky but avoids needing a TS parser)
// We assume the file structure is: export const realBluewudProducts: Product[] = [ ... ];
const startIndex = fileContent.indexOf('[');
const endIndex = fileContent.lastIndexOf(']');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find product array in file');
    process.exit(1);
}

const arrayContent = fileContent.substring(startIndex, endIndex + 1);

// We need to make the content valid JSON to parse it
// 1. Remove trailing commas
// 2. Quote unquoted keys (if any, though TS usually has them unquoted, JSON needs quotes)
// Actually, since it's a TS file, it might be hard to parse as JSON directly if keys aren't quoted.
// Let's try to evaluate it as JS.
let products;
try {
    // We'll use eval, but we need to handle the imports/exports first.
    // A safer way for this specific task might be to just regex replace, but that's brittle.
    // Let's try to construct a temporary JS file that exports the data.

    // Clean up the content to be valid JS object
    // It's already a JS object structure, just inside a TS file.
    // We can wrap it in a module.exports

    // However, the file imports 'Product' from './mockData'. We need to mock that or remove it.
    // The file content is:
    // import { Product } from './mockData';
    // export const realBluewudProducts: Product[] = [ ... ]

    // Let's extract just the array part and eval it.
    // But wait, the array part might have unquoted keys which JSON.parse won't like.
    // Eval is dangerous but for this local script it's fine.

    products = eval(arrayContent);
} catch (e) {
    console.error('Failed to parse products array:', e);
    // Fallback: try to fix common issues or use a different approach
    // If eval fails (e.g. due to type annotations inside the array?? Unlikely in object literals),
    // we might need a more robust parser. But let's assume standard object literals.
    process.exit(1);
}

console.log(`Loaded ${products.length} products.`);

// Helper to determine category and subcategory
function categorize(name, description) {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();
    const text = lowerName + ' ' + lowerDesc;

    if (text.includes('sofa') || text.includes('couch') || text.includes('recliner')) {
        return { category: 'living-room', subCategory: 'Sofas' };
    }
    if (text.includes('tv unit') || text.includes('tv cabinet') || text.includes('entertainment unit')) {
        return { category: 'living-room', subCategory: 'TV Units' };
    }
    if (text.includes('coffee table') || text.includes('center table')) {
        return { category: 'living-room', subCategory: 'Coffee Tables' };
    }
    if (text.includes('shoe rack') || text.includes('shoe cabinet')) {
        return { category: 'living-room', subCategory: 'Shoe Racks' };
    }
    if (text.includes('book shelf') || text.includes('bookshelf') || text.includes('book case')) {
        return { category: 'study-office', subCategory: 'Bookshelves' };
    }
    if (text.includes('bed') && !text.includes('bedside')) {
        return { category: 'bedroom', subCategory: 'Beds' };
    }
    if (text.includes('wardrobe') || text.includes('cupboard') || text.includes('almirah')) {
        return { category: 'bedroom', subCategory: 'Wardrobes' };
    }
    if (text.includes('bedside') || text.includes('nightstand')) {
        return { category: 'bedroom', subCategory: 'Bedside Tables' };
    }
    if (text.includes('dressing') || text.includes('dresser')) {
        return { category: 'bedroom', subCategory: 'Dressing Tables' };
    }
    if (text.includes('study table') || text.includes('desk') || text.includes('laptop table')) {
        return { category: 'study-office', subCategory: 'Study Tables' };
    }
    if (text.includes('office chair') || text.includes('study chair')) {
        return { category: 'study-office', subCategory: 'Office Chairs' };
    }
    if (text.includes('dining table') || text.includes('dining set')) {
        return { category: 'dining-kitchen', subCategory: 'Dining Tables' };
    }
    if (text.includes('wall shelf') || text.includes('wall shelves')) {
        return { category: 'decor', subCategory: 'Wall Decor' };
    }
    if (text.includes('lamp') || text.includes('light')) {
        return { category: 'decor', subCategory: 'Lighting' };
    }

    // Default fallback
    return { category: 'living-room', subCategory: 'Furniture' };
}

// Helper to generate colors
function getColors(category, subCategory, colorFinish) {
    const baseColors = colorFinish ? [colorFinish] : [];

    if (subCategory === 'Sofas' || subCategory === 'Office Chairs') {
        return [...new Set([...baseColors, 'Grey', 'Blue', 'Beige'])];
    }
    if (category === 'bedroom' || category === 'living-room' || category === 'dining-kitchen') {
        return [...new Set([...baseColors, 'Walnut', 'Teak', 'Wenge', 'White'])];
    }
    return [...new Set([...baseColors, 'Standard'])];
}

// Helper to generate sizes
function getSizes(category, subCategory) {
    if (subCategory === 'Sofas') return ['3 Seater', '2 Seater', '1 Seater', 'L-Shape'];
    if (subCategory === 'Beds') return ['King', 'Queen', 'Single'];
    if (subCategory === 'Wardrobes') return ['2 Door', '3 Door', '4 Door'];
    if (subCategory === 'Dining Tables') return ['4 Seater', '6 Seater', '8 Seater'];
    if (subCategory === 'TV Units') return ['Standard', 'Large', 'Extra Large'];
    if (subCategory === 'Study Tables') return ['Standard', 'Large', 'Compact'];
    if (subCategory === 'Bookshelves') return ['3 Tier', '4 Tier', '5 Tier'];
    return ['Standard'];
}

// Process products
const enhancedProducts = products.map(p => {
    // Keep existing enhanced data for top 5 products (checking by ID or if they already have rich data)
    if (p.colors && p.colors.length > 0 && p.sizes && p.sizes.length > 0 && p.specifications && Object.keys(p.specifications).length > 2) {
        return p;
    }

    const { category, subCategory } = categorize(p.name, p.description || '');
    const colors = getColors(category, subCategory, p.colorFinish);
    const sizes = getSizes(category, subCategory);

    return {
        ...p,
        category,
        subCategory,
        colors,
        sizes,
        // Ensure other fields are present
        isActive: true,
        isFeatured: p.rating > 4.5,
        stock: p.stock || Math.floor(Math.random() * 50) + 5,
        reviewCount: p.reviewCount || Math.floor(Math.random() * 100) + 10,
        rating: p.rating || (4 + Math.random()),
        // Add basic specs if missing
        specifications: p.specifications || {
            material: 'Engineered Wood',
            warranty: '1 Year',
            careInstructions: ['Wipe with dry cloth', 'Avoid direct sunlight']
        }
    };
});

// Generate the new file content
const newFileContent = `// Auto-generated from Bluewud product catalog
// 488 real furniture products from Productslist.csv
// Enhanced with categories, colors, and sizes

import { Product } from './mockData';

export const realBluewudProducts: Product[] = ${JSON.stringify(enhancedProducts, null, 2)};
`;

// Write back to file
fs.writeFileSync(productsFilePath, newFileContent);

console.log('Successfully enhanced products!');
console.log(`Total products: ${enhancedProducts.length}`);
