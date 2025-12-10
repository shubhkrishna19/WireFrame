import json

with open('products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total products in JSON: {len(data)}")
print(f"\nLast 3 products:")
for p in data[-3:]:
    print(f"  - {p['name']} ({p['code']}) - Rs.{p['price']}")
