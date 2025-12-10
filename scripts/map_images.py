import os
import json
import re

# Paths
PUBLIC_IMAGES_DIR = r"C:\Users\shubh\Downloads\ecommerce-app\public\images\products"
PRODUCTS_FILE = r"C:\Users\shubh\Downloads\ecommerce-app\src\data\bluewudProducts.json"

def get_image_map():
    image_map = {}
    
    # Walk through the public images directory
    for root, dirs, files in os.walk(PUBLIC_IMAGES_DIR):
        category = os.path.basename(root)
        
        # Skip the root dir itself
        if root == PUBLIC_IMAGES_DIR:
            continue
            
        valid_images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        if valid_images:
            image_map[category] = [os.path.join("/images/products", category, img).replace("\\", "/") for img in valid_images]
            
    return image_map

def update_products():
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            products = json.load(f)
            
        image_map = get_image_map()
        print(f"Found images for categories: {list(image_map.keys())}")
        
        updated_count = 0
        
        for product in products:
            # Try to match product category/name to image folders
            category = product.get('category', '')
            name = product.get('name', '')
            
            # Simple matching logic - can be improved
            matched_images = []
            
            # Direct category match?
            if category in image_map:
                matched_images = image_map[category]
            else:
                # Fuzzy match category
                for img_cat in image_map:
                    if img_cat.lower() in category.lower() or category.lower() in img_cat.lower():
                        matched_images = image_map[img_cat]
                        break
            
            if matched_images:
                # Assign random images from the category validation set for now if no specific product match
                # ideally we would match product name to filename
                
                # Determine primary image
                primary_image = matched_images[0]
                
                # Update product
                product['image'] = primary_image
                product['images'] = matched_images[:4] # Take up to 4 images
                updated_count += 1
                
        # Write back
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2)
            
        print(f"Updated {updated_count} products with real images.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_products()
