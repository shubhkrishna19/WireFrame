import pandas as pd
import json
import os
import re

base_path = "C:/Users/shubh/Downloads/ecommerce-app/allproductdata"
images_base = "C:/Users/shubh/Downloads/ecommerce-app/public/products"
output_path = "C:/Users/shubh/Downloads/ecommerce-app/src/data"

print("Building image index...")
image_index = {}  # key -> list of image paths
folder_index = {} # folder_name -> list of image paths

# Walk through all product images
for root, dirs, files in os.walk(images_base):
    folder_name = os.path.basename(root).lower()
    
    for f in files:
        if not f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            continue
            
        rel_path = os.path.relpath(os.path.join(root, f), "C:/Users/shubh/Downloads/ecommerce-app/public")
        img_url = "/" + rel_path.replace("\\", "/")
        
        # Index by folder
        if folder_name not in folder_index:
            folder_index[folder_name] = []
        folder_index[folder_name].append(img_url)
        
        # Index by filename (without extension)
        fname = os.path.splitext(f)[0].upper()
        if fname not in image_index:
            image_index[fname] = []
        image_index[fname].append(img_url)
        
        # Index by SKU parts (e.g. SR-CLE from SR-CLE-W.jpg)
        parts = fname.split('-')
        if len(parts) >= 2:
            # Index SR-CLE
            key = "-".join(parts[:2])
            if key not in image_index:
                image_index[key] = []
            if img_url not in image_index[key]:
                image_index[key].append(img_url)
            
            # Index SR-CLE-W
            if len(parts) >= 3:
                key = "-".join(parts[:3])
                if key not in image_index:
                    image_index[key] = []
                if img_url not in image_index[key]:
                    image_index[key].append(img_url)

print(f"Indexed {len(image_index)} keys and {len(folder_index)} folders")

# Category mapping
CATEGORY_MAP = {
    "B-": {"id": "bedroom", "name": "Beds", "type": "bed"},
    "BT-": {"id": "bedroom", "name": "Bedside Tables", "type": "bedside-table"},
    "BS-": {"id": "study-office", "name": "Book Shelves", "type": "bookshelf"},
    "SB-": {"id": "study-office", "name": "Book Shelves", "type": "bookshelf"},
    "CT-": {"id": "living-room", "name": "Coffee Tables", "type": "coffee-table"},
    "DT-": {"id": "dining-kitchen", "name": "Dining Tables", "type": "dining-table"},
    "DR-": {"id": "bedroom", "name": "Dressing Tables", "type": "dressing-table"},
    "LT-": {"id": "study-office", "name": "Laptop Tables", "type": "laptop-table"},
    "RD-": {"id": "study-office", "name": "Laptop Tables", "type": "laptop-table"},
    "KR-": {"id": "dining-kitchen", "name": "Kitchen Racks", "type": "kitchen-rack"},
    "KH-": {"id": "decor", "name": "Key Holders", "type": "keyholder"},
    "CS-": {"id": "decor", "name": "Coasters", "type": "coaster"},
    "SR-": {"id": "decor", "name": "Shoe Racks", "type": "shoe-rack"},
    "TU-": {"id": "living-room", "name": "TV Units", "type": "tv-unit"},
    "W-": {"id": "bedroom", "name": "Wardrobes", "type": "wardrobe"},
    "ST-": {"id": "study-office", "name": "Study Tables", "type": "study-table"},
    "WS-": {"id": "decor", "name": "Wall Shelves", "type": "wall-shelf"},
    "MT-": {"id": "decor", "name": "Home Temples", "type": "home-temple"},
}

def get_category(sku):
    for prefix, info in CATEGORY_MAP.items():
        if sku.startswith(prefix):
            return info
    return {"id": "living-room", "name": "Furniture", "type": "furniture"}

def slugify(text):
    if pd.isna(text): return ""
    text = str(text).lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

