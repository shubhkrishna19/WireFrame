import pandas as pd

file_path = 'fullreport.xlsm'

# Read Images sheet
print("=" * 80)
print("IMAGES SHEET:")
print("=" * 80)
try:
    images_df = pd.read_excel(file_path, sheet_name='Images', engine='openpyxl')
    print(f"Rows: {len(images_df)}")
    print(f"Columns: {list(images_df.columns)}")
    print("\nFirst 5 rows:")
    print(images_df.head(5))
except Exception as e:
    print(f"Error: {e}")

# Read Data Definitions sheet
print("\n" + "=" * 80)
print("DATA DEFINITIONS SHEET:")
print("=" * 80)
try:
    data_def_df = pd.read_excel(file_path, sheet_name='Data Definitions', engine='openpyxl')
    print(f"Rows: {len(data_def_df)}")
    print(f"Columns: {list(data_def_df.columns)}")
    print("\nFirst 5 rows:")
    print(data_def_df.head(5))
except Exception as e:
    print(f"Error: {e}")

# Read Template sheet (first 20 columns only)
print("\n" + "=" * 80)
print("TEMPLATE SHEET (Sample):")
print("=" * 80)
try:
    template_df = pd.read_excel(file_path, sheet_name='Template', engine='openpyxl', nrows=10)
    print(f"Total Rows: 745")
    print(f"Total Columns: 931")
    print(f"\nFirst 20 column names:")
    for i, col in enumerate(template_df.columns[:20], 1):
        print(f"  {i}. {col}")
    print("\nFirst 3 rows (first 10 columns):")
    print(template_df.iloc[:3, :10])
except Exception as e:
    print(f"Error: {e}")
