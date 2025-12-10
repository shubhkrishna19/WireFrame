// Simple script to populate products in the database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('🔄 Populating products in database...');

// Insert some sample products
const products = [
  {
    id: 'prod-1',
    name: 'Premium Merino Wool T-Shirt',
    slug: 'premium-merino-wool-t-shirt',
    description: 'Ultra-soft merino wool t-shirt perfect for all seasons.',
    category_id: 'cat-men',
    brand: 'Mulary',
    price: 2999,
    original_price: 3999,
    discount_percentage: 25,
    sku: 'MUL-TS-001',
    stock_quantity: 50,
    average_rating: 4.5,
    is_active: 1,
    images: JSON.stringify([
      'https://placehold.co/1200x1200/2D3748/FFFFFF?text=PREMIUM+MERINO+WOOL+TSHIRT+FRONT&font=playfair',
      'https://placehold.co/1200x1200/2D3748/FFFFFF?text=PREMIUM+MERINO+WOOL+TSHIRT+BACK&font=playfair'
    ])
  },
  {
    id: 'prod-2',
    name: 'Organic Cotton Crew Neck',
    slug: 'organic-cotton-crew-neck',
    description: 'Classic crew neck t-shirt made from 100% organic cotton.',
    category_id: 'cat-men',
    brand: 'Mulary',
    price: 1999,
    original_price: 2499,
    discount_percentage: 20,
    sku: 'MUL-TS-002',
    stock_quantity: 75,
    average_rating: 4.3,
    is_active: 1,
    images: JSON.stringify([
      'https://placehold.co/1200x1200/F7FAFC/2D3748?text=ORGANIC+COTTON+CREW+NECK+FRONT&font=playfair',
      'https://placehold.co/1200x1200/F7FAFC/2D3748?text=ORGANIC+COTTON+CREW+NECK+BACK&font=playfair'
    ])
  },
  {
    id: 'prod-3',
    name: 'Athletic Performance Tee',
    slug: 'athletic-performance-tee',
    description: 'High-performance athletic t-shirt with moisture-wicking technology.',
    category_id: 'cat-men',
    brand: 'Mulary',
    price: 2499,
    original_price: 2999,
    discount_percentage: 17,
    sku: 'MUL-TS-003',
    stock_quantity: 60,
    average_rating: 4.6,
    is_active: 1,
    images: JSON.stringify([
      'https://placehold.co/1200x1200/E53E3E/FFFFFF?text=ATHLETIC+PERFORMANCE+TEE+FRONT&font=playfair',
      'https://placehold.co/1200x1200/E53E3E/FFFFFF?text=ATHLETIC+PERFORMANCE+TEE+BACK&font=playfair'
    ])
  }
];

try {
  // Clear existing products
  db.prepare('DELETE FROM products').run();

  // Insert products
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, slug, description, category_id, brand, price, original_price,
      discount_percentage, sku, stock, rating, is_active, thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const product of products) {
    insertProduct.run(
      product.id,
      product.name,
      product.slug,
      product.description,
      product.category_id,
      product.brand,
      product.price,
      product.original_price,
      product.discount_percentage,
      product.sku,
      product.stock_quantity,
      product.average_rating,
      product.is_active,
      product.images[0] // Use first image as thumbnail
    );
  }

  console.log('✅ Successfully populated products in database!');
  console.log(`📦 Added ${products.length} products`);

} catch (error) {
  console.error('❌ Error populating products:', error);
} finally {
  db.close();
}
