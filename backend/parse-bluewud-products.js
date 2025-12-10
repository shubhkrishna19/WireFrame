// Parse and categorize Bluewud products
const fs = require('fs');

const productsRaw = `Maltein King With storage Bed Brown Maple & Beige
Maltein Queen With storage Bed Brown Maple & Beige
Pollo King with Storage Bed Wenge
Pollo Queen with Storage Bed Wenge
Pollo Single Bed Wenge & White
Roverb Diwan 36" Bed Brown Maple
Roverb King Bed Brown Maple
Roverb Queen Bed Walnut & White
Roverb Queen Bed Brown Maple
Roverb SIngle Bed Brown Maple
Coras Bed Side Table Wenge & White
Nohee Bed Side Table Brown Maple
Oliver Bed Side Table Wenge & White
Oliver Bed Side Table Brown Maple
Anatdol Standard Coffee Table Brown Maple
Declove Coffee Table Wenge & White
Coffee Table Brown Maple
Gustowe Square Coffee Table White
Gustowe Square Coffee Table Wenge
Gustowe Square Set of Two Coffee Table Wenge
Kasvon Rectangle Coffee Table Wenge
Leo Coffee Table Brown Maple
Mayrite Round Coffee Table White
Mayrite Round Coffee Table Wenge
Mayrite Rectangle Coffee Table Wenge
Mayrite Rectangle Coffee Table Wenge & White
Noel Rectangle Coffee Table Brown Maple
Oliver Coffee Table Brown Maple
Osnale Rectangle Coffee Table Brown Maple
Smohn Coffee Table Brown Maple & Beige
Sydney Coffee Table Brown Maple
Taurley Coffee Table Brown Maple & Beige
Taury Rectangle Coffee Table Brown Maple
Tayvue Coffee Table Brown Maple
Victor Coffee Table Wenge
Kasvon Rectangle Coffee Table Brown Maple
Colove Chest of Drawer Brown Maple & White
Mayrone Large Chest of Drawer Brown Maple & White
Mayrone Standard Chest of Drawer Brown Maple & White
Hemming Dressing Table Wenge
Ender End Table Wenge & White
Isvia Magzine Holder Wenge
Edell Key Holder Brown Maple
Ramnet Key Holder Brown Maple
Stuart 10 Key Holder Brown Maple
Stuart 21 Key Holder Brown Maple
Stuart 5 Key Holder Brown Maple
Torene 18 Key Holder Wenge
Torene 40Key Holder Wenge
Torene 18 Glass Key Holder White
Torene 40 Glass Key Holder White
BLUEWUD Vivid Wooden Wall Hanging, Wall Mount Key Holder, for 5 Keys
Walore Key Holder Brown Maple
BLUEWUD Charlie Wall Mounted Magazine Holder Rack Cum Newspaper Stand
Midase Rectangular Pouff Ottoman Grey
Midase Rectangular Pouff Ottoman Blue
Noah Round Pouff Ottoman White
Noah Round Pouff Ottoman Brown
Siddhi Standard Pooja Unit Brown Maple & White
Fenily TV Unit Wenge
Fenily TV Unit Brown Maple & Beige
Fenily TV Unit Walnut & White
Fenily TV Unit
Maltein Diwan 30" with Storage Bed Brown Maple
Maltein Diwan 30" with Storage Bed
Carlem Tall Design Shoe Rack Brown Maple
Wilbrome TV Unit Brown Maple & White
Skiddo TV Unit Wenge & White
Skiddo TV Unit Brown Maple & White
Blesky TV Unit Brown Maple
Corbyn L-Shape Study Table Brown Maple & White
Blesky Miltra Combo TV Unit Brown Maple
Skiddo TV Unit Walnut & White
Darien TV Unit Brown Maple & White
Cylvie Shoe Rack Brown Maple & White
Brooklyn Shoe Rack Brown Maple
Kaspen Shoe Rack Brown Maple & White
Petree Wall Shelve Brown Maple
Kaspen Shoe Rack Wenge
Wilbrome Mini TV Unit Brown Maple & White
Amalet Study Table Brown Maple & Beige
Averyl TV Unit Brown Maple
Radisso Study Table Brown Maple
Carlem 3 Door Shoe Rack Brown Maple
Carlem 2 Door Shoe Rack Brown Maple
Rowlet Large TV Unit Wenge & White
Carlem 3 Door Shoe Rack Wenge
Kaspen Shoe Rack Walnut & White
Blesky Mini TV Unit Brown Maple
Whartin Shoe Rack Brown Maple & Beige
Rowlet Large TV Unit Brown Maple & Beige
Harmond TV Unit Brown Maple & White
Primax Grande Standard TV Unit Brown Maple & White
Whartin Shoe Rack Brown Maple
Coober Large TV Unit Brown Maple
Rowlet Mini TV Unit Wenge & White
Corbyn Study Table Brown Maple & White
Freddie Dressing Table Wenge
Seonn Bookshelf Wenge
Anatdol TV Unit Brown Maple
Darci Dressing Table Brown Maple & White
Prorage Shoe Rack Brown Maple & White
Andrie 4 Door without Mirror Wardrobe Wenge & White
Charley TV Unit Brown Maple & White
Andrie 3 Door with Mirror Wardrobe Wenge & White
Duskin TV Unit Brown Maple
Andrie 3 Door without Mirror Wardrobe Brown Maple & Beige
Andrie 2 Door with Mirror Wardrobe Wenge & White
Bevlyn TV Unit Brown Maple
Karmiya Study Table Brown Maple
Primax Grande Large TV Unit Wenge
Mallium With Slider Study Table Wenge
Wolabey Bookshelf Brown Maple & White
Andrie 4 Door without Mirror Wardrobe Brown Maple & Beige
Gautier TV Unit Brown Maple
Andrie 2 Door with Mirror Wardrobe Brown Maple & Beige
Crosbon Bookshelf Brown Maple
Andrie 2 Door without Mirror Wardrobe Wenge & White
Oleye Shoe Rack Brown Maple & Beige
Skywood Key Holder Wenge
Andrie 4 Door with Mirror Wardrobe Wenge & White
Carlem 2 Door Shoe Rack Wenge
Lagoon Bookshelf Brown Maple & Beige
Primax Grande Large TV Unit Brown Maple & White
Andrie 3 Door without Mirror Wardrobe Wenge & White
Efflino Large Study Table Brown Maple
Crosbon Bookshelf Wenge
Alex-5 Layer Wide Bookshelf Brown Maple
Mavis Shoe Rack Brown Maple
Andrie Single Door Wardrobe Wenge & White
Seonn Bookshelf Brown Maple & Beige
Primax Grande Standard TV Unit Wenge
Albert Wall Shelve Wenge
Reyloye Standard TV Unit Brown Maple & Beige
Maxelle Large Bookshelf Wenge & White
Primax Solo Large TV Unit Wenge
Mallium without Slider Study Table Wenge
Efflino Standard Study Table Brown Maple
Miltra TV Top Shelf Brown Maple
Norel Large Monitor Stand Brown Maple
Alex-5 Layer Wide Bookshelf Wenge
Louis Wall Shelve Walnut
Seonn Bookshelf Brown Maple & Beige
Reyloye Large TV Unit Brown Maple & Beige
Javis Wall Shelve Wenge
Mallium With Slider Study Table Brown Maple & White
Primax Standard TV Unit Wenge
Lagoon Bookshelf Wenge & White
Andrie Single Door Wardrobe Brown Maple & Beige
Javis Wall Shelve Brown Maple
Petree Wall Shelve Wenge
Maisy Large TV Unit Brown Maple & White
Kunsua Large TV Unit Brown Maple
Mallium without Slider Study Table Brown Maple & White
Reynold Large TV Unit Brown Maple & Beige
Crafte Wall Shelve Brown Maple
Crafte Wall Shelve Wenge
Andrie Single Door with Two Drawer Wardrobe Wenge & White
Walten Bookshelf Wenge
Cadlic Wall Shelve Wenge
Brooklyn Shoe Rack Brown Maple & White
Oliver TV Unit Brown Maple
Seonn Bookshelf Wenge
Primax Large TV Unit Wenge
Braine 6 Shelves Wall Shelve Wenge
Corbyn Solo Study Table Brown Maple & White
Maxelle Large Bookshelf Brown Maple & White
Estoye Standard TV Unit Brown Maple
Xude Wall Shelve Wenge
Estoye Mini TV Unit Brown Maple
Darci Dressing Table Wenge
Primax Plus Large TV Unit Wenge & White
Adaly Dressing Table Wenge
Pollo King with Storage Bed Brown Maple & Beige
Louis Wall Shelve Wenge
Walten Bookshelf Brown Maple
Braine F6 Shelves Wall Shelve Wenge
Kyvid Large TV Unit Wenge
Louis Wall Shelve Brown Maple
Reynold Study Table Wenge
Caselle Large Bookshelf Brown Maple
Jasden Kitchen Rack Wenge
Walten Bookshelf Wenge
Alex-5 Layer Narrow Design Bookshelf Brown Maple
Toska Large TV Unit Brown Maple & Beige
Estoye Large TV Unit Brown Maple
Leo Coffee Table Wenge
Kyvid Standard TV Unit Wenge
Cadlic Wall Shelve Brown Maple
Asburg 6 Layer Bookshelf Brown Maple
Braine 6 Shelves Wall Shelve Brown Maple
Skywood 10 Key Holder Wenge
Skywood 5 Key Holder Wenge
Primax Solo Standard TV Unit Brown Maple
Braine 6 Shelves Wall Shelve Walnut
Toska Standard TV Unit Brown Maple & Beige
Leo TV Unit Brown Maple
Mayrone TV Unit Brown Maple & White
Maxelle Large Bookshelf Brown Maple & Beige
Aero Large TV Unit Wenge
Braine F6 Shelves Wall Shelve Walnut
Sanque Large TV Unit Brown Maple
Molse Bookshelf Brown Maple
Roland Remote Holder Wenge
Andrie 2 Door without Mirror Wardrobe Brown Maple & Beige
Easton Wall Shelve Wenge & White
Maisy Standard TV Unit Brown Maple & White
Jameye Bookshelf Brown Maple
Astrella Wall Shelve Wenge
Petel TV Unit Brown Maple
Reyloye Standard TV Unit Wenge & White
Roverb King Bed Wenge
Reyloye Large TV Unit Wenge & White
Walden Study Table Brown Maple & White
Norel Standard Monitor Stand Brown Maple
Tirano Large Microwave Stand Brown Maple
Otto Remote Holder Wenge Tree
Rico Dressing Table Wenge
Reynold Large TV Unit Walnut
Adora Wall Shelve Wenge
Phelix Bookshelf Wenge
Alba Wall Shelve Wenge
Skywood 21 Key Holder Wenge
Hemming Study Table Wenge
Walten Bookshelf Walnut
Alaire Wall Shelve Wenge
Grubbin Wall Shelve Wenge
Adonis 2 Door Shoe Rack Wenge
Estoye Standard TV Unit Brown Maple & White
Gustowe Rectangle Set of Two Coffee Table Wenge
Norel Monitor Stand Wenge
Alesti Dressing Table Wenge
Louis Wall Shelve Wenge
Braine F6 Shelves Wall Shelve Brown Maple
Novebuk Bookshelf Brown Maple & White
Alex 4-Layer Bookshelf Brown Maple
Millie TV Unit Brown Maple
Maple Bookshelf Wenge
Festvi Triple Monitor Stand Wenge
Tirano Standard Microwave Stand Brown Maple
Rico Mini Dressing Table Wenge
Larkyn Key Holder Brown Maple & White
Mayrite Square Coffee Table Wenge
Aaron Bookshelf Wenge
Norel Adjustable Monitor Stand Walnut
Stellar Plus Wall Shelve Wenge
Andrie 3 Door with Mirror Wardrobe Brown Maple & Beige
Roverb Queen Bed Wenge
Pollo Queen with Storage Bed Brown Maple & Beige
Ender End Table Walnut & White
Hemming Study Table Walnut
Chanorr Set of 2 Spice Rack Black
Gustowe Rectangle Set of Two Coffee Table White
Gustowe Large Study Table Wenge
Otto Remote Holder Wenge Wave
Maltein 3 Door Without Mirror Wardrobe Brown Maple
Andrie 4 Door with Mirror Wardrobe Brown Maple & Beige
Gustowe Square Set of Two Coffee Table White
Ved Pooja Stool Wenge
Pollo Single Bed Walnut & White
Gustowe Rectangle Coffee Table White
Maltein 2 Door Without Mirror Wardrobe Brown Maple
Maltein 4 Door Without Mirror Wardrobe Brown Maple
Primax Standard TV Unit Brown Maple & White
Stellar Dressing Shelves Walnut
Flovo Shoe Rack Highland Teak
Flovo Shoe Rack Wenge
Brooklyn Tall Shoe Rack Brown Maple
Nuffon Study Table Wenge & White
Andrie 2 Door without Mirror Wardrobe Walnut & White
Gustowe Standard Study Table White
Maltein Queen With storage Bed Wenge
Maltein King With storage Bed Wenge
Andrie 4 Door with Mirror Wardrobe Walnut & White
Gautier TV Unit Wenge
Efflino Standard Study Table Wenge & White
Roverb Queen Bed Wenge & White
Novebuk Bookshelf Walnut & White
Taury Rectangle Small Coffee Table Wenge
Molse Bookshelf Wenge
Andrie Single Door With One Drawer Wardrobe Walnut & White
Cadlic Wall Shelve Wenge & White
Pollo Single Bed Brown Maple & Beige
Declove Coffee Table Wildwood & Beige
Gustowe Standard Study Table Wenge
Estoye Standard TV Unit Wenge & White
Efflino Large Study Table Wenge & White
Molse Standard Bookshelf Brown Maple & Beige
Cadlic Wall Shelve White
Estoye Standard TV Unit Wenge
Alex 4-Layer Bookshelf Wenge
Caselle Large Bookshelf Wenge
Stellar Plus Wall Shelve Wenge
Riley Wall Shelve Wenge
Phelix Bookshelf Walnut
Alex 4-Layer Bookshelf Walnut
Prico TV Unit Wenge
Novebuk Bookshelf Brown Maple & Beige
Gustowe Rectangle Coffee Table Wenge
Kasvon Square Coffee Table Wenge
Anatdol Standard Coffee Table Wenge & White
Sydney Coffee Table Walnut
Gustowe Large Study Table Walnut & White
Sydney Coffee Table Wenge
Riodesk Ace Laptop Table Wenge Tree
Gustowe Wall Mount Study Table Wenge
Amadour Key Holder Black
Pollo King Bed Wenge
Stellar Dressing Shelves Wenge
Morpheus Wall Shelve Wenge
Hemming Study Table Wenge
Andrie Single Door With One Drawer Wardrobe Wenge & White
Vivid Key Holder 0
Hemming Study Table Walnut
Vivid Key Holder 0
Adaly Dressing Table Walnut & White
Andrie 2 Door with Mirror Wardrobe Walnut & White
Harmond TV Unit Wenge
Rowlet Mini TV Unit Walnut & White
Skybox Wall Shelve Walnut
Primax Plus Large TV Unit Wenge & White
Ellera Wall Shelve Walnut & White
Roverb Diwan 30 Inch Non Storage Brown Maple
Alex-5 Layer Narrow Design Bookshelf Wenge
Astrella Wall Shelve Wenge & White
Declove Coffee Table Brown Maple & Beige
Noah Rectangular Pouff Ottoman Brown
Noah Rectangular Pouff Ottoman White
Wolabey Bookshelf Wenge & White
Whartin Shoe Rack Wenge
Noel Square Coffee Table Walnut
Febbora Wall art Wenge
Corbyn Plus Study Table Brown Maple & White
Dolvin Ladder Style Spice Rack Brown Maple
Yobeo 4 Tier Spice Rack Brown Maple
Promys with Shelf Set of Two Wall Art Brown Maple
Promys Set of Two Wall Art Brown Maple
Aero Large TV Unit Brown Maple
Freddie Dressing Table Brown Maple
Opryt Kichen Cabinet White
Opryt with Shelf Kichen Cabinet White
Serrenh Kichen Cabinet Brown Maple
Brooklyn Highline Shoe Rack Brown Maple
Mavis Combo Shoe Rack Brown Maple
Bonco Wardrobe Brown Maple & White
Calcio Combo Wardrobe Brown Maple
Calcio 3-Tier Wardrobe Brown Maple
Calcio 4-Tier Wardrobe Brown Maple
Calcio 5-Tier Wardrobe Brown Maple
Maltein Mini Wardrobe Brown Maple & White
Opryt Set of 2 Kichen Cabinet White
Opryt with Shelf Set of 2 Kichen Cabinet White
Mavis Seating Shoe Rack Brown Maple
Mavis Tall Shoe Rack Brown Maple
Maltein 2 Door Without Mirror Wardrobe Brown Maple & White
Maltein 3 Door Without Mirror Wardrobe Brown Maple & White
Maltein 4 Door Without Mirror Wardrobe Brown Maple & White
Sharnam Pooja Unit White
Barnia Bookshelf Brown Maple
Wilber 3+1, 4 Seater Interchangeable L Shape Sofa Grey
Wilber 3+1, 4 Seater Interchangeable L Shape Sofa White
Wilber 3+1, 4 Seater Interchangeable L Shape Sofa Blue
Furlyn Shoe Rack Brown Maple & White
Skiddo Lite TV Unit Brown Maple & White
Veluno Bookshelf Brown Maple
Greta Metal Spice Rack Black
Riley Wall Shelve Brown Maple
Kaspen Shoe Rack European Oak
Skiddo TV Unit European Oak
Fenily TV Unit European Oak
Wimzoe Shoe Rack Brown Maple
Shubh Pooja Unit Temple White
Shubh Pooja Unit Temple European Oak
Wimzoe Shoe Rack
Shubh Pooja Unit Temple
Zylo Medium Back Chair
Zylo Medium Back Chair Black`;