def find_images(sku, mtp_sku, product_name, color):
    """
    Find images based on user logic:
    1. Child SKU (with color suffix) -> Display Image
    2. Parent SKU (without color suffix) -> Gallery Images
    3. Folder/Color matching
    """
    images = []
    sku = sku.upper()
    mtp_sku = mtp_sku.upper() if mtp_sku and pd.notna(mtp_sku) else ""
    
    # 1. Try Exact Child SKU Match (e.g. SR-CLE-MF)
    if sku in image_index:
        images.extend(image_index[sku])
    
    # 2. Try Parent SKU Match (e.g. SR-CLE)
    if mtp_sku and mtp_sku in image_index:
        for img in image_index[mtp_sku]:
            if img not in images:
                images.append(img)
                
    # 3. Try SKU without last part (e.g. SR-CLE from SR-CLE-MF)
    parts = sku.split('-')
    if len(parts) >= 2:
        parent_guess = "-".join(parts[:-1])
        if parent_guess in image_index:
            for img in image_index[parent_guess]:
                if img not in images:
                    images.append(img)
                    
    # 4. Try Folder Match by Product Name + Color
    if not images and product_name and pd.notna(product_name):
        name_lower = str(product_name).lower()
        color_lower = str(color).lower() if pd.notna(color) else ""
        
        # Find folders that contain parts of the product name
        name_parts = name_lower.split()
        potential_folders = []
        
        for folder in folder_index:
            # Check if folder matches product name (e.g. "Carlem" in "Carlem Shoe Rack")
            matches = 0
            for part in name_parts:
                if len(part) > 3 and part in folder:
                    matches += 1
            if matches > 0:
                potential_folders.append((folder, matches))
        
        # Sort by best match
        potential_folders.sort(key=lambda x: x[1], reverse=True)
        
        for folder, _ in potential_folders:
            folder_imgs = folder_index[folder]
            
            # If color is specified, look for color in filename
            if color_lower:
                color_matches = []
                for img in folder_imgs:
                    if color_lower in img.lower() or color_lower.replace(" ", "") in img.lower():
                        color_matches.append(img)
                
                if color_matches:
                    for img in color_matches:
                        if img not in images:
                            images.append(img)
                    continue # Found color matches in this folder, move to next
            
            # Add other images from folder
            for img in folder_imgs[:5]:
                if img not in images:
                    images.append(img)
    
    return images[:8]

def get_description(name, ptype, color, dims):
    dim_text = ""
    if dims and dims.get('length') and dims.get('width') and dims.get('height'):
        dim_text = f"\n\n**Dimensions:** {dims['length']}cm (L) × {dims['width']}cm (W) × {dims['height']}cm (H)"
    
    return f"Premium Bluewud {name} in {color}. Crafted with high-quality engineered wood.{dim_text}"

# Read data
print("Reading data...")
sku_df = pd.read_excel(f"{base_path}/SKU Aliases, Parent & Child Master Data (1).xlsx", header=0)
dim_df = pd.read_excel(f"{base_path}/Dimensions Master.xlsx", header=2)

dimensions_lookup = {}
for _, row in dim_df.iterrows():
    mtp = row.get('MTP SKU Code', '')
    if pd.notna(mtp):
        l, w, h = row.get('Lcm', 0), row.get('Bcm', 0), row.get('Hcm', 0)
        wt = row.get('PW(gm)', 0)
        dimensions_lookup[mtp] = {
            'length': int(l) if pd.notna(l) and l > 0 else None,
            'width': int(w) if pd.notna(w) and w > 0 else None,
            'height': int(h) if pd.notna(h) and h > 0 else None,
            'weight': round(wt / 1000, 2) if pd.notna(wt) and wt > 0 else None,
        }

products = []
product_id = 1
with_images = 0

