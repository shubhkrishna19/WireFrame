# Zoho Price Tracker Implementation Guide
## Complete Deluge Script for Price Calculation & Tracking

**Version:** 1.0  
**Updated:** November 2025  
**Platform:** Zoho CRM/Inventory + Deluge Scripting

---

## TABLE OF CONTENTS

1. [Price Calculation Components](#price-calculation-components)
2. [Data Sources in Zoho](#data-sources-in-zoho)
3. [Price Calculation Formula](#price-calculation-formula)
4. [Deluge Implementation](#deluge-implementation)
5. [Data Sync Locations](#data-sync-locations)
6. [Complete Deluge Script](#complete-deluge-script)
7. [Testing & Validation](#testing--validation)

---

## PRICE CALCULATION COMPONENTS

### 1. Base Price Components

```
┌─────────────────────────────────────────────────────────┐
│              PRICE CALCULATION TREE                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. BASE PRODUCT PRICE                                  │
│     ├── Standard Price (from Products module)          │
│     ├── Cost Price (for margin calculation)             │
│     └── List Price (MSRP/MRP)                           │
│                                                          │
│  2. DISCOUNTS & MARKDOWNS                               │
│     ├── Product-level Discount (%)                      │
│     ├── Category Discount (%)                           │
│     ├── Promotional Discount (fixed/%)                  │
│     ├── Seasonal Discount                               │
│     ├── Bulk Quantity Discount                          │
│     └── Customer Segment Discount                       │
│                                                          │
│  3. TAXES & DUTIES                                      │
│     ├── GST (18% for India)                             │
│     ├── State Tax (if applicable)                       │
│     ├── Import Duty (if applicable)                     │
│     └── Service Tax (if applicable)                     │
│                                                          │
│  4. SHIPPING & HANDLING                                 │
│     ├── Shipping Cost (based on location)               │
│     ├── Handling Fee                                    │
│     ├── Packaging Cost                                  │
│     └── Express Delivery Surcharge                      │
│                                                          │
│  5. CURRENCY CONVERSION                                 │
│     ├── Base Currency (INR)                             │
│     ├── Exchange Rate (if multi-currency)               │
│     └── Currency Conversion Fee                         │
│                                                          │
│  6. CUSTOMER-SPECIFIC PRICING                           │
│     ├── Price List Assignment                           │
│     ├── Contract Pricing                                │
│     ├── Volume Discounts                                │
│     └── Loyalty Discounts                              │
│                                                          │
│  7. FINAL PRICE CALCULATION                             │
│     └── Final Price = (Base - Discounts) + Taxes +      │
│                       Shipping + Currency Adjustments    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 2. Data Branches Required

#### Branch 1: Product Data
- Product ID/SKU
- Base Price
- Cost Price
- List Price (MRP)
- Product Category
- Product Brand
- Stock Status
- Product Status (Active/Inactive)

#### Branch 2: Discount Data
- Product Discount Percentage
- Category Discount Rules
- Promotional Campaigns (Active)
- Bulk Pricing Tiers
- Customer Segment Discounts
- Seasonal Discount Rules

#### Branch 3: Tax Data
- Tax Rate (GST %)
- Tax Category
- Tax Exemption Rules
- State-specific Tax Rules

#### Branch 4: Shipping Data
- Shipping Zone (based on delivery address)
- Shipping Method (Standard/Express)
- Shipping Cost Rules
- Free Shipping Threshold
- Handling Fees

#### Branch 5: Customer Data
- Customer ID
- Customer Segment/Tier
- Price List Assignment
- Contract Pricing (if applicable)
- Location/State (for tax calculation)

#### Branch 6: Order Context
- Quantity Ordered
- Delivery Address
- Payment Method
- Order Date (for seasonal pricing)

---

## DATA SOURCES IN ZOHO

### Where to Fetch Data From

#### 1. Products Module (Zoho Inventory/CRM)
```
Module: Products
Fields to Fetch:
- Product ID (id)
- Product Name (Product_Name)
- SKU (SKU)
- Base Price (Unit_Price or Price)
- Cost Price (Cost_Price)
- List Price (List_Price or MRP)
- Category (Product_Category)
- Brand (Brand)
- Stock Quantity (Quantity_in_Stock)
- Product Status (Product_Status)
- Discount Percentage (Discount_Percentage)
- Tax Rate (Tax_Rate)
```

#### 2. Price Lists Module (Zoho Inventory)
```
Module: Price_Lists
Fields to Fetch:
- Price List Name
- Customer Assignment
- Product Price Override
- Discount Rules
- Valid From/To Dates
```

#### 3. Discounts/Promotions Module
```
Module: Discounts or Custom Module
Fields to Fetch:
- Discount Name
- Discount Type (Percentage/Fixed)
- Discount Value
- Applicable Products/Categories
- Valid From/To Dates
- Minimum Order Value
- Customer Segment
```

#### 4. Taxes Module
```
Module: Taxes (Zoho Inventory Settings)
Fields to Fetch:
- Tax Name (e.g., "GST")
- Tax Rate (18%)
- Tax Type (GST, VAT, etc.)
- Applicable States
```

#### 5. Shipping Rules Module
```
Module: Shipping_Rules or Custom Module
Fields to Fetch:
- Shipping Zone
- Shipping Method
- Base Shipping Cost
- Per Unit Shipping Cost
- Free Shipping Threshold
- Handling Fee
```

#### 6. Customers Module
```
Module: Contacts or Accounts
Fields to Fetch:
- Customer ID
- Customer Segment (Customer_Segment)
- Price List Assignment
- Shipping Address
- Billing State (for tax)
- Customer Tier (Gold/Silver/Bronze)
```

---

## PRICE CALCULATION FORMULA

### Step-by-Step Calculation

```
STEP 1: Get Base Price
Base_Price = Product.Unit_Price

STEP 2: Apply Product-Level Discount
Discounted_Price = Base_Price * (1 - Product.Discount_Percentage / 100)

STEP 3: Apply Category Discount (if applicable)
Category_Discount = GetCategoryDiscount(Product.Category)
Discounted_Price = Discounted_Price * (1 - Category_Discount / 100)

STEP 4: Apply Promotional Discount
Promo_Discount = GetActivePromotion(Product.ID, Order_Date)
If Promo_Discount exists:
    Discounted_Price = Discounted_Price - Promo_Discount.Value

STEP 5: Apply Customer-Specific Pricing
If Customer.Price_List exists:
    Price_Override = GetPriceListPrice(Product.ID, Customer.Price_List)
    If Price_Override exists:
        Discounted_Price = Price_Override

STEP 6: Apply Bulk Quantity Discount
If Quantity >= Bulk_Tier.Min_Quantity:
    Bulk_Discount = GetBulkDiscount(Quantity)
    Discounted_Price = Discounted_Price * (1 - Bulk_Discount / 100)

STEP 7: Calculate Subtotal
Subtotal = Discounted_Price * Quantity

STEP 8: Calculate Tax
Tax_Rate = GetTaxRate(Product.Tax_Category, Customer.State)
Tax_Amount = Subtotal * (Tax_Rate / 100)

STEP 9: Calculate Shipping
Shipping_Cost = GetShippingCost(
    Customer.Shipping_Address,
    Shipping_Method,
    Subtotal
)

STEP 10: Calculate Final Price
Final_Price = Subtotal + Tax_Amount + Shipping_Cost

STEP 11: Round to 2 Decimal Places
Final_Price = Round(Final_Price, 2)
```

---

## DATA SYNC LOCATIONS

### Where to Store Final Price

#### Option 1: Products Module (Recommended)
```
Field: Final_Price (Custom Field)
Field: Calculated_Price (Custom Field)
Field: Last_Price_Update (Date/Time Field)
Field: Price_Calculation_Log (Long Text Field - for debugging)

Update Frequency: 
- On Product Update
- On Discount Change
- On Tax Rate Change
- Scheduled (Daily/Hourly)
```

#### Option 2: Price History Module (Custom Module)
```
Create Custom Module: Price_History
Fields:
- Product (Lookup to Products)
- Base_Price
- Discount_Amount
- Tax_Amount
- Shipping_Cost
- Final_Price
- Calculated_Date
- Calculation_Details (JSON)
- Customer_Segment (if customer-specific)
```

#### Option 3: Orders/Quotes Module
```
When creating Order/Quote:
- Store Final_Price in Order/Quote record
- Store Price_Breakdown (JSON) for audit trail
- Store Calculation_Timestamp
```

#### Option 4: Real-time Calculation (No Storage)
```
Calculate on-the-fly when:
- Displaying product in catalog
- Adding to cart
- Creating quote
- Generating invoice

Store only in:
- Cart Items
- Quotes
- Orders
- Invoices
```

---

## COMPLETE DELUGE SCRIPT

### Script 1: Main Price Calculation Function

```deluge
// ============================================
// MAIN PRICE CALCULATION FUNCTION
// ============================================
// Function: calculateFinalPrice
// Parameters: productId, customerId, quantity, shippingAddress, shippingMethod
// Returns: Map with price breakdown

calculateFinalPrice = map();
priceBreakdown = map();

try {
    // ============================================
    // STEP 1: FETCH PRODUCT DATA
    // ============================================
    productInfo = zoho.crm.getRecordById("Products", productId);
    
    if(productInfo.isEmpty()) {
        return {"error": "Product not found", "code": "PRODUCT_NOT_FOUND"};
    }
    
    basePrice = productInfo.get("Unit_Price");
    costPrice = productInfo.get("Cost_Price");
    listPrice = productInfo.get("List_Price");
    productCategory = productInfo.get("Product_Category");
    productBrand = productInfo.get("Brand");
    productDiscount = productInfo.get("Discount_Percentage");
    taxCategory = productInfo.get("Tax_Category");
    stockQuantity = productInfo.get("Quantity_in_Stock");
    
    // Validate base price
    if(basePrice == null || basePrice <= 0) {
        return {"error": "Invalid product price", "code": "INVALID_PRICE"};
    }
    
    priceBreakdown.put("base_price", basePrice);
    priceBreakdown.put("list_price", listPrice);
    priceBreakdown.put("cost_price", costPrice);
    
    // ============================================
    // STEP 2: FETCH CUSTOMER DATA
    // ============================================
    customerInfo = map();
    customerSegment = "";
    priceListId = "";
    customerState = "";
    
    if(customerId != null && customerId != "") {
        customerInfo = zoho.crm.getRecordById("Contacts", customerId);
        
        if(!customerInfo.isEmpty()) {
            customerSegment = customerInfo.get("Customer_Segment");
            priceListId = customerInfo.get("Price_List");
            customerState = customerInfo.get("Mailing_State");
        }
    }
    
    priceBreakdown.put("customer_segment", customerSegment);
    
    // ============================================
    // STEP 3: APPLY PRODUCT-LEVEL DISCOUNT
    // ============================================
    discountedPrice = basePrice;
    
    if(productDiscount != null && productDiscount > 0) {
        discountAmount = basePrice * (productDiscount / 100);
        discountedPrice = basePrice - discountAmount;
        priceBreakdown.put("product_discount_percent", productDiscount);
        priceBreakdown.put("product_discount_amount", discountAmount);
    } else {
        priceBreakdown.put("product_discount_percent", 0);
        priceBreakdown.put("product_discount_amount", 0);
    }
    
    priceBreakdown.put("price_after_product_discount", discountedPrice);
    
    // ============================================
    // STEP 4: APPLY CATEGORY DISCOUNT
    // ============================================
    categoryDiscount = getCategoryDiscount(productCategory, customerSegment);
    
    if(categoryDiscount > 0) {
        categoryDiscountAmount = discountedPrice * (categoryDiscount / 100);
        discountedPrice = discountedPrice - categoryDiscountAmount;
        priceBreakdown.put("category_discount_percent", categoryDiscount);
        priceBreakdown.put("category_discount_amount", categoryDiscountAmount);
    } else {
        priceBreakdown.put("category_discount_percent", 0);
        priceBreakdown.put("category_discount_amount", 0);
    }
    
    priceBreakdown.put("price_after_category_discount", discountedPrice);
    
    // ============================================
    // STEP 5: APPLY PRICE LIST OVERRIDE
    // ============================================
    if(priceListId != null && priceListId != "") {
        priceListPrice = getPriceListPrice(productId, priceListId);
        
        if(priceListPrice != null && priceListPrice > 0) {
            discountedPrice = priceListPrice;
            priceBreakdown.put("price_list_override", true);
            priceBreakdown.put("price_list_price", priceListPrice);
        } else {
            priceBreakdown.put("price_list_override", false);
        }
    } else {
        priceBreakdown.put("price_list_override", false);
    }
    
    priceBreakdown.put("unit_price_after_discounts", discountedPrice);
    
    // ============================================
    // STEP 6: APPLY PROMOTIONAL DISCOUNTS
    // ============================================
    promoDiscount = getActivePromotionDiscount(productId, productCategory, today);
    
    if(promoDiscount > 0) {
        discountedPrice = discountedPrice - promoDiscount;
        priceBreakdown.put("promotional_discount", promoDiscount);
    } else {
        priceBreakdown.put("promotional_discount", 0);
    }
    
    priceBreakdown.put("unit_price_after_promotions", discountedPrice);
    
    // ============================================
    // STEP 7: APPLY BULK QUANTITY DISCOUNT
    // ============================================
    if(quantity != null && quantity > 1) {
        bulkDiscount = getBulkQuantityDiscount(quantity);
        
        if(bulkDiscount > 0) {
            bulkDiscountAmount = discountedPrice * (bulkDiscount / 100);
            discountedPrice = discountedPrice - bulkDiscountAmount;
            priceBreakdown.put("bulk_discount_percent", bulkDiscount);
            priceBreakdown.put("bulk_discount_amount", bulkDiscountAmount);
        } else {
            priceBreakdown.put("bulk_discount_percent", 0);
            priceBreakdown.put("bulk_discount_amount", 0);
        }
    } else {
        priceBreakdown.put("bulk_discount_percent", 0);
        priceBreakdown.put("bulk_discount_amount", 0);
    }
    
    priceBreakdown.put("final_unit_price", discountedPrice);
    
    // ============================================
    // STEP 8: CALCULATE SUBTOTAL
    // ============================================
    quantity = (quantity != null && quantity > 0) ? quantity : 1;
    subtotal = discountedPrice * quantity;
    priceBreakdown.put("quantity", quantity);
    priceBreakdown.put("subtotal", subtotal);
    
    // ============================================
    // STEP 9: CALCULATE TAX
    // ============================================
    taxRate = getTaxRate(taxCategory, customerState);
    taxAmount = subtotal * (taxRate / 100);
    
    priceBreakdown.put("tax_rate", taxRate);
    priceBreakdown.put("tax_amount", taxAmount);
    
    // ============================================
    // STEP 10: CALCULATE SHIPPING
    // ============================================
    shippingCost = getShippingCost(shippingAddress, shippingMethod, subtotal);
    
    priceBreakdown.put("shipping_method", shippingMethod);
    priceBreakdown.put("shipping_cost", shippingCost);
    
    // ============================================
    // STEP 11: CALCULATE FINAL PRICE
    // ============================================
    finalPrice = subtotal + taxAmount + shippingCost;
    finalPrice = round(finalPrice, 2);
    
    priceBreakdown.put("final_price", finalPrice);
    priceBreakdown.put("currency", "INR");
    priceBreakdown.put("calculated_at", zoho.currenttime.toString());
    
    // ============================================
    // STEP 12: CALCULATE MARGIN
    // ============================================
    if(costPrice != null && costPrice > 0) {
        margin = ((discountedPrice - costPrice) / discountedPrice) * 100;
        marginAmount = discountedPrice - costPrice;
        priceBreakdown.put("margin_percent", round(margin, 2));
        priceBreakdown.put("margin_amount", marginAmount);
    }
    
    // ============================================
    // STEP 13: RETURN RESULT
    // ============================================
    return {
        "success": true,
        "final_price": finalPrice,
        "price_breakdown": priceBreakdown,
        "product_id": productId,
        "customer_id": customerId
    };
    
} catch (e) {
    return {
        "success": false,
        "error": e.toString(),
        "code": "CALCULATION_ERROR"
    };
}
```

### Script 2: Helper Functions

```deluge
// ============================================
// HELPER FUNCTION: Get Category Discount
// ============================================
getCategoryDiscount = function(category, customerSegment) {
    try {
        // Search for category discount rules
        searchCriteria = "(Category:equals:" + category + ")";
        
        if(customerSegment != null && customerSegment != "") {
            searchCriteria = searchCriteria + "and(Customer_Segment:equals:" + customerSegment + ")";
        }
        
        discountRecords = zoho.crm.searchRecords("Discounts", searchCriteria);
        
        if(discountRecords.size() > 0) {
            // Get the highest discount
            maxDiscount = 0;
            for each discount in discountRecords {
                discountValue = discount.get("Discount_Percentage");
                validFrom = discount.get("Valid_From");
                validTo = discount.get("Valid_To");
                isActive = discount.get("Active");
                
                // Check if discount is currently valid
                if(isActive == true) {
                    if(validFrom != null && today < validFrom) {
                        continue;
                    }
                    if(validTo != null && today > validTo) {
                        continue;
                    }
                    
                    if(discountValue > maxDiscount) {
                        maxDiscount = discountValue;
                    }
                }
            }
            return maxDiscount;
        }
        
        return 0;
    } catch (e) {
        return 0;
    }
};

// ============================================
// HELPER FUNCTION: Get Price List Price
// ============================================
getPriceListPrice = function(productId, priceListId) {
    try {
        // In Zoho Inventory, price lists are linked differently
        // This is a simplified version - adjust based on your setup
        
        priceListInfo = zoho.crm.getRecordById("Price_Lists", priceListId);
        
        if(priceListInfo.isEmpty()) {
            return null;
        }
        
        // Get product price from price list
        // Note: This depends on your Zoho setup
        // You may need to query a junction object or custom module
        
        return null; // Implement based on your structure
    } catch (e) {
        return null;
    }
};

// ============================================
// HELPER FUNCTION: Get Active Promotion Discount
// ============================================
getActivePromotionDiscount = function(productId, category, currentDate) {
    try {
        discountAmount = 0;
        
        // Search for active promotions
        searchCriteria = "(Status:equals:Active)";
        promotions = zoho.crm.searchRecords("Promotions", searchCriteria);
        
        for each promo in promotions {
            validFrom = promo.get("Start_Date");
            validTo = promo.get("End_Date");
            promoType = promo.get("Discount_Type");
            promoValue = promo.get("Discount_Value");
            applicableProducts = promo.get("Applicable_Products");
            applicableCategories = promo.get("Applicable_Categories");
            
            // Check date validity
            if(validFrom != null && currentDate < validFrom) {
                continue;
            }
            if(validTo != null && currentDate > validTo) {
                continue;
            }
            
            // Check if product/category is applicable
            isApplicable = false;
            
            if(applicableProducts != null) {
                productList = applicableProducts.split(",");
                for each pid in productList {
                    if(pid.trim() == productId) {
                        isApplicable = true;
                        break;
                    }
                }
            }
            
            if(!isApplicable && applicableCategories != null) {
                categoryList = applicableCategories.split(",");
                for each cat in categoryList {
                    if(cat.trim() == category) {
                        isApplicable = true;
                        break;
                    }
                }
            }
            
            if(isApplicable) {
                if(promoType == "Percentage") {
                    // This will be applied as percentage in main function
                    // For now, return 0 and handle in main calculation
                    return 0;
                } else if(promoType == "Fixed") {
                    discountAmount = discountAmount + promoValue;
                }
            }
        }
        
        return discountAmount;
    } catch (e) {
        return 0;
    }
};

// ============================================
// HELPER FUNCTION: Get Bulk Quantity Discount
// ============================================
getBulkQuantityDiscount = function(quantity) {
    try {
        // Define bulk discount tiers
        // Adjust these based on your business rules
        
        if(quantity >= 100) {
            return 15; // 15% discount for 100+ units
        } else if(quantity >= 50) {
            return 10; // 10% discount for 50+ units
        } else if(quantity >= 20) {
            return 5;  // 5% discount for 20+ units
        } else if(quantity >= 10) {
            return 3;  // 3% discount for 10+ units
        }
        
        return 0;
    } catch (e) {
        return 0;
    }
};

// ============================================
// HELPER FUNCTION: Get Tax Rate
// ============================================
getTaxRate = function(taxCategory, customerState) {
    try {
        // Default GST rate for India
        defaultTaxRate = 18.0;
        
        if(taxCategory == null || taxCategory == "") {
            return defaultTaxRate;
        }
        
        // Search for tax rules
        searchCriteria = "(Tax_Category:equals:" + taxCategory + ")";
        
        if(customerState != null && customerState != "") {
            searchCriteria = searchCriteria + "and(State:equals:" + customerState + ")";
        }
        
        taxRecords = zoho.crm.searchRecords("Taxes", searchCriteria);
        
        if(taxRecords.size() > 0) {
            taxRecord = taxRecords.get(0);
            taxRate = taxRecord.get("Tax_Rate");
            
            if(taxRate != null && taxRate > 0) {
                return taxRate;
            }
        }
        
        return defaultTaxRate;
    } catch (e) {
        return 18.0; // Default 18% GST
    }
};

// ============================================
// HELPER FUNCTION: Get Shipping Cost
// ============================================
getShippingCost = function(shippingAddress, shippingMethod, subtotal) {
    try {
        // Free shipping threshold
        freeShippingThreshold = 2000; // ₹2000
        baseShippingCost = 0;
        
        // Check if free shipping applies
        if(subtotal >= freeShippingThreshold) {
            return 0;
        }
        
        // Get shipping zone from address
        shippingZone = getShippingZone(shippingAddress);
        
        // Base shipping costs by method
        if(shippingMethod == "Standard") {
            if(shippingZone == "Zone_1") {
                baseShippingCost = 50; // Local
            } else if(shippingZone == "Zone_2") {
                baseShippingCost = 100; // Regional
            } else if(shippingZone == "Zone_3") {
                baseShippingCost = 150; // National
            } else {
                baseShippingCost = 200; // Remote
            }
        } else if(shippingMethod == "Express") {
            if(shippingZone == "Zone_1") {
                baseShippingCost = 100;
            } else if(shippingZone == "Zone_2") {
                baseShippingCost = 200;
            } else if(shippingZone == "Zone_3") {
                baseShippingCost = 300;
            } else {
                baseShippingCost = 500;
            }
        }
        
        return baseShippingCost;
    } catch (e) {
        return 0;
    }
};

// ============================================
// HELPER FUNCTION: Get Shipping Zone
// ============================================
getShippingZone = function(address) {
    try {
        // Extract state/city from address
        // This is simplified - adjust based on your address structure
        
        if(address.contains("Delhi") || address.contains("Mumbai") || address.contains("Bangalore")) {
            return "Zone_1"; // Metro cities
        } else if(address.contains("Punjab") || address.contains("Haryana") || address.contains("Uttar Pradesh")) {
            return "Zone_2"; // Nearby states
        } else {
            return "Zone_3"; // Rest of India
        }
    } catch (e) {
        return "Zone_3";
    }
};
```

### Script 3: Update Product Final Price (Scheduled Function)

```deluge
// ============================================
// SCHEDULED FUNCTION: Update All Product Prices
// ============================================
// Run this function on a schedule (daily/hourly)
// to update final prices for all products

updateAllProductPrices = function() {
    try {
        // Get all active products
        searchCriteria = "(Product_Status:equals:Active)";
        products = zoho.crm.searchRecords("Products", searchCriteria);
        
        updateCount = 0;
        errorCount = 0;
        
        info "Starting price update for " + products.size() + " products";
        
        for each product in products {
            try {
                productId = product.get("id");
                
                // Calculate final price (without customer-specific pricing)
                priceResult = calculateFinalPrice(productId, null, 1, "", "Standard");
                
                if(priceResult.get("success") == true) {
                    finalPrice = priceResult.get("final_price");
                    priceBreakdown = priceResult.get("price_breakdown");
                    
                    // Update product record
                    updateData = map();
                    updateData.put("Final_Price", finalPrice);
                    updateData.put("Calculated_Price", finalPrice);
                    updateData.put("Last_Price_Update", zoho.currenttime);
                    updateData.put("Price_Calculation_Log", priceBreakdown.toString());
                    
                    updateResponse = zoho.crm.updateRecord("Products", productId, updateData);
                    
                    if(updateResponse.get("id") != null) {
                        updateCount = updateCount + 1;
                    } else {
                        errorCount = errorCount + 1;
                        info "Failed to update product: " + productId;
                    }
                } else {
                    errorCount = errorCount + 1;
                    info "Price calculation failed for product: " + productId + " - " + priceResult.get("error");
                }
                
                // Add delay to avoid API limits
                sleep(500); // 500ms delay between updates
                
            } catch (e) {
                errorCount = errorCount + 1;
                info "Error processing product " + productId + ": " + e.toString();
            }
        }
        
        info "Price update completed. Updated: " + updateCount + ", Errors: " + errorCount;
        
        return {
            "success": true,
            "updated": updateCount,
            "errors": errorCount,
            "total": products.size()
        };
        
    } catch (e) {
        return {
            "success": false,
            "error": e.toString()
        };
    }
};
```

### Script 4: Real-time Price Calculation (Workflow Function)

```deluge
// ============================================
// WORKFLOW FUNCTION: Calculate Price on Quote/Order
// ============================================
// Trigger this when creating/updating Quotes or Orders

calculateOrderPrice = function(recordId, recordType) {
    try {
        // Get quote/order record
        orderRecord = zoho.crm.getRecordById(recordType, recordId);
        
        if(orderRecord.isEmpty()) {
            return {"error": "Record not found"};
        }
        
        // Get line items
        lineItems = orderRecord.get("Product_Details"); // Adjust field name
        
        if(lineItems == null || lineItems.size() == 0) {
            return {"error": "No products in order"};
        }
        
        customerId = orderRecord.get("Contact_Name").get("id");
        shippingAddress = orderRecord.get("Shipping_Address");
        shippingMethod = orderRecord.get("Shipping_Method");
        
        totalSubtotal = 0;
        totalTax = 0;
        totalShipping = 0;
        totalDiscount = 0;
        orderItems = list();
        
        // Calculate price for each line item
        for each item in lineItems {
            productId = item.get("Product").get("id");
            quantity = item.get("Quantity");
            
            // Calculate price for this item
            priceResult = calculateFinalPrice(
                productId,
                customerId,
                quantity,
                shippingAddress,
                shippingMethod
            );
            
            if(priceResult.get("success") == true) {
                priceBreakdown = priceResult.get("price_breakdown");
                
                itemSubtotal = priceBreakdown.get("subtotal");
                itemTax = priceBreakdown.get("tax_amount");
                itemShipping = priceBreakdown.get("shipping_cost");
                
                totalSubtotal = totalSubtotal + itemSubtotal;
                totalTax = totalTax + itemTax;
                totalShipping = totalShipping + itemShipping;
                
                // Update line item
                itemMap = map();
                itemMap.put("Unit_Price", priceBreakdown.get("final_unit_price"));
                itemMap.put("Subtotal", itemSubtotal);
                itemMap.put("Tax", itemTax);
                
                orderItems.add(itemMap);
            }
        }
        
        // Calculate final total
        finalTotal = totalSubtotal + totalTax + totalShipping - totalDiscount;
        finalTotal = round(finalTotal, 2);
        
        // Update order/quote record
        updateData = map();
        updateData.put("Subtotal", totalSubtotal);
        updateData.put("Tax", totalTax);
        updateData.put("Shipping", totalShipping);
        updateData.put("Discount", totalDiscount);
        updateData.put("Total", finalTotal);
        updateData.put("Price_Calculated_At", zoho.currenttime);
        
        updateResponse = zoho.crm.updateRecord(recordType, recordId, updateData);
        
        return {
            "success": true,
            "subtotal": totalSubtotal,
            "tax": totalTax,
            "shipping": totalShipping,
            "discount": totalDiscount,
            "total": finalTotal
        };
        
    } catch (e) {
        return {
            "success": false,
            "error": e.toString()
        };
    }
};
```

---

## TESTING & VALIDATION

### Test Cases

```deluge
// ============================================
// TEST FUNCTION: Validate Price Calculation
// ============================================
testPriceCalculation = function() {
    testResults = list();
    
    // Test Case 1: Basic price calculation
    result1 = calculateFinalPrice("PRODUCT_ID_1", null, 1, "", "Standard");
    testResults.add({
        "test": "Basic Price Calculation",
        "result": result1.get("success"),
        "final_price": result1.get("final_price")
    });
    
    // Test Case 2: Price with discount
    result2 = calculateFinalPrice("PRODUCT_ID_WITH_DISCOUNT", null, 1, "", "Standard");
    testResults.add({
        "test": "Price with Discount",
        "result": result2.get("success"),
        "final_price": result2.get("final_price")
    });
    
    // Test Case 3: Bulk quantity discount
    result3 = calculateFinalPrice("PRODUCT_ID_1", null, 50, "", "Standard");
    testResults.add({
        "test": "Bulk Quantity Discount",
        "result": result3.get("success"),
        "final_price": result3.get("final_price")
    });
    
    // Test Case 4: With customer-specific pricing
    result4 = calculateFinalPrice("PRODUCT_ID_1", "CUSTOMER_ID_1", 1, "", "Standard");
    testResults.add({
        "test": "Customer-Specific Pricing",
        "result": result4.get("success"),
        "final_price": result4.get("final_price")
    });
    
    return testResults;
};
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Create custom fields in Products module:
  - [ ] Final_Price (Currency)
  - [ ] Calculated_Price (Currency)
  - [ ] Last_Price_Update (Date/Time)
  - [ ] Price_Calculation_Log (Long Text)

- [ ] Create/Configure modules:
  - [ ] Discounts module (if not exists)
  - [ ] Promotions module (if not exists)
  - [ ] Shipping Rules module (if not exists)
  - [ ] Taxes module (if not exists)

- [ ] Set up workflows:
  - [ ] On Product Update → Recalculate Price
  - [ ] On Discount Update → Recalculate All Prices
  - [ ] On Quote Create → Calculate Order Price
  - [ ] On Order Create → Calculate Order Price

- [ ] Set up scheduled functions:
  - [ ] Daily Price Update (runs at 2 AM)
  - [ ] Weekly Price Audit

- [ ] Test all scenarios:
  - [ ] Basic price calculation
  - [ ] Discount application
  - [ ] Tax calculation
  - [ ] Shipping calculation
  - [ ] Customer-specific pricing
  - [ ] Bulk discounts

- [ ] Document field mappings:
  - [ ] Map your Zoho field names to script variables
  - [ ] Update all field references in scripts

---

## FIELD MAPPING REFERENCE

Update these field names based on your Zoho setup:

```deluge
// Products Module Fields
"Unit_Price" → Your actual field name
"Cost_Price" → Your actual field name
"List_Price" → Your actual field name
"Product_Category" → Your actual field name
"Brand" → Your actual field name
"Discount_Percentage" → Your actual field name
"Tax_Category" → Your actual field name
"Quantity_in_Stock" → Your actual field name
"Product_Status" → Your actual field name

// Contacts Module Fields
"Customer_Segment" → Your actual field name
"Price_List" → Your actual field name
"Mailing_State" → Your actual field name

// Discounts Module Fields
"Discount_Percentage" → Your actual field name
"Valid_From" → Your actual field name
"Valid_To" → Your actual field name
"Active" → Your actual field name
"Category" → Your actual field name
"Customer_Segment" → Your actual field name
```

---

## NOTES & BEST PRACTICES

1. **API Limits**: Add delays between API calls to avoid hitting Zoho API limits
2. **Error Handling**: Always wrap API calls in try-catch blocks
3. **Logging**: Use `info` statements for debugging
4. **Caching**: Consider caching frequently accessed data
5. **Validation**: Validate all inputs before calculations
6. **Rounding**: Always round final prices to 2 decimal places
7. **Audit Trail**: Store calculation details for troubleshooting
8. **Testing**: Test thoroughly in sandbox before production

---

**This guide provides a complete foundation for implementing price tracking in Zoho. Customize the field names and business logic based on your specific Zoho setup and requirements.**