// Category mapping function
function categorizeProduct(name) {
    const nameLower = name.toLowerCase();

    // Bedroom - Beds, Wardrobes, Dressing Tables, Bedside Tables, Chest of Drawers
    if (nameLower.includes('bed') ||
        nameLower.includes('wardrobe') ||
        nameLower.includes('dressing') ||
        nameLower.includes('bed side') || nameLower.includes('bedside') ||
        nameLower.includes('chest of drawer') ||
        nameLower.includes('diwan')) {
        return 'bedroom';
    }

    // Living Room - TV Units, Coffee Tables, Sofas, Shoe Racks, Poufs, End Tables
    if (nameLower.includes('tv unit') ||
        nameLower.includes('coffee table') ||
        nameLower.includes('shoe rack') ||
        nameLower.includes('pouff') || nameLower.includes('ottoman') ||
        nameLower.includes('sofa') ||
        (nameLower.includes('end table') && !nameLower.includes('bed'))) {
        return 'living-room';
    }

    // Study & Office - Study Tables, Bookshelves, Monitor Stands, Laptop Tables, Chairs
    if (nameLower.includes('study table') ||
        nameLower.includes('bookshelf') ||
        nameLower.includes('monitor stand') ||
        nameLower.includes('laptop table') ||
        (nameLower.includes('chair') && !nameLower.includes('table'))) {
        return 'study-office';
    }

    // Dining & Kitchen - Kitchen items, Spice Racks, Cabinets, Microwave Stands
    if (nameLower.includes('kitchen') ||
        nameLower.includes('kichen') ||
        nameLower.includes('spice rack') ||
        nameLower.includes('microwave stand')) {
        return 'dining-kitchen';
    }

    // Decor - Wall Shelves, Key Holders, Magazine Holders, Pooja Units, Wall Art, Remote Holders
    if (nameLower.includes('wall shelve') ||
        nameLower.includes('key holder') ||
        nameLower.includes('magazine holder') || nameLower.includes('magzine holder') ||
        nameLower.includes('pooja') || nameLower.includes('temple') ||
        nameLower.includes('wall art') ||
        nameLower.includes('remote holder') ||
        nameLower.includes('wall mount') ||
        nameLower.includes('wall hanging')) {
        return 'decor';
    }

    // Default to decor for uncategorized
    return 'decor';
}

