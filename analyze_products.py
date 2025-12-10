import pandas as pd
import json
import os

base_path = "C:/Users/shubh/Downloads/ecommerce-app/allproductdata"

# Read SKU Master - skip rows to find header
sku_df = pd.read_excel(f"{base_path}/SKU Aliases, Parent & Child Master Data (1).xlsx", header=None)

# Print first 20 rows to understand structure
print("=== RAW SKU DATA (first 20 rows) ===")
for i in range(min(20, len(sku_df))):
    row = sku_df.iloc[i].tolist()
    non_null = [str(x) for x in row if pd.notna(x)]
    print(f"Row {i}: {non_null[:8]}")  # First 8 non-null values

print("\n=== DIMENSIONS DATA (first 20 rows) ===")
dim_df = pd.read_excel(f"{base_path}/Dimensions Master.xlsx", header=None)
for i in range(min(20, len(dim_df))):
    row = dim_df.iloc[i].tolist()
    non_null = [str(x) for x in row if pd.notna(x)]
    print(f"Row {i}: {non_null[:8]}")
