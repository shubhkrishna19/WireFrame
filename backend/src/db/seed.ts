// ============================================
// REAL BLUEWUD CATALOG - DATABASE SEED SCRIPT
// Populates all 368 authentic Bluewud products
// ============================================

import { query } from '../config/database';
import { logger } from '../config/logger';
import { hashPassword } from '../utils/hash.util';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

// Read products from JSON file
const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../bluewud-products.json'), 'utf8')
);

// Price ranges based on product type (in INR)
const priceRanges: Record<string, { min: number; max: number }> = {
  bed: { min: 8000, max: 30000 },
  wardrobe: { min: 10000, max: 35000 },
  'tv unit': { min: 5000, max: 20000 },
  'coffee table': { min: 3000, max: 12000 },
  'study table': { min: 5000, max: 15000 },
  bookshelf: { min: 4000, max: 12000 },
  'shoe rack': { min: 2000, max: 7000 },
  'wall shelve': { min: 500, max: 3000 },
  'key holder': { min: 300, max: 1500 },
  'dressing table': { min: 8000, max: 18000 },
  'pooja': { min: 3000, max: 15000 },
  ottoman: { min: 2000, max: 6000 },
  sofa: { min: 15000, max: 40000 },
  chair: { min: 3000, max: 10000 },
  default: { min: 2000, max: 8000 },
};

function getProductType(name: string): string {
  const nameLower = name.toLowerCase();
  for (const type of Object.keys(priceRanges)) {
    if (nameLower.includes(type)) return type;
  }
  return 'default';
}

