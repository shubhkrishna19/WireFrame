import pandas as pd
import json
import re

print("Loading CSV...")
df = pd.read_csv('Productslist.csv')
df = df[df['Product Active'] == True]

print(f"Found {len(df)} active products")

products = []
for idx, row in df.iterrows():
    code = str(row.get('Product Code', ''))
    if code in ['', '----', '---', 'nan'] or pd.isna(row.get('Product Code')):
        continue
    
    name = str(row.get('Product Name', ''))
    if '$' in name or name == 'nan':
        continue
    
    price = row.get('Unit Price', 0)
    if not price or price == 0 or pd.isna(price):
        continue
    
    # Clean slug
    slug = re.sub(r'[^\w\s-]', '', name.lower())
    slug = re.sub(r'[\s_]+', '-', slug).strip('-')[:100]
    
    products.append({
        '_id': f'prod-{len(products)+1}',
        'name': name,
        'code': code,
        'slug': slug,
        'description': f'{name} - Premium Bluewud furniture',
        'price': int(price),
        'brand': 'Bluewud',
        'stock': 10,
        'isActive': True,
        'isFeatured': False,
        'rating': 4.5,
        'reviewCount': 50,
        'category': 'living-room',
        'subCategory': 'Furniture',
        'images': [
            f'https://placehold.co/1200x1200/8B4513/FFFFFF?text={code}',
            f'https://placehold.co/1200x1200/A0826D/FFFFFF?text={code}-2',
            f'https://placehold.co/1200x1200/8B7355/FFFFFF?text={code}-3'
        ],
        'thumbnail': f'https://placehold.co/800x800/8B4513/FFFFFF?text={code}',
        'tags': ['Furniture', 'Bluewud'],
        'colorFinish': 'Brown Maple',
        'specifications': {
            'material': 'Engineered Wood',
            'warranty': '1 Year'
        }
    })

print(f"\nExtracted {len(products)} products")

with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Saved to products.json")
print("\nSample products:")
for i, p in enumerate(products[:5], 1):
    print(f"{i}. {p['name'][:50]} - Rs.{p['price']}")
