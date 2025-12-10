import pandas as pd
import json
import re

df = pd.read_csv('Productslist.csv')
df = df[df['Product Active'] == True]

# Extract base product name (remove size/color info)
def get_base_name(name):
    if pd.isna(name):
        return ''
    # Remove common size variants
    name = str(name)
    name = re.sub(r'\b(King|Queen|Single|Double)\b', '', name, flags=re.IGNORECASE)
    # Remove color/finish variants
    name = re.sub(r'\b(Wenge|Brown Maple|Beige|White|Natural|Oak|Walnut)\b', '', name, flags=re.IGNORECASE)
    # Remove & and extra spaces
    name = re.sub(r'\s*&\s*', ' ', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name

df['base_name'] = df['Product Name'].apply(get_base_name)

# Group by base name
print("=== PRODUCT ANALYSIS ===")
print(f"Total active products: {len(df)}")
print(f"Unique product codes: {df['Product Code'].nunique()}")
print(f"Unique full names: {df['Product Name'].nunique()}")
print(f"Unique base products: {df['base_name'].nunique()}")

# Show product families
print("\n=== TOP 10 PRODUCT FAMILIES ===")
family_counts = df.groupby('base_name').size().sort_values(ascending=False).head(10)
for name, count in family_counts.items():
    print(f"{name}: {count} variants")

# Show what "Maltein" products we have
print("\n=== MALTEIN PRODUCTS (Example) ===")
maltein = df[df['Product Name'].str.contains('Maltein', case=False, na=False)]
print(maltein[['Product Code', 'Product Name', 'Unit Price']].to_string())

# Create true unique list - one product per base name, picking the most common variant
unique_products = df.sort_values('Unit Price').groupby('base_name', as_index=False).first()
print(f"\n=== TRUE UNIQUE PRODUCTS ===")
print(f"Count: {len(unique_products)}")

# Save
unique_products.to_csv('unique_products_deduplicated.csv', index=False)
print(f"Saved to unique_products_deduplicated.csv")
