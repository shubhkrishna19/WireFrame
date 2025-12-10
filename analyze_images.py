import pandas as pd
import json
import os
import re
from pathlib import Path

base_path = "C:/Users/shubh/Downloads/ecommerce-app/allproductdata"
images_base = "C:/Users/shubh/Downloads/ecommerce-app/public/products"
output_path = "C:/Users/shubh/Downloads/ecommerce-app/src/data"

# First, build a comprehensive image index
print("=== BUILDING IMAGE INDEX ===")
all_images = []
for root, dirs, files in os.walk(images_base):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, "C:/Users/shubh/Downloads/ecommerce-app/public")
            img_url = "/" + rel_path.replace("\\", "/")
            
            # Extract SKU pattern from filename
            sku_match = re.match(r'^([A-Z0-9]+-[A-Z0-9]+(?:-[A-Z0-9]+)?)', f.upper())
            sku_prefix = sku_match.group(1) if sku_match else None
            
            all_images.append({
                'url': img_url,
                'filename': f,
                'folder': os.path.basename(root),
                'parent_folder': os.path.basename(os.path.dirname(root)),
                'sku_prefix': sku_prefix
            })

print(f"Total images: {len(all_images)}")

# Group images by SKU prefix
sku_to_images = {}
for img in all_images:
    if img['sku_prefix']:
        if img['sku_prefix'] not in sku_to_images:
            sku_to_images[img['sku_prefix']] = []
        sku_to_images[img['sku_prefix']].append(img['url'])

print(f"SKU patterns found: {len(sku_to_images)}")
print("Sample SKU patterns:", list(sku_to_images.keys())[:20])

# Group images by folder name
folder_to_images = {}
for img in all_images:
    folder = img['folder'].lower()
    if folder not in folder_to_images:
        folder_to_images[folder] = []
    folder_to_images[folder].append(img['url'])

print(f"\nFolders: {len(folder_to_images)}")
print("Folder names:", list(folder_to_images.keys())[:30])
