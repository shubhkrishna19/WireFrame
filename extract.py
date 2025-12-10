import pandas as pd
import json
import re

df = pd.read_csv('Productslist.csv')
df = df[df['Product Active'] == True]

products = []
for idx, row in df.iterrows():
    code = str(row.get('Product Code', ''))
    if code in ['', '----', '---'] or pd.isna(row.get('Product Code')):
        continue
    
    name = str(row.get('Product Name', ''))
    if '$' in name or name == 'nan':
        continue
    
    price = row.get('Unit Price', 0)
    if not price or price == 0:
        continue
    
    slug = re.sub(r'[^\w\s-]', '', name.lower())
    slug = re.sub(r'[\s_]+', '-', slug)[:100]
    
    products.append({
        '_id': f'prod-{len(products)+1}',
        'name': name,
        'code': code,
        'slug': slug,
        'price': int(price),
        'brand': 'Bluewud',
        'stock': 10,
        'isActive': True,
        'rating': 4.5,
        'reviewCount': 50,
        'category': 'living-room',
        'images': [f'https://placehold.co/800x800/8B4513/FFF?text={code}'],
        'thumbnail': f'https://placehold.co/800x800/8B4513/FFF?text={code}'
    })

with open('products.json', 'w') as f:
    json.dump(products, f, indent=2)

print(f'Extracted {len(products)} products')
for p in products[:3]:
    print(f'{p[\"name\"]} - ₹{p[\"price\"]}')
