const fs = require('fs');
const path = require('path');

// Path to the realProducts.ts file
const productsFilePath = path.join(__dirname, '../src/data/realProducts.ts');

// Read the file content
let fileContent = fs.readFileSync(productsFilePath, 'utf8');

// Extract the array content
const startIndex = fileContent.indexOf('[');
const endIndex = fileContent.lastIndexOf(']');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find product array in file');
    process.exit(1);
}

const arrayContent = fileContent.substring(startIndex, endIndex + 1);

let products;
try {
    // Use eval to parse the array content
    products = eval(arrayContent);
} catch (e) {
    console.error('Failed to parse products array:', e);
    process.exit(1);
}

console.log(`Loaded ${products.length} products.`);

// Helper to determine category and subcategory
// MUST match Navbar.tsx generation logic: 
// 'Study & Office' -> 'study-and-office'
// 'Dining & Kitchen' -> 'dining-and-kitchen'
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
        return { category: 'study-and-office', subCategory: 'Bookshelves' };
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
        return { category: 'study-and-office', subCategory: 'Study Tables' };
    }
    if (text.includes('office chair') || text.includes('study chair')) {
        return { category: 'study-and-office', subCategory: 'Office Chairs' };
    }
    if (text.includes('dining table') || text.includes('dining set')) {
        return { category: 'dining-and-kitchen', subCategory: 'Dining Tables' };
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
    if (category === 'bedroom' || category === 'living-room' || category === 'dining-and-kitchen') {
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
    // Keep existing enhanced data for top 5 products
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
        isActive: true,
        isFeatured: p.rating > 4.5,
        stock: p.stock || Math.floor(Math.random() * 50) + 5,
        reviewCount: p.reviewCount || Math.floor(Math.random() * 100) + 10,
        rating: p.rating || (4 + Math.random()),
        specifications: p.specifications || {
            material: 'Engineered Wood',
            warranty: '1 Year',
            careInstructions: ['Wipe with dry cloth', 'Avoid direct sunlight']
        }
    };
});

const newFileContent = `// Auto-generated from Bluewud product catalog
// 488 real furniture products from Productslist.csv
// Enhanced with categories, colors, and sizes

import { Product } from './mockData';

export const realBluewudProducts: Product[] = ${JSON.stringify(enhancedProducts, null, 2)};
`;

fs.writeFileSync(productsFilePath, newFileContent);

console.log('Successfully enhanced products!');
console.log(`Total products: ${enhancedProducts.length}`);
