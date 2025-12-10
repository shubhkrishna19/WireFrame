import pandas as pd
import json

# Load the CSV
df = pd.read_csv('Productslist.csv')
df = df[df['Product Active'] == True]

print(f"Total active rows: {len(df)}")

# Check for duplicates by product code
print(f"\nUnique product codes: {df['Product Code'].nunique()}")
print(f"Duplicate product codes: {len(df) - df['Product Code'].nunique()}")

# Check for duplicates by product name
print(f"\nUnique product names: {df['Product Name'].nunique()}")
print(f"Duplicate product names: {len(df) - df['Product Name'].nunique()}")

# Show some duplicate examples
print("\n=== DUPLICATE PRODUCT CODES ===")
duplicates = df[df.duplicated(subset=['Product Code'], keep=False)]
if len(duplicates) > 0:
    print(duplicates[['Product Code', 'Product Name', 'Unit Price']].head(10))
else:
    print("No duplicates by product code")

print("\n=== DUPLICATE PRODUCT NAMES ===")
name_dupes = df[df.duplicated(subset=['Product Name'], keep=False)]
if len(name_dupes) > 0:
    print(name_dupes[['Product Code', 'Product Name', 'Unit Price']].head(10))
else:
    print("No duplicates by product name")

# Deduplicate strategy: Keep first occurrence of each product code
df_clean = df.drop_duplicates(subset=['Product Code'], keep='first')
print(f"\n=== AFTER DEDUPLICATION ===")
print(f"Unique products: {len(df_clean)}")

# Save cleaned list
df_clean.to_csv('products_clean.csv', index=False)
print(f"\nSaved {len(df_clean)} unique products to products_clean.csv")