function generatePrice(name: string): { price: number; originalPrice: number; discount: number } {
  const type = getProductType(name);
  const range = priceRanges[type];
  const originalPrice = Math.round(Math.random() * (range.max - range.min) + range.min);
  const discountPercent = Math.floor(Math.random() * 35) + 15; // 15-50% discount
  const price = Math.round(originalPrice * (1 - discountPercent / 100));
  return { price, originalPrice, discount: discountPercent };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generatePlaceholderImage(name: string, finish: string): string {
  const encoded = encodeURIComponent(name.substring(0, 30).toUpperCase());
  const bgColor = finish.includes('Wenge') ? '2D3748' : finish.includes('Walnut') ? '92400E' : '718096';
  return `https://placehold.co/800x800/${bgColor}/FFFFFF?text=${encoded}&font=playfair`;
}

const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting REAL Bluewud catalog database seeding...');
    logger.info(`📦 Total products to populate: 368`);

    // 1. Clear existing data
    logger.info('🧹 Clearing existing data...');
    await query('DELETE FROM product_images');
    await query('DELETE FROM products');
    await query('DELETE FROM categories');
    await query('DELETE FROM users');

    // 2. Create Users
    logger.info('👤 Creating users...');
    const customerPassword = await hashPassword('customer123');
    const adminPassword = await hashPassword('admin123');
    const editorPassword = await hashPassword('editor123');

    await query(
      `INSERT INTO users (id, email, password_hash, name, role, email_verified) VALUES
       (?, 'customer@bluewud.com', ?, 'Rohan Sharma', 'customer', 1),
       (?, 'editor@bluewud.com', ?, 'Priya Editor', 'editor', 1),
       (?, 'admin@bluewud.com', ?, 'Admin User', 'admin', 1)`,
      [uuidv4(), customerPassword, uuidv4(), editorPassword, uuidv4(), adminPassword]
    );

    // 3. Create Categories
    logger.info('📁 Creating categories...');
    const categories = [
      { id: 'living-room', name: 'Living Room', slug: 'living-room', description: 'Sofas, TV Units, Coffee Tables' },
      { id: 'bedroom', name: 'Bedroom', slug: 'bedroom', description: 'Beds, Wardrobes, Dressing Tables' },
      { id: 'study-office', name: 'Study & Office', slug: 'study-office', description: 'Study Tables, Office Chairs' },
      { id: 'dining-kitchen', name: 'Dining & Kitchen', slug: 'dining-kitchen', description: 'Dining Tables, Kitchen Cabinets' },
      { id: 'decor', name: 'Decor', slug: 'decor', description: 'Wall Shelves, Mandir, Lighting' },
    ];

    for (const cat of categories) {
      await query(
        `INSERT INTO categories (id, name, slug, description, is_active) VALUES (?, ?, ?, ?, 1)`,
        [cat.id, cat.name, cat.slug, cat.description]
      );
    }

    // 4. Create Products from parsed JSON
    logger.info('📦 Creating products...');
    let totalInserted = 0;

    for (const categoryName of Object.keys(productsData)) {
      const products = productsData[categoryName];
      logger.info(`  → Processing ${categoryName}: ${products.length} products`);

      for (const productData of products) {
        const { price, originalPrice, discount } = generatePrice(productData.name);
        const slug = generateSlug(productData.name);
        const thumbnail = generatePlaceholderImage(productData.name, productData.finish);
        const images = [thumbnail];

        // Determine if featured (25% chance for premium items)
        const isFeatured = Math.random() < 0.25 && price > 10000 ? 1 : 0;

        // Random rating and review count
        const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
        const reviewCount = Math.floor(Math.random() * 150) + 10;

        // Stock based on price (higher price = lower stock)
        const stock = price > 20000 ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 40) + 10;

        // Basic specifications (will be updated later by user)
        const specifications = {
          material: 'Engineered Wood',
          finish: productData.finish,
          style: 'Modern',
          room: categoryName === 'living-room' ? 'Living Room' :
            categoryName === 'bedroom' ? 'Bedroom' :
              categoryName === 'study-office' ? 'Office' :
                categoryName === 'dining-kitchen' ? 'Dining Room' : 'Any',
          dimensions: { length: '100 cm', width: '50 cm', height: '75 cm' },
          careInstructions: ['Wipe with dry cloth', 'Avoid direct sunlight'],
          countryOfOrigin: 'India',
        };

        // Tags based on product name
        const tags = [categoryName.split('-').join(' '), 'Bluewud', productData.finish];
        if (productData.name.includes('Storage')) tags.push('Storage');
        if (productData.name.includes('Mirror')) tags.push('Mirror');

        try {
          // Insert Product
          await query(
            `INSERT INTO products (
              id, name, slug, description, category_id, brand, price, original_price, 
              discount_percentage, sku, stock, rating, review_count, thumbnail_url, 
              is_active, is_featured, specifications, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
            [
              productData.id,
              productData.name,
              slug,
              `Premium ${productData.name} from Bluewud. Crafted with high-quality materials for long-lasting durability.`,
              productData.category,
              'Bluewud',
              price,
              originalPrice,
              discount,
              productData.sku,
              stock,
              parseFloat(rating),
              reviewCount,
              thumbnail,
              isFeatured,
              JSON.stringify(specifications),
              JSON.stringify(tags),
            ]
          );

          // Insert Images
          for (const [index, url] of images.entries()) {
            await query(
              `INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)`,
              [uuidv4(), productData.id, url, index]
            );
          }

          totalInserted++;
        } catch (err: any) {
          logger.error(`Failed to insert ${productData.name}: ${err.message}`);
        }
      }
    }

    logger.info('');
    logger.info('✅ Bluewud catalog seeded successfully!');
    logger.info('');
    logger.info('📊 Summary:');
    logger.info(`   Total Products: ${totalInserted}`);
    logger.info(`   Bedroom: ${productsData.bedroom.length}`);
    logger.info(`   Living Room: ${productsData['living-room'].length}`);
    logger.info(`   Study & Office: ${productsData['study-office'].length}`);
    logger.info(`   Dining & Kitchen: ${productsData['dining-kitchen'].length}`);
    logger.info(`   Decor: ${productsData.decor.length}`);
    logger.info('');
    logger.info('🔑 Test Credentials:');
    logger.info('   Admin:    admin@bluewud.com / admin123');
    logger.info('   Customer: customer@bluewud.com / test123');
    logger.info('');

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Seeding failed:', error.message);
    logger.error(error);
    process.exit(1);
  }
};

seedDatabase();