// Function to generate SKU
function generateSKU(name, index) {
    const words = name.split(' ');
    const prefix = words.slice(0, 2).map(w => w.substring(0, 3).toUpperCase()).join('');
    return `BW-${prefix}-${String(index).padStart(3, '0')}`;
}

// Function to extract finish/color
function extractFinish(name) {
    const finishes = [];
    if (name.includes('Brown Maple')) finishes.push('Brown Maple');
    if (name.includes('Wenge')) finishes.push('Wenge');
    if (name.includes('Walnut')) finishes.push('Walnut');
    if (name.includes('White')) finishes.push('White');
    if (name.includes('Beige')) finishes.push('Beige');
    if (name.includes('Highland Teak')) finishes.push('Highland Teak');
    if (name.includes('European Oak')) finishes.push('European Oak');
    if (name.includes('Wildwood')) finishes.push('Wildwood');
    if (name.includes('Black')) finishes.push('Black');
    if (name.includes('Grey')) finishes.push('Grey');
    if (name.includes('Blue')) finishes.push('Blue');

    return finishes.length > 0 ? finishes.join(' & ') : 'Natural';
}

// Parse products
const lines = productsRaw.trim().split('\n');
const products = [];
const seen = new Set();

lines.forEach((line, index) => {
    const name = line.trim();
    if (!name || seen.has(name)) return;
    seen.add(name);

    const category = categorizeProduct(name);
    const sku = generateSKU(name, index + 1);
    const finish = extractFinish(name);

    products.push({
        name,
        category,
        sku,
        finish,
        id: `prod-bw-${index + 1}`
    });
});

// Group by category
const grouped = products.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
}, {});

console.log('=== BLUEWUD PRODUCT CATEGORIZATION ===\n');
console.log(`Total unique products: ${products.length}\n`);
Object.keys(grouped).forEach(cat => {
    console.log(`${cat}: ${grouped[cat].length} products`);
});

// Write to JSON
fs.writeFileSync('bluewud-products.json', JSON.stringify(grouped, null, 2));
console.log('\n✅ Wrote to bluewud-products.json');