for _, row in sku_df.iterrows():
    sku = row.get('SKU Code', '')
    if pd.isna(sku) or not sku:
        continue
    
    mtp_sku = row.get('MTP SKU', '')
    mtp_name = row.get('MTP Name', '')
    color = row.get(' Child Color', '')
    name = row.get('SKU Product Name', '')
    mrp = row.get('MRP', 0)
    
    if pd.isna(name) or not name:
        continue
    
    cat = get_category(sku)
    dims = dimensions_lookup.get(mtp_sku, {}) if pd.notna(mtp_sku) else {}
    dimensions = {'length': dims.get('length'), 'width': dims.get('width'), 'height': dims.get('height')}
    weight = dims.get('weight')
    
    images = find_images(sku, mtp_sku, mtp_name, color)
    if images:
        with_images += 1
    
    price = int(mrp) if pd.notna(mrp) and mrp > 0 else 4999
    original_price = int(price * 1.25)
    
    product = {
        "_id": f"prod-{product_id}",
        "name": f"Bluewud {name}" if "Bluewud" not in str(name) else str(name),
        "slug": slugify(name),
        "description": get_description(name, cat['type'], color if pd.notna(color) else 'Natural', dimensions),
        "categoryId": cat['id'],
        "category": cat['name'],
        "brand": "Bluewud",
        "sku": sku,
        "parentSku": mtp_sku if pd.notna(mtp_sku) else None,
        "price": price,
        "originalPrice": original_price,
        "discountPercentage": 20,
        "color": color if pd.notna(color) else "Natural Wood",
        "colors": [color] if pd.notna(color) else ["Natural Wood"],
        "sizes": ["Standard"],
        "thumbnail": images[0] if images else "/images/placeholder-furniture.jpg",
        "images": images if images else ["/images/placeholder-furniture.jpg"],
        "dimensions": dimensions if any(dimensions.values()) else None,
        "weight": weight,
        "rating": round(4.0 + (hash(sku) % 10) / 10, 1),
        "reviewCount": 10 + (hash(sku) % 190),
        "stock": 20 + (hash(sku) % 80),
        "isActive": True,
        "isFeatured": product_id <= 16,
        "isNew": product_id % 5 == 0,
        "tags": [cat['name'], "Bluewud", "Engineered Wood"],
        "material": "Engineered Wood",
        "finish": "Laminate",
        "specifications": {
            "material": "Engineered Wood",
            "finish": "Laminate",
            "style": "Modern",
            "color": color if pd.notna(color) else "Natural Wood",
            "dimensions": dimensions if any(v for v in dimensions.values() if v) else None,
            "weight": f"{weight} kg" if weight else None,
            "careInstructions": ["Wipe with dry cloth", "Avoid direct sunlight"],
            "countryOfOrigin": "India",
            "warranty": "1 Year Manufacturer Warranty",
        },
        "createdAt": "2024-01-15T00:00:00Z",
        "updatedAt": "2024-12-01T00:00:00Z"
    }
    
    products.append(product)
    product_id += 1

# Sort products: Products with images first, then those with placeholders
def product_sort_key(p):
    has_image = p['images'] and p['images'][0] != "/images/placeholder-furniture.jpg"
    return (not has_image, p['_id']) # False < True, so images come first

products.sort(key=product_sort_key)

print(f"\n=== RESULTS ===")
print(f"Total products: {len(products)}")
print(f"Products with images: {with_images} ({with_images*100//len(products)}%)")

# Export missing images report
missing_products = []
for p in products:
    if not p['images'] or p['images'][0] == "/images/placeholder-furniture.jpg":
        missing_products.append({
            "Product Name": p['name'],
            "SKU": p['sku'],
            "Parent SKU": p['parentSku'],
            "Color": p['color'],
            "Category": p['category']
        })

if missing_products:
    missing_df = pd.DataFrame(missing_products)
    missing_df.to_csv(f"{base_path}/missing_images_report.csv", index=False)
    print(f"Exported {len(missing_products)} missing products to missing_images_report.csv")

with open(f"{output_path}/bluewudProducts.json", 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Saved to bluewudProducts.json")
