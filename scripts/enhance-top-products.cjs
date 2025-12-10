const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../src/data/realProducts.ts');

let fileContent = fs.readFileSync(productsFilePath, 'utf8');
const startIndex = fileContent.indexOf('[');
const endIndex = fileContent.lastIndexOf(']');
const arrayContent = fileContent.substring(startIndex, endIndex + 1);

let products;
try {
    products = eval(arrayContent);
} catch (e) {
    console.error('Failed to parse products:', e);
    process.exit(1);
}

// Map of specific enhancements for top products
const enhancements = {
    'prod-6': {
        name: 'Roverb Diwan Daybed - Brown Maple',
        description: 'A versatile diwan bed that doubles as a sofa. Perfect for living rooms or guest rooms, featuring a rich brown maple finish and sturdy engineered wood construction.',
        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'
    },
    'prod-7': {
        name: 'Roverb Luxury King Bed - Brown Maple',
        description: 'Sleep in style with this expansive King size bed. The brown maple finish adds warmth to your bedroom, while the robust frame ensures a quiet and comfortable night\'s sleep.',
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
            'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80'
    },
    'prod-8': {
        name: 'Roverb Queen Bed - Walnut & White',
        description: 'Contemporary dual-tone design featuring walnut wood grain and crisp white accents. This queen bed is a perfect centerpiece for modern minimalist bedrooms.',
        images: [
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80'
    },
    'prod-9': {
        name: 'Roverb Queen Bed - Classic Brown',
        description: 'Timeless design meets modern durability. This classic brown queen bed fits seamlessly into any decor style, from traditional to contemporary.',
        images: [
            'https://images.unsplash.com/photo-1505693314120-0d4438688849?w=800&q=80',
            'https://images.unsplash.com/photo-1616594039964-40891a9cbc81?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505693314120-0d4438688849?w=400&q=80'
    },
    'prod-10': {
        name: 'Roverb Single Bed - Compact Comfort',
        description: 'Ideal for kids\' rooms or guest spaces, this single bed offers sturdy support without taking up too much floor space. Finished in elegant brown maple.',
        images: [
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80', // Using a bedroom scene
            'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&q=80'
    },
    'prod-11': {
        name: 'Coras Bedside Table - Wenge & White',
        description: 'Keep your essentials within reach with this stylish dual-tone bedside table. Features a spacious drawer and an open shelf for books or decor.',
        images: [
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&q=80'
    },
    'prod-12': {
        name: 'Nohee Bedside Table - Minimalist Brown',
        description: 'A sleek and simple bedside companion. The Nohee table features clean lines and a rich brown finish that complements any bed frame.',
        images: [
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80',
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=80'
    },
    'prod-13': {
        name: 'Oliver Bedside Table - Modern Storage',
        description: 'Maximize storage in small spaces with the Oliver table. Its compact footprint hides a surprisingly spacious drawer and shelf.',
        images: [
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80'
    },
    'prod-14': {
        name: 'Oliver Bedside Table - Classic Edition',
        description: 'The classic edition of our popular Oliver table, finished in a warm brown maple that brings a cozy feel to your bedside.',
        images: [
            'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80',
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=400&q=80'
    },
    'prod-15': {
        name: 'Anatdol Coffee Table - Centerpiece',
        description: 'Anchor your living room with the Anatdol coffee table. Its spacious surface and lower shelf provide plenty of room for drinks, books, and decor.',
        images: [
            'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
            'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80',
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&q=80'
    },
    'prod-16': {
        name: 'Declove Coffee Table - Geometric Design',
        description: 'Make a statement with the Declove table. Its unique geometric legs and dual-tone finish create a modern focal point for any lounge area.',
        images: [
            'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80',
            'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80'
    }
};

const enhancedProducts = products.map(p => {
    if (enhancements[p._id]) {
        return {
            ...p,
            ...enhancements[p._id],
            // Ensure they have colors/sizes if not already (though previous script should have handled it)
            colors: p.colors || ['Standard'],
            sizes: p.sizes || ['Standard']
        };
    }
    return p;
});

const newFileContent = `// Auto-generated from Bluewud product catalog
// 488 real furniture products from Productslist.csv
// Enhanced with categories, colors, and sizes

import { Product } from './mockData';

export const realBluewudProducts: Product[] = ${JSON.stringify(enhancedProducts, null, 2)};
`;

fs.writeFileSync(productsFilePath, newFileContent);

console.log('Successfully enhanced top 16 products!');
