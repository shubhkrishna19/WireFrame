import pandas as pd
import json
import os

base_path = "C:/Users/shubh/Downloads/ecommerce-app/allproductdata"

# Read SKU Master
sku_df = pd.read_excel(f"{base_path}/SKU Aliases, Parent & Child Master Data (1).xlsx", header=0)

print("=== ALL COLUMNS ===")
cols = list(sku_df.columns)
for i, col in enumerate(cols):
    print(f"{i}: {col}")

print("\n\n=== SAMPLE ROWS (first 5) ===")
for i in range(min(5, len(sku_df))):
    print(f"\n--- Row {i} ---")
    for col in cols[:15]:  # First 15 columns
        val = sku_df.iloc[i][col]
        if pd.notna(val):
            print(f"  {col}: {val}")
